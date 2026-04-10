self.onInit = async function () {
  const currentUser = self.ctx.currentUser;
  const currentUserId = currentUser.userId;
  const currentCustomerId =
    currentUser?.customerId?.id ||
    currentUser?.customerId ||
    currentUser?.id ||
    null;
  console.log('customer', self.ctx.currentUser);
  const currentAuthority = currentUser.authority;
  const http = self.ctx.http;

  const assetUrl =
    currentAuthority === "TENANT_ADMIN"
      ? `/api/tenant/assets?pageSize=1000&page=0`
      : currentCustomerId
        ? `/api/customer/${currentCustomerId}/assetInfos?pageSize=1000&page=0&includeCustomers=true`
        : null;

  /* ============================== SAFE ROOT ============================== */
  const ROOT = window.top || window.parent || window;
  if (!ROOT._TB_SHARED) ROOT._TB_SHARED = {};
  const SHARED = ROOT._TB_SHARED;
  const GLOBAL_HUB_EVENT = "dh17:hubUpdated";

  /* =============================== CONFIG ================================ */
  const CONFIG = {
    MAX_LIMIT: 10000,             // ⚡ reduced from 50k — 6h chunks rarely exceed this
    RAW_WINDOW_MS: 24 * 60 * 60 * 1000,
    RAW_KEEP_MS: 24 * 60 * 60 * 1000,
    REFRESH_MS: 90 * 1000,        // ⚡ 90s — segment logic has 50s min, 30s was redundant
    MIN_SEG_MS: 50 * 1000,
    CHUNK_MS: 6 * 60 * 60 * 1000, // ⚡ NEW: 6-hour chunks for telemetry fetches

    /* ── Concurrency / resilience tunables ── */
    ASSET_CONCURRENCY: 4,         // ⚡ bumped from 2
    DEVICE_CONCURRENCY: 5,        // ⚡ bumped from 3
    GLOBAL_MAX_INFLIGHT: 10,      // ⚡ NEW: hard cap on simultaneous telemetry requests
    HTTP_TIMEOUT_MS: 45000,
    RETRY_COUNT: 2,
    RETRY_BASE_MS: 1500,
    VISIBILITY_RESUME_MS: 2000,   // ⚡ simple 2s wait replaces 30s waitForTBReady
  };

  const TELEMETRY_KEYS = ["num_of_targets", "State", "zone", "ED_tier"];
  const TELEMETRY_KEYS_CSV = TELEMETRY_KEYS.join(","); // ⚡ pre-joined

  const ATTRIBUTE_KEYS = [
    "active", "lastActivityTime", "lastConnectTime", "lastDisconnectTime",
  ];
  const ATTRIBUTE_KEYS_CSV = ATTRIBUTE_KEYS.join(","); // ⚡ pre-joined

  const MS_DAY = 24 * 60 * 60 * 1000;
  const now = () => Date.now();

  /* ============================== TIME WINDOW ============================== */
  function startOfDayInTz(ts, tzIana) {
    try {
      const dateStr = new Date(ts).toLocaleDateString("en-CA", { timeZone: tzIana });
      const utcMidnight = new Date(dateStr + "T00:00:00Z").getTime();
      const offsetMs =
        new Date(new Date(utcMidnight).toLocaleString("en-US", { timeZone: tzIana })).getTime() -
        new Date(new Date(utcMidnight).toLocaleString("en-US", { timeZone: "UTC" })).getTime();
      return utcMidnight - offsetMs;
    } catch (_) {
      const d = new Date(ts);
      d.setUTCHours(0, 0, 0, 0);
      return d.getTime();
    }
  }

  function hubWindow(tzIana = "Etc/UTC") {
    const endTs = now();
    const startTs = startOfDayInTz(endTs, tzIana) - MS_DAY;
    return { startTs, endTs };
  }

  /* ================================ STATE ================================ */
  let isDestroyed = false;
  let selectedAssetIds = new Set();
  let refreshTimer = null;
  let refreshInFlight = false;
  let refreshQueued = false;
  let queuedRefreshOptions = null;
  let nextRefreshAt = 0;
  let lastVisibleAt = Date.now();
  let isPaused = false;
  const FREEZE_MODE = "shallow";
  const INCREMENTAL_OVERLAP_MS = 90 * 1000;

  /* ================================ CACHE ================================ */
  const REL_CACHE = {};
  const SERIES_CURSOR = Object.create(null);
  const TZ_CACHE = {};
  const ASSET_META_CACHE = {};   // ⚡ NEW
  const DEVICE_META_CACHE = {};  // ⚡ NEW

  /* =========================================================================
     ⚡ NEW: GLOBAL SEMAPHORE — caps total in-flight telemetry requests
  ============================================================================ */
  function createSemaphore(max) {
    let running = 0;
    const queue = [];
    return {
      get running() { return running; },
      async acquire() {
        if (running < max) { running++; return; }
        await new Promise((resolve) => queue.push(resolve));
        running++;
      },
      release() {
        running--;
        if (queue.length > 0) queue.shift()();
      },
    };
  }

  const globalSemaphore = createSemaphore(CONFIG.GLOBAL_MAX_INFLIGHT);

  /* ================================ UTILS ================================ */
  async function mapLimit(items, limit, worker) {
    const out = new Array(items.length);
    let next = 0;
    async function run() {
      while (true) {
        const i = next++;
        if (i >= items.length) break;
        out[i] = await worker(items[i], i);
      }
    }
    await Promise.all(
      Array.from({ length: Math.min(limit, items.length) }, () => run()),
    );
    return out;
  }

  function debounce(fn, wait = 180) {
    let t = null;
    return (...args) => {
      if (t) clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  const fmtCountdown = (ms) => {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  };

  const pruneRawToStart = (data, startTs) =>
    data.filter((p) => p.ts >= startTs);

  /* =========================================================================
     ⚡ RESILIENT HTTP — timeout + retry with exponential backoff
     Replaces safeHttpGet + breathe() pattern entirely.
  ============================================================================ */
  async function httpGetWithRetry(url, opts = {}) {
    const timeout = opts.timeout || CONFIG.HTTP_TIMEOUT_MS;
    const maxRetries = opts.retries ?? CONFIG.RETRY_COUNT;
    let lastErr;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      if (isDestroyed || isPaused) throw new Error('[DH17] Aborted — widget destroyed or paused');

      if (attempt > 0) {
        const delay = CONFIG.RETRY_BASE_MS * Math.pow(2, attempt - 1);
        const jitter = Math.random() * delay * 0.3;
        await new Promise((r) => setTimeout(r, delay + jitter));
        console.warn(`[DH17] Retry ${attempt}/${maxRetries} for ${url.slice(0, 80)}…`);
      }

      try {
        const data = await http.get(url, { timeout }).toPromise();
        return data;
      } catch (err) {
        lastErr = err;
        const status = err?.status || err?.response?.status;
        if (status && status >= 400 && status < 500) throw err;
      }
    }
    throw lastErr;
  }

  /* =========================================================================
     ⚡ SEMAPHORE-GATED TELEMETRY FETCH
  ============================================================================ */
  async function fetchTelemetryChunkGated(devId, keysCsv, startTs, endTs) {
    const url =
      `/api/plugins/telemetry/DEVICE/${devId}/values/timeseries` +
      `?keys=${keysCsv}&startTs=${startTs}&endTs=${endTs}&limit=${CONFIG.MAX_LIMIT}&orderBy=ASC`;

    await globalSemaphore.acquire();
    try {
      return await httpGetWithRetry(url);
    } finally {
      globalSemaphore.release();
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────
     ⚡ BATCH ALL KEYS + PARALLEL CHUNKS (with global concurrency gate)
     Fetches all 4 keys in a single request per chunk; chunks run in parallel
     throttled by the semaphore. Falls back to per-key on failure.
  ───────────────────────────────────────────────────────────────────────────── */
  async function fetchAllKeysBatched(devId, keys, queryStartTs, endTs) {
    const chunkBounds = [];
    let cursor = queryStartTs;
    while (cursor < endTs) {
      const chunkEnd = Math.min(cursor + CONFIG.CHUNK_MS, endTs);
      chunkBounds.push({ start: cursor, end: chunkEnd });
      cursor = chunkEnd;
    }

    const keysCsv = keys.join(",");
    const merged = {};
    for (const key of keys) merged[key] = [];

    // ⚡ Parallel chunks — semaphore caps total in-flight
    const chunkResults = await Promise.all(
      chunkBounds.map(async ({ start, end }) => {
        try {
          return { ok: true, data: await fetchTelemetryChunkGated(devId, keysCsv, start, end) };
        } catch (batchErr) {
          console.warn(`[DH17] Batch failed for ${devId} chunk ${start}-${end}, trying per-key`, batchErr);
          const fallback = {};
          for (const key of keys) {
            try {
              const d = await fetchTelemetryChunkGated(devId, key, start, end);
              fallback[key] = d[key] || [];
            } catch (keyErr) {
              console.warn(`[DH17] Key ${key} also failed for ${devId}, skipping`, keyErr);
              fallback[key] = [];
            }
          }
          return { ok: true, data: fallback };
        }
      }),
    );

    for (const result of chunkResults) {
      if (!result.ok) continue;
      for (const key of keys) {
        const points = (result.data[key] || []).map((p) => ({
          ts: +p.ts,
          v: key === "num_of_targets" ? +p.value : p.value,
        }));
        if (points.length) merged[key] = mergeSeriesByTs(merged[key], points);
      }
    }

    return merged;
  }

  const seriesCursorKey = (assetId, devId, key) => `${assetId}|${devId}|${key}`;

  function clearSeriesCursor() {
    for (const k of Object.keys(SERIES_CURSOR)) delete SERIES_CURSOR[k];
    for (const k of Object.keys(TZ_CACHE)) delete TZ_CACHE[k];
  }

  function getIncrementalStartTs(assetId, devId, key, fullStartTs) {
    const cursor = SERIES_CURSOR[seriesCursorKey(assetId, devId, key)];
    if (cursor == null) return fullStartTs;
    return Math.max(fullStartTs, cursor - INCREMENTAL_OVERLAP_MS);
  }

  function mergeSeriesByTs(existing, incoming) {
    if (!existing.length) return incoming;
    if (!incoming.length) return existing;
    const out = [];
    let i = 0, j = 0;
    while (i < existing.length && j < incoming.length) {
      const a = existing[i], b = incoming[j];
      if (a.ts < b.ts) out.push(existing[i++]);
      else if (a.ts > b.ts) out.push(incoming[j++]);
      else { out.push(b); i++; j++; }
    }
    while (i < existing.length) out.push(existing[i++]);
    while (j < incoming.length) out.push(incoming[j++]);
    return out;
  }

  function trimSeriesToRetention(series, endTs) {
    if (!series.length) return series;
    const cutoff = endTs - CONFIG.RAW_KEEP_MS;
    let idx = 0;
    while (idx < series.length && series[idx].ts < cutoff) idx++;
    return idx ? series.slice(idx) : series;
  }

  const fmtDur = (ms) => {
    const m = Math.max(0, Math.floor(ms / 60000));
    const h = Math.floor(m / 60);
    return h ? `${h}h ${m % 60}m` : `${m}m`;
  };

  function deepFreeze(obj, seen = new WeakSet()) {
    if (!obj || typeof obj !== "object" || seen.has(obj)) return obj;
    seen.add(obj);
    Object.freeze(obj);
    for (const v of Object.values(obj)) deepFreeze(v, seen);
    return obj;
  }

  function freezeHubPayload(hub) {
    if (FREEZE_MODE === "off") return hub;
    if (FREEZE_MODE === "deep-debug") return deepFreeze(hub);
    if (hub.hubMeta && typeof hub.hubMeta === "object") Object.freeze(hub.hubMeta);
    return Object.freeze(hub);
  }

  function escHtml(s) {
    return String(s ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  }

  /* ===================== WIDGET-SCOPED EVENT CHANNEL ===================== */
  const WIDGET_UID =
    (self.ctx?.widget?.id != null ? String(self.ctx.widget.id) : "") ||
    (self.ctx?.widgetId != null ? String(self.ctx.widgetId) : "") ||
    (self.ctx?.id != null ? String(self.ctx.id) : "") ||
    Math.random().toString(36).slice(2);

  const HUB_EVENT = `dh17:hubUpdated:${WIDGET_UID}`;

  function emitHubUpdated(reason) {
    const payload = { reason, at: now() };
    try { window.dispatchEvent(new CustomEvent(HUB_EVENT, { detail: payload })); } catch (e) {}
    try { window.dispatchEvent(new CustomEvent(GLOBAL_HUB_EVENT, { detail: payload })); } catch (e) {}
    try { ROOT.dispatchEvent(new CustomEvent(HUB_EVENT, { detail: payload })); } catch (e) {}
    try { ROOT.dispatchEvent(new CustomEvent(GLOBAL_HUB_EVENT, { detail: payload })); } catch (e) {}
  }

  /* ================================ CSS ================================ */
  const style = document.createElement("style");
  style.innerHTML = `
:root {
  --dh16-ease-ui: cubic-bezier(0.2, 0, 0, 1);
  --dh16-dur-fast: 120ms;
  --dh16-dur-med: 220ms;
}
.dh16-root {
  font-family: Monospace;
  border-radius: 14px;
  box-sizing: border-box;
  height: 100%;
  display:none;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
  color: #2d5766;
  letter-spacing: 0.1px;
}
.dh16-root-hidden { display:none; }
.dh16-root > * + * { margin-top: 8px; }
.dh16-header {
  display: flex; align-items: center; gap: 10px;
  padding-bottom: 8px; border-bottom: 1px solid rgba(0,0,0,0.06);
}
.dh16-title { font-size: 15px; font-weight: 700; color: #1f3f4a; }
.dh16-title::before {
  content: ""; display: inline-block; width: 10px; height: 10px;
  background: #7aa37a; border-radius: 50%; margin-right: 8px; transform: translateY(-1px);
}
.asset-selection-div { display: flex; gap: 12px; align-items: flex-start; }
.dh16-selector-card {
  flex: 1 1 auto; min-width: 0; background: #f4f6f1;
  border: 1px solid #cbd4cb; border-radius: 8px; padding: 10px;
}
.dh16-selector-card-hidden { display: none; }
.dh16-selector-top {
  display: flex; align-items: center; justify-content: space-between;
  gap: 10px; margin-bottom: 8px;
}
.dh16-selector-title { font-size: 12px; font-weight: 700; color: #2d5766; }
.dh16-selector-count { font-size: 11px; color: #6b7c85; }
.dh16-checkbox-group {
  max-height: 220px; overflow-y: auto; overflow-x: hidden;
  padding-right: 4px; display: flex; flex-direction: column; gap: 6px;
}
.dh16-checkbox-row {
  display: flex; align-items: center; gap: 8px; padding: 6px 8px;
  border-radius: 6px; background: rgba(255,255,255,0.72);
  border: 1px solid rgba(0,0,0,0.05); cursor: pointer;
}
.dh16-checkbox-row:hover { background: #ffffff; }
.dh16-checkbox-row input { margin: 0; flex: 0 0 auto; }
.dh16-checkbox-label {
  min-width: 0; overflow: hidden; text-overflow: ellipsis;
  white-space: nowrap; font-size: 12px;
}
.dh16-load-btn {
  font-size: 11px; padding: 8px 10px; border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.12);
  background: linear-gradient(180deg, #f8faf6, #eef2ec);
  color: #2d5766; cursor: pointer; flex: 0 0 auto;
}
.dh16-load-btn:hover { background: #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
.dh16-load-btn-hidden { display: none; }
[refresh-in-flight] button { opacity: 0.8; }
.dh16-status {
  font-size: 11px; background: #eaf0ed;
  border: 1px solid rgba(0,0,0,0.06); border-radius: 4px; padding: 6px 10px;
}
.dh16-progress {
  display: none; padding: 8px 10px; background: #eef3ef;
  border-radius: 4px; border: 1px solid rgba(0,0,0,0.06);
}
.dh16-bar-bg { height: 6px; background: #dde5df; border-radius: 4px; overflow: hidden; }
.dh16-bar { height: 100%; width: 0%; background: linear-gradient(90deg,#7aa37a,#8fbf8f); }
`;
  document.head.appendChild(style);

  /* ================================ HTML ================================ */
  const container = self.ctx.$container[0];
  container.innerHTML = `
<div class="dh16-root" id="dh16-root">
  <div class="dh16-header"><div class="dh16-title">Data Hub</div></div>
  <div id="asset-selection-div" class="asset-selection-div">
    <div id="dh16-selector-card" class="dh16-selector-card">
      <div class="dh16-selector-top">
        <div class="dh16-selector-title">Assets</div>
        <div id="dh16-selector-count" class="dh16-selector-count">0 selected</div>
      </div>
      <div id="dh16-checkbox-group" class="dh16-checkbox-group"></div>
    </div>
    <button id="dh16-load-btn" class="dh16-load-btn">Load / Refresh</button>
  </div>
  <div id="dh16-status" class="dh16-status">Select assets to load data</div>
  <div id="dh16-progress" class="dh16-progress">
    <div id="dh16-progress-text"></div>
    <div class="dh16-bar-bg"><div id="dh16-progress-bar" class="dh16-bar"></div></div>
  </div>
  <div style="font-size:11px">Refresh in <span id="dh16-countdown">--:--</span></div>
</div>`;

  /* ================================ UI BINDS ================================ */
  const selectorCard = container.querySelector("#dh16-selector-card");
  const checkboxGroup = container.querySelector("#dh16-checkbox-group");
  const selectorCount = container.querySelector("#dh16-selector-count");
  const loadBtn = container.querySelector("#dh16-load-btn");
  const statusEl = container.querySelector("#dh16-status");
  const progressWrap = container.querySelector("#dh16-progress");
  const progressText = container.querySelector("#dh16-progress-text");
  const progressBar = container.querySelector("#dh16-progress-bar");
  const countdownEl = container.querySelector("#dh16-countdown");

  const userGroupName = await getUserGroupName(currentUserId);
  const canManageAssetSelection =
    currentAuthority === "TENANT_ADMIN" || userGroupName.includes("Customer Administrator");

  if (!canManageAssetSelection) {
    selectorCard.className = "dh16-selector-card-hidden";
    loadBtn.className = "dh16-load-btn-hidden";
  }

  function updateSelectionCount() {
    selectorCount.innerText = `${selectedAssetIds.size} selected`;
  }
  function showProgress(text, pct = 0) {
    progressWrap.style.display = "block";
    progressText.innerText = text;
    progressBar.style.width = pct + "%";
  }
  function hideProgress() {
    progressWrap.style.display = "none";
    progressBar.style.width = "0%";
  }
  function resetHubState() {
    selectedAssetIds.clear();
    refreshInFlight = false;
    refreshQueued = false;
    queuedRefreshOptions = null;
    nextRefreshAt = 0;
    clearSeriesCursor();
    updateSelectionCount();
    stopRefreshLoop();
  }

  /* ============================ SEGMENTS ============================ */
  /* ⚡ Rewritten: k-way merge via stream pointers instead of Set + sort */
  function buildHouseSegmentsFromStageAssets(stageAssets) {
    const streams = [];
    for (const asset of Object.values(stageAssets)) {
      for (const dev of Object.values(asset.devices || {})) {
        const dk = dev.dataKeys?.find((k) => k.name === "num_of_targets");
        if (dk?.data?.length) streams.push(dk.data);
      }
    }
    if (!streams.length) return [];

    const ptrs = new Int32Array(streams.length);
    const last = new Array(streams.length).fill(null);
    const transitions = [];
    let activeCount = 0, oneCount = 0, multiCount = 0;

    const removeValue = (v) => { if (v == null) return; activeCount--; if (v > 1) multiCount--; else if (v === 1) oneCount--; };
    const addValue    = (v) => { if (v == null) return; activeCount++; if (v > 1) multiCount++; else if (v === 1) oneCount++; };

    while (true) {
      let minTs = Infinity;
      for (let i = 0; i < streams.length; i++) {
        if (ptrs[i] < streams[i].length) {
          const t = streams[i][ptrs[i]].ts;
          if (t < minTs) minTs = t;
        }
      }
      if (minTs === Infinity) break;

      for (let i = 0; i < streams.length; i++) {
        const s = streams[i];
        while (ptrs[i] < s.length && s[ptrs[i]].ts <= minTs) {
          const prevVal = last[i];
          const nextVal = s[ptrs[i]].v;
          if (prevVal !== nextVal) {
            removeValue(prevVal);
            addValue(nextVal);
            last[i] = nextVal;
          }
          ptrs[i]++;
        }
      }

      if (!activeCount) continue;

      const state =
        multiCount > 0 || oneCount > 1
          ? "MULTIPLE PEOPLE DETECTED"
          : oneCount === 1
            ? "AT HOME"
            : "OUT OF HOME";
      const prev = transitions[transitions.length - 1];
      if (!prev || prev.state !== state) transitions.push({ ts: minTs, state });
    }

    if (!transitions.length) return [];

    const segs = [];
    let curState = transitions[0].state;
    let curStart = transitions[0].ts;

    for (let i = 1; i < transitions.length; i++) {
      const next = transitions[i];
      const dur = next.ts - curStart;
      if (dur >= CONFIG.MIN_SEG_MS) {
        segs.push({ state: curState, start: curStart, end: next.ts, dur });
        curState = next.state;
        curStart = next.ts;
      }
    }

    const endNow = now();
    const durNow = endNow - curStart;
    if (durNow > 0) segs.push({ state: curState, start: curStart, end: endNow, dur: durNow });

    const merged = [];
    for (const s of segs) {
      const prev = merged[merged.length - 1];
      if (prev && prev.state === s.state && prev.end === s.start) {
        prev.end = s.end;
        prev.dur = prev.end - prev.start;
      } else merged.push({ ...s });
    }
    return merged;
  }

  /* ================================ API ================================ */
  async function getUserGroupName(userId) {
    if (!userId) return "";
    const userInfo = await http.get(`/api/user/info/${userId}`).toPromise();
    const userGroup = userInfo.groups;
    if (!userGroup || userGroup.length === 0) return "";
    return userGroup[0].name || "";
  }

  async function getAssetRelationsCached(assetId) {
    if (REL_CACHE[assetId]) return REL_CACHE[assetId];
    const rel = await httpGetWithRetry(
      `/api/relations/info?fromId=${assetId}&fromType=ASSET`,
    );
    REL_CACHE[assetId] = rel;
    return rel;
  }

  /* ⚡ NEW: cached asset + device metadata */
  async function getAssetMetaCached(assetId) {
    if (ASSET_META_CACHE[assetId]) return ASSET_META_CACHE[assetId];
    const asset = await httpGetWithRetry(`/api/asset/${assetId}`);
    const meta = { name: asset.name, customerId: asset.customerId?.id || null };
    ASSET_META_CACHE[assetId] = meta;
    return meta;
  }

  async function getDeviceMetaCached(devId) {
    if (DEVICE_META_CACHE[devId]) return DEVICE_META_CACHE[devId];
    const dev = await httpGetWithRetry(`/api/device/${devId}`);
    const meta = { label: dev.label || dev.name };
    DEVICE_META_CACHE[devId] = meta;
    return meta;
  }

  async function getCustomerTimezone(customerId) {
    if (TZ_CACHE[customerId]) return TZ_CACHE[customerId];
    try {
      const resp = await httpGetWithRetry(
        `/api/plugins/telemetry/CUSTOMER/${customerId}/values/attributes/SERVER_SCOPE?keys=timezone`,
        { retries: 1 },
      );
      const tz =
        Array.isArray(resp) && resp.length > 0 && resp[0].value
          ? resp[0].value
          : "Etc/UTC";
      TZ_CACHE[customerId] = tz;
      return tz;
    } catch (_) {
      TZ_CACHE[customerId] = "Etc/UTC";
      return "Etc/UTC";
    }
  }

  /* ======================= TELEMETRY LOAD ========================== */
  async function loadTelemetry({ fullReload = false } = {}) {
    if (isDestroyed) return;
    if (!selectedAssetIds.size) { resetHubState(); return; }

    if (fullReload) {
      clearSeriesCursor();
      // ⚡ Invalidate meta caches on full reload
      for (const k of Object.keys(ASSET_META_CACHE)) delete ASSET_META_CACHE[k];
      for (const k of Object.keys(DEVICE_META_CACHE)) delete DEVICE_META_CACHE[k];
      for (const k of Object.keys(REL_CACHE)) delete REL_CACHE[k];
    }

    SHARED.DATAHUB_V17 = {
      ...(SHARED.DATAHUB_V17 || {}),
      hubMeta: { ...(SHARED.DATAHUB_V17?.hubMeta || {}), refreshing: true },
    };

    emitHubUpdated("refresh-start");
    statusEl.innerText = "Loading telemetry…";
    showProgress("Discovering devices…", 5);

    const stageAssets = {};
    const prevAssetObj = fullReload ? {} : SHARED.DATAHUB_V17?.sharedAssetObj || {};
    const assetIds = [...selectedAssetIds];
    let failedDevices = 0;

    /* ⚡ Parallel fetch of relations + asset meta */
    const [relByAsset, metaByAsset] = await Promise.all([
      Promise.all(assetIds.map(async (id) => [id, await getAssetRelationsCached(id)])).then(Object.fromEntries),
      Promise.all(assetIds.map(async (id) => [id, await getAssetMetaCached(id)])).then(Object.fromEntries),
    ]);

    let totalDevices = 0;
    for (const assetId of assetIds) {
      const rel = relByAsset[assetId] || [];
      for (const r of rel) if (r.to.entityType === "DEVICE") totalDevices++;
    }

    let done = 0;
    const updateProgress = () => {
      const pct = totalDevices ? Math.round((done / totalDevices) * 100) : 100;
      showProgress(
        `Loading devices ${done}/${totalDevices}` +
          (failedDevices ? ` (${failedDevices} partial)` : ""),
        Math.max(10, pct),
      );
    };

    await mapLimit(assetIds, CONFIG.ASSET_CONCURRENCY, async (assetId) => {
      if (isDestroyed || isPaused) return;
      const meta = metaByAsset[assetId];
      const customerId = meta.customerId;
      const tzIana = customerId ? await getCustomerTimezone(customerId) : "Etc/UTC";
      const { startTs, endTs } = hubWindow(tzIana);

      stageAssets[assetId] = {
        assetName: meta.name,
        customerId: customerId || null,
        timezone: tzIana,
        devices: {},
      };

      const deviceIds = (relByAsset[assetId] || [])
        .filter((r) => r.to.entityType === "DEVICE")
        .map((r) => r.to.id);

      await mapLimit(deviceIds, CONFIG.DEVICE_CONCURRENCY, async (devId) => {
        if (isDestroyed || isPaused) return;

        const prevDevice = prevAssetObj?.[assetId]?.devices?.[devId];
        const prevSeriesByKey = Object.fromEntries(
          (prevDevice?.dataKeys || []).map((k) => [k.name, k.data || []]),
        );

        // Compute earliest start across all keys for the batched call
        let batchQueryStart = startTs;
        if (!fullReload) {
          let earliest = endTs;
          for (const key of TELEMETRY_KEYS) {
            const qs = getIncrementalStartTs(assetId, devId, key, startTs);
            if (qs < earliest) earliest = qs;
          }
          batchQueryStart = earliest;
        }

        /* ⚡ Single parallel flight: device meta + attributes + batched telemetry */
        let devMeta, rawAttributes, batchedTelemetry;
        try {
          [devMeta, rawAttributes, batchedTelemetry] = await Promise.all([
            getDeviceMetaCached(devId),
            httpGetWithRetry(
              `/api/plugins/telemetry/DEVICE/${devId}/values/attributes/SERVER_SCOPE?keys=${ATTRIBUTE_KEYS_CSV}`,
              { retries: 1 },
            ),
            fetchAllKeysBatched(devId, TELEMETRY_KEYS, batchQueryStart, endTs),
          ]);
        } catch (err) {
          console.error(`[DH17] Device ${devId} failed entirely, skipping`, err);
          failedDevices++;
          done++;
          updateProgress();
          return;
        }

        const devObj = (stageAssets[assetId].devices[devId] = {
          label: devMeta.label,
          dataKeys: [],
        });

        devObj.connectionAttrs = Object.fromEntries(
          (rawAttributes || []).map((obj) => [
            obj.key,
            { lastUpdateTs: obj.lastUpdateTs, value: obj.value },
          ]),
        );

        // ⚡ Process each key from the batched result (no HTTP calls here)
        const keyData = TELEMETRY_KEYS.map((key) => {
          const existingSeries = prevSeriesByKey[key] || [];
          const incomingSeries = batchedTelemetry[key] || [];

          const mergedSeries = fullReload
            ? trimSeriesToRetention(pruneRawToStart(incomingSeries, startTs), endTs)
            : trimSeriesToRetention(mergeSeriesByTs(existingSeries, incomingSeries), endTs);

          if (!mergedSeries.length) return null;

          SERIES_CURSOR[seriesCursorKey(assetId, devId, key)] =
            mergedSeries[mergedSeries.length - 1].ts;

          return { name: key, data: mergedSeries };
        }).filter(Boolean);

        devObj.dataKeys = keyData;
        done++;
        updateProgress();
      });
    });

    const hasTargets = (() => {
      for (const a of Object.values(stageAssets)) {
        for (const d of Object.values(a.devices || {})) {
          const dk = d.dataKeys?.find((k) => k.name === "num_of_targets");
          if (dk?.data?.length) return true;
        }
      }
      return false;
    })();

    const stageSegments = { house: [] };
    if (hasTargets) stageSegments.house = buildHouseSegmentsFromStageAssets(stageAssets);

    /* ⚡ Single freeze call instead of two */
    SHARED.DATAHUB_V17 = freezeHubPayload({
      sharedAssetObj: stageAssets,
      segments: stageSegments,
      hubMeta: {
        loadedAt: now(),
        refreshAt: now() + CONFIG.REFRESH_MS,
        rule: "HOUSE_SNAPSHOT_V1",
        version: "1.7",
        refreshing: false,
        failedDevices,
      },
    });

    emitHubUpdated("refresh-end");
    hideProgress();

    if (failedDevices) {
      statusEl.innerText = `Loaded with ${failedDevices} device(s) partially failed — will retry on next refresh`;
    } else {
      statusEl.innerText = hasTargets ? "Up to date" : "No num_of_targets data in this window";
    }
    nextRefreshAt = SHARED.DATAHUB_V17.hubMeta.refreshAt;
    emitHubUpdated("loadTelemetry");
  }

  function stopRefreshLoop() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = null;
    refreshQueued = false;
    queuedRefreshOptions = null;
  }

  function scheduleNextRefresh(delayMs = CONFIG.REFRESH_MS) {
    if (isDestroyed) return;
    if (!selectedAssetIds.size) return;
    if (isPaused) return;
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      refreshTimer = null;
      if (isPaused || isDestroyed) return;
      void runRefreshCycle("timer", { fullReload: false });
    }, delayMs);
  }

  async function runRefreshCycle(reason = "manual", options = {}) {
    if (isDestroyed) return;
    const refreshOptions = { fullReload: false, ...options };
    if (!selectedAssetIds.size) { resetHubState(); return; }
    if (isPaused && reason !== "visibility-resume") {
      console.log('[DH17] Blocked refresh while paused:', reason);
      return;
    }
    if (refreshInFlight) {
      refreshQueued = true;
      queuedRefreshOptions = refreshOptions;
      return;
    }
    refreshInFlight = true;
    try {
      await loadTelemetry(refreshOptions);
    } catch (err) {
      console.error('[DH17] Refresh cycle failed:', err);
      statusEl.innerText = 'Refresh failed — retrying…';
      hideProgress();
    } finally {
      if (isDestroyed) return;
      refreshInFlight = false;
      if (!selectedAssetIds.size) return;
      if (isPaused) return;
      if (refreshQueued) {
        const next = queuedRefreshOptions || { fullReload: false };
        refreshQueued = false;
        queuedRefreshOptions = null;
        void runRefreshCycle("queued", next);
        return;
      }
      scheduleNextRefresh();
      loadBtn.removeAttribute('refresh-in-flight');
    }
  }

  /* =========================== COUNTDOWN =========================== */
  const countdownTimer = setInterval(() => {
    if (!nextRefreshAt) return;
    countdownEl.innerText = fmtCountdown(nextRefreshAt - now());
  }, 1000);

  /* =========================================================================
     ⚡ SIMPLIFIED VISIBILITY RESUME
     Replaces the 3-step breathe/waitForTBReady/probe pattern with a simple
     fixed 2s wait then let httpGetWithRetry handle any failures.
  ============================================================================ */
  const handleVisibilityChange = () => {
    if (document.visibilityState !== 'visible') {
      console.log('[DH17] App hidden — pausing');
      isPaused = true;
      stopRefreshLoop();
      refreshQueued = false;
      queuedRefreshOptions = null;
      lastVisibleAt = Date.now();
      return;
    }

    const hiddenMs = Date.now() - lastVisibleAt;
    console.log(`[DH17] App resumed after ${Math.round(hiddenMs / 1000)}s`);

    if (!selectedAssetIds.size) {
      isPaused = false;
      lastVisibleAt = Date.now();
      return;
    }

    // ⚡ Simple fixed wait, then resume — httpGetWithRetry handles failures
    setTimeout(() => {
      if (isDestroyed) return;
      if (document.visibilityState !== 'visible') {
        console.log('[DH17] App went back to sleep during wait, staying paused');
        return;
      }
      isPaused = false;
      lastVisibleAt = Date.now();
      console.log('[DH17] Resuming refresh cycle');
      void runRefreshCycle('visibility-resume', { fullReload: false });
    }, CONFIG.VISIBILITY_RESUME_MS);
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  const handleFreeze = () => {
    console.log('[DH17] Page freeze — pausing');
    isPaused = true;
    stopRefreshLoop();
    refreshQueued = false;
    queuedRefreshOptions = null;
  };
  const handleResume = () => {
    console.log('[DH17] Page resume event');
  };

  document.addEventListener('freeze', handleFreeze);
  document.addEventListener('resume', handleResume);

  const watchdogInterval = setInterval(() => {
    if (isPaused || isDestroyed) return;
    if (document.visibilityState !== 'visible') return;
    if (!selectedAssetIds.size) return;
    if (refreshInFlight) return;
    const overdue = nextRefreshAt && (Date.now() - nextRefreshAt > CONFIG.REFRESH_MS * 5);
    const noTimer = !refreshTimer;
    if (overdue || noTimer) {
      console.warn('[DH17] Watchdog: restarting dead refresh loop');
      stopRefreshLoop();
      void runRefreshCycle('watchdog', { fullReload: false });
    }
  }, 30 * 1000);

  /* =========================================================================
     RAW DEBUG MODAL
  ============================================================================ */
  const modal = document.createElement("div");
  modal.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.35);display:none;align-items:center;justify-content:center;z-index:9999;`;
  modal.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

  const modalCard = document.createElement("div");
  modalCard.style.cssText = `width:980px;max-width:calc(100vw - 40px);max-height:86vh;background:#f3f5ef;border-radius:14px;overflow:hidden;box-shadow:0 10px 32px rgba(0,0,0,0.28);display:flex;flex-direction:column;`;
  modal.appendChild(modalCard);
  document.body.appendChild(modal);

  function getAssetsList() {
    const obj = SHARED.DATAHUB_V17?.sharedAssetObj || {};
    return Object.entries(obj).map(([assetId, a]) => ({ assetId, assetName: a.assetName || assetId }));
  }
  function getDeviceList(assetId) {
    const devs = SHARED.DATAHUB_V17?.sharedAssetObj?.[assetId]?.devices || {};
    return Object.entries(devs).map(([deviceId, d]) => ({ deviceId, label: d.label || deviceId, dataKeys: d.dataKeys || [] }));
  }
  function getKeySeries(assetId, deviceId, keyName) {
    const dev = SHARED.DATAHUB_V17?.sharedAssetObj?.[assetId]?.devices?.[deviceId];
    const dk = dev?.dataKeys?.find((k) => k.name === keyName);
    return dk?.data || [];
  }
  function fmtTs(ts) { if (!ts) return "—"; return new Date(ts).toLocaleString(); }
  function deviceContribMap(assetId) {
    const devs = SHARED.DATAHUB_V17?.sharedAssetObj?.[assetId]?.devices || {};
    const out = [];
    for (const [devId, d] of Object.entries(devs)) {
      const nt = (d.dataKeys || []).find((k) => k.name === "num_of_targets");
      out.push({ devId, label: d.label || devId, contributing: !!(nt?.data?.length) });
    }
    return out.sort((a, b) => b.contributing - a.contributing || a.label.localeCompare(b.label));
  }

  let modalBound = false;
  let modalHubListener = null;

  function renderRawModal() {
    const assets = getAssetsList();
    let currentPage = 0, pageSize = 200;
    let seriesCacheKey = "", sortedSeriesCache = [], filterCacheKey = "", filteredSeriesCache = [];

    modalCard.innerHTML = `
      <div style="background:linear-gradient(180deg,#2f5f6f,#2a5564);color:#fff;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;">
        <div>
          <div style="font-weight:700;font-size:14px;letter-spacing:.2px">Raw Telemetry Debug</div>
          <div style="font-size:11px;opacity:.9">Inspect hub-loaded points (no refetch)</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button id="raw-copy" style="font-size:11px;padding:6px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.15);color:#fff;cursor:pointer">Copy JSON</button>
          <button id="raw-close" style="width:30px;height:30px;border-radius:10px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.15);color:#fff;font-size:14px;cursor:pointer">✕</button>
        </div>
      </div>
      <div style="display:flex;gap:14px;padding:14px;flex:1;min-height:0">
        <div style="width:320px;background:#f8f9f4;border-radius:14px;border:1px solid rgba(0,0,0,.08);padding:14px;display:flex;flex-direction:column;gap:12px;">
          <div style="font-weight:700;color:#2d5766">Selection</div>
          <div style="background:#fff;border-radius:12px;padding:10px;border:1px solid rgba(0,0,0,.06);display:flex;flex-direction:column;gap:8px;">
            <select id="raw-asset" style="height:30px;font-size:12px;font-weight:600;padding:4px 28px 4px 8px;border-radius:4px;border:1px solid rgba(0,0,0,.18);background:#fff;color:#2d5766"></select>
            <select id="raw-device" style="height:30px;font-size:12px;font-weight:600;padding:4px 28px 4px 8px;border-radius:4px;border:1px solid rgba(0,0,0,.18);background:#fff;color:#2d5766"></select>
            <select id="raw-key" style="height:30px;font-size:12px;padding:4px 28px 4px 8px;font-weight:600;border-radius:4px;border:1px solid rgba(0,0,0,.18);background:#fff;color:#2d5766"></select>
          </div>
          <input id="raw-filter" placeholder="Filter values…" style="padding:8px;border-radius:10px;border:1px solid #cbd4cb"/>
          <div id="raw-stats" style="background:#e9eeea;border-radius:12px;padding:10px;border:1px solid rgba(0,0,0,.08);font-size:11px;line-height:1.4;color:#2d5766"></div>
          <div id="raw-contrib" style="background:#f1f4ee;border-radius:12px;padding:10px;border:1px solid rgba(0,0,0,.08);font-size:11px;line-height:1.4;color:#2d5766"></div>
        </div>
        <div style="flex:1;background:#f8f9f4;border-radius:14px;border:1px solid rgba(0,0,0,.08);overflow:hidden;display:flex;flex-direction:column;">
          <div style="padding:10px;border-bottom:1px solid rgba(0,0,0,.06);display:flex;justify-content:space-between;align-items:center">
            <div style="font-weight:700;color:#2d5766">Points</div>
            <div style="display:flex;align-items:center;gap:6px;padding:4px;border-radius:10px;background:#edf1ea;border:1px solid rgba(0,0,0,.12);">
              <button id="raw-prev" style="width:26px;height:26px;border-radius:6px;border:1px solid rgba(0,0,0,.25);background:#fff;color:#2d5766;cursor:pointer;">◀</button>
              <span id="raw-page-info" style="font-size:11px;min-width:90px;text-align:center;color:#365f6a;">0</span>
              <button id="raw-next" style="width:26px;height:26px;border-radius:6px;border:1px solid rgba(0,0,0,.25);background:#fff;color:#2d5766;cursor:pointer;">▶</button>
              <select id="raw-page-size" style="height:26px;font-size:11px;padding:2px 22px 2px 6px;border-radius:6px;border:1px solid rgba(0,0,0,.18);background:#f1f4ee;color:#2d5766;">
                <option>100</option><option selected>200</option><option>500</option><option>1000</option>
              </select>
            </div>
          </div>
          <div style="overflow:auto;flex:1">
            <table style="width:100%;border-collapse:collapse;font-size:11px">
              <thead><tr style="position:sticky;top:0;background:#eef1ea">
                <th style="padding:8px;text-align:left">Timestamp</th>
                <th style="padding:8px;text-align:left">ts</th>
                <th style="padding:8px;text-align:left">value</th>
              </tr></thead>
              <tbody id="raw-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>`;

    const closeBtn = modalCard.querySelector("#raw-close");
    const copyBtn = modalCard.querySelector("#raw-copy");
    const selAsset = modalCard.querySelector("#raw-asset");
    const selDev = modalCard.querySelector("#raw-device");
    const selKey = modalCard.querySelector("#raw-key");
    const filterEl = modalCard.querySelector("#raw-filter");
    const statsEl = modalCard.querySelector("#raw-stats");
    const contribEl = modalCard.querySelector("#raw-contrib");
    const tbody = modalCard.querySelector("#raw-tbody");
    const prevBtn = modalCard.querySelector("#raw-prev");
    const nextBtn = modalCard.querySelector("#raw-next");
    const pageInfo = modalCard.querySelector("#raw-page-info");
    const pageSel = modalCard.querySelector("#raw-page-size");

    closeBtn.onclick = () => { modal.style.display = "none"; };

    function showToast(title, subtitle = "", ms = 2200) {
      const t = document.createElement("div");
      t.style.cssText = `position:fixed;right:16px;bottom:16px;background:#2d5766;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 6px 18px rgba(0,0,0,0.25);font-family:Arial;font-size:12px;z-index:10000;opacity:0;transform:translateY(6px);transition:opacity .2s ease, transform .2s ease;`;
      t.innerHTML = `<div style="font-weight:700">${escHtml(title)}</div>${subtitle ? `<div style="opacity:.85;margin-top:2px">${escHtml(subtitle)}</div>` : ""}`;
      document.body.appendChild(t);
      requestAnimationFrame(() => { t.style.opacity = "1"; t.style.transform = "translateY(0)"; });
      setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateY(6px)"; setTimeout(() => t.remove(), 250); }, ms);
    }
    function fallbackCopy(text) {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Widget snapshot copied", "sharedAssetObj · segments · hubMeta");
    }
    copyBtn.onclick = () => {
      try {
        const snapshot = {
          __type: "TB_WIDGET_SNAPSHOT", __version: "DataHub V1.7.1",
          __copiedAt: new Date().toISOString(),
          sharedAssetObj: SHARED.DATAHUB_V17?.sharedAssetObj,
          segments: SHARED.DATAHUB_V17?.segments,
          hubMeta: SHARED.DATAHUB_V17?.hubMeta,
        };
        const json = JSON.stringify(snapshot, null, 2);
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(json)
            .then(() => showToast("Widget snapshot copied", "sharedAssetObj · segments · hubMeta"))
            .catch(() => fallbackCopy(json));
        } else fallbackCopy(json);
      } catch (e) { alert("Copy failed"); }
    };

    function setEmptyModalUI(msg) {
      selAsset.innerHTML = `<option value="" disabled selected>No assets</option>`;
      selDev.innerHTML = `<option value="" disabled selected>—</option>`;
      selKey.innerHTML = `<option value="" disabled selected>—</option>`;
      statsEl.innerHTML = `<b>Status</b><br/>${escHtml(msg || "No data")}`;
      contribEl.innerHTML = `<b>Contributors</b><br/>—`;
      tbody.innerHTML = ""; pageInfo.textContent = "0";
      selAsset.disabled = selDev.disabled = selKey.disabled = filterEl.disabled = true;
      prevBtn.disabled = nextBtn.disabled = pageSel.disabled = true;
    }
    function setActiveModalUI() {
      selAsset.disabled = selDev.disabled = selKey.disabled = filterEl.disabled = false;
      prevBtn.disabled = nextBtn.disabled = pageSel.disabled = false;
    }
    function renderContribution() {
      const list = deviceContribMap(selAsset.value);
      if (!list.length) { contribEl.innerHTML = `<b>Contributors</b><br/>—`; return; }
      contribEl.innerHTML = `<b>Contributors</b><br/><div style="margin-top:6px;display:flex;flex-direction:column;gap:4px">${list.map((d) => `<div style="display:flex;align-items:center;gap:8px"><span style="width:10px;height:10px;border-radius:50%;background:${d.contributing ? "#7aa37a" : "rgba(0,0,0,.18)"};display:inline-block"></span><span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escHtml(d.label)}</span><span style="opacity:.7">${d.contributing ? "contributing" : "silent"}</span></div>`).join("")}</div>`;
    }
    function syncKeys() {
      const dev = SHARED.DATAHUB_V17?.sharedAssetObj?.[selAsset.value]?.devices?.[selDev.value];
      const keys = dev?.dataKeys || [];
      selKey.innerHTML = keys.length
        ? keys.map((k) => `<option value="${k.name}">${escHtml(k.name)}</option>`).join("")
        : `<option value="" disabled selected>No keys</option>`;
    }
    function syncDevices() {
      const devs = getDeviceList(selAsset.value);
      selDev.innerHTML = devs.length
        ? devs.map((d) => `<option value="${d.deviceId}">${escHtml(d.label)}</option>`).join("")
        : `<option value="" disabled selected>No devices</option>`;
      syncKeys(); renderContribution();
    }
    function invalidateTableCaches() {
      seriesCacheKey = ""; sortedSeriesCache = [];
      filterCacheKey = ""; filteredSeriesCache = [];
    }
    function getSortedSeriesForSelection(assetId, deviceId, keyName) {
      const key = `${assetId}|${deviceId}|${keyName}`;
      if (seriesCacheKey !== key) {
        const raw = getKeySeries(assetId, deviceId, keyName);
        sortedSeriesCache = raw.length ? raw.slice().sort((a, b) => b.ts - a.ts) : [];
        seriesCacheKey = key;
        filterCacheKey = ""; filteredSeriesCache = sortedSeriesCache;
      }
      return sortedSeriesCache;
    }
    function getFilteredSeries(sortedSeries, query) {
      const q = (query || "").trim().toLowerCase();
      const key = `${seriesCacheKey}|${q}`;
      if (filterCacheKey !== key) {
        filteredSeriesCache = !q ? sortedSeries : sortedSeries.filter((p) => String(p.v).toLowerCase().includes(q));
        filterCacheKey = key;
      }
      return filteredSeriesCache;
    }

    /* ⚡ DocumentFragment for table rows */
    function renderTable() {
      const assetId = selAsset.value, deviceId = selDev.value, keyName = selKey.value;
      const sortedSeries = assetId && deviceId && keyName
        ? getSortedSeriesForSelection(assetId, deviceId, keyName) : [];
      const filtered = getFilteredSeries(sortedSeries, filterEl.value);
      const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
      currentPage = Math.max(0, Math.min(currentPage, totalPages - 1));
      const start = currentPage * pageSize;
      const slice = filtered.slice(start, start + pageSize);

      pageInfo.textContent = filtered.length
        ? `${start + 1}-${start + slice.length} of ${filtered.length}` : "0";
      statsEl.innerHTML = `<b>${escHtml(selKey.value || "—")}</b><br/>Points: ${filtered.length}<br/>Range: ${filtered[0]?.ts ? fmtTs(filtered[0].ts) : "—"} → ${filtered.at(-1)?.ts ? fmtTs(filtered.at(-1).ts) : "—"}`;

      const frag = document.createDocumentFragment();
      for (let i = 0; i < slice.length; i++) {
        const p = slice[i];
        const tr = document.createElement("tr");
        tr.style.background = i % 2 ? "#fafbf7" : "#fff";

        const td1 = document.createElement("td");
        td1.style.padding = "6px";
        td1.textContent = fmtTs(p.ts);

        const td2 = document.createElement("td");
        td2.style.cssText = "padding:6px;font-family:monospace;color:#6b7c85";
        td2.textContent = p.ts;

        const td3 = document.createElement("td");
        td3.style.cssText = "padding:6px;font-family:monospace;font-weight:600";
        td3.textContent = p.v ?? "";

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        frag.appendChild(tr);
      }
      tbody.innerHTML = "";
      tbody.appendChild(frag);
    }

    function syncFromHub(resetPage = true) {
      const hub = SHARED.DATAHUB_V17;
      const assetsNow = getAssetsList();
      if (!hub || !assetsNow.length) { setEmptyModalUI("No selected assets (hub is empty)"); return; }
      setActiveModalUI();

      const prevAsset = selAsset.value, prevDev = selDev.value, prevKey = selKey.value;

      selAsset.innerHTML = assetsNow.map((a) => `<option value="${a.assetId}">${escHtml(a.assetName)}</option>`).join("");
      const assetStillThere = assetsNow.some((a) => a.assetId === prevAsset);
      selAsset.value = assetStillThere ? prevAsset : assetsNow[0].assetId;

      const devs = getDeviceList(selAsset.value);
      selDev.innerHTML = devs.length
        ? devs.map((d) => `<option value="${d.deviceId}">${escHtml(d.label)}</option>`).join("")
        : `<option value="" disabled selected>No devices</option>`;
      const devStillThere = devs.some((d) => d.deviceId === prevDev);
      if (devs.length) selDev.value = devStillThere ? prevDev : devs[0].deviceId;

      syncKeys();
      const keys = (() => {
        const dev = SHARED.DATAHUB_V17?.sharedAssetObj?.[selAsset.value]?.devices?.[selDev.value];
        return dev?.dataKeys || [];
      })();
      const keyStillThere = keys.some((k) => k.name === prevKey);
      if (keys.length) selKey.value = keyStillThere ? prevKey : keys[0].name;

      renderContribution();
      invalidateTableCaches();
      if (resetPage) currentPage = 0;
      renderTable();
    }

    selAsset.onchange = () => { syncDevices(); invalidateTableCaches(); currentPage = 0; renderTable(); };
    selDev.onchange = () => { syncKeys(); renderContribution(); invalidateTableCaches(); currentPage = 0; renderTable(); };
    selKey.onchange = () => { invalidateTableCaches(); currentPage = 0; renderTable(); };
    const debouncedFilterRender = debounce(() => { currentPage = 0; renderTable(); }, 180);
    filterEl.oninput = () => debouncedFilterRender();
    prevBtn.onclick = () => { currentPage--; renderTable(); };
    nextBtn.onclick = () => { currentPage++; renderTable(); };
    pageSel.onchange = () => { pageSize = +pageSel.value; currentPage = 0; renderTable(); };

    if (!assets.length) { setEmptyModalUI("No data in hub yet"); }
    else { syncFromHub(true); }

    if (!modalBound) {
      modalHubListener = () => { if (modal.style.display === "flex") syncFromHub(true); };
      window.addEventListener(HUB_EVENT, modalHubListener);
      modalBound = true;
    }
  }

  /* ========================== LOAD ASSETS =========================== */
  if (!assetUrl) {
    statusEl.innerText = "No customer context available for this user";
    console.log("[DH17] Missing customer context", { currentAuthority, currentUser, currentCustomerId });
    return;
  }

  const assets = await httpGetWithRetry(assetUrl);

  console.log("[DH17] currentAuthority =", currentAuthority);
  console.log("[DH17] currentUser.customerId =", currentUser.customerId);
  console.log("[DH17] resolved currentCustomerId =", currentCustomerId);
  console.log("[DH17] assetUrl =", assetUrl);
  console.log("[DH17] assets response =", assets);

  if ((assets.data || []).length === 1) {
    const rootDiv = document.getElementById("dh16-root");
    if (rootDiv) rootDiv.style.display = "none";
    stopRefreshLoop();
    selectedAssetIds.clear();
    const onlyAssetId = assets.data[0]?.id?.id;
    if (!onlyAssetId) {
      statusEl.innerText = "Could not resolve the user asset";
      console.log("[DH17] Could not resolve only asset id", assets.data[0]);
      return;
    }
    selectedAssetIds.add(onlyAssetId);
    updateSelectionCount();
    await runRefreshCycle("initial", { fullReload: true });
    return;
  } else {
    async function applySelectionChange() {
      stopRefreshLoop();
      if (selectedAssetIds.size) {
        await runRefreshCycle("selection-change", { fullReload: true });
        return;
      }
      statusEl.innerText = "Select assets to load data";
      nextRefreshAt = 0;
      SHARED.DATAHUB_V17 = {
        sharedAssetObj: {}, segments: {},
        hubMeta: { clearedAt: now(), revision: (SHARED.DATAHUB_V17?.hubMeta?.revision || 0) + 1, empty: true },
      };
      emitHubUpdated("cleared");
    }

    loadBtn.onclick = () => {
      if (selectedAssetIds.size === 0) { loadBtn.removeAttribute('refresh-in-flight'); resetHubState(); return; }
      if (loadBtn.hasAttribute('refresh-in-flight')) return;
      void applySelectionChange();
      loadBtn.setAttribute('refresh-in-flight', '');
    };

    const sortedAssets = (assets.data || []).slice().sort((a, b) =>
      String(a.name || "").localeCompare(String(b.name || "")),
    );
    selectedAssetIds.clear();

    /* ⚡ DocumentFragment for checkboxes */
    const frag = document.createDocumentFragment();
    for (const a of sortedAssets) {
      const id = a.id.id;
      const row = document.createElement("label");
      row.className = "dh16-checkbox-row";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = true;
      selectedAssetIds.add(id);

      const label = document.createElement("span");
      label.className = "dh16-checkbox-label";
      label.textContent = a.name || id;

      cb.onchange = () => {
        cb.checked ? selectedAssetIds.add(id) : selectedAssetIds.delete(id);
        updateSelectionCount();
      };

      row.appendChild(cb);
      row.appendChild(label);
      frag.appendChild(row);
    }
    checkboxGroup.appendChild(frag);

    updateSelectionCount();
    await runRefreshCycle("initial-multi-select", { fullReload: true });
  }

  /* ============================== CLEANUP ============================== */
  self.onDestroy = function () {
    isDestroyed = true;
    isPaused = true;
    try { clearInterval(countdownTimer); } catch (e) {}
    try { clearInterval(watchdogInterval); } catch (e) {}
    try { stopRefreshLoop(); } catch (e) {}
    try { document.removeEventListener('visibilitychange', handleVisibilityChange); } catch (e) {}
    try { document.removeEventListener('freeze', handleFreeze); } catch (e) {}
    try { document.removeEventListener('resume', handleResume); } catch (e) {}
    try { if (modalBound && modalHubListener) window.removeEventListener(HUB_EVENT, modalHubListener); } catch (e) {}
    try { modal.remove(); } catch (e) {}
    try { style.remove(); } catch (e) {}
    try {
      if (SHARED.DATAHUB_V17) { SHARED.DATAHUB_V17 = null; delete SHARED.DATAHUB_V17; }
    } catch (e) {}
    try { emitHubUpdated("destroyed"); } catch (e) {}
  };
};