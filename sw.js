/* Agro Valle V34 SVG: app shell + assets offline with Cache Storage */
const SHELL='agrovalle-shell-v34-5-ubicaciones';
// Mantener el caché de la fotografía y 35 SVG originales: sólo cambia el catálogo.
const MAP='agrovalle-map-v34-4-precision';
const CORE=['./','./index.html','./manifest.webmanifest','./map-svg/manifest-v34-5.json','./map-svg/cuarteles-fuente-v34-5.json','./map-svg/labels.json','./map-svg/extras.json','./map-svg/vista-general-satelital.jpg','./assets/icon-192.png','./assets/icon-512.png','./assets/fontawesome/css/all.min.css','./assets/fontawesome/webfonts/fa-solid-900.woff2','./assets/fontawesome/webfonts/fa-brands-400.woff2'];
self.addEventListener('install',e=>e.waitUntil((async()=>{
 // No activar una versión nueva si faltan archivos esenciales: conservar
 // el Service Worker anterior evita la pantalla blanca al perder señal.
 const cache=await caches.open(SHELL);
 try{
  for(const u of CORE){
   const r=await fetch(u,{cache:'reload'});
   if(!r.ok)throw Error(`Recurso esencial ${u} HTTP ${r.status}`);
   await cache.put(u,r);
  }
  await self.skipWaiting();
 } catch(err){
  await caches.delete(SHELL);
  throw err;
 }
})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 await self.clients.claim();
 const names=await caches.keys();
 await Promise.all(names.filter(n=>n.startsWith('agrovalle-shell-v33-')||n.startsWith('agrovalle-shell-v34-')&&n!==SHELL).map(n=>caches.delete(n)));
})()));
const LOGO_URL='https://www.image2url.com/r2/default/images/1794304567912-d9d872ca-f71a-44ab-8213-dafedd1ed0b5.png';
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 // El logo viene de un servidor externo: priorizar la copia local tras la primera carga.
 if(req.url===LOGO_URL){
  e.respondWith((async()=>{
   const cache=await caches.open(SHELL);
   const stored=await cache.match(req);
   if(stored)return stored;
   try{const response=await fetch(req);if(response.ok||response.type==='opaque')await cache.put(req,response.clone());return response;}
   catch(err){return Response.error();}
  })());return;
 }
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 if(url.pathname.includes('/map-svg/')){
  e.respondWith((async()=>{
   const map=await caches.open(MAP),shell=await caches.open(SHELL);
   const cached=await map.match(req,{ignoreSearch:true})||await shell.match(req,{ignoreSearch:true});
   if(cached)return cached;
   const r=await fetch(req);
   if(r.ok){try{await map.put(req,r.clone());}catch(err){}}
   return r;
  })());return;
 }
 if(req.mode==='navigate'){
  e.respondWith((async()=>{
   try{const r=await fetch(req);if(r.ok){try{await (await caches.open(SHELL)).put('./index.html',r.clone());}catch(e){}}return r;}
   catch(err){const c=await caches.open(SHELL);return await c.match('./index.html')||await c.match('./')||Response.error();}
  })());return;
 }
 e.respondWith((async()=>{
  const c=await caches.open(SHELL),cached=await c.match(req,{ignoreSearch:true});
  if(cached)return cached;
  try{const r=await fetch(req);if(r.ok){try{await c.put(req,r.clone());}catch(err){}}return r;}
  catch(err){return Response.error();}
 })());
});