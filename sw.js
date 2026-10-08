// Hushwave service worker: lets the app open without internet.
// - Opening the app (index.html): always tries the network first (so you get updates), falls back to the saved copy when offline.
// - Other files (icons, logo, the Supabase library): shown from the saved copy instantly and refreshed in the background.
// - Sound files are handled by the app itself, so they are skipped here.
const V='hushwave-shell-v3';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('hushwave-shell-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url),same=u.origin===location.origin;
  if(!same&&u.hostname!=='cdn.jsdelivr.net')return;
  if(same&&u.pathname.includes('/sounds/'))return;
  if(same&&r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put('./',cp))}return res}).catch(()=>caches.match('./')));
    return;
  }
  e.respondWith(caches.open(V).then(c=>c.match(r).then(m=>{
    const net=fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}).catch(()=>m);
    return m||net;
  })));
});
