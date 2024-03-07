import { z } from 'zod';
import { createUserSchema } from './create-user.dto';

export const updateUserSchema = createUserSchema.partial();

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
