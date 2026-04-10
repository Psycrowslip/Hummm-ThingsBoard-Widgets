/***********************
 * CAROUSEL STYLES
 ***********************/
function injectCarouselStylesOnce() {
  if (document.getElementById("fw-carousel-style")) return;
  var style = document.createElement("style");
  style.id = "fw-carousel-style";
  style.innerHTML = `
    .carousel-root{ position:relative; font-family:system-ui; height:100%; }
    .carousel-controls{
      position:absolute; top:28px; left:50%; transform:translateX(-50%);
      display:flex; align-items:center; gap:14px; z-index:10;
      background:rgba(255,255,255,1); backdrop-filter:blur(6px);
      padding:6px 14px; border-radius:999px;
      box-shadow:0 6px 18px rgba(0,0,0,0.06);
    }
    .nav{
      width:30px; height:30px; border-radius:50%; border:none;
      background:rgba(255,255,255,1); cursor:pointer; position:relative;
      padding:0; transition:transform 150ms ease;
    }
    .nav:hover{ transform:scale(1.08); }
    .nav::before{
      content:''; position:absolute; top:50%; left:50%;
      width:7px; height:7px;
      border-top:2px solid #3d3c3a; border-right:2px solid #3d3c3a;
      transform-origin:center;
    }
    .nav.prev::before{ transform:translate(-50%, -50%) rotate(-135deg); }
    .nav.next::before{ transform:translate(-50%, -50%) rotate(45deg); }
    .dots{ display:flex; gap:6px; }
    .dot{
      width:6px; height:6px; border-radius:999px;
      background:#cfcac1; transition:all 200ms ease; cursor:pointer;
    }
    .dot.active{ width:18px; background:#3d3c3a; }
    .viewport{
      overflow:hidden; height:100%; min-height:0;
      scrollbar-width:none; padding-top:75px;
      position:relative;
    }
    .viewport::-webkit-scrollbar{ display:none; }
    .track{ display:flex; height:100%; will-change:transform; }
    .fw-root{ display:flex; flex-direction:column; height:100%; min-height:0; }
    .fw-header{ flex:0 0 60px; }
    .carousel-root{ flex:1 1 auto; min-height:0; position:relative; }
    .slide{
      flex:0 0 100%; padding:18px; margin-bottom:100px;
      box-sizing:border-box; height:100%; overflow-y:auto; overflow-x:hidden;
      -webkit-overflow-scrolling:touch; scrollbar-width:thin;
    }
    .slide::-webkit-scrollbar{ width:8px; }
    .slide::-webkit-scrollbar-thumb{ background:rgba(0,0,0,0.18); border-radius:999px; }
    .slide::-webkit-scrollbar-track{ background:transparent; }
    .asset-pager{
      display:flex; align-items:center; gap:10px;
      transition:opacity 200ms ease;
    }
    .asset-pager.hidden{ display:none; }
    .asset-nav{
      width:30px; height:30px; border-radius:50%;
      border:1px solid rgba(61,60,58,0.12);
      background:rgba(255,255,255,0.7); cursor:pointer; position:relative;
      padding:0; transition:all 150ms ease; flex-shrink:0;
      backdrop-filter:blur(4px);
    }
    .asset-nav:hover{
      background:rgba(255,255,255,1); transform:scale(1.1);
      border-color:rgba(61,60,58,0.25); box-shadow:0 2px 8px rgba(0,0,0,0.08);
    }
    .asset-nav:active{ transform:scale(0.96); }
    .asset-nav::before{
      content:''; position:absolute; top:50%; left:50%;
      width:6px; height:6px;
      border-top:1.5px solid #3d3c3a; border-right:1.5px solid #3d3c3a;
      transform-origin:center;
    }
    .asset-prev::before{ transform:translate(-35%, -50%) rotate(-135deg); }
    .asset-next::before{ transform:translate(-65%, -50%) rotate(45deg); }
    .swipe-hint{
      position:absolute; top:6px; left:50%; transform:translateX(-50%);
      font-size:12px; font-weight:500; color:#8c8a84; opacity:0;
      white-space:nowrap; animation:fadeOutHint 4s ease forwards;
      z-index:12; pointer-events:none;
    }
    @keyframes fadeOutHint{
      0%{opacity:0;} 10%{opacity:0.8;} 70%{opacity:0.8;} 100%{opacity:0;}
    }
    .swipe-hint::after{
      content:''; display:inline-block; width:5px; height:5px;
      border-top:2px solid #8c8a84; border-right:2px solid #8c8a84;
      transform:rotate(45deg); margin:0 6px;
      animation:hintArrow 1.2s infinite alternate;
    }
    @keyframes hintArrow{
      from{ transform:rotate(45deg) translateX(0); }
      to{ transform:rotate(45deg) translateX(3px); }
    }

    /* ── HEADER LOADER ── */
    .header-loader{
      position:absolute; right:14px; top:50%; transform:translateY(-50%);
      display:flex; align-items:center; justify-content:center;
      width:28px; height:28px; opacity:0; pointer-events:none;
      transition:opacity 160ms ease; z-index:3;
    }
    .header-loader.active{ opacity:1; }
    .loader-spinner{
      width:22px; height:22px; border:2.5px solid rgba(61,60,58,0.16);
      border-top:2.5px solid #3d3c3a; border-radius:50%;
      animation:spin 0.8s linear infinite;
    }
    @keyframes spin{ to{ transform:rotate(360deg); } }

    /* ── SHIMMER SKELETON ── */
    @keyframes shimmerSweep{
      0%  { background-position:-200% 0; }
      100%{ background-position:200% 0; }
    }
    .skel{
      background:linear-gradient(90deg, #e8e6e1 25%, #f4f2ee 37%, #e8e6e1 63%);
      background-size:200% 100%;
      animation:shimmerSweep 1.6s ease-in-out infinite;
      border-radius:6px;
    }
    .skel-line{ height:14px; margin-bottom:8px; }
    .skel-line.w60{ width:60%; }
    .skel-line.w40{ width:40%; }
    .skel-line.w80{ width:80%; }
    .skel-line.w50{ width:50%; }
    .skel-title{ height:22px; width:55%; margin-bottom:6px; }
    .skel-bar{ height:48px; border-radius:12px; margin-top:10px; }
    .skel-graph{ height:80px; border-radius:8px; margin-top:10px; }
    .skel-chip{ display:inline-block; width:60px; height:22px; border-radius:999px; margin-right:6px; }
    .skel-donut{ width:120px; height:120px; border-radius:50%; margin:10px auto; }
    .skel-metric-row{
      display:flex; justify-content:space-between; margin-bottom:6px;
    }
    .skel-metric-label{ width:40%; height:12px; }
    .skel-metric-value{ width:25%; height:12px; }

    /* ── INIT BANNER ── */
    .fw-init-banner{
      position:absolute; top:0; left:0; right:0; bottom:0;
      z-index:15;
      display:flex; flex-direction:column; align-items:center;
      justify-content:center; gap:20px; pointer-events:none;
      background:rgba(255,255,255,0.7); backdrop-filter:blur(3px);
      padding-bottom:75px;
      transition:opacity 500ms cubic-bezier(0.22,1,0.36,1),
                 transform 500ms cubic-bezier(0.22,1,0.36,1);
    }
    .fw-init-banner.dismissing{
      opacity:0; transform:scale(0.96) translateY(-10px);
    }

    /* Radar icon */
    .fw-radar{
      position:relative; width:64px; height:64px;
    }
    .fw-radar-ring{
      position:absolute; inset:0;
      border:2.5px solid #508590;
      border-radius:50%;
      animation:radarPulse 2.4s ease-out infinite;
    }
    .fw-radar-ring.r2{ animation-delay:0.6s; }
    .fw-radar-ring.r3{ animation-delay:1.2s; }
    @keyframes radarPulse{
      0%  { transform:scale(0.3); opacity:0.85; }
      70% { opacity:0.25; }
      100%{ transform:scale(1.2); opacity:0; }
    }
    .fw-radar-dot{
      position:absolute; top:50%; left:50%;
      width:12px; height:12px; margin:-6px;
      background:#508590; border-radius:50%;
      box-shadow:0 0 12px rgba(80,133,144,0.5), 0 0 4px rgba(80,133,144,0.3);
    }

    /* Horizontal stepper */
    .fw-stepper{
      display:flex; align-items:center; gap:0;
      width:260px; max-width:80vw;
    }
    .fw-st{
      display:flex; flex-direction:column; align-items:center; gap:6px;
      flex-shrink:0; position:relative; z-index:1;
    }
    .fw-st-dot{
      width:12px; height:12px; border-radius:50%;
      background:#d6d3cf; border:2px solid #d6d3cf;
      transition:all 0.4s cubic-bezier(0.22,1,0.36,1);
      position:relative;
    }
    .fw-st.active .fw-st-dot{
      background:#508590; border-color:#508590;
      box-shadow:0 0 0 5px rgba(80,133,144,0.15);
      animation:stepPulse 1.5s ease-in-out infinite;
    }
    @keyframes stepPulse{
      0%,100%{ box-shadow:0 0 0 4px rgba(80,133,144,0.12); }
      50%    { box-shadow:0 0 0 7px rgba(80,133,144,0.06); }
    }
    .fw-st.done .fw-st-dot{
      background:#508590; border-color:#508590;
      box-shadow:none; animation:none;
    }
    .fw-st.done .fw-st-dot::after{
      content:'';
      position:absolute; top:50%; left:50%;
      width:3.5px; height:6.5px;
      border:solid #fff; border-width:0 1.8px 1.8px 0;
      transform:translate(-50%, -60%) rotate(45deg);
    }
    .fw-st-label{
      font-size:11px; font-weight:500; color:#b8b5ae;
      transition:color 0.4s ease; white-space:nowrap;
    }
    .fw-st.active .fw-st-label{ color:#3d3c3a; }
    .fw-st.done .fw-st-label{ color:#508590; }
    .fw-st-line{
      flex:1; height:2px; background:#e4e2dd;
      position:relative; overflow:hidden; min-width:20px;
      margin:0 -2px; margin-bottom:22px;
    }
    .fw-st-line-fill{
      position:absolute; inset:0; background:#508590;
      transform:scaleX(0); transform-origin:left;
      transition:transform 0.6s cubic-bezier(0.22,1,0.36,1);
    }
    .fw-st-line.done .fw-st-line-fill{ transform:scaleX(1); }

    /* ── CARD REVEAL ── */
    @keyframes cardRevealIn{
      0%  { opacity:0.6; transform:translateY(6px); }
      100%{ opacity:1; transform:translateY(0); }
    }
    .card.is-loading{
      opacity:1;
    }
    .card.card-revealed{
      animation:cardRevealIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
    }

    /* ── LOADER OVERLAY (for refreshes after first load) ── */
    .loader-overlay{
      position:absolute; inset:0; z-index:20;
      display:flex; align-items:center; justify-content:center;
      background:rgba(255,255,255,0.5); backdrop-filter:blur(2px);
      opacity:0; pointer-events:none;
      transition:opacity 300ms ease;
    }
    .loader-overlay.active{ opacity:1; pointer-events:auto; }

    .page{ display:flex; flex-direction:column; gap:14px; }
    .card{
      background:#fafaf7; border-radius:6px; padding:16px;
      box-shadow:0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.06);
      transition:opacity 0.3s ease, transform 0.3s ease;
    }
    .card.tier-hidden{ display:none; }
    .card-title{ font-size:14px; color:#6b6b6b; }
    .resident-title{ margin-top:6px; font-size:22px; font-weight:600; color:#3d3c3a; }
    .resident-duration{ margin-top:4px; font-size:13px; color:#6b6b6b; }
    .resident-chip-row{ margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; }
    .movement-pill-row{ margin-top:8px; display:flex; gap:6px; flex-wrap:wrap; }
    .movement-pill{
      display:inline-block; font-size:12px; font-weight:500;
      padding:4px 10px; border-radius:999px; line-height:1;
      position:relative; cursor:default;
    }
    .pill-away{ background:#E8F4F7; color:#2E5665; }
    .pill-rest{ background:#EDE8F5; color:#4A3D6B; }
    .pill-move{ background:#FDF3E0; color:#8A6A2A; }
    .pill-walk{ background:#E6F5EC; color:#2D7A45; }
    .movement-pill::after{
      content:attr(data-tooltip); position:absolute;
      bottom:calc(100% + 6px); left:50%; transform:translateX(-50%);
      background:rgba(50,50,50,0.92); color:#fff; font-size:11px;
      padding:6px 8px; border-radius:4px; white-space:nowrap;
      opacity:0; pointer-events:none; transition:opacity 150ms ease;
    }
    .movement-pill::before{
      content:""; position:absolute; bottom:calc(100% + 1px);
      left:50%; transform:translateX(-50%);
      border:5px solid transparent; border-top-color:rgba(50,50,50,0.92);
      opacity:0; pointer-events:none; transition:opacity 150ms ease;
    }
    .movement-pill:hover::after,
    .movement-pill:hover::before{ opacity:1; }
    .location-main{ margin-top:6px; font-size:20px; font-weight:600; color:#3d3c3a; }
    .location-sub{ margin-top:6px; font-size:14px; color:#6b6b6b; }
    .chip-row{ margin-top:10px; display:flex; gap:6px; flex-wrap:wrap; }
    .chip{
      display:inline-block; font-size:12px; font-weight:500;
      padding:4px 10px; border-radius:999px; line-height:1;
      background:#e6e6e3; color:#4b4b48;
    }
    .chip-warn{ background:#efe8d8; color:#6a5c3a; }
    .activity-block{ margin-top:12px; }
    .activity-title{ font-size:13px; font-weight:500; color:#6b6b6b; margin-bottom:6px; }
    .activity-graph{ width:100%; height:80px; }
    .activity-metrics{
      margin-top:12px; display:grid; grid-template-columns:1fr 1fr;
      gap:8px 24px; font-size:13px;
    }
    @media (max-width:480px){ .activity-metrics{ grid-template-columns:1fr; } }
    .metric-row{ display:flex; justify-content:space-between; color:#5f5d58; }
    .timeline24{ margin-top:10px; }
    .timeline24-bar{
      height:48px; border-radius:12px; background:#f1efe8;
      position:relative; overflow:visible;
    }
    .timeline24-segs{ position:absolute; inset:0; border-radius:12px; overflow:hidden; }
    .timeline24-seg{ position:absolute; top:0; bottom:0; cursor:pointer; }
    .timeline24-axis{
      margin-top:8px; display:flex; justify-content:space-between;
      font-size:12px; color:#8c8a84;
    }
    .timeline24-legend{
      margin-top:14px; display:grid; grid-template-columns:1fr 1fr;
      gap:10px 18px; font-size:14px;
    }
    .t24-row{ display:flex; align-items:center; justify-content:space-between; }
    .t24-left{ display:flex; align-items:center; gap:8px; }
    .t24-dot{ width:10px; height:10px; border-radius:50%; }
    .t24-dur{ color:#6b6b6b; }
    .fw-floating-tooltip{
      position:fixed; background:rgba(40,40,40,0.95); color:#fff;
      font-size:11px; padding:6px 8px; border-radius:4px;
      white-space:nowrap; pointer-events:none; z-index:9999;
      opacity:0; transition:opacity 120ms ease;
    }
    .overnight-wrap{ margin-top:10px; }
    .overnight-bar{
      height:48px; border-radius:12px; background:#f1efe8;
      position:relative; overflow:hidden;
    }
    .overnight-segs{ position:absolute; inset:0; }
    .overnight-axis{
      margin-top:8px; display:flex; justify-content:space-between;
      font-size:12px; color:#8c8a84;
    }
    .overnight-legend{
      margin-top:14px; display:grid; grid-template-columns:1fr 1fr;
      gap:10px 18px; font-size:14px;
    }
    .device-status-main{ margin-top:10px; }
    .status-pill{
      display:inline-block; font-size:13px; font-weight:600;
      padding:6px 14px; border-radius:999px;
    }
    .status-online{ background:#e4f3e8; color:#2f6f3e; }
    .status-degraded{ background:#f4ead9; color:#8a6a2a; }
    .status-offline{ background:#f5e4e4; color:#8b2f2f; }
    .device-status-sub{ margin-top:8px; font-size:13px; color:#6b6b6b; }
    .hourly-stack{ display:flex; gap:4px; height:120px; }
    .hour-bar{
      flex:1; display:flex; flex-direction:column-reverse;
      border-radius:4px; overflow:hidden; background:#f1efe8; height:100%;
    }
    .hour-seg{ width:100%; }
    .seg-away{ background:#C9CCD1; }
    .seg-rest{ background:#7FBAC8; }
    .seg-move{ background:#E8B86D; }
    .seg-walk{ background:#5BAD7A; }
    .seg-multi{ background:#DBA5B0; }
    .hourly-stack-axis{ display:flex; gap:4px; margin-top:6px; }
    .hour-axis-label{
      flex:1; font-size:10px; color:#8c8a84; text-align:center;
      min-width:0; white-space:nowrap;
    }
    .hourly-stack-legend{ display:flex; flex-wrap:wrap; gap:8px 16px; margin-top:12px; }
    .hourly-legend-item{
      display:flex; align-items:center; gap:6px; font-size:12px; color:#5f5d58;
    }
    .hourly-legend-dot{ width:10px; height:10px; border-radius:3px; display:inline-block; }
    .daily-dist-wrap{ margin-top:20px; }
    .daily-dist-title{ font-size:13px; font-weight:500; color:#6b6b6b; margin-bottom:10px; }
    .daily-dist-grid{ display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; }
    @media (max-width:480px){ .daily-dist-grid{ grid-template-columns:1fr; } }
    .daily-dist-item{
      display:flex; align-items:center; justify-content:space-between;
      font-size:13px; color:#5f5d58;
    }
    .daily-dist-left{ display:flex; align-items:center; gap:8px; }
    .daily-dist-dot{ width:10px; height:10px; border-radius:3px; display:inline-block; }
    .daily-dist-val{ font-weight:500; color:#3d3c3a; }
    .snapshot-pills-wrap{ margin-top:16px; }
    .snapshot-pills-grid{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    @media (max-width:480px){ .snapshot-pills-grid{ grid-template-columns:1fr; } }
    .snapshot-pill{ background:#f4f3ef; border-radius:10px; padding:12px 14px; }
    .snapshot-pill-value{ font-size:20px; font-weight:600; color:#3d3c3a; line-height:1.2; }
    .snapshot-pill-label{ font-size:12px; color:#8c8a84; margin-top:4px; }
    .room-ribbon-wrap{ margin-top:10px; position:relative; }
    .room-ribbon-canvas{ width:100%; height:140px; display:block; border-radius:8px; }
    .room-ribbon-axis{
      margin-top:6px; display:flex; justify-content:space-between;
      font-size:12px; color:#8c8a84;
    }
    .room-ribbon-legend{
      margin-top:14px; display:grid; grid-template-columns:1fr 1fr;
      gap:10px 18px; font-size:14px;
    }
    .rr-row{ display:flex; align-items:center; justify-content:space-between; }
    .rr-left{ display:flex; align-items:center; gap:8px; }
    .rr-dot{ width:10px; height:10px; border-radius:3px; }
    .rr-dur{ color:#6b6b6b; }
    .room-dist-wrap{ margin-top:20px; }
    .room-dist-title{ font-size:13px; font-weight:500; color:#6b6b6b; margin-bottom:10px; }
    .room-dist-grid{ display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; }
    @media (max-width:480px){ .room-dist-grid{ grid-template-columns:1fr; } }
    .room-dist-item{
      display:flex; align-items:center; justify-content:space-between;
      font-size:13px; color:#5f5d58;
    }
    .room-dist-left{ display:flex; align-items:center; gap:8px; }
    .room-dist-dot{ width:10px; height:10px; border-radius:3px; display:inline-block; }
    .room-dist-val{ font-weight:500; color:#3d3c3a; }
    .inbed-donut-wrap{ margin-top:12px; display:flex; align-items:center; gap:24px; flex-wrap:wrap; }
    .inbed-donut-canvas{ width:160px; height:160px; flex-shrink:0; }
    .inbed-donut-totals{ display:flex; flex-direction:column; gap:8px; flex:1; min-width:140px; }
    .inbed-total-row{
      display:flex; align-items:center; justify-content:space-between;
      font-size:13px; color:#5f5d58;
    }
    .inbed-total-left{ display:flex; align-items:center; gap:8px; }
    .inbed-total-dot{ width:10px; height:10px; border-radius:3px; display:inline-block; }
    .inbed-total-val{ font-weight:500; color:#3d3c3a; }
    .inbed-center-label{ font-size:11px; color:#8c8a84; text-align:center; }
    .inbed-center-value{ font-size:18px; font-weight:600; color:#3d3c3a; text-align:center; }
    .overnight-ribbon-wrap{ margin-top:10px; position:relative; }
    .overnight-ribbon-canvas{ width:100%; height:140px; display:block; border-radius:8px; }
    .overnight-ribbon-axis{
      margin-top:6px; display:flex; justify-content:space-between;
      font-size:12px; color:#8c8a84;
    }
    .overnight-ribbon-legend{
      margin-top:14px; display:grid; grid-template-columns:1fr 1fr;
      gap:10px 18px; font-size:14px;
    }
    .or-row{ display:flex; align-items:center; justify-content:space-between; }
    .or-left{ display:flex; align-items:center; gap:8px; }
    .or-dot{ width:10px; height:10px; border-radius:3px; }
    .or-dur{ color:#6b6b6b; }
    .night-events-grid{
      margin-top:12px; display:grid; grid-template-columns:1fr 1fr; gap:10px;
    }
    @media (max-width:480px){ .night-events-grid{ grid-template-columns:1fr; } }
    .night-event-pill{ background:#f4f3ef; border-radius:10px; padding:12px 14px; }
    .night-event-value{ font-size:20px; font-weight:600; color:#3d3c3a; line-height:1.2; }
    .night-event-label{ font-size:12px; color:#8c8a84; margin-top:4px; }
    .night-hourly-stack{ display:flex; gap:4px; height:120px; margin-top:10px; }
    .night-hour-bar{
      flex:1; display:flex; flex-direction:column-reverse;
      border-radius:4px; overflow:hidden; background:#f1efe8; height:100%;
    }
    .night-hour-seg{ width:100%; }
    .nseg-out{ background:#A68B7B; }
    .nseg-rest{ background:#7FBAC8; }
    .nseg-active{ background:#5BAD7A; }
    .nseg-multi{ background:#DBA5B0; }
    .night-hourly-axis{ display:flex; gap:4px; margin-top:6px; }
    .night-hour-axis-label{
      flex:1; font-size:10px; color:#8c8a84; text-align:center;
      min-width:0; white-space:nowrap;
    }
    .night-hourly-legend{ display:flex; flex-wrap:wrap; gap:8px 16px; margin-top:12px; }
    .night-legend-item{
      display:flex; align-items:center; gap:6px; font-size:12px; color:#5f5d58;
    }
    .night-legend-dot{ width:10px; height:10px; border-radius:3px; display:inline-block; }
    .night-dist-wrap{ margin-top:20px; }
    .night-dist-title{ font-size:13px; font-weight:500; color:#6b6b6b; margin-bottom:10px; }
    .night-dist-grid{ display:grid; grid-template-columns:1fr 1fr; gap:8px 24px; }
    @media (max-width:480px){ .night-dist-grid{ grid-template-columns:1fr; } }
    .night-dist-item{
      display:flex; align-items:center; justify-content:space-between;
      font-size:13px; color:#5f5d58;
    }
    .night-dist-left{ display:flex; align-items:center; gap:8px; }
    .night-dist-dot{ width:10px; height:10px; border-radius:3px; display:inline-block; }
    .night-dist-val{ font-weight:500; color:#3d3c3a; }
    .fw-header{
      display:flex; align-items:center; justify-content:center;
      height:60px; background:#e6e4df; position:relative;
    }
    .fw-logo{
      position:absolute; left:14px; width:48px; height:48px; object-fit:contain;
    }
    .fw-asset-name{
      font-size:20px; font-weight:600; color:#3d3c3a; letter-spacing:0.3px;
    }
  `;
  document.head.appendChild(style);
}

