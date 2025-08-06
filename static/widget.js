(async()=>{
  /* ========== 1. CONFIG ============ */
  const cfg = window.POUNCE_CONFIG || {};           // read global options
  const PAW_DEFAULT = "💬";                          // fallback icon
  const HEAD_DEFAULT = "";                           // fallback image (none)

  /* ========== 2. LOAD CSS ========== */
  const css = await fetch("/static/widget.css").then(r=>r.text());
  document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

  /* apply color overrides */
  const root = document.documentElement;
  if(cfg.headerBg)   root.style.setProperty("--pounce-header-bg", cfg.headerBg);
  if(cfg.headerFont) root.style.setProperty("--pounce-header-font", cfg.headerFont);
  if(cfg.bgColor)    root.style.setProperty("--pounce-bubble-bg", cfg.bgColor);
  if(cfg.focusColor) root.style.setProperty("--pounce-focus", cfg.focusColor);

  /* skip widget on excluded paths */
  if ((cfg.excludePaths||[]).some(p=>location.pathname.includes(p))) return;

  /* ========== 3. BUILD DOM ========= */
  const wrap=document.createElement("div");wrap.className="pounce-wrap";
  wrap.style[cfg.position?.startsWith("bottom")?"bottom":"top"]="24px";
  wrap.style[cfg.position?.endsWith("left")?"left":"right"]="24px";

  /* bubble */
  const bubble=document.createElement("div");
  bubble.className=`pounce-bubble ${cfg.shape==="tab"?"tab":"circle"}`;
  if(cfg.iconImage||HEAD_DEFAULT){
    bubble.innerHTML=`<img src="${cfg.iconImage||HEAD_DEFAULT}" alt="icon">`;
  }else{
    bubble.innerHTML=`<span style="font-size:28px;color:#fff">${cfg.icon||PAW_DEFAULT}</span>`;
  }

  /* popup */
  const pop=document.createElement("div");pop.className="pounce-popup";
  const anim = cfg.animation==="slide" ? "pounce-slide" :
               cfg.animation==="none"  ? "none"        : "pounce-bounce";
  pop.style.animation = anim==="none" ? "none"
        : `${anim} ${cfg.animationDuration||0.35}s ease ${cfg.animationCount||1}`;
  pop.innerHTML=`
    <div class="pounce-header">
      <span>${cfg.headerText||"Agent Pounce"}</span>
      <button class="pounce-close" aria-label="Close">&times;</button>
    </div>
    <div style="flex:1;display:flex;flex-direction:column">
      <div id="pounce-log"></div>
      <form id="pounce-form">
        <input id="pounce-msg" placeholder="${cfg.placeholder||"Ask me anything…"}">
        <button id="pounce-send">Send</button>
      </form>
    </div>`;

  /* glue */
  wrap.append(bubble,pop);document.body.appendChild(wrap);

  /* avatar inside header if provided */
  if(cfg.avatar){
    const img=document.createElement("img");
    img.src=cfg.avatar;img.alt="avatar";
    img.style="width:28px;height:28px;margin-right:6px;border-radius:50%";
    pop.querySelector(".pounce-header").prepend(img);
  }

  /* intro line */
  const log=pop.querySelector("#pounce-log");
  log.innerHTML=`<div class='pounce-bot'>🐾 ${cfg.bodyText||
       "👋 Hi! I’m Agent Pounce, your grad-admissions guru. Ask me anything…"}</div>`;

  /* open / close behaviour */
  bubble.onclick=()=>{pop.style.display="flex";bubble.style.display="none";};
  pop.querySelector(".pounce-close").onclick=()=>{pop.style.display="none";
                                                 bubble.style.display="flex";};

  /* ========== 4. CHAT LOOP ========== */
  const form=pop.querySelector("#pounce-form"),
        msg =pop.querySelector("#pounce-msg");
  form.onsubmit = async e=>{
    e.preventDefault();
    const text=msg.value.trim(); if(!text)return;
    log.innerHTML+=`<div class='pounce-user'>🧑‍🎓 ${text}</div>`; msg.value="";
    log.scrollTop = log.scrollHeight;

    const r  = await fetch("/chat",{method:"POST",headers:{"Content-Type":"application/json"},
                                   body:JSON.stringify({message:text})});
    const js = await r.json();
    const ans= js.choices?.[0]?.message?.content || "[error]";
    log.innerHTML+=`<div class='pounce-bot'>🐾 ${ans}</div>`;
    log.scrollTop = log.scrollHeight;
  };
})();
