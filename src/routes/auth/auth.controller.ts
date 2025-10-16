import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { registerSchema, loginSchema } from './zod';
import { hashPassword, createToken, comparePasswords } from './auth.service';
import { db } from '../../db';

const auth = new Hono();

auth.post('/register', zValidator('json', registerSchema), async (c) => {
  const { email, password } = c.req.valid('json');
  const hashedPassword = await hashPassword(password);

  try {
    const user = await db
      .insertInto('users')
      .values({ email, password: hashedPassword })
      .returning(['id', 'email'])
      .executeTakeFirstOrThrow();

    const token = await createToken({ id: user.id, email: user.email });

    return c.json({ token });
  } catch (error) {
    return c.json({ error: 'User already exists' }, 400);
  }
});

auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json');

  const user = await db
    .selectFrom('users')
    .selectAll()
    .where('email', '=', email)
    .executeTakeFirst();

  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const passwordMatch = await comparePasswords(password, user.password);

  if (!passwordMatch) {
    return c.json({ error: 'Invalid credentials' }, 401);
  }

  const token = await createToken({ id: user.id, email: user.email });

  return c.json({ token });
});

export default auth;
