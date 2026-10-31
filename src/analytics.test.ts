import {describe,it,expect,beforeEach,afterEach,vi} from 'vitest';
import {GA_MEASUREMENT_ID,PRODUCTION_HOST,CONSENT_KEY,applyConsent,getConsent,saveConsent} from './analytics';

function setup(hostname=PRODUCTION_HOST,cookie=''){
 const stored=new Map<string,string>();
 const scripts:{src:string,async:boolean}[]=[];
 const cookieWrites:string[]=[];
 const win:Record<string,any>={location:{hostname},localStorage:{getItem:(k:string)=>stored.get(k)??null,setItem:(k:string,v:string)=>{stored.set(k,v)}}};
 const doc={createElement:()=>({src:'',async:false}),head:{append:(s:{src:string,async:boolean})=>scripts.push(s)},get cookie(){return cookie},set cookie(v:string){cookieWrites.push(v)}};
 vi.stubGlobal('window',win);
 vi.stubGlobal('document',doc);
 return {win,stored,scripts,cookieWrites};
}

describe('analytics consent',()=>{
 beforeEach(()=>{vi.unstubAllGlobals()});
 afterEach(()=>{vi.unstubAllGlobals()});

 it('has no choice until the visitor makes one',()=>{
  setup();
  expect(getConsent()).toBeNull();
 });
 it('remembers the visitor choice',()=>{
  setup();
  saveConsent('denied');
  expect(getConsent()).toBe('denied');
 });
 it('ignores unknown stored values',()=>{
  const {stored}=setup();
  stored.set(CONSENT_KEY,'maybe');
  expect(getConsent()).toBeNull();
 });
 it('survives blocked storage',()=>{
  const {win}=setup();
  win.localStorage={getItem:()=>{throw new Error('blocked')},setItem:()=>{throw new Error('blocked')}};
  expect(getConsent()).toBeNull();
  expect(()=>saveConsent('granted')).not.toThrow();
 });
 it('loads the Google tag once after acceptance in production',()=>{
  const {win,scripts}=setup();
  applyConsent('granted');
  applyConsent('granted');
  expect(scripts).toHaveLength(1);
  expect(scripts[0].src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  expect(scripts[0].async).toBe(true);
  expect(win.dataLayer.map((entry:IArguments)=>entry[0])).toEqual(['consent','js','config']);
 });
 it('does not load on other hosts',()=>{
  const {win,scripts}=setup('localhost');
  applyConsent('granted');
  expect(scripts).toHaveLength(0);
  expect(win.gtag).toBeUndefined();
 });
 it('does not load after rejection',()=>{
  const {win,scripts}=setup();
  applyConsent('denied');
  expect(scripts).toHaveLength(0);
  expect(win.gtag).toBeUndefined();
  expect(win[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true);
 });
 it('removes only analytics cookies on rejection',()=>{
  const {cookieWrites}=setup(PRODUCTION_HOST,'_ga=1; _ga_DWDET4B75R=2; other=3');
  applyConsent('denied');
  expect(cookieWrites.some(c=>c.startsWith('_ga=;'))).toBe(true);
  expect(cookieWrites.some(c=>c.startsWith('_ga_DWDET4B75R=;'))).toBe(true);
  expect(cookieWrites.some(c=>c.startsWith('other'))).toBe(false);
 });
 it('stops and resumes when the visitor changes their mind',()=>{
  const {win,scripts}=setup();
  applyConsent('granted');
  applyConsent('denied');
  expect(win[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(true);
  applyConsent('granted');
  expect(win[`ga-disable-${GA_MEASUREMENT_ID}`]).toBe(false);
  expect(scripts).toHaveLength(1);
  expect(win.dataLayer.filter((entry:IArguments)=>entry[0]==='config')).toHaveLength(2);
 });
});
