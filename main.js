import http from 'node:https';
import { createBareServer } from 'npm:@tomphttp/bare-server-node';
import express from 'npm:express';

const PORT = 8080;

const server = http.createServer();

const app = express(server);

const bareServer = createBareServer('/depo/');

server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.on('listening', () => {
    console.log(`Running at http://localhost:${PORT}`);
});