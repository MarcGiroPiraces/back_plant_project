import { z } from 'zod';

export interface CreateTransplantingDto {
  date: string | Date;
  plantId: number;
  potUpsize: boolean;
  soilChange: boolean;
  soilMix: string;
}

export const createTransplantingSchema = z.object({
  date: z.string() || z.date(),
  plantId: z.number(),
  potUpsize: z.boolean(),
  soilChange: z.boolean(),
  soilMix: z.string(),
});
