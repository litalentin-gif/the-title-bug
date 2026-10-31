import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Bug, Github, RotateCcw, Terminal, ExternalLink, Copy, Check, Sparkles, ArrowDown, Code2} from 'lucide-react';
import {SKILLS, TITLES, REAL_TITLES, generateTitle, type Skill} from './logic';
import './style.css';

const diagnosticLines = [
 {text:'Initializing candidate profile...', kind:'muted'},
 {text:'✓ QA experience validated — 7 years', kind:'ok'},
 {text:'✓ Product thinking enabled', kind:'ok'},
 {text:'✓ Development skills detected', kind:'ok'},
 {text:'✓ Systems & integrations understood', kind:'ok'},
 {text:'✗ Single job title assignment FAILED', kind:'fail'},
 {text:'JobTitleNotFoundError: too many compatible features', kind:'trace'},
 {text:"// It's not a bug. It's a feature. 🐞", kind:'ok'},
];
function App(){
 const [titleMode,setTitleMode]=useState<'real'|'funny'>('real');
 const [diagnosticCount,setDiagnosticCount]=useState(0);
 const [diagnosticRunning,setDiagnosticRunning]=useState(false);
 const timerRef=useRef<ReturnType<typeof setInterval>|null>(null);
 useEffect(()=>()=>{if(timerRef.current)clearInterval(timerRef.current)},[]);
 const startDiagnostics=()=>{
  if(timerRef.current)clearInterval(timerRef.current);
  setDiagnosticCount(0);setDiagnosticRunning(true);
  let step=0;
  timerRef.current=setInterval(()=>{step+=1;setDiagnosticCount(step);if(step>=diagnosticLines.length){if(timerRef.current)clearInterval(timerRef.current);timerRef.current=null;setDiagnosticRunning(false)}},520);
 };
 const titlePool=titleMode==='real'?REAL_TITLES:TITLES;

 const [attempt,setAttempt]=useState(0);
 const [selected,setSelected]=useState<Skill[]>(['QA','Product','Development']);
 const [visitorAttempt,setVisitorAttempt]=useState(0);
 const [visitorTitle,setVisitorTitle]=useState<string|null>(null);
 const [copied,setCopied]=useState(false);
 const toggle=(s:Skill)=>{setSelected(old=>old.includes(s)?old.filter(x=>x!==s):[...old,s]);setVisitorTitle(null);setVisitorAttempt(0)};
 const run=()=>{setVisitorTitle(generateTitle(selected,visitorAttempt));setVisitorAttempt(n=>n+1)};
 const copy=async()=>{if(!visitorTitle)return;try{await navigator.clipboard.writeText(`My title debugger result: ${visitorTitle} 🐞 #TheTitleBug`);setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{setCopied(false)}};
 return <main>
  <header className="nav wrap"><a className="brand" href="#top"><Bug size={22}/> the-title-bug<span className="version">v1.1.0</span></a><a className="github" href="https://github.com/litalentin-gif/the-title-bug" target="_blank" rel="noreferrer"><Github size={18}/> View source</a></header>
  <section id="top" className="hero wrap"><div className="eyebrow"><span className="pulse"/> SYSTEM STATUS: WORKING AS DESIGNED</div><h1><span>404:</span> Job Title<br/>Not Found<span className="period">.</span></h1><p className="subhead">One human. Multiple skill sets.<br/>Zero matching dropdown options.</p><a href="#debugger" className="cta">Debug your own career <ArrowDown size={18}/></a><div className="orbit orbit-one"/><div className="orbit orbit-two"/></section>
  <section className="wrap panels"><div className="terminal"><div className="terminal-head"><div className="dots"><i/><i/><i/></div><span><Terminal size={15}/> lital_entin.py</span><span className="run">● {diagnosticRunning?'RUNNING':diagnosticCount===diagnosticLines.length?'COMPLETE':'READY'}</span></div><div className="terminal-body"><div className="muted">$ python lital_entin.py</div><div aria-live="polite" aria-atomic="false" className="diagnostic-output">{diagnosticLines.slice(0,diagnosticCount).map((line,i)=><div key={i} className={`diagnostic-line ${line.kind}`}>{line.text}</div>)}{diagnosticCount===0&&<div className="muted">Press Run diagnostics to inspect the profile.</div>}</div><div className="diagnostic-actions"><button disabled={diagnosticRunning} onClick={startDiagnostics}><Terminal size={15}/>{diagnosticCount===diagnosticLines.length?'Run again':'Run diagnostics'}</button><a href="https://github.com/litalentin-gif/the-title-bug/blob/main/src/main.tsx" target="_blank" rel="noreferrer">View source <ExternalLink size={13}/></a></div></div></div>
  <div className="story"><div className="section-label">01 / THE ORIGINAL BUG</div><h2>Hi, I'm Lital.<br/><span>I break things.<br/>Then I build them.</span></h2><p>Almost 7 years in QA taught me to question everything. Product taught me to ask <em>why</em>. Development gave me the joy of making ideas real.</p><p>Then I built <strong>Bumpify</strong> from scratch, switching hats between product, code, and testing my own work. Turns out the hardest thing to debug wasn't the app. It was my job title.</p><p className="quote">Maybe the problem isn't my skills.<br/>Maybe it's the dropdown menu.</p></div></section>
  <section className="wrap title-box"><div className="section-label">02 / REPRODUCE THE BUG</div><div className="title-row"><div><h2>Generate my job title</h2><p>Seven years of experience. Infinite curiosity. One dropdown.</p></div><span className="tag">UNRESOLVED</span></div><div className="mode-switch" role="group" aria-label="Job title category"><button className={titleMode==='real'?'chosen':''} aria-pressed={titleMode==='real'} onClick={()=>{setTitleMode('real');setAttempt(0)}}>Real-world titles</button><button className={titleMode==='funny'?'chosen':''} aria-pressed={titleMode==='funny'} onClick={()=>{setTitleMode('funny');setAttempt(0)}}>Funny titles 🐞</button></div><div className="generated"><span className="tiny">SUGGESTED JOB TITLE #{attempt+1}</span><h3>{titlePool[attempt%titlePool.length]}</h3><p className="mode-caption">{titleMode==='real'?"Actual title. Same multi-skilled human.":"Unofficial title. Surprisingly accurate."}</p><button onClick={()=>setAttempt(n=>n+1)}><RotateCcw size={17}/> Try another title</button></div><p className="aside">// Different titles. Same person. Maybe your team has room for one of them?</p></section>
  <section id="debugger" className="wrap visitor"><div className="section-label">03 / YOUR TURN</div><div className="visitor-header"><div><h2>Debug your own career<span className="period">.</span></h2><p>Choose your skills. We'll try to squeeze you into a single title. No promises.</p></div><Sparkles size={32}/></div><div className="skill-grid">{SKILLS.map(s=><button key={s} className={`skill ${selected.includes(s)?'active':''}`} aria-pressed={selected.includes(s)} onClick={()=>toggle(s)}><span>{selected.includes(s)?'✓':'+'}</span>{s}</button>)}</div><button className="debug-btn" onClick={run}><Code2 size={18}/> Run Career Debugger</button>{visitorTitle&&<div className="visitor-result" aria-live="polite"><span className="tiny">YOUR NEW JOB TITLE</span><h3>{visitorTitle}</h3><p>Result: working as designed. ✨</p><button onClick={copy}>{copied?<Check size={17}/>:<Copy size={17}/>} {copied?'Copied!':'Copy result'}</button></div>}</section>
  <div className="wrap stack-note">Built with React + TypeScript · Tested with Vitest · CI with GitHub Actions</div><footer className="wrap footer"><div><span className="footer-logo">404<span className="period">.</span></span><p>Built by Lital Entin. QA brain. Product heart. Developer curiosity.</p></div><div className="links"><a href="https://github.com/litalentin-gif/the-title-bug" target="_blank" rel="noreferrer">GitHub <ExternalLink size={14}/></a><a href="https://litalentin.dev/cv-global" target="_blank" rel="noreferrer">My CV <ExternalLink size={14}/></a><a href="https://litalentin.dev" target="_blank" rel="noreferrer">Portfolio <ExternalLink size={14}/></a></div></footer>
 </main>
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);
