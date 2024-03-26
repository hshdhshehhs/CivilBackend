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
        { path: '/settings', file: 'src/settings.html' },
        { path: '/sw.js', file: 'src/sw.js' }
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

    router.get('/document/', (ctx) => {
        bareServer.routeRequest(ctx.request, ctx.response);
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