
self.addEventListener('install', (e) => {
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  // simple network-first strategy
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
