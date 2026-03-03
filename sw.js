const CACHE_NAME = 'hk-vault-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Only intercept local Build files
    if (event.request.url.includes('/Build/')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(event.request).then((networkResponse) => {
                    if (networkResponse.status === 200) {
                        const cacheCopy = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, cacheCopy);
                        });
                    }
                    return networkResponse;
                });
            })
        );
    } else {
        // Standard cache-first for index.html and other roots
        event.respondWith(
            caches.match(event.request).then(r => r || fetch(event.request))
        );
    }
});
