const CACHE='humidite-pwa-v23';
const FILES=['./','./index.html','./manifest.webmanifest','./sw.js','./robots.txt','./CHANGELOG.txt'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))) });
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith('humidite-pwa-')&&k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
  const clients=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  clients.forEach(client=>client.postMessage({type:'APP_UPDATED',version:'23'}));
})()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
