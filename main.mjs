import {
    Application,
    Router
} from "https://deno.land/x/oak@v13.2.5/mod.ts";
import {
    createBareServer
} from 'npm:@tomphttp/bare-server-node';
import { basicAuth } from "https://deno.land/x/basic_auth@v1.1.1/mod.ts";
import config from './config.mjs';
import { join } from 'https://deno.land/std@0.220.1/path/mod.ts';
import { serveFile } from 'https://deno.land/std@0.220.1/http/file_server.ts';
const app = new Application();
const bareServer = createBareServer('/depo/');
const PORT = Deno.env.get('PORT') || 8080;

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
        { path: '/home', file: 'assets/index.html' },
        { path: '/settings', file: 'assets/settings.html' }
    ];

    routes.forEach((route) => {
        router.get(route.path, (ctx) => {
            serveFile(ctx, join(__dirname, 'assets', route.file));
        });
    }); 
}

const router = new Router();

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