/***********************
 * SKELETON BUILDERS
 ***********************/
function skelLine(wClass) {
  return '<div class="skel skel-line ' + (wClass || '') + '"></div>';
}
function skelTitle() {
  return '<div class="skel skel-title"></div>';
}
function skelBar() {
  return '<div class="skel skel-bar"></div>';
}
function skelGraph() {
  return '<div class="skel skel-graph"></div>';
}
function skelChips(n) {
  var h = '';
  for (var i = 0; i < (n || 2); i++) h += '<div class="skel skel-chip"></div>';
  return '<div style="margin-top:8px;display:flex;gap:6px">' + h + '</div>';
}
function skelMetrics(n) {
  var h = '';
  for (var i = 0; i < (n || 4); i++)
    h += '<div class="skel-metric-row"><div class="skel skel-metric-label"></div><div class="skel skel-metric-value"></div></div>';
  return h;
}

/***********************
 * CAROUSEL LAYOUT
 ***********************/
function createCarouselLayout(container) {
  if (!container) return null;
  var existingRoot = container.querySelector(".carousel-root");
  if (existingRoot) return existingRoot;
  container.innerHTML =
    '<div class="fw-root">' +
      '<div class="fw-header">' +
        '<img src="https://hummm.global/wp-content/uploads/2025/09/logo-2-hummm.png" class="fw-logo" />' +
        '<div class="asset-pager hidden" id="asset-pager">' +
          '<button class="asset-nav asset-prev"></button>' +
          '<div id="asset-header-name" class="fw-asset-name"></div>' +
          '<button class="asset-nav asset-next"></button>' +
        '</div>' +
        '<div id="asset-header-name-solo" class="fw-asset-name" style="display:none;"></div>' +
        '<div class="header-loader"><div class="loader-spinner"></div></div>' +
      '</div>' +
      '<div class="carousel-root">' +
        '<div class="swipe-hint">Swipe or use arrows</div>' +
        '<div class="carousel-controls">' +
          '<button class="nav prev"></button>' +
          '<div class="dots"></div>' +
          '<button class="nav next"></button>' +
        '</div>' +
        '<div class="viewport">' +
          '<div class="fw-init-banner" id="fw-init-banner">' +
            '<div class="fw-radar">' +
              '<div class="fw-radar-ring"></div>' +
              '<div class="fw-radar-ring r2"></div>' +
              '<div class="fw-radar-ring r3"></div>' +
              '<div class="fw-radar-dot"></div>' +
            '</div>' +
            '<div class="fw-stepper">' +
              '<div class="fw-st active" data-step="0">' +
                '<div class="fw-st-dot"></div>' +
                '<div class="fw-st-label">Connecting</div>' +
              '</div>' +
              '<div class="fw-st-line"><div class="fw-st-line-fill"></div></div>' +
              '<div class="fw-st" data-step="1">' +
                '<div class="fw-st-dot"></div>' +
                '<div class="fw-st-label">Loading</div>' +
              '</div>' +
              '<div class="fw-st-line"><div class="fw-st-line-fill"></div></div>' +
              '<div class="fw-st" data-step="2">' +
                '<div class="fw-st-dot"></div>' +
                '<div class="fw-st-label">Ready</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="track"></div>' +
        '</div>' +
        '<div class="loader-overlay"><div class="loader-spinner"></div></div>' +
      '</div>' +
    '</div>';
  return container.querySelector(".carousel-root");
}

/***********************
 * CAROUSEL CONTROLLER
 ***********************/
function createCarousel(container) {
  injectCarouselStylesOnce();
  var root = createCarouselLayout(container);
  if (!root) return null;
  var viewport = root.querySelector(".viewport");
  var track = root.querySelector(".track");
  var dotsWrap = root.querySelector(".dots");
  var prevButton = root.querySelector(".nav.prev");
  var nextButton = root.querySelector(".nav.next");
  var loaderEl = container.querySelector(".fw-header .header-loader") || container.querySelector(".header-loader");
  var currentIndex = 0;
  var pageChangedCallbacks = [];
  var isDestroyed = false;
  var hasRevealed = false;
  var currentProgressStep = 0;

  function getSlideCount() { return track ? track.children.length : 0; }
  function clampIndex(i) { var c = getSlideCount(); return c <= 0 ? 0 : Math.max(0, Math.min(i, c - 1)); }
  function getSlideWidth() { return viewport.clientWidth || 1; }
  function emitPageChanged() {
    for (var i = 0; i < pageChangedCallbacks.length; i++) {
      try { pageChangedCallbacks[i](currentIndex); } catch (e) {}
    }
  }
  function rebuildDots() {
    var c = getSlideCount(), html = "";
    for (var i = 0; i < c; i++) html += '<div class="dot" data-index="' + i + '"></div>';
    dotsWrap.innerHTML = html; updateDots();
  }
  function updateDots() {
    var dots = dotsWrap.querySelectorAll(".dot");
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("active", i === currentIndex);
  }
  function applyTransform(pxOffset, smooth) {
    track.style.transition = smooth ? "transform 0.3s ease" : "none";
    track.style.transform = "translateX(" + pxOffset + "px)";
  }
  function goTo(index, smooth) {
    if (getSlideCount() <= 0) return;
    currentIndex = clampIndex(index);
    applyTransform(-(currentIndex * getSlideWidth()), smooth);
    updateDots(); emitPageChanged();
  }
  function addSlide(el) {
    if (isDestroyed || !track || !el) return;
    var slide = document.createElement("div"); slide.className = "slide";
    slide.appendChild(el); track.appendChild(slide); rebuildDots();
  }
  function showLoader() { if (loaderEl) loaderEl.classList.add("active"); }
  function hideLoader() { if (loaderEl) loaderEl.classList.remove("active"); }

  function setProgress(step) {
    if (step <= currentProgressStep) return;
    currentProgressStep = step;
    var banner = container.querySelector("#fw-init-banner");
    if (!banner) return;
    var steps = banner.querySelectorAll(".fw-st");
    var lines = banner.querySelectorAll(".fw-st-line");
    for (var i = 0; i < steps.length; i++) {
      var s = steps[i];
      var si = Number(s.getAttribute("data-step"));
      s.classList.remove("active", "done");
      if (si < step) s.classList.add("done");
      else if (si === step) s.classList.add("active");
    }
    for (var j = 0; j < lines.length; j++) {
      if (j < step) lines[j].classList.add("done");
      else lines[j].classList.remove("done");
    }
  }

  function revealCards() {
    if (hasRevealed) return;
    hasRevealed = true;
    setProgress(2);
    var banner = container.querySelector("#fw-init-banner");
    setTimeout(function () {
      if (banner) {
        banner.classList.add("dismissing");
        setTimeout(function () {
          if (banner.parentNode) banner.parentNode.removeChild(banner);
        }, 550);
      }
      var allCards = container.querySelectorAll(".card.is-loading");
      for (var i = 0; i < allCards.length; i++) {
        (function (card, idx) {
          setTimeout(function () {
            var skels = card.querySelectorAll(".skel");
            for (var s = 0; s < skels.length; s++) {
              if (skels[s].parentNode) skels[s].parentNode.removeChild(skels[s]);
            }
            card.classList.remove("is-loading");
            card.classList.add("card-revealed");
          }, idx * 80);
        })(allCards[i], i);
      }
    }, 400);
  }

  prevButton.onclick = function (e) { e.preventDefault(); goTo(currentIndex - 1, true); };
  nextButton.onclick = function (e) { e.preventDefault(); goTo(currentIndex + 1, true); };
  dotsWrap.onclick = function (e) {
    var t = e.target;
    if (!t || !t.classList || !t.classList.contains("dot")) return;
    var i = Number(t.getAttribute("data-index"));
    if (isFinite(i)) goTo(i, true);
  };

  var touchStartX = 0, touchStartY = 0, touchDir = null;
  var trackBaseOffset = 0;
  var SWIPE_DIR_THRESHOLD = 8;
  var SWIPE_SNAP_THRESHOLD = 0.2;

  var onTouchStart = function (e) {
    if (isDestroyed || !e.touches.length) return;
    touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY;
    touchDir = null; trackBaseOffset = -(currentIndex * getSlideWidth());
    track.style.transition = "none";
  };
  var onTouchMove = function (e) {
    if (isDestroyed || !e.touches.length) return;
    var dx = e.touches[0].clientX - touchStartX;
    var dy = e.touches[0].clientY - touchStartY;
    if (touchDir === null) {
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_DIR_THRESHOLD) touchDir = "h";
      else if (Math.abs(dy) > SWIPE_DIR_THRESHOLD) touchDir = "v";
    }
    if (touchDir === "h") {
      e.preventDefault();
      var raw = trackBaseOffset + dx;
      var maxOff = 0, minOff = -((getSlideCount() - 1) * getSlideWidth());
      if (raw > maxOff) raw = maxOff + (raw - maxOff) * 0.3;
      else if (raw < minOff) raw = minOff + (raw - minOff) * 0.3;
      track.style.transform = "translateX(" + raw + "px)";
    }
  };
  var onTouchEnd = function (e) {
    if (isDestroyed) return;
    if (touchDir === "h") {
      var endX = touchStartX;
      if (e.changedTouches && e.changedTouches.length) endX = e.changedTouches[0].clientX;
      var dx = endX - touchStartX, sw = getSlideWidth(), thr = sw * SWIPE_SNAP_THRESHOLD;
      if (dx < -thr) goTo(currentIndex + 1, true);
      else if (dx > thr) goTo(currentIndex - 1, true);
      else goTo(currentIndex, true);
    }
    touchDir = null;
  };
  viewport.addEventListener("touchstart", onTouchStart, { passive: true });
  viewport.addEventListener("touchmove", onTouchMove, { passive: false });
  viewport.addEventListener("touchend", onTouchEnd, { passive: true });

  var mouseDown = false, mouseStartX = 0, mouseDir = null, mouseBaseOffset = 0;
  var onMouseDown = function (e) {
    if (isDestroyed) return;
    if (e.target.closest && (e.target.closest(".nav") || e.target.closest(".dot"))) return;
    mouseDown = true; mouseDir = null; mouseStartX = e.clientX;
    mouseBaseOffset = -(currentIndex * getSlideWidth());
    track.style.transition = "none"; e.preventDefault();
  };
  var onMouseMove = function (e) {
    if (isDestroyed || !mouseDown) return;
    var dx = e.clientX - mouseStartX;
    if (mouseDir === null && Math.abs(dx) > SWIPE_DIR_THRESHOLD) mouseDir = "h";
    if (mouseDir === "h") {
      var raw = mouseBaseOffset + dx;
      var maxOff = 0, minOff = -((getSlideCount() - 1) * getSlideWidth());
      if (raw > maxOff) raw = maxOff + (raw - maxOff) * 0.3;
      else if (raw < minOff) raw = minOff + (raw - minOff) * 0.3;
      track.style.transform = "translateX(" + raw + "px)";
    }
  };
  var onMouseUp = function (e) {
    if (isDestroyed || !mouseDown) return;
    mouseDown = false;
    if (mouseDir === "h") {
      var dx = e.clientX - mouseStartX, sw = getSlideWidth(), thr = sw * SWIPE_SNAP_THRESHOLD;
      if (dx < -thr) goTo(currentIndex + 1, true);
      else if (dx > thr) goTo(currentIndex - 1, true);
      else goTo(currentIndex, true);
    }
    mouseDir = null;
  };
  var onMouseLeave = function () {
    if (mouseDown) { mouseDown = false; mouseDir = null; goTo(currentIndex, true); }
  };
  viewport.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
  viewport.addEventListener("mouseleave", onMouseLeave);

  var resizeHandler = function () { if (!isDestroyed) goTo(currentIndex, false); };
  window.addEventListener("resize", resizeHandler);

  var ht1 = setTimeout(function () {
    if (isDestroyed) return;
    var sw = getSlideWidth();
    applyTransform(-(sw * 0.08), true);
    var ht2 = setTimeout(function () { if (!isDestroyed) goTo(0, true); }, 350);
    root._ht2 = ht2;
  }, 600);
  root._ht1 = ht1;
  rebuildDots();

  return {
    addSlide: addSlide,
    goTo: function (i) { goTo(i, true); },
    goToInstant: function (i) { goTo(i, false); },
    getIndex: function () { return currentIndex; },
    onPageChanged: function (cb) { if (typeof cb === "function") pageChangedCallbacks.push(cb); },
    refresh: function () { rebuildDots(); goTo(currentIndex, false); },
    showLoader: showLoader, hideLoader: hideLoader,
    setProgress: setProgress,
    revealCards: revealCards,
    hasRevealed: function () { return hasRevealed; },
    destroy: function () {
      isDestroyed = true;
      try { viewport.removeEventListener("touchstart", onTouchStart); } catch (e) {}
      try { viewport.removeEventListener("touchmove", onTouchMove); } catch (e) {}
      try { viewport.removeEventListener("touchend", onTouchEnd); } catch (e) {}
      try { viewport.removeEventListener("mousedown", onMouseDown); } catch (e) {}
      try { document.removeEventListener("mousemove", onMouseMove); } catch (e) {}
      try { document.removeEventListener("mouseup", onMouseUp); } catch (e) {}
      try { viewport.removeEventListener("mouseleave", onMouseLeave); } catch (e) {}
      try { window.removeEventListener("resize", resizeHandler); } catch (e) {}
      if (root._ht1) clearTimeout(root._ht1);
      if (root._ht2) clearTimeout(root._ht2);
      prevButton.onclick = null; nextButton.onclick = null; dotsWrap.onclick = null;
      pageChangedCallbacks.length = 0;
    }
  };
}

