importScripts('./misc/config.js');
importScripts('./misc/worker.js');
importScripts(__uv$config.sw ||'./sw.js');
importScripts('./bundle.js');
importScripts('./config.js');

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

            if (e.request.url.startsWith(location.origin + '/document/')) {
                return await uv.fetch(e);
            }

            return await fetch(e.request);
        })()
    );
});