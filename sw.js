/* English Coach service worker. Offline first: every request is answered from the cache when possible.
   Release rule: change VERSION whenever any file changes. The new worker installs a fresh cache and
   waits; the page shows a "new version" banner and activates it only when the learner taps reload.
   Code files are never refreshed behind the learner's back, so a page can not mix two versions.
   Content packs are plain data, so those are also refreshed from the network in the background. */
var VERSION = '2.1.0';
var CACHE = 'ec-' + VERSION;
var ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'favicon.ico',
  'js/content.js',
  'js/store.js',
  'js/app.js',
  'packs/unit-1.5-daily-routine.json',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ASSETS.map(function (a) { return new Request(a, { cache: 'reload' }); })); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k.indexOf('ec-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('message', function (e) { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });

function refresh(req) {
  return fetch(req).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
    return res;
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  var isPack = /\/packs\/[^/]+\.json$/.test(new URL(req.url).pathname);
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(function (hit) {
    if (hit) {
      if (isPack) e.waitUntil(refresh(req).catch(function () { /* offline */ }));
      if (req.mode === 'navigate') e.waitUntil(self.registration.update().catch(function () { /* offline */ }));
      return hit;
    }
    return refresh(req).catch(function () {
      if (req.mode === 'navigate') return caches.match('index.html');
      return new Response('', { status: 504, statusText: 'Offline' });
    });
  }));
});
