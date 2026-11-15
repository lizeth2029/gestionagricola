/* GESTION AGRICOLA V34.10: historial visual, modo sol y favicon local.
   Los metadatos versionados se actualizan al activar el SW; los mosaicos ya instalados se conservan. */
const SHELL='agrovalle-shell-v34-10-history-visual';
const MAP_BASE='agrovalle-map-v34-4-precision';
const CORE=[
  './','./index.html','./manifest.webmanifest','./maps/catalog.json',
  './map-svg/manifest-v34-5.json','./map-svg/cuarteles-fuente-v34-5.json',
  './map-svg/labels.json','./map-svg/extras.json','./map-svg/vista-general-satelital.jpg',
  './maps/paltos-caseta-2-y-3/manifest.json','./maps/paltos-caseta-2-y-3/cuarteles-fuente.json','./maps/paltos-caseta-2-y-3/labels.json',
  './maps/paltos-sector-7/manifest.json','./maps/paltos-sector-7/cuarteles-fuente.json','./maps/paltos-sector-7/labels.json',
  './maps/paltos-sector-8/manifest.json','./maps/paltos-sector-8/cuarteles-fuente.json','./maps/paltos-sector-8/labels.json',
  './assets/icon-192.png','./assets/icon-512.png','./assets/favicon-logo.png','./assets/favicon.ico','./assets/fontawesome/css/all.min.css',
  './assets/fontawesome/webfonts/fa-solid-900.woff2','./assets/fontawesome/webfonts/fa-brands-400.woff2'
];
self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(SHELL);
  try{
    // Shell y metadatos pequeños: no descargar aquí toda la cartografía.
    for(const url of CORE){
      const response=await fetch(url,{cache:'reload'});
      if(!response.ok)throw Error(`Recurso esencial ${url} HTTP ${response.status}`);
      await cache.put(url,response);
    }
    await self.skipWaiting();
  }catch(error){
    await caches.delete(SHELL);
    throw error;
  }
})()));
async function copyUpdatedMetadata(shell,mapCacheName,urls){
  const mapCache=await caches.open(mapCacheName);
  for(const url of urls){
    const response=await shell.match(url);
    if(response)await mapCache.put(url,response.clone());
  }
}
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const shell=await caches.open(SHELL);
  // Reemplaza únicamente manifiestos/catálogos/etiquetas; conserva fotos y mosaicos ya descargados.
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
  await self.clients.claim();
  const names=await caches.keys();
  await Promise.all(names.filter(name=>name.startsWith('agrovalle-shell-v33-')||
    (name.startsWith('agrovalle-shell-v34-')&&name!==SHELL)).map(name=>caches.delete(name)));
  // No borrar cachés de mapas: las imágenes y sectores SVG existentes se reutilizan.
})()));
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
    event.respondWith((async()=>{
      const cache=await caches.open(SHELL),cached=await cache.match(request,{ignoreSearch:true});
      if(cached)return cached;
      const response=await fetch(request);
      if(response.ok){try{await cache.put(request,response.clone());}catch(error){}}
      return response;
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
        if(response.ok){try{await (await caches.open(SHELL)).put('./index.html',response.clone());}catch(error){}}
        return response;
      }catch(error){
        const cache=await caches.open(SHELL);
        return await cache.match('./index.html')||await cache.match('./')||Response.error();
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
