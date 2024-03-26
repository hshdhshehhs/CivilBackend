importScripts('/js/misc/config.js');
importScripts('/js/misc/worker.js');
importScripts('/js/bundle.js');
importScripts('/js/config.js');
importScripts(__uv$config.sw || '/js/sw.js');

const uv = new UVServiceWorker();
const dynamic = new Dynamic();

let userKey = new URL(location).searchParams.get('userkey');
self.dynamic = dynamic;

self.addEventListener('fetch', (e) => {
    e.respondWith(
        uv.fetch(e)
    );
});