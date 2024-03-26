import {
    Application,
    Router
} from "https://deno.land/x/oak@v13.2.5/mod.ts";
import {
    createBareServer
} from 'npm:@tomphttp/bare-server-node';
import { basicAuth } from "https://deno.land/x/basic_auth@v1.1.1/mod.ts";
import config from './config.mjs';
const app = new Application();
const bareServer = createBareServer('/depo/');
const PORT = Deno.env.get('PORT') || 8080;

const router = new Router();

if (config.challenge) {
    console.log('Password protection enabled, usernames: ' + Object.keys(config.users));
    console.log('Passwords: ' + Object.values(config.users));

    app.use(
        basicAuth({
            users: config.users,
            challenge: true,
        })
    );
}

if (config.routes !== false) {
    const routes = [
        { path: '/', file: 'src/index.html' },
        { path: '/settings', file: 'src/settings.html' }
    ];

    const jsRoutes = [
        { path: 'handler.js', file: 'src/assets/js/handler.js' },
        { path: 'bundle.js', file: 'src/assets/js/bundle.js' },
        { path: 'config.js', file: 'src/assets/js/config.js' },
        { path: 'sw.js', file: 'src/assets/js/sw.js' },
        { path: '/js/misc/config.js', file: 'src/assets/js/misc/config.js' },
        { path: '/js/misc/worker.js', file: 'src/assets/js/misc/worker.js' },
        { path: '/js/bundle.js', file: 'src/assets/js/bundle.js' },
        { path: '/js/config.js', file: 'src/assets/js/config.js' },
        { path: '/js/sw.js', file: 'src/assets/js/sw.js' },
        { path: '/js/misc/handler.js', file: 'src/assets/js/misc/handler.js' },
        { path: '/js/misc/client.js', file: 'src/assets/js/misc/client.js' },
    ];

    routes.forEach((route) => {
        router.get(route.path, async (ctx) => {
            try {
                const fileContent = await Deno.readFile(route.file);
                ctx.response.body = new TextDecoder().decode(fileContent);
                ctx.response.type = 'html';
            } catch (_err) {
                ctx.response.status = 404;
                ctx.response.body = `Unable to find file: ${route.file}`;
            }
        });
    });

    jsRoutes.forEach((jsRoute) => {
        router.get(jsRoute.path, async (ctx) => {
            try {
                const fileContent = await Deno.readFile(jsRoute.file);
                ctx.response.body = new TextDecoder().decode(fileContent);
                ctx.response.type = 'js';
            } catch (_err) {
                ctx.response.status = 404;
                ctx.response.body = `Unable to find file: ${jsRoute.file}`;
            }
        });
    });

    router.get('/src/assets/styles/:filename', async (ctx) => {
        const filename = ctx.params.filename;
        const fileContent = await Deno.readFile(`src/assets/styles/${filename}`);
        ctx.response.body = new TextDecoder().decode(fileContent);
        ctx.response.type = 'css';
    });

    router.get('/src/assets/js/:filename', async (ctx) => {
        const filename = ctx.params.filename;
        const fileContent = await Deno.readFile(`src/assets/js/${filename}`);
        ctx.response.body = new TextDecoder().decode(fileContent);
        ctx.response.type = 'js';
    });

    router.get('/depo/period2/', (ctx) => {
        bareServer.routeRequest(ctx.request, ctx.response);
    });

    router.get('/document/period1/', (ctx) => {
        bareServer.routeRequest(ctx.request, ctx.response);
    });

    router.get('/sw.js', async (ctx) => {
        const fileContent = await Deno.readFile('src/sw.js');
        ctx.response.body = new TextDecoder().decode(fileContent);
        ctx.response.type = 'js';
        ctx.response.headers.set('Cache-Control', 'max-age=0, must-revalidate');
    });

    router.get('/document/:encodedUrl', async (ctx) => {
        const enc = ctx.params.encodedUrl;
        const url = new URL(`https://civil-1.3.us-1.fl0.io/document/${enc}`);
        const res = await fetch(url.toString());
        const body = res.text();
        ctx.response.body = body;
    });
}

app.use(router.routes());

app.addEventListener('listen', () => {
    console.log(`Running at http://localhost:${PORT}`);
});

await app.listen(`:${PORT}`);

bareServer.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app.handle(req, res);
    }
});

bareServer.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

bareServer.on('listening', () => {
    console.log(`Running at bare: http://localhost:${PORT}/depo/`);
});

bareServer.listen({
    port: PORT,
});