/***********************
 * DATA HUB LISTENER
 ***********************/
function getSharedHub() {
  try {
    var s = window && window._TB_SHARED;
    return (s && s.DATAHUB_V17) ? s.DATAHUB_V17 : null;
  } catch (e) { return null; }
}
function hubFingerprint(hub) {
  if (!hub) return "null";
  var m = hub.hubMeta || {}, a = hub.sharedAssetObj || {}, ids = Object.keys(a);
  var dc = 0;
  for (var i = 0; i < ids.length; i++) { var d = (a[ids[i]] && a[ids[i]].devices) || {}; dc += Object.keys(d).length; }
  return String(m.loadedAt||"") + "|" + String(m.refreshAt||"") + "|" + (m.refreshing?"1":"0") + "|" + ids.length + "|" + dc;
}
function createHubListener(opts) {
  var destroyed = false, lastFp = null;
  function pull(src) {
    if (destroyed) return;
    var hub = getSharedHub(); if (!hub) return;
    var r = !!(hub.hubMeta && hub.hubMeta.refreshing);
    if (r && opts && opts.onStart) opts.onStart(src);
    if (!r && opts && opts.onEnd) opts.onEnd(src);
    var fp = hubFingerprint(hub);
    if (fp === lastFp) return; lastFp = fp;
    if (opts && typeof opts.onChanged === "function") opts.onChanged(hub, src);
  }
  function onEvt(evt) {
    if (destroyed) return;
    pull("event:" + ((evt && evt.detail && evt.detail.reason) || "hubUpdated"));
  }
  try { window.addEventListener("dh17:hubUpdated", onEvt); } catch (e) {}
  pull("init");
  return {
    refresh: function () { pull("manual"); },
    destroy: function () { destroyed = true; try { window.removeEventListener("dh17:hubUpdated", onEvt); } catch (e) {} }
  };
}

/***********************
 * CONSTANTS & STATE
 ***********************/
var HOLD_MS = 2 * 60 * 1000;
var OFFLINE_LIMIT_MS = 10 * 60 * 1000;
var DEBOUNCE_MS = 30 * 1000;
var STATE_TICK_MS = 30 * 1000;
var TIER_HOLD_MS = 20 * 1000;
var LOCATION_GAP_HOLD_MS = HOLD_MS;
var ACTIVITY_WINDOW_MS = 3 * 60 * 60 * 1000;
var ACTIVITY_ANCHOR_TS = null;
var currentHubRef = null;
var residentState = null;
var stateStartTs = null;
var lastPresenceTs = null;
var pendingState = null;
var pendingSince = null;
var previousAnchorTs = null;
var currentLocationRooms = [];
var currentLocationStartTs = null;
var pendingLocationRooms = null;
var pendingLocationSince = null;
var currentLocationTotalTargets = 0;
var currentLocationIsMultipleRooms = false;
var currentLocationIsMultiplePeople = false;
var previousLocationRooms = [];
var previousLocationStartTs = null;
var previousLocationEndTs = null;
var movementTiersByDevice = {};
var activitySeries = [];
var activeTimelineTooltip = null;
var assetKeysOrdered = [];
var currentAssetIndex = 0;
var currentAssetHasTier = false;
var ROOM_COLORS = {
  bedroom:"#508590", lounge:"#E07A5F", kitchen:"#F2A541",
  study:"#6A7FBA", bathroom:"#829995",
  multi:"#DBA5B0", none:"#D6D3D1"
};
var OVERNIGHT_COLORS = { active:"#5BAD7A", passive:"#7FBAC8", none:"#D6D3D1" };

/* ── NEW: ED_tier-based colours for the overnight bar (Card 5) ── */
var OVERNIGHT_TIER_COLORS = {
  away: "#C9CCD1",   /* no detection / tier 0 */
  rest: "#7FBAC8",   /* tier 1 */
  move: "#E8B86D",   /* tier 2 */
  walk: "#5BAD7A"    /* tier 3 */
};
var OVERNIGHT_TIER_LABELS = {
  away: "Away / No detection",
  rest: "Resting",
  move: "Moving",
  walk: "Walking"
};

var OVERNIGHT_ROOM_COLORS = {
  bed:"#3A6B73", bedroom:"#508590", bathroom:"#829995",
  other:"#B8A394", none:"#D6D3D1", multi:"#DBA5B0"
};

/***********************
 * UTILITY HELPERS
 ***********************/
function normalizeRoomName(raw) {
  if (raw === null || raw === undefined) return null;
  var s = String(raw).trim(); return s || null;
}
function arraysEqual(a, b) {
  if (a === b) return true;
  if (!a || !b || a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}
function getLastDataKeySample(dev, key) {
  if (!dev || !dev.dataKeys) return null;
  for (var i = 0; i < dev.dataKeys.length; i++) {
    var dk = dev.dataKeys[i];
    if (!dk || dk.name !== key) continue;
    if (!dk.data || !dk.data.length) return null;
    return dk.data[dk.data.length - 1];
  }
  return null;
}
function resolveDeviceRoomName(dev) {
  return normalizeRoomName(dev.label) || normalizeRoomName(dev.name) || normalizeRoomName(dev.deviceId) || normalizeRoomName(dev.id) || null;
}
function formatDuration(ms) {
  var t = Math.floor(ms / 60000);
  if (t < 60) return t + " minute(s) ago";
  return Math.floor(t / 60) + " hour(s) " + (t % 60) + " minute(s) ago";
}
function getLatestTelemetryTs(hub) {
  var lat = null, asset = getCurrentAsset(hub);
  if (!asset) return null;
  Object.values(asset.devices || {}).forEach(function (d) {
    (d.dataKeys || []).forEach(function (dk) {
      if (!dk || !dk.data || !dk.data.length) return;
      var ts = Number(dk.data[dk.data.length - 1].ts);
      if (isFinite(ts)) lat = lat === null ? ts : Math.max(lat, ts);
    });
  });
  return lat;
}
function showTimelineTooltip(text, x, y) {
  if (!activeTimelineTooltip) {
    activeTimelineTooltip = document.createElement("div");
    activeTimelineTooltip.className = "fw-floating-tooltip";
    document.body.appendChild(activeTimelineTooltip);
  }
  activeTimelineTooltip.textContent = text;
  activeTimelineTooltip.style.left = (x + 12) + "px";
  activeTimelineTooltip.style.top = (y - 30) + "px";
  activeTimelineTooltip.style.opacity = "1";
}
function hideTimelineTooltip() {
  if (activeTimelineTooltip) activeTimelineTooltip.style.opacity = "0";
}
function fmtHM(mins) {
  var h = Math.floor(mins / 60), m = Math.round(mins % 60);
  if (h > 0 && m > 0) return h + "h " + m + "m";
  if (h > 0) return h + "h";
  return m + "m";
}
function setText(container, id, text) {
  var el = container && container.querySelector("#" + id);
  if (el) el.textContent = (text == null ? "" : String(text));
}
function blockKey(rooms) {
  if (!rooms || !rooms.length) return "none";
  if (rooms.length > 1) return "multi";
  return "room:" + rooms[0];
}
function getAssetTimezone(hub) {
  var asset = getCurrentAsset(hub);
  return (asset && asset.timezone) || undefined;
}
function formatTimeShort(ts, tzIana) {
  var opts = { hour: "2-digit", minute: "2-digit" };
  if (tzIana) opts.timeZone = tzIana;
  return new Date(ts).toLocaleTimeString([], opts);
}
function getHourInTz(ts, tzIana) {
  if (!tzIana) return new Date(ts).getHours();
  var s = new Date(ts).toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: tzIana });
  var h = parseInt(s, 10);
  return isNaN(h) ? new Date(ts).getHours() : (h === 24 ? 0 : h);
}
function overnightWindowInTz(tzIana) {
  var nowMs = Date.now();
  var hourNow = getHourInTz(nowMs, tzIana);
  var opts = tzIana ? { timeZone: tzIana } : undefined;
  var dateStr = new Date(nowMs).toLocaleDateString("en-CA", opts);
  var utc9 = new Date(dateStr + "T09:00:00Z").getTime();
  if (tzIana) {
    var offsetMs = new Date(new Date(utc9).toLocaleString("en-US", { timeZone: tzIana })).getTime()
                 - new Date(new Date(utc9).toLocaleString("en-US", { timeZone: "UTC" })).getTime();
    utc9 -= offsetMs;
  }
  var endTs = utc9;
  if (endTs > nowMs) endTs -= 86400000;
  var startTs = endTs - 43200000;
  return { startTs: startTs, endTs: endTs };
}

/***********************
 * ED_TIER DETECTION
 ***********************/
function assetHasEDTier(hub) {
  var asset = getCurrentAsset(hub);
  if (!asset) return false;
  var found = false;
  Object.values(asset.devices || {}).forEach(function (d) {
    if (found) return;
    (d.dataKeys || []).forEach(function (dk) {
      if (found) return;
      if (dk && dk.name === "ED_tier" && dk.data && dk.data.length > 0) found = true;
    });
  });
  return found;
}

var TIER_CARD_IDS = ["card-11", "card-7", "card-8", "card-10", "card-11n", "card-9", "card-12"];

function applyTierVisibility(container, hasTier) {
  for (var i = 0; i < TIER_CARD_IDS.length; i++) {
    var el = container.querySelector("#" + TIER_CARD_IDS[i]);
    if (el) {
      if (hasTier) el.classList.remove("tier-hidden");
      else el.classList.add("tier-hidden");
    }
  }
}

/***********************
 * ASSET MANAGEMENT
 ***********************/
function getCurrentAsset(hub) {
  if (!hub || !hub.sharedAssetObj) return null;
  if (!assetKeysOrdered.length) return null;
  return hub.sharedAssetObj[assetKeysOrdered[currentAssetIndex]] || null;
}
function updateAssetList(hub) {
  if (!hub || !hub.sharedAssetObj) return;
  var prevKey = assetKeysOrdered[currentAssetIndex] || null;
  assetKeysOrdered = Object.keys(hub.sharedAssetObj).sort(function (a, b) {
    var aa = hub.sharedAssetObj[a] || {}, bb = hub.sharedAssetObj[b] || {};
    var an = String(aa.assetName || aa.name || a || "").toLowerCase();
    var bn = String(bb.assetName || bb.name || b || "").toLowerCase();
    if (an < bn) return -1; if (an > bn) return 1;
    return String(a).localeCompare(String(b));
  });
  if (!assetKeysOrdered.length) { currentAssetIndex = 0; return; }
  if (prevKey) { var idx = assetKeysOrdered.indexOf(prevKey); currentAssetIndex = idx >= 0 ? idx : 0; }
  else if (currentAssetIndex >= assetKeysOrdered.length) currentAssetIndex = 0;
}
function updateAssetHeaderName(hub, container) {
  var asset = getCurrentAsset(hub);
  var name = asset ? asset.assetName : "";
  var multiAsset = assetKeysOrdered.length > 1;
  var pager = container.querySelector("#asset-pager");
  if (pager) {
    if (multiAsset) { pager.classList.remove("hidden"); setText(container, "asset-header-name", name); }
    else pager.classList.add("hidden");
  }
  var solo = container.querySelector("#asset-header-name-solo");
  if (solo) {
    if (multiAsset) solo.style.display = "none";
    else { solo.style.display = ""; solo.textContent = name; }
  }
}
function switchAsset(delta, hub, container) {
  if (!assetKeysOrdered.length) return;
  currentAssetIndex += delta;
  if (currentAssetIndex < 0) currentAssetIndex = assetKeysOrdered.length - 1;
  if (currentAssetIndex >= assetKeysOrdered.length) currentAssetIndex = 0;
  resetCardState();
  updateAssetHeaderName(hub, container);
  currentAssetHasTier = assetHasEDTier(hub);
  applyTierVisibility(container, currentAssetHasTier);
  evaluateState(hub); evaluateCurrentLocation(hub); evaluateLocations(hub);
  backfillActivityFromHistory(hub); renderAll(hub, container);
}

