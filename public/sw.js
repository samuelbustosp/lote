// Basic PWA Service Worker for offline resilience
const CACHE_NAME = "lote-v1";
const STATIC_ASSETS = ["/", "/manifest.json", "/globals.css"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match("/") || new Response("LOTE Offline", { headers: { "Content-Type": "text/plain" } });
      })
    );
  }
});
