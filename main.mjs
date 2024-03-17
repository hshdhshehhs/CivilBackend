import {
    Application,
    Router
} from 'oak';
import {
    createBareServer
} from 'tomp';
const app = new Application();
const bareServer = createBareServer('/depo/');
const PORT = Deno.env.get('PORT') || 8000;

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