import { z } from 'zod';
import { Room, roomOptions } from '../entities/spot.entity';

export class CreateSpotDto {
  room: Room;
  place: string;
  userId: number;
}

export const CreateSpotSchema = z.object({
  room: z.nativeEnum(roomOptions),
  place: z.string(),
  userId: z.number(),
});
