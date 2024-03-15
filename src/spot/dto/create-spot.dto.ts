import { z } from 'zod';

export const createSpotDtoSchema = z
  .object({
    room: z.string(),
    place: z.string(),
  })
  .required();

export type CreateSpotDto = z.infer<typeof createSpotDtoSchema>;
