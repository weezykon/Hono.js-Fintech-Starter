import { Hono } from 'hono';
import auth from './routes/auth/auth.controller';
import { authMiddleware } from './middleware/auth.middleware';
import * as dotenv from 'dotenv';

import { logger } from './middleware/logging.middleware';
import { errorHandler } from './middleware/error.middleware';

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

export default app;
