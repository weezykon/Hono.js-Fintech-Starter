import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { sendEmailSchema } from './zod';
import { emailQueue } from '../../queues/email.queue';

const jobs = new Hono();

jobs.post('/send-email', zValidator('json', sendEmailSchema), async (c) => {
  const { email } = c.req.valid('json');

  await emailQueue.add('send-email-job', { email });

  return c.json({ message: 'Email job added to the queue' });
});

export default jobs;
