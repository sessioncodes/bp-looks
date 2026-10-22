'use strict';
/* ============ helpers ============ */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clone=o=>JSON.parse(JSON.stringify(o));
const uid=()=>'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){let el=$('.toast');if(!el){el=document.createElement('div');el.className='toast';document.body.appendChild(el)}el.textContent=t;el.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove('show'),1900)}
function download(name,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
const IC={
 back:'M15 18l-6-6 6-6',chev:'M9 18l6-6-6-6',plus:'M12 5v14M5 12h14',search:'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
 grid:'M4 4h6v6H4zM14 4h6v6h-6zM14 14h6v6h-6zM4 14h6v6H4z',users:'M16 20v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 18.5V20M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM20 20v-1.5a3.5 3.5 0 0 0-2.5-3.35M15.5 4.15a3.5 3.5 0 0 1 0 6.7',
 gear:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
 heart:'M19.5 12.6L12 20l-7.5-7.4A4.6 4.6 0 0 1 12 6.3a4.6 4.6 0 0 1 7.5 6.3z',more:'M6 12h.01M12 12h.01M18 12h.01',
 play:'M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z',pause:'M7 4h3.5v16H7zM13.5 4H17v16h-3.5z',
 prev:'M18 5.5v13a.8.8 0 0 1-1.25.66L8 13v5H6V6h2v5l8.75-6.16A.8.8 0 0 1 18 5.5z',next:'M6 5.5v13a.8.8 0 0 0 1.25.66L16 13v5h2V6h-2v5L7.25 4.84A.8.8 0 0 0 6 5.5z',
 repeat:'M17 2l3 3-3 3M4 11V9a4 4 0 0 1 4-4h12M7 22l-3-3 3-3M20 13v2a4 4 0 0 1-4 4H4',shield:'M12 21s7-3.5 7-9V5.5L12 3 5 5.5V12c0 5.5 7 9 7 9z',
 full:'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3',
 share:'M12 3v12M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7',undo:'M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11',redo:'M15 14l5-5-5-5M20 9H9.5a5.5 5.5 0 0 0 0 11H13',
 trash:'M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3',copy:'M9 9h10v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9zM5 15V5a2 2 0 0 1 2-2h8',
 edit:'M4 20h4L19 9a2.83 2.83 0 0 0-4-4L4 16v4zM13.5 6.5l4 4',image:'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21',
 x:'M18 6L6 18M6 6l12 12',info:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16v-4M12 8h.01',eye:'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
 download:'M12 4v11M7 10l5 5 5-5M5 20h14',upload:'M12 20V9M7 14l5-5 5 5M5 4h14',clear:'M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0zM9 9l6 6M15 9l-6 6'};
const FILLED=new Set(['play','pause','prev','next']);
const ic=(n,s=22,o={})=>{const f=o.fill||FILLED.has(n);return `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="${f?'currentColor':'none'}" stroke="${f&&FILLED.has(n)?'none':'currentColor'}" stroke-width="${o.sw||(n==='more'?3.2:1.9)}" stroke-linecap="round" stroke-linejoin="round"><path d="${IC[n]}"/></svg>`};

/* ============ courts / theme ============ */
const COURTS={
 charcoal:{n:'Charcoal',bg:'#1a1a1d',paint:'#212125',line:'rgba(255,255,255,.2)',ink:'#f5f5f7',def:'rgba(245,245,247,.6)',deff:'rgba(255,255,255,.06)',rim:'#ff6a1a',plank:0},
 wood:{n:'Hardwood',bg:'#d9a46a',paint:'#cb9257',line:'rgba(255,255,255,.85)',ink:'#1e1406',def:'#3d2b14',deff:'rgba(255,255,255,.25)',rim:'#d6411a',plank:1},
 light:{n:'Light',bg:'#ffffff',paint:'#f3f3f5',line:'#d6d6db',ink:'#18181b',def:'#55555c',deff:'rgba(0,0,0,.04)',rim:'#ff6a1a',plank:0}};
const cp=()=>COURTS[store.settings.court]||COURTS.charcoal;
function applySettings(){
  const s=store.settings,r=document.documentElement;
  const dark=s.theme==='system'?matchMedia('(prefers-color-scheme: dark)').matches:s.theme==='dark';
  r.dataset.theme=dark?'dark':'light';
  const m=$('meta[name=theme-color]');if(m)m.content=dark?'#000000':'#f5f5f7';
}
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(store.settings.theme==='system'){applySettings()}});

/* ============ store ============ */
const DEF={settings:{theme:'system',court:'charcoal',labels:'num',mode:'coach',speed:1,loop:false},
  team:{name:'My Team',roster:[{n:'1',name:'',pos:'PG'},{n:'2',name:'',pos:'SG'},{n:'3',name:'',pos:'SF'},{n:'4',name:'',pos:'PF'},{n:'5',name:'',pos:'C'}]},
  plays:[],favs:[]};
let store=clone(DEF);
const newStep=()=>({moves:{},pass:null,note:'',dur:1.9});
function normalize(p){
  p=clone(p);p.name=String(p.name||'Untitled').slice(0,60);p.cat=p.cat||'Offense';p.desc=String(p.desc||'').slice(0,400);
  p.court=p.court==='full'?'full':'half';p.ball=p.ball|0;
  p.start=(p.start||[]).map(q=>({x:+q.x||250,y:+q.y||250}));
  while(p.start.length<5)p.start.push({x:250,y:250});
  if(p.start.length>5&&p.start.length<10)p.start.length=5;
  p.defense=p.start.length===10;
  p.steps=(p.steps||[]).map(s=>{const m={};for(const k in (s.moves||{})){const v=s.moves[k];m[k]={x:+v.x,y:+v.y,t:['move','cut','drib','scr'].includes(v.t)?v.t:'cut'}}return{moves:m,pass:s.pass==null?null:s.pass|0,note:String(s.note||'').slice(0,200),dur:Math.min(4,Math.max(.6,+s.dur||1.9))}});
  if(!p.steps.length)p.steps=[newStep()];
  return p;
}
const keepMeta=(n,p)=>Object.assign(n,{id:p.id,created:p.created,updated:p.updated});
function loadStore(){
  let s=null;try{s=JSON.parse(localStorage.getItem('playbook.v2'))}catch(e){}
  store=clone(DEF);
  if(s){Object.assign(store,s);store.settings=Object.assign(clone(DEF.settings),s.settings);store.team=Object.assign(clone(DEF.team),s.team);store.plays=(s.plays||[]).map(p=>keepMeta(normalize(p),p))}
  else{try{const v1=JSON.parse(localStorage.getItem('hoops.plays.v1')||'[]');store.plays=v1.map(p=>keepMeta(normalize(p),{id:p.id||uid(),created:Date.now(),updated:Date.now()}))}catch(e){}}
  if(!COURTS[store.settings.court])store.settings.court='charcoal';
  if(!['num','jersey','name'].includes(store.settings.labels))store.settings.labels='num';
}
const save=()=>{try{localStorage.setItem('playbook.v2',JSON.stringify(store))}catch(e){toast('Storage full. Export a backup.')}};
const isFav=id=>store.favs.includes(id);
const coach=()=>store.settings.mode==='coach';

/* ============ geometry / play maths ============ */
const CATS=['Offense','Out of bounds','Press break','Transition','Defense'];
const BASKET={x:250,y:52};
const hOf=p=>p.court==='full'?940:470;
function posAt(pl,k){const p=pl.start.map(q=>({x:q.x,y:q.y}));for(let s=0;s<k;s++){const m=pl.steps[s].moves;for(const i in m)p[i]={x:m[i].x,y:m[i].y}}return p}
function endPos(pl,k){const p=posAt(pl,k),m=pl.steps[k].moves;for(const i in m)p[i]={x:m[i].x,y:m[i].y};return p}
function holderAt(pl,k){let h=pl.ball;for(let s=0;s<k;s++){const q=pl.steps[s].pass;if(q!=null)h=q}return h}
const ease=f=>f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;
const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
const ballOff=p=>({x:p.x+18,y:p.y+16});
function stateAt(pl,T){
  const N=pl.steps.length;
  const s=Math.max(0,Math.min(Math.floor(T)||0,N-1)),f=T>=N?1:T-s,e=ease(Math.min(1,f/.86));
  const a=posAt(pl,s),b=endPos(pl,s),pos=a.map((q,i)=>lerp(q,b[i],e));
  const h=holderAt(pl,s),ps=pl.steps[s].pass;let ball=pos[h];
  if(ps!=null&&e>.3)ball=lerp(pos[h],pos[ps],Math.min(1,(e-.3)/.6));
  return{pos,ball:ballOff(ball),step:s};
}
function shadowPt(p){const dx=BASKET.x-p.x,dy=BASKET.y-p.y,d=Math.hypot(dx,dy)||1,k=Math.min(48,d*.6)/d;return{x:p.x+dx*k,y:p.y+dy*k}}
function genDefense(pl){
  pl.start=pl.start.slice(0,5);for(let i=0;i<5;i++)pl.start.push(shadowPt(pl.start[i]));
  pl.steps.forEach((s,k)=>{for(let i=5;i<10;i++)delete s.moves[i];const e=endPos(pl,k);for(let i=0;i<5;i++)if(s.moves[i]){const q=shadowPt(e[i]);s.moves[i+5]={x:q.x,y:q.y,t:'cut'}}});
  pl.defense=true;
}
function dropDefense(pl){pl.start=pl.start.slice(0,5);pl.steps.forEach(s=>{for(let i=5;i<10;i++)delete s.moves[i]});pl.defense=false}
const unit=(a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1;return{x:dx/d,y:dy/d,d}};

