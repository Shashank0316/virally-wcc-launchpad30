const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const url = require('url');

const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const DATA = path.join(ROOT, 'data');
const HISTORY_FILE = path.join(DATA, 'history.json');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';

const agents = [
  { id:'a01', name:'Maya Chen', archetype:'Trend Hunter', age:24, interests:['creator economy','wellness','design'], traits:{novelty:0.92, social:0.84, price:0.48, trust:0.61, utility:0.70, visual:0.95}, habits:['discovers via short video','shares tools with friends'], emoji:'◒' },
  { id:'a02', name:'Arjun Rao', archetype:'Pragmatic Buyer', age:31, interests:['productivity','finance','software'], traits:{novelty:0.45, social:0.34, price:0.83, trust:0.88, utility:0.91, visual:0.52}, habits:['checks proof before purchase','compares alternatives'], emoji:'◑' },
  { id:'a03', name:'Lena Ortiz', archetype:'Community Connector', age:28, interests:['communities','music','events'], traits:{novelty:0.71, social:0.97, price:0.55, trust:0.73, utility:0.62, visual:0.76}, habits:['comments with context','invites friends into new communities'], emoji:'◓' },
  { id:'a04', name:'Theo Williams', archetype:'Skeptical Analyst', age:39, interests:['security','business','data'], traits:{novelty:0.28, social:0.16, price:0.58, trust:0.98, utility:0.89, visual:0.37}, habits:['looks for edge cases','reads the fine print'], emoji:'◔' },
  { id:'a05', name:'Priya Nair', archetype:'Value Seeker', age:26, interests:['shopping','lifestyle','savings'], traits:{novelty:0.57, social:0.63, price:0.95, trust:0.76, utility:0.74, visual:0.68}, habits:['waits for offers','recommends good value'], emoji:'◕' },
  { id:'a06', name:'Noah Kim', archetype:'Early Adopter', age:22, interests:['AI','gaming','gadgets'], traits:{novelty:0.98, social:0.67, price:0.32, trust:0.55, utility:0.81, visual:0.89}, habits:['tries products before friends','posts first impressions'], emoji:'◒' },
  { id:'a07', name:'Sofia Petrova', archetype:'Visual Storyteller', age:30, interests:['fashion','travel','photography'], traits:{novelty:0.80, social:0.82, price:0.50, trust:0.66, utility:0.55, visual:0.99}, habits:['judges the first three seconds','saves visual references'], emoji:'◓' },
  { id:'a08', name:'Ethan Brooks', archetype:'Routine Optimizer', age:35, interests:['fitness','workflows','family'], traits:{novelty:0.39, social:0.45, price:0.79, trust:0.83, utility:0.94, visual:0.43}, habits:['keeps what saves time','abandons complex onboarding'], emoji:'◔' },
  { id:'a09', name:'Aisha Khan', archetype:'Culture Scanner', age:27, interests:['culture','beauty','creator trends'], traits:{novelty:0.86, social:0.91, price:0.41, trust:0.64, utility:0.61, visual:0.90}, habits:['spots emerging language','shares culturally relevant ideas'], emoji:'◕' },
  { id:'a10', name:'Mateo Silva', archetype:'Impulse Explorer', age:25, interests:['food','apps','entertainment'], traits:{novelty:0.88, social:0.88, price:0.66, trust:0.51, utility:0.49, visual:0.85}, habits:['acts on curiosity','likes playful hooks'], emoji:'◒' },
  { id:'a11', name:'Grace Lee', archetype:'Trust Guardian', age:42, interests:['family','finance','privacy'], traits:{novelty:0.25, social:0.24, price:0.62, trust:0.99, utility:0.92, visual:0.32}, habits:['needs transparent claims','avoids manipulative messaging'], emoji:'◑' },
  { id:'a12', name:'Samir Patel', archetype:'Growth Mindset', age:29, interests:['startups','marketing','tools'], traits:{novelty:0.78, social:0.74, price:0.60, trust:0.82, utility:0.86, visual:0.72}, habits:['experiments with new tools','tracks outcomes'], emoji:'◓' },
  { id:'a13', name:'Ivy Laurent', archetype:'Minimalist', age:33, interests:['design','productivity','home'], traits:{novelty:0.64, social:0.38, price:0.76, trust:0.84, utility:0.88, visual:0.93}, habits:['prefers simple products','dislikes clutter'], emoji:'◔' },
  { id:'a14', name:'Daniel Okafor', archetype:'Problem Solver', age:36, interests:['operations','education','technology'], traits:{novelty:0.49, social:0.41, price:0.71, trust:0.90, utility:0.96, visual:0.44}, habits:['asks what problem it solves','adopts when ROI is clear'], emoji:'◕' },
  { id:'a15', name:'Zoe Martin', archetype:'Social Amplifier', age:21, interests:['short form video','music','fashion'], traits:{novelty:0.96, social:0.99, price:0.38, trust:0.55, utility:0.51, visual:0.97}, habits:['shares memeable moments','follows microtrends'], emoji:'◒' },
  { id:'a16', name:'Rahul Mehta', archetype:'Deal Strategist', age:32, interests:['commerce','gadgets','finance'], traits:{novelty:0.52, social:0.57, price:0.97, trust:0.79, utility:0.82, visual:0.59}, habits:['searches for alternatives','responds to clear value'], emoji:'◑' },
  { id:'a17', name:'Nora Jensen', archetype:'Ethics First', age:38, interests:['sustainability','community','education'], traits:{novelty:0.55, social:0.64, price:0.53, trust:0.96, utility:0.78, visual:0.58}, habits:['checks values alignment','calls out misleading claims'], emoji:'◓' },
  { id:'a18', name:'Leo Garcia', archetype:'Curious Generalist', age:27, interests:['apps','travel','science'], traits:{novelty:0.82, social:0.70, price:0.57, trust:0.72, utility:0.75, visual:0.72}, habits:['clicks to learn more','recommends useful discoveries'], emoji:'◔' }
];