/***********************
 * PRESENCE / STATE
 ***********************/
function findLatestPresenceTsFromKey(arr) {
  for (var i = arr.length - 1; i >= 0; i--) {
    var ts = Number(arr[i].ts), v = Number(arr[i].v);
    if (isFinite(ts) && isFinite(v) && v >= 1) return ts;
  }
  return null;
}
function computePresenceSnapshot(hub, now) {
  var asset = getCurrentAsset(hub);
  if (!asset) return null;
  var any = false, lpTs = null, ltTs = null;
  Object.values(asset.devices || {}).forEach(function (d) {
    (d.dataKeys || []).forEach(function (dk) {
      if (!dk || !dk.data || !dk.data.length) return;
      var last = dk.data[dk.data.length - 1], lts = Number(last.ts);
      if (isFinite(lts)) ltTs = ltTs === null ? lts : Math.max(ltTs, lts);
      if (dk.name !== "num_of_targets") return;
      var pts = findLatestPresenceTsFromKey(dk.data);
      if (pts !== null) {
        lpTs = lpTs === null ? pts : Math.max(lpTs, pts);
        if (now - pts < HOLD_MS) any = true;
      }
    });
  });
  return { anyPresence: any, latestPresenceTs: lpTs, latestTelemetryTs: ltTs };
}
function initializeFromHistory(hub) {
  var asset = getCurrentAsset(hub); if (!asset) return;
  var now = Date.now(), pts = [];
  Object.values(asset.devices || {}).forEach(function (d) {
    (d.dataKeys || []).forEach(function (dk) {
      if (!dk || dk.name !== "num_of_targets" || !dk.data) return;
      dk.data.forEach(function (p) {
        var ts = Number(p.ts), v = Number(p.v);
        if (isFinite(ts) && isFinite(v)) pts.push({ ts: ts, v: v });
      });
    });
  });
  if (!pts.length) { residentState = "OFFLINE"; stateStartTs = now; lastPresenceTs = null; return; }
  pts.sort(function (a, b) { return a.ts - b.ts; });
  var lt = pts[pts.length - 1].ts;
  if (now - lt > OFFLINE_LIMIT_MS) { residentState = "OFFLINE"; stateStartTs = lt + OFFLINE_LIMIT_MS; lastPresenceTs = null; return; }
  var ps = null, lp = null;
  for (var j = 0; j < pts.length; j++) {
    if (pts[j].v >= 1) {
      if (ps === null) ps = pts[j].ts;
      else if (lp !== null && pts[j].ts - lp > HOLD_MS) ps = pts[j].ts;
      lp = pts[j].ts;
    }
  }
  lastPresenceTs = lp;
  if (lp !== null && now - lp < HOLD_MS) { residentState = "AT_HOME"; stateStartTs = ps; return; }
  residentState = "OUT_OF_HOME"; stateStartTs = lp !== null ? lp + HOLD_MS : lt;
}
function applyTransition(next, now) {
  if (next === residentState) { pendingState = null; pendingSince = null; return; }
  if (!pendingState) { pendingState = next; pendingSince = now; return; }
  if (pendingState !== next) { pendingState = null; pendingSince = null; return; }
  if (now - pendingSince >= DEBOUNCE_MS) {
    if (residentState === "AT_HOME" && next === "OUT_OF_HOME") previousAnchorTs = pendingSince;
    residentState = next; stateStartTs = pendingSince; pendingState = null; pendingSince = null;
  }
}
function computeMovementTiersByDevice(hub, now) {
  var asset = getCurrentAsset(hub);
  if (!asset || !currentLocationRooms.length) return {};
  var rs = {}; currentLocationRooms.forEach(function (r) { rs[r] = true; });
  var res = {};
  Object.values(asset.devices || {}).forEach(function (d) {
    var id = d.id || d.deviceId || d.name || d.label; if (!id) return;
    var rm = resolveDeviceRoomName(d); if (!rm || !rs[rm]) return;
    var tk = (d.dataKeys || []).find(function (k) { return k.name === "ED_tier"; });
    if (!tk || !tk.data || !tk.data.length) return;
    var lt = tk.data[tk.data.length - 1];
    var tier = Number(lt.v), tts = Number(lt.ts);
    if (!isFinite(tier) || !isFinite(tts) || now - tts > OFFLINE_LIMIT_MS) return;
    res[id] = { tier: tier, ts: tts, label: d.label || d.name || d.deviceId || id };
  });
  return res;
}
function evaluateState(hub) {
  var now = Date.now();
  if (residentState === null) { initializeFromHistory(hub); return; }
  var snap = computePresenceSnapshot(hub, now); if (!snap) return;
  var ts = computeMovementTiersByDevice(hub, now);
  Object.keys(ts).forEach(function (id) {
    var s = ts[id];
    var st = movementTiersByDevice[id] || { tier: null, tierTs: null, pendingTier: null, pendingSince: null, label: null };
    st.label = s.label;
    if (st.tier === null) { st.tier = s.tier; st.tierTs = s.ts; st.pendingTier = null; st.pendingSince = null; }
    else if (st.tier === s.tier) { st.pendingTier = null; st.pendingSince = null; st.tierTs = s.ts; }
    else {
      if (st.pendingTier !== s.tier) { st.pendingTier = s.tier; st.pendingSince = now; }
      else if (now - st.pendingSince >= TIER_HOLD_MS) { st.tier = st.pendingTier; st.tierTs = s.ts; st.pendingTier = null; st.pendingSince = null; }
    }
    movementTiersByDevice[id] = st;
  });
  Object.keys(movementTiersByDevice).forEach(function (id) {
    var st = movementTiersByDevice[id];
    if (!ts[id] || !st.tierTs || now - st.tierTs > OFFLINE_LIMIT_MS) delete movementTiersByDevice[id];
  });
  if (snap.latestPresenceTs !== null) lastPresenceTs = snap.latestPresenceTs;
  var ltt = snap.latestTelemetryTs;
  if (!ltt || now - ltt > OFFLINE_LIMIT_MS) {
    if (residentState !== "OFFLINE") { residentState = "OFFLINE"; stateStartTs = ltt ? ltt + OFFLINE_LIMIT_MS : now; pendingState = null; pendingSince = null; }
    return;
  }
  var ns;
  if (snap.anyPresence) ns = "AT_HOME";
  else if (lastPresenceTs !== null && now - lastPresenceTs >= HOLD_MS) ns = "OUT_OF_HOME";
  else ns = residentState;
  applyTransition(ns, now);
}

/***********************
 * LOCATION ENGINE
 ***********************/
function gatherRoomPresenceHistory(hub) {
  var asset = getCurrentAsset(hub);
  if (!asset) return { byRoom: {}, timestamps: [] };
  var byRoom = {}, timestamps = [];
  Object.values(asset.devices || {}).forEach(function (d) {
    var tk = (d.dataKeys || []).find(function (k) { return k.name === "num_of_targets"; });
    if (!tk || !tk.data || !tk.data.length) return;
    var room = resolveDeviceRoomName(d); if (!room) return;
    if (!byRoom[room]) byRoom[room] = [];
    tk.data.forEach(function (p) {
      var ts = Number(p.ts), v = Number(p.v);
      if (!isFinite(ts) || !isFinite(v)) return;
      byRoom[room].push({ ts: ts, v: v }); timestamps.push(ts);
    });
  });
  Object.keys(byRoom).forEach(function (room) { byRoom[room].sort(function (a, b) { return a.ts - b.ts; }); });
  timestamps.sort(function (a, b) { return a - b; });
  var uniq = [];
  for (var i = 0; i < timestamps.length; i++) { if (!i || timestamps[i] !== timestamps[i - 1]) uniq.push(timestamps[i]); }
  return { byRoom: byRoom, timestamps: uniq };
}
function evaluateRoomSeriesAtTs(series, ts) {
  if (!series || !series.length) return { active: false, targets: 0, sourceTs: null };
  var lo = 0, hi = series.length - 1, idx = -1;
  while (lo <= hi) { var mid = (lo + hi) >> 1; if (series[mid].ts <= ts) { idx = mid; lo = mid + 1; } else hi = mid - 1; }
  if (idx < 0) return { active: false, targets: 0, sourceTs: null };
  var sample = series[idx];
  if (!sample || !isFinite(sample.ts) || !isFinite(sample.v)) return { active: false, targets: 0, sourceTs: null };
  if (ts - sample.ts > OFFLINE_LIMIT_MS) return { active: false, targets: 0, sourceTs: sample.ts };
  if (sample.v >= 1) {
    if (ts - sample.ts <= HOLD_MS) return { active: true, targets: sample.v, sourceTs: sample.ts };
    return { active: false, targets: 0, sourceTs: sample.ts };
  }
  return { active: false, targets: 0, sourceTs: sample.ts };
}
function getStableLocationSnapshot(hub, now) {
  var hist = gatherRoomPresenceHistory(hub);
  var byRoom = hist.byRoom || {}, roomNames = Object.keys(byRoom).sort();
  if (!roomNames.length) return { rooms: [], targetsByRoom: {}, totalTargets: 0, currentBlock: null, blocks: [] };
  var timepoints = hist.timestamps.slice(); timepoints.push(now);
  timepoints.sort(function (a, b) { return a - b; });
  var blocks = [];
  for (var i = 0; i < timepoints.length; i++) {
    var ts = timepoints[i], rooms = [], targetsByRoom = {}, totalTargets = 0;
    roomNames.forEach(function (room) {
      var st = evaluateRoomSeriesAtTs(byRoom[room], ts);
      if (!st.active) return; rooms.push(room); targetsByRoom[room] = st.targets; totalTargets += st.targets;
    });
    rooms.sort();
    var start = ts, end = i < timepoints.length - 1 ? timepoints[i + 1] : now;
    if (end < start) end = start;
    if (!blocks.length || !arraysEqual(blocks[blocks.length - 1].rooms, rooms))
      blocks.push({ rooms: rooms.slice(), start: start, end: end, targetsByRoom: targetsByRoom, totalTargets: totalTargets });
    else { blocks[blocks.length - 1].end = end; blocks[blocks.length - 1].targetsByRoom = targetsByRoom; blocks[blocks.length - 1].totalTargets = totalTargets; }
  }
  var merged = [];
  for (var j = 0; j < blocks.length; j++) {
    var b = blocks[j]; if (b.end <= b.start) continue;
    if (!merged.length || !arraysEqual(merged[merged.length - 1].rooms, b.rooms))
      merged.push({ rooms: b.rooms.slice(), start: b.start, end: b.end, targetsByRoom: b.targetsByRoom, totalTargets: b.totalTargets });
    else { merged[merged.length - 1].end = b.end; merged[merged.length - 1].targetsByRoom = b.targetsByRoom; merged[merged.length - 1].totalTargets = b.totalTargets; }
  }
  var currentBlock = null;
  for (var k = merged.length - 1; k >= 0; k--) { if (merged[k].start <= now && merged[k].end >= now) { currentBlock = merged[k]; break; } }
  if (!currentBlock && merged.length) currentBlock = merged[merged.length - 1];
  return { rooms: currentBlock ? currentBlock.rooms.slice() : [], targetsByRoom: currentBlock ? (currentBlock.targetsByRoom || {}) : {}, totalTargets: currentBlock ? (currentBlock.totalTargets || 0) : 0, currentBlock: currentBlock, blocks: merged };
}
function computeNextLocationSnapshot(hub, now) { return getStableLocationSnapshot(hub, now); }
function updateLocationMetadata(snap, rooms) {
  currentLocationTotalTargets = snap.totalTargets || 0;
  currentLocationIsMultipleRooms = rooms.length > 1;
  currentLocationIsMultiplePeople = rooms.length === 1 ? ((snap.targetsByRoom && snap.targetsByRoom[rooms[0]]) || 0) > 1 : false;
}
function evaluateCurrentLocation(hub) {
  var now = Date.now();
  if (residentState !== "AT_HOME") {
    currentLocationRooms = []; currentLocationStartTs = null;
    currentLocationTotalTargets = 0; currentLocationIsMultipleRooms = false; currentLocationIsMultiplePeople = false;
    pendingLocationRooms = null; pendingLocationSince = null; return;
  }
  var snap = computeNextLocationSnapshot(hub, now), block = snap.currentBlock;
  var nr = block && block.rooms ? block.rooms.slice() : [];
  if (!nr.length) {
    if (currentLocationRooms.length) {
      if (!pendingLocationRooms || pendingLocationRooms.length !== 0) { pendingLocationRooms = []; pendingLocationSince = now; return; }
      if (now - pendingLocationSince < LOCATION_GAP_HOLD_MS) return;
    }
    currentLocationRooms = []; currentLocationStartTs = null;
    currentLocationTotalTargets = 0; currentLocationIsMultipleRooms = false; currentLocationIsMultiplePeople = false;
    pendingLocationRooms = null; pendingLocationSince = null; return;
  }
  if (!currentLocationRooms.length) { currentLocationRooms = nr; currentLocationStartTs = block.start || now; updateLocationMetadata(snap, nr); pendingLocationRooms = null; pendingLocationSince = null; return; }
  if (arraysEqual(currentLocationRooms, nr)) { currentLocationStartTs = block.start || currentLocationStartTs || now; updateLocationMetadata(snap, nr); pendingLocationRooms = null; pendingLocationSince = null; return; }
  if (!pendingLocationRooms || !arraysEqual(pendingLocationRooms, nr)) { pendingLocationRooms = nr.slice(); pendingLocationSince = now; return; }
  if (now - pendingLocationSince >= DEBOUNCE_MS) { currentLocationRooms = nr; currentLocationStartTs = block.start || now; updateLocationMetadata(snap, nr); pendingLocationRooms = null; pendingLocationSince = null; }
}
function computeLocationBlocks(hub, now) {
  var snap = getStableLocationSnapshot(hub, now);
  return (snap.blocks || []).map(function (b) { return { rooms: b.rooms.slice(), start: b.start, end: b.end }; });
}
function evaluateLocations(hub) {
  var now = Date.now();
  previousLocationRooms = []; previousLocationStartTs = null; previousLocationEndTs = null;
  var bl = computeLocationBlocks(hub, now); if (!bl.length) return;
  function same(a, b) { return a && b && a.length === b.length && a.every(function (v, i) { return v === b[i]; }); }
  function ok(r) { return r && r.length > 0; }
  function isShortEmptyGap(b) { return !ok(b.rooms) && (b.end - b.start) < LOCATION_GAP_HOLD_MS; }
  if (residentState === "AT_HOME") {
    if (!currentLocationStartTs || !currentLocationRooms || !currentLocationRooms.length) return;
    for (var i = bl.length - 1; i >= 0; i--) {
      var b = bl[i]; if (b.end > currentLocationStartTs) continue; if (isShortEmptyGap(b)) continue;
      if (!ok(b.rooms) || same(b.rooms, currentLocationRooms)) continue;
      previousLocationRooms = b.rooms.slice(); previousLocationStartTs = b.start; previousLocationEndTs = Math.min(b.end, currentLocationStartTs); return;
    }
  } else if (residentState === "OUT_OF_HOME") {
    if (!stateStartTs) return;
    for (var j = bl.length - 1; j >= 0; j--) {
      var pb = bl[j]; if (pb.end > stateStartTs) continue; if (isShortEmptyGap(pb)) continue; if (!ok(pb.rooms)) continue;
      previousLocationRooms = pb.rooms.slice(); previousLocationStartTs = pb.start; previousLocationEndTs = Math.min(pb.end, stateStartTs); return;
    }
  }
}

/***********************
 * ACTIVITY SERIES
 ***********************/
