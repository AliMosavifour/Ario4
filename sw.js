/* Ario service worker: lets the app open offline and be installed. Bump nothing by hand - the build stamps 202611082134. */
var CACHE='ario-202611082134';
var CORE=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon-maskable-512.png','./lib/pdf-lib.min.js'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE&&k.indexOf('ario-')===0}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
/* same-origin only: open instantly from the cache and refresh it in the background (new version shows on the next open) */
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET')return;
  var u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith(caches.open(CACHE).then(function(c){
    return c.match(r,{ignoreSearch:true}).then(function(hit){
      var net=fetch(r).then(function(res){if(res&&res.ok)c.put(r,res.clone());return res}).catch(function(){return hit});
      return hit||net;
    });
  }));
});
