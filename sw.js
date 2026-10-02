// Minimal service worker: lets the browser offer 'Install app'. It does no caching, so you always get the newest version.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',()=>{});
