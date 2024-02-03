import { z } from 'zod';

export interface CreatePlantDto {
  name: string;
  description: string;
  userId: number;
  spotId: number;
}

export const createPlantDtoSchema = z.object({
  name: z.string(),
  description: z.string(),
  userId: z.number(),
  spotId: z.number(),
});
