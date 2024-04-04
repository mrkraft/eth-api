import 'reflect-metadata';
import config from 'config-dug';

import { app } from './app';

const SERVER_PORT = (config.FASTIFY_PORT as number) || 3006;

app.listen({ port: SERVER_PORT });

console.log(`ETH API server running on: http://localhost:${SERVER_PORT}`);