/* ============ presets ============ */
const M=(x,y,t='cut')=>({x,y,t}),S=(x,y)=>({x,y});
const mk=o=>{o.court=o.court||'half';o.desc=o.desc||'';o.steps.forEach(s=>{s.dur=s.dur||1.9;if(s.pass===undefined)s.pass=null});if(o.defense)genDefense(o);else o.defense=false;return o};
const PRESETS=[
 mk({id:'pre-pnr',name:'Pick & Roll',cat:'Offense',ball:0,defense:true,desc:'The big sets a screen, the guard attacks off it, and the big rolls to the rim for the pass.',
  start:[S(250,370),S(420,270),S(80,270),S(150,180),S(330,230)],
  steps:[{moves:{4:M(300,300,'scr')},note:'5 sets a screen for 1 at the top of the key.'},
   {moves:{0:M(370,255,'drib'),4:M(270,130)},note:'1 uses the screen and dribbles right. 5 rolls hard to the rim.'},
   {moves:{4:M(250,90)},pass:4,note:'1 hits the rolling big for the finish.'}]}),
 mk({id:'pre-gg',name:'Give & Go',cat:'Offense',ball:0,defense:true,desc:'Pass, then cut straight to the basket and get it right back. Works against defenders who watch the ball.',
  start:[S(250,380),S(410,270),S(90,270),S(160,170),S(340,170)],
  steps:[{moves:{0:M(290,335)},pass:1,note:'1 passes to the wing and gets ready to cut.'},
   {moves:{0:M(240,115)},note:'1 cuts hard to the basket right after the pass.'},
   {moves:{0:M(262,86)},pass:0,note:'2 returns the pass for the layup.'}]}),
 mk({id:'pre-back',name:'Backdoor Cut',cat:'Offense',ball:0,defense:true,desc:'When the defender denies the wing pass, cut behind them to the rim.',
  start:[S(250,380),S(420,280),S(80,280),S(160,180),S(340,180)],
  steps:[{moves:{0:M(310,350,'drib'),1:M(445,345)},note:'1 dribbles over. 2 drifts out like they want the ball.'},
   {moves:{1:M(340,125)},note:'2 sees the defender overplay and cuts backdoor.'},
   {moves:{1:M(280,84)},pass:1,note:'1 throws a bounce pass to the cutter.'}]}),
 mk({id:'pre-hand',name:'Elbow Handoff',cat:'Offense',ball:0,defense:true,desc:'Entry pass to the elbow, then the guard curls tight off a handoff.',
  start:[S(250,360),S(430,250),S(70,250),S(180,205),S(320,205)],
  steps:[{moves:{0:M(250,290)},pass:3,note:'1 passes to 4 at the elbow.'},
   {moves:{0:M(150,225),2:M(60,110)},note:'1 curls tight around 4. 3 slides to the corner.'},
   {moves:{0:M(205,105,'drib')},pass:0,note:'4 hands it off and 1 attacks the rim.'}]}),
 mk({id:'pre-kick',name:'Drive & Kick',cat:'Offense',ball:0,defense:true,desc:'Dribble penetration pulls the defense in, then kick to the open shooter.',
  start:[S(250,370),S(430,290),S(70,290),S(170,200),S(330,200)],
  steps:[{moves:{0:M(270,235,'drib'),1:M(445,215),2:M(55,215)},note:'1 drives the middle. Wings lift to the corners.'},
   {moves:{0:M(255,140,'drib')},note:'Defenders collapse on the drive.'},
   {moves:{},pass:1,note:'1 kicks it out to the open corner shooter.'}]}),
 mk({id:'pre-horns',name:'Pick & Pop',cat:'Offense',ball:0,defense:true,desc:'Horns set: two bigs at the elbows. One screens, then pops out for the jumper.',
  start:[S(250,365),S(430,275),S(70,275),S(185,210),S(315,210)],
  steps:[{moves:{3:M(285,315,'scr')},note:'4 steps out and screens for the ball handler.'},
   {moves:{0:M(350,285,'drib'),3:M(330,345)},note:'1 uses the screen. 4 pops out for the shot.'},
   {moves:{},pass:3,note:'1 passes back to 4 for the open jumper.'}]}),
 mk({id:'pre-blob',name:'Box Inbound',cat:'Out of bounds',ball:0,defense:true,desc:'Baseline out of bounds. Four players in a box under the rim; screens free a shooter.',
  start:[S(150,24),S(205,75),S(295,75),S(205,170),S(295,170)],
  steps:[{moves:{3:M(205,105,'scr'),4:M(295,105,'scr')},note:'The two players on the bottom set screens for the top players.'},
   {moves:{1:M(335,235),2:M(165,235)},note:'Top players use the screens and pop to the wings.'},
   {moves:{},pass:2,note:'Inbounder throws it to the open player.'}]}),
 mk({id:'pre-slob',name:'Stack Inbound',cat:'Out of bounds',ball:0,defense:true,desc:'Sideline out of bounds. A stack of three lets a cutter get open.',
  start:[S(24,300),S(200,230),S(200,276),S(200,322),S(370,200)],
  steps:[{moves:{1:M(310,335),2:M(130,365)},note:'The front two break to opposite sides of the stack.'},
   {moves:{3:M(262,115),4:M(430,125)},note:'4 flashes high. 5 relocates to the corner.'},
   {moves:{},pass:3,note:'Inbound to 4 flashing to the high post.'}]}),
 mk({id:'pre-fast',name:'3-Lane Break',cat:'Transition',court:'full',ball:0,desc:'Fill three lanes and attack before the defense is set.',
  start:[S(250,680),S(400,760),S(100,760),S(250,820),S(250,880)],
  steps:[{moves:{0:M(250,430,'drib'),1:M(440,420),2:M(60,420),3:M(250,590)},note:'Ball handler pushes up the middle, wings run the lanes.',dur:2.4},
   {moves:{0:M(250,230,'drib'),1:M(415,170),2:M(85,170),3:M(250,420)},note:'Keep spacing. Stay three wide.',dur:2.4},
   {moves:{1:M(385,90)},pass:1,note:'Dump to the wing for the layup or the open three.'}]}),
 mk({id:'pre-press',name:'Press Break',cat:'Press break',court:'full',ball:0,desc:'Beat a 1-2-2 full-court press with a middle flash and quick passing.',
  start:[S(250,918),S(160,800),S(340,800),S(170,640),S(330,560)],
  steps:[{moves:{2:M(250,690)},pass:1,note:'Inbound to the near guard while 3 flashes to the middle.'},
   {moves:{1:M(150,700,'drib')},pass:2,note:'Guard passes to the middle flash.'},
   {moves:{2:M(250,430,'drib'),3:M(130,410),4:M(380,400),1:M(300,520)},note:'Dribble out of the press. Everyone fills a lane.',dur:2.4}]})
];

/* ============ court drawing ============ */
function courtSvg(full,courtKey){
  const c=COURTS[courtKey]||cp(),H=full?940:470,L=`stroke="${c.line}" stroke-width="2.4"`;
  let planks='';if(c.plank){for(let x=0;x<500;x+=22)planks+=`<rect x="${x}" y="0" width="22" height="${H}" fill="${(x/22)%2?'rgba(0,0,0,.035)':'rgba(255,255,255,.03)'}"/>`}
  const half=`<rect x="170" y="0" width="160" height="190" fill="${c.paint}" ${L}/>
<path d="M190 190A60 60 0 0 0 310 190" fill="none" ${L}/><path d="M190 190A60 60 0 0 1 310 190" fill="none" ${L} stroke-dasharray="6 7"/>
<path d="M30 0V140A237 237 0 0 0 470 140V0" fill="none" ${L}/><path d="M210 52A40 40 0 0 0 290 52" fill="none" ${L}/>
<path d="M190 470A60 60 0 0 1 310 470" fill="none" ${L}/>
<line x1="222" y1="40" x2="278" y2="40" stroke="${c.line}" stroke-width="4" stroke-linecap="round"/><circle cx="250" cy="52" r="8.5" fill="none" stroke="${c.rim}" stroke-width="3"/>`;
  return `<rect width="500" height="${H}" fill="${c.bg}"/>${planks}${half}${full?`<g transform="rotate(180 250 470)">${half}</g><line x1="0" y1="470" x2="500" y2="470" ${L}/>`:''}`;
}
function defs(){const c=cp(),m=(id,col)=>`<marker id="${id}" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 1L10 5L0 9z" fill="${col}"/></marker>`;return `<defs>${m('mo',c.ink)}${m('md',c.def)}${m('mp',c.ink)}<filter id="psh" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-opacity=".35"/></filter></defs>`}
const labelFor=k=>{const r=store.team.roster[k]||{};return store.settings.labels==='jersey'?(r.n||String(k+1)):String(k+1)};
const ACC='#ff6a1a';
function pl(p,i,o={}){
  const c=cp(),d=i>=5,k=i%5,r=o.r||21,lab=labelFor(k);
  const tr=`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`,op=o.op!=null?`opacity="${o.op}"`:'';
  const fs=lab.length<2?r*.92:lab.length<3?r*.78:r*.6;
  const nm=store.settings.labels==='name'&&!o.noname&&store.team.roster[k]?.name?`<text y="${r+17}" text-anchor="middle" font-size="${r*.66}" font-weight="600" fill="${c.ink}" style="paint-order:stroke;stroke:${c.bg};stroke-width:4px;pointer-events:none">${esc(store.team.roster[k].name.slice(0,10))}</text>`:'';
  if(o.ghost){
    const col=d?c.def:ACC;
    return `<g class="player" data-i="${i}" transform="${tr}" ${op}><circle r="${r}" fill="none" stroke="${col}" stroke-width="2" stroke-dasharray="4 4"/><text y="${fs*.36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="${col}" style="pointer-events:none">${esc(lab)}</text></g>`;
  }
  if(d)return `<g class="player" data-i="${i}" transform="${tr}" ${op}><circle r="${r-1}" fill="${c.deff}" stroke="${c.def}" stroke-width="2.2"/><text y="${fs*.36}" text-anchor="middle" font-size="${fs*.9}" font-weight="600" fill="${c.def}" style="pointer-events:none">${esc(lab)}</text>${nm}</g>`;
  return `<g class="player" data-i="${i}" transform="${tr}" ${op}><circle r="${r}" fill="${ACC}" ${o.flat?'':'filter="url(#psh)"'}/><circle r="${r-1}" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/><text y="${fs*.36}" text-anchor="middle" font-size="${fs}" font-weight="700" fill="#fff" style="pointer-events:none">${esc(lab)}</text>${nm}</g>`;
}
const ballSvg=b=>`<g transform="translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})" style="pointer-events:none"><circle r="10" fill="#e8742a" stroke="#2a1405" stroke-width="1.4"/><path d="M-10 0H10M0 -10V10M-7 -7Q-2 0 -7 7M7 -7Q2 0 7 7" fill="none" stroke="#2a1405" stroke-width="1.2"/></g>`;
function moveSvg(a,b,t,def,o={}){
  const u=unit(a,b);if(u.d<34)return'';
  const c=cp(),col=def?c.def:c.ink,mk=def?'md':'mo',op=o.op??(def?.8:.92),w=o.w||(def?2.2:2.8);
  const s={x:a.x+u.x*25,y:a.y+u.y*25},e={x:b.x-u.x*(t==='scr'?2:o.pad??14),y:b.y-u.y*(t==='scr'?2:o.pad??14)};
  if(t==='drib'){
    const n=Math.max(2,Math.floor(Math.hypot(e.x-s.x,e.y-s.y)/12)),px=-u.y,py=u.x;let d=`M${s.x.toFixed(1)} ${s.y.toFixed(1)}`;
    for(let k=1;k<n;k++){const f=k/n,off=(k%2?1:-1)*6;d+=`L${(s.x+(e.x-s.x)*f+px*off).toFixed(1)} ${(s.y+(e.y-s.y)*f+py*off).toFixed(1)}`}
    d+=`L${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
    return `<path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" opacity="${op}" marker-end="url(#${mk})" style="pointer-events:none"/>`;
  }
  const line=`<line x1="${s.x.toFixed(1)}" y1="${s.y.toFixed(1)}" x2="${e.x.toFixed(1)}" y2="${e.y.toFixed(1)}" stroke="${col}" stroke-width="${t==='move'?w+.6:w}" stroke-linecap="round" ${t==='move'?'stroke-dasharray="0.1 7"':''} opacity="${op}" ${t==='scr'?'':`marker-end="url(#${mk})"`} style="pointer-events:none"/>`;
  if(t!=='scr')return line;
  const px=-u.y*14,py=u.x*14;
  return line+`<line x1="${(e.x+px).toFixed(1)}" y1="${(e.y+py).toFixed(1)}" x2="${(e.x-px).toFixed(1)}" y2="${(e.y-py).toFixed(1)}" stroke="${col}" stroke-width="${w+1}" stroke-linecap="round" opacity="${op}" style="pointer-events:none"/>`;
}
const passSvg=(a,b,op=.9)=>{const u=unit(a,b);if(u.d<30)return'';return `<line x1="${(a.x+u.x*18).toFixed(1)}" y1="${(a.y+u.y*18).toFixed(1)}" x2="${(b.x-u.x*26).toFixed(1)}" y2="${(b.y-u.y*26).toFixed(1)}" stroke="${cp().ink}" stroke-width="2.4" stroke-dasharray="7 7" stroke-linecap="round" opacity="${op}" marker-end="url(#mp)" style="pointer-events:none"/>`};
function stepArrows(pl,k,showD,o={}){
  let s='';const a=posAt(pl,k),st=pl.steps[k];
  for(const i in st.moves){if(!showD&&+i>=5)continue;s+=moveSvg(a[i],st.moves[i],st.moves[i].t,+i>=5,o)}
  if(st.pass!=null){const h=holderAt(pl,k),e=endPos(pl,k);s+=passSvg(a[h],e[st.pass],o.op==null?.9:o.op)}
  return s;
}
function thumb(p){
  const full=p.court==='full',H=hOf(p);let s='';
  p.steps.forEach((_,k)=>{s+=stepArrows(p,k,false,{w:4.5,pad:18,op:.85})});
  if(p.defense)for(let i=5;i<10;i++)s+=pl(p.start[i],i,{r:20,op:.8,noname:1});
  for(let i=0;i<5;i++)s+=pl(p.start[i],i,{r:25,noname:1,flat:1});
  return `<svg viewBox="0 0 500 ${H}" preserveAspectRatio="${full?'xMidYMid meet':'xMidYMin slice'}" style="background:${cp().bg}">${defs()}${courtSvg(full)}${s}</svg>`;
}
const GLYPH={
 move:'<svg width="40" height="18" viewBox="0 0 40 18"><path d="M3 9H28" stroke="currentColor" stroke-width="3" stroke-dasharray="0.1 5.5" stroke-linecap="round"/><path d="M27 3.5L37 9L27 14.5Z" fill="currentColor"/></svg>',
 cut:'<svg width="40" height="18" viewBox="0 0 40 18"><path d="M3 9H30" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M27 3.5L37 9L27 14.5Z" fill="currentColor"/></svg>',
 drib:'<svg width="40" height="18" viewBox="0 0 40 18"><path d="M3 9L7 4L12 14L17 4L22 14L26 9H30" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M27 3.5L37 9L27 14.5Z" fill="currentColor"/></svg>',
 scr:'<svg width="40" height="18" viewBox="0 0 40 18"><path d="M3 9H32M32 2V16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
 pass:'<svg width="40" height="18" viewBox="0 0 40 18"><path d="M3 9H28" stroke="currentColor" stroke-width="2.4" stroke-dasharray="5 4" stroke-linecap="round"/><path d="M27 3.5L37 9L27 14.5Z" fill="currentColor"/></svg>'};

/* ============ sheets ============ */
function sheet(html){
  closeSheet(true);const el=document.createElement('div');el.className='sheet-wrap';
  el.innerHTML=`<div class="scrim"></div><div class="sheet"><div class="grab"></div>${html}</div>`;
  document.body.appendChild(el);requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.add('open')));
  $('.scrim',el).onclick=()=>closeSheet();return el;
}
function closeSheet(now){$$('.sheet-wrap').forEach(el=>{if(el.dataset.c)return;el.dataset.c=1;el.classList.remove('open');if(now)el.remove();else setTimeout(()=>el.remove(),320)})}
function confirmSheet({title,msg,ok='Confirm',danger=false,cancel='Cancel',extra,onOk,onExtra,onCancel}){
  const el=sheet(`<h3>${esc(title)}</h3><p class="d">${esc(msg||'')}</p><div style="display:grid;gap:10px"><button class="btn ${danger?'danger':'solid'}" id="ok" ${danger?'style="background:var(--card)"':''}>${esc(ok)}</button>${extra?`<button class="btn" id="ex">${esc(extra)}</button>`:''}<button class="btn ghost" id="no">${esc(cancel)}</button></div>`);
  $('#ok',el).onclick=()=>{closeSheet();onOk&&onOk()};$('#no',el).onclick=()=>{closeSheet();onCancel&&onCancel()};if(extra)$('#ex',el).onclick=()=>{closeSheet();onExtra&&onExtra()};
}

