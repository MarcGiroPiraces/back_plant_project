import { z } from 'zod';

export const createPlantDtoSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    atHomeSince: z.date(),
    userId: z.number(),
    spotId: z.number(),
  })
  .required();

export type CreatePlantDto = z.infer<typeof createPlantDtoSchema>;
