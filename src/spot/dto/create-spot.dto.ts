import { z } from 'zod';

export class CreateSpotDto {
  room: string;
  place: string;
  userId: number;
}

export const CreateSpotSchema = z.object({
  room: z.string(),
  place: z.string(),
  userId: z.number(),
});
