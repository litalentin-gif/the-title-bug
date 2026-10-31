import {describe,it,expect} from 'vitest';
import {generateTitle,pickModeTitle,TITLES,REAL_TITLES,EASTER_EGG,EASTER_EGG_INTERVAL,type Skill} from './logic';

const ORIGINAL_REAL=['Technical Product Manager','Senior QA Engineer','Technical Product Owner','System Validation Engineer','Product Support Engineer','Technical Project Manager','QA Lead','Solutions Engineer'];
const ORIGINAL_FUNNY=['Technical Product Builder','QA Engineer with Product Superpowers','Chief Why-Is-This-Broken Officer','Full-Stack Problem Solver','Cross-Functional Human API','Professional Edge-Case Collector','Chief It-Works-On-My-Machine Officer'];
const MATCHES:[string,Skill[]][]=[
 ['Technical Program Manager',['Project Management','Development']],
 ['Product Operations Manager',['Product','Project Management']],
 ['Technical Solutions Consultant',['Development','Marketing']],
 ['Integration Engineer',['Development','DevOps']],
 ['Systems Engineer',['DevOps','Cybersecurity']],
 ['Release Manager',['DevOps','Project Management']],
 ['Developer Experience Engineer',['Development','UX/UI']],
 ['Quality Engineering Lead',['QA','DevOps']],
 ['Chief Chaos Debugger',['QA','DevOps']],
 ['Director of Making It Work',['Product','DevOps']],
 ['Senior Dropdown Escape Artist',['Product','UX/UI']],
];
const EXISTING_MATCHES:[string,Skill[]][]=[
 ['Chief But-What-About-The-User Officer',['QA','UX/UI']],
 ['Chief But-What-About-The-User Officer',['QA','Product']],
 ['Professional Edge-Case Collector',['QA','UX/UI']],
 ['Algorithm Whisperer',['AI','Development']],
 ['Algorithm Whisperer',['AI','Data']],
 ['Full-Stack Problem Solver',['Development','Data']],
];
const REMOVED=['Chief "It Works on My Machine" Officer','Professional Edge Case Finder','Human API Gateway','Full-Stack Problem Collector'];
const NEW_REAL=MATCHES.slice(0,8).map(([title])=>title);
const NEW_FUNNY=[...MATCHES.slice(8).map(([title])=>title),'Head of Unexpected Responsibilities'];
const debuggerResults=(skills:Skill[])=>new Set(Array.from({length:40},(_,attempt)=>generateTitle(skills,attempt)));
const modeResults=(mode:'real'|'funny',count=400)=>Array.from({length:count},(_,attempt)=>pickModeTitle(mode,attempt).title);

describe('career debugger',()=>{
 it('handles zero selected skills',()=>expect(generateTitle([])).toContain('404'));
 it('recognizes a single specialty',()=>expect(generateTitle(['QA'])).toContain('QA Specialist'));
 it('combines QA and development',()=>expect(generateTitle(['QA','Development'])).toContain('Bug Creator'));
 it('produces different titles on repeated attempts',()=>expect(generateTitle(['QA','Product'],0)).not.toBe(generateTitle(['QA','Product'],1)));
 it('includes recognizable professional titles',()=>expect(REAL_TITLES).toContain('Technical Product Manager'));
 it('always has titles for Lital',()=>expect(TITLES.length).toBeGreaterThan(3));
 it.each(MATCHES)('reaches %s from matching skills',(title,skills)=>expect(debuggerResults(skills)).toContain(title));
 it.each(MATCHES)('hides %s when a required skill is missing',(title,skills)=>{
  expect(debuggerResults([skills[0],'Marketing' === skills[1] ? 'Data' : 'Marketing'])).not.toContain(title);
  expect(debuggerResults([skills[1],'Marketing' === skills[0] ? 'Data' : 'Marketing'])).not.toContain(title);
 });
 it.each(EXISTING_MATCHES)('reaches existing title %s from %j',(title,skills)=>expect(debuggerResults(skills)).toContain(title));
 it.each(EXISTING_MATCHES)('hides existing title %s without %j',(title,skills)=>{
  expect(debuggerResults([skills[0],'Marketing'])).not.toContain(title);
  expect(debuggerResults([skills[1],'Marketing'])).not.toContain(title);
 });
 it.each<[Skill[]]>([[['QA','Product','UX/UI']],[['AI','Data','Development']]])('does not repeat a title when %j overlap',(skills)=>{
  const cycle=Array.from({length:40},(_,attempt)=>generateTitle(skills,attempt));
  const size=new Set(cycle).size;
  expect(new Set(cycle.slice(0,size)).size).toBe(size);
 });
 it('needs at least four skills for unexpected responsibilities',()=>{
  expect(debuggerResults(['QA','Data','AI'])).not.toContain('Head of Unexpected Responsibilities');
  expect(debuggerResults(['QA','Data','AI','Marketing'])).toContain('Head of Unexpected Responsibilities');
 });
 it('keeps generic results for skills without a specific match',()=>expect(debuggerResults(['Cybersecurity','Marketing'])).toEqual(new Set(['Cross-Functional Chaos Coordinator','Human Integration Layer','Multi-Tab Brain Operator'])));
 it('never repeats a title on consecutive runs',()=>{
  const skills:Skill[]=['QA','Product','Development','DevOps','UX/UI','Data','AI','Project Management','Cybersecurity','Marketing'];
  for(let attempt=0;attempt<60;attempt+=1)expect(generateTitle(skills,attempt)).not.toBe(generateTitle(skills,attempt+1));
 });
 it('keeps every title unique when all skills are selected',()=>{
  const skills:Skill[]=['QA','Product','Development','DevOps','UX/UI','Data','AI','Project Management','Cybersecurity','Marketing'];
  const cycle=Array.from({length:22},(_,attempt)=>generateTitle(skills,attempt));
  expect(generateTitle(skills,22)).toBe(cycle[0]);
  expect(new Set(cycle).size).toBe(cycle.length);
  for(const title of REMOVED)expect(cycle).not.toContain(title);
 });
});

