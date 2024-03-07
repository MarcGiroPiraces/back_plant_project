import { z } from 'zod';
import { createSpotDtoSchema } from './create-spot.dto';

export const updateSpotDtoSchema = createSpotDtoSchema.partial();

export type UpdateSpotDto = z.infer<typeof updateSpotDtoSchema>;
