import fastify from 'fastify';

import { router } from './application/api/router';

const app = fastify({
});

app.register(router);

export { app };