const trends = [
  {id:'t01', name:'Short form proof', category:'Content', momentum:0.82, impact:{novelty:0.06, social:0.10, visual:0.12}, note:'Fast proof and native demonstrations are outperforming abstract brand claims.'},
  {id:'t02', name:'Human + AI', category:'Product', momentum:0.74, impact:{novelty:0.10, trust:-0.02, utility:0.08}, note:'People respond better when AI is positioned as a useful collaborator, not an opaque replacement.'},
  {id:'t03', name:'Creator credibility', category:'Distribution', momentum:0.69, impact:{social:0.09, trust:0.07}, note:'Peer-led recommendations can reduce skepticism and improve sharing intent.'},
  {id:'t04', name:'Low friction onboarding', category:'UX', momentum:0.77, impact:{utility:0.10, trust:0.05}, note:'Products that show value quickly are more likely to convert curious users.'},
  {id:'t05', name:'Personalized utility', category:'Product', momentum:0.72, impact:{utility:0.11, novelty:0.05}, note:'Useful personalization is a strong bridge between novelty and sustained value.'},
  {id:'t06', name:'Transparent claims', category:'Trust', momentum:0.66, impact:{trust:0.12, social:0.03}, note:'Specific, verifiable claims protect credibility as reach increases.'}
];


const research = {
  lastUpdated: '2026-10-04',
  objective: 'Validate the problem, understand existing research workflows, map the competitive landscape and translate the findings into product decisions for Virally.',
  methods: [
    {name:'Secondary research', detail:'Reviewed the official WCC Launchpad 30 brief and current product documentation for adjacent user research and behavioral simulation products.'},
    {name:'Workflow mapping', detail:'Mapped the pre launch journey from idea and creative creation to audience reaction, launch spend, measurement and iteration.'},
    {name:'Competitive framing', detail:'Compared general product research, synthetic audience research and population simulation offerings to identify the narrow positioning for Virally.'},
    {name:'Product translation', detail:'Converted findings into persona dimensions, reaction actions, trend context, transparent score drivers and a human in the loop workflow.'}
  ],
  findings: [
    {title:'The evidence gap matters', detail:'WCC explicitly scores user insight and problem evidence, making it important to document who has the problem and the evidence used to define it.'},
    {title:'Research tools already use AI personas', detail:'Current products demonstrate an established category around personas, synthetic users, concept testing and simulated populations.'},
    {title:'The decision is narrower than general UX research', detail:'Virally focuses on a specific decision: how a proposed business idea and marketing creative may travel across different audience profiles before real distribution spend.'},
    {title:'Transparency is a product requirement', detail:'Synthetic behavior is directional. Results should expose assumptions, persona differences and confidence rather than present a single score as certainty.'}
  ],
  productDecisions: [
    'Use multiple distinct audience agents instead of one generic response.',
    'Give each persona explicit behavioral dimensions so disagreement is visible.',
    'Treat Like, Comment, Share, Save and Skip as separate action signals.',
    'Add trend momentum as a contextual layer that can shift receptivity over time.',
    'Show decomposable score drivers and persona rationales in the dashboard.',
    'Keep a clear human validation disclaimer because synthetic reactions are not primary user evidence.'
  ],
  competitors: [
    {name:'Maze', category:'Product discovery', angle:'Participant based product research, moderated and unmoderated studies, recruitment and reporting.', source:'https://help.maze.co/articles/4777475916-maze-quick-start'},
    {name:'Delve AI', category:'Synthetic research', angle:'Research backed personas, synthetic users, surveys, interviews and concept or messaging validation.', source:'https://www.delve.ai/solutions/market-research'},
    {name:'Simile', category:'Behavior simulation', angle:'AI driven population simulations designed to test how populations respond to changing scenarios, with validation against real people and data freshness controls.', source:'https://www.simile.com/'},
    {name:'Aaru', category:'Population simulation', angle:'Condition based simulations with defined audiences, measurable outcomes and explicit evaluation and validation practices.', source:'https://aaru.com/simulation'}
  ],
  limitation: 'This product research is secondary and methodological. It does not claim that synthetic reactions are equivalent to real customer research. Primary interviews or survey responses should be collected before making a production launch decision.',
  validationQuestions: [
    'How do you currently test a new idea or marketing concept before launch?',
    'What is the most expensive uncertainty in that process?',
    'How many people or data points do you normally get before deciding to launch?',
    'Would a fast simulated audience screen change what you launch or how you market it?',
    'Which audience reaction would be most useful to see before spending on distribution?'
  ]
};

