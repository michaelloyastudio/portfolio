/* ── hardnbaflicks Phone Embed ──
 * Injects the skeuomorphic iPhone/Instagram UI inline.
 * All CSS is scoped under .hnf-phone-embed to avoid conflicts.
 * All IDs are prefixed with hnf- to avoid collisions.
 * Call initHardnbaflicksPhone() after the #hnf-phone-embed div exists in the DOM.
 */
function initHardnbaflicksPhone() {
  var root = document.getElementById('hnf-phone-embed');
  if (!root || root._hnfInit) return;
  root._hnfInit = true;

  var IMG = 'projects/hardnbaflicks/';

  // ── Helper: query inside container ──
  function $(id) { return root.querySelector('#hnf-' + id); }

  // ── Inject scoped CSS (once) ──
  if (!document.getElementById('hnf-phone-css')) {
    var s = document.createElement('style');
    s.id = 'hnf-phone-css';
    s.textContent = [
'.hnf-phone-embed{display:flex;justify-content:center;align-items:flex-start;padding-top:1rem;font-family:"Space Grotesk",sans-serif;color:#fff;line-height:normal;font-size:16px;font-weight:400;width:420px;height:820px;margin:0 auto}',
'.hnf-phone-embed *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;scrollbar-width:none;-ms-overflow-style:none}',
'.hnf-phone-embed ::-webkit-scrollbar{display:none}',
'.hnf-phone-embed .lp-iphone{cursor:url("assets/cursors/cursor-dark.svg") 16 8,default}',
'.hnf-phone-embed .lp-iphone *{cursor:inherit}',
'.hnf-phone-embed button,.hnf-phone-embed .lp-btn,.hnf-phone-embed .lp-content-tab,.hnf-phone-embed .lp-tab{cursor:url("assets/cursors/cursor-dark.svg") 16 8,default!important}',
'.hnf-phone-embed .lp-grid-item,.hnf-phone-embed .lp-profile-pic-wrap,.hnf-phone-embed .lp-carousel-arrow,.hnf-phone-embed .lp-post-detail-header .lp-back,.hnf-phone-embed .lp-post-detail-header .lp-dots,.hnf-phone-embed .lp-s-close,.hnf-phone-embed .lp-stories-tap-left,.hnf-phone-embed .lp-stories-tap-right,.hnf-phone-embed .lp-stories-mute,.hnf-phone-embed .lp-profile-bio .lp-link a,.hnf-phone-embed .lp-btn-follow{cursor:url("assets/cursors/crosshair-dark.svg") 8 10,pointer!important}',
'.hnf-phone-embed .lp-profile-pic-wrap,.hnf-phone-embed .lp-grid-item,.hnf-phone-embed .lp-post-detail-header .lp-back,.hnf-phone-embed .lp-s-close,.hnf-phone-embed .lp-stories-mute,.hnf-phone-embed .lp-btn-follow{transition:transform .15s ease}',
'.hnf-phone-embed .lp-profile-pic-wrap:hover,.hnf-phone-embed .lp-grid-item:hover,.hnf-phone-embed .lp-post-detail-header .lp-back:hover,.hnf-phone-embed .lp-s-close:hover,.hnf-phone-embed .lp-stories-mute:hover,.hnf-phone-embed .lp-btn-follow:hover{transform:scale(1.06)}',
'.hnf-phone-embed .lp-profile-pic-wrap:active,.hnf-phone-embed .lp-grid-item:active,.hnf-phone-embed .lp-post-detail-header .lp-back:active,.hnf-phone-embed .lp-s-close:active,.hnf-phone-embed .lp-stories-mute:active,.hnf-phone-embed .lp-btn-follow:active{transform:scale(0.96)}',
'.hnf-phone-embed .lp-iphone{position:relative;width:375px;height:770px;background:#2c2c2e;border-radius:50px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),inset 0 2px 4px rgba(255,255,255,.05),0 0 0 1px rgba(0,0,0,.6),0 20px 60px rgba(0,0,0,.5);flex-shrink:0}',
'.hnf-phone-embed .lp-iphone::before{content:"";position:absolute;inset:0;border-radius:50px;background:linear-gradient(135deg,rgba(255,255,255,.06) 0%,transparent 50%,rgba(0,0,0,.1) 100%);pointer-events:none;z-index:1}',
'.hnf-phone-embed .lp-btn-silent{position:absolute;left:-3px;top:130px;width:3px;height:28px;background:linear-gradient(90deg,#1a1a1c,#3a3a3c);border-radius:2px 0 0 2px;box-shadow:-1px 0 2px rgba(0,0,0,.4)}',
'.hnf-phone-embed .lp-btn-vol-up{position:absolute;left:-3px;top:175px;width:3px;height:48px;background:linear-gradient(90deg,#1a1a1c,#3a3a3c);border-radius:2px 0 0 2px;box-shadow:-1px 0 2px rgba(0,0,0,.4)}',
'.hnf-phone-embed .lp-btn-vol-down{position:absolute;left:-3px;top:232px;width:3px;height:48px;background:linear-gradient(90deg,#1a1a1c,#3a3a3c);border-radius:2px 0 0 2px;box-shadow:-1px 0 2px rgba(0,0,0,.4)}',
'.hnf-phone-embed .lp-btn-power{position:absolute;right:-3px;top:190px;width:3px;height:68px;background:linear-gradient(270deg,#1a1a1c,#3a3a3c);border-radius:0 2px 2px 0;box-shadow:1px 0 2px rgba(0,0,0,.4)}',
'.hnf-phone-embed .lp-screen{position:absolute;top:14px;left:14px;right:14px;bottom:14px;border-radius:40px;background:#000;overflow:hidden;z-index:2}',
'.hnf-phone-embed .lp-dynamic-island{position:absolute;top:10px;left:50%;transform:translateX(-50%);width:120px;height:34px;background:#000;border-radius:20px;z-index:60;border:1px solid rgba(255,255,255,.04)}',
'.hnf-phone-embed .lp-home-indicator{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:134px;height:5px;background:rgba(255,255,255,.25);border-radius:3px;z-index:50}',
'.hnf-phone-embed .lp-status-bar{display:flex;justify-content:space-between;align-items:center;padding:14px 28px 0;height:50px;position:absolute;top:0;left:0;right:0;z-index:60;pointer-events:none}',
'.hnf-phone-embed .lp-status-bar .lp-time{font-size:15px;font-weight:600;letter-spacing:-.2px}',
'.hnf-phone-embed .lp-status-bar .lp-icons{display:flex;align-items:center;gap:5px}',
'.hnf-phone-embed .lp-status-bar .lp-icons svg{width:16px;height:16px;fill:#fff}',
'.hnf-phone-embed .lp-app{position:absolute;top:0;left:0;right:0;bottom:0;display:flex;flex-direction:column}',
'.hnf-phone-embed .lp-app-body{flex:1;overflow-y:auto;overflow-x:hidden;position:relative;padding-top:50px}',
'.hnf-phone-embed .lp-tab-bar{height:74px;background:#000;border-top:1px solid #262626;display:flex;align-items:flex-start;justify-content:space-around;padding-top:8px;padding-bottom:28px;flex-shrink:0;z-index:30}',
'.hnf-phone-embed .lp-tab-bar .lp-tab{display:flex;align-items:center;justify-content:center;width:40px;height:40px;opacity:.5}',
'.hnf-phone-embed .lp-tab-bar .lp-tab.active{opacity:1}',
'.hnf-phone-embed .lp-tab-bar .lp-tab svg{width:24px;height:24px;fill:#fff}',
'.hnf-phone-embed .lp-view{display:none;flex-direction:column;min-height:100%}',
'.hnf-phone-embed .lp-view.active{display:flex}',
'.hnf-phone-embed .lp-profile-header{padding:10px 16px 0}',
'.hnf-phone-embed .lp-profile-username-row{display:flex;align-items:center;gap:6px;padding:4px 0 12px}',
'.hnf-phone-embed .lp-profile-username-row .lp-username{font-size:22px;font-weight:700;letter-spacing:-.3px;color:#fff!important;text-decoration:none!important}',
'.hnf-phone-embed .lp-profile-username-row .lp-verified{width:18px;height:18px;flex-shrink:0}',
'.hnf-phone-embed .lp-profile-top{display:flex;align-items:center;padding:0 16px 12px;gap:20px}',
'.hnf-phone-embed .lp-profile-pic-wrap{position:relative;width:80px;height:80px;flex-shrink:0}',
'.hnf-phone-embed .lp-story-ring{position:absolute;inset:-3px;border-radius:50%;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);padding:3px}',
'.hnf-phone-embed .lp-story-ring-inner{width:100%;height:100%;border-radius:50%;background:#000;padding:2px}',
'.hnf-phone-embed .lp-profile-pic{width:100%;height:100%;border-radius:50%!important;background:#262626;display:flex;align-items:center;justify-content:center;overflow:hidden;background-size:cover;background-position:center}',
'.hnf-phone-embed .lp-profile-stats{display:flex;gap:16px;flex:1;justify-content:center}',
'.hnf-phone-embed .lp-profile-stat{text-align:center}',
'.hnf-phone-embed .lp-profile-stat .lp-num{font-size:17px;font-weight:700}',
'.hnf-phone-embed .lp-profile-stat .lp-label{font-size:12px;color:#aaa;margin-top:1px}',
'.hnf-phone-embed .lp-profile-bio{padding:0 16px 12px}',
'.hnf-phone-embed .lp-profile-bio .lp-name{font-weight:700;font-size:13px;margin-bottom:2px}',
'.hnf-phone-embed .lp-profile-bio .lp-text{font-size:13px;line-height:1.4;color:#eee}',
'.hnf-phone-embed .lp-profile-bio .lp-link{font-size:13px;margin-top:1px}',
'.hnf-phone-embed .lp-profile-bio .lp-link a{color:#E0F1FF!important;text-decoration:none!important}',
'.hnf-phone-embed .lp-profile-actions{display:flex;gap:6px;padding:0 16px 14px}',
'.hnf-phone-embed .lp-profile-actions .lp-btn{flex:1;height:34px;border-radius:8px;border:none;font-size:13px;font-weight:600;font-family:inherit;display:flex;align-items:center;justify-content:center;color:#fff!important;text-decoration:none!important}',
'.hnf-phone-embed .lp-profile-actions .lp-btn-follow{background:#3897f0!important}',
'.hnf-phone-embed .lp-profile-actions .lp-btn-message{background:#262626;color:#fff!important}',
'.hnf-phone-embed .lp-content-tabs{display:flex;border-bottom:1px solid #262626}',
'.hnf-phone-embed .lp-content-tab{flex:1;height:44px;display:flex;align-items:center;justify-content:center;opacity:.4;position:relative}',
'.hnf-phone-embed .lp-content-tab.active{opacity:1}',
'.hnf-phone-embed .lp-content-tab.active::after{content:"";position:absolute;bottom:0;left:0;right:0;height:1px;background:#fff}',
'.hnf-phone-embed .lp-content-tab svg{width:24px;height:24px;fill:#fff}',
'.hnf-phone-embed .lp-post-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;padding:2px}',
'.hnf-phone-embed .lp-grid-item{aspect-ratio:1;overflow:hidden;background:#111}',
'.hnf-phone-embed .lp-grid-item img{width:100%;height:100%;object-fit:cover;border-radius:0!important;box-shadow:none!important;transform:none!important;max-width:none!important}',
'.hnf-phone-embed .lp-post-detail{position:absolute;top:0;left:0;right:0;bottom:0;background:#000;z-index:20;transform:scale(.9);opacity:0;transition:transform .3s cubic-bezier(.4,0,.2,1),opacity .3s ease;overflow-y:auto;pointer-events:none}',
'.hnf-phone-embed .lp-post-detail.open{transform:scale(1);opacity:1;pointer-events:auto}',
'.hnf-phone-embed .lp-post-detail-header{display:flex;align-items:center;height:50px;padding:0 12px;gap:10px;position:sticky;top:0;background:#000;z-index:5;margin-top:50px}',
'.hnf-phone-embed .lp-post-detail-header .lp-back{width:28px;height:28px;display:flex;align-items:center;justify-content:center}',
'.hnf-phone-embed .lp-post-detail-header .lp-back svg{width:22px;height:22px;fill:#fff}',
'.hnf-phone-embed .lp-post-detail-header .lp-avatar{width:30px;height:30px;border-radius:50%;overflow:hidden;flex-shrink:0}',
'.hnf-phone-embed .lp-post-detail-header .lp-avatar{background-size:cover;background-position:center}',
'.hnf-phone-embed .lp-post-detail-header .lp-uname{font-size:13px;font-weight:600;flex:1}',
'.hnf-phone-embed .lp-post-detail-header .lp-dots{font-size:18px;letter-spacing:2px}',
'.hnf-phone-embed .lp-carousel-wrap{position:relative;width:100%;overflow:hidden;background:#111}',
'.hnf-phone-embed .lp-carousel-track{display:flex;transition:transform .35s cubic-bezier(.4,0,.2,1);will-change:transform}',
'.hnf-phone-embed .lp-carousel-slide{flex:0 0 100%;aspect-ratio:4/5}',
'.hnf-phone-embed .lp-carousel-slide img{width:100%;height:100%;object-fit:cover;border-radius:0!important;box-shadow:none!important;transform:none!important;max-width:none!important}',
'.hnf-phone-embed .lp-carousel-arrow{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,.6);border:none;color:#fff;font-size:14px;display:flex;align-items:center;justify-content:center;z-index:3;backdrop-filter:blur(4px)}',
'.hnf-phone-embed .lp-carousel-arrow.left{left:8px}',
'.hnf-phone-embed .lp-carousel-arrow.right{right:8px}',
'.hnf-phone-embed .lp-carousel-arrow:disabled{opacity:0;pointer-events:none}',
'.hnf-phone-embed .lp-carousel-dots{display:flex;justify-content:center;gap:4px;padding:10px 0}',
'.hnf-phone-embed .lp-carousel-dots .lp-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.25)}',
'.hnf-phone-embed .lp-carousel-dots .lp-dot.active{background:#3897f0}',
'.hnf-phone-embed .lp-post-actions{display:flex;align-items:center;padding:10px 14px 6px;gap:14px}',
'.hnf-phone-embed .lp-post-actions svg{width:24px;height:24px;fill:none;stroke:#fff;stroke-width:2}',
'.hnf-phone-embed .lp-post-actions .lp-spacer{flex:1}',
'.hnf-phone-embed .lp-post-actions .lp-bookmark svg{stroke:#fff}',
'.hnf-phone-embed .lp-post-likes{padding:0 14px;font-size:13px;font-weight:600}',
'.hnf-phone-embed .lp-post-caption{padding:6px 14px 14px;font-size:13px;line-height:1.4}',
'.hnf-phone-embed .lp-post-caption .lp-cap-user{font-weight:700}',
'.hnf-phone-embed .lp-feed-view .lp-feed-post{margin-bottom:12px;border-bottom:1px solid #262626;padding-bottom:12px}',
'.hnf-phone-embed .lp-feed-post-header{display:flex;align-items:center;height:52px;padding:0 12px;gap:10px}',
'.hnf-phone-embed .lp-feed-post-header .lp-avatar{width:32px;height:32px;border-radius:50%;overflow:hidden;flex-shrink:0}',
'.hnf-phone-embed .lp-feed-post-header .lp-avatar img{width:100%;height:100%;object-fit:cover;border-radius:0!important}',
'.hnf-phone-embed .lp-feed-post-header .lp-uname{font-size:13px;font-weight:600;flex:1}',
'.hnf-phone-embed .lp-feed-post-header .lp-dots{letter-spacing:2px}',
'.hnf-phone-embed .lp-placeholder-view{display:flex;align-items:center;justify-content:center;flex:1;color:#555;font-size:14px;padding:60px 20px;text-align:center;margin-top:50px}',
'.hnf-phone-embed .lp-stories-overlay{position:absolute;top:0;left:0;right:0;bottom:0;background:#000;z-index:55;transform:scale(.9);opacity:0;transition:transform .3s cubic-bezier(.4,0,.2,1),opacity .3s ease;pointer-events:none;display:flex;flex-direction:column}',
'.hnf-phone-embed .lp-stories-overlay.open{transform:scale(1);opacity:1;pointer-events:auto}',
'.hnf-phone-embed .lp-stories-progress{display:flex;gap:3px;padding:10px 10px 6px;z-index:6;position:relative}',
'.hnf-phone-embed .lp-stories-progress .lp-bar-bg{flex:1;height:2px;background:rgba(255,255,255,.25);border-radius:1px;overflow:hidden}',
'.hnf-phone-embed .lp-stories-progress .lp-bar-fill{height:100%;background:#fff;width:0%;border-radius:1px}',
'.hnf-phone-embed .lp-stories-header{display:flex;align-items:center;gap:10px;padding:4px 12px;z-index:6;position:relative}',
'.hnf-phone-embed .lp-stories-header .lp-s-avatar{width:32px;height:32px;border-radius:50%;overflow:hidden;flex-shrink:0}',

'.hnf-phone-embed .lp-stories-progress{filter:drop-shadow(0 1px 3px rgba(0,0,0,.5))}',
'.hnf-phone-embed .lp-stories-header{filter:drop-shadow(0 1px 3px rgba(0,0,0,.5))}',
'.hnf-phone-embed .lp-stories-header .lp-s-close{filter:drop-shadow(0 1px 3px rgba(0,0,0,.5))}',
'.hnf-phone-embed .lp-stories-header .lp-s-uname{font-size:13px;font-weight:600;flex:1}',
'.hnf-phone-embed .lp-stories-header .lp-s-close{width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff}',
'.hnf-phone-embed .lp-stories-content{position:absolute;top:50px;left:0;right:0;bottom:70px;overflow:hidden;border-radius:0}',
'.hnf-phone-embed .lp-stories-content>img,.hnf-phone-embed .lp-stories-content>video{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;background:#111;z-index:1;border-radius:0!important;box-shadow:none!important;transform:none!important;max-width:none!important}',
'.hnf-phone-embed .lp-stories-tap-left{position:absolute;top:0;left:0;width:40%;height:70%;z-index:3}',
'.hnf-phone-embed .lp-stories-tap-right{position:absolute;top:0;right:0;width:60%;height:70%;z-index:3}',
'.hnf-phone-embed .lp-stories-mute{position:absolute;bottom:12px;right:12px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.5);border:none;display:flex;align-items:center;justify-content:center;z-index:6;backdrop-filter:blur(4px)}',
'.hnf-phone-embed .lp-stories-mute svg{width:18px;height:18px;fill:#fff}',
'.hnf-phone-embed .lp-stories-reply{display:flex;align-items:center;gap:10px;z-index:5}',
'.hnf-phone-embed .lp-stories-reply input{flex:1;height:38px;border-radius:20px;border:1px solid rgba(255,255,255,.3);background:transparent;color:#fff;font-size:13px;font-family:inherit;padding:0 14px;outline:none}',
'.hnf-phone-embed .lp-stories-reply input::placeholder{color:rgba(255,255,255,.5)}',
'.hnf-phone-embed .lp-stories-reply .lp-sr-icon{width:28px;height:28px;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
'.hnf-phone-embed .lp-stories-reply .lp-sr-icon svg{width:24px;height:24px;fill:none;stroke:#fff;stroke-width:2}',
    ].join('\n');
    document.head.appendChild(s);
  }

  // ── Inject HTML structure ──
  root.innerHTML = [
'<div class="lp-iphone">',
'  <div class="lp-btn-silent"></div>',
'  <div class="lp-btn-vol-up"></div>',
'  <div class="lp-btn-vol-down"></div>',
'  <div class="lp-btn-power"></div>',
'  <div class="lp-screen">',
'    <div class="lp-dynamic-island"></div>',
'    <div class="lp-home-indicator"></div>',
'    <div class="lp-app">',
'      <div class="lp-status-bar">',
'        <div class="lp-time" id="hnf-clock"></div>',
'        <div class="lp-icons">',
'          <svg viewBox="0 0 24 24"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>',
'          <svg viewBox="0 0 25 12" width="20" height="10"><rect x="0.5" y="0.5" width="21" height="11" rx="2" ry="2" fill="none" stroke="#fff" stroke-width="1"/><rect x="22" y="3" width="2" height="5" rx="1" fill="#fff"/><rect x="2" y="2" width="18" height="7" rx="1" fill="#fff"/></svg>',
'        </div>',
'      </div>',
'      <div class="lp-app-body" id="hnf-appBody">',
'        <div class="lp-view active" id="hnf-viewProfile">',
'          <div class="lp-profile-header">',
'            <div class="lp-profile-username-row">',
'              <span class="lp-username">hardnbaflicks</span>',
'            </div>',
'          </div>',
'          <div class="lp-profile-top">',
'            <div class="lp-profile-pic-wrap" id="hnf-profilePicBtn">',
'              <div class="lp-story-ring"><div class="lp-story-ring-inner"><div class="lp-profile-pic" style="background-image:url(' + IMG + 'cover.jpg)"></div></div></div>',
'            </div>',
'            <div class="lp-profile-stats">',
'              <div class="lp-profile-stat"><div class="lp-num">12</div><div class="lp-label">posts</div></div>',
'              <div class="lp-profile-stat"><div class="lp-num">328</div><div class="lp-label">followers</div></div>',
'              <div class="lp-profile-stat"><div class="lp-num">47</div><div class="lp-label">following</div></div>',
'            </div>',
'          </div>',
'          <div class="lp-profile-bio">',
'            <div class="lp-name">hardnbaflicks</div>',
'            <div class="lp-text" style="color:#aaa;font-size:12px;margin-bottom:3px;">Digital creator</div>',
'            <div class="lp-text">\ud83c\udfc0 ai nba flicks<br>\ud83d\udd25 hard takes, harder visuals<br>\ud83d\udcf8 made by Mike</div>',
'            <div class="lp-link"><a href="https://instagram.com/hardnbaflicks" target="_blank" rel="noopener" style="color:#E0F1FF;text-decoration:none;">instagram.com/hardnbaflicks</a></div>',
'          </div>',
'          <div class="lp-profile-actions">',
'            <a href="https://instagram.com/hardnbaflicks" target="_blank" rel="noopener" class="lp-btn lp-btn-follow" style="background:#3897f0;color:#fff;text-decoration:none;">Follow</a>',
'            <button class="lp-btn lp-btn-message">Message</button>',
'          </div>',
'          <div class="lp-content-tabs">',
'            <div class="lp-content-tab active" data-ctab="grid"><svg viewBox="0 0 24 24"><path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/></svg></div>',
'            <div class="lp-content-tab" data-ctab="reels"><svg viewBox="0 0 24 24"><path d="M10 8l6 4-6 4V8zM4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" fill="none" stroke="#fff" stroke-width="1.5"/></svg></div>',
'            <div class="lp-content-tab" data-ctab="tagged"><svg viewBox="0 0 24 24"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="none" stroke="#fff" stroke-width="1.5"/></svg></div>',
'          </div>',
'          <div class="lp-post-grid" id="hnf-postGrid"></div>',
'        </div>',
'        <div class="lp-view" id="hnf-viewFeed">',
'          <div style="padding-top:50px;" id="hnf-feedContent"></div>',
'        </div>',
'        <div class="lp-view" id="hnf-viewSearch"><div class="lp-placeholder-view">Search</div></div>',
'        <div class="lp-view" id="hnf-viewReels"><div class="lp-placeholder-view">Reels</div></div>',
'        <div class="lp-view" id="hnf-viewShop"><div class="lp-placeholder-view">Shop</div></div>',
'      </div>',
'      <div class="lp-post-detail" id="hnf-postDetail">',
'        <div class="lp-post-detail-header">',
'          <div class="lp-back" id="hnf-postDetailBack"><svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg></div>',
'          <div class="lp-avatar" style="background-image:url(' + IMG + 'cover.jpg);background-size:cover;background-position:center"></div>',
'          <div class="lp-uname">hardnbaflicks</div>',
'          <div class="lp-dots">\u2022\u2022\u2022</div>',
'        </div>',
'        <div id="hnf-postDetailContent"></div>',
'      </div>',
'      <div class="lp-tab-bar">',
'        <div class="lp-tab"><svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></div>',
'        <div class="lp-tab"><svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></div>',
'        <div class="lp-tab"><svg viewBox="0 0 24 24"><path d="M10 8l6 4-6 4V8zM4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z" fill="none" stroke="#fff" stroke-width="2" fill="none"/></svg></div>',
'        <div class="lp-tab"><svg viewBox="0 0 24 24"><path d="M16 6V4a4 4 0 00-8 0v2H4v14a2 2 0 002 2h12a2 2 0 002-2V6h-4zm-6-2a2 2 0 014 0v2h-4V4zm8 16H6V8h2v2h8V8h2v12z"/></svg></div>',
'        <div class="lp-tab active"><svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>',
'      </div>',
'    </div>',
'    <div class="lp-stories-overlay" id="hnf-storiesOverlay">',
'      <div class="lp-stories-content" id="hnf-storiesContent">',
'        <div class="lp-stories-progress" id="hnf-storiesProgress"></div>',
'        <div class="lp-stories-header">',
'          <div class="lp-s-avatar" style="background-image:url(' + IMG + 'cover.jpg);background-size:cover;background-position:center"></div>',
'          <div class="lp-s-uname">hardnbaflicks</div>',
'          <div class="lp-s-close" id="hnf-storiesClose">\u2715</div>',
'        </div>',
'        <div class="lp-stories-tap-left" id="hnf-storyTapLeft"></div>',
'        <div class="lp-stories-tap-right" id="hnf-storyTapRight"></div>',
'        <button class="lp-stories-mute" id="hnf-storiesMute" style="display:none;">',
'          <svg id="hnf-muteIcon" viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>',
'        </button>',
'      </div>',
'      <div class="lp-stories-reply" id="hnf-storiesReply" style="position:absolute;bottom:16px;left:12px;right:12px;z-index:56;">',
'        <input type="text" placeholder="Reply to hardnbaflicks..." readonly>',
'        <div class="lp-sr-icon"><svg viewBox="0 0 24 24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-1.834-1.535-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
'        <div class="lp-sr-icon"><svg viewBox="0 0 24 24"><path d="M22 3L9.218 10.083M11.698 20.334L22 3.001H2l9.218 7.083m.48 10.25v-4.166l2.044-2.385" stroke-linecap="round" stroke-linejoin="round"/></svg></div>',
'      </div>',
'    </div>',
'  </div>',
'</div>',
  ].join('\n');

  // ── Initialize interactive logic ──
  (function() {
    // Posts Data — quick hits up top, themed carousels below.
    var posts = [
      // Quick hits (single-image)
      {id:0, images:['quick-09.jpg'], caption:'mcnuggs.', likes:412},
      {id:1, images:['quick-08.jpg'], caption:'shrek bron.', likes:587},
      {id:2, images:['quick-07.jpg'], caption:'ny crumbles.', likes:298},
      {id:3, images:['quick-06.jpg'], caption:'piston mc.', likes:341},
      {id:4, images:['quick-05.jpg'], caption:'lbj.', likes:902},
      {id:5, images:['quick-04.jpg'], caption:'smoked.', likes:476},
      {id:6, images:['quick-03.jpg'], caption:'KO.', likes:528},
      {id:7, images:['quick-01.jpg'], caption:'opening night.', likes:264},
      // Themed carousels
      {id:8, images:['steph-01.jpg','steph-02.jpg','steph-03.jpg','steph-04.jpg','steph-05.jpg','steph-06.jpg'], caption:'splash brothers, editorial.', likes:1124},
      {id:9, images:['wemby-01.jpg','wemby-02.jpg','wemby-03.jpg','wemby-04.jpg','wemby-05.jpg','wemby-06.jpg'], caption:'wemby and his alien.', likes:1873},
      {id:10, images:['cliff-01.jpg','cliff-02.jpg','cliff-03.jpg','cliff-04.jpg','cliff-05.jpg','cliff-06.jpg','cliff-07.jpg'], caption:'cliff paul rings collection.', likes:946},
      {id:11, images:['sga-01.jpg','sga-02.jpg','sga-03.jpg','sga-04.jpg','sga-05.jpg','sga-06.jpg','sga-07.jpg'], caption:'sga tunnel fits.', likes:1602}
    ];

    // No stories for hardnbaflicks
    var stories = [];

    // Clock
    function updateClock() {
      var el = $('clock');
      if (!el) return;
      var d = new Date(), h = d.getHours(), m = d.getMinutes();
      el.textContent = (h % 12 || 12) + ':' + (m < 10 ? '0' : '') + m;
    }
    updateClock();
    setInterval(updateClock, 10000);

    // Build Grid (multi-image posts get a small carousel icon overlay)
    var grid = $('postGrid');
    posts.forEach(function(p, i) {
      var el = document.createElement('div');
      el.className = 'lp-grid-item';
      var carouselIcon = p.images.length > 1
        ? '<div style="position:absolute;top:6px;right:6px;z-index:2;pointer-events:none;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,0.5))"><rect x="6" y="3" width="15" height="15" rx="2"/><rect x="3" y="6" width="15" height="15" rx="2" fill="rgba(0,0,0,0.0001)"/></svg></div>'
        : '';
      el.style.position = 'relative';
      el.innerHTML = carouselIcon + '<img src="' + IMG + p.images[0] + '" alt="Post ' + (i+1) + '" loading="lazy">';
      el.addEventListener('click', function() { openPostDetail(i); });
      grid.appendChild(el);
    });

    // Post Detail
    function openPostDetail(idx) {
      var p = posts[idx];
      var det = $('postDetail');
      var content = $('postDetailContent');
      content.innerHTML =
        '<div class="lp-carousel-wrap" data-post="' + idx + '">' +
          '<div class="lp-carousel-track">' + p.images.map(function(img) { return '<div class="lp-carousel-slide"><img src="' + IMG + img + '" loading="lazy"></div>'; }).join('') + '</div>' +
          (p.images.length > 1 ? '<button class="lp-carousel-arrow left" disabled>\u2039</button><button class="lp-carousel-arrow right">\u203a</button>' : '') +
        '</div>' +
        (p.images.length > 1 ? '<div class="lp-carousel-dots">' + p.images.map(function(_, j) { return '<div class="lp-dot' + (j === 0 ? ' active' : '') + '"></div>'; }).join('') + '</div>' : '') +
        '<div class="lp-post-actions">' +
          '<svg viewBox="0 0 24 24"><path d="M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-1.834-1.535-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938z" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<svg viewBox="0 0 24 24"><path d="M20.656 17.008a9.993 9.993 0 10-3.59 3.615L22 22z" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<svg viewBox="0 0 24 24"><path d="M22 3L9.218 10.083M11.698 20.334L22 3.001H2l9.218 7.083m.48 10.25v-4.166l2.044-2.385" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<div class="lp-spacer"></div>' +
          '<div class="lp-bookmark"><svg viewBox="0 0 24 24"><path d="M20 21l-8-4-8 4V5a2 2 0 012-2h12a2 2 0 012 2z" stroke-linecap="round" stroke-linejoin="round"/></svg></div>' +
        '</div>' +
        '<div class="lp-post-likes">' + p.likes.toLocaleString() + ' likes</div>' +
        '<div class="lp-post-caption"><span class="lp-cap-user">hardnbaflicks</span> ' + p.caption + '</div>';
      det.classList.add('open');
      initCarousel(content.querySelector('.lp-carousel-wrap'));
    }

    $('postDetailBack').addEventListener('click', function() {
      $('postDetail').classList.remove('open');
    });

    // Carousel
    function initCarousel(wrap) {
      if (!wrap) return;
      var track = wrap.querySelector('.lp-carousel-track');
      var slides = wrap.querySelectorAll('.lp-carousel-slide');
      var leftArr = wrap.querySelector('.lp-carousel-arrow.left');
      var rightArr = wrap.querySelector('.lp-carousel-arrow.right');
      var dotsWrap = wrap.nextElementSibling;
      var idx = 0;
      var total = slides.length;
      var startX = 0, diffX = 0, dragging = false;

      function go(i) {
        idx = Math.max(0, Math.min(total - 1, i));
        track.style.transform = 'translateX(-' + idx * 100 + '%)';
        if (leftArr) leftArr.disabled = idx === 0;
        if (rightArr) rightArr.disabled = idx === total - 1;
        if (dotsWrap && dotsWrap.classList.contains('lp-carousel-dots')) {
          dotsWrap.querySelectorAll('.lp-dot').forEach(function(d, j) { d.classList.toggle('active', j === idx); });
        }
      }

      if (leftArr) leftArr.addEventListener('click', function(e) { e.stopPropagation(); go(idx - 1); });
      if (rightArr) rightArr.addEventListener('click', function(e) { e.stopPropagation(); go(idx + 1); });

      wrap.addEventListener('touchstart', function(e) { startX = e.touches[0].clientX; diffX = 0; dragging = true; track.style.transition = 'none'; }, {passive: true});
      wrap.addEventListener('touchmove', function(e) { if (!dragging) return; diffX = e.touches[0].clientX - startX; track.style.transform = 'translateX(calc(-' + idx * 100 + '% + ' + diffX + 'px))'; }, {passive: true});
      wrap.addEventListener('touchend', function() {
        dragging = false;
        track.style.transition = 'transform .35s cubic-bezier(.4,0,.2,1)';
        if (Math.abs(diffX) > 40) { go(diffX > 0 ? idx - 1 : idx + 1); } else { go(idx); }
      });
    }

    // Stories
    var storyIdx = 0, storyRaf = null, storyStart = 0, storyDuration = 10000, storyMuted = true;
    var overlay = $('storiesOverlay');
    var sContent = $('storiesContent');
    var sProgress = $('storiesProgress');
    var sMute = $('storiesMute');

    $('profilePicBtn').addEventListener('click', function() { if (stories.length) openStories(0); });

    function openStories(idx) {
      storyIdx = idx;
      sProgress.innerHTML = stories.map(function() { return '<div class="lp-bar-bg"><div class="lp-bar-fill"></div></div>'; }).join('');
      overlay.classList.add('open');
      showStory();
    }

    function closeStories() {
      overlay.classList.remove('open');
      cancelAnimationFrame(storyRaf);
      var vid = sContent.querySelector('video');
      if (vid) vid.pause();
    }

    $('storiesClose').addEventListener('click', closeStories);
    $('storyTapLeft').addEventListener('click', function() { if (storyIdx > 0) { storyIdx--; showStory(); } });
    $('storyTapRight').addEventListener('click', function() {
      if (storyIdx < stories.length - 1) { storyIdx++; showStory(); } else { closeStories(); }
    });

    sMute.addEventListener('click', function() {
      storyMuted = !storyMuted;
      var vid = sContent.querySelector('video');
      if (vid) vid.muted = storyMuted;
      var muteIcon = $('muteIcon');
      muteIcon.innerHTML = storyMuted
        ? '<path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>'
        : '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-3.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    });

    function showStory() {
      cancelAnimationFrame(storyRaf);
      var s = stories[storyIdx];
      var bars = sProgress.querySelectorAll('.lp-bar-fill');
      bars.forEach(function(b, i) { b.style.width = i < storyIdx ? '100%' : '0%'; });

      var oldVid = sContent.querySelector('video');
      if (oldVid) oldVid.pause();
      var oldMedia = sContent.querySelectorAll('img,video');
      oldMedia.forEach(function(m) { m.remove(); });

      if (s.type === 'video') {
        sMute.style.display = 'flex';
        var vid = document.createElement('video');
        vid.src = IMG + s.src;
        vid.autoplay = true;
        vid.muted = storyMuted;
        vid.playsInline = true;
        vid.setAttribute('playsinline', '');
        vid.setAttribute('webkit-playsinline', '');
        sContent.insertBefore(vid, sContent.firstChild);

        vid.addEventListener('loadedmetadata', function() {
          storyDuration = vid.duration * 1000;
          storyStart = performance.now();
          animateBar();
        });
        vid.addEventListener('ended', function() {
          if (storyIdx < stories.length - 1) { storyIdx++; showStory(); } else closeStories();
        });
      } else {
        sMute.style.display = 'none';
        var img = document.createElement('img');
        img.src = IMG + s.src;
        sContent.insertBefore(img, sContent.firstChild);
        storyDuration = 10000;
        storyStart = performance.now();
        animateBar();
      }
    }

    function animateBar() {
      var bar = sProgress.querySelectorAll('.lp-bar-fill')[storyIdx];
      if (!bar) return;
      function tick(now) {
        var elapsed = now - storyStart;
        var pct = Math.min(elapsed / storyDuration, 1);
        bar.style.width = pct * 100 + '%';
        if (pct < 1) { storyRaf = requestAnimationFrame(tick); }
        else {
          if (storyIdx < stories.length - 1) { storyIdx++; showStory(); } else closeStories();
        }
      }
      storyRaf = requestAnimationFrame(tick);
    }
    // Make phone focusable
    root.setAttribute('tabindex', '0');
    root.style.outline = 'none';

    // Track active carousel for arrow keys
    var activeCarousel = null;
    var activeCarouselIdx = 0;
    var activeCarouselSlides = 0;
    var activeCarouselGo = null;

    // Patch initCarousel to track active
    var origInitCarousel = initCarousel;
    initCarousel = function(wrap) {
      origInitCarousel(wrap);
      if (!wrap) return;
      var track = wrap.querySelector('.lp-carousel-track');
      var slides = wrap.querySelectorAll('.lp-carousel-slide');
      var leftArr = wrap.querySelector('.lp-carousel-arrow.left');
      var rightArr = wrap.querySelector('.lp-carousel-arrow.right');
      var dotsWrap = wrap.nextElementSibling;
      var cidx = 0;
      var total = slides.length;
      activeCarousel = wrap;
      activeCarouselIdx = 0;
      activeCarouselSlides = total;
      activeCarouselGo = function(i) {
        cidx = Math.max(0, Math.min(total - 1, i));
        activeCarouselIdx = cidx;
        track.style.transform = 'translateX(-' + cidx * 100 + '%)';
        if (leftArr) leftArr.disabled = cidx === 0;
        if (rightArr) rightArr.disabled = cidx === total - 1;
        if (dotsWrap && dotsWrap.classList.contains('lp-carousel-dots')) {
          dotsWrap.querySelectorAll('.lp-dot').forEach(function(d, j) { d.classList.toggle('active', j === cidx); });
        }
      };
    };

    // Keyboard handler — only active when stories or post detail are open
    root.addEventListener('keydown', function(e) {
      var storiesOpen = overlay.classList.contains('open');
      var postOpen = $('postDetail').classList.contains('open');

      // Do nothing on main profile page
      if (!storiesOpen && !postOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault(); e.stopPropagation();
        if (storiesOpen) closeStories();
        else if (postOpen) { $('postDetail').classList.remove('open'); activeCarousel = null; }
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault(); e.stopPropagation();
        if (storiesOpen) {
          if (e.key === 'ArrowLeft' && storyIdx > 0) { storyIdx--; showStory(); }
          else if (e.key === 'ArrowRight') {
            if (storyIdx < stories.length - 1) { storyIdx++; showStory(); } else closeStories();
          }
        } else if (postOpen && activeCarouselGo) {
          if (e.key === 'ArrowLeft') activeCarouselGo(activeCarouselIdx - 1);
          else activeCarouselGo(activeCarouselIdx + 1);
        }
      }
    });

    // Focus phone on click inside (preventScroll stops page jumping)
    root.addEventListener('mousedown', function() { root.focus({preventScroll: true}); });
  })();
}