describe('title modes',()=>{
 it('keeps every original title in its original position',()=>{
  expect(REAL_TITLES.slice(0,ORIGINAL_REAL.length)).toEqual(ORIGINAL_REAL);
  expect(TITLES.slice(0,ORIGINAL_FUNNY.length)).toEqual(ORIGINAL_FUNNY);
 });
 it('has no duplicate titles',()=>{
  const all=[...REAL_TITLES,...TITLES,EASTER_EGG.title].map(title=>title.toLowerCase());
  expect(new Set(all).size).toBe(all.length);
 });
 it('drops the near-duplicate funny titles and keeps their originals',()=>{
  for(const title of REMOVED)expect(modeResults('funny')).not.toContain(title);
  expect(TITLES).toEqual(expect.arrayContaining(ORIGINAL_FUNNY));
 });
 it('reaches every new real-world title',()=>expect(modeResults('real')).toEqual(expect.arrayContaining(NEW_REAL)));
 it('reaches every new funny title',()=>expect(modeResults('funny')).toEqual(expect.arrayContaining(NEW_FUNNY)));
 it('never returns funny titles in real-world mode',()=>{
  for(const title of modeResults('real'))expect(REAL_TITLES as readonly string[]).toContain(title);
 });
 it('never returns real-world titles in funny mode',()=>{
  for(const title of modeResults('funny'))expect(REAL_TITLES as readonly string[]).not.toContain(title);
 });
 it('never repeats a title on consecutive attempts',()=>{
  for(const mode of ['real','funny'] as const){
   const results=modeResults(mode);
   results.slice(1).forEach((title,index)=>expect(title).not.toBe(results[index]));
  }
 });
});

describe('easter egg',()=>{
 it('appears in funny mode with its description',()=>expect(pickModeTitle('funny',EASTER_EGG_INTERVAL-1)).toEqual(EASTER_EGG));
 it('has the requested wording',()=>{
  expect(EASTER_EGG.title).toBe('404: Professional Identity Not Found');
  expect(EASTER_EGG.description).toBe('Too qualified for one box. Too curious to stay in one lane.');
 });
 it('is rare',()=>expect(modeResults('funny').filter(title=>title===EASTER_EGG.title)).toHaveLength(400/EASTER_EGG_INTERVAL));
 it('first appears on the tenth result',()=>{
  expect(EASTER_EGG_INTERVAL).toBe(10);
  expect(modeResults('funny',9)).not.toContain(EASTER_EGG.title);
  expect(modeResults('funny',10)[9]).toBe(EASTER_EGG.title);
 });
 it('still shows every funny title around the easter eggs',()=>expect(modeResults('funny',13)).toEqual(expect.arrayContaining(TITLES)));
 it('never appears in real-world mode or the skills debugger',()=>{
  expect(modeResults('real')).not.toContain(EASTER_EGG.title);
  expect(debuggerResults(['QA','Product','Development','DevOps'])).not.toContain(EASTER_EGG.title);
 });
 it('does not skip the next funny title',()=>{
  const index=EASTER_EGG_INTERVAL-1;
  expect(TITLES.indexOf(pickModeTitle('funny',index+1).title)).toBe((TITLES.indexOf(pickModeTitle('funny',index-1).title)+1)%TITLES.length);
 });
});
