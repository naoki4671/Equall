const CACHE_NAME = 'warikan-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Firestore/Firebase通信はキャッシュせず素通しする。静的ファイルのみキャッシュ優先。
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('firestore') || url.includes('googleapis') || url.includes('gstatic.com/firebasejs')) {
    return; // ネットワークにそのまま通す
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
