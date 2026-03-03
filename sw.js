const CACHE_NAME = 'hk-offline-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './Build/hktruffled.loader.js',
  './Build/hktruffled.framework.js'
];

// Install: Cache the basic engine files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache everything we fetch (the data parts) on the fly
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      }).catch(() => {
        // If both fail, we are truly offline and it's not in cache
        return new Response("Offline and not cached", { status: 503 });
      });
    })
  );
});
