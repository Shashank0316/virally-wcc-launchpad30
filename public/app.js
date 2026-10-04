const state = { result:null, agents:[], trends:[], history:[], research:null };
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function scoreClass(v){return v>=78?'score-good':v>=62?'score-mid':'score-low';}
function setTab(tab){
  $$('.app-nav').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
  $$('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${tab}`));
  const names={dashboard:'Dashboard',simulate:'Simulate',agents:'Agents',trends:'Trends',research:'Product Research',method:'Methodology'};
  $('#tabTitle').textContent=names[tab]||tab;
  document.getElementById('app').scrollIntoView({behavior:'smooth',block:'start'});
}

async function api(path, options){
  const res = await fetch(path, options);
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error||'Request failed');
  return data;
}

function renderDashboard(){
  const r=state.result;
  const cards=$$('.metric-card');
  const values=r ? [r.score, `${(r.metrics.reachIndex/100).toFixed(1)}×`, `${r.metrics.shareRate}%`, `${r.metrics.purchaseIntent}%`] : ['—','—','—','—'];
  const notes=r ? [r.verdict, 'projected amplification index', 'share intent across agents', 'scenario estimate'] : ['Run a simulation','Directionally estimated','Across 18 personas','Scenario estimate'];
  cards.forEach((c,i)=>{c.querySelector('strong').textContent=values[i];c.querySelector('small').textContent=notes[i]});
  $('#verdictPill').textContent=r ? `${r.verdict} · ${r.confidence}% confidence` : 'No run yet';
  if(!r){$('#donutChart').classList.add('empty');$('#donutChart').style.background='';$('#donutChart .donut-center b').textContent='—';$('#actionLegend').innerHTML='';$('#drivers').innerHTML='<p>Run a simulation to reveal the strongest drivers.</p>';$('#drivers').className='driver-list empty-state';return;}
  $('#donutChart').classList.remove('empty');
  const counts=['Like','Comment','Share','Save','Skip'].map(k=>r.actions[k]||0); const total=counts.reduce((a,b)=>a+b,0)||1;
  const p1=counts[0]/total*100,p2=p1+counts[1]/total*100,p3=p2+counts[2]/total*100,p4=p3+counts[3]/total*100;
  $('#donutChart').style.background=`conic-gradient(#8d78ff 0 ${p1}%,#69d99c ${p1}% ${p2}%,#f0b469 ${p2}% ${p3}%,#e5767d ${p3}% ${p4}%,#3c414a ${p4}% 100%)`;
  $('#donutChart .donut-center b').textContent=r.personas.length;
  const colors=['#8d78ff','#69d99c','#f0b469','#e5767d','#3c414a'];
  $('#actionLegend').innerHTML=['Like','Comment','Share','Save','Skip'].map((k,i)=>`<span><i style="background:${colors[i]}"></i>${k} ${r.actions[k]||0}</span>`).join('');
  const drivers=[['Reach fit',r.metrics.reachIndex],['Engagement',r.metrics.engagement],['Purchase intent',r.metrics.purchaseIntent],['Trust',r.metrics.trust],['Trend fit',Math.round(r.personas.reduce((a,b)=>a+b.trendFit,0)/r.personas.length*100)]];
  $('#drivers').className='driver-list'; $('#drivers').innerHTML=drivers.map(([k,v])=>`<div class="driver"><span>${k}</span><div class="bar"><i style="width:${Math.min(100,v)}%"></i></div><b>${v}</b></div>`).join('');
}
function renderHistory(){
  const rows=[...state.history].reverse().slice(0,7);
  $('#historyTable').innerHTML='<div class="history-row history-head"><span>Concept</span><span>Score</span><span>Reach</span><span>Verdict</span></div>'+ (rows.length?rows.map(x=>`<div class="history-row"><span>${esc(x.name)}</span><span class="${scoreClass(x.score)}">${x.score}</span><span>${Number(x.reach||0)}%</span><span>${esc(x.verdict)}</span></div>`).join(''):'<div class="history-row"><span>No simulations yet</span><span>—</span><span>—</span><span>—</span></div>');
}
function renderAgents(filter=''){
  const q=filter.toLowerCase().trim(); const list=state.agents.filter(a=>!q || `${a.name} ${a.archetype} ${a.interests.join(' ')}`.toLowerCase().includes(q));
  $('#agentGrid').innerHTML=list.map(a=>{const r=state.result?.personas?.find(x=>x.id===a.id); return `<article class="agent-card"><div class="agent-top"><div class="avatar">${a.emoji}</div><span class="muted">${r?`Top: ${esc(r.topAction)}`:a.age}</span></div><h3>${esc(a.name)}</h3><div class="archetype">${esc(a.archetype)}</div><p>${esc(r?r.rationale:a.habits.join(' · '))}</p><div class="trait-list">${Object.entries(a.traits).map(([k,v])=>`<div class="trait"><span>${k}</span><b>${Math.round(v*100)}</b></div>`).join('')}</div>${r?`<div class="trait" style="margin-top:8px"><span>Purchase intent</span><b class="${scoreClass(Math.round(r.scores.purchaseIntent*100))}">${Math.round(r.scores.purchaseIntent*100)}</b></div>`:''}</article>`}).join('');
}
function renderResearch(){
  const r=state.research; if(!r)return;
  $('#researchObjective').textContent=r.objective;
  $('#researchSourceCount').textContent=r.competitors.length;
  $('#researchMethods').innerHTML=r.methods.map((m,i)=>`<div class="research-item"><span>0${i+1}</span><div><strong>${esc(m.name)}</strong><p>${esc(m.detail)}</p></div></div>`).join('');
  $('#researchFindings').innerHTML=r.findings.map(f=>`<div class="research-item"><span>●</span><div><strong>${esc(f.title)}</strong><p>${esc(f.detail)}</p></div></div>`).join('');
  $('#competitorGrid').innerHTML=r.competitors.map(c=>`<article class="competitor-card"><div class="trend-meta"><span>${esc(c.category)}</span></div><h3>${esc(c.name)}</h3><p>${esc(c.angle)}</p><a href="${esc(c.source)}" target="_blank" rel="noreferrer">View source ↗</a></article>`).join('');
  $('#productDecisions').innerHTML=r.productDecisions.map(x=>`<div class="decision-row"><span>✓</span><p>${esc(x)}</p></div>`).join('');
  $('#researchLimitation').textContent=r.limitation;
  $('#validationQuestions').innerHTML=r.validationQuestions.map((q,i)=>`<div class="question-row"><b>0${i+1}</b><span>${esc(q)}</span></div>`).join('');
}
function renderTrends(){
  $('#trendGrid').innerHTML=state.trends.map(t=>`<article class="trend-card"><div class="trend-meta"><span>${esc(t.category)}</span><span>Momentum ${Math.round(t.momentum*100)}</span></div><h3>${esc(t.name)}</h3><div class="momentum"><i style="width:${Math.round(t.momentum*100)}%"></i></div><p>${esc(t.note)}</p></article>`).join('');
}
function showResultStrip(r){
  $('#resultStrip').classList.remove('hidden');
  $('#resultStrip').innerHTML=`<div class="result-strip-grid"><div class="result-main"><strong>${r.score}/100</strong><span>${esc(r.verdict)} · ${r.confidence}% model confidence</span></div><div class="result-stat"><span>Reach</span><b>${r.metrics.reachIndex}%</b></div><div class="result-stat"><span>Share</span><b>${r.metrics.shareRate}%</b></div><div class="result-stat"><span>Intent</span><b>${r.metrics.purchaseIntent}%</b></div><div class="result-stat"><span>Top trend</span><b style="font-size:11px">${esc(r.topTrends[0]?.name||'—')}</b></div></div>`;
}