function backfillActivityFromHistory(hub) {
  var asset = getCurrentAsset(hub); if (!asset) return;
  var now = Date.now(), start = now - ACTIVITY_WINDOW_MS, pts = [];
  Object.values(asset.devices || {}).forEach(function (dev) {
    var tk = (dev.dataKeys || []).find(function (k) { return k.name === "ED_tier"; });
    if (!tk || !tk.data) return;
    tk.data.forEach(function (p) {
      var ts = Number(p.ts), v = Number(p.v);
      if (isFinite(ts) && isFinite(v) && ts >= start && ts <= now) pts.push({ ts: ts, v: v });
    });
  });
  pts.sort(function (a, b) { return a.ts - b.ts; }); activitySeries = pts;
}
function computeActivityMetrics(hub) {
  var asset = getCurrentAsset(hub);
  if (!asset) return { lastMoveTs: null, lastWalkTs: null, roomChanges: 0, roomsVisited: 0 };
  var lastMoveTs = null, lastWalkTs = null, roomsVisited = {}, events = [];
  Object.values(asset.devices || {}).forEach(function (d) {
    var room = resolveDeviceRoomName(d); if (!room) return;
    var tk = (d.dataKeys || []).find(function (k) { return k.name === "num_of_targets"; });
    if (tk && tk.data) { tk.data.forEach(function (p) {
      var ts = Number(p.ts), v = Number(p.v); if (!isFinite(ts) || !isFinite(v)) return;
      events.push({ ts: ts, type: "presence", room: room, active: v >= 1 });
      if (v >= 1) { roomsVisited[room] = true; if (lastMoveTs === null || ts > lastMoveTs) lastMoveTs = ts; }
    }); }
    var tierK = (d.dataKeys || []).find(function (k) { return k.name === "ED_tier"; });
    if (tierK && tierK.data) { tierK.data.forEach(function (p) {
      var ts = Number(p.ts), v = Number(p.v);
      if (!isFinite(ts) || !isFinite(v)) return;
      if (v >= 3 && (lastWalkTs === null || ts > lastWalkTs)) lastWalkTs = ts;
    }); }
  });
  if (!events.length) return { lastMoveTs: lastMoveTs, lastWalkTs: lastWalkTs, roomChanges: 0, roomsVisited: Object.keys(roomsVisited).length };
  events.sort(function (a, b) { if (a.ts !== b.ts) return a.ts - b.ts; if (a.type === b.type) return String(a.room).localeCompare(String(b.room)); return a.type === "presence" ? -1 : 1; });
  var activeRooms = {}, lastNonEmptyKey = null, roomChanges = 0, i = 0;
  function activeKey() { var rooms = Object.keys(activeRooms).filter(function (r) { return activeRooms[r]; }).sort(); return rooms.length ? rooms.join("|") : ""; }
  while (i < events.length) {
    var ts = events[i].ts;
    while (i < events.length && events[i].ts === ts) { var e = events[i]; if (e.type === "presence") { if (e.active) activeRooms[e.room] = true; else delete activeRooms[e.room]; } i++; }
    var key = activeKey();
    if (key) { if (lastNonEmptyKey !== null && lastNonEmptyKey !== key) roomChanges++; lastNonEmptyKey = key; }
  }
  return { lastMoveTs: lastMoveTs, lastWalkTs: lastWalkTs, roomChanges: roomChanges, roomsVisited: Object.keys(roomsVisited).length };
}

/***********************
 * TIMELINE BUILDERS
 ***********************/
function build24hTimelineBlocks(hub, startTs, endTs) {
  var stableBlocks = computeLocationBlocks(hub, endTs), blocks = [], cursor = startTs;
  function pushBlock(rooms, start, end) {
    if (!(end > start)) return; var r = rooms && rooms.length ? rooms.slice() : [];
    blocks.push({ rooms: r, start: start, end: end, key: blockKey(r) });
  }
  if (!stableBlocks || !stableBlocks.length) { pushBlock([], startTs, endTs); return blocks; }
  for (var i = 0; i < stableBlocks.length; i++) {
    var b = stableBlocks[i]; if (b.end <= startTs || b.start >= endTs) continue;
    var s = Math.max(b.start, startTs), e = Math.min(b.end, endTs);
    if (s > cursor) pushBlock([], cursor, s); pushBlock(b.rooms, s, e); cursor = Math.max(cursor, e);
  }
  if (cursor < endTs) pushBlock([], cursor, endTs);
  if (!blocks.length) pushBlock([], startTs, endTs);
  return blocks;
}

/***********************
 * UPDATED: buildOvernightBlocks now uses ED_tier
 * Returns blocks with keys: "away" (tier 0 / no presence),
 *   "rest" (tier 1), "move" (tier 2), "walk" (tier 3)
 ***********************/