/* ============ routing ============ */
const main=()=>$('#main');
let R={name:'lib',tab:'lib'},anim=null,depth=0,pending=null,viewTok=0;
const stopAnim=()=>{if(anim){cancelAnimationFrame(anim);anim=null}};
function nav(name,params={}){
  stopAnim();closeSheet(true);viewTok++;
  const overlay=name==='viewer'||name==='editor';
  if(overlay&&depth===0){history.pushState({o:1},'');depth=1}
  R=Object.assign({name,tab:overlay?(R.tab||'lib'):name},params);
  document.body.dataset.notabs=overlay?'1':'';document.body.dataset.editor=name==='editor'?'1':'';
  ({lib:libScreen,team:teamScreen,set:setScreen,viewer:viewerScreen,editor:editorScreen})[name]();
  tabbar();window.scrollTo(0,0);
  const sc=main().firstElementChild;if(sc)sc.classList.add('enter');
}
function leave(to){
  if(depth===1){pending=to||{name:R.tab||'lib'};history.back()}else nav((to||{}).name||R.tab||'lib',(to||{}).params);
}
window.addEventListener('popstate',()=>{
  depth=0;
  if(pending){const p=pending;pending=null;nav(p.name,p.params);return}
  if(R.name==='editor'&&R.api&&R.api.dirty()){history.pushState({o:1},'');depth=1;R.api.ask();return}
  if(R.name==='editor')localStorage.removeItem('playbook.draft');
  nav(R.tab||'lib');
});
function tabbar(){
  const items=[['lib','grid','Plays'],['team','users','Team'],['set','gear','Settings']];
  $('#tabs').innerHTML=`<div class="tabs-in">${items.map(([k,i,l])=>`<button class="tab ${R.tab===k?'on':''}" data-go="${k}">${ic(i,25,{sw:R.tab===k?2.2:1.8})}${l}</button>`).join('')}</div>`;
  $$('[data-go]').forEach(b=>b.onclick=()=>nav(b.dataset.go));
}

/* ============ library ============ */
let lib={q:'',cat:'all'};
const allMine=()=>store.plays.map(p=>({...p,kind:'mine'})),allPre=()=>PRESETS.map(p=>({...p,kind:'preset'}));
const findPlay=id=>allMine().concat(allPre()).find(p=>p.id===id);
const plural=(n,w)=>`${n} ${w}${n===1?'':'s'}`;
function cardHtml(p){
  const f=isFav(p.id);
  return `<article class="card" data-id="${p.id}"><div class="thumb">${thumb(p)}<button class="heart ${f?'on':''}" data-fav="${p.id}" aria-label="Favorite">${ic('heart',17,{fill:f,sw:2})}</button></div><div class="cmeta"><div><b>${esc(p.name)}</b><span>${p.court==='full'?'Full court':esc(p.cat)} · ${plural(p.steps.length,'step')}</span></div><button class="dots" data-more="${p.id}" aria-label="More">${ic('more',20)}</button></div></article>`;
}
function libScreen(){
  const cats=[['all','All'],['fav','Favorites'],...CATS.map(c=>[c,c])];
  main().innerHTML=`<div class="screen">
   <header class="lt"><h1>Plays</h1>${coach()?`<button class="cbtn solid" id="newp" aria-label="New play">${ic('plus',22,{sw:2.2})}</button>`:''}</header>
   <div class="lt-sub">${esc(store.team.name)}</div>
   <label class="search">${ic('search',18)}<input id="q" type="search" placeholder="Search" value="${esc(lib.q)}" autocomplete="off"></label>
   <div class="chips" id="filters"></div>
   <div id="plays"></div></div>`;
  const fl=()=>{$('#filters').innerHTML=cats.map(([k,l])=>`<button class="chip ${lib.cat===k?'on':''}" data-cat="${k}">${l}</button>`).join('');$$('[data-cat]').forEach(b=>b.onclick=()=>{lib.cat=b.dataset.cat;fl();list()})};
  const list=()=>{
    const q=lib.q.trim().toLowerCase(),mine=allMine(),pre=allPre();
    const filt=p=>(lib.cat==='all'||(lib.cat==='fav'?isFav(p.id):p.cat===lib.cat))&&(!q||(p.name+' '+p.cat).toLowerCase().includes(q));
    const m=mine.filter(filt),pr=pre.filter(filt),filtering=q||lib.cat!=='all';
    let mineHtml;
    if(m.length)mineHtml=`<div class="rail">${m.map(cardHtml).join('')}${coach()&&!filtering?`<button class="newtile" id="newt"><span class="plus">${ic('plus',22,{sw:2.2})}</span>New play</button>`:''}</div>`;
    else if(!mine.length&&coach()&&!filtering)mineHtml=`<div class="rail"><button class="newtile" id="newt" style="flex-basis:100%;min-height:120px"><span class="plus">${ic('plus',22,{sw:2.2})}</span>Draw your first play</button></div>`;
    else mineHtml=`<div class="empty"><b>${mine.length?'No matches':'Nothing here yet'}</b>${mine.length?'Try another filter.':'Plays you save will show up here.'}</div>`;
    $('#plays').innerHTML=`<h2 class="sec">My plays<span>${m.length}</span></h2>${mineHtml}<h2 class="sec">Presets<span>${pr.length}</span></h2><div class="grid">${pr.length?pr.map(cardHtml).join(''):`<div class="empty"><b>No matches</b>Try another filter.</div>`}</div>`;
    $$('#plays .card').forEach(c=>c.onclick=e=>{
      const fv=e.target.closest('[data-fav]'),mo=e.target.closest('[data-more]');
      if(fv){toggleFav(fv.dataset.fav);list();return}
      if(mo){playMenu(findPlay(mo.dataset.more));return}
      nav('viewer',{play:findPlay(c.dataset.id)});
    });
    const nt=$('#newt');if(nt)nt.onclick=newPlaySheet;
  };
  fl();list();
  $('#q').oninput=e=>{lib.q=e.target.value;list()};
  const nb=$('#newp');if(nb)nb.onclick=newPlaySheet;
}
function toggleFav(id){const i=store.favs.indexOf(id);if(i>=0)store.favs.splice(i,1);else store.favs.push(id);save()}
function playMenu(p,fromViewer){
  const f=isFav(p.id),c=coach();
  const row=(a,i,l,cls='')=>`<button class="li ${cls}" data-a="${a}">${ic(i,21)}<span class="tx">${l}</span></button>`;
  const el=sheet(`<h3>${esc(p.name)}</h3><p class="d">${p.kind==='mine'?'Your play':'Preset'} · ${plural(p.steps.length,'step')}</p>
   <div class="list">${fromViewer?'':row('open','play','Watch')}${row('fav','heart',f?'Remove from favorites':'Add to favorites')}${c&&p.kind==='mine'?row('edit','edit','Edit'):''}${c?row('dup','copy',p.kind==='mine'?'Duplicate':'Make a copy to edit'):''}</div>
   <div class="list">${amCoach()?row('team','users','Add to '+esc(curTeam().name)):''}${row('share','share','Share link')}${row('img','image','Save as image')}</div>
   ${c&&p.kind==='mine'?`<div class="list">${row('del','trash','Delete play','danger')}</div>`:''}`);
  $$('[data-a]',el).forEach(b=>b.onclick=()=>{const a=b.dataset.a;closeSheet();
    if(a==='open')nav('viewer',{play:p});
    if(a==='fav'){toggleFav(p.id);if(R.name==='lib')libScreen();else nav('viewer',Object.assign({},R))}
    if(a==='edit')openEditor(p);
    if(a==='dup')dupPlay(p);
    if(a==='share')sharePlay(p);
    if(a==='img')exportPng(p);
    if(a==='team')CL.savePlay(curTeam().id,{...normalize(p),id:null,authorName:C.profile.name}).then(()=>toast('Added to '+curTeam().name),()=>toast('Couldn’t add the play'));
    if(a==='del')confirmSheet({title:'Delete this play?',msg:'This can’t be undone.',ok:'Delete',danger:true,onOk:()=>{store.plays=store.plays.filter(x=>x.id!==p.id);store.favs=store.favs.filter(x=>x!==p.id);save();toast('Deleted');R.name==='viewer'?leave({name:'lib'}):libScreen()}});
  });
}
const favBtn=id=>`<button class="cbtn ${isFav(id)?'on':''}" id="fav" aria-label="Favorite">${ic('heart',20,{fill:isFav(id),sw:2})}</button>`;
function dupPlay(p){
  const c=normalize(p);c.id=uid();c.created=c.updated=Date.now();c.name=p.name+' (copy)';
  store.plays.unshift(c);save();toast(p.kind==='mine'?'Duplicated':'Added to My plays');
  if(R.name==='lib')libScreen();else leave({name:'lib'});
}
function newPlaySheet(target){
  let court='half';
  const mini=full=>`<svg class="mini" viewBox="0 0 500 ${full?940:470}">${courtSvg(full)}</svg>`;
  const el=sheet(`<h3>New play</h3><p class="d">Choose a court to draw on.</p>
   <button class="opt on" data-c="half">${mini(false)}<div><b>Half court</b><small>Set plays and offense</small></div></button>
   <button class="opt" data-c="full">${mini(true)}<div><b>Full court</b><small>Fast breaks and press breaks</small></div></button>
   <div class="list" style="margin:6px 0 16px"><label class="li"><span class="tx">Include defense<small>Defenders follow the offense</small></span><span class="sw"><input type="checkbox" id="df" checked><i></i></span></label></div>
   <button class="btn solid" id="go" style="width:100%">Start drawing</button>`);
  $$('[data-c]',el).forEach(b=>b.onclick=()=>{court=b.dataset.c;$$('[data-c]',el).forEach(x=>x.classList.toggle('on',x===b))});
  $('#go',el).onclick=()=>{const def=$('#df',el).checked;closeSheet();const full=court==='full',dy=full?470:0;
    const p=normalize({name:'',cat:full?'Transition':'Offense',court,ball:0,start:[S(250,370+dy),S(420,290+dy),S(80,290+dy),S(165,190+dy),S(335,190+dy)],steps:[newStep()]});
    if(def)genDefense(p);openEditor(p,target)};
}
function openEditor(p,target){
  target=target&&target.type?target:{type:'local'};
  const d=normalize(p);
  if(target.type==='local'){if(p.kind==='mine'){d.id=p.id;d.created=p.created}else{d.id=null;if(p.kind==='preset')d.name=p.name+' (copy)'}}
  else d.id=target.type==='team'&&p.kind==='team'?p.id:null;
  nav('editor',{draft:d,isNew:!d.id,target});
}

