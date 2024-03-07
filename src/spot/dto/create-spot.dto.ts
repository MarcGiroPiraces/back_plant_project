import { z } from 'zod';

export const createSpotDtoSchema = z
  .object({
    room: z.string(),
    place: z.string(),
    userId: z.number(),
  })
  .required();

export type CreateSpotDto = z.infer<typeof createSpotDtoSchema>;