function buildOvernightBlocks(hub, startTs, endTs) {
  var asset = getCurrentAsset(hub); if (!asset) return [];
  var mMs = 60000, tm = Math.floor((endTs - startTs) / mMs);
  /* per-minute tier: 0 = away/no presence, 1 = rest, 2 = move, 3 = walk */
  var ms = new Array(tm); for (var i = 0; i < tm; i++) ms[i] = 0;

  Object.values(asset.devices || {}).forEach(function (d) {
    var rm = resolveDeviceRoomName(d); if (!rm || rm.toLowerCase() !== "bedroom") return;
    var tk = (d.dataKeys || []).find(function (k) { return k.name === "num_of_targets"; });
    var tierK = (d.dataKeys || []).find(function (k) { return k.name === "ED_tier"; });
    if (!tk || !tk.data || !tk.data.length) return;

    var hasTierData = !!(tierK && tierK.data && tierK.data.length);
    var td = hasTierData ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
    var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
    var ti = 0, pi = 0, cTier = 0, cTarg = 0;

    while (pi < pd.length && Number(pd[pi].ts) <= startTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
    while (ti < td.length && Number(td[ti].ts) <= startTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }

    for (var mn = 0; mn < tm; mn++) {
      var me = startTs + (mn + 1) * mMs;
      while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
      if (cTarg < 1) continue; /* no presence → stays 0 (away) */

      /* Use ED_tier directly: clamp to 1-3, fall back to 1 if no tier data */
      var tierVal;
      if (!hasTierData) {
        tierVal = 1; /* default to resting when no tier data available */
      } else {
        tierVal = cTier; /* raw ED_tier value */
        if (tierVal < 1) tierVal = 1; /* present but tier 0 → treat as resting */
        if (tierVal > 3) tierVal = 3;
      }
      if (tierVal > ms[mn]) ms[mn] = tierVal;
    }
  });

  /* Map minute values to tier keys */
  var tierKeyMap = { 0: "away", 1: "rest", 2: "move", 3: "walk" };
  var blocks = [], curKey = tierKeyMap[ms.length ? ms[0] : 0], bStart = startTs;
  for (var j = 1; j < tm; j++) {
    var newKey = tierKeyMap[ms[j]];
    if (newKey !== curKey) {
      blocks.push({ key: curKey, start: bStart, end: startTs + j * mMs });
      bStart = startTs + j * mMs;
      curKey = newKey;
    }
  }
  blocks.push({ key: curKey, start: bStart, end: endTs });
  return blocks;
}

function computeHourlyBreakdown(hub, startTs, endTs) {
  var asset = getCurrentAsset(hub), mMs = 60000, tm = Math.floor((endTs - startTs) / mMs);
  if (!asset) { var empty = []; for (var e = 0; e < 24; e++) empty.push({ away: 60, rest: 0, move: 0, walk: 0, multi: 0 }); return empty; }
  var ms = new Array(tm); for (var i = 0; i < tm; i++) ms[i] = 0;
  var roomPresence = {};
  Object.values(asset.devices || {}).forEach(function (d) {
    var rm = resolveDeviceRoomName(d); if (!rm) return;
    var tk = (d.dataKeys || []).find(function (k) { return k.name === "num_of_targets"; });
    var tierK = (d.dataKeys || []).find(function (k) { return k.name === "ED_tier"; });
    if (!tk || !tk.data || !tk.data.length) return;
    var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
    var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
    var ti = 0, pi = 0, cTier = 0, cTarg = 0;
    while (pi < pd.length && Number(pd[pi].ts) <= startTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
    while (ti < td.length && Number(td[ti].ts) <= startTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
    for (var mn = 0; mn < tm; mn++) {
      var me = startTs + (mn + 1) * mMs;
      while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
      if (cTarg < 1) continue;
      if (!roomPresence[mn]) roomPresence[mn] = {}; roomPresence[mn][rm] = true;
      var s = cTier; if (s > ms[mn]) ms[mn] = s;
    }
  });
  for (var mi = 0; mi < tm; mi++) { if (roomPresence[mi] && Object.keys(roomPresence[mi]).length > 1) ms[mi] = 4; }
  var buckets = []; for (var h = 0; h < 24; h++) buckets.push({ away: 0, rest: 0, move: 0, walk: 0, multi: 0 });
  for (var j = 0; j < tm; j++) {
    var hr = Math.floor(j / 60); if (hr >= 24) break;
    var st = ms[j];
    if (st === 0) buckets[hr].away++; else if (st === 1) buckets[hr].rest++; else if (st === 2) buckets[hr].move++; else if (st === 3) buckets[hr].walk++; else if (st === 4) buckets[hr].multi++;
  }
  return buckets;
}

function computeRoomTierSeries(hub, startTs, endTs) {
  var asset = getCurrentAsset(hub), mMs = 60000, tm = Math.floor((endTs - startTs) / mMs);
  var ms = new Array(tm); for (var i = 0; i < tm; i++) ms[i] = { rooms: {}, tier: -1 };
  var roomSet = {}; if (!asset) return { minutes: ms, rooms: [] };
  Object.values(asset.devices || {}).forEach(function (d) {
    var rm = resolveDeviceRoomName(d); if (!rm) return;
    var tk = (d.dataKeys || []).find(function (k) { return k.name === "num_of_targets"; });
    var tierK = (d.dataKeys || []).find(function (k) { return k.name === "ED_tier"; });
    if (!tk || !tk.data || !tk.data.length) return;
    var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
    var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
    var ti = 0, pi = 0, cTier = 0, cTarg = 0;
    while (pi < pd.length && Number(pd[pi].ts) <= startTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
    while (ti < td.length && Number(td[ti].ts) <= startTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
    for (var mn = 0; mn < tm; mn++) {
      var me = startTs + (mn + 1) * mMs;
      while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
      if (cTarg < 1) continue; ms[mn].rooms[rm] = true; roomSet[rm] = true;
      if (cTier > ms[mn].tier) ms[mn].tier = cTier;
    }
  });
  return { minutes: ms, rooms: Object.keys(roomSet).sort() };
}

function computeNightHourlyBreakdown(hub, startTs, endTs) {
  var mMs = 60000, tm = Math.floor((endTs - startTs) / mMs), asset = getCurrentAsset(hub);
  var ms = new Array(tm); for (var m = 0; m < tm; m++) ms[m] = 0;
  if (!asset) return packNight();
  var roomPresence = {};
  Object.values(asset.devices || {}).forEach(function (d) {
    var rm = resolveDeviceRoomName(d); if (!rm || rm.toLowerCase() !== "bedroom") return;
    var tk = (d.dataKeys || []).find(function (k) { return k.name === "num_of_targets"; });
    var tierK = (d.dataKeys || []).find(function (k) { return k.name === "ED_tier"; });
    if (!tk || !tk.data || !tk.data.length) return;
    var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
    var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
    var ti = 0, pi = 0, cTier = 0, cTarg = 0;
    while (pi < pd.length && Number(pd[pi].ts) <= startTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
    while (ti < td.length && Number(td[ti].ts) <= startTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
    for (var mn = 0; mn < tm; mn++) {
      var me = startTs + (mn + 1) * mMs;
      while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
      if (cTarg < 1) continue;
      if (!roomPresence[mn]) roomPresence[mn] = 0; roomPresence[mn] += cTarg;
      var ds = cTier >= 2 ? 2 : cTier >= 1 ? 1 : 0; if (ds > ms[mn]) ms[mn] = ds;
    }
  });
  for (var mi = 0; mi < tm; mi++) { if (roomPresence[mi] && roomPresence[mi] >= 2 && ms[mi] > 0) ms[mi] = 3; }
  return packNight();
  function packNight() {
    var b = []; for (var h = 0; h < 12; h++) b.push({ out: 0, rest: 0, active: 0, multi: 0 });
    for (var i = 0; i < tm; i++) { var hr = Math.floor(i / 60); if (hr >= 12) break; var st = ms[i]; if (st === 0) b[hr].out++; else if (st === 1) b[hr].rest++; else if (st === 2) b[hr].active++; else if (st === 3) b[hr].multi++; }
    return b;
  }
}

function computeOvernightRoomTierSeries(hub, startTs, endTs) {
  var asset = getCurrentAsset(hub); if (!asset) return { minutes: [], zones: [] };
  var mMs = 60000, tm = Math.floor((endTs - startTs) / mMs);
  var ms = new Array(tm); for (var i = 0; i < tm; i++) ms[i] = { zone: "none", tier: -1 };
  var zoneSet = {};
  Object.values(asset.devices || {}).forEach(function (d) {
    var rm = resolveDeviceRoomName(d); if (!rm) return; var rmLow = rm.toLowerCase();
    var tk = (d.dataKeys || []).find(function (k) { return k.name === "num_of_targets"; });
    var tierK = (d.dataKeys || []).find(function (k) { return k.name === "ED_tier"; });
    if (!tk || !tk.data || !tk.data.length) return;
    var zoneK = (d.dataKeys || []).find(function (k) { return k.name === "zone" || k.name === "ED_zone"; });
    var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
    var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
    var zd = zoneK && zoneK.data ? zoneK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
    var ti = 0, pi = 0, zi = 0, cTier = 0, cTarg = 0, cZone = "";
    while (pi < pd.length && Number(pd[pi].ts) <= startTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
    while (ti < td.length && Number(td[ti].ts) <= startTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
    while (zi < zd.length && Number(zd[zi].ts) <= startTs) { cZone = String(zd[zi].v || "").toLowerCase(); zi++; }
    for (var mn = 0; mn < tm; mn++) {
      var me = startTs + (mn + 1) * mMs;
      while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
      while (zi < zd.length && Number(zd[zi].ts) <= me) { cZone = String(zd[zi].v || "").toLowerCase(); zi++; }
      if (cTarg < 1) continue;
      var z; if (cZone === "bed") z = "bed"; else if (rmLow === "bedroom") z = "bedroom"; else if (rmLow === "bathroom") z = "bathroom"; else z = "other";
      var zPriority = { bed: 4, bedroom: 3, bathroom: 2, other: 1, none: 0 };
      if (zPriority[z] > (zPriority[ms[mn].zone] || 0)) ms[mn].zone = z; zoneSet[z] = true;
      if (z === "bed" || z === "bedroom") { if (cTier > ms[mn].tier) ms[mn].tier = cTier; }
    }
  });
  return { minutes: ms, zones: Object.keys(zoneSet).sort() };
}

function computeNightEvents(hub, startTs, endTs) {
  var asset = getCurrentAsset(hub);
  if (!asset) return { movementInBed: 0, bathroomVisits: 0, timesOutOfBed: 0, timeOutOfBedMs: 0 };
  var mMs = 60000, tm = Math.floor((endTs - startTs) / mMs);
  var bedMin = new Array(tm), bathMin = new Array(tm);
  for (var i = 0; i < tm; i++) { bedMin[i] = 0; bathMin[i] = 0; }
  Object.values(asset.devices || {}).forEach(function (d) {
    var rm = resolveDeviceRoomName(d); if (!rm) return;
    var isbed = rm.toLowerCase() === "bedroom", isbath = rm.toLowerCase() === "bathroom";
    if (!isbed && !isbath) return;
    var tk = (d.dataKeys || []).find(function (k) { return k.name === "num_of_targets"; });
    var tierK = (d.dataKeys || []).find(function (k) { return k.name === "ED_tier"; });
    if (!tk || !tk.data || !tk.data.length) return;
    var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
    var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
    var ti = 0, pi = 0, cTier = 0, cTarg = 0;
    while (pi < pd.length && Number(pd[pi].ts) <= startTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
    while (ti < td.length && Number(td[ti].ts) <= startTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
    for (var mn = 0; mn < tm; mn++) {
      var me = startTs + (mn + 1) * mMs;
      while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
      if (cTarg < 1) continue;
      if (isbed) { var s = (cTier >= 2) ? 2 : (cTier >= 1) ? 1 : 0; if (s > bedMin[mn]) bedMin[mn] = s; }
      if (isbath) bathMin[mn] = 1;
    }
  });
  var movementInBed = 0, inMove = false;
  for (var m = 0; m < tm; m++) { if (bedMin[m] === 2) { if (!inMove) { movementInBed++; inMove = true; } } else inMove = false; }
  var bathroomVisits = 0, inBath = false;
  for (var b = 0; b < tm; b++) { if (bathMin[b] === 1) { if (!inBath) { bathroomVisits++; inBath = true; } } else inBath = false; }
  var timesOut = 0, timeOutMin = 0, wasOut = false;
  var firstInBed = -1; for (var f = 0; f < tm; f++) { if (bedMin[f] > 0) { firstInBed = f; break; } }
  var lastInBed = -1; for (var l = tm - 1; l >= 0; l--) { if (bedMin[l] > 0) { lastInBed = l; break; } }
  if (firstInBed >= 0 && lastInBed > firstInBed) {
    for (var o = firstInBed; o <= lastInBed; o++) { if (bedMin[o] === 0) { timeOutMin++; if (!wasOut) { timesOut++; wasOut = true; } } else wasOut = false; }
  }
  return { movementInBed: movementInBed, bathroomVisits: bathroomVisits, timesOutOfBed: timesOut, timeOutOfBedMs: timeOutMin * mMs };
}

/***********************
 * BUILD PAGES (skeleton placeholders)
 ***********************/
function buildPage1() {
  var p = document.createElement("div"); p.className = "page";
  p.innerHTML =
    '<div class="card is-loading" id="card-1">' +
      '<div class="card-title">Resident State</div>' +
      skelTitle() + skelLine('w60') + skelChips(2) +
      '<div class="resident-title"></div>' +
      '<div class="resident-duration"></div>' +
      '<div class="resident-chip-row"></div>' +
      '<div class="movement-pill-row"></div>' +
    '</div>' +
    '<div class="card is-loading" id="card-11">' +
      '<div class="activity-block">' +
        '<div class="activity-title">Activity \u2014 past 3 hours</div>' +
        '<canvas class="activity-graph" style="display:none"></canvas>' +
        skelGraph() +
      '</div>' +
      '<div class="activity-metrics" style="display:none">' +
        '<div class="metric-row"><span>Last movement</span><span class="m-last-move">\u2014</span></div>' +
        '<div class="metric-row"><span>Room changes (3h)</span><span class="m-room-changes">\u2014</span></div>' +
        '<div class="metric-row"><span>Last walked</span><span class="m-last-walk">\u2014</span></div>' +
        '<div class="metric-row"><span>Rooms visited (3h)</span><span class="m-room-visited">\u2014</span></div>' +
      '</div>' +
      skelMetrics(4) +
    '</div>' +
    '<div class="card is-loading" id="card-2">' +
      '<div class="card-title">Current Location</div>' +
      skelTitle() + skelLine('w50') +
      '<div class="location-main"></div>' +
      '<div class="location-sub"></div>' +
      '<div class="chip-row"></div>' +
    '</div>' +
    '<div class="card is-loading" id="card-3">' +
      '<div class="card-title">Previous Location</div>' +
      skelTitle() + skelLine('w60') +
    '</div>' +
    '<div class="card is-loading" id="card-6">' +
      '<div class="card-title">Device Status</div>' +
      skelTitle() + skelLine('w40') +
    '</div>';
  return p;
}
function buildPage2() {
  var p = document.createElement("div"); p.className = "page";
  p.innerHTML =
    '<div class="card is-loading" id="card-4">' +
      '<div class="card-title">Last 24 hours - activity</div>' +
      '<div class="timeline24">' +
        '<div class="timeline24-bar"><div class="timeline24-segs"></div></div>' +
        '<div class="timeline24-axis"><span class="t24-l"></span><span class="t24-m"></span><span class="t24-r"></span></div>' +
      '</div>' +
      skelBar() +
      '<div class="timeline24-legend"></div>' +
    '</div>' +
    '<div class="card is-loading" id="card-7">' +
      '<div class="card-title">Hourly behaviour breakdown</div>' +
      skelGraph() +
      '<div class="hourly-stack"></div><div class="hourly-stack-axis"></div><div class="hourly-stack-legend"></div>' +
      '<div class="daily-dist-wrap"><div class="daily-dist-title">Daily Distribution Summary</div><div class="daily-dist-grid"></div></div>' +
      '<div class="snapshot-pills-wrap"><div class="snapshot-pills-grid"></div></div>' +
    '</div>' +
    '<div class="card is-loading" id="card-8">' +
      '<div class="card-title">Daily Distribution Summary, by Room</div>' +
      '<div class="room-ribbon-wrap"><canvas class="room-ribbon-canvas"></canvas><div class="room-ribbon-axis"></div></div>' +
      skelGraph() +
      '<div class="room-ribbon-legend"></div>' +
      '<div class="room-dist-wrap"><div class="room-dist-title">Time per room</div><div class="room-dist-grid"></div></div>' +
    '</div>';
  return p;
}
function buildPage3() {
  var p = document.createElement("div"); p.className = "page";
  p.innerHTML =
    '<div class="card is-loading" id="card-5">' +
      '<div class="card-title">Bedroom - overnight activity (21:00 - 09:00)</div>' +
      skelBar() + skelLine('w60') +
    '</div>' +
    '<div class="card is-loading" id="card-10">' +
      '<div class="card-title">In-Bed Summary (21:00 \u2013 09:00)</div>' +
      '<div class="inbed-donut-wrap"><canvas class="inbed-donut-canvas"></canvas><div class="inbed-donut-totals"></div></div>' +
      '<div style="display:flex;align-items:center;gap:24px;margin-top:12px;flex-wrap:wrap">' +
        '<div class="skel skel-donut"></div>' +
        '<div style="flex:1;min-width:120px">' + skelLine('w80') + skelLine('w60') + skelLine('w80') + '</div>' +
      '</div>' +
    '</div>' +
    '<div class="card is-loading" id="card-11n">' +
      '<div class="card-title">Night Events (21:00 \u2013 09:00)</div>' +
      '<div class="night-events-grid"></div>' +
      skelMetrics(4) +
    '</div>' +
    '<div class="card is-loading" id="card-12">' +
      '<div class="card-title">Overnight Room Activity (21:00 \u2013 09:00)</div>' +
      '<div class="overnight-ribbon-wrap"><canvas class="overnight-ribbon-canvas"></canvas><div class="overnight-ribbon-axis"></div></div>' +
      skelGraph() +
      '<div class="overnight-ribbon-legend"></div>' +
    '</div>' +
    '<div class="card is-loading" id="card-9">' +
      '<div class="card-title">Night Hourly Breakdown (21:00 \u2013 09:00)</div>' +
      skelGraph() +
      '<div class="night-hourly-stack"></div><div class="night-hourly-axis"></div><div class="night-hourly-legend"></div>' +
      '<div class="night-dist-wrap"><div class="night-dist-title">Overnight Distribution</div><div class="night-dist-grid"></div></div>' +
    '</div>';
  return p;
}

/***********************
 * RENDER FUNCTIONS
 ***********************/
function clearSkeletons(card) {
  if (!card) return;
  var skels = card.querySelectorAll(".skel");
  for (var i = 0; i < skels.length; i++) { if (skels[i].parentNode) skels[i].parentNode.removeChild(skels[i]); }
  var smr = card.querySelectorAll(".skel-metric-row");
  for (var j = 0; j < smr.length; j++) { if (smr[j].parentNode) smr[j].parentNode.removeChild(smr[j]); }
  var hidden = card.querySelectorAll('[style*="display:none"]');
  for (var k = 0; k < hidden.length; k++) {
    var el = hidden[k];
    if (el.classList.contains("activity-graph") || el.classList.contains("activity-metrics")) {
      el.style.display = "";
    }
  }
}

function renderAll(hub, container) {
  if (!residentState) return;
  renderCard1(hub, container);
  renderResidentChips(container);
  renderMovementPill(container);
  renderCurrentLocationCard(hub, container);
  renderPreviousLocationCard(hub, container);
  renderCard4(hub, container);
  renderCard5(hub, container);
  renderCard6(hub, container);
  if (currentAssetHasTier) {
    renderCard8(hub, container);
    renderActivityMetrics(hub, container);
    renderActivityGraph(container);
    renderCard7(hub, container);
    renderCard10(hub, container);
    renderCard11n(hub, container);
    renderCard12(hub, container);
    renderCard9(hub, container);
  }
}

function renderCard1(hub, container) {
  var c = container.querySelector("#card-1"); if (!c) return;
  clearSkeletons(c);
  var t = c.querySelector(".resident-title"); if (!t) return;
  t.textContent = residentState === "AT_HOME" ? "At home" : residentState === "OUT_OF_HOME" ? "Out of home" : "Offline";
  updateDuration(hub, container);
}
function updateDuration(hub, container) {
  var c = container.querySelector("#card-1"); if (!c) return;
  var el = c.querySelector(".resident-duration"); if (!el || !stateStartTs) return;
  var tm = Math.floor((Date.now() - stateStartTs) / 60000);
  el.textContent = "Since " + formatTimeShort(stateStartTs, getAssetTimezone(hub)) +
    " \u00B7 " + (tm < 60 ? tm + " minute(s) ago" : Math.floor(tm / 60) + " hour(s) " + (tm % 60) + " minute(s) ago");
}
function renderResidentChips(container) {
  var c = container.querySelector("#card-1"); if (!c) return;
  var r = c.querySelector(".resident-chip-row"); if (!r) return; r.innerHTML = "";
  if (residentState !== "AT_HOME") return;
  function add(txt) { var ch = document.createElement("span"); ch.className = "chip chip-warn"; ch.textContent = txt; r.appendChild(ch); }
  if (currentLocationIsMultipleRooms) { add("Visitor detected"); return; }
  if (currentLocationTotalTargets > 2) add("Visitors detected");
  else if (currentLocationTotalTargets > 1) add("Visitor detected");
}
function renderMovementPill(container) {
  var c = container.querySelector("#card-1"); if (!c) return;
  var r = c.querySelector(".movement-pill-row"); if (!r) return; r.innerHTML = "";
  if (!currentAssetHasTier) return;
  if (residentState !== "AT_HOME" || currentLocationIsMultipleRooms || currentLocationIsMultiplePeople) return;
  Object.keys(movementTiersByDevice).forEach(function (id) {
    var st = movementTiersByDevice[id]; if (st.tier === null) return;
    var txt = st.tier === 0 ? "Away" : st.tier === 1 ? "Resting" : st.tier === 2 ? "Moving" : "Walking";
    var cls = st.tier === 0 ? "pill-away" : st.tier === 1 ? "pill-rest" : st.tier === 2 ? "pill-move" : "pill-walk";
    var el = document.createElement("span"); el.className = "movement-pill " + cls;
    el.textContent = txt; el.setAttribute("data-tooltip", "Movement intensity from active sensor");
    r.appendChild(el);
  });
}
function renderActivityMetrics(hub, container) {
  var c = container.querySelector("#card-11"); if (!c) return;
  clearSkeletons(c);
  var d = computeActivityMetrics(hub); if (!d) return;
  function fmt(ts) { return !ts ? "\u2014" : formatDuration(Date.now() - ts); }
  var el;
  el = c.querySelector(".m-last-move"); if (el) el.textContent = fmt(d.lastMoveTs);
  el = c.querySelector(".m-last-walk"); if (el) el.textContent = fmt(d.lastWalkTs);
  el = c.querySelector(".m-room-changes"); if (el) el.textContent = d.roomChanges;
  el = c.querySelector(".m-room-visited"); if (el) el.textContent = d.roomsVisited;
}
function renderActivityGraph(container) {
  var c = container.querySelector("#card-11"); if (!c) return;
  var cv = c.querySelector(".activity-graph"); if (!cv) return;
  var ctx = cv.getContext("2d");
  var w = cv.clientWidth || 300, h = 80;
  var LC = 40, pad = { top: 6, bottom: 16, left: LC, right: 8 };
  cv.width = w; cv.height = h; ctx.clearRect(0, 0, w, h);
  var now = Date.now(), start = now - ACTIVITY_WINDOW_MS;
  var windowPts = activitySeries.filter(function (p) { return p && isFinite(Number(p.ts)) && isFinite(Number(p.v)) && Number(p.ts) >= start && Number(p.ts) <= now; }).sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
  var carry = null;
  for (var i = 0; i < activitySeries.length; i++) { var ap = activitySeries[i], ats = Number(ap.ts), av = Number(ap.v); if (!isFinite(ats) || !isFinite(av)) continue; if (ats <= start) carry = { ts: ats, v: av }; else break; }
  if (!windowPts.length && !carry) return;
  function clampTier(v) { v = Number(v); if (!isFinite(v)) return 0; if (v <= 0) return 0; if (v >= 3) return 3; return Math.round(v); }
  function norm(v) { return v <= 0 ? 0.0 : v === 1 ? 0.33 : v === 2 ? 0.67 : 1.0; }
  function yf(v) { return h - pad.bottom - v * (h - pad.top - pad.bottom); }
  function xf(ts) { return pad.left + ((ts - start) / ACTIVITY_WINDOW_MS) * (w - pad.left - pad.right); }
  ctx.font = "9px system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
  [{ v: 1.0, l: "Walking" }, { v: 0.67, l: "Moving" }, { v: 0.33, l: "Resting" }].forEach(function (g) {
    var y = yf(g.v); ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
    ctx.fillStyle = "#8c8a84"; ctx.fillText(g.l, pad.left - 6, y);
  });
  ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  [{ h: 3, l: "3h ago" }, { h: 2, l: "2h" }, { h: 1, l: "1h" }, { h: 0, l: "now" }].forEach(function (m) { ctx.fillStyle = "#8c8a84"; ctx.fillText(m.l, xf(now - m.h * 3600000), h - 2); });
  var pts = []; pts.push({ ts: start, v: clampTier(carry ? carry.v : (windowPts.length ? windowPts[0].v : 0)) });
  for (var j = 0; j < windowPts.length; j++) { var p = windowPts[j], ts = Number(p.ts), v = clampTier(p.v); if (ts < start || ts > now) continue; if (pts.length && ts === pts[pts.length - 1].ts) pts[pts.length - 1].v = v; else pts.push({ ts: ts, v: v }); }
  if (!pts.length || pts[pts.length - 1].ts < now) pts.push({ ts: now, v: pts.length ? pts[pts.length - 1].v : 0 });
  ctx.beginPath(); ctx.moveTo(xf(pts[0].ts), yf(norm(pts[0].v)));
  for (var k = 1; k < pts.length; k++) { var prev = pts[k - 1], cur = pts[k]; var x1 = xf(cur.ts), y0 = yf(norm(prev.v)), y1 = yf(norm(cur.v)); ctx.lineTo(x1, y0); if (y1 !== y0) ctx.lineTo(x1, y1); }
  ctx.strokeStyle = "#6F97A0"; ctx.lineWidth = 2.25; ctx.lineCap = "butt"; ctx.lineJoin = "miter"; ctx.stroke();
}
function renderCurrentLocationCard(hub, container) {
  var c = container.querySelector("#card-2"); if (!c) return;
  clearSkeletons(c);
  var me = c.querySelector(".location-main"), se = c.querySelector(".location-sub"), cr = c.querySelector(".chip-row");
  if (!me || !se || !cr) return; cr.innerHTML = "";
  if (residentState === "OFFLINE") { me.textContent = "Offline"; se.textContent = ""; return; }
  if (residentState !== "AT_HOME" || !currentLocationRooms.length) { me.textContent = "No active rooms"; se.textContent = ""; return; }
  me.textContent = currentLocationRooms.join(" \u00B7 ");
  if (currentLocationStartTs) {
    var mn = Math.floor((Date.now() - currentLocationStartTs) / 60000);
    se.textContent = "Since " + formatTimeShort(currentLocationStartTs, getAssetTimezone(hub)) + " \u00B7 " + (mn < 60 ? mn + " minute(s) ago" : Math.floor(mn / 60) + " hour(s) " + (mn % 60) + " minute(s) ago");
  } else se.textContent = "";
  if (currentLocationIsMultipleRooms) { var ch = document.createElement("span"); ch.className = "chip chip-warn"; ch.textContent = "Multiple rooms"; cr.appendChild(ch); }
}
function renderPreviousLocationCard(hub, container) {
  var c = container.querySelector("#card-3"); if (!c) return; clearSkeletons(c); c.innerHTML = "";
  if (!previousLocationRooms.length || !previousLocationStartTs || !previousLocationEndTs) {
    c.innerHTML = '<div class="card-title">Previous Location</div><div class="location-sub">No previous location</div>'; return;
  }
  var dms = previousLocationEndTs - previousLocationStartTs;
  var dt = dms < 60000 ? "< 1 min" : fmtHM(Math.floor(dms / 60000));
  var ut = formatTimeShort(previousLocationEndTs, getAssetTimezone(hub));
  c.innerHTML = '<div class="card-title">Previous Location</div><div class="location-main">' + previousLocationRooms.join(" \u00B7 ") + '</div><div class="location-sub">Until ' + ut + ' \u00B7 ' + dt + '</div>';
}
function renderCard4(hub, container) {
  var c = container.querySelector("#card-4"); if (!c) return; clearSkeletons(c);
  var sw = c.querySelector(".timeline24-segs"), lg = c.querySelector(".timeline24-legend");
  var aL = c.querySelector(".t24-l"), aM = c.querySelector(".t24-m"), aR = c.querySelector(".t24-r");
  if (!sw || !lg) return;
  var tzIana = getAssetTimezone(hub);
  var eTs = getLatestTelemetryTs(hub) || Date.now(); eTs = Math.floor(eTs / 60000) * 60000; var sTs = eTs - 86400000;
  var bl = build24hTimelineBlocks(hub, sTs, eTs); sw.innerHTML = ""; lg.innerHTML = "";
  var sp = eTs - sTs, tots = {};
  bl.forEach(function (b) {
    var left = ((b.start - sTs) / sp) * 100, width = ((b.end - b.start) / sp) * 100;
    tots[b.key] = (tots[b.key] || 0) + ((b.end - b.start) / 60000);
    var ck = b.key === "multi" ? "multi" : b.key === "none" ? "none" : b.key.replace("room:", "").toLowerCase();
    var col = ROOM_COLORS[ck] || "#ccc";
    var nm = b.key === "multi" ? "Multiple Detections" : b.key === "none" ? "No detection" : b.key.replace("room:", "");
    var dm = Math.max(1, Math.round((b.end - b.start) / 60000));
    var tt = nm + " \u2022 " + formatTimeShort(b.start, tzIana) + " - " + formatTimeShort(b.end, tzIana) + " \u2022 " + (dm < 60 ? dm + " min" : Math.floor(dm / 60) + "h " + (dm % 60) + "m");
    var d = document.createElement("div"); d.className = "timeline24-seg"; d.style.left = left + "%"; d.style.width = width + "%"; d.style.background = col;
    d.addEventListener("mouseenter", function (e) { showTimelineTooltip(tt, e.clientX, e.clientY); });
    d.addEventListener("mousemove", function (e) { showTimelineTooltip(tt, e.clientX, e.clientY); });
    d.addEventListener("mouseleave", hideTimelineTooltip); sw.appendChild(d);
  });
  if (aL) aL.textContent = formatTimeShort(sTs, tzIana);
  if (aM) aM.textContent = formatTimeShort(sTs + sp / 2, tzIana);
  if (aR) aR.textContent = formatTimeShort(eTs, tzIana);
  Object.keys(tots).forEach(function (k) {
    var ck = k === "multi" ? "multi" : k === "none" ? "none" : k.replace("room:", "").toLowerCase();
    var nm = k === "multi" ? "Multiple Detections" : k === "none" ? "No detection" : k.replace("room:", "");
    var r = document.createElement("div"); r.className = "t24-row";
    r.innerHTML = '<div class="t24-left"><span class="t24-dot" style="background:' + (ROOM_COLORS[ck] || "#ccc") + '"></span><span>' + nm + '</span></div><div class="t24-dur">' + fmtHM(tots[k]) + '</div>';
    lg.appendChild(r);
  });
}
function renderCard7(hub, container) {
  var c7 = container.querySelector("#card-7"); if (!c7) return; clearSkeletons(c7);
  var tzIana = getAssetTimezone(hub);
  var eTs = getLatestTelemetryTs(hub) || Date.now(); eTs = Math.floor(eTs / 60000) * 60000; var sTs = eTs - 86400000;
  var bk = computeHourlyBreakdown(hub, sTs, eTs);
  var sc = c7.querySelector(".hourly-stack");
  if (sc) { sc.innerHTML = ""; for (var bi = 0; bi < bk.length; bi++) { var hr = bk[bi], tot = hr.away + hr.rest + hr.move + hr.walk + hr.multi; if (tot === 0) tot = 60; var bar = document.createElement("div"); bar.className = "hour-bar"; var segs = [{ v: hr.walk, c: "seg-walk" }, { v: hr.move, c: "seg-move" }, { v: hr.rest, c: "seg-rest" }, { v: hr.multi, c: "seg-multi" }, { v: hr.away, c: "seg-away" }]; for (var si = 0; si < segs.length; si++) { if (segs[si].v <= 0) continue; var sg = document.createElement("div"); sg.className = "hour-seg " + segs[si].c; sg.style.height = ((segs[si].v / tot) * 100) + "%"; bar.appendChild(sg); } sc.appendChild(bar); } }
  var ax = c7.querySelector(".hourly-stack-axis");
  if (ax) { ax.innerHTML = ""; for (var ai = 0; ai < 24; ai++) { var lb = document.createElement("span"); lb.className = "hour-axis-label"; var hh = getHourInTz(sTs + ai * 3600000, tzIana); lb.textContent = (hh < 10 ? "0" : "") + hh; ax.appendChild(lb); } }
  var sl = c7.querySelector(".hourly-stack-legend");
  if (sl) { sl.innerHTML = ""; var li = [{ c: "seg-walk", l: "Walking" }, { c: "seg-move", l: "Moving" }, { c: "seg-rest", l: "Resting" }, { c: "seg-multi", l: "Multiple Detections" }, { c: "seg-away", l: "Away" }]; for (var lii = 0; lii < li.length; lii++) { var lr = document.createElement("div"); lr.className = "hourly-legend-item"; lr.innerHTML = '<span class="hourly-legend-dot ' + li[lii].c + '"></span><span>' + li[lii].l + '</span>'; sl.appendChild(lr); } }
  var dg = c7.querySelector(".daily-dist-grid");
  if (dg) { dg.innerHTML = ""; var da = 0, dr = 0, dm = 0, dw = 0; for (var di = 0; di < bk.length; di++) { da += bk[di].away + bk[di].multi; dr += bk[di].rest; dm += bk[di].move; dw += bk[di].walk; } var dd = [{ l: "Away", v: da, cl: "#C9CCD1" }, { l: "Resting", v: dr, cl: "#7FBAC8" }, { l: "Moving", v: dm, cl: "#E8B86D" }, { l: "Walking", v: dw, cl: "#5BAD7A" }]; for (var dii = 0; dii < dd.length; dii++) { var di2 = document.createElement("div"); di2.className = "daily-dist-item"; di2.innerHTML = '<div class="daily-dist-left"><span class="daily-dist-dot" style="background:' + dd[dii].cl + '"></span><span>' + dd[dii].l + '</span></div><span class="daily-dist-val">' + fmtHM(dd[dii].v) + '</span>'; dg.appendChild(di2); } }
  var pg = c7.querySelector(".snapshot-pills-grid");
  if (pg) { pg.innerHTML = ""; var ah = 0, wm = 0; for (var pi = 0; pi < bk.length; pi++) { var b = bk[pi]; if (b.rest > 0 || b.move > 0 || b.walk > 0 || b.multi > 0) ah++; wm += b.walk; } var vs = {}, rc = 0, pk = ""; var pbl = build24hTimelineBlocks(hub, sTs, eTs); for (var pbi = 0; pbi < pbl.length; pbi++) { var pbk = pbl[pbi].key; if (pbk === "none") { pk = ""; continue; } if (pbk === "multi") { if (pk !== "multi") rc++; pk = "multi"; continue; } var prm = pbk.replace("room:", ""); vs[prm] = true; if (pbk !== pk && pk !== "") rc++; pk = pbk; } var pills = [{ v: ah + "h", l: "Active hours today" }, { v: fmtHM(wm), l: "Time spent walking" }, { v: String(Object.keys(vs).length), l: "Rooms visited today" }, { v: String(rc), l: "Room changes today" }]; for (var pli = 0; pli < pills.length; pli++) { var pill = document.createElement("div"); pill.className = "snapshot-pill"; pill.innerHTML = '<div class="snapshot-pill-value">' + pills[pli].v + '</div><div class="snapshot-pill-label">' + pills[pli].l + '</div>'; pg.appendChild(pill); } }
}
function renderCard8(hub, container) {
  var c8 = container.querySelector("#card-8"); if (!c8) return; clearSkeletons(c8);
  var tzIana = getAssetTimezone(hub);
  var eTs = getLatestTelemetryTs(hub) || Date.now(); eTs = Math.floor(eTs / 60000) * 60000; var sTs = eTs - 86400000;
  var data = computeRoomTierSeries(hub, sTs, eTs), ms = data.minutes;
  var cv = c8.querySelector(".room-ribbon-canvas"); if (!cv) return;
  var W = cv.clientWidth || 400, H = 140; cv.width = W; cv.height = H;
  var ctx = cv.getContext("2d"); ctx.clearRect(0, 0, W, H);
  var pad = { top: 14, bottom: 26, left: 8, right: 28 }, gW = W - pad.left - pad.right, gH = H - pad.top - pad.bottom;
  var tm = ms.length; if (!tm) return; var colW = gW / tm;
  for (var i = 0; i < tm; i++) { var x = pad.left + i * colW; var rk = Object.keys(ms[i].rooms).sort(); var col; if (!rk.length) col = ROOM_COLORS["none"] || "#DAD6CF"; else if (rk.length > 1) col = ROOM_COLORS["multi"] || "#DDE0B0"; else col = ROOM_COLORS[rk[0].toLowerCase()] || "#ccc"; ctx.fillStyle = col; ctx.fillRect(x, pad.top, Math.ceil(colW) + 1, gH); }
  if (currentAssetHasTier) {
    var maxTier = 3; ctx.beginPath(); var started = false;
    for (var j = 0; j < tm; j++) { var tier = ms[j].tier; if (tier < 0) { started = false; continue; } var lx = pad.left + (j + 0.5) * colW; var ly = pad.top + gH - (tier / maxTier) * gH; if (!started) { ctx.moveTo(lx, ly); started = true; } else ctx.lineTo(lx, ly); }
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
    ctx.beginPath(); started = false;
    for (var k = 0; k < tm; k++) { var t2 = ms[k].tier; if (t2 < 0) { started = false; continue; } var lx2 = pad.left + (k + 0.5) * colW; var ly2 = pad.top + gH - (t2 / maxTier) * gH; if (!started) { ctx.moveTo(lx2, ly2); started = true; } else ctx.lineTo(lx2, ly2); }
    ctx.strokeStyle = "rgba(60,60,58,0.55)"; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.font = "9px system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillStyle = "#8c8a84";
    for (var tl = 0; tl <= maxTier; tl++) { ctx.fillText("T" + tl, W - 2, pad.top + gH - (tl / maxTier) * gH); }
  }
  var ax = c8.querySelector(".room-ribbon-axis");
  if (ax) { ax.innerHTML = ""; [0,6,12,18,24].forEach(function (m) { var spn = document.createElement("span"); spn.textContent = formatTimeShort(sTs + m * 3600000, tzIana); ax.appendChild(spn); }); }
  var lg = c8.querySelector(".room-ribbon-legend");
  if (lg) { lg.innerHTML = ""; var tots = {}; for (var ri = 0; ri < tm; ri++) { var rks = Object.keys(ms[ri].rooms).sort(); var key; if (!rks.length) key = "none"; else if (rks.length > 1) key = "multi"; else key = rks[0]; tots[key] = (tots[key] || 0) + 1; } var keys = Object.keys(tots).sort(function (a, b) { return tots[b] - tots[a]; }); for (var ki = 0; ki < keys.length; ki++) { var rk2 = keys[ki], ck = rk2.toLowerCase(); var nm = rk2 === "none" ? "No detection" : rk2 === "multi" ? "Multiple Detections" : rk2; var r = document.createElement("div"); r.className = "rr-row"; r.innerHTML = '<div class="rr-left"><span class="rr-dot" style="background:' + (ROOM_COLORS[ck] || "#ccc") + '"></span><span>' + nm + '</span></div><div class="rr-dur">' + fmtHM(tots[rk2]) + '</div>'; lg.appendChild(r); } }
  var dg = c8.querySelector(".room-dist-grid");
  if (dg) { dg.innerHTML = ""; var roomMins = {}; for (var di = 0; di < tm; di++) { var drk = Object.keys(ms[di].rooms); for (var dr = 0; dr < drk.length; dr++) roomMins[drk[dr]] = (roomMins[drk[dr]] || 0) + 1; } var sortedRooms = Object.keys(roomMins).sort(function (a, b) { return roomMins[b] - roomMins[a]; }); for (var si = 0; si < sortedRooms.length; si++) { var srm = sortedRooms[si], scl = ROOM_COLORS[srm.toLowerCase()] || "#ccc"; var item = document.createElement("div"); item.className = "room-dist-item"; item.innerHTML = '<div class="room-dist-left"><span class="room-dist-dot" style="background:' + scl + '"></span><span>' + srm + '</span></div><span class="room-dist-val">' + fmtHM(roomMins[srm]) + '</span>'; dg.appendChild(item); } }
}

/***********************
 * UPDATED: renderCard5 now uses ED_tier keys
 ***********************/
function renderCard5(hub, container) {
  var c = container.querySelector("#card-5"); if (!c) return; clearSkeletons(c);
  var tzIana = getAssetTimezone(hub);
  var ow = overnightWindowInTz(tzIana);
  var start = ow.startTs, end = ow.endTs;
  var bl = buildOvernightBlocks(hub, start, end);

  c.innerHTML =
    '<div class="card-title">Bedroom - overnight activity (21:00 - 09:00)</div>' +
    '<div class="overnight-wrap">' +
      '<div class="overnight-bar"><div class="overnight-segs"></div></div>' +
      '<div class="overnight-axis">' +
        '<span>21:00</span><span>00:00</span><span>03:00</span><span>06:00</span><span>09:00</span>' +
      '</div>' +
    '</div>' +
    '<div class="overnight-legend"></div>';

  var sw = c.querySelector(".overnight-segs"),
      lg = c.querySelector(".overnight-legend");
  var sp = end - start, tots = {};

  bl.forEach(function (b) {
    var left = ((b.start - start) / sp) * 100,
        width = ((b.end - b.start) / sp) * 100;
    tots[b.key] = (tots[b.key] || 0) + ((b.end - b.start) / 60000);
    var col = OVERNIGHT_TIER_COLORS[b.key] || "#ccc";
    var nm = OVERNIGHT_TIER_LABELS[b.key] || b.key;
    var dm = Math.max(1, Math.round((b.end - b.start) / 60000));
    var tt = nm + " \u2022 " +
      formatTimeShort(b.start, tzIana) + " - " +
      formatTimeShort(b.end, tzIana) + " \u2022 " +
      (dm < 60 ? dm + " min" : Math.floor(dm / 60) + "h " + (dm % 60) + "m");
    var d = document.createElement("div");
    d.style.cssText = "position:absolute;top:0;bottom:0;left:" + left + "%;width:" + width + "%;background:" + col + ";cursor:pointer;";
    d.addEventListener("mouseenter", function (e) { showTimelineTooltip(tt, e.clientX, e.clientY); });
    d.addEventListener("mousemove", function (e) { showTimelineTooltip(tt, e.clientX, e.clientY); });
    d.addEventListener("mouseleave", hideTimelineTooltip);
    sw.appendChild(d);
  });

  /* Legend – ordered: walk, move, rest, away (only shown if present) */
  var legendOrder = ["walk", "move", "rest", "away"];
  legendOrder.forEach(function (k) {
    if (!tots[k]) return;
    var lb = OVERNIGHT_TIER_LABELS[k] || k;
    var r = document.createElement("div"); r.className = "t24-row";
    r.innerHTML =
      '<div class="t24-left">' +
        '<span class="t24-dot" style="background:' + (OVERNIGHT_TIER_COLORS[k] || "#ccc") + '"></span>' +
        '<span>' + lb + '</span>' +
      '</div>' +
      '<div class="t24-dur">' + fmtHM(tots[k]) + '</div>';
    lg.appendChild(r);
  });
}

function renderCard6(hub, container) {
  var c = container.querySelector("#card-6"); if (!c) return; clearSkeletons(c);
  var asset = getCurrentAsset(hub); if (!asset) return;
  var now = Date.now(), td = 0, hd = 0, ltt = null;
  Object.values(asset.devices || {}).forEach(function (d) { td++; var dlt = null; (d.dataKeys || []).forEach(function (dk) { if (!dk || !dk.data || !dk.data.length) return; var ts = Number(dk.data[dk.data.length - 1].ts); if (isFinite(ts)) dlt = dlt === null ? ts : Math.max(dlt, ts); }); if (dlt !== null) { ltt = ltt === null ? dlt : Math.max(ltt, dlt); if (now - dlt <= OFFLINE_LIMIT_MS) hd++; } });
  var st, sc; if (hd === td && td > 0) { st = "Online"; sc = "status-online"; } else if (hd === 0) { st = "Offline"; sc = "status-offline"; } else { st = "Degraded"; sc = "status-degraded"; }
  var ls = "\u2014"; if (ltt) { var ds = Math.floor((now - ltt) / 1000), dm = Math.floor((now - ltt) / 60000); ls = ds < 60 ? "Last telemetry " + ds + " sec" : dm < 60 ? "Last telemetry " + dm + " min" : "Last telemetry " + Math.floor(dm / 60) + "h " + (dm % 60) + "m"; }
  c.innerHTML = '<div class="card-title">Device Status</div><div class="device-status-main"><span class="status-pill ' + sc + '">' + st + '</span></div><div class="device-status-sub">' + ls + ' \u00B7 ' + hd + '/' + td + ' devices healthy</div>';
}
function renderCard10(hub, container) {
  var c10 = container.querySelector("#card-10"); if (!c10) return; clearSkeletons(c10);
  var ow = overnightWindowInTz(getAssetTimezone(hub)); var startTs = ow.startTs, endTs = ow.endTs;
  var bk = computeNightHourlyBreakdown(hub, startTs, endTs);
  var tOut = 0, tRest = 0, tActive = 0, tMulti = 0;
  for (var i = 0; i < bk.length; i++) { tOut += bk[i].out; tRest += bk[i].rest; tActive += bk[i].active; tMulti += bk[i].multi; }
  var slices = [{ l: "In bed \u2014 Resting", v: tRest, cl: "#7FBAC8" }, { l: "In bed \u2014 Active", v: tActive, cl: "#5BAD7A" }, { l: "Multiple Detections", v: tMulti, cl: "#DBA5B0" }];
  var total = tRest + tActive + tMulti; if (total === 0) total = 1;
  var cv = c10.querySelector(".inbed-donut-canvas"); if (!cv) return;
  var sz = 160; cv.width = sz; cv.height = sz; var ctx = cv.getContext("2d"); ctx.clearRect(0, 0, sz, sz);
  var cx = sz / 2, cy = sz / 2, outerR = 72, innerR = 44, startAngle = -Math.PI / 2;
  for (var si = 0; si < slices.length; si++) { if (slices[si].v <= 0) continue; var sweep = (slices[si].v / total) * Math.PI * 2; var endAngle = startAngle + sweep; ctx.beginPath(); ctx.arc(cx, cy, outerR, startAngle, endAngle); ctx.arc(cx, cy, innerR, endAngle, startAngle, true); ctx.closePath(); ctx.fillStyle = slices[si].cl; ctx.fill(); startAngle = endAngle; }
  ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "600 18px system-ui"; ctx.fillStyle = "#3d3c3a"; ctx.fillText(fmtHM(tRest + tActive + tMulti), cx, cy - 6); ctx.font = "11px system-ui"; ctx.fillStyle = "#8c8a84"; ctx.fillText("in bed", cx, cy + 12);
  var tDiv = c10.querySelector(".inbed-donut-totals");
  if (tDiv) { tDiv.innerHTML = ""; for (var ti = 0; ti < slices.length; ti++) { if (slices[ti].v <= 0) continue; var pct = Math.round((slices[ti].v / total) * 100); var row = document.createElement("div"); row.className = "inbed-total-row"; row.innerHTML = '<div class="inbed-total-left"><span class="inbed-total-dot" style="background:' + slices[ti].cl + '"></span><span>' + slices[ti].l + '</span></div><span class="inbed-total-val">' + fmtHM(slices[ti].v) + ' (' + pct + '%)</span>'; tDiv.appendChild(row); } }
}
function renderCard11n(hub, container) {
  var c = container.querySelector("#card-11n"); if (!c) return; clearSkeletons(c);
  var ow = overnightWindowInTz(getAssetTimezone(hub)); var startTs = ow.startTs, endTs = ow.endTs;
  var ev = computeNightEvents(hub, startTs, endTs);
  var grid = c.querySelector(".night-events-grid"); if (!grid) return; grid.innerHTML = "";
  var pills = [{ v: String(ev.movementInBed), l: "Movement while in bed" }, { v: String(ev.bathroomVisits), l: "Bathroom visits overnight" }, { v: String(ev.timesOutOfBed), l: "Times out of bed" }, { v: fmtHM(ev.timeOutOfBedMs / 60000), l: "Time out of bed" }];
  for (var i = 0; i < pills.length; i++) { var pill = document.createElement("div"); pill.className = "night-event-pill"; pill.innerHTML = '<div class="night-event-value">' + pills[i].v + '</div><div class="night-event-label">' + pills[i].l + '</div>'; grid.appendChild(pill); }
}
function renderCard12(hub, container) {
  var c12 = container.querySelector("#card-12"); if (!c12) return; clearSkeletons(c12);
  var tzIana = getAssetTimezone(hub);
  var ow = overnightWindowInTz(tzIana); var startTs = ow.startTs, endTs = ow.endTs;
  var data = computeOvernightRoomTierSeries(hub, startTs, endTs), ms = data.minutes;
  var cv = c12.querySelector(".overnight-ribbon-canvas"); if (!cv) return;
  var W = cv.clientWidth || 400, H = 140; cv.width = W; cv.height = H;
  var ctx = cv.getContext("2d"); ctx.clearRect(0, 0, W, H);
  var pad = { top: 14, bottom: 26, left: 8, right: 28 }, gW = W - pad.left - pad.right, gH = H - pad.top - pad.bottom;
  var tm = ms.length; if (!tm) return; var colW = gW / tm;
  for (var i = 0; i < tm; i++) { var x = pad.left + i * colW; ctx.fillStyle = OVERNIGHT_ROOM_COLORS[ms[i].zone] || OVERNIGHT_ROOM_COLORS["none"]; ctx.fillRect(x, pad.top, Math.ceil(colW) + 1, gH); }
  var maxTier = 3; ctx.beginPath(); var started = false;
  for (var j = 0; j < tm; j++) { var tier = ms[j].tier; if (tier < 0) { started = false; continue; } var lx = pad.left + (j + 0.5) * colW; var ly = pad.top + gH - (tier / maxTier) * gH; if (!started) { ctx.moveTo(lx, ly); started = true; } else ctx.lineTo(lx, ly); }
  ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
  ctx.beginPath(); started = false;
  for (var k = 0; k < tm; k++) { var t2 = ms[k].tier; if (t2 < 0) { started = false; continue; } var lx2 = pad.left + (k + 0.5) * colW; var ly2 = pad.top + gH - (t2 / maxTier) * gH; if (!started) { ctx.moveTo(lx2, ly2); started = true; } else ctx.lineTo(lx2, ly2); }
  ctx.strokeStyle = "rgba(60,60,58,0.55)"; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.font = "9px system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillStyle = "#8c8a84";
  for (var tl = 0; tl <= maxTier; tl++) { ctx.fillText("T" + tl, W - 2, pad.top + gH - (tl / maxTier) * gH); }
  var ax = c12.querySelector(".overnight-ribbon-axis");
  if (ax) { ax.innerHTML = ""; [0,3,6,9,12].forEach(function (m) { var spn = document.createElement("span"); spn.textContent = formatTimeShort(startTs + m * 3600000, tzIana); ax.appendChild(spn); }); }
  var lg = c12.querySelector(".overnight-ribbon-legend");
  if (lg) { lg.innerHTML = ""; var tots = {}; for (var ri = 0; ri < tm; ri++) { tots[ms[ri].zone] = (tots[ms[ri].zone] || 0) + 1; } var zoneLabels = { bed: "Bed", bedroom: "Bedroom", bathroom: "Bathroom", other: "Other room", none: "No detection", multi: "Multiple people" }; var keys = Object.keys(tots).sort(function (a, b) { return tots[b] - tots[a]; }); for (var ki = 0; ki < keys.length; ki++) { var zk2 = keys[ki]; var r = document.createElement("div"); r.className = "or-row"; r.innerHTML = '<div class="or-left"><span class="or-dot" style="background:' + (OVERNIGHT_ROOM_COLORS[zk2] || OVERNIGHT_ROOM_COLORS["none"]) + '"></span><span>' + (zoneLabels[zk2] || zk2) + '</span></div><div class="or-dur">' + fmtHM(tots[zk2]) + '</div>'; lg.appendChild(r); } }
}
function renderCard9(hub, container) {
  var c9 = container.querySelector("#card-9"); if (!c9) return; clearSkeletons(c9);
  var ow = overnightWindowInTz(getAssetTimezone(hub)); var startTs = ow.startTs, endTs = ow.endTs;
  var bk = computeNightHourlyBreakdown(hub, startTs, endTs);
  var sc = c9.querySelector(".night-hourly-stack");
  if (sc) { sc.innerHTML = ""; for (var bi = 0; bi < bk.length; bi++) { var hr = bk[bi]; var tot = hr.out + hr.rest + hr.active + hr.multi; if (tot === 0) tot = 60; var bar = document.createElement("div"); bar.className = "night-hour-bar"; var segs = [{ v: hr.active, c: "nseg-active" }, { v: hr.rest, c: "nseg-rest" }, { v: hr.multi, c: "nseg-multi" }, { v: hr.out, c: "nseg-out" }]; for (var si = 0; si < segs.length; si++) { if (segs[si].v <= 0) continue; var sg = document.createElement("div"); sg.className = "night-hour-seg " + segs[si].c; sg.style.height = ((segs[si].v / tot) * 100) + "%"; bar.appendChild(sg); } sc.appendChild(bar); } }
  var ax = c9.querySelector(".night-hourly-axis");
  if (ax) { ax.innerHTML = ""; [21,22,23,0,1,2,3,4,5,6,7,8].forEach(function (hh) { var lb = document.createElement("span"); lb.className = "night-hour-axis-label"; lb.textContent = (hh < 10 ? "0" : "") + hh; ax.appendChild(lb); }); }
  var sl = c9.querySelector(".night-hourly-legend");
  if (sl) { sl.innerHTML = ""; [{ c: "nseg-active", l: "In bed \u2014 Active" }, { c: "nseg-rest", l: "In bed \u2014 Resting" }, { c: "nseg-multi", l: "Multiple Detections" }, { c: "nseg-out", l: "Out of bed" }].forEach(function (li) { var lr = document.createElement("div"); lr.className = "night-legend-item"; lr.innerHTML = '<span class="night-legend-dot ' + li.c + '"></span><span>' + li.l + '</span>'; sl.appendChild(lr); }); }
  var dg = c9.querySelector(".night-dist-grid");
  if (dg) { dg.innerHTML = ""; var tOut = 0, tRest = 0, tActive = 0, tMulti = 0; for (var di = 0; di < bk.length; di++) { tOut += bk[di].out; tRest += bk[di].rest; tActive += bk[di].active; tMulti += bk[di].multi; } [{ l: "Out of bed", v: tOut, cl: "#A68B7B" }, { l: "In bed \u2014 Resting", v: tRest, cl: "#7FBAC8" }, { l: "In bed \u2014 Active", v: tActive, cl: "#5BAD7A" }, { l: "Multiple Detections", v: tMulti, cl: "#DBA5B0" }].forEach(function (dd) { if (dd.v <= 0) return; var item = document.createElement("div"); item.className = "night-dist-item"; item.innerHTML = '<div class="night-dist-left"><span class="night-dist-dot" style="background:' + dd.cl + '"></span><span>' + dd.l + '</span></div><span class="night-dist-val">' + fmtHM(dd.v) + '</span>'; dg.appendChild(item); }); }
}

/***********************
 * RESET STATE
 ***********************/
function resetCardState() {
  residentState = null; stateStartTs = null; lastPresenceTs = null;
  pendingState = null; pendingSince = null;
  currentLocationRooms = []; currentLocationStartTs = null;
  pendingLocationRooms = null; pendingLocationSince = null;
  currentLocationTotalTargets = 0; currentLocationIsMultipleRooms = false; currentLocationIsMultiplePeople = false;
  previousLocationRooms = []; previousLocationStartTs = null; previousLocationEndTs = null;
  movementTiersByDevice = {}; activitySeries = []; ACTIVITY_ANCHOR_TS = null;
  currentAssetHasTier = false;
}

/***********************
 * THINGSBOARD LIFECYCLE
 ***********************/
self.onInit = function () {
  var container = self.ctx.$container[0];
  self._carouselController = createCarousel(container);
  self._carouselController.addSlide(buildPage1());
  self._carouselController.addSlide(buildPage2());
  self._carouselController.addSlide(buildPage3());
  self._carouselController.refresh();

  var prevBtn = container.querySelector(".asset-prev");
  var nextBtn = container.querySelector(".asset-next");

  self._hub = null;
  self._hubChangedCallbacks = [];
  self.onHubDataChanged = function (cb) { if (typeof cb === "function") self._hubChangedCallbacks.push(cb); };

  if (prevBtn) { prevBtn.onclick = function () { if (self._hub) switchAsset(-1, self._hub, container); }; }
  if (nextBtn) { nextBtn.onclick = function () { if (self._hub) switchAsset(1, self._hub, container); }; }

  if (self._carouselController) self._carouselController.showLoader();

  self.onHubDataChanged(function (hub) {
    if (hub !== currentHubRef) { currentHubRef = hub; resetCardState(); }
    if (!ACTIVITY_ANCHOR_TS) ACTIVITY_ANCHOR_TS = Date.now();

    var isRefreshing = !!(hub.hubMeta && hub.hubMeta.refreshing);

    if (self._carouselController) self._carouselController.setProgress(1);

    updateAssetList(hub);
    updateAssetHeaderName(hub, container);
    currentAssetHasTier = assetHasEDTier(hub);
    applyTierVisibility(container, currentAssetHasTier);
    backfillActivityFromHistory(hub);
    evaluateState(hub); evaluateCurrentLocation(hub); evaluateLocations(hub);
    renderAll(hub, container);

    if (!isRefreshing && self._carouselController && !self._carouselController.hasRevealed()) {
      self._carouselController.revealCards();
    }
  });

  self._hubListener = createHubListener({
    onStart: function () {
      if (self._carouselController) {
        self._carouselController.showLoader();
        self._carouselController.setProgress(1);
      }
    },
    onEnd: function () { if (self._carouselController) self._carouselController.hideLoader(); },
    onChanged: function (hub, src) {
      self._hub = hub;
      for (var i = 0; i < self._hubChangedCallbacks.length; i++) {
        try { self._hubChangedCallbacks[i](hub, src); } catch (e) {}
      }
      if (!(hub.hubMeta && hub.hubMeta.refreshing) && self._carouselController) self._carouselController.hideLoader();
    }
  });

  self._minuteTimer = setInterval(function () { updateDuration(self._hub, container); }, 60000);
  self._stateTimer = setInterval(function () {
    if (self._hub) { evaluateState(self._hub); evaluateCurrentLocation(self._hub); evaluateLocations(self._hub); renderAll(self._hub, container); }
  }, STATE_TICK_MS);
};

self.onDataUpdated = function () {};

self.onDestroy = function () {
  if (self._hubListener) { self._hubListener.destroy(); self._hubListener = null; }
  if (self._minuteTimer) clearInterval(self._minuteTimer);
  if (self._stateTimer) clearInterval(self._stateTimer);
  self._hubChangedCallbacks = null; self.onHubDataChanged = null; self._hub = null; currentHubRef = null;
  if (activeTimelineTooltip && activeTimelineTooltip.parentNode) { activeTimelineTooltip.parentNode.removeChild(activeTimelineTooltip); activeTimelineTooltip = null; }
  if (self._carouselController) { self._carouselController.destroy(); self._carouselController = null; }
};