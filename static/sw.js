const CACHE_NAME    = "crm-cache-v1";
const API_CACHE     = "crm-api-cache-v1";
const OFFLINE_URL   = "/offline.html";

// ملفات تُحفظ عند التثبيت
const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/static/manifest.webmanifest",
  "/static/icons/icon-192.png",
  "/static/icons/icon-512.png",
];

// ─── Install ──────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ─── Activate ────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== API_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // تجاهل الـ admin و API auth
  if (url.pathname.startsWith("/admin/") ||
      url.pathname.startsWith("/api/v1/auth/")) {
    return;
  }

  // API calls — Network first, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets — Cache first
  event.respondWith(cacheFirstStrategy(request));
});

// Network first — للـ API
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || new Response(
      JSON.stringify({ error: "Offline — no cached data available." }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
}

// Cache first — للـ static
async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const offline = await caches.match(OFFLINE_URL);
    return offline || new Response("Offline", { status: 503 });
  }
}

// ─── Push Notifications ───────────────────────────────────────
self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || "CRM", {
      body:  data.body  || "",
      icon:  "/static/icons/icon-192.png",
      badge: "/static/icons/icon-72.png",
      dir:   "rtl",
      lang:  "ar",
      data:  { url: data.url || "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});