import { Hono } from 'hono';
import auth from './routes/auth/auth.controller';
import { authMiddleware } from './middleware/auth.middleware';
import * as dotenv from 'dotenv';

import { logger } from './middleware/logging.middleware';
import { errorHandler } from './middleware/error.middleware';
import jobs from './routes/jobs/jobs.controller';
import { serve } from '@hono/node-server';

dotenv.config();

const app = new Hono();

app.use('*', logger);
app.use('*', errorHandler);

app.route('/auth', auth);
app.route('/jobs', jobs);

app.get('/me', authMiddleware, (c) => {
  const payload = c.get('jwtPayload');
  return c.json({ user: payload });
});

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    message: 'Server is healthy and running',
  });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

serve(
  {
    fetch: app.fetch,
    port: PORT,
  },
  () => {
    console.log('\n=================================');
    console.log('🚀 Server is running!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`💚 Health: http://localhost:${PORT}/health`);
    console.log('=================================\n');
  }
);

export default app;