/* ============ viewer ============ */
function viewerScreen(){
  const v=R.version,orig=v?C.plays.find(p=>p.id===v.playId):null;
  const play=v?(R.showOrig&&orig?{...orig,kind:'team'}:{...normalize(v.play),kind:'version',name:v.playName}):R.play;
  const N=play.steps.length,full=play.court==='full',hasD=play.start.length>5,shared=play.kind==='shared',team=!!v||play.kind==='team',tok=viewTok;
  let T=0,playing=false,stopAt=null,last=0,hold=0,speed=store.settings.speed,loop=store.settings.loop,showD=hasD;
  const canEdit=coach()&&!shared;
  const mineV=!!(v&&C.user&&v.authorUid===C.user.uid);
  const metaTxt=v?`${mineV?'Your version':esc(v.authorName)+'’s version'} · ${STATUS[v.status]}`:shared?'Shared with you':R.fromEditor?'Preview':play.kind==='team'?'Team play':play.kind==='mine'?'My play':'Preset';
  let acts='';
  if(R.fromEditor)acts=`<button class="btn solid" id="backed">Back to editor</button>`;
  else if(v){if(mineV)acts=`<button class="btn" id="vedit">${ic('edit',19)}Edit</button><button class="btn solid" id="vsub" ${v.status==='submitted'?'disabled':''}>${v.status==='submitted'?'Submitted':'Submit to coach'}</button>`;
    else if(amCoach())acts=`<button class="btn solid" id="vfb">${ic('edit',19)}${v.feedback?'Edit feedback':'Give feedback'}</button>`}
  else if(play.kind==='team'){
    if(amCoach())acts=`<button class="btn solid" id="tedit">${ic('edit',19)}Edit play</button><button class="btn sq" id="share" aria-label="Share">${ic('share',20)}</button>`;
    else{const mv=C.versions.find(x=>x.playId===play.id&&x.authorUid===C.user?.uid);acts=`<button class="btn solid" id="mkv">${ic(mv?'eye':'plus',19)}${mv?'Open my version':'Make my version'}</button>`}}
  else acts=`${canEdit?`<button class="btn solid" id="edit">${ic('edit',19)}${play.kind==='mine'?'Edit play':'Make a copy'}</button>`:shared?`<button class="btn solid" id="edit">${ic('plus',19)}Save to my plays</button>`:''}<button class="btn ${canEdit||shared?'sq':''}" id="share" aria-label="Share">${ic('share',20)}${canEdit||shared?'':'Share'}</button>`;
  main().innerHTML=`<div class="screen">
   <div class="bar"><button class="cbtn" id="back" aria-label="Back">${ic('back',22,{sw:2.2})}</button><div class="grp">${shared||R.fromEditor||team?'':favBtn(play.id)}${v?'':`<button class="cbtn" id="more" aria-label="More">${ic('more',20)}</button>`}</div></div>
   <div class="title">${esc(play.name||'Untitled')}</div>
   <div class="meta">${metaTxt} · ${full?'Full court':'Half court'} · ${plural(N,'step')}</div>
   ${v&&orig?`<div class="seg full" style="margin:-4px 0 14px"><button data-vo="v" class="${R.showOrig?'':'on'}">${mineV?'My version':'Their version'}</button><button data-vo="o" class="${R.showOrig?'on':''}">Coach’s original</button></div>`:''}
   <div class="stage ${full?'fullc':''}" id="stage" style="background:${cp().bg}"><svg id="sv" viewBox="0 0 500 ${hOf(play)}">${defs()}${courtSvg(full)}<g id="paths"></g><g id="dyn"></g></svg><div class="badge" id="badge"></div></div>
   <div class="note" id="note"></div>
   <div class="segs" id="segs">${play.steps.map((_,i)=>`<button data-k="${i}" aria-label="Step ${i+1}"><i><b></b></i></button>`).join('')}</div>
   <div class="transport"><button class="round" id="prev" aria-label="Previous step">${ic('prev',22)}</button><button class="play" id="pp" aria-label="Play"></button><button class="round" id="next" aria-label="Next step">${ic('next',22)}</button></div>
   <div class="ctrls"><div class="seg" id="spd">${[.5,1,2].map(v=>`<button class="${speed===v?'on':''}" data-s="${v}">${v}×</button>`).join('')}</div>
    <div class="toggles"><button class="tg ${loop?'on':''}" id="loop" aria-label="Loop">${ic('repeat',18)}</button>${hasD?`<button class="tg ${showD?'on':''}" id="dtog" aria-label="Show defense">${ic('shield',18)}</button>`:''}<button class="tg" id="pres" aria-label="Full screen">${ic('full',18)}</button></div></div>
   ${v&&v.feedback?`<div class="about fbcard"><h4>Coach feedback</h4><p>${esc(v.feedback)}</p></div>`:''}
   ${play.desc?`<div class="about"><h4>About this play</h4><p>${esc(play.desc)}</p></div>`:''}
   <div class="actions">${acts}</div>
  </div>`;
  const dyn=$('#dyn'),paths=$('#paths'),note=$('#note'),pp=$('#pp'),badge=$('#badge');
  let lastIcon='';
  function draw(){
    const st=stateAt(play,T),k=st.step,n=play.steps[k];
    paths.innerHTML=stepArrows(play,k,showD);
    let s='';if(showD)for(let i=5;i<st.pos.length;i++)s+=pl(st.pos[i],i);
    for(let i=0;i<5;i++)s+=pl(st.pos[i],i);
    dyn.innerHTML=s+ballSvg(st.ball);
    note.innerHTML=`<small>Step ${k+1} of ${N}</small><p>${esc(n.note||'Watch how everyone moves.')}</p>`;
    badge.textContent=T>=N?'Done':`${k+1} / ${N}`;
    $$('#segs b').forEach((b,i)=>{b.style.width=(Math.max(0,Math.min(1,T-i))*100)+'%'});
    const icon=playing?'pause':(T>=N?'repeat':'play');
    if(icon!==lastIcon){pp.innerHTML=icon==='repeat'?ic('repeat',28,{sw:2.2}):ic(icon,30);pp.setAttribute('aria-label',icon);lastIcon=icon}
  }
  function tick(t){
    if(!playing||tok!==viewTok)return;
    const dt=Math.min(.05,Math.max(0,(t-last)/1000)||0);last=t;
    if(hold>t){draw();anim=requestAnimationFrame(tick);return}
    const s=Math.max(0,Math.min(Math.floor(T)||0,N-1));T+=dt*speed/(play.steps[s].dur||1.9);
    if(stopAt!=null&&T>=stopAt){T=stopAt;playing=false;stopAt=null}
    else if(T>=N){if(loop){T=N;hold=t+700;draw();setTimeout(()=>{if(playing&&tok===viewTok)T=0},700)}else{T=N;playing=false}}
    draw();if(playing)anim=requestAnimationFrame(tick);
  }
  function start(){stopAnim();if(T>=N)T=0;playing=true;last=performance.now();anim=requestAnimationFrame(tick);draw()}
  function stop(){playing=false;stopAt=null;stopAnim();draw()}
  pp.onclick=()=>playing?stop():start();
  $('#next').onclick=()=>{if(T>=N)T=0;stopAnim();const s=Math.min(Math.floor(T),N-1);stopAt=Math.min(N,s+1);start()};
  $('#prev').onclick=()=>{stop();const s=Math.min(Math.floor(T),N-1);T=(T-s>.05&&T<N)?s:Math.max(0,s-1);draw()};
  $$('#segs button').forEach(b=>b.onclick=()=>{stop();T=+b.dataset.k;draw()});
  $$('#spd [data-s]').forEach(b=>b.onclick=()=>{speed=+b.dataset.s;store.settings.speed=speed;save();$$('#spd [data-s]').forEach(x=>x.classList.toggle('on',x===b))});
  $('#loop').onclick=e=>{loop=!loop;store.settings.loop=loop;save();e.currentTarget.classList.toggle('on',loop)};
  const dt=$('#dtog');if(dt)dt.onclick=()=>{showD=!showD;dt.classList.toggle('on',showD);draw()};
  $('#pres').onclick=()=>{const st=$('#stage');(st.requestFullscreen||st.webkitRequestFullscreen||(()=>toast('Full screen isn’t supported here'))).call(st)};
  const goBack=()=>{if(R.fromEditor){stopAnim();nav('editor',{draft:R.fromEditor,isNew:R.fromNew,dirty:R.dirty,target:R.fromTarget})}else leave({name:R.tab})};
  $('#back').onclick=goBack;const be=$('#backed');if(be)be.onclick=goBack;
  const bindFav=()=>{const fv=$('#fav');if(fv)fv.onclick=()=>{toggleFav(play.id);fv.outerHTML=favBtn(play.id);bindFav()}};bindFav();
  const mo=$('#more');if(mo)mo.onclick=()=>shared?sharePlay(play):R.fromEditor?toast('Save the play to share it'):play.kind==='team'?teamPlayMenu(play):playMenu(play,true);
  const on=(id,f)=>{const e=$('#'+id);if(e)e.onclick=f};
  $$('[data-vo]').forEach(b=>b.onclick=()=>nav('viewer',Object.assign({},R,{showOrig:b.dataset.vo==='o'})));
  on('vedit',()=>openEditor({...normalize(v.play),name:v.playName,kind:'version'},{type:'version',teamId:R.teamId,vid:v.id,playId:v.playId,playName:v.playName,feedback:v.feedback||''}));
  on('vsub',()=>submitVersion(R.teamId,v));
  on('vfb',()=>feedbackSheet(R.teamId,v));
  on('tedit',()=>openEditor(play,{type:'team',teamId:R.teamId}));
  on('mkv',()=>{const mv=C.versions.find(x=>x.playId===play.id&&x.authorUid===C.user.uid);
    if(mv)nav('viewer',{version:mv,teamId:R.teamId});
    else openEditor(play,{type:'version',teamId:R.teamId,vid:play.id+'_'+C.user.uid,playId:play.id,playName:play.name,feedback:''})});
  const sh=$('#share');if(sh)sh.onclick=()=>sharePlay(play);
  const eb=$('#edit');if(eb)eb.onclick=()=>{
    if(shared){const c=normalize(play);c.id=uid();c.created=c.updated=Date.now();store.plays.unshift(c);save();toast('Saved to My plays');nav('viewer',{play:{...c,kind:'mine'}})}
    else openEditor(play);
  };
  draw();setTimeout(()=>{if(!playing&&T===0&&tok===viewTok)start()},380);
}

/* ============ share / export ============ */
function shareUrl(p){
  const data=btoa(unescape(encodeURIComponent(JSON.stringify({name:p.name,cat:p.cat,desc:p.desc,court:p.court,ball:p.ball,start:p.start,steps:p.steps}))));
  return location.href.split('#')[0]+'#p='+data;
}
function sharePlay(p){
  const url=shareUrl(p);
  if(navigator.share){navigator.share({title:p.name||'Play',text:`Play: ${p.name}`,url}).catch(()=>{});return}
  const el=sheet(`<h3>Share link</h3><p class="d">Anyone with this link can watch the play and save a copy.</p><input class="field" id="lk" readonly value="${esc(url)}"><div style="margin-top:12px"><button class="btn solid" id="cp" style="width:100%">Copy link</button></div>`);
  $('#lk',el).onfocus=e=>e.target.select();
  $('#cp',el).onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(url):Promise.reject()).then(()=>{toast('Link copied');closeSheet()},()=>{$('#lk',el).select();toast('Press Ctrl/Cmd+C')})};
}
async function exportPng(p){
  try{
    const full=p.court==='full',H=hOf(p),st=p.steps.length,c=cp();
    let s='';p.steps.forEach((_,k)=>{s+=stepArrows(p,k,true)});
    for(let i=p.start.length-1;i>=5;i--)s+=pl(p.start[i],i);
    for(let i=0;i<5;i++)s+=pl(p.start[i],i,{flat:1});
    s+=ballSvg(ballOff(p.start[p.ball]));
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${H*2}" viewBox="0 0 500 ${H}"><style>text{font-family:-apple-system,"Segoe UI",Roboto,sans-serif}</style>${defs()}${courtSvg(full)}${s}</svg>`;
    const img=new Image();img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);await img.decode();
    const lines=p.steps.map((x,i)=>x.note?`${i+1}.  ${x.note}`:'').filter(Boolean).slice(0,4);
    const W=1080,pad=40,cv=document.createElement('canvas');cv.width=W;cv.height=H*2+250+lines.length*48;const g=cv.getContext('2d');
    g.fillStyle='#f5f5f7';g.fillRect(0,0,W,cv.height);
    g.fillStyle='#0a0a0b';g.font='700 60px -apple-system,"Segoe UI",Roboto,sans-serif';g.fillText(p.name||'Play',pad,98);
    g.fillStyle='#6e6e73';g.font='500 30px -apple-system,"Segoe UI",Roboto,sans-serif';g.fillText(`${store.team.name} · ${plural(st,'step')}`,pad,144);
    const y0=180,r=36;g.save();g.beginPath();g.roundRect(pad,y0,1000,H*2,r);g.clip();g.fillStyle=c.bg;g.fillRect(pad,y0,1000,H*2);g.drawImage(img,pad,y0,1000,H*2);g.restore();
    g.fillStyle='#0a0a0b';g.font='500 30px -apple-system,"Segoe UI",Roboto,sans-serif';let y=y0+H*2+66;lines.forEach(t=>{g.fillText(t.slice(0,60),pad,y);y+=48});
    const blob=await new Promise(r=>cv.toBlob(r,'image/png'));
    const file=new File([blob],(p.name||'play').replace(/[^\w]+/g,'-')+'.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:p.name}).catch(()=>{})}
    else{download(file.name,blob);toast('Image saved')}
  }catch(e){toast('Couldn’t make the image')}
}

