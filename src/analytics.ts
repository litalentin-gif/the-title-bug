export const GA_MEASUREMENT_ID='G-DWDET4B75R';
export const PRODUCTION_HOST='the-title-bug.vercel.app';
export const CONSENT_KEY='the-title-bug:analytics-consent';
const DISABLE_FLAG=`ga-disable-${GA_MEASUREMENT_ID}`;

export type Consent='granted'|'denied';

declare global {
 interface Window {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
 }
}

const flags=()=>window as unknown as Record<string,unknown>;

export function getConsent(): Consent|null {
 try {
  const value=window.localStorage.getItem(CONSENT_KEY);
  return value==='granted'||value==='denied'?value:null;
 } catch {
  return null;
 }
}

export function saveConsent(consent: Consent): void {
 try {
  window.localStorage.setItem(CONSENT_KEY,consent);
 } catch {
  // Storage can be blocked. The choice still applies until the page closes.
 }
}

function loadGoogleTag(): void {
 window.dataLayer=window.dataLayer??[];
 // gtag.js only reads the `arguments` object, so this cannot use rest parameters.
 window.gtag=function gtag(){window.dataLayer!.push(arguments)};
 window.gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
 window.gtag('js',new Date());
 window.gtag('config',GA_MEASUREMENT_ID,{allow_google_signals:false,allow_ad_personalization_signals:false});
 const script=document.createElement('script');
 script.async=true;
 script.src=`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
 document.head.append(script);
}

function clearAnalyticsCookies(): void {
 const host=window.location.hostname;
 for(const cookie of document.cookie.split(';')){
  const name=cookie.split('=')[0].trim();
  if(!/^_ga(_|$)/.test(name))continue;
  for(const domain of ['',`;domain=${host}`,`;domain=.${host}`])document.cookie=`${name}=;path=/;max-age=0${domain}`;
 }
}

export function applyConsent(consent: Consent): void {
 if(consent==='denied'){
  flags()[DISABLE_FLAG]=true;
  window.gtag?.('consent','update',{analytics_storage:'denied'});
  clearAnalyticsCookies();
  return;
 }
 if(window.location.hostname!==PRODUCTION_HOST)return;
 const wasDisabled=flags()[DISABLE_FLAG]===true;
 flags()[DISABLE_FLAG]=false;
 if(!window.gtag){loadGoogleTag();return}
 if(wasDisabled){
  window.gtag('consent','update',{analytics_storage:'granted'});
  window.gtag('config',GA_MEASUREMENT_ID,{allow_google_signals:false,allow_ad_personalization_signals:false});
 }
}
