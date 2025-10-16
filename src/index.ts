import { Hono } from 'hono';
import auth from './routes/auth/auth.controller';
import { authMiddleware } from './middleware/auth.middleware';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new Hono();

import jobs from './routes/jobs/jobs.controller';

app.route('/auth', auth);
app.route('/jobs', jobs);

app.get('/me', authMiddleware, (c) => {
  const payload = c.get('jwtPayload');
  return c.json({ user: payload });
});

export default app;
