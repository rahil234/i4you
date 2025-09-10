import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST || []);

// self.addEventListener("fetch", (event) => {
//   if (event.request.url.includes("/api/")) {
//     event.respondWith(
//       fetch(event.request)
//         .then((response) => {
//   //        Clone and store in cache
          // const resClone = response.clone();
          // caches.open("api-cache").then((cache) => {
          //   cache.put(event.request, resClone);
          // });
          // return response;
        // })
        // .catch(() => {
       // //  Fallback to cache if offline
       //    return caches.match(event.request);
        // })
    // );
  // }
// });

self.addEventListener("push", (event) => {
    if (event.data) {
        const data = event.data.json();

        event.waitUntil(
            self.registration.showNotification(data.title, {
                body: data.body,
                icon: "/icons/icon-192x192.png",
                badge: "/icons/icon-192x192.png",
                vibrate: [100, 50, 100],
                data: data.url || "/",
            })
        );
    }
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data)
    );
});