async function loadData(){
  try{const [a,t,h,r]=await Promise.all([api('/api/agents'),api('/api/trends'),api('/api/history'),api('/api/research')]);state.agents=a.agents;state.trends=t.trends;state.history=h.history;state.research=r.research;renderAgents();renderTrends();renderHistory();renderResearch();}catch(e){console.error(e)}
}

$$('[data-scroll]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.getElementById(a.dataset.scroll)?.scrollIntoView({behavior:'smooth'});}));
$$('[data-open-app]').forEach(b=>b.addEventListener('click',()=>setTab('simulate')));
$$('[data-tab]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
$('#agentSearch').addEventListener('input',e=>renderAgents(e.target.value));
$('#demoBtn').addEventListener('click',()=>{ $('#idea').value='A 10 minute AI meal planner for college students that builds weekly meals under a fixed budget'; $('#creative').value='Open on a student staring at an empty fridge. The app asks for budget and dietary preferences, instantly builds a weekly plan, then shows the grocery list and the total cost on screen. CTA: try your first plan free.'; $('#audience').value='College students in India'; $('#channel').value='short form social'; window.scrollTo({top:document.getElementById('app').offsetTop,behavior:'smooth'}); });
$('#resetBtn').addEventListener('click',()=>{state.result=null;renderDashboard();setTab('dashboard');});
$('#simulateForm').addEventListener('submit',async e=>{
  e.preventDefault(); const btn=$('#runBtn'); btn.disabled=true; btn.innerHTML='Simulating 18 agents… <span>⟳</span>';
  try{
    const body={idea:$('#idea').value,creative:$('#creative').value,audience:$('#audience').value,channel:$('#channel').value};
    if(!body.idea.trim()){alert('Add a business idea first.');return;}
    const r=await api('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    state.result=r; renderAgents($('#agentSearch').value); state.history.push({id:r.id,createdAt:r.createdAt,name:r.input.idea.slice(0,30),score:r.score,verdict:r.verdict,reach:r.metrics.reachIndex,shares:r.metrics.shareRate});
    renderDashboard(); renderHistory(); showResultStrip(r); setTab('dashboard');
  }catch(err){alert(err.message)}finally{btn.disabled=false;btn.innerHTML='Run 18 agent simulation <span>→</span>';}
});

const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12});
$$('.section-reveal').forEach(x=>revealObs.observe(x));
const pipelineObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){$$('.pipeline-node').forEach((n,i)=>setTimeout(()=>n.classList.add('active'),i*120));}}),{threshold:.25});
pipelineObs.observe($('#pipeline'));
let ticking=false; window.addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const y=window.scrollY;$$('.parallax').forEach(el=>{const d=Number(el.dataset.depth||.1);el.style.transform=`translate3d(0,${y*d*-0.15}px,0)`});ticking=false;});},{passive:true});
loadData(); renderDashboard();
