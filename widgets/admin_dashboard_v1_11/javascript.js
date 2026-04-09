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
    @keyframes cardRevealIn{
      0%  { opacity:0.6; transform:translateY(6px); }
      100%{ opacity:1; transform:translateY(0); }
    }
    .card.is-loading{ opacity:1; }
    .card.card-revealed{
      animation:cardRevealIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards;
    }
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
    .resident-chip-row{ display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
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
    .moved-indicator-row{
      display:flex; align-items:center; justify-content:space-between;
      gap:10px; padding:2px 0;
    }
    .moved-indicator-left{ display:flex; align-items:center; gap:10px; flex:1; min-width:0; }
    .moved-dot{
      width:14px; height:14px; border-radius:50%; flex-shrink:0;
      transition:background 0.4s ease;
    }
    .moved-text{
      font-size:18px; color:#555;
      font-family:'Inter', system-ui; line-height:1.3;
      white-space:nowrap;
    }
    .moved-time{ font-weight:600; color:#1A1A1A; }
    .location-main{ margin-top:6px; font-size:20px; font-weight:600; color:#3d3c3a; }
    .location-sub{ margin-top:6px; font-size:14px; color:#6b6b6b; }
    .chip-row{ margin-top:10px; display:flex; gap:6px; flex-wrap:wrap; }
    .room-location-card{ display:flex; flex-direction:column; justify-content:center; min-height:120px; }
    .room-location-main{ margin-top:0; font-family:Inter, system-ui, sans-serif; font-size:30px; line-height:1.14; font-weight:700; color:#1A1A1A; }
    .room-location-sub{ margin-top:6px; font-family:Inter, system-ui, sans-serif; font-size:18px; line-height:1.22; font-weight:400; color:#666666; }
    .room-location-main.away{ font-weight:600; color:#666666; }
    .chip{
      display:inline-block; font-size:12px; font-weight:500;
      padding:4px 10px; border-radius:999px; line-height:1;
      background:#e6e6e3; color:#4b4b48;
    }
    .chip-warn{ background:#efe8d8; color:#6a5c3a; }
    .chip-visitor{
      background:#FEF3C7; color:#92400E;
      font-family:'Inter', system-ui; font-size:18px; font-weight:600;
      padding:4px 12px; border-radius:12px; display:inline-flex;
      align-items:center; gap:6px; line-height:1;
    }
    .chip-visitor-dot{
      width:8px; height:8px; border-radius:50%; background:#E8B86D;
      flex-shrink:0;
    }
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
    .sensor-status-row{
      display:flex; align-items:center; gap:8px; padding:2px 0;
    }
    .sensor-status-dot{
      width:6px; height:6px; border-radius:50%; flex-shrink:0;
    }
    .sensor-status-text{
      font-family:'Inter', system-ui, sans-serif;
      font-size:15px; color:#AAA; line-height:1.3;
    }
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
    .activity-state-grid{
      display:grid; grid-template-columns:1fr 1fr;
      gap:12px 24px; padding:2px 0;
    }
    .activity-state-cell{
      display:flex; align-items:center; gap:8px;
      font-family:'Inter', system-ui, sans-serif;
      font-size:17px; line-height:1.3;
    }
    .activity-state-dot{
      width:10px; height:10px; border-radius:3px; flex-shrink:0;
    }
    .activity-state-dur{
      font-weight:600; color:#222;
    }
    .activity-state-label{
      font-weight:400; color:#555;
    }
    .hero-bed-card{ padding:14px 16px; }
    .hero-bed-line{
      display:flex; align-items:center; gap:8px;
      font-family:'Inter', system-ui, sans-serif;
      font-size:18px; font-weight:500; line-height:1.3;
    }
    .hero-bed-icon{
      flex-shrink:0; width:22px; height:22px;
      display:flex; align-items:center; justify-content:center;
      font-size:18px; line-height:1;
    }
    .hero-prev-room{
      margin-top:8px;
      font-family:'Inter', system-ui, sans-serif;
      font-size:18px; font-weight:400; line-height:1.3;
      color:#777;
    }
    .activity-summary-text{
      font-family:'Inter', system-ui, sans-serif;
      font-size:17px;
      color:#666666;
      line-height:1.5;
    }
  `;
  document.head.appendChild(style);
}

/***********************
 * SKELETON BUILDERS
 ***********************/
function skelLine(w) { return '<div class="skel skel-line ' + (w || '') + '"></div>'; }
function skelTitle() { return '<div class="skel skel-title"></div>'; }
function skelBar() { return '<div class="skel skel-bar"></div>'; }
function skelGraph() { return '<div class="skel skel-graph"></div>'; }
function skelChips(n) {
  var h = ''; for (var i = 0; i < (n || 2); i++) h += '<div class="skel skel-chip"></div>';
  return '<div style="margin-top:8px;display:flex;gap:6px">' + h + '</div>';
}
function skelMetrics(n) {
  var h = ''; for (var i = 0; i < (n || 4); i++)
    h += '<div class="skel-metric-row"><div class="skel skel-metric-label"></div><div class="skel skel-metric-value"></div></div>';
  return h;
}

/***********************
 * CAROUSEL LAYOUT
 ***********************/
function createCarouselLayout(container) {
  if (!container) return null;
  var existing = container.querySelector(".carousel-root");
  if (existing) return existing;
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
              '<div class="fw-st active" data-step="0"><div class="fw-st-dot"></div><div class="fw-st-label">Connecting</div></div>' +
              '<div class="fw-st-line"><div class="fw-st-line-fill"></div></div>' +
              '<div class="fw-st" data-step="1"><div class="fw-st-dot"></div><div class="fw-st-label">Loading</div></div>' +
              '<div class="fw-st-line"><div class="fw-st-line-fill"></div></div>' +
              '<div class="fw-st" data-step="2"><div class="fw-st-dot"></div><div class="fw-st-label">Ready</div></div>' +
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
  var currentIndex = 0, pageChangedCallbacks = [], isDestroyed = false, hasRevealed = false, currentProgressStep = 0;

  function getSlideCount() { return track ? track.children.length : 0; }
  function clampIndex(i) { var c = getSlideCount(); return c <= 0 ? 0 : Math.max(0, Math.min(i, c - 1)); }
  function getSlideWidth() { return viewport.clientWidth || 1; }
  function emitPageChanged() { for (var i = 0; i < pageChangedCallbacks.length; i++) try { pageChangedCallbacks[i](currentIndex); } catch (e) {} }
  function rebuildDots() {
    var c = getSlideCount(), html = "";
    for (var i = 0; i < c; i++) html += '<div class="dot" data-index="' + i + '"></div>';
    dotsWrap.innerHTML = html; updateDots();
  }
  function updateDots() {
    var dots = dotsWrap.querySelectorAll(".dot");
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("active", i === currentIndex);
  }
  function applyTransform(px, smooth) {
    track.style.transition = smooth ? "transform 0.3s ease" : "none";
    track.style.transform = "translateX(" + px + "px)";
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
    var steps = banner.querySelectorAll(".fw-st"), lines = banner.querySelectorAll(".fw-st-line");
    for (var i = 0; i < steps.length; i++) {
      var si = Number(steps[i].getAttribute("data-step"));
      steps[i].classList.remove("active", "done");
      if (si < step) steps[i].classList.add("done");
      else if (si === step) steps[i].classList.add("active");
    }
    for (var j = 0; j < lines.length; j++) lines[j].classList.toggle("done", j < step);
  }
  function revealCards() {
    if (hasRevealed) return; hasRevealed = true; setProgress(2);
    var banner = container.querySelector("#fw-init-banner");
    setTimeout(function () {
      if (banner) { banner.classList.add("dismissing"); setTimeout(function () { if (banner.parentNode) banner.parentNode.removeChild(banner); }, 550); }
      var allCards = container.querySelectorAll(".card.is-loading");
      for (var i = 0; i < allCards.length; i++) (function (card, idx) {
        setTimeout(function () {
          var skels = card.querySelectorAll(".skel");
          for (var s = 0; s < skels.length; s++) if (skels[s].parentNode) skels[s].parentNode.removeChild(skels[s]);
          card.classList.remove("is-loading"); card.classList.add("card-revealed");
        }, idx * 80);
      })(allCards[i], i);
    }, 400);
  }

  prevButton.onclick = function (e) { e.preventDefault(); goTo(currentIndex - 1, true); };
  nextButton.onclick = function (e) { e.preventDefault(); goTo(currentIndex + 1, true); };
  dotsWrap.onclick = function (e) { var t = e.target; if (t && t.classList && t.classList.contains("dot")) { var i = Number(t.getAttribute("data-index")); if (isFinite(i)) goTo(i, true); } };

  // --- Touch & Mouse swipe ---
  var touchStartX = 0, touchStartY = 0, touchDir = null, trackBaseOffset = 0;
  var DIR_THR = 8, SNAP_THR = 0.2;
  function rubberBand(raw) {
    var maxO = 0, minO = -((getSlideCount() - 1) * getSlideWidth());
    if (raw > maxO) return maxO + (raw - maxO) * 0.3;
    if (raw < minO) return minO + (raw - minO) * 0.3;
    return raw;
  }
  var onTS = function (e) { if (isDestroyed || !e.touches.length) return; touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; touchDir = null; trackBaseOffset = -(currentIndex * getSlideWidth()); track.style.transition = "none"; };
  var onTM = function (e) { if (isDestroyed || !e.touches.length) return; var dx = e.touches[0].clientX - touchStartX, dy = e.touches[0].clientY - touchStartY; if (touchDir === null) { if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > DIR_THR) touchDir = "h"; else if (Math.abs(dy) > DIR_THR) touchDir = "v"; } if (touchDir === "h") { e.preventDefault(); track.style.transform = "translateX(" + rubberBand(trackBaseOffset + dx) + "px)"; } };
  var onTE = function (e) { if (isDestroyed || touchDir !== "h") { touchDir = null; return; } var endX = (e.changedTouches && e.changedTouches.length) ? e.changedTouches[0].clientX : touchStartX; var dx = endX - touchStartX, thr = getSlideWidth() * SNAP_THR; if (dx < -thr) goTo(currentIndex + 1, true); else if (dx > thr) goTo(currentIndex - 1, true); else goTo(currentIndex, true); touchDir = null; };
  viewport.addEventListener("touchstart", onTS, { passive: true });
  viewport.addEventListener("touchmove", onTM, { passive: false });
  viewport.addEventListener("touchend", onTE, { passive: true });

  var mDown = false, mStartX = 0, mDir = null, mBase = 0;
  var onMD = function (e) { if (isDestroyed) return; if (e.target.closest && (e.target.closest(".nav") || e.target.closest(".dot"))) return; mDown = true; mDir = null; mStartX = e.clientX; mBase = -(currentIndex * getSlideWidth()); track.style.transition = "none"; e.preventDefault(); };
  var onMM = function (e) { if (isDestroyed || !mDown) return; var dx = e.clientX - mStartX; if (mDir === null && Math.abs(dx) > DIR_THR) mDir = "h"; if (mDir === "h") track.style.transform = "translateX(" + rubberBand(mBase + dx) + "px)"; };
  var onMU = function (e) { if (isDestroyed || !mDown) return; mDown = false; if (mDir === "h") { var dx = e.clientX - mStartX, thr = getSlideWidth() * SNAP_THR; if (dx < -thr) goTo(currentIndex + 1, true); else if (dx > thr) goTo(currentIndex - 1, true); else goTo(currentIndex, true); } mDir = null; };
  var onML = function () { if (mDown) { mDown = false; mDir = null; goTo(currentIndex, true); } };
  viewport.addEventListener("mousedown", onMD);
  document.addEventListener("mousemove", onMM);
  document.addEventListener("mouseup", onMU);
  viewport.addEventListener("mouseleave", onML);

  var onResize = function () { if (!isDestroyed) goTo(currentIndex, false); };
  window.addEventListener("resize", onResize);

  var ht1 = setTimeout(function () { if (isDestroyed) return; var sw = getSlideWidth(); applyTransform(-(sw * 0.08), true); var ht2 = setTimeout(function () { if (!isDestroyed) goTo(0, true); }, 350); root._ht2 = ht2; }, 600);
  root._ht1 = ht1; rebuildDots();

  return {
    addSlide: addSlide, goTo: function (i) { goTo(i, true); }, goToInstant: function (i) { goTo(i, false); },
    getIndex: function () { return currentIndex; },
    onPageChanged: function (cb) { if (typeof cb === "function") pageChangedCallbacks.push(cb); },
    refresh: function () { rebuildDots(); goTo(currentIndex, false); },
    showLoader: showLoader, hideLoader: hideLoader, setProgress: setProgress, revealCards: revealCards,
    hasRevealed: function () { return hasRevealed; },
    destroy: function () {
      isDestroyed = true;
      try { viewport.removeEventListener("touchstart", onTS); } catch (e) {}
      try { viewport.removeEventListener("touchmove", onTM); } catch (e) {}
      try { viewport.removeEventListener("touchend", onTE); } catch (e) {}
      try { viewport.removeEventListener("mousedown", onMD); } catch (e) {}
      try { document.removeEventListener("mousemove", onMM); } catch (e) {}
      try { document.removeEventListener("mouseup", onMU); } catch (e) {}
      try { viewport.removeEventListener("mouseleave", onML); } catch (e) {}
      try { window.removeEventListener("resize", onResize); } catch (e) {}
      if (root._ht1) clearTimeout(root._ht1); if (root._ht2) clearTimeout(root._ht2);
      prevButton.onclick = null; nextButton.onclick = null; dotsWrap.onclick = null;
      pageChangedCallbacks.length = 0;
    }
  };
}

/***********************
 * DATA HUB LISTENER
 ***********************/
function getSharedHub() { try { var s = window && window._TB_SHARED; return (s && s.DATAHUB_V16) ? s.DATAHUB_V16 : null; } catch (e) { return null; } }
function hubFingerprint(hub) {
  if (!hub) return "null";
  var m = hub.hubMeta || {}, a = hub.sharedAssetObj || {}, ids = Object.keys(a), dc = 0;
  for (var i = 0; i < ids.length; i++) { var d = (a[ids[i]] && a[ids[i]].devices) || {}; dc += Object.keys(d).length; }
  return String(m.loadedAt||"") + "|" + String(m.refreshAt||"") + "|" + (m.refreshing?"1":"0") + "|" + ids.length + "|" + dc;
}
function createHubListener(opts) {
  var destroyed = false, lastFp = null;
  function pull(src) {
    if (destroyed) return; var hub = getSharedHub(); if (!hub) return;
    var r = !!(hub.hubMeta && hub.hubMeta.refreshing);
    if (r && opts.onStart) opts.onStart(src);
    if (!r && opts.onEnd) opts.onEnd(src);
    var fp = hubFingerprint(hub);
    if (fp === lastFp) return; lastFp = fp;
    if (opts.onChanged) opts.onChanged(hub, src);
  }
  function onEvt(evt) { if (!destroyed) pull("event:" + ((evt && evt.detail && evt.detail.reason) || "hubUpdated")); }
  try { window.addEventListener("dh16:hubUpdated", onEvt); } catch (e) {}
  pull("init");
  var pollTimer = setInterval(function () { pull("poll"); }, 2000);
  return {
    refresh: function () { pull("manual"); },
    destroy: function () { destroyed = true; clearInterval(pollTimer); try { window.removeEventListener("dh16:hubUpdated", onEvt); } catch (e) {} }
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
var currentHubRef = null;
var residentState = null, stateStartTs = null, lastPresenceTs = null;
var pendingState = null, pendingSince = null, previousAnchorTs = null;
var currentLocationRooms = [], currentLocationStartTs = null;
var pendingLocationRooms = null, pendingLocationSince = null;
var currentLocationTotalTargets = 0, currentLocationIsMultipleRooms = false, currentLocationIsMultiplePeople = false;
var previousLocationRooms = [], previousLocationStartTs = null, previousLocationEndTs = null;
var movementTiersByDevice = {};
var activeTimelineTooltip = null;
var assetKeysOrdered = [], currentAssetIndex = 0, currentAssetHasTier = false;

var ROOM_COLORS = { bedroom:"#508590", lounge:"#E07A5F", kitchen:"#F2A541", study:"#6A7FBA", bathroom:"#829995", multi:"#DBA5B0", none:"#D6D3D1" };
var OVERNIGHT_COLORS = { t0:"#C9CCD1", t1:"#7FBAC8", t2:"#E8B86D", t3:"#5BAD7A", none:"#D6D3D1" };
var OVERNIGHT_ROOM_COLORS = { bed:"#3A6B73", bedroom:"#508590", bathroom:"#829995", other:"#B8A394", none:"#D6D3D1", multi:"#DBA5B0" };
var TIER_CARD_IDS = ["card-7", "card-8", "card-10", "card-11n", "card-9", "card-12"];

/***********************
 * OPT-1: DOM REF CACHE
 ***********************/
var _domCache = {};
function $$(container, sel) {
  var k = sel;
  if (_domCache[k] && _domCache[k].isConnected) return _domCache[k];
  var el = container.querySelector(sel);
  if (el) _domCache[k] = el;
  return el;
}
function clearDomCache() { _domCache = {}; }

/***********************
 * OPT-2: COMPUTATION CACHE
 * Keyed on hub fingerprint + asset index.
 * Cleared on asset switch or hub change.
 ***********************/
var _compCache = {};
var _compCacheFp = null;
function getCompCacheKey() { return currentAssetIndex + "|" + hubFingerprint(currentHubRef); }
function invalidateCompCache() { _compCache = {}; _compCacheFp = null; }
function cached(key, fn) {
  var fp = getCompCacheKey();
  if (fp !== _compCacheFp) { _compCache = {}; _compCacheFp = fp; }
  if (_compCache[key] !== undefined) return _compCache[key];
  var val = fn();
  _compCache[key] = val;
  return val;
}

/***********************
 * OPT-3: RENDER BATCHING
 ***********************/
var _rafId = null;
var _pendingRenderHub = null;
var _pendingRenderContainer = null;
function scheduleRender(hub, container) {
  _pendingRenderHub = hub;
  _pendingRenderContainer = container;
  if (_rafId) return;
  _rafId = requestAnimationFrame(function () {
    _rafId = null;
    if (_pendingRenderHub && _pendingRenderContainer) {
      renderAll(_pendingRenderHub, _pendingRenderContainer);
    }
  });
}

/***********************
 * OPT-4: LAST-RENDER SNAPSHOT
 * Skip DOM writes when output hasn't changed.
 ***********************/
var _lastRender = {};
function renderIfChanged(key, value, fn) {
  if (_lastRender[key] === value) return;
  _lastRender[key] = value;
  fn();
}
function clearRenderSnapshot() { _lastRender = {}; }

/***********************
 * UTILITY HELPERS
 ***********************/
function normalizeRoomName(raw) { if (raw == null) return null; var s = String(raw).trim(); return s || null; }
function arraysEqual(a, b) { if (a === b) return true; if (!a || !b || a.length !== b.length) return false; for (var i = 0; i < a.length; i++) if (a[i] !== b[i]) return false; return true; }
function getNestedValue(obj, paths) {
  if (!obj || !paths) return null;
  for (var i = 0; i < paths.length; i++) {
    var cur = obj, parts = paths[i].split(".");
    for (var j = 0; j < parts.length; j++) { if (cur == null || typeof cur !== "object" || !(parts[j] in cur)) { cur = null; break; } cur = cur[parts[j]]; }
    if (cur != null && String(cur).trim() !== "") return cur;
  }
  return null;
}
var _roomTypePaths = ["roomType","attributes.roomType","serverAttributes.roomType","clientAttributes.roomType","sharedAttributes.roomType","additionalInfo.roomType","metadata.roomType"];
function resolveDeviceRoomName(dev) {
  var raw = getNestedValue(dev, _roomTypePaths);
  var room = normalizeRoomName(raw);
  if (room) return room.toLowerCase() === "bed" ? "bedroom" : room;
  var fb = normalizeRoomName(dev.label) || normalizeRoomName(dev.name) || normalizeRoomName(dev.deviceId) || normalizeRoomName(dev.id) || null;
  return fb && fb.toLowerCase() === "bed" ? "bedroom" : fb;
}
function getAssetTimezone(hub) { var a = getCurrentAsset(hub); return (a && a.timezone) || undefined; }
function formatTime12h(ts, tz) { if (!ts || !isFinite(Number(ts))) return "\u2014"; var o = { hour: "numeric", minute: "2-digit", hour12: true }; if (tz) o.timeZone = tz; return new Date(Number(ts)).toLocaleTimeString([], o); }
function formatTimeShort(ts, tz) { var o = { hour: "2-digit", minute: "2-digit" }; if (tz) o.timeZone = tz; return new Date(ts).toLocaleTimeString([], o); }
function getHourInTz(ts, tz) { if (!tz) return new Date(ts).getHours(); var s = new Date(ts).toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: tz }); var h = parseInt(s, 10); return isNaN(h) ? new Date(ts).getHours() : (h === 24 ? 0 : h); }
function overnightWindowInTz(tz) {
  var now = Date.now(), opts = tz ? { timeZone: tz } : undefined;
  var dateStr = new Date(now).toLocaleDateString("en-CA", opts);
  var utc9 = new Date(dateStr + "T09:00:00Z").getTime();
  if (tz) { var off = new Date(new Date(utc9).toLocaleString("en-US", { timeZone: tz })).getTime() - new Date(new Date(utc9).toLocaleString("en-US", { timeZone: "UTC" })).getTime(); utc9 -= off; }
  var end = utc9; if (end > now) end -= 86400000;
  return { startTs: end - 43200000, endTs: end };
}
function getDisplayRoomName(rooms) {
  if (!rooms || !rooms.length) return null;
  for (var i = 0; i < rooms.length; i++) { var r = normalizeRoomName(rooms[i]); if (!r) continue; return r.toLowerCase() === "bed" ? "bedroom" : r; }
  return null;
}
function fmtHM(m) { var h = Math.floor(m / 60), mm = Math.round(m % 60); if (h > 0 && mm > 0) return h + "h " + mm + "m"; if (h > 0) return h + "h"; return mm + "m"; }
function fmtDurShort(m) { var h = Math.floor(m / 60), mm = Math.round(m % 60); if (h > 0 && mm > 0) return h + "h " + (mm < 10 ? "0" : "") + mm + "m"; if (h > 0) return h + "h 00m"; return mm + " min"; }
function blockKey(rooms) { if (!rooms || !rooms.length) return "none"; if (rooms.length > 1) return "multi"; return "room:" + rooms[0]; }
function showTimelineTooltip(text, x, y) {
  if (!activeTimelineTooltip) { activeTimelineTooltip = document.createElement("div"); activeTimelineTooltip.className = "fw-floating-tooltip"; document.body.appendChild(activeTimelineTooltip); }
  activeTimelineTooltip.textContent = text; activeTimelineTooltip.style.left = (x + 12) + "px"; activeTimelineTooltip.style.top = (y - 30) + "px"; activeTimelineTooltip.style.opacity = "1";
}
function hideTimelineTooltip() { if (activeTimelineTooltip) activeTimelineTooltip.style.opacity = "0"; }
function getLatestTelemetryTs(hub) {
  var lat = null, asset = getCurrentAsset(hub); if (!asset) return null;
  var devs = asset.devices || {};
  for (var id in devs) { var d = devs[id]; var dks = d.dataKeys || []; for (var i = 0; i < dks.length; i++) { var dk = dks[i]; if (!dk || !dk.data || !dk.data.length) continue; var ts = Number(dk.data[dk.data.length - 1].ts); if (isFinite(ts)) lat = lat === null ? ts : Math.max(lat, ts); } }
  return lat;
}
function clearSkeletons(card) {
  if (!card) return;
  var skels = card.querySelectorAll(".skel"); for (var i = 0; i < skels.length; i++) if (skels[i].parentNode) skels[i].parentNode.removeChild(skels[i]);
  var smr = card.querySelectorAll(".skel-metric-row"); for (var j = 0; j < smr.length; j++) if (smr[j].parentNode) smr[j].parentNode.removeChild(smr[j]);
}

/***********************
 * ASSET MANAGEMENT
 ***********************/
function getCurrentAsset(hub) {
  if (!hub || !hub.sharedAssetObj || !assetKeysOrdered.length) return null;
  return hub.sharedAssetObj[assetKeysOrdered[currentAssetIndex]] || null;
}
function updateAssetList(hub) {
  if (!hub || !hub.sharedAssetObj) return;
  var prev = assetKeysOrdered[currentAssetIndex] || null;
  assetKeysOrdered = Object.keys(hub.sharedAssetObj).sort(function (a, b) {
    var aa = hub.sharedAssetObj[a] || {}, bb = hub.sharedAssetObj[b] || {};
    var an = String(aa.assetName || aa.name || a || "").toLowerCase();
    var bn = String(bb.assetName || bb.name || b || "").toLowerCase();
    return an < bn ? -1 : an > bn ? 1 : String(a).localeCompare(String(b));
  });
  if (!assetKeysOrdered.length) { currentAssetIndex = 0; return; }
  if (prev) { var idx = assetKeysOrdered.indexOf(prev); currentAssetIndex = idx >= 0 ? idx : 0; }
  else if (currentAssetIndex >= assetKeysOrdered.length) currentAssetIndex = 0;
}
function updateAssetHeaderName(hub, container) {
  var asset = getCurrentAsset(hub), name = asset ? asset.assetName : "";
  var multi = assetKeysOrdered.length > 1;
  var pager = $$(container, "#asset-pager"), solo = $$(container, "#asset-header-name-solo");
  if (pager) { if (multi) { pager.classList.remove("hidden"); var hn = $$(container, "#asset-header-name"); if (hn) hn.textContent = name; } else pager.classList.add("hidden"); }
  if (solo) { if (multi) solo.style.display = "none"; else { solo.style.display = ""; solo.textContent = name; } }
}
function assetHasEDTier(hub) {
  var asset = getCurrentAsset(hub); if (!asset) return false;
  var devs = asset.devices || {};
  for (var id in devs) { var dks = devs[id].dataKeys || []; for (var i = 0; i < dks.length; i++) if (dks[i] && dks[i].name === "ED_tier" && dks[i].data && dks[i].data.length > 0) return true; }
  return false;
}
function applyTierVisibility(container, hasTier) {
  for (var i = 0; i < TIER_CARD_IDS.length; i++) { var el = $$(container, "#" + TIER_CARD_IDS[i]); if (el) el.classList.toggle("tier-hidden", !hasTier); }
}
function switchAsset(delta, hub, container) {
  if (!assetKeysOrdered.length) return;
  currentAssetIndex += delta;
  if (currentAssetIndex < 0) currentAssetIndex = assetKeysOrdered.length - 1;
  if (currentAssetIndex >= assetKeysOrdered.length) currentAssetIndex = 0;
  resetCardState(); invalidateCompCache(); clearRenderSnapshot(); clearDomCache();
  updateAssetHeaderName(hub, container);
  currentAssetHasTier = assetHasEDTier(hub);
  applyTierVisibility(container, currentAssetHasTier);
  evaluateState(hub); evaluateCurrentLocation(hub); evaluateLocations(hub);
  renderAll(hub, container);
}

/***********************
 * PRESENCE / STATE ENGINE
 ***********************/
function findLatestPresenceTsFromKey(arr) { for (var i = arr.length - 1; i >= 0; i--) { var ts = Number(arr[i].ts), v = Number(arr[i].v); if (isFinite(ts) && isFinite(v) && v >= 1) return ts; } return null; }
function computePresenceSnapshot(hub, now) {
  var asset = getCurrentAsset(hub); if (!asset) return null;
  var any = false, lpTs = null, ltTs = null, devs = asset.devices || {};
  for (var id in devs) { var dks = devs[id].dataKeys || []; for (var i = 0; i < dks.length; i++) {
    var dk = dks[i]; if (!dk || !dk.data || !dk.data.length) continue;
    var lts = Number(dk.data[dk.data.length - 1].ts); if (isFinite(lts)) ltTs = ltTs === null ? lts : Math.max(ltTs, lts);
    if (dk.name !== "num_of_targets") continue;
    var pts = findLatestPresenceTsFromKey(dk.data);
    if (pts !== null) { lpTs = lpTs === null ? pts : Math.max(lpTs, pts); if (now - pts < HOLD_MS) any = true; }
  }}
  return { anyPresence: any, latestPresenceTs: lpTs, latestTelemetryTs: ltTs };
}
function initializeFromHistory(hub) {
  var asset = getCurrentAsset(hub); if (!asset) return;
  var now = Date.now(), pts = [], devs = asset.devices || {};
  for (var id in devs) { var dks = devs[id].dataKeys || []; for (var i = 0; i < dks.length; i++) {
    var dk = dks[i]; if (!dk || dk.name !== "num_of_targets" || !dk.data) continue;
    for (var j = 0; j < dk.data.length; j++) { var ts = Number(dk.data[j].ts), v = Number(dk.data[j].v); if (isFinite(ts) && isFinite(v)) pts.push({ ts: ts, v: v }); }
  }}
  if (!pts.length) { residentState = "OFFLINE"; stateStartTs = now; lastPresenceTs = null; return; }
  pts.sort(function (a, b) { return a.ts - b.ts; });
  var lt = pts[pts.length - 1].ts;
  if (now - lt > OFFLINE_LIMIT_MS) { residentState = "OFFLINE"; stateStartTs = lt + OFFLINE_LIMIT_MS; lastPresenceTs = null; return; }
  var ps = null, lp = null;
  for (var k = 0; k < pts.length; k++) { if (pts[k].v >= 1) { if (ps === null) ps = pts[k].ts; else if (lp !== null && pts[k].ts - lp > HOLD_MS) ps = pts[k].ts; lp = pts[k].ts; } }
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
function evaluateState(hub) {
  var now = Date.now();
  if (residentState === null) { initializeFromHistory(hub); return; }
  var snap = computePresenceSnapshot(hub, now); if (!snap) return;

  if (currentLocationRooms.length) {
    var asset = getCurrentAsset(hub);
    if (asset) {
      var rs = {}; currentLocationRooms.forEach(function (r) { rs[r] = true; });
      var ts = {};
      var devs = asset.devices || {};
      for (var id in devs) {
        var d = devs[id], did = d.id || d.deviceId || d.name || d.label; if (!did) continue;
        var rm = resolveDeviceRoomName(d); if (!rm || !rs[rm]) continue;
        var tk = null; var dks = d.dataKeys || []; for (var i = 0; i < dks.length; i++) if (dks[i].name === "ED_tier") { tk = dks[i]; break; }
        if (!tk || !tk.data || !tk.data.length) continue;
        var lt = tk.data[tk.data.length - 1]; var tier = Number(lt.v), tts = Number(lt.ts);
        if (!isFinite(tier) || !isFinite(tts) || now - tts > OFFLINE_LIMIT_MS) continue;
        ts[did] = { tier: tier, ts: tts, label: d.label || d.name || d.deviceId || did };
      }
      for (var tid in ts) {
        var s = ts[tid];
        var st = movementTiersByDevice[tid] || { tier: null, tierTs: null, pendingTier: null, pendingSince: null, label: null };
        st.label = s.label;
        if (st.tier === null) { st.tier = s.tier; st.tierTs = s.ts; st.pendingTier = null; st.pendingSince = null; }
        else if (st.tier === s.tier) { st.pendingTier = null; st.pendingSince = null; st.tierTs = s.ts; }
        else { if (st.pendingTier !== s.tier) { st.pendingTier = s.tier; st.pendingSince = now; } else if (now - st.pendingSince >= TIER_HOLD_MS) { st.tier = st.pendingTier; st.tierTs = s.ts; st.pendingTier = null; st.pendingSince = null; } }
        movementTiersByDevice[tid] = st;
      }
      for (var mid in movementTiersByDevice) { var mst = movementTiersByDevice[mid]; if (!ts[mid] || !mst.tierTs || now - mst.tierTs > OFFLINE_LIMIT_MS) delete movementTiersByDevice[mid]; }
    }
  }

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
  var byRoom = {}, timestamps = [], devs = asset.devices || {};
  for (var id in devs) {
    var d = devs[id], dks = d.dataKeys || [], tk = null;
    for (var i = 0; i < dks.length; i++) if (dks[i].name === "num_of_targets") { tk = dks[i]; break; }
    if (!tk || !tk.data || !tk.data.length) continue;
    var room = resolveDeviceRoomName(d); if (!room) continue;
    if (!byRoom[room]) byRoom[room] = [];
    for (var j = 0; j < tk.data.length; j++) { var ts = Number(tk.data[j].ts), v = Number(tk.data[j].v); if (isFinite(ts) && isFinite(v)) { byRoom[room].push({ ts: ts, v: v }); timestamps.push(ts); } }
  }
  for (var r in byRoom) byRoom[r].sort(function (a, b) { return a.ts - b.ts; });
  timestamps.sort(function (a, b) { return a - b; });
  var uniq = []; for (var k = 0; k < timestamps.length; k++) if (!k || timestamps[k] !== timestamps[k - 1]) uniq.push(timestamps[k]);
  return { byRoom: byRoom, timestamps: uniq };
}
function evaluateRoomSeriesAtTs(series, ts) {
  if (!series || !series.length) return { active: false, targets: 0, sourceTs: null };
  var lo = 0, hi = series.length - 1, idx = -1;
  while (lo <= hi) { var mid = (lo + hi) >> 1; if (series[mid].ts <= ts) { idx = mid; lo = mid + 1; } else hi = mid - 1; }
  if (idx < 0) return { active: false, targets: 0, sourceTs: null };
  var s = series[idx];
  if (!isFinite(s.ts) || !isFinite(s.v)) return { active: false, targets: 0, sourceTs: null };
  if (ts - s.ts > OFFLINE_LIMIT_MS) return { active: false, targets: 0, sourceTs: s.ts };
  if (s.v >= 1 && ts - s.ts <= HOLD_MS) return { active: true, targets: s.v, sourceTs: s.ts };
  return { active: false, targets: 0, sourceTs: s.ts };
}
function getStableLocationSnapshot(hub, now) {
  var hist = gatherRoomPresenceHistory(hub);
  var byRoom = hist.byRoom, roomNames = Object.keys(byRoom).sort();
  if (!roomNames.length) return { rooms: [], targetsByRoom: {}, totalTargets: 0, currentBlock: null, blocks: [] };
  var timepoints = hist.timestamps.slice(); timepoints.push(now); timepoints.sort(function (a, b) { return a - b; });
  var blocks = [];
  for (var i = 0; i < timepoints.length; i++) {
    var tp = timepoints[i], rooms = [], tbr = {}, tt = 0;
    for (var ri = 0; ri < roomNames.length; ri++) {
      var rm = roomNames[ri], st = evaluateRoomSeriesAtTs(byRoom[rm], tp);
      if (!st.active) continue; rooms.push(rm); tbr[rm] = st.targets; tt += st.targets;
    }
    rooms.sort();
    var start = tp, end = i < timepoints.length - 1 ? timepoints[i + 1] : now; if (end < start) end = start;
    if (!blocks.length || !arraysEqual(blocks[blocks.length - 1].rooms, rooms))
      blocks.push({ rooms: rooms, start: start, end: end, targetsByRoom: tbr, totalTargets: tt });
    else { var lb = blocks[blocks.length - 1]; lb.end = end; lb.targetsByRoom = tbr; lb.totalTargets = tt; }
  }
  var merged = [];
  for (var j = 0; j < blocks.length; j++) {
    var b = blocks[j]; if (b.end <= b.start) continue;
    if (!merged.length || !arraysEqual(merged[merged.length - 1].rooms, b.rooms))
      merged.push({ rooms: b.rooms.slice(), start: b.start, end: b.end, targetsByRoom: b.targetsByRoom, totalTargets: b.totalTargets });
    else { var lm = merged[merged.length - 1]; lm.end = b.end; lm.targetsByRoom = b.targetsByRoom; lm.totalTargets = b.totalTargets; }
  }
  var cb = null;
  for (var k = merged.length - 1; k >= 0; k--) if (merged[k].start <= now && merged[k].end >= now) { cb = merged[k]; break; }
  if (!cb && merged.length) cb = merged[merged.length - 1];
  return { rooms: cb ? cb.rooms.slice() : [], targetsByRoom: cb ? cb.targetsByRoom : {}, totalTargets: cb ? cb.totalTargets : 0, currentBlock: cb, blocks: merged };
}
function computeLocationBlocks(hub, now) {
  return cached("locBlocks", function () {
    var snap = getStableLocationSnapshot(hub, now);
    return (snap.blocks || []).map(function (b) { return { rooms: b.rooms.slice(), start: b.start, end: b.end }; });
  });
}
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
  var snap = getStableLocationSnapshot(hub, now), block = snap.currentBlock;
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
function evaluateLocations(hub) {
  var now = Date.now();
  previousLocationRooms = []; previousLocationStartTs = null; previousLocationEndTs = null;
  var bl = computeLocationBlocks(hub, now); if (!bl.length) return;
  function ok(r) { return r && r.length > 0; }
  function isGap(b) { return !ok(b.rooms) && (b.end - b.start) < LOCATION_GAP_HOLD_MS; }
  if (residentState === "AT_HOME") {
    if (!currentLocationStartTs || !currentLocationRooms.length) return;
    for (var i = bl.length - 1; i >= 0; i--) {
      var b = bl[i]; if (b.end > currentLocationStartTs || isGap(b) || !ok(b.rooms) || arraysEqual(b.rooms, currentLocationRooms)) continue;
      previousLocationRooms = b.rooms.slice(); previousLocationStartTs = b.start; previousLocationEndTs = Math.min(b.end, currentLocationStartTs); return;
    }
  } else if (residentState === "OUT_OF_HOME" && stateStartTs) {
    for (var j = bl.length - 1; j >= 0; j--) {
      var pb = bl[j]; if (pb.end > stateStartTs || isGap(pb) || !ok(pb.rooms)) continue;
      previousLocationRooms = pb.rooms.slice(); previousLocationStartTs = pb.start; previousLocationEndTs = Math.min(pb.end, stateStartTs); return;
    }
  }
}

/***********************
 * TIMELINE BUILDERS (CACHED)
 ***********************/
function build24hTimelineBlocks(hub, sTs, eTs) {
  return cached("t24bl_" + sTs + "_" + eTs, function () {
    var stableBlocks = computeLocationBlocks(hub, eTs), blocks = [], cursor = sTs;
    function push(rooms, start, end) { if (!(end > start)) return; var r = rooms && rooms.length ? rooms.slice() : []; blocks.push({ rooms: r, start: start, end: end, key: blockKey(r) }); }
    if (!stableBlocks || !stableBlocks.length) { push([], sTs, eTs); return blocks; }
    for (var i = 0; i < stableBlocks.length; i++) {
      var b = stableBlocks[i]; if (b.end <= sTs || b.start >= eTs) continue;
      var s = Math.max(b.start, sTs), e = Math.min(b.end, eTs);
      if (s > cursor) push([], cursor, s); push(b.rooms, s, e); cursor = Math.max(cursor, e);
    }
    if (cursor < eTs) push([], cursor, eTs);
    if (!blocks.length) push([], sTs, eTs);
    return blocks;
  });
}

function buildOvernightBlocks(hub, startTs, endTs) {
  return cached("oBlk_" + startTs + "_" + endTs, function () {
    var asset = getCurrentAsset(hub); if (!asset) return [];
    var mMs = 60000, tm = Math.floor((endTs - startTs) / mMs);
    var ms = new Array(tm); for (var i = 0; i < tm; i++) ms[i] = "none";
    var PRI = { none: 0, t0: 1, t1: 2, t2: 3, t3: 4 }, devs = asset.devices || {};
    for (var id in devs) {
      var d = devs[id], rm = resolveDeviceRoomName(d); if (!rm || rm.toLowerCase() !== "bedroom") continue;
      var dks = d.dataKeys || [], tk = null, tierK = null;
      for (var di = 0; di < dks.length; di++) { if (dks[di].name === "num_of_targets") tk = dks[di]; if (dks[di].name === "ED_tier") tierK = dks[di]; }
      if (!tk || !tk.data || !tk.data.length) continue;
      var hasTier = !!(tierK && tierK.data && tierK.data.length);
      var td = hasTier ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
      var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
      var ti = 0, pi = 0, cTier = 0, cTarg = 0;
      while (pi < pd.length && Number(pd[pi].ts) <= startTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= startTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
      for (var mn = 0; mn < tm; mn++) {
        var me = startTs + (mn + 1) * mMs;
        while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
        while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
        if (cTarg < 1) continue;
        var key = hasTier ? (cTier >= 3 ? "t3" : cTier >= 2 ? "t2" : cTier >= 1 ? "t1" : "t0") : "t1";
        if (PRI[key] > PRI[ms[mn]]) ms[mn] = key;
      }
    }
    var blocks = [], curKey = ms.length ? ms[0] : "none", bStart = startTs;
    for (var j = 1; j < tm; j++) { if (ms[j] !== curKey) { blocks.push({ key: curKey, start: bStart, end: startTs + j * mMs }); bStart = startTs + j * mMs; curKey = ms[j]; } }
    blocks.push({ key: curKey, start: bStart, end: endTs });
    return blocks;
  });
}

function computeHourlyBreakdown(hub, sTs, eTs) {
  return cached("hrBk_" + sTs + "_" + eTs, function () {
    var asset = getCurrentAsset(hub), mMs = 60000, tm = Math.floor((eTs - sTs) / mMs);
    if (!asset) { var e = []; for (var ei = 0; ei < 24; ei++) e.push({ away: 60, rest: 0, move: 0, walk: 0, multi: 0 }); return e; }
    var ms = new Array(tm); for (var i = 0; i < tm; i++) ms[i] = 0;
    var rp = {}, devs = asset.devices || {};
    for (var id in devs) {
      var d = devs[id], rm = resolveDeviceRoomName(d); if (!rm) continue;
      var dks = d.dataKeys || [], tk = null, tierK = null;
      for (var di = 0; di < dks.length; di++) { if (dks[di].name === "num_of_targets") tk = dks[di]; if (dks[di].name === "ED_tier") tierK = dks[di]; }
      if (!tk || !tk.data || !tk.data.length) continue;
      var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
      var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
      var ti = 0, pi = 0, cTier = 0, cTarg = 0;
      while (pi < pd.length && Number(pd[pi].ts) <= sTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= sTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
      for (var mn = 0; mn < tm; mn++) {
        var me = sTs + (mn + 1) * mMs;
        while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
        while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
        if (cTarg < 1) continue; ms[mn] = cTier;
        if (!rp[mn]) rp[mn] = {}; rp[mn][rm] = true;
      }
    }
    for (var mi = 0; mi < tm; mi++) if (rp[mi] && Object.keys(rp[mi]).length > 1) ms[mi] = 4;
    var bk = []; for (var h = 0; h < 24; h++) bk.push({ away: 0, rest: 0, move: 0, walk: 0, multi: 0 });
    for (var j = 0; j < tm; j++) { var hr = Math.floor(j / 60); if (hr >= 24) break; var st = ms[j]; if (st === 0) bk[hr].away++; else if (st === 1) bk[hr].rest++; else if (st === 2) bk[hr].move++; else if (st === 3) bk[hr].walk++; else if (st === 4) bk[hr].multi++; }
    return bk;
  });
}

function computeRoomTierSeries(hub, sTs, eTs) {
  return cached("rmTier_" + sTs + "_" + eTs, function () {
    var asset = getCurrentAsset(hub), mMs = 60000, tm = Math.floor((eTs - sTs) / mMs);
    var ms = new Array(tm); for (var i = 0; i < tm; i++) ms[i] = { rooms: {}, tier: -1 };
    var roomSet = {}; if (!asset) return { minutes: ms, rooms: [] };
    var devs = asset.devices || {};
    for (var id in devs) {
      var d = devs[id], rm = resolveDeviceRoomName(d); if (!rm) continue;
      var dks = d.dataKeys || [], tk = null, tierK = null;
      for (var di = 0; di < dks.length; di++) { if (dks[di].name === "num_of_targets") tk = dks[di]; if (dks[di].name === "ED_tier") tierK = dks[di]; }
      if (!tk || !tk.data || !tk.data.length) continue;
      var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
      var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
      var ti = 0, pi = 0, cTier = 0, cTarg = 0;
      while (pi < pd.length && Number(pd[pi].ts) <= sTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= sTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
      for (var mn = 0; mn < tm; mn++) {
        var me = sTs + (mn + 1) * mMs;
        while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
        while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
        if (cTarg < 1) continue; ms[mn].rooms[rm] = true; roomSet[rm] = true;
        if (cTier > ms[mn].tier) ms[mn].tier = cTier;
      }
    }
    return { minutes: ms, rooms: Object.keys(roomSet).sort() };
  });
}

function computeTierTotals(hub) {
  return cached("tierTots", function () {
    var eTs = getLatestTelemetryTs(hub) || Date.now();
    eTs = Math.floor(eTs / 60000) * 60000; var sTs = eTs - 86400000;
    var asset = getCurrentAsset(hub);
    if (!asset) return { t0: 0, t1: 0, t2: 0, t3: 0 };
    var mMs = 60000, tm = Math.floor((eTs - sTs) / mMs);
    var ms = new Array(tm); for (var i = 0; i < tm; i++) ms[i] = -1;
    var devs = asset.devices || {};
    for (var id in devs) {
      var d = devs[id], rm = resolveDeviceRoomName(d); if (!rm || rm.toLowerCase() !== "bedroom") continue;
      var dks = d.dataKeys || [], tk = null, tierK = null;
      for (var di = 0; di < dks.length; di++) { if (dks[di].name === "num_of_targets") tk = dks[di]; if (dks[di].name === "ED_tier") tierK = dks[di]; }
      if (!tk || !tk.data || !tk.data.length) continue;
      var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
      var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
      var ti = 0, pi = 0, cTier = 0, cTarg = 0;
      while (pi < pd.length && Number(pd[pi].ts) <= sTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= sTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
      for (var mn = 0; mn < tm; mn++) {
        var me = sTs + (mn + 1) * mMs;
        while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
        while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
        if (cTarg < 1) continue;
        var t = cTier >= 3 ? 3 : cTier >= 2 ? 2 : cTier >= 1 ? 1 : 0;
        if (t > ms[mn]) ms[mn] = t;
      }
    }
    var res = { t0: 0, t1: 0, t2: 0, t3: 0 };
    for (var j = 0; j < tm; j++) { if (ms[j] === 3) res.t3++; else if (ms[j] === 2) res.t2++; else if (ms[j] === 1) res.t1++; else if (ms[j] === 0) res.t0++; }
    return res;
  });
}

function computeNightHourlyBreakdown(hub, sTs, eTs) {
  return cached("nHrBk_" + sTs + "_" + eTs, function () {
    var mMs = 60000, tm = Math.floor((eTs - sTs) / mMs), asset = getCurrentAsset(hub);
    var ms = new Array(tm); for (var m = 0; m < tm; m++) ms[m] = 0;
    if (!asset) return pack();
    var rp = {}, devs = asset.devices || {};
    for (var id in devs) {
      var d = devs[id], rm = resolveDeviceRoomName(d); if (!rm || rm.toLowerCase() !== "bedroom") continue;
      var dks = d.dataKeys || [], tk = null, tierK = null;
      for (var di = 0; di < dks.length; di++) { if (dks[di].name === "num_of_targets") tk = dks[di]; if (dks[di].name === "ED_tier") tierK = dks[di]; }
      if (!tk || !tk.data || !tk.data.length) continue;
      var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
      var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
      var ti = 0, pi = 0, cTier = 0, cTarg = 0;
      while (pi < pd.length && Number(pd[pi].ts) <= sTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= sTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
      for (var mn = 0; mn < tm; mn++) {
        var me = sTs + (mn + 1) * mMs;
        while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
        while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
        if (cTarg < 1) continue;
        if (!rp[mn]) rp[mn] = 0; rp[mn] += cTarg;
        var ds = cTier >= 2 ? 2 : cTier >= 1 ? 1 : 0; if (ds > ms[mn]) ms[mn] = ds;
      }
    }
    for (var mi = 0; mi < tm; mi++) if (rp[mi] && rp[mi] >= 2 && ms[mi] > 0) ms[mi] = 3;
    return pack();
    function pack() {
      var b = []; for (var h = 0; h < 12; h++) b.push({ out: 0, rest: 0, active: 0, multi: 0 });
      for (var i = 0; i < tm; i++) { var hr = Math.floor(i / 60); if (hr >= 12) break; var st = ms[i]; if (st === 0) b[hr].out++; else if (st === 1) b[hr].rest++; else if (st === 2) b[hr].active++; else if (st === 3) b[hr].multi++; }
      return b;
    }
  });
}

function computeOvernightRoomTierSeries(hub, sTs, eTs) {
  return cached("oRmTier_" + sTs + "_" + eTs, function () {
    var asset = getCurrentAsset(hub); if (!asset) return { minutes: [], zones: [] };
    var mMs = 60000, tm = Math.floor((eTs - sTs) / mMs);
    var ms = new Array(tm); for (var i = 0; i < tm; i++) ms[i] = { zone: "none", tier: -1 };
    var zoneSet = {}, devs = asset.devices || {};
    var zPri = { bed: 4, bedroom: 3, bathroom: 2, other: 1, none: 0 };
    for (var id in devs) {
      var d = devs[id], rm = resolveDeviceRoomName(d); if (!rm) continue; var rmLow = rm.toLowerCase();
      var dks = d.dataKeys || [], tk = null, tierK = null, zoneK = null;
      for (var di = 0; di < dks.length; di++) { if (dks[di].name === "num_of_targets") tk = dks[di]; if (dks[di].name === "ED_tier") tierK = dks[di]; if (dks[di].name === "zone" || dks[di].name === "ED_zone") zoneK = dks[di]; }
      if (!tk || !tk.data || !tk.data.length) continue;
      var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
      var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
      var zd = zoneK && zoneK.data ? zoneK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
      var ti = 0, pi = 0, zi = 0, cTier = 0, cTarg = 0, cZone = "";
      while (pi < pd.length && Number(pd[pi].ts) <= sTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= sTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
      while (zi < zd.length && Number(zd[zi].ts) <= sTs) { cZone = String(zd[zi].v || "").toLowerCase(); zi++; }
      for (var mn = 0; mn < tm; mn++) {
        var me = sTs + (mn + 1) * mMs;
        while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
        while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
        while (zi < zd.length && Number(zd[zi].ts) <= me) { cZone = String(zd[zi].v || "").toLowerCase(); zi++; }
        if (cTarg < 1) continue;
        var z = cZone === "bed" ? "bed" : rmLow === "bedroom" ? "bedroom" : rmLow === "bathroom" ? "bathroom" : "other";
        if (zPri[z] > (zPri[ms[mn].zone] || 0)) ms[mn].zone = z; zoneSet[z] = true;
        if ((z === "bed" || z === "bedroom") && cTier > ms[mn].tier) ms[mn].tier = cTier;
      }
    }
    return { minutes: ms, zones: Object.keys(zoneSet).sort() };
  });
}

function computeNightEvents(hub, sTs, eTs) {
  return cached("nEvt_" + sTs + "_" + eTs, function () {
    var asset = getCurrentAsset(hub);
    if (!asset) return { movementInBed: 0, bathroomVisits: 0, timesOutOfBed: 0, timeOutOfBedMs: 0 };
    var mMs = 60000, tm = Math.floor((eTs - sTs) / mMs);
    var bedMin = new Array(tm), bathMin = new Array(tm);
    for (var i = 0; i < tm; i++) { bedMin[i] = 0; bathMin[i] = 0; }
    var devs = asset.devices || {};
    for (var id in devs) {
      var d = devs[id], rm = resolveDeviceRoomName(d); if (!rm) continue;
      var isbed = rm.toLowerCase() === "bedroom", isbath = rm.toLowerCase() === "bathroom";
      if (!isbed && !isbath) continue;
      var dks = d.dataKeys || [], tk = null, tierK = null;
      for (var di = 0; di < dks.length; di++) { if (dks[di].name === "num_of_targets") tk = dks[di]; if (dks[di].name === "ED_tier") tierK = dks[di]; }
      if (!tk || !tk.data || !tk.data.length) continue;
      var td = tierK && tierK.data ? tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); }) : [];
      var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
      var ti = 0, pi = 0, cTier = 0, cTarg = 0;
      while (pi < pd.length && Number(pd[pi].ts) <= sTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
      while (ti < td.length && Number(td[ti].ts) <= sTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
      for (var mn = 0; mn < tm; mn++) {
        var me = sTs + (mn + 1) * mMs;
        while (pi < pd.length && Number(pd[pi].ts) <= me) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
        while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
        if (cTarg < 1) continue;
        if (isbed) { var s = (cTier >= 2) ? 2 : (cTier >= 1) ? 1 : 0; if (s > bedMin[mn]) bedMin[mn] = s; }
        if (isbath) bathMin[mn] = 1;
      }
    }
    var movI = 0, inM = false; for (var m = 0; m < tm; m++) { if (bedMin[m] === 2) { if (!inM) { movI++; inM = true; } } else inM = false; }
    var bathV = 0, inB = false; for (var b = 0; b < tm; b++) { if (bathMin[b] === 1) { if (!inB) { bathV++; inB = true; } } else inB = false; }
    var tOut = 0, tOutMin = 0, wasOut = false;
    var first = -1; for (var f = 0; f < tm; f++) if (bedMin[f] > 0) { first = f; break; }
    var last = -1; for (var l = tm - 1; l >= 0; l--) if (bedMin[l] > 0) { last = l; break; }
    if (first >= 0 && last > first) { for (var o = first; o <= last; o++) { if (bedMin[o] === 0) { tOutMin++; if (!wasOut) { tOut++; wasOut = true; } } else wasOut = false; } }
    return { movementInBed: movI, bathroomVisits: bathV, timesOutOfBed: tOut, timeOutOfBedMs: tOutMin * mMs };
  });
}

/***********************
 * LAST 3h ACTIVITY (NEW)
 ***********************/
function computeLast3hActivity(hub) {
  return cached("3hAct", function () {
    var now = Date.now();
    var mMs = 60000, tm = 180;
    var sTs = Math.floor((now - tm * mMs) / mMs) * mMs;
    var eTs = sTs + tm * mMs;
    var asset = getCurrentAsset(hub);
    if (!asset) return { seenMinutes: 0, roomChanges: 0, uniqueRooms: 0 };

    var seen = new Array(tm);
    var roomMin = new Array(tm);
    for (var i = 0; i < tm; i++) { seen[i] = false; roomMin[i] = {}; }

    var devs = asset.devices || {};
    for (var id in devs) {
      var d = devs[id], rm = resolveDeviceRoomName(d);
      var dks = d.dataKeys || [], tierK = null, tk = null;
      for (var di = 0; di < dks.length; di++) {
        if (dks[di].name === "ED_tier") tierK = dks[di];
        if (dks[di].name === "num_of_targets") tk = dks[di];
      }

      if (tierK && tierK.data && tierK.data.length) {
        var td = tierK.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
        var ti = 0, cTier = 0;
        while (ti < td.length && Number(td[ti].ts) <= sTs) { var tv = Number(td[ti].v); if (isFinite(tv)) cTier = tv; ti++; }
        for (var mn = 0; mn < tm; mn++) {
          var me = sTs + (mn + 1) * mMs;
          while (ti < td.length && Number(td[ti].ts) <= me) { var ttv = Number(td[ti].v); if (isFinite(ttv)) cTier = ttv; ti++; }
          if (cTier >= 1) seen[mn] = true;
        }
      }

      if (tk && tk.data && tk.data.length && rm) {
        var pd = tk.data.slice().sort(function (a, b) { return Number(a.ts) - Number(b.ts); });
        var pi = 0, cTarg = 0;
        while (pi < pd.length && Number(pd[pi].ts) <= sTs) { var v = Number(pd[pi].v); if (isFinite(v)) cTarg = v; pi++; }
        for (var mn2 = 0; mn2 < tm; mn2++) {
          var me2 = sTs + (mn2 + 1) * mMs;
          while (pi < pd.length && Number(pd[pi].ts) <= me2) { var pv = Number(pd[pi].v); if (isFinite(pv)) cTarg = pv; pi++; }
          if (cTarg >= 1) roomMin[mn2][rm] = true;
        }
      }
    }

    var seenMinutes = 0;
    for (var s = 0; s < tm; s++) if (seen[s]) seenMinutes++;

    var prevKey = null, roomChanges = 0, uniqueRooms = {};
    for (var r = 0; r < tm; r++) {
      var rms = Object.keys(roomMin[r]).sort();
      if (!rms.length) { prevKey = null; continue; }
      var rk = rms.join("+");
      for (var ri = 0; ri < rms.length; ri++) uniqueRooms[rms[ri]] = true;
      if (prevKey !== null && rk !== prevKey) roomChanges++;
      prevKey = rk;
    }

    return {
      seenMinutes: seenMinutes,
      roomChanges: roomChanges,
      uniqueRooms: Object.keys(uniqueRooms).length
    };
  });
}

/***********************
 * HERO CARD HELPERS
 ***********************/
var cachedGotUpTs = null, cachedGotUpDay = null, cachedPrevRoom = null, cachedPrevRoomEndTs = null, cachedPrevRoomDay = null;
function getTodayKey(tz) { return new Date().toLocaleDateString("en-CA", tz ? { timeZone: tz } : undefined); }
function getTodayStartUtc(tz) {
  var todayStr = new Date().toLocaleDateString("en-CA", tz ? { timeZone: tz } : undefined);
  var utc = new Date(todayStr + "T00:00:00Z").getTime();
  if (tz) { var off = new Date(new Date(utc).toLocaleString("en-US", { timeZone: tz })).getTime() - new Date(new Date(utc).toLocaleString("en-US", { timeZone: "UTC" })).getTime(); utc -= off; }
  return utc;
}
function findLatestSampleByKey(hub, keyName) {
  var asset = getCurrentAsset(hub); if (!asset) return null;
  var best = null, devs = asset.devices || {};
  for (var id in devs) { var dks = devs[id].dataKeys || []; for (var i = 0; i < dks.length; i++) {
    var dk = dks[i]; if (!dk || dk.name !== keyName || !dk.data || !dk.data.length) continue;
    var last = dk.data[dk.data.length - 1], ts = Number(last.ts);
    if (isFinite(ts) && (!best || ts > best.ts)) best = { ts: ts, v: last.v };
  }}
  return best;
}
function findTodayBedSessionEnd(hub) {
  var tz = getAssetTimezone(hub), asset = getCurrentAsset(hub); if (!asset) return null;
  var start = getTodayStartUtc(tz), best = null, devs = asset.devices || {};
  for (var id in devs) { var dks = devs[id].dataKeys || []; for (var i = 0; i < dks.length; i++) {
    var dk = dks[i]; if (!dk || dk.name !== "E_bedSession_end" || !dk.data) continue;
    for (var j = dk.data.length - 1; j >= 0; j--) { var ts = Number(dk.data[j].ts); if (!isFinite(ts)) continue; if (ts < start) break; if (!best || ts > best.ts) best = { ts: ts, v: dk.data[j].v }; }
  }}
  return best;
}
function findFirstTierEventToday(hub) {
  var tz = getAssetTimezone(hub), start = getTodayStartUtc(tz), now = Date.now();
  var blocks = computeLocationBlocks(hub, now);
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i]; if (b.end <= start || b.end > now) continue;
    var isBed = false; for (var r = 0; r < b.rooms.length; r++) if (b.rooms[r].toLowerCase() === "bedroom") { isBed = true; break; }
    if (!isBed) continue;
    var h = getHourInTz(b.end, tz); if (h >= 3 && h < 14) return { ts: b.end };
  }
  return null;
}
function computeLastMovedTs(hub) {
  var asset = getCurrentAsset(hub); if (!asset) return null;
  var lastTs = null, devs = asset.devices || {};
  for (var id in devs) { var dks = devs[id].dataKeys || []; for (var i = 0; i < dks.length; i++) {
    var dk = dks[i]; if (!dk || dk.name !== "ED_tier" || !dk.data) continue;
    for (var j = dk.data.length - 1; j >= 0; j--) { var ts = Number(dk.data[j].ts), v = Number(dk.data[j].v); if (!isFinite(ts) || !isFinite(v)) continue; if (v >= 2) { if (lastTs === null || ts > lastTs) lastTs = ts; break; } }
  }}
  return lastTs;
}

/***********************
 * BUILD PAGES
 ***********************/
function buildPage1() {
  var p = document.createElement("div"); p.className = "page";
  p.innerHTML =
    '<div class="card is-loading" id="card-1"><div class="moved-indicator-row"><div class="moved-indicator-left"><div class="moved-dot" style="background:#C9CCD1"></div><span class="moved-text">Moved <span class="moved-time">\u2014</span></span></div><div class="resident-chip-row"></div></div></div>' +
    '<div class="card is-loading room-location-card" id="card-2">' + skelTitle() + skelLine('w50') + '<div class="location-main room-location-main"></div><div class="location-sub room-location-sub"></div></div>' +
    '<div class="card is-loading" id="card-14"></div>' +
    '<div class="card is-loading" id="card-15"><div class="activity-state-grid"></div></div>' +
    '<div class="card is-loading" id="card-3" style="display:none"></div>' +
    '<div class="card is-loading" id="card-6">' + skelLine('w80') + skelLine('w60') + '</div>' +
    '<div class="card is-loading" id="card-13"><div class="sensor-status-row"><div class="sensor-status-dot"></div><span class="sensor-status-text"></span></div>' + skelLine('w60') + '</div>';
  return p;
}
function buildPage2() {
  var p = document.createElement("div"); p.className = "page";
  p.innerHTML =
    '<div class="card is-loading" id="card-4"><div class="card-title">Last 24 hours - activity</div><div class="timeline24"><div class="timeline24-bar"><div class="timeline24-segs"></div></div><div class="timeline24-axis"><span class="t24-l"></span><span class="t24-m"></span><span class="t24-r"></span></div></div>' + skelBar() + '<div class="timeline24-legend"></div></div>' +
    '<div class="card is-loading" id="card-7"><div class="card-title">Hourly behaviour breakdown</div>' + skelGraph() + '<div class="hourly-stack"></div><div class="hourly-stack-axis"></div><div class="hourly-stack-legend"></div><div class="daily-dist-wrap"><div class="daily-dist-title">Daily Distribution Summary</div><div class="daily-dist-grid"></div></div><div class="snapshot-pills-wrap"><div class="snapshot-pills-grid"></div></div></div>' +
    '<div class="card is-loading" id="card-8"><div class="card-title">Daily Distribution Summary, by Room</div><div class="room-ribbon-wrap"><canvas class="room-ribbon-canvas"></canvas><div class="room-ribbon-axis"></div></div>' + skelGraph() + '<div class="room-ribbon-legend"></div><div class="room-dist-wrap"><div class="room-dist-title">Time per room</div><div class="room-dist-grid"></div></div></div>';
  return p;
}
function buildPage3() {
  var p = document.createElement("div"); p.className = "page";
  p.innerHTML =
    '<div class="card is-loading" id="card-5"><div class="card-title">Bedroom - overnight activity (21:00 - 09:00)</div>' + skelBar() + skelLine('w60') + '</div>' +
    '<div class="card is-loading" id="card-10"><div class="card-title">In-Bed Summary (21:00 \u2013 09:00)</div><div class="inbed-donut-wrap"><canvas class="inbed-donut-canvas"></canvas><div class="inbed-donut-totals"></div></div><div style="display:flex;align-items:center;gap:24px;margin-top:12px;flex-wrap:wrap"><div class="skel skel-donut"></div><div style="flex:1;min-width:120px">' + skelLine('w80') + skelLine('w60') + skelLine('w80') + '</div></div></div>' +
    '<div class="card is-loading" id="card-11n"><div class="card-title">Night Events (21:00 \u2013 09:00)</div><div class="night-events-grid"></div>' + skelMetrics(4) + '</div>' +
    '<div class="card is-loading" id="card-12"><div class="card-title">Overnight Room Activity (21:00 \u2013 09:00)</div><div class="overnight-ribbon-wrap"><canvas class="overnight-ribbon-canvas"></canvas><div class="overnight-ribbon-axis"></div></div>' + skelGraph() + '<div class="overnight-ribbon-legend"></div></div>' +
    '<div class="card is-loading" id="card-9"><div class="card-title">Night Hourly Breakdown (21:00 \u2013 09:00)</div>' + skelGraph() + '<div class="night-hourly-stack"></div><div class="night-hourly-axis"></div><div class="night-hourly-legend"></div><div class="night-dist-wrap"><div class="night-dist-title">Overnight Distribution</div><div class="night-dist-grid"></div></div></div>';
  return p;
}

/***********************
 * RENDER FUNCTIONS
 ***********************/
function renderAll(hub, container) {
  if (!residentState) return;
  renderCard1(hub, container);
  renderResidentChips(container);
  renderRoomLocationCard(hub, container);
  renderCard14(hub, container);
  renderCard15(hub, container);
  renderCard4(hub, container);
  renderCard5(hub, container);
  renderCard6(hub, container);
  renderCard13(hub, container);
  if (currentAssetHasTier) {
    renderCard8(hub, container);
    renderCard7(hub, container);
    renderCard10(hub, container);
    renderCard11n(hub, container);
    renderCard12(hub, container);
    renderCard9(hub, container);
  }
}

function renderCard1(hub, container) {
  var c = $$(container, "#card-1"); if (!c) return; clearSkeletons(c);
  var dot = c.querySelector(".moved-dot"), timeEl = c.querySelector(".moved-time");
  if (!dot || !timeEl) return;
  var now = Date.now(), lastMovedTs = computeLastMovedTs(hub);
  var isRecent = lastMovedTs !== null && (now - lastMovedTs) <= 900000;
  var timeText;
  if (lastMovedTs === null) timeText = "\u2014";
  else { var dm = Math.floor((now - lastMovedTs) / 60000); if (dm < 1) timeText = "just now"; else if (dm < 60) timeText = dm + " min ago"; else { var h = Math.floor(dm / 60), m = dm % 60; timeText = h + "h" + (m > 0 ? " " + m + "m" : "") + " ago"; } }
  var fp = (isRecent ? "G" : "R") + "|" + timeText;
  renderIfChanged("c1", fp, function () {
    dot.style.background = isRecent ? "#5BAD7A" : "#C9CCD1";
    timeEl.textContent = timeText;
  });
}

function renderResidentChips(container) {
  var c = $$(container, "#card-1"); if (!c) return;
  var r = c.querySelector(".resident-chip-row"); if (!r) return;
  var show = residentState === "AT_HOME" && currentLocationTotalTargets > 1;
  renderIfChanged("chips", show ? "1" : "0", function () {
    r.innerHTML = show ? '<span class="chip-visitor"><span class="chip-visitor-dot"></span>Visitor</span>' : "";
  });
}

function renderRoomLocationCard(hub, container) {
  var c = $$(container, "#card-2"); if (!c) return; clearSkeletons(c);
  var tz = getAssetTimezone(hub);
  var me = c.querySelector(".room-location-main"), se = c.querySelector(".room-location-sub");
  if (!me || !se) return;
  var fp = residentState + "|" + currentLocationRooms.join(",") + "|" + currentLocationStartTs + "|" + previousLocationRooms.join(",") + "|" + previousLocationEndTs;
  renderIfChanged("c2", fp, function () {
    me.classList.remove("away");
    if (residentState === "OFFLINE") { me.textContent = "Offline"; se.textContent = ""; return; }
    if (residentState === "AT_HOME") {
      var room = getDisplayRoomName(currentLocationRooms);
      if (!room) { me.textContent = "Location unavailable"; se.textContent = ""; return; }
      me.textContent = "In the " + room; se.textContent = "since " + formatTime12h(currentLocationStartTs, tz); return;
    }
    var prev = getDisplayRoomName(previousLocationRooms);
    if (!prev || !previousLocationEndTs) { me.textContent = "Last seen location unavailable"; se.textContent = ""; return; }
    me.textContent = "Last seen in the " + prev; me.classList.add("away");
    se.textContent = "at " + formatTime12h(previousLocationEndTs, tz);
  });
}

function renderCard14(hub, container) {
  var c = $$(container, "#card-14"); if (!c) return; clearSkeletons(c);
  var tz = getAssetTimezone(hub), now = Date.now(), hourNow = getHourInTz(now, tz), todayKey = getTodayKey(tz);
  if (cachedGotUpDay !== todayKey) { cachedGotUpTs = null; cachedGotUpDay = null; cachedPrevRoom = null; cachedPrevRoomEndTs = null; cachedPrevRoomDay = null; }
  var bedBegin = findLatestSampleByKey(hub, "E_bedSession_begin"), bedEnd = findTodayBedSessionEnd(hub);
  var inBed = bedBegin && (!bedEnd || bedEnd.ts < bedBegin.ts);
  if (inBed) { cachedGotUpTs = null; cachedGotUpDay = null; cachedPrevRoom = null; cachedPrevRoomEndTs = null; cachedPrevRoomDay = null; }
  var heroIcon = "", heroText = "", heroColor = "", heroWeight = "", showHero = false;
  if (inBed) { heroIcon = "\uD83C\uDF19"; heroText = "Went to bed at " + formatTime12h(bedBegin.ts, tz); heroColor = "#5BAD7A"; heroWeight = "500"; showHero = true; }
  else {
    if (cachedGotUpTs === null) { var gt = bedEnd ? bedEnd.ts : null; if (!gt) { var fb = findFirstTierEventToday(hub); if (fb) gt = fb.ts; } if (gt !== null) { cachedGotUpTs = gt; cachedGotUpDay = todayKey; var pr = getDisplayRoomName(previousLocationRooms); if (pr && previousLocationEndTs) { cachedPrevRoom = pr; cachedPrevRoomEndTs = previousLocationEndTs; cachedPrevRoomDay = todayKey; } } }
    if (cachedGotUpTs !== null) { heroIcon = "\u2600\uFE0F"; heroText = "Got up at " + formatTime12h(cachedGotUpTs, tz); heroColor = hourNow < 12 ? "#5BAD7A" : "#999"; heroWeight = hourNow < 12 ? "500" : "400"; showHero = true; }
  }
  var prevHtml = "";
  if (!inBed && cachedPrevRoom && cachedPrevRoomEndTs) prevHtml = '<div class="hero-prev-room">Previously in the ' + cachedPrevRoom + ' \u00B7 until ' + formatTime12h(cachedPrevRoomEndTs, tz) + '</div>';
  if (!showHero && !prevHtml) { c.style.display = "none"; return; }
  var fp = heroText + "|" + heroColor + "|" + prevHtml;
  renderIfChanged("c14", fp, function () {
    c.style.display = ""; c.className = "card hero-bed-card";
    var html = "";
    if (showHero) html += '<div class="hero-bed-line" style="color:' + heroColor + ';font-weight:' + heroWeight + ';"><span class="hero-bed-icon">' + heroIcon + '</span><span>' + heroText + '</span></div>';
    html += prevHtml; c.innerHTML = html;
  });
}

function renderCard15(hub, container) {
  var c = $$(container, "#card-15"); if (!c) return; clearSkeletons(c);
  var grid = c.querySelector(".activity-state-grid"); if (!grid) return;
  var t = computeTierTotals(hub);
  var fp = t.t0 + "|" + t.t1 + "|" + t.t2 + "|" + t.t3;
  renderIfChanged("c15", fp, function () {
    var cells = [{ dur: t.t3, label: "brisk", color: "#5BAD7A" }, { dur: t.t2, label: "moving", color: "#E8B86D" }, { dur: t.t1, label: "still", color: "#7FBAC8" }, { dur: t.t0, label: "not seen", color: "#D6D3D1" }];
    grid.innerHTML = ""; for (var i = 0; i < cells.length; i++) { var el = document.createElement("div"); el.className = "activity-state-cell"; el.innerHTML = '<span class="activity-state-dot" style="background:' + cells[i].color + '"></span><span class="activity-state-dur">' + fmtDurShort(cells[i].dur) + '</span><span class="activity-state-label">' + cells[i].label + '</span>'; grid.appendChild(el); }
  });
}

function renderCard4(hub, container) {
  var c = $$(container, "#card-4"); if (!c) return; clearSkeletons(c);
  var tz = getAssetTimezone(hub);
  var sw = c.querySelector(".timeline24-segs"), lg = c.querySelector(".timeline24-legend");
  if (!sw || !lg) return;
  var eTs = getLatestTelemetryTs(hub) || Date.now(); eTs = Math.floor(eTs / 60000) * 60000; var sTs = eTs - 86400000;
  var bl = build24hTimelineBlocks(hub, sTs, eTs);
  var fp = bl.map(function (b) { return b.key + ":" + b.start + "-" + b.end; }).join("|");
  renderIfChanged("c4", fp, function () {
    sw.innerHTML = ""; lg.innerHTML = "";
    var sp = eTs - sTs, tots = {};
    bl.forEach(function (b) {
      var left = ((b.start - sTs) / sp) * 100, width = ((b.end - b.start) / sp) * 100;
      tots[b.key] = (tots[b.key] || 0) + ((b.end - b.start) / 60000);
      var ck = b.key === "multi" ? "multi" : b.key === "none" ? "none" : b.key.replace("room:", "").toLowerCase();
      var col = ROOM_COLORS[ck] || "#ccc";
      var nm = b.key === "multi" ? "Multiple Detections" : b.key === "none" ? "No detection" : b.key.replace("room:", "");
      var dm = Math.max(1, Math.round((b.end - b.start) / 60000));
      var tt = nm + " \u2022 " + formatTimeShort(b.start, tz) + " - " + formatTimeShort(b.end, tz) + " \u2022 " + (dm < 60 ? dm + " min" : Math.floor(dm / 60) + "h " + (dm % 60) + "m");
      var d = document.createElement("div"); d.className = "timeline24-seg"; d.style.left = left + "%"; d.style.width = width + "%"; d.style.background = col;
      d.addEventListener("mouseenter", function (e) { showTimelineTooltip(tt, e.clientX, e.clientY); });
      d.addEventListener("mousemove", function (e) { showTimelineTooltip(tt, e.clientX, e.clientY); });
      d.addEventListener("mouseleave", hideTimelineTooltip); sw.appendChild(d);
    });
    var aL = c.querySelector(".t24-l"), aM = c.querySelector(".t24-m"), aR = c.querySelector(".t24-r");
    if (aL) aL.textContent = formatTimeShort(sTs, tz); if (aM) aM.textContent = formatTimeShort(sTs + sp / 2, tz); if (aR) aR.textContent = formatTimeShort(eTs, tz);
    Object.keys(tots).forEach(function (k) { var ck = k === "multi" ? "multi" : k === "none" ? "none" : k.replace("room:", "").toLowerCase(); var nm = k === "multi" ? "Multiple Detections" : k === "none" ? "No detection" : k.replace("room:", ""); var r = document.createElement("div"); r.className = "t24-row"; r.innerHTML = '<div class="t24-left"><span class="t24-dot" style="background:' + (ROOM_COLORS[ck] || "#ccc") + '"></span><span>' + nm + '</span></div><div class="t24-dur">' + fmtHM(tots[k]) + '</div>'; lg.appendChild(r); });
  });
}

function renderCard5(hub, container) {
  var c = $$(container, "#card-5"); if (!c) return; clearSkeletons(c);
  var tz = getAssetTimezone(hub), ow = overnightWindowInTz(tz);
  var bl = buildOvernightBlocks(hub, ow.startTs, ow.endTs);
  var fp = bl.map(function (b) { return b.key + ":" + b.start; }).join("|");
  renderIfChanged("c5", fp, function () {
    c.innerHTML = '<div class="card-title">Bedroom - overnight activity (21:00 - 09:00)</div><div class="overnight-wrap"><div class="overnight-bar"><div class="overnight-segs"></div></div><div class="overnight-axis"><span>21:00</span><span>00:00</span><span>03:00</span><span>06:00</span><span>09:00</span></div></div><div class="overnight-legend"></div>';
    var sw = c.querySelector(".overnight-segs"), lg = c.querySelector(".overnight-legend");
    var sp = ow.endTs - ow.startTs, tots = {};
    bl.forEach(function (b) { var left = ((b.start - ow.startTs) / sp) * 100, width = ((b.end - b.start) / sp) * 100; tots[b.key] = (tots[b.key] || 0) + ((b.end - b.start) / 60000); var d = document.createElement("div"); d.style.cssText = "position:absolute;top:0;bottom:0;left:" + left + "%;width:" + width + "%;background:" + (OVERNIGHT_COLORS[b.key] || "#ccc"); sw.appendChild(d); });
    ["t0", "t1", "t2", "t3"].forEach(function (k) { if (!tots[k]) return; var lb = k === "t0" ? "Away" : k === "t1" ? "Resting" : k === "t2" ? "Moving" : "Walking"; var r = document.createElement("div"); r.className = "t24-row"; r.innerHTML = '<div class="t24-left"><span class="t24-dot" style="background:' + (OVERNIGHT_COLORS[k] || "#ccc") + '"></span><span>' + lb + '</span></div><div class="t24-dur">' + fmtHM(tots[k]) + '</div>'; lg.appendChild(r); });
  });
}

function renderCard6(hub, container) {
  var c = $$(container, "#card-6"); if (!c) return; clearSkeletons(c);
  var act = computeLast3hActivity(hub);
  var fp = act.seenMinutes + "|" + act.roomChanges + "|" + act.uniqueRooms;
  renderIfChanged("c6", fp, function () {
    var movedText = "Moved " + act.roomChanges + " time"
      + (act.roomChanges !== 1 ? "s" : "")
      + " between " + act.uniqueRooms + " room"
      + (act.uniqueRooms !== 1 ? "s" : "");
    var seenText = "Seen for " + fmtDurShort(act.seenMinutes)
      + " of the last 3 hours";
    c.innerHTML =
      '<div class="activity-summary-text">' + movedText + '</div>' +
      '<div class="activity-summary-text">' + seenText + '</div>';
  });
}

function renderCard13(hub, container) {
  var c = $$(container, "#card-13"); if (!c) return; clearSkeletons(c);
  var asset = getCurrentAsset(hub); if (!asset) return;
  var tz = getAssetTimezone(hub), now = Date.now();
  var online = [], offline = [], total = 0, devs = asset.devices || {};
  for (var id in devs) {
    var d = devs[id], room = resolveDeviceRoomName(d), dlt = null;
    var dks = d.dataKeys || []; for (var i = 0; i < dks.length; i++) { var dk = dks[i]; if (!dk || !dk.data || !dk.data.length) continue; var ts = Number(dk.data[dk.data.length - 1].ts); if (isFinite(ts)) dlt = dlt === null ? ts : Math.max(dlt, ts); }
    total++; if (dlt !== null && now - dlt <= OFFLINE_LIMIT_MS) online.push({ room: room, lastTs: dlt }); else offline.push({ room: room, lastTs: dlt });
  }
  var dot = c.querySelector(".sensor-status-dot"), txt = c.querySelector(".sensor-status-text");
  if (!dot || !txt) return;
  var fp = total + "|" + offline.length + "|" + online.length;
  renderIfChanged("c13", fp, function () {
    if (total === 0) { dot.style.background = "#EF4444"; txt.textContent = "No sensors found"; return; }
    if (offline.length === 0) { dot.style.background = "#5BAD7A"; var lt = null; online.forEach(function (d) { if (d.lastTs !== null) lt = lt === null ? d.lastTs : Math.max(lt, d.lastTs); }); txt.textContent = "All sensors online \u00B7 " + formatTime12h(lt, tz); }
    else if (offline.length === total) { dot.style.background = "#EF4444"; var lt2 = null; offline.forEach(function (d) { if (d.lastTs !== null) lt2 = lt2 === null ? d.lastTs : Math.max(lt2, d.lastTs); }); txt.textContent = "All sensors offline \u00B7 last seen " + formatTime12h(lt2, tz); }
    else {
      dot.style.background = "#E8B86D"; var rms = [], lt3 = null;
      offline.forEach(function (d) { var rm = d.room || "Unknown"; if (rms.indexOf(rm) === -1) rms.push(rm); if (d.lastTs !== null) lt3 = lt3 === null ? d.lastTs : Math.max(lt3, d.lastTs); });
      txt.textContent = (rms.length === 1 ? rms[0] + " sensor offline" : rms.join(" + ") + " offline") + " \u00B7 " + formatTime12h(lt3, tz);
    }
  });
}

function renderCard7(hub, container) {
  var c7 = $$(container, "#card-7"); if (!c7) return; clearSkeletons(c7);
  var tz = getAssetTimezone(hub);
  var eTs = getLatestTelemetryTs(hub) || Date.now(); eTs = Math.floor(eTs / 60000) * 60000; var sTs = eTs - 86400000;
  var bk = computeHourlyBreakdown(hub, sTs, eTs);
  var fp = bk.map(function (h) { return h.away + "," + h.rest + "," + h.move + "," + h.walk + "," + h.multi; }).join("|");
  renderIfChanged("c7", fp, function () {
    var sc = c7.querySelector(".hourly-stack");
    if (sc) { sc.innerHTML = ""; for (var bi = 0; bi < bk.length; bi++) { var hr = bk[bi], tot = hr.away + hr.rest + hr.move + hr.walk + hr.multi || 60; var bar = document.createElement("div"); bar.className = "hour-bar"; [{v:hr.walk,c:"seg-walk"},{v:hr.move,c:"seg-move"},{v:hr.rest,c:"seg-rest"},{v:hr.multi,c:"seg-multi"},{v:hr.away,c:"seg-away"}].forEach(function(s){if(s.v<=0)return;var sg=document.createElement("div");sg.className="hour-seg "+s.c;sg.style.height=((s.v/tot)*100)+"%";bar.appendChild(sg);}); sc.appendChild(bar); } }
    var ax = c7.querySelector(".hourly-stack-axis");
    if (ax) { ax.innerHTML = ""; for (var ai = 0; ai < 24; ai++) { var lb = document.createElement("span"); lb.className = "hour-axis-label"; var hh = getHourInTz(sTs + ai * 3600000, tz); lb.textContent = (hh < 10 ? "0" : "") + hh; ax.appendChild(lb); } }
    var sl = c7.querySelector(".hourly-stack-legend");
    if (sl) { sl.innerHTML = ""; [{c:"seg-walk",l:"Walking"},{c:"seg-move",l:"Moving"},{c:"seg-rest",l:"Resting"},{c:"seg-multi",l:"Multiple Detections"},{c:"seg-away",l:"Away"}].forEach(function(li){var lr=document.createElement("div");lr.className="hourly-legend-item";lr.innerHTML='<span class="hourly-legend-dot '+li.c+'"></span><span>'+li.l+'</span>';sl.appendChild(lr);}); }
    var dg = c7.querySelector(".daily-dist-grid");
    if (dg) { dg.innerHTML = ""; var da=0,dr=0,dm=0,dw=0; for(var di=0;di<bk.length;di++){da+=bk[di].away+bk[di].multi;dr+=bk[di].rest;dm+=bk[di].move;dw+=bk[di].walk;} [{l:"Away",v:da,cl:"#C9CCD1"},{l:"Resting",v:dr,cl:"#7FBAC8"},{l:"Moving",v:dm,cl:"#E8B86D"},{l:"Walking",v:dw,cl:"#5BAD7A"}].forEach(function(dd){var item=document.createElement("div");item.className="daily-dist-item";item.innerHTML='<div class="daily-dist-left"><span class="daily-dist-dot" style="background:'+dd.cl+'"></span><span>'+dd.l+'</span></div><span class="daily-dist-val">'+fmtHM(dd.v)+'</span>';dg.appendChild(item);}); }
    var pg = c7.querySelector(".snapshot-pills-grid");
    if (pg) { pg.innerHTML = ""; var ah=0,wm=0; for(var pi=0;pi<bk.length;pi++){var b=bk[pi];if(b.rest>0||b.move>0||b.walk>0||b.multi>0)ah++;wm+=b.walk;} var vs={},rc=0,pk=""; var pbl=build24hTimelineBlocks(hub,sTs,eTs); for(var pbi=0;pbi<pbl.length;pbi++){var pbk=pbl[pbi].key;if(pbk==="none"){pk="";continue;}if(pbk==="multi"){if(pk!=="multi")rc++;pk="multi";continue;}vs[pbk.replace("room:","")]=true;if(pbk!==pk&&pk!=="")rc++;pk=pbk;} [{v:ah+"h",l:"Active hours today"},{v:fmtHM(wm),l:"Time spent walking"},{v:String(Object.keys(vs).length),l:"Rooms visited today"},{v:String(rc),l:"Room changes today"}].forEach(function(p){var pill=document.createElement("div");pill.className="snapshot-pill";pill.innerHTML='<div class="snapshot-pill-value">'+p.v+'</div><div class="snapshot-pill-label">'+p.l+'</div>';pg.appendChild(pill);}); }
  });
}

function renderCard8(hub, container) {
  var c8 = $$(container, "#card-8"); if (!c8) return; clearSkeletons(c8);
  var tz = getAssetTimezone(hub);
  var eTs = getLatestTelemetryTs(hub) || Date.now(); eTs = Math.floor(eTs / 60000) * 60000; var sTs = eTs - 86400000;
  var data = computeRoomTierSeries(hub, sTs, eTs), ms = data.minutes;
  var cv = c8.querySelector(".room-ribbon-canvas"); if (!cv) return;
  var W = cv.clientWidth || 400, H = 140; cv.width = W; cv.height = H;
  var ctx = cv.getContext("2d"); ctx.clearRect(0, 0, W, H);
  var pad = { top: 14, bottom: 26, left: 8, right: 28 }, gW = W - pad.left - pad.right, gH = H - pad.top - pad.bottom;
  var tm = ms.length; if (!tm) return; var colW = gW / tm;
  for (var i = 0; i < tm; i++) { var x = pad.left + i * colW; var rk = Object.keys(ms[i].rooms).sort(); var col; if (!rk.length) col = ROOM_COLORS["none"]; else if (rk.length > 1) col = ROOM_COLORS["multi"]; else col = ROOM_COLORS[rk[0].toLowerCase()] || "#ccc"; ctx.fillStyle = col; ctx.fillRect(x, pad.top, Math.ceil(colW) + 1, gH); }
  if (currentAssetHasTier) {
    var maxT = 3; ctx.beginPath(); var started = false;
    for (var j = 0; j < tm; j++) { var tier = ms[j].tier; if (tier < 0) { started = false; continue; } var lx = pad.left + (j + 0.5) * colW, ly = pad.top + gH - (tier / maxT) * gH; if (!started) { ctx.moveTo(lx, ly); started = true; } else ctx.lineTo(lx, ly); }
    ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
    ctx.beginPath(); started = false;
    for (var k = 0; k < tm; k++) { var t2 = ms[k].tier; if (t2 < 0) { started = false; continue; } var lx2 = pad.left + (k + 0.5) * colW, ly2 = pad.top + gH - (t2 / maxT) * gH; if (!started) { ctx.moveTo(lx2, ly2); started = true; } else ctx.lineTo(lx2, ly2); }
    ctx.strokeStyle = "rgba(60,60,58,0.55)"; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.font = "9px system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillStyle = "#8c8a84";
    for (var tl = 0; tl <= maxT; tl++) ctx.fillText("T" + tl, W - 2, pad.top + gH - (tl / maxT) * gH);
  }
  var ax = c8.querySelector(".room-ribbon-axis");
  if (ax) { ax.innerHTML = ""; [0,6,12,18,24].forEach(function (m) { var spn = document.createElement("span"); spn.textContent = formatTimeShort(sTs + m * 3600000, tz); ax.appendChild(spn); }); }
  var lg = c8.querySelector(".room-ribbon-legend");
  if (lg) { lg.innerHTML = ""; var tots = {}; for (var ri = 0; ri < tm; ri++) { var rks = Object.keys(ms[ri].rooms).sort(); var key = !rks.length ? "none" : rks.length > 1 ? "multi" : rks[0]; tots[key] = (tots[key] || 0) + 1; } Object.keys(tots).sort(function (a, b) { return tots[b] - tots[a]; }).forEach(function (rk2) { var ck = rk2.toLowerCase(); var nm = rk2 === "none" ? "No detection" : rk2 === "multi" ? "Multiple Detections" : rk2; var r = document.createElement("div"); r.className = "rr-row"; r.innerHTML = '<div class="rr-left"><span class="rr-dot" style="background:' + (ROOM_COLORS[ck] || "#ccc") + '"></span><span>' + nm + '</span></div><div class="rr-dur">' + fmtHM(tots[rk2]) + '</div>'; lg.appendChild(r); }); }
  var dg = c8.querySelector(".room-dist-grid");
  if (dg) { dg.innerHTML = ""; var roomMins = {}; for (var di = 0; di < tm; di++) { var drk = Object.keys(ms[di].rooms); for (var dr = 0; dr < drk.length; dr++) roomMins[drk[dr]] = (roomMins[drk[dr]] || 0) + 1; } Object.keys(roomMins).sort(function (a, b) { return roomMins[b] - roomMins[a]; }).forEach(function (srm) { var scl = ROOM_COLORS[srm.toLowerCase()] || "#ccc"; var item = document.createElement("div"); item.className = "room-dist-item"; item.innerHTML = '<div class="room-dist-left"><span class="room-dist-dot" style="background:' + scl + '"></span><span>' + srm + '</span></div><span class="room-dist-val">' + fmtHM(roomMins[srm]) + '</span>'; dg.appendChild(item); }); }
}

function renderCard10(hub, container) {
  var c10 = $$(container, "#card-10"); if (!c10) return; clearSkeletons(c10);
  var tz = getAssetTimezone(hub), ow = overnightWindowInTz(tz);
  var bk = computeNightHourlyBreakdown(hub, ow.startTs, ow.endTs);
  var tOut = 0, tRest = 0, tActive = 0, tMulti = 0;
  for (var i = 0; i < bk.length; i++) { tOut += bk[i].out; tRest += bk[i].rest; tActive += bk[i].active; tMulti += bk[i].multi; }
  var fp = tRest + "|" + tActive + "|" + tMulti;
  renderIfChanged("c10", fp, function () {
    var slices = [{ l: "In bed \u2014 Resting", v: tRest, cl: "#7FBAC8" }, { l: "In bed \u2014 Active", v: tActive, cl: "#5BAD7A" }, { l: "Multiple Detections", v: tMulti, cl: "#DBA5B0" }];
    var total = tRest + tActive + tMulti || 1;
    var cv = c10.querySelector(".inbed-donut-canvas"); if (!cv) return;
    var sz = 160; cv.width = sz; cv.height = sz; var ctx = cv.getContext("2d"); ctx.clearRect(0, 0, sz, sz);
    var cx = sz / 2, cy = sz / 2, outerR = 72, innerR = 44, startA = -Math.PI / 2;
    for (var si = 0; si < slices.length; si++) { if (slices[si].v <= 0) continue; var sweep = (slices[si].v / total) * Math.PI * 2; var endA = startA + sweep; ctx.beginPath(); ctx.arc(cx, cy, outerR, startA, endA); ctx.arc(cx, cy, innerR, endA, startA, true); ctx.closePath(); ctx.fillStyle = slices[si].cl; ctx.fill(); startA = endA; }
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.font = "600 18px system-ui"; ctx.fillStyle = "#3d3c3a"; ctx.fillText(fmtHM(total), cx, cy - 6); ctx.font = "11px system-ui"; ctx.fillStyle = "#8c8a84"; ctx.fillText("in bed", cx, cy + 12);
    var tDiv = c10.querySelector(".inbed-donut-totals");
    if (tDiv) { tDiv.innerHTML = ""; for (var ti = 0; ti < slices.length; ti++) { if (slices[ti].v <= 0) continue; var pct = Math.round((slices[ti].v / total) * 100); var row = document.createElement("div"); row.className = "inbed-total-row"; row.innerHTML = '<div class="inbed-total-left"><span class="inbed-total-dot" style="background:' + slices[ti].cl + '"></span><span>' + slices[ti].l + '</span></div><span class="inbed-total-val">' + fmtHM(slices[ti].v) + ' (' + pct + '%)</span>'; tDiv.appendChild(row); } }
  });
}

function renderCard11n(hub, container) {
  var c = $$(container, "#card-11n"); if (!c) return; clearSkeletons(c);
  var tz = getAssetTimezone(hub), ow = overnightWindowInTz(tz);
  var ev = computeNightEvents(hub, ow.startTs, ow.endTs);
  var fp = ev.movementInBed + "|" + ev.bathroomVisits + "|" + ev.timesOutOfBed + "|" + ev.timeOutOfBedMs;
  renderIfChanged("c11n", fp, function () {
    var grid = c.querySelector(".night-events-grid"); if (!grid) return; grid.innerHTML = "";
    [{v:String(ev.movementInBed),l:"Movement while in bed"},{v:String(ev.bathroomVisits),l:"Bathroom visits overnight"},{v:String(ev.timesOutOfBed),l:"Times out of bed"},{v:fmtHM(ev.timeOutOfBedMs/60000),l:"Time out of bed"}].forEach(function(p){var pill=document.createElement("div");pill.className="night-event-pill";pill.innerHTML='<div class="night-event-value">'+p.v+'</div><div class="night-event-label">'+p.l+'</div>';grid.appendChild(pill);});
  });
}

function renderCard12(hub, container) {
  var c12 = $$(container, "#card-12"); if (!c12) return; clearSkeletons(c12);
  var tz = getAssetTimezone(hub), ow = overnightWindowInTz(tz);
  var data = computeOvernightRoomTierSeries(hub, ow.startTs, ow.endTs), ms = data.minutes;
  var cv = c12.querySelector(".overnight-ribbon-canvas"); if (!cv) return;
  var W = cv.clientWidth || 400, H = 140; cv.width = W; cv.height = H;
  var ctx = cv.getContext("2d"); ctx.clearRect(0, 0, W, H);
  var pad = { top: 14, bottom: 26, left: 8, right: 28 }, gW = W - pad.left - pad.right, gH = H - pad.top - pad.bottom;
  var tm = ms.length; if (!tm) return; var colW = gW / tm;
  for (var i = 0; i < tm; i++) { var x = pad.left + i * colW; ctx.fillStyle = OVERNIGHT_ROOM_COLORS[ms[i].zone] || OVERNIGHT_ROOM_COLORS["none"]; ctx.fillRect(x, pad.top, Math.ceil(colW) + 1, gH); }
  var maxT = 3; ctx.beginPath(); var started = false;
  for (var j = 0; j < tm; j++) { var tier = ms[j].tier; if (tier < 0) { started = false; continue; } var lx = pad.left + (j + 0.5) * colW, ly = pad.top + gH - (tier / maxT) * gH; if (!started) { ctx.moveTo(lx, ly); started = true; } else ctx.lineTo(lx, ly); }
  ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 2.5; ctx.lineJoin = "round"; ctx.lineCap = "round"; ctx.stroke();
  ctx.beginPath(); started = false;
  for (var k = 0; k < tm; k++) { var t2 = ms[k].tier; if (t2 < 0) { started = false; continue; } var lx2 = pad.left + (k + 0.5) * colW, ly2 = pad.top + gH - (t2 / maxT) * gH; if (!started) { ctx.moveTo(lx2, ly2); started = true; } else ctx.lineTo(lx2, ly2); }
  ctx.strokeStyle = "rgba(60,60,58,0.55)"; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.font = "9px system-ui"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillStyle = "#8c8a84";
  for (var tl = 0; tl <= maxT; tl++) ctx.fillText("T" + tl, W - 2, pad.top + gH - (tl / maxT) * gH);
  var ax = c12.querySelector(".overnight-ribbon-axis");
  if (ax) { ax.innerHTML = ""; [0,3,6,9,12].forEach(function (m) { var spn = document.createElement("span"); spn.textContent = formatTimeShort(ow.startTs + m * 3600000, tz); ax.appendChild(spn); }); }
  var lg = c12.querySelector(".overnight-ribbon-legend"), zoneLabels = { bed: "Bed", bedroom: "Bedroom", bathroom: "Bathroom", other: "Other room", none: "No detection", multi: "Multiple people" };
  if (lg) { lg.innerHTML = ""; var tots = {}; for (var ri = 0; ri < tm; ri++) tots[ms[ri].zone] = (tots[ms[ri].zone] || 0) + 1; Object.keys(tots).sort(function (a, b) { return tots[b] - tots[a]; }).forEach(function (zk) { var r = document.createElement("div"); r.className = "or-row"; r.innerHTML = '<div class="or-left"><span class="or-dot" style="background:' + (OVERNIGHT_ROOM_COLORS[zk] || OVERNIGHT_ROOM_COLORS["none"]) + '"></span><span>' + (zoneLabels[zk] || zk) + '</span></div><div class="or-dur">' + fmtHM(tots[zk]) + '</div>'; lg.appendChild(r); }); }
}

function renderCard9(hub, container) {
  var c9 = $$(container, "#card-9"); if (!c9) return; clearSkeletons(c9);
  var tz = getAssetTimezone(hub), ow = overnightWindowInTz(tz);
  var bk = computeNightHourlyBreakdown(hub, ow.startTs, ow.endTs);
  var fp = bk.map(function (h) { return h.out + "," + h.rest + "," + h.active + "," + h.multi; }).join("|");
  renderIfChanged("c9", fp, function () {
    var sc = c9.querySelector(".night-hourly-stack");
    if (sc) { sc.innerHTML = ""; for (var bi = 0; bi < bk.length; bi++) { var hr = bk[bi], tot = hr.out + hr.rest + hr.active + hr.multi || 60; var bar = document.createElement("div"); bar.className = "night-hour-bar"; [{v:hr.active,c:"nseg-active"},{v:hr.rest,c:"nseg-rest"},{v:hr.multi,c:"nseg-multi"},{v:hr.out,c:"nseg-out"}].forEach(function(s){if(s.v<=0)return;var sg=document.createElement("div");sg.className="night-hour-seg "+s.c;sg.style.height=((s.v/tot)*100)+"%";bar.appendChild(sg);}); sc.appendChild(bar); } }
    var ax = c9.querySelector(".night-hourly-axis");
    if (ax) { ax.innerHTML = ""; [21,22,23,0,1,2,3,4,5,6,7,8].forEach(function (hh) { var lb = document.createElement("span"); lb.className = "night-hour-axis-label"; lb.textContent = (hh < 10 ? "0" : "") + hh; ax.appendChild(lb); }); }
    var sl = c9.querySelector(".night-hourly-legend");
    if (sl) { sl.innerHTML = ""; [{c:"nseg-active",l:"In bed \u2014 Active"},{c:"nseg-rest",l:"In bed \u2014 Resting"},{c:"nseg-multi",l:"Multiple Detections"},{c:"nseg-out",l:"Out of bed"}].forEach(function(li){var lr=document.createElement("div");lr.className="night-legend-item";lr.innerHTML='<span class="night-legend-dot '+li.c+'"></span><span>'+li.l+'</span>';sl.appendChild(lr);}); }
    var dg = c9.querySelector(".night-dist-grid");
    if (dg) { dg.innerHTML = ""; var tO=0,tR=0,tA=0,tM=0; for(var di=0;di<bk.length;di++){tO+=bk[di].out;tR+=bk[di].rest;tA+=bk[di].active;tM+=bk[di].multi;} [{l:"Out of bed",v:tO,cl:"#A68B7B"},{l:"In bed \u2014 Resting",v:tR,cl:"#7FBAC8"},{l:"In bed \u2014 Active",v:tA,cl:"#5BAD7A"},{l:"Multiple Detections",v:tM,cl:"#DBA5B0"}].forEach(function(dd){if(dd.v<=0)return;var item=document.createElement("div");item.className="night-dist-item";item.innerHTML='<div class="night-dist-left"><span class="night-dist-dot" style="background:'+dd.cl+'"></span><span>'+dd.l+'</span></div><span class="night-dist-val">'+fmtHM(dd.v)+'</span>';dg.appendChild(item);}); }
  });
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
  movementTiersByDevice = {}; currentAssetHasTier = false;
  invalidateCompCache(); clearRenderSnapshot();
}

/***********************
 * THINGSBOARD LIFECYCLE
 ***********************/
self.onInit = function () {
  var container = self.ctx.$container[0];
  clearDomCache();
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

  if (prevBtn) prevBtn.onclick = function () { if (self._hub) switchAsset(-1, self._hub, container); };
  if (nextBtn) nextBtn.onclick = function () { if (self._hub) switchAsset(1, self._hub, container); };

  if (self._carouselController) self._carouselController.showLoader();

  self._revealFallback = setTimeout(function () {
    if (self._carouselController && !self._carouselController.hasRevealed()) self._carouselController.revealCards();
  }, 8000);

  self.onHubDataChanged(function (hub) {
    clearTimeout(self._revealFallback);
    if (hub !== currentHubRef) { currentHubRef = hub; resetCardState(); clearDomCache(); }
    var isRefreshing = !!(hub.hubMeta && hub.hubMeta.refreshing);
    if (self._carouselController) self._carouselController.setProgress(1);
    updateAssetList(hub);
    updateAssetHeaderName(hub, container);
    currentAssetHasTier = assetHasEDTier(hub);
    applyTierVisibility(container, currentAssetHasTier);
    evaluateState(hub); evaluateCurrentLocation(hub); evaluateLocations(hub);
    scheduleRender(hub, container);
    if (!isRefreshing && self._carouselController && !self._carouselController.hasRevealed()) self._carouselController.revealCards();
  });

  self._hubListener = createHubListener({
    onStart: function () { if (self._carouselController) { self._carouselController.showLoader(); self._carouselController.setProgress(1); } },
    onEnd: function () { if (self._carouselController) self._carouselController.hideLoader(); },
    onChanged: function (hub, src) {
      self._hub = hub;
      for (var i = 0; i < self._hubChangedCallbacks.length; i++) try { self._hubChangedCallbacks[i](hub, src); } catch (e) {}
      if (!(hub.hubMeta && hub.hubMeta.refreshing) && self._carouselController) self._carouselController.hideLoader();
    }
  });

  self._minuteTimer = setInterval(function () {
    if (self._hub) renderCard1(self._hub, container);
  }, 60000);

  self._stateTimer = setInterval(function () {
    if (self._hub) {
      invalidateCompCache();
      evaluateState(self._hub); evaluateCurrentLocation(self._hub); evaluateLocations(self._hub);
      scheduleRender(self._hub, container);
    }
  }, STATE_TICK_MS);
};

self.onDataUpdated = function () {};

self.onDestroy = function () {
  if (self._hubListener) { self._hubListener.destroy(); self._hubListener = null; }
  if (self._minuteTimer) clearInterval(self._minuteTimer);
  if (self._stateTimer) clearInterval(self._stateTimer);
  if (self._revealFallback) clearTimeout(self._revealFallback);
  if (_rafId) { cancelAnimationFrame(_rafId); _rafId = null; }
  self._hubChangedCallbacks = null; self.onHubDataChanged = null; self._hub = null; currentHubRef = null;
  invalidateCompCache(); clearRenderSnapshot(); clearDomCache();
  if (activeTimelineTooltip && activeTimelineTooltip.parentNode) { activeTimelineTooltip.parentNode.removeChild(activeTimelineTooltip); activeTimelineTooltip = null; }
  if (self._carouselController) { self._carouselController.destroy(); self._carouselController = null; }
};