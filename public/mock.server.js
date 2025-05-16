self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (['/mock-server/api/init', '/mock-server/api/spin'].includes(url.pathname)) {
    const headers = { 'Content-Type': 'application/json' };
    const symbols = Array.from({ length: 3 }, () => 1 + Math.floor(Math.random() * 3));
    const set = new Set(symbols);
    event.respondWith(new Response(JSON.stringify({ symbols, win: set.size === 1 }), { headers }));
  }
});
