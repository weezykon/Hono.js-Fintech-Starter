import { jwt } from 'hono/jwt';

export const authMiddleware = jwt({
  secret: process.env.JWT_SECRET || 'your-secret-key',
});