/* ============ editor ============ */
function editorScreen(){
  const d=R.draft,full=d.court==='full',H=hOf(d),W=500,RAD=22;
  let cur=-1,tool='move',dirty=!!R.dirty,undo=[],redo=[],drag=null;
  const tg=R.target&&R.target.type?R.target:{type:'local'};
  const keepDraft=()=>{if(tg.type!=='local')return;try{localStorage.setItem('playbook.draft',JSON.stringify({d,isNew:R.isNew}))}catch(e){}};
  const snap=()=>{undo.push(clone(d));if(undo.length>60)undo.shift();redo=[];dirty=true;keepDraft()};
  const hint=()=>{
    if(tool==='pass')return cur<0?'Tap the player who starts with the ball':'Tap who gets the pass. Tap again to remove it';
    if(cur<0)return 'Drag players to where they line up';
    return {move:'Drag a player to move them to a new spot',cut:'Drag a player to where they cut hard',drib:'Drag the ball handler to show a dribble',scr:'Drag a player to where they set a screen'}[tool];
  };
  main().innerHTML=`<div class="screen">
   <div class="bar"><button class="tbtn" id="back">Cancel</button><div class="grp"><button class="cbtn" id="un" aria-label="Undo">${ic('undo',19)}</button><button class="cbtn" id="re" aria-label="Redo">${ic('redo',19)}</button><button class="pill-btn" id="save">Save</button></div></div>
   <input class="namein" id="nm" placeholder="Untitled play" maxlength="50" value="${esc(d.name)}" ${tg.type==='version'?'readonly':''}>
   ${tg.type==='team'?`<div class="meta" style="margin:0">Team play · ${esc(curTeam()?.name||'')}</div>`:tg.type==='version'?`<div class="meta" style="margin:0">Your version · your coach sees it when you submit</div>`:''}
   <div class="steps" id="steps"></div>
   <div class="steptip" id="steptip" hidden>Hold a step and drag it to reorder</div>
   <div class="stage ${full?'fullc':''}" id="stage" style="background:${cp().bg}"><svg id="sv" viewBox="0 0 ${W} ${H}">${defs()}${courtSvg(full)}<g id="lay"></g></svg><div class="badge" id="badge"></div></div>
   <div class="hint" id="hint"></div>
   <div id="stepui"></div>
   <div class="actions"><button class="btn" id="prev">${ic('play',17)}Preview</button><button class="btn" id="det">Details</button></div>
  </div>
  <div class="dock"><div class="dock-in" id="dock"></div></div>`;
  const sv=$('#sv'),lay=$('#lay');
  function paintStage(){
    const a=posAt(d,Math.max(cur,0)),n=d.start.length;let s='';
    if(cur<0){d.steps.forEach((_,k)=>{s+=stepArrows(d,k,true,{op:.25})})}
    else{s+=stepArrows(d,cur,true);for(const i in d.steps[cur].moves)s+=pl(d.steps[cur].moves[i],+i,{ghost:1,r:20})}
    const mv=cur>=0?d.steps[cur].moves:{};
    for(let i=n-1;i>=5;i--)s+=pl(a[i],i,{op:mv[i]?.45:1});
    for(let i=0;i<5;i++)s+=pl(a[i],i,{op:mv[i]?.45:1});
    s+=ballSvg(ballOff(a[cur<0?d.ball:holderAt(d,cur)]));
    lay.innerHTML=s;
    $('#badge').textContent=cur<0?'Start':`Step ${cur+1}`;
  }
  function paintSteps(){
    $('#steps').innerHTML=`<button class="chip ${cur<0?'on':''}" data-c="-1">Start</button>`+d.steps.map((_,i)=>`<button class="chip ${cur===i?'on':''}" data-c="${i}">${i+1}</button>`).join('')+`<button class="chip add" id="addstep">+ Add step</button>`;
    $$('#steps [data-c]').forEach(b=>{
      const i=+b.dataset.c;
      b.onclick=()=>{if(chipDragged){chipDragged=false;return}cur=i;refresh()};
      if(i>=0&&d.steps.length>1){b.onpointerdown=e=>chipDrag(e,b,i);b.addEventListener('touchmove',ev=>{if(cd&&cd.on)ev.preventDefault()},{passive:false})}
    });
    $('#addstep').onclick=()=>{snap();d.steps.push(newStep());cur=d.steps.length-1;refresh();$('#steps').scrollLeft=9999};
    $('#steptip').hidden=d.steps.length<2;
  }
  // Reorder steps: drag a step chip (mouse) or press and hold, then drag (touch).
  let cd=null,chipDragged=false;
  function moveStep(from,to){
    if(to<0||to>=d.steps.length||to===from)return;
    snap();const [s]=d.steps.splice(from,1);d.steps.splice(to,0,s);
    d.steps.forEach((st,k)=>{if(st.pass!=null&&st.pass===holderAt(d,k))st.pass=null});
    cur=to;refresh();
  }
  function chipDrag(e,b,i){
    const touch=e.pointerType!=='mouse';
    cd={b,i,x0:e.clientX,y0:e.clientY,on:false,t:i};
    const begin=()=>{if(!cd)return;cd.on=true;b.classList.add('dragging');cd.chips=$$('#steps [data-c]').filter(x=>+x.dataset.c>=0);cd.rects=cd.chips.map(x=>x.getBoundingClientRect());cd.w=cd.rects[i].width+8;if(navigator.vibrate)try{navigator.vibrate(8)}catch(_){}};
    const timer=touch?setTimeout(begin,280):null;
    const move=ev=>{
      if(!cd)return;const dx=ev.clientX-cd.x0;
      if(!cd.on){if(Math.hypot(dx,ev.clientY-cd.y0)>8){if(touch)return stop(false);begin()}else return}
      b.style.transform=`translateX(${dx}px)`;
      const cx=cd.rects[i].left+cd.rects[i].width/2+dx;
      cd.t=cd.rects.filter((r,k)=>k!==i&&r.left+r.width/2<cx).length;
      cd.chips.forEach((c,k)=>{if(k===i)return;c.style.transform=k>i&&k<=cd.t?`translateX(${-cd.w}px)`:k<i&&k>=cd.t?`translateX(${cd.w}px)`:''});
    };
    const stop=commit=>{
      clearTimeout(timer);removeEventListener('pointermove',move);removeEventListener('pointerup',up);removeEventListener('pointercancel',cancel);
      const c=cd;cd=null;if(!c||!c.on)return;
      chipDragged=true;setTimeout(()=>chipDragged=false,0);
      c.chips.forEach(x=>x.style.transform='');b.classList.remove('dragging');
      if(commit&&c.t!==i)moveStep(i,c.t);
    };
    const up=()=>stop(true),cancel=()=>stop(false);
    addEventListener('pointermove',move);addEventListener('pointerup',up);addEventListener('pointercancel',cancel);
  }
  function paintStepUi(){
    const el=$('#stepui');
    if(cur<0){el.innerHTML='';return}
    const st=d.steps[cur];
    el.innerHTML=`<div class="group"><input class="in" id="nt" placeholder="Add a note for this step" maxlength="160" value="${esc(st.note)}">
     <div class="row"><button id="sl" class="narrow" aria-label="Move step earlier" ${cur===0?'disabled':''}>${ic('back',18,{sw:2.2})}</button><button id="sr" class="narrow" aria-label="Move step later" ${cur===d.steps.length-1?'disabled':''}>${ic('chev',18,{sw:2.2})}</button><button id="sdup">${ic('copy',17)}Duplicate</button><button id="sclr">${ic('clear',17)}Clear</button><button id="sdel" class="danger" ${d.steps.length<2?'disabled':''}>${ic('trash',17)}Delete</button></div></div>`;
    $('#nt').oninput=e=>{d.steps[cur].note=e.target.value;dirty=true;keepDraft()};
    $('#nt').onfocus=()=>{undo.push(clone(d));redo=[]};
    $('#sl').onclick=()=>moveStep(cur,cur-1);$('#sr').onclick=()=>moveStep(cur,cur+1);
    $('#sdup').onclick=()=>{snap();d.steps.splice(cur+1,0,clone(st));cur++;refresh();toast('Step duplicated')};
    $('#sclr').onclick=()=>{snap();st.moves={};st.pass=null;refresh()};
    $('#sdel').onclick=()=>confirmSheet({title:`Delete step ${cur+1}?`,msg:'Its moves and note will be removed.',ok:'Delete step',danger:true,onOk:()=>{snap();d.steps.splice(cur,1);cur=Math.min(cur,d.steps.length-1);refresh()}});
  }
  function paintDock(){
    const T=[['move','Move',GLYPH.move],['cut','Cut',GLYPH.cut],['drib','Dribble',GLYPH.drib],['scr','Screen',GLYPH.scr],['pass',cur<0?'Ball':'Pass',cur<0?'<span class="balldot"></span>':GLYPH.pass]];
    $('#dock').innerHTML=T.map(([k,l,g])=>`<button class="tool ${tool===k?'on':''}" data-t="${k}">${g}${l}</button>`).join('');
    $$('#dock [data-t]').forEach(b=>b.onclick=()=>{tool=b.dataset.t;paintDock();$('#hint').innerHTML=ic('info',16)+hint()});
  }
  function refresh(){paintSteps();paintStepUi();paintDock();paintStage();$('#hint').innerHTML=ic('info',16)+hint();$('#un').disabled=!undo.length;$('#re').disabled=!redo.length}
  const pt=e=>{const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(sv.getScreenCTM().inverse());return{x:Math.max(RAD,Math.min(W-RAD,p.x)),y:Math.max(RAD,Math.min(H-RAD,p.y))}};
  sv.onpointerdown=e=>{
    const g=e.target.closest('.player');if(!g)return;const i=+g.dataset.i;e.preventDefault();
    if(tool==='pass'){
      if(i>=5)return toast('Passes go to teammates');
      if(cur<0){snap();d.ball=i}
      else{const h=holderAt(d,cur);if(i===h)return toast('They already have the ball');snap();d.steps[cur].pass=d.steps[cur].pass===i?null:i}
      refresh();return;
    }
    drag={i,x0:e.clientX,y0:e.clientY,moved:false};sv.setPointerCapture(e.pointerId);
  };
  sv.onpointermove=e=>{
    if(!drag)return;
    if(!drag.moved){if(Math.hypot(e.clientX-drag.x0,e.clientY-drag.y0)<8)return;drag.moved=true;snap()}
    const p=pt(e);if(cur<0)d.start[drag.i]={x:p.x,y:p.y};else d.steps[cur].moves[drag.i]={x:p.x,y:p.y,t:tool};
    paintStage();
  };
  const end=()=>{
    if(!drag)return;
    if(!drag.moved&&cur>=0){const m=d.steps[cur].moves[drag.i];if(m){snap();if(m.t===tool)delete d.steps[cur].moves[drag.i];else m.t=tool}}
    else if(drag.moved&&cur>=0){const a=posAt(d,cur)[drag.i],m=d.steps[cur].moves[drag.i];if(m&&Math.hypot(m.x-a.x,m.y-a.y)<26)delete d.steps[cur].moves[drag.i]}
    drag=null;keepDraft();refresh();
  };
  sv.onpointerup=end;sv.onpointercancel=end;
  $('#nm').oninput=e=>{d.name=e.target.value;dirty=true;keepDraft()};
  $('#un').onclick=()=>{if(!undo.length)return;redo.push(clone(d));Object.assign(d,undo.pop());if(cur>=d.steps.length)cur=d.steps.length-1;refresh()};
  $('#re').onclick=()=>{if(!redo.length)return;undo.push(clone(d));Object.assign(d,redo.pop());if(cur>=d.steps.length)cur=d.steps.length-1;refresh()};
  let saving=false;
  const doSave=async()=>{
    if(saving)return;
    d.name=($('#nm').value||'').trim()||'Untitled play';d.updated=Date.now();
    const out=normalize(d);
    if(tg.type==='local'){
      out.id=d.id||uid();out.created=d.created||Date.now();out.updated=d.updated;
      const i=store.plays.findIndex(p=>p.id===out.id);if(i>=0)store.plays[i]=out;else store.plays.unshift(out);
      save();localStorage.removeItem('playbook.draft');dirty=false;toast('Saved');leave({name:R.tab});return;
    }
    saving=true;$('#save').textContent='Saving…';
    try{
      if(tg.type==='team'){await CL.savePlay(tg.teamId,{...out,id:d.id||null,authorName:C.profile?.name||''});dirty=false;toast('Saved to team');teamUI.seg='plays';leave({name:'team'})}
      else{
        await CL.saveVersion(tg.teamId,{id:tg.vid,playId:tg.playId,playName:tg.playName,authorUid:C.user.uid,authorName:C.profile.name,play:out,status:'draft',feedback:tg.feedback||'',updated:Date.now()});
        dirty=false;teamUI.seg='subs';leave({name:'team'});
        setTimeout(()=>confirmSheet({title:'Send it to your coach?',msg:'Your coach will see your version next to the original and can leave feedback.',ok:'Submit',cancel:'Not yet',onOk:()=>submitVersion(tg.teamId,{id:tg.vid})}),450);
      }
    }catch(e){console.warn(e);toast('Couldn’t save. Check your connection.');saving=false;$('#save').textContent='Save'}
  };
  const ask=()=>confirmSheet({title:'Save changes?',msg:'You have unsaved edits to this play.',ok:'Save',extra:'Discard changes',cancel:'Keep editing',onOk:doSave,onExtra:()=>{localStorage.removeItem('playbook.draft');dirty=false;leave({name:R.tab})}});
  R.api={dirty:()=>dirty,ask};
  $('#back').onclick=()=>dirty?ask():(localStorage.removeItem('playbook.draft'),leave({name:R.tab}));
  $('#save').onclick=doSave;
  $('#prev').onclick=()=>{d.name=$('#nm').value||'Untitled play';const p=normalize(d);p.kind='mine';p.id=d.id||'draft';nav('viewer',{play:p,fromEditor:d,fromNew:R.isNew,fromTarget:tg,dirty})};
  $('#det').onclick=()=>{
    const el=sheet(`<h3>Details</h3>
     <label class="flabel">Category</label><select class="field" id="cat">${CATS.map(c=>`<option ${d.cat===c?'selected':''}>${c}</option>`).join('')}</select>
     <label class="flabel">Description</label><textarea class="field" id="ds" placeholder="When to run it and what to look for">${esc(d.desc)}</textarea>
     <div class="list" style="margin:16px 0 10px"><label class="li"><span class="tx">Show defense<small>Defenders follow the offense</small></span><span class="sw"><input type="checkbox" id="df" ${d.start.length>5?'checked':''}><i></i></span></label>
     <button class="li" id="ad" ${d.start.length>5?'':'hidden'}><span class="tx">Reset defenders</span>${ic('chev',18)}</button></div>
     <button class="btn solid" id="dn" style="width:100%">Done</button>`);
    $('#df',el).onchange=e=>{snap();if(e.target.checked)genDefense(d);else dropDefense(d);$('#ad',el).hidden=!e.target.checked;refresh()};
    $('#ad',el).onclick=()=>{snap();genDefense(d);refresh();toast('Defenders reset')};
    $('#dn',el).onclick=()=>{d.cat=$('#cat',el).value;d.desc=$('#ds',el).value.slice(0,400);dirty=true;keepDraft();closeSheet()};
  };
  refresh();
}

