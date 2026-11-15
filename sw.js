/* Agro Valle V34.8: shell offline + caché independiente por mapa */
const SHELL='agrovalle-shell-v34-8-multi-map';
const MAP_BASE='agrovalle-map-v34-4-precision';
const CORE=[
  './','./index.html','./manifest.webmanifest','./maps/catalog.json',
  './map-svg/manifest-v34-5.json','./map-svg/cuarteles-fuente-v34-5.json',
  './map-svg/labels.json','./map-svg/extras.json','./map-svg/vista-general-satelital.jpg',
  './assets/icon-192.png','./assets/icon-512.png','./assets/fontawesome/css/all.min.css',
  './assets/fontawesome/webfonts/fa-solid-900.woff2','./assets/fontawesome/webfonts/fa-brands-400.woff2'
];
self.addEventListener('install',e=>e.waitUntil((async()=>{
  const cache=await caches.open(SHELL);
  try{
    for(const u of CORE){
      const r=await fetch(u,{cache:'reload'});
      if(!r.ok)throw Error(`Recurso esencial ${u} HTTP ${r.status}`);
      await cache.put(u,r);
    }
    await self.skipWaiting();
  }catch(err){
    await caches.delete(SHELL);
    throw err;
  }
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  await self.clients.claim();
  const names=await caches.keys();
  await Promise.all(names.filter(n=>n.startsWith('agrovalle-shell-v33-')||
    (n.startsWith('agrovalle-shell-v34-')&&n!==SHELL)).map(n=>caches.delete(n)));
  // No eliminar cachés de mapas: cada sector conserva su instalación offline.
})()));
const LOGO_URL='https://www.image2url.com/r2/default/images/1794304567912-d9d872ca-f71a-44ab-8213-dafedd1ed0b5.png';
function mapCacheFor(url){
  const path=new URL(url).pathname;
  if(path.includes('/map-svg/'))return MAP_BASE;
  const match=path.match(/\/maps\/([^/]+)\//);
  if(match)return `agrovalle-map-v34-8-${match[1]}`;
  return null;
}
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  if(req.url===LOGO_URL){
    e.respondWith((async()=>{
      const cache=await caches.open(SHELL),stored=await cache.match(req);
      if(stored)return stored;
      try{const response=await fetch(req);if(response.ok||response.type==='opaque')await cache.put(req,response.clone());return response;}
      catch(err){return Response.error();}
    })());return;
  }
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  // El catálogo general pertenece al shell: permite abrir el selector offline.
  if(url.pathname.endsWith('/maps/catalog.json')){
    e.respondWith((async()=>{
      const cache=await caches.open(SHELL),cached=await cache.match(req,{ignoreSearch:true});
      if(cached)return cached;
      const response=await fetch(req);
      if(response.ok){try{await cache.put(req,response.clone());}catch(err){}}
      return response;
    })());return;
  }
  const mapCache=mapCacheFor(req.url);
  if(mapCache){
    e.respondWith((async()=>{
      const cache=await caches.open(mapCache);
      const cached=await cache.match(req,{ignoreSearch:true});
      if(cached)return cached;
      const response=await fetch(req);
      if(response.ok){try{await cache.put(req,response.clone());}catch(err){}}
      return response;
    })());return;
  }
  if(req.mode==='navigate'){
    e.respondWith((async()=>{
      try{
        const response=await fetch(req);
        if(response.ok){try{await (await caches.open(SHELL)).put('./index.html',response.clone());}catch(err){}}
        return response;
      }catch(err){
        const cache=await caches.open(SHELL);
        return await cache.match('./index.html')||await cache.match('./')||Response.error();
      }
    })());return;
  }
  e.respondWith((async()=>{
    const cache=await caches.open(SHELL),cached=await cache.match(req,{ignoreSearch:true});
    if(cached)return cached;
    try{
      const response=await fetch(req);
      if(response.ok){try{await cache.put(req,response.clone());}catch(err){}}
      return response;
    }catch(err){return Response.error();}
  })());
});