function readHistory() {
  try { return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8')); } catch (_) { return []; }
}
function writeHistory(rows) {
  fs.mkdirSync(DATA, {recursive:true});
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(rows.slice(-50), null, 2));
}

const historySeed = [
  {id:'demo-1', createdAt:'2026-10-04T09:30:00Z', name:'FocusFlow', score:76, verdict:'Promising', reach:48, shares:18},
  {id:'demo-2', createdAt:'2026-10-04T12:10:00Z', name:'EcoCart', score:69, verdict:'Promising', reach:41, shares:13},
  {id:'demo-3', createdAt:'2026-10-04T15:20:00Z', name:'TutorLoop', score:83, verdict:'Strong hit', reach:56, shares:24}
];
if (!fs.existsSync(HISTORY_FILE)) writeHistory(historySeed);

function clamp(v, min=0, max=1) { return Math.max(min, Math.min(max, v)); }
function average(arr) { return arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0; }
function sigmoid(x) { return 1/(1+Math.exp(-x)); }
function hashNumber(str) {
  const h = crypto.createHash('sha256').update(str).digest();
  return h.readUInt32BE(0) / 0xffffffff;
}

function keywordSet(text) {
  return new Set(String(text || '').toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(Boolean));
}

function analyzePersona(persona, input, trendFactor) {
  const allText = `${input.idea} ${input.creative} ${input.audience}`.toLowerCase();
  const words = keywordSet(allText);
  const interestHits = persona.interests.filter(x => {
    const parts = x.toLowerCase().split(/\s+/);
    return parts.some(p => words.has(p));
  }).length;

  const novelty = clamp(persona.traits.novelty + trendFactor.novelty);
  const social = clamp(persona.traits.social + trendFactor.social);
  const price = clamp(persona.traits.price);
  const trust = clamp(persona.traits.trust + trendFactor.trust);
  const utility = clamp(persona.traits.utility + trendFactor.utility);
  const visual = clamp(persona.traits.visual + trendFactor.visual);
  const relevance = clamp(0.34 + interestHits * 0.18 + (hashNumber(persona.id + input.idea) - 0.5) * 0.08);

  const creativeSignal = /demo|before|after|proof|result|testimonial|story|hook|video|visual|show|real/i.test(input.creative) ? 0.09 : 0;
  const riskyClaims = /guarantee|overnight|instant|cure|100%|never fails|risk free/i.test(allText) ? 0.16 : 0;
  const complexSignal = /setup|integration|enterprise|workflow|configuration|multiple steps/i.test(allText) ? 0.04 : 0;

  const like = clamp(0.15 + relevance*0.26 + novelty*0.15 + utility*0.19 + visual*0.10 + creativeSignal - riskyClaims - complexSignal);
  const comment = clamp(0.06 + like*0.30 + social*0.21 + (persona.archetype.includes('Analyst') || persona.archetype.includes('Trust') ? 0.12 : 0) - riskyClaims*0.35);
  const share = clamp(0.03 + like*0.24 + social*0.43 + relevance*0.18 + visual*0.10 + (trendFactor.social > 0.06 ? 0.04 : 0) - riskyClaims*0.50);
  const save = clamp(0.04 + like*0.26 + utility*0.38 + trust*0.12);
  const skip = clamp(1 - (like*0.40 + relevance*0.25 + trust*0.12 + utility*0.10));
  const purchaseIntent = clamp(0.16 + relevance*0.28 + trust*0.18 + utility*0.24 + price*0.08 + like*0.12 - riskyClaims*0.65);
  const confidence = clamp(0.62 + Math.abs(relevance - 0.5)*0.18 + (interestHits ? 0.08 : 0));

  const actionWeights = [
    ['Like', like], ['Comment', comment], ['Share', share], ['Save', save], ['Skip', skip]
  ];
  actionWeights.sort((a,b)=>b[1]-a[1]);
  const topAction = actionWeights[0][0];

  const rationale = topAction === 'Share'
    ? 'The concept maps well to this persona’s social behavior and is easy to pass along.'
    : topAction === 'Save'
      ? 'The utility and trust profile suggest this person would keep it for later.'
      : topAction === 'Comment'
        ? 'The concept creates enough friction or curiosity to trigger a response.'
        : topAction === 'Like'
          ? 'The idea feels relevant, novel and visually easy to understand.'
          : 'The value proposition is not strong enough for this persona right now.';

  return {
    ...persona,
    scores:{like,comment,share,save,skip,purchaseIntent,confidence,relevance},
    topAction,
    rationale,
    trendFit: clamp(0.52 + trendFactor.novelty*0.8 + trendFactor.social*0.5 + trendFactor.utility*0.5),
  };
}