/* ============ team (cloud) ============ */
const C={ready:false,demo:false,user:null,profile:null,teams:[],teamId:localStorage.getItem('pb.team')||null,plays:[],versions:[],un:[],unT:null,key:null};
let teamUI={seg:'plays',editProfile:false};
const STATUS={draft:'Draft',submitted:'Submitted',reviewed:'Reviewed'};
const curTeam=()=>C.teams.find(t=>t.id===C.teamId)||null;
const amCoach=()=>{const t=curTeam();return !!(t&&C.user&&t.coachUid===C.user.uid)};
const profileDone=()=>!!(C.profile&&C.profile.name&&C.profile.age);
const ago=ts=>{if(!ts)return'';const s=(Date.now()-ts)/1000;return s<60?'just now':s<3600?Math.floor(s/60)+'m ago':s<86400?Math.floor(s/3600)+'h ago':Math.floor(s/86400)+'d ago'};
const initials=n=>String(n||'?').trim().split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
function refreshCloud(){if(R.name!=='team')return;const a=document.activeElement;if(a&&a.matches&&a.matches('input,textarea')&&a.closest('#main'))return;teamScreen()}
function cloudBoot(){
  makeCloud().then(cl=>{window.CL=cl;C.ready=true;C.demo=cl.demo;
    cl.onAuth(async u=>{C.user=u;C.profile=null;if(u){try{C.profile=await cl.getProfile(u.uid)}catch(e){}}watchTeams();refreshCloud();pendingJoin()});
  }).catch(e=>{console.warn(e);C.ready=true;refreshCloud()});
}
function watchTeams(){
  if(C.unT){C.unT();C.unT=null}
  if(!C.user){C.teams=[];watchTeamData();return}
  C.unT=CL.watchMyTeams(C.user.uid,teams=>{
    C.teams=teams.sort((a,b)=>(a.created||0)-(b.created||0));
    if(!curTeam())C.teamId=C.teams[0]?.id||null;
    localStorage.setItem('pb.team',C.teamId||'');watchTeamData();refreshCloud();
  });
}
function watchTeamData(){
  const t=curTeam(),key=t?t.id+':'+amCoach():null;if(key===C.key)return;C.key=key;
  C.un.forEach(f=>f());C.un=[];C.plays=[];C.versions=[];
  if(!t)return;
  C.un.push(CL.watchPlays(t.id,ps=>{C.plays=ps.map(p=>Object.assign(normalize(p),{id:p.id,updated:p.updated,authorName:p.authorName||''})).sort((a,b)=>(b.updated||0)-(a.updated||0));refreshCloud()}));
  C.un.push(CL.watchVersions(t.id,{coach:amCoach(),uid:C.user.uid},vs=>{C.versions=vs.sort((a,b)=>(b.updated||0)-(a.updated||0));refreshCloud()}));
}
function selectTeam(id){C.teamId=id;localStorage.setItem('pb.team',id);teamUI.seg='plays';watchTeamData();if(R.name==='team')teamScreen();else nav('team')}
async function pendingJoin(){
  const code=localStorage.getItem('pb.join');if(!code||!C.user||!profileDone())return;
  let inv=null;try{inv=await CL.findInvite(code)}catch(e){}
  if(!inv){localStorage.removeItem('pb.join');toast('No team found for code '+code);return}
  if(C.teams.some(t=>t.id===inv.teamId)){localStorage.removeItem('pb.join');selectTeam(inv.teamId);return}
  confirmSheet({title:`Join ${inv.teamName}?`,msg:`${inv.coachName} invited you. You’ll see the team’s plays and can send your coach your own versions.`,ok:'Join team',cancel:'Not now',
    onOk:async()=>{try{await CL.joinTeam(C.user.uid,inv.teamId,C.profile);localStorage.removeItem('pb.join');C.teamId=inv.teamId;localStorage.setItem('pb.team',inv.teamId);toast(`You joined ${inv.teamName}`);watchTeamData();if(R.name==='team')teamScreen();else nav('team')}catch(e){console.warn(e);toast('Couldn’t join. Try again.')}},
    onCancel:()=>localStorage.removeItem('pb.join')});
}
function joinCode(code){code=String(code||'').trim().toUpperCase().replace(/[^A-Z0-9]/g,'');if(code.length<4)return toast('Enter the 6-character team code');localStorage.setItem('pb.join',code);pendingJoin()}
const inviteUrl=t=>location.origin+location.pathname+'?join='+t.code;
const GOOGLE='<svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
function signIn(){
  if(!window.CL)return toast('One moment…');
  if(CL.demo){
    const el=sheet(`<h3>Demo sign-in</h3><p class="d">Firebase isn’t connected yet, so this stands in for Google sign-in. Use different names to try being a coach and a player.</p><input class="field" id="dn" placeholder="Your name" maxlength="30"><button class="btn solid" id="dgo" style="width:100%;margin-top:12px">Continue</button>`);
    const go=()=>{const n=$('#dn',el).value.trim();if(!n)return;closeSheet();CL.signIn(n)};
    $('#dgo',el).onclick=go;$('#dn',el).onkeydown=e=>{if(e.key==='Enter')go()};setTimeout(()=>$('#dn',el).focus(),300);return;
  }
  CL.signIn().catch(e=>{console.warn(e);toast('Sign-in didn’t work. Try again.')});
}
function teamArt(){
  const pts=[[110,160],[250,104],[390,160],[175,236],[325,236]];
  return `<svg viewBox="0 0 500 300" style="display:block;width:100%;height:auto">${defs()}${courtSvg(false)}${moveSvg({x:175,y:236},{x:250,y:128},'cut',false)}${passSvg({x:110,y:160},{x:250,y:104})}${pts.map((p,i)=>pl({x:p[0],y:p[1]},i,{noname:1})).join('')}</svg>`;
}
function teamScreen(){
  const head=(t,sub,right='')=>`<header class="lt"><h1>${t}</h1>${right}</header>${sub?`<div class="lt-sub">${sub}</div>`:''}`;
  const demo=C.demo?`<div class="demo">${ic('info',16)}<span>Demo mode: team data stays on this device until Firebase is connected.</span></div>`:'';
  const pj=localStorage.getItem('pb.join');
  if(!C.ready){main().innerHTML=`<div class="screen">${head('Team')}<div class="empty"><b>Loading…</b></div></div>`;return}
  if(!C.user){
    main().innerHTML=`<div class="screen">${head('Team','Plays for your whole team')}
     ${pj?`<div class="joining">${ic('users',18)}<span>You’re joining a team (code <b>${esc(pj)}</b>). Sign in to continue.</span></div>`:''}
     <div class="hero"><div class="hero-art" style="background:${cp().bg}">${teamArt()}</div><div class="hero-body">
      <h3>Coach and players, together</h3>
      <ul class="ticks"><li>Coaches share plays with the team</li><li>Players make their own version</li><li>Submit it and get feedback</li></ul>
      <button class="gbtn" id="gsi">${GOOGLE}<span>Continue with Google</span></button></div></div>${demo}</div>`;
    $('#gsi').onclick=signIn;return;
  }
  if(!profileDone()||teamUI.editProfile){
    const p=C.profile||{};
    main().innerHTML=`<div class="screen">${head('Your profile','Your coach sees your name and age.')}
     <div class="list"><label class="li"><span class="tx" style="flex:none;width:70px">Name</span><input id="pn" maxlength="30" placeholder="First and last name" value="${esc(p.name||C.user.name||'')}" style="flex:1;text-align:right"></label>
     <label class="li"><span class="tx" style="flex:none;width:70px">Age</span><input id="pa" type="number" inputmode="numeric" min="5" max="99" placeholder="Age" value="${esc(p.age||'')}" style="flex:1;text-align:right"></label></div>
     <div class="foot">Signed in as ${esc(C.user.email)}</div>
     <button class="btn solid" id="psave" style="width:100%;margin-top:20px">${teamUI.editProfile?'Save':'Continue'}</button>
     <button class="btn ghost" id="pout" style="width:100%;margin-top:6px">${teamUI.editProfile?'Cancel':'Sign out'}</button></div>`;
    $('#psave').onclick=async()=>{const name=$('#pn').value.trim(),age=parseInt($('#pa').value,10);
      if(!name)return toast('Add your name');if(!(age>=5&&age<=99))return toast('Add your age');
      try{await CL.saveProfile(C.user.uid,{name,age,email:C.user.email});C.profile={...(C.profile||{}),name,age};teamUI.editProfile=false;teamScreen();pendingJoin()}catch(e){toast('Couldn’t save. Try again.')}};
    $('#pout').onclick=()=>{if(teamUI.editProfile){teamUI.editProfile=false;teamScreen()}else CL.signOut()};return;
  }
  const t=curTeam();
  if(!t){
    main().innerHTML=`<div class="screen">${head('Team',`Hi ${esc(C.profile.name.split(' ')[0])}`)}
     <div class="card2"><div class="c2h"><span class="c2i">${ic('users',20)}</span><div><b>Join your team</b><small>Enter the code from your coach</small></div></div>
      <div class="coderow"><input id="jc" class="codein" maxlength="6" placeholder="ABC123" autocapitalize="characters" autocomplete="off" value="${esc(pj||'')}"><button class="pill-btn" id="jgo">Join</button></div></div>
     <div class="card2"><div class="c2h"><span class="c2i">${ic('plus',20)}</span><div><b>Create a team</b><small>You’ll be the coach and get an invite link</small></div></div>
      <div class="coderow"><input id="tn" class="field" maxlength="30" placeholder="Team name"><button class="pill-btn" id="tgo">Create</button></div></div>
     ${demo}<button class="btn ghost" id="pout" style="width:100%;margin-top:14px">Sign out</button></div>`;
    $('#jgo').onclick=()=>joinCode($('#jc').value);
    $('#tgo').onclick=()=>createTeam($('#tn').value);
    $('#pout').onclick=()=>CL.signOut();return;
  }
  const coachMe=amCoach();
  const members=Object.entries(t.members||{}).map(([uid,m])=>({uid,...m})).sort((a,b)=>((a.role==='coach'?0:1)-(b.role==='coach'?0:1))||String(a.name).localeCompare(b.name));
  const players=members.filter(m=>m.role!=='coach').length;
  const subs=coachMe?C.versions.filter(v=>v.status!=='draft'):C.versions,fresh=coachMe?subs.filter(v=>v.status==='submitted').length:0;
  const segs=[['plays','Plays'],['subs',coachMe?(fresh?`Inbox · ${fresh}`:'Inbox'):'My versions'],['members','Members']];
  if(!segs.some(s=>s[0]===teamUI.seg))teamUI.seg='plays';
  let body='';
  if(teamUI.seg==='plays'){
    const mineV=id=>C.versions.find(v=>v.playId===id&&v.authorUid===C.user.uid);
    body=`<div class="grid">${coachMe?`<button class="newtile" id="addp"><span class="plus">${ic('plus',22,{sw:2.2})}</span>Add play</button>`:''}${C.plays.map(p=>{const v=!coachMe&&mineV(p.id);return `<article class="card" data-tp="${p.id}"><div class="thumb">${thumb(p)}${v?`<span class="tag ${v.status} on-thumb">${STATUS[v.status]}</span>`:''}</div><div class="cmeta"><div><b>${esc(p.name)}</b><span>${plural(p.steps.length,'step')}${p.updated?' · '+ago(p.updated):''}</span></div></div></article>`}).join('')}
     ${!C.plays.length&&!coachMe?`<div class="empty"><b>No plays yet</b>Your coach hasn’t shared any plays.</div>`:''}</div>`;
  }else if(teamUI.seg==='subs'){
    body=subs.length?`<div class="list">${subs.map(v=>`<button class="li vrow" data-v="${v.id}"><span class="vthumb">${thumb(normalize(v.play))}</span><span class="tx"><b>${esc(coachMe?v.authorName:v.playName)}</b><small>${coachMe?esc(v.playName)+' · ':''}${ago(v.submittedAt||v.updated)}</small>${v.feedback&&!coachMe?`<small class="fb">Coach: “${esc(v.feedback.slice(0,80))}”</small>`:''}</span><span class="tag ${v.status}">${STATUS[v.status]}</span></button>`).join('')}</div>`
      :`<div class="empty"><b>${coachMe?'No submissions yet':'No versions yet'}</b>${coachMe?'When a player submits their version of a play, it shows up here.':'Open a team play and tap “Make my version”.'}</div>`;
  }else{
    body=`<div class="list">${members.map(m=>`<div class="li"><span class="av ${m.role==='coach'?'coach':''}">${esc(initials(m.name))}</span><span class="tx"><b style="font-weight:600">${esc(m.name)}${m.uid===C.user.uid?' (you)':''}</b><small>${m.role==='coach'?'Coach':'Player'}${m.age?' · Age '+esc(m.age):''}</small></span>${coachMe&&m.role!=='coach'?`<button class="tbtn" data-rm="${m.uid}" style="font-size:15px;color:var(--danger)">Remove</button>`:''}</div>`).join('')}</div>`;
  }
  main().innerHTML=`<div class="screen">
   ${head(esc(t.name),`${coachMe?'You’re the coach':'Coached by '+esc(t.coachName)} · ${plural(players,'player')}`,`<button class="cbtn" id="tmenu" aria-label="Team options">${ic('more',20)}</button>`)}
   ${coachMe?`<div class="invite"><div><small>Team code</small><b>${esc(t.code)}</b></div><button class="pill-btn" id="inv">Invite players</button></div>`:''}
   <div class="seg full" style="margin:4px 0 18px">${segs.map(([k,l])=>`<button data-seg="${k}" class="${teamUI.seg===k?'on':''}">${l}</button>`).join('')}</div>
   ${body}${demo}</div>`;
  $$('[data-seg]').forEach(b=>b.onclick=()=>{teamUI.seg=b.dataset.seg;teamScreen()});
  $('#tmenu').onclick=teamMenu;
  const inv=$('#inv');if(inv)inv.onclick=()=>inviteSheet(t);
  const ap=$('#addp');if(ap)ap.onclick=()=>addTeamPlaySheet(t);
  $$('[data-tp]').forEach(c=>c.onclick=()=>{const p=C.plays.find(x=>x.id===c.dataset.tp);if(p)nav('viewer',{play:{...p,kind:'team'},teamId:t.id})});
  $$('[data-v]').forEach(b=>b.onclick=()=>{const v=C.versions.find(x=>x.id===b.dataset.v);if(v)nav('viewer',{version:v,teamId:t.id})});
  $$('[data-rm]').forEach(b=>b.onclick=()=>{const m=members.find(x=>x.uid===b.dataset.rm);confirmSheet({title:`Remove ${m.name}?`,msg:'They’ll lose access to the team’s plays. You can invite them again later.',ok:'Remove',danger:true,onOk:()=>CL.removeMember(t.id,m.uid).then(()=>toast('Removed'),()=>toast('Couldn’t remove'))})});
}
async function createTeam(name){
  name=String(name||'').trim();if(!name)return toast('Name your team');
  try{const id=await CL.createTeam(C.user.uid,{name,profile:C.profile});C.teamId=id;localStorage.setItem('pb.team',id);toast('Team created');watchTeamData();teamScreen()}catch(e){console.warn(e);toast('Couldn’t create the team')}
}
function inviteSheet(t){
  const url=inviteUrl(t);
  const el=sheet(`<h3>Invite players</h3><p class="d">Send this link to your players. It walks them through adding the app to their home screen, signing in with Google and joining your team.</p>
   <div class="bigcode">${esc(t.code)}</div>
   <input class="field" id="lk" readonly value="${esc(url)}">
   <div style="display:grid;gap:10px;margin-top:12px">${navigator.share?`<button class="btn solid" id="shr">${ic('share',18)}Share invite</button>`:''}<button class="btn ${navigator.share?'':'solid'}" id="cpy">${ic('copy',18)}Copy link</button></div>`);
  $('#lk',el).onfocus=e=>e.target.select();
  const sh=$('#shr',el);if(sh)sh.onclick=()=>navigator.share({title:`Join ${t.name} on Playbook`,text:`Join ${t.name} on Playbook. Team code: ${t.code}`,url}).catch(()=>{});
  $('#cpy',el).onclick=()=>{(navigator.clipboard?navigator.clipboard.writeText(url):Promise.reject()).then(()=>toast('Invite link copied'),()=>{$('#lk',el).select();toast('Press Ctrl/Cmd+C')})};
}
function addTeamPlaySheet(t){
  const row=(k,id,name,sub)=>`<button class="li" data-k="${k}" data-id="${id}"><span class="tx">${esc(name)}<small>${esc(sub)}</small></span>${ic('plus',18)}</button>`;
  const el=sheet(`<h3>Add a play</h3><p class="d">Everyone on ${esc(t.name)} will see it right away.</p>
   <div class="list"><button class="li" id="np">${ic('edit',20)}<span class="tx">Draw a new play</span>${ic('chev',18)}</button></div>
   ${store.plays.length?`<div class="gl" style="margin-top:18px">From my plays</div><div class="list">${store.plays.map(p=>row('mine',p.id,p.name,plural(p.steps.length,'step'))).join('')}</div>`:''}
   <div class="gl" style="margin-top:18px">From presets</div><div class="list">${PRESETS.map(p=>row('pre',p.id,p.name,p.cat)).join('')}</div>`);
  $('#np',el).onclick=()=>{closeSheet();newPlaySheet({type:'team',teamId:t.id})};
  $$('[data-k]',el).forEach(b=>b.onclick=async()=>{const src=(b.dataset.k==='mine'?store.plays:PRESETS).find(p=>p.id===b.dataset.id);closeSheet();
    try{await CL.savePlay(t.id,{...normalize(src),id:null,authorName:C.profile.name});toast('Added to team')}catch(e){console.warn(e);toast('Couldn’t add the play')}});
}
function teamMenu(){
  const t=curTeam(),coachMe=amCoach();
  const el=sheet(`<h3>${esc(t.name)}</h3><p class="d">Signed in as ${esc(C.profile.name)}</p>
   ${C.teams.length>1?`<div class="list">${C.teams.map(x=>`<button class="li" data-team="${x.id}"><span class="tx">${esc(x.name)}<small>${x.coachUid===C.user.uid?'Coach':'Player'}</small></span>${x.id===t.id?ic('check',18,{sw:2.4}):''}</button>`).join('')}</div>`:''}
   <div class="list"><button class="li" id="jt">${ic('users',20)}<span class="tx">Join another team</span></button><button class="li" id="ct">${ic('plus',20)}<span class="tx">Create a team</span></button><button class="li" id="ep">${ic('edit',20)}<span class="tx">Edit my profile</span></button><button class="li" id="lu">${ic('grid',20)}<span class="tx">Court labels and roster</span></button></div>
   <div class="list">${coachMe?'':`<button class="li danger" id="lv">${ic('x',20)}<span class="tx">Leave team</span></button>`}<button class="li danger" id="so">${ic('back',20)}<span class="tx">Sign out</span></button></div>`);
  $$('[data-team]',el).forEach(b=>b.onclick=()=>{closeSheet();selectTeam(b.dataset.team)});
  $('#jt',el).onclick=()=>{const s=sheet(`<h3>Join a team</h3><p class="d">Enter the code from your coach.</p><div class="coderow"><input id="jc" class="codein" maxlength="6" placeholder="ABC123" autocapitalize="characters"><button class="pill-btn" id="jgo">Join</button></div>`);$('#jgo',s).onclick=()=>{const v=$('#jc',s).value;closeSheet();joinCode(v)}};
  $('#ct',el).onclick=()=>{const s=sheet(`<h3>Create a team</h3><p class="d">You’ll be the coach.</p><div class="coderow"><input id="tn" class="field" maxlength="30" placeholder="Team name"><button class="pill-btn" id="tgo">Create</button></div>`);$('#tgo',s).onclick=()=>{const v=$('#tn',s).value;closeSheet();createTeam(v)}};
  $('#ep',el).onclick=()=>{closeSheet();teamUI.editProfile=true;teamScreen()};
  $('#lu',el).onclick=rosterSheet;
  const lv=$('#lv',el);if(lv)lv.onclick=()=>confirmSheet({title:`Leave ${t.name}?`,msg:'You can rejoin later with the team code.',ok:'Leave team',danger:true,onOk:()=>CL.removeMember(t.id,C.user.uid).then(()=>toast('You left the team'),()=>toast('Couldn’t leave'))});
  $('#so',el).onclick=()=>{closeSheet();CL.signOut()};
}
function rosterSheet(){
  const t=store.team,s=store.settings;
  const el=sheet(`<h3>Court labels</h3><p class="d">Choose what shows on each player.</p>
   <div class="seg full" style="margin-bottom:16px">${[['num','1–5'],['jersey','Jersey #'],['name','Name']].map(([k,l])=>`<button data-l="${k}" class="${s.labels===k?'on':''}">${l}</button>`).join('')}</div>
   <div class="list">${t.roster.map((r,i)=>`<div class="li"><span class="num">${i+1}</span><input data-r="${i}" data-k="name" maxlength="14" placeholder="Player name" value="${esc(r.name)}" style="flex:1"><input class="jersey" data-r="${i}" data-k="n" inputmode="numeric" maxlength="3" placeholder="#" value="${esc(r.n)}"></div>`).join('')}</div>
   <button class="btn solid" id="rd" style="width:100%">Done</button>`);
  $$('[data-l]',el).forEach(b=>b.onclick=()=>{s.labels=b.dataset.l;save();$$('[data-l]',el).forEach(x=>x.classList.toggle('on',x===b))});
  $$('[data-r]',el).forEach(i=>i.oninput=()=>{t.roster[+i.dataset.r][i.dataset.k]=i.value;save()});
  $('#rd',el).onclick=()=>{closeSheet();if(R.name==='team')teamScreen()};
}
function submitVersion(teamId,v){
  CL.updateVersion(teamId,v.id,{status:'submitted',submittedAt:Date.now()}).then(()=>{toast('Sent to your coach');teamUI.seg='subs';if(R.name==='viewer')leave({name:'team'})},()=>toast('Couldn’t submit. Try again.'));
}
function feedbackSheet(teamId,v){
  const el=sheet(`<h3>Feedback for ${esc(v.authorName)}</h3><p class="d">On their version of ${esc(v.playName)}.</p><textarea class="field" id="fbt" maxlength="500" placeholder="What did they get right? What should change?">${esc(v.feedback||'')}</textarea><button class="btn solid" id="fbs" style="width:100%;margin-top:12px">Send feedback</button>`);
  setTimeout(()=>$('#fbt',el).focus(),300);
  $('#fbs',el).onclick=()=>{const fb=$('#fbt',el).value.trim();if(!fb)return toast('Write some feedback first');closeSheet();
    CL.updateVersion(teamId,v.id,{feedback:fb,status:'reviewed',reviewedAt:Date.now()}).then(()=>{toast('Feedback sent');leave({name:'team'})},()=>toast('Couldn’t send'))};
}
function teamPlayMenu(p){
  const coachMe=amCoach();
  const el=sheet(`<h3>${esc(p.name)}</h3><p class="d">Team play</p><div class="list"><button class="li" data-a="share">${ic('share',21)}<span class="tx">Share link</span></button><button class="li" data-a="img">${ic('image',21)}<span class="tx">Save as image</span></button>${coachMe?`<button class="li" data-a="copy">${ic('copy',21)}<span class="tx">Copy to my plays</span></button>`:''}</div>${coachMe?`<div class="list"><button class="li danger" data-a="del">${ic('trash',21)}<span class="tx">Remove from team</span></button></div>`:''}`);
  $$('[data-a]',el).forEach(b=>b.onclick=()=>{const a=b.dataset.a;closeSheet();
    if(a==='share')sharePlay(p);if(a==='img')exportPng(p);
    if(a==='copy'){const c=normalize(p);c.id=uid();c.created=c.updated=Date.now();store.plays.unshift(c);save();toast('Copied to My plays')}
    if(a==='del')confirmSheet({title:'Remove this play?',msg:'It will be removed for everyone on the team. Player versions stay.',ok:'Remove',danger:true,onOk:()=>CL.deletePlay(R.teamId,p.id).then(()=>{toast('Removed');leave({name:'team'})},()=>toast('Couldn’t remove'))});
  });
}

