import { Generated } from 'kysely';

export interface User {
  id: Generated<number>;
  email: string;
  password: string;
  created_at: Generated<Date>;
}
