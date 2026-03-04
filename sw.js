const CACHE_NAME = 'hk-offline-v8';
const APP_SHELL = [
  './',
  './index.html',
  './Build/hktruffled.loader.js',
  './Build/hktruffled.framework.js'
];

self.addEventListener('install', (event) => {
  // Force the App Shell into cache immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. If it's in cache, return it (works offline)
      if (cachedResponse) return cachedResponse;

      // 2. If not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Cache data parts as they are downloaded
        if (event.request.url.includes('.part') || event.request.url.includes('.wasm')) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cacheCopy);
          });
        }
        return networkResponse;
      });
    })
  );
});