/* ============ install ============ */
let bip=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();bip=e});
window.addEventListener('appinstalled',()=>{bip=null;toast('Playbook installed')});
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=()=>/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const isMobile=()=>isIOS()||/android/i.test(navigator.userAgent);
const installUrl=()=>location.origin+location.pathname+'?install=1';
function installSheet(fromJoin){
  const code=localStorage.getItem('pb.join');
  if(standalone()){const el=sheet(`<h3>You’re all set</h3><p class="d">Playbook is already installed on this device.</p><button class="btn solid" id="ok" style="width:100%">Done</button>`);$('#ok',el).onclick=()=>closeSheet();return}
  const step=(n,html)=>`<li><span class="sn">${n}</span><span>${html}</span></li>`;
  let body;
  if(bip)body=`<p class="d" style="text-align:center">Add it to your home screen. It opens full screen like any other app and works offline.</p><button class="btn solid" id="ins" style="width:100%">${ic('download',18)}Install Playbook</button>`;
  else if(isIOS()){
    const other=/CriOS|FxiOS|EdgiOS/.test(navigator.userAgent);
    body=`<p class="d" style="text-align:center">iPhone doesn’t let websites install themselves, so it takes three taps.</p>
     <ol class="steps3">${step(1,`Tap <b>Share</b> <span class="kbd">${ic('share',14)}</span> ${other?'next to the address bar':'in the Safari toolbar'}`)}${step(2,`Scroll down and tap <b>Add to Home Screen</b>`)}${step(3,'Tap <b>Add</b>')}</ol>
     ${code?`<div class="codebox">Then open Playbook from your home screen, sign in, and enter team code <b>${esc(code)}</b>.</div>`:''}`;
  }
  else body=`<p class="d" style="text-align:center">Open your browser menu <span class="kbd">${ic('more',14)}</span> and choose <b>Install app</b> or <b>Add to Home screen</b>.</p>`;
  const el=sheet(`<div class="appicon"><img src="icon-192.png" alt=""></div><h3 style="text-align:center">Get the Playbook app</h3>${body}<button class="btn ghost" id="later" style="width:100%;margin-top:6px">${fromJoin?'Continue in browser':'Not now'}</button>`);
  const ins=$('#ins',el);if(ins)ins.onclick=async()=>{const p=bip;bip=null;closeSheet();if(!p)return;p.prompt();const r=await p.userChoice.catch(()=>({}));if(r.outcome==='accepted')toast('Installing…')};
  $('#later',el).onclick=()=>closeSheet();
}

