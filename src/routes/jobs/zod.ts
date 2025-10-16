import { z } from 'zod';

export const sendEmailSchema = z.object({
  email: z.string().email(),
});
