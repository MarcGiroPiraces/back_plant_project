import { z } from 'zod';

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export const createUserSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  password: z.string().min(4).max(255),
});