function analyze(input) {
  const seed = `${input.idea}|${input.creative}|${input.audience}|${input.channel || 'social'}`;
  const seedNoise = (hashNumber(seed)-0.5)*0.04;
  const selectedTrends = trends.map(t => ({...t, adjustedMomentum: clamp(t.momentum + (hashNumber(seed+t.id)-0.5)*0.08)}));
  const topTrends = [...selectedTrends].sort((a,b)=>b.adjustedMomentum-a.adjustedMomentum).slice(0,4);
  const trendFactor = topTrends.reduce((acc,t)=>{
    Object.keys(acc).forEach(k=>acc[k]+= (t.impact[k] || 0) * (t.adjustedMomentum));
    return acc;
  }, {novelty:0,social:0,trust:0,utility:0,visual:0});
  Object.keys(trendFactor).forEach(k => trendFactor[k]=clamp(trendFactor[k]));

  const results = agents.map(a => analyzePersona(a, input, trendFactor));
  const reach = average(results.map(r=>r.scores.like*0.25+r.scores.share*0.45+r.scores.comment*0.12+r.scores.save*0.18));
  const engagement = average(results.map(r=>r.scores.like*0.32+r.scores.comment*0.22+r.scores.share*0.27+r.scores.save*0.19));
  const purchase = average(results.map(r=>r.scores.purchaseIntent));
  const relevance = average(results.map(r=>r.scores.relevance));
  const trust = average(results.map(r=>r.traits.trust));
  const trendFit = average(results.map(r=>r.trendFit));
  const score = Math.round(clamp(0.20 + reach*0.22 + engagement*0.19 + purchase*0.23 + relevance*0.12 + trust*0.08 + trendFit*0.10 + seedNoise,0,1)*100);
  const reachIndex = Math.round(clamp(reach*1.45 + engagement*0.35)*100);
  const shareRate = Math.round(average(results.map(r=>r.scores.share))*100);
  const verdict = score >= 78 ? 'Strong hit' : score >= 62 ? 'Promising' : score >= 48 ? 'Needs iteration' : 'High risk';

  const actionCounts = results.reduce((acc,r)=>{ acc[r.topAction]=(acc[r.topAction]||0)+1; return acc; },{});
  const segments = [...new Map(results.map(r=>[r.archetype, r])).values()];
  const strongest = [...results].sort((a,b)=>b.scores.purchaseIntent-a.scores.purchaseIntent).slice(0,5);
  const weakest = [...results].sort((a,b)=>a.scores.purchaseIntent-b.scores.purchaseIntent).slice(0,5);

  const recommendations = [];
  if (shareRate < 15) recommendations.push('Make the hook more socially transmissible: show a proof point, transformation or relatable moment within the first seconds.');
  else recommendations.push('Protect the current shareability: keep the hook compact and make the payoff obvious before the viewer has to think.');
  if (trust < 0.78) recommendations.push('Add evidence and transparent claims so skeptical and trust-first personas have a reason to believe the promise.');
  if (purchase < 0.62) recommendations.push('Clarify the value exchange and the next step. A concrete outcome will make the concept easier to justify.');
  recommendations.push(`Lean into ${topTrends[0].name.toLowerCase()} because it currently has the strongest simulated momentum in this scenario.`);

  return {
    id: crypto.randomUUID(),
    createdAt:new Date().toISOString(),
    input,
    score,
    verdict,
    metrics:{reachIndex, engagement:Math.round(engagement*100), purchaseIntent:Math.round(purchase*100), trust:Math.round(trust*100), relevance:Math.round(relevance*100), shareRate},
    actions:actionCounts,
    personas:results,
    topTrends,
    recommendations,
    confidence: Math.round(average(results.map(r=>r.scores.confidence))*100),
    methodology:{agentCount:agents.length, trendCount:topTrends.length, simulation:'Persona-weighted multi-agent simulation', disclaimer:'Forecast only. Results are directional and should be validated with real audience data.'}
  };
}

