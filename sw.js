/* GESTION AGRICOLA V34.16 · FIX CATÁLOGO MULTI-MAPA Y CACHÉ: reparación offline y eliminación de Modo sol.
   Conserva las cachés cartográficas existentes y valida la versión activa del SW. */
const SW_VERSION='v34.16';
const SHELL='agrovalle-shell-v34-16-multi-map';
const MAP_BASE='agrovalle-map-v34-4-precision';
const CORE=[
  './index.html','./manifest.webmanifest','./maps/catalog.json',
  './map-svg/manifest-v34-5.json','./map-svg/cuarteles-fuente-v34-5.json',
  './map-svg/labels.json','./map-svg/extras.json','./map-svg/vista-general-satelital.jpg',
  './maps/paltos-caseta-2-y-3/manifest.json','./maps/paltos-caseta-2-y-3/cuarteles-fuente.json','./maps/paltos-caseta-2-y-3/labels.json',
  './maps/paltos-sector-7/manifest.json','./maps/paltos-sector-7/cuarteles-fuente.json','./maps/paltos-sector-7/labels.json',
  './maps/paltos-sector-8/manifest.json','./maps/paltos-sector-8/cuarteles-fuente.json','./maps/paltos-sector-8/labels.json',
  './maps/paltos-y-cerezas-caseta-1/manifest.json','./maps/paltos-y-cerezas-caseta-1/cuarteles-fuente.json','./maps/paltos-y-cerezas-caseta-1/labels.json',
  './assets/icon-192.png','./assets/icon-512.png','./assets/favicon-logo.png','./assets/favicon.ico',
  './assets/fontawesome/css/all.min.css',
  './assets/fontawesome/webfonts/fa-solid-900.woff2',
  './assets/fontawesome/webfonts/fa-brands-400.woff2'
];
const absoluteURL=path=>new URL(path,self.registration.scope).href;

self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(SHELL);
  for(const path of CORE){
    const url=absoluteURL(path);
    const request=new Request(url,{method:'GET',cache:'reload',credentials:'same-origin'});
    let response;
    try{response=await fetch(request);}
    catch(error){throw new Error(`No se pudo descargar el recurso esencial ${path}: ${error?.message||error}`);}
    if(!response.ok)throw new Error(`Recurso esencial ${path}: HTTP ${response.status}`);
    const contentType=(response.headers.get('content-type')||'').toLowerCase();
    if((path.endsWith('.json')||path.endsWith('.webmanifest'))&&contentType.includes('text/html'))
      throw new Error(`Ruta incorrecta: ${path} devolvió HTML en lugar de datos.`);
    await cache.put(request,response.clone());
  }
  await self.skipWaiting();
})()));

async function copyUpdatedMetadata(shell,mapCacheName,paths){
  const mapCache=await caches.open(mapCacheName);
  for(const path of paths){
    const url=absoluteURL(path);
    const response=await shell.match(url);
    if(response)await mapCache.put(url,response.clone());
  }
}
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const shell=await caches.open(SHELL);
  await copyUpdatedMetadata(shell,MAP_BASE,[
    './map-svg/manifest-v34-5.json','./map-svg/cuarteles-fuente-v34-5.json','./map-svg/labels.json','./map-svg/extras.json'
  ]);
  await copyUpdatedMetadata(shell,'agrovalle-map-v34-8-paltos-caseta-2-y-3',[
    './maps/paltos-caseta-2-y-3/manifest.json','./maps/paltos-caseta-2-y-3/cuarteles-fuente.json','./maps/paltos-caseta-2-y-3/labels.json'
  ]);
  await copyUpdatedMetadata(shell,'agrovalle-map-v34-8-paltos-sector-7',[
    './maps/paltos-sector-7/manifest.json','./maps/paltos-sector-7/cuarteles-fuente.json','./maps/paltos-sector-7/labels.json'
  ]);
  await copyUpdatedMetadata(shell,'agrovalle-map-v34-8-paltos-sector-8',[
    './maps/paltos-sector-8/manifest.json','./maps/paltos-sector-8/cuarteles-fuente.json','./maps/paltos-sector-8/labels.json'
  ]);
  await copyUpdatedMetadata(shell,'agrovalle-map-v34-8-paltos-y-cerezas-caseta-1',[
    './maps/paltos-y-cerezas-caseta-1/manifest.json','./maps/paltos-y-cerezas-caseta-1/cuarteles-fuente.json','./maps/paltos-y-cerezas-caseta-1/labels.json'
  ]);
  await self.clients.claim();
  // Solo retirar shells antiguos si la nueva caché esencial está completa.
  const complete=await Promise.all(CORE.map(path=>shell.match(absoluteURL(path)))).then(items=>items.every(Boolean));
  if(complete){
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name.startsWith('agrovalle-shell-v33-')||
      (name.startsWith('agrovalle-shell-v34-')&&name!==SHELL)).map(name=>caches.delete(name)));
  }
  // Las cachés de mapas nunca se eliminan durante una actualización de la interfaz.
})()));

