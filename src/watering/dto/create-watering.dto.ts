import { z } from 'zod';

export interface CreateWateringDto {
  date: string | Date;
  fertilizer: boolean;
  plantId: number;
}

export const createWateringSchema = z.object({
  date: z.string() || z.date(),
  fertilizer: z.boolean(),
  plantId: z.number(),
});
