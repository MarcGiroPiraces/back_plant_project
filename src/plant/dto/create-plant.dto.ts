import { z } from 'zod';

export interface CreatePlantDto {
  name: string;
  description: string;
  atHomeSince: Date;
  userId: number;
  spotId: number;
}

export const createPlantDtoSchema = z.object({
  name: z.string(),
  description: z.string(),
  atHomeSince: z.date(),
  userId: z.number(),
  spotId: z.number(),
});
