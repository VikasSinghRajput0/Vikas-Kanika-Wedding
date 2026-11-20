/**
 * Kanika & Vikas Wedding - Lightweight Offline Service Worker
 * Ensures guests can access schedules, venues, and contacts even with spotty connectivity.
 */

const CACHE_NAME = 'kanika-vikas-wedding-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './invitation-card.html',
  './css/style.css?v=2.2',
  './css/himachali-vedic.css?v=2.2',
  './js/main.js',
  './js/wedding-custom.js?v=2.2',
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
  if (event.request.method !== 'GET') return;

  if (event.request.url.startsWith(self.location.origin)) {
    // Network First for HTML, CSS, JS so updates appear immediately
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
