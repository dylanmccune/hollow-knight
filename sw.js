const CACHE_NAME = 'hk-offline-v1';

// We don't pre-cache the big parts because that will crash the browser 
// during the install phase. We will use a "Cache-First" strategy instead.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          // Only cache successful responses
          if (fetchResponse.status === 200) {
            cache.put(event.request, fetchResponse.clone());
          }
          return fetchResponse;
        });
      });
    })
  );
});
