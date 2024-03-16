importScripts('./js/misc/config.js');
importScripts('./js/misc/worker.js');
importScripts('./js/bundle.js');
importScripts('./js/config.js');
importScripts('./js/sw.js');

const uv = new UVServiceWorker();
const dynamic = new Dynamic();

let userKey = new URL(location).searchParams.get('userkey');
self.dynamic = dy;

self.addEventListener('fetch', (e) => {
    e.respondWith(
        (async () => {
            if (await dynamic.route(e)) {
                return await dynamic.fetch(e);
            }

            if (e.request.url.startsWith(location.origin + '/')) {
                return await uv.fetch(e);
            }

            return await fetch(e.request);
        })()
    );
});