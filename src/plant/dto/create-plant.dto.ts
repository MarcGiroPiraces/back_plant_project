import { z } from 'zod';

export const createPlantDtoSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    atHomeSince: z.string(),
    spotId: z.number(),
    //S userId: z.number().optional(),
  })
  .required();

export type CreatePlantDto = z.infer<typeof createPlantDtoSchema>;