self.addEventListener('message',event=>{
  if(event.data?.type==='AGRO_GET_VERSION'){
    const port=event.ports?.[0];
    if(port)port.postMessage({version:SW_VERSION});
  }
});

const LOGO_URL='https://www.image2url.com/r2/default/images/1794304567912-d9d872ca-f71a-44ab-8213-dafedd1ed0b5.png';
function mapCacheFor(url){
  const path=new URL(url).pathname;
  if(path.includes('/map-svg/'))return MAP_BASE;
  const match=path.match(/\/maps\/([^/]+)\//);
  if(match)return `agrovalle-map-v34-8-${match[1]}`;
  return null;
}
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  if(request.url===LOGO_URL){
    event.respondWith((async()=>{
      const cache=await caches.open(SHELL),stored=await cache.match(request);
      if(stored)return stored;
      try{const response=await fetch(request);if(response.ok||response.type==='opaque')await cache.put(request,response.clone());return response;}
      catch(error){return Response.error();}
    })());return;
  }
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.endsWith('/maps/catalog.json')){
    // Network-first: never let an older cached catalog hide newly added maps.
    // Keep the last verified copy only as an offline fallback.
    event.respondWith((async()=>{
      const cache=await caches.open(SHELL);
      const canonical=absoluteURL('./maps/catalog.json');
      try{
        const fresh=await fetch(new Request(request,{cache:'no-store'}));
        if(fresh.ok){try{await cache.put(canonical,fresh.clone());}catch(error){}}
        return fresh;
      }catch(error){
        const cached=await cache.match(canonical)||await cache.match(request,{ignoreSearch:true});
        if(cached)return cached;
        return Response.error();
      }
    })());return;
  }
  const mapCache=mapCacheFor(request.url);
  if(mapCache){
    event.respondWith((async()=>{
      const cache=await caches.open(mapCache),cached=await cache.match(request,{ignoreSearch:true});
      if(cached)return cached;
      const response=await fetch(request);
      if(response.ok){try{await cache.put(request,response.clone());}catch(error){}}
      return response;
    })());return;
  }
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request);
        if(response.ok){try{await (await caches.open(SHELL)).put(absoluteURL('./index.html'),response.clone());}catch(error){}}
        return response;
      }catch(error){
        const cache=await caches.open(SHELL);
        return await cache.match(absoluteURL('./index.html'))||Response.error();
      }
    })());return;
  }
  event.respondWith((async()=>{
    const cache=await caches.open(SHELL),cached=await cache.match(request,{ignoreSearch:true});
    if(cached)return cached;
    try{
      const response=await fetch(request);
      if(response.ok){try{await cache.put(request,response.clone());}catch(error){}}
      return response;
    }catch(error){return Response.error();}
  })());
});