/* ============ settings ============ */
function setScreen(){
  const s=store.settings;
  const seg=(k,opts)=>`<div class="seg full">${opts.map(([v,l])=>`<button data-set="${k}" data-val="${v}" class="${s[k]===v?'on':''}">${l}</button>`).join('')}</div>`;
  main().innerHTML=`<div class="screen">
   <header class="lt"><h1>Settings</h1></header>
   <div class="gl">I’m a</div>${seg('mode',[['coach','Coach'],['player','Player']])}
   <div class="foot">${s.mode==='coach'?'Create, edit and share plays.':'Watch and step through plays. Editing is turned off.'}</div>
   <div class="gl">Appearance</div>${seg('theme',[['system','Automatic'],['light','Light'],['dark','Dark']])}
   <div class="gl">Court</div>
   <div class="courts">${Object.entries(COURTS).map(([k,c])=>`<button class="court-opt ${s.court===k?'on':''}" data-set="court" data-val="${k}"><svg viewBox="0 0 500 300">${courtSvg(false,k)}<circle cx="190" cy="240" r="24" fill="${ACC}"/><circle cx="320" cy="200" r="22" fill="${c.deff}" stroke="${c.def}" stroke-width="3"/></svg><span>${c.n}</span></button>`).join('')}</div>
   <div class="gl">App</div>
   <div class="list">
    <button class="li" id="inst">${ic('download',20)}<span class="tx">${standalone()?'Installed on this device':'Add to home screen'}</span>${ic('chev',18)}</button>
    <button class="li" id="instl">${ic('share',20)}<span class="tx">Share install link<small>Opens the setup steps on any phone</small></span>${ic('chev',18)}</button>
   </div>
   <div class="gl">Your data</div>
   <div class="list">
    <button class="li" id="exp">${ic('download',20)}<span class="tx">Export backup</span>${ic('chev',18)}</button>
    <button class="li" id="imp">${ic('upload',20)}<span class="tx">Import backup</span>${ic('chev',18)}</button>
   </div>
   <div class="foot">Plays are saved on this device. Use Share or a backup to move them to another phone.</div>
   <div class="list" style="margin-top:22px"><button class="li danger" id="rst">${ic('trash',20)}<span class="tx">Erase all data</span></button></div>
   <input type="file" id="file" accept="application/json,.json" hidden>
  </div>`;
  $$('[data-set]').forEach(b=>b.onclick=()=>{s[b.dataset.set]=b.dataset.val;save();applySettings();setScreen();tabbar()});
  $('#exp').onclick=()=>{download('playbook-backup.json',new Blob([JSON.stringify({app:'playbook',v:2,plays:store.plays,team:store.team,favs:store.favs},null,1)],{type:'application/json'}));toast('Backup saved')};
  $('#imp').onclick=()=>$('#file').click();
  $('#inst').onclick=()=>installSheet();
  $('#instl').onclick=()=>{const url=installUrl();if(navigator.share)navigator.share({title:'Get Playbook',url}).catch(()=>{});else (navigator.clipboard?navigator.clipboard.writeText(url):Promise.reject()).then(()=>toast('Install link copied'),()=>prompt('Copy this link',url))};
  $('#file').onchange=async e=>{
    try{const j=JSON.parse(await e.target.files[0].text());let n=0;
      (j.plays||[]).forEach(p=>{const c=keepMeta(normalize(p),{id:p.id||uid(),created:p.created||Date.now(),updated:Date.now()});if(!store.plays.some(x=>x.id===c.id)){store.plays.push(c);n++}});
      (j.favs||[]).forEach(f=>{if(!store.favs.includes(f))store.favs.push(f)});
      save();toast(`Imported ${plural(n,'play')}`)}catch(err){toast('That isn’t a Playbook backup')}
    e.target.value='';
  };
  $('#rst').onclick=()=>confirmSheet({title:'Erase all data?',msg:'All plays, favorites and settings on this device will be deleted. Export a backup first if you might need them.',ok:'Erase everything',danger:true,onOk:()=>{localStorage.removeItem('playbook.v2');localStorage.removeItem('playbook.draft');loadStore();applySettings();nav('lib');toast('Erased')}});
}

/* ============ boot ============ */
(function boot(){
  loadStore();applySettings();
  const qs=new URLSearchParams(location.search);
  const join=(qs.get('join')||(location.hash.match(/^#join=(\w+)/)||[])[1]||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  const wantInstall=qs.has('install')||location.hash==='#install';
  if(join)localStorage.setItem('pb.join',join);
  if(join||wantInstall)history.replaceState(null,'',location.pathname);
  const hm=location.hash.match(/^#p=(.+)$/);
  if(hm){
    try{const p=normalize(JSON.parse(decodeURIComponent(escape(atob(hm[1])))));p.kind='shared';p.id='shared';history.replaceState(null,'',location.pathname+location.search);nav('viewer',{play:p,tab:'lib'})}
    catch(e){nav('lib');toast('That link looks broken')}
  }else if(join){
    nav('team');
    if(isMobile()&&!standalone())setTimeout(()=>installSheet(true),500);
  }else{
    nav('lib');
    if(wantInstall)setTimeout(()=>installSheet(),400);
    let dr=null;try{dr=JSON.parse(localStorage.getItem('playbook.draft'))}catch(e){}
    if(dr&&dr.d&&coach())confirmSheet({title:'Resume your play?',msg:`“${dr.d.name||'Untitled play'}” wasn’t saved last time.`,ok:'Resume',cancel:'Discard',onOk:()=>nav('editor',{draft:Object.assign(normalize(dr.d),{id:dr.d.id||null,created:dr.d.created}),isNew:dr.isNew,dirty:true}),onCancel:()=>localStorage.removeItem('playbook.draft')});
  }
  cloudBoot();
  if('serviceWorker' in navigator&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