const MIME = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon'};

function serveStatic(req,res) {
  let pathname = decodeURIComponent(url.parse(req.url).pathname);
  if (pathname === '/') pathname='/index.html';
  const safe = path.normalize(path.join(PUBLIC, pathname));
  if (!safe.startsWith(PUBLIC)) return send(res,403,'Forbidden','text/plain');
  fs.readFile(safe,(err,data)=>{
    if (err) {
      if (pathname !== '/index.html') return send(res,404,'Not Found','text/plain');
      return send(res,404,'Not Found','text/plain');
    }
    res.writeHead(200, {'Content-Type':MIME[path.extname(safe)]||'application/octet-stream','Cache-Control':'no-cache'});
    res.end(data);
  });
}
function send(res,status,body,type='application/json; charset=utf-8') { res.writeHead(status, {'Content-Type':type, 'Access-Control-Allow-Origin':'*'}); res.end(type.startsWith('application/json')?JSON.stringify(body):body); }
function parseBody(req) { return new Promise((resolve,reject)=>{ let raw=''; req.on('data',c=>{raw+=c; if(raw.length>1e6) req.destroy();}); req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{})}catch(e){reject(e)}}); }); }

const server = http.createServer(async (req,res)=>{
  const parsed = url.parse(req.url,true);
  if (req.method === 'OPTIONS') { res.writeHead(204, {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}); return res.end(); }
  try {
    if (parsed.pathname === '/api/health') return send(res,200,{ok:true,service:'Virally API',time:new Date().toISOString()});
    if (parsed.pathname === '/api/agents' && req.method==='GET') return send(res,200,{agents});
    if (parsed.pathname === '/api/trends' && req.method==='GET') return send(res,200,{trends});
    if (parsed.pathname === '/api/research' && req.method==='GET') return send(res,200,{research});
    if (parsed.pathname === '/api/history' && req.method==='GET') return send(res,200,{history:readHistory()});
    if (parsed.pathname === '/api/analyze' && req.method==='POST') {
      const body = await parseBody(req);
      if (!body.idea || String(body.idea).trim().length < 8) return send(res,400,{error:'Add a business idea with at least 8 characters.'});
      const input={idea:String(body.idea).trim(),creative:String(body.creative||'').trim(),audience:String(body.audience||'').trim(),channel:String(body.channel||'social').trim()};
      const result=analyze(input);
      const rows=readHistory(); rows.push({id:result.id,createdAt:result.createdAt,name:input.idea.slice(0,30),score:result.score,verdict:result.verdict,reach:result.metrics.reachIndex,shares:result.metrics.shareRate}); writeHistory(rows);
      return send(res,200,result);
    }
    return serveStatic(req,res);
  } catch (err) {
    console.error(err);
    return send(res,500,{error:'Unexpected server error. Try the analysis again.'});
  }
});

server.listen(PORT,HOST,()=>console.log(`Virally running at http://localhost:${PORT}`));
