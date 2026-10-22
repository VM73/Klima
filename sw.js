// Klima postupy – service worker
// Appka se otevře i bez signálu (postupy z poslední synchronizace).
// Při změně souborů zvyš číslo verze.
const CACHE = "klima-v1";
const SOUBORY = ["./", "index.html", "manifest.webmanifest", "icon-180.png", "icon-512.png"];
const KNIHOVNA = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(SOUBORY).then(() => c.add(KNIHOVNA).catch(() => {})))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((k) => Promise.all(k.filter((x) => x.startsWith("klima-") && x !== CACHE).map((x) => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const vlastni = url.origin === self.location.origin && url.pathname.startsWith(new URL("./", self.location).pathname);
  const knihovna = req.url.startsWith("https://cdn.jsdelivr.net/npm/@supabase/");
  const pismo = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!vlastni && !knihovna && !pismo) return; // Supabase API vždy přímo ze sítě

  // nejdřív síť (aby se projevily aktualizace), bez signálu z cache
  e.respondWith(
    fetch(req)
      .then((r) => {
        if (r.ok || r.type === "opaque") {
          const kopie = r.clone();
          caches.open(CACHE).then((c) => c.put(req, kopie));
        }
        return r;
      })
      .catch(() => caches.match(req).then((r) => r || (vlastni ? caches.match("index.html") : undefined)))
  );
});
