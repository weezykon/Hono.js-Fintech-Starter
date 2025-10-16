import * as bcrypt from 'bcryptjs';
import { sign } from 'hono/jwt';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePasswords = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const createToken = async (payload: { id: number; email: string }) => {
  return sign(payload, process.env.JWT_SECRET || 'your-secret-key');
};
