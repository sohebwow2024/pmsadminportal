// var staticCacheName = "pwa";

// self.addEventListener("install", function (e) {
//     e.waitUntil(
//         caches.open(staticCacheName).then(function (cache) {
//             return cache.addAll(["/"]);
//         })
//     );
// });

// self.addEventListener("fetch", function (event) {
//     // console.log(event.request.url);

//     event.respondWith(
//         caches.match(event.request).then(function (response) {
//             return response || fetch(event.request);
//         })
//     );
// });

// added this code by 1/12/25
var staticCacheName = "pwa";

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll(["/"]); // only static root cache
    })
  );
});

self.addEventListener("fetch", function (event) {
  const url = event.request.url;

  // ❌ IMPORTANT: Do NOT allow service worker to handle API calls
  if (
    url.includes("/api/") ||
    url.includes("/getdata/") ||
    url.includes("/bookingdata/")
  ) {
    return; // bypass SW → fetch normally
  }

  // ✔ Only static assets served from cache
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
