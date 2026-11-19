/**
 * Kanika & Vikas Wedding - Lightweight Offline Service Worker
 * Ensures guests can access schedules, venues, and contacts even with spotty connectivity.
 */

const CACHE_NAME = 'kanika-vikas-wedding-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './invitation-card.html',
  './css/style.css',
  './css/himachali-vedic.css',
  './js/main.js',
  './js/wedding-custom.js',
  './img/royal-vivah-crest.png',
  './img/invitation-card-full-preview.jpg',
  './img/favicon.ico',
  './Kanika-and-Vikas-Wedding.ics',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Stale-while-revalidate strategy for same-origin assets
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
