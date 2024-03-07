import { z } from 'zod';

export const createUserSchema = z
  .object({
    name: z.string().min(1).max(255),
    email: z.string().email(),
    password: z.string().min(4).max(255),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
