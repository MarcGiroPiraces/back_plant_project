import { z } from 'zod';

export const createWateringDtoSchema = z.object({
  date: z.string() || z.date(),
  fertilizer: z.boolean(),
  plantId: z.number(),
});

export type CreateWateringDto = z.infer<typeof createWateringDtoSchema>;
