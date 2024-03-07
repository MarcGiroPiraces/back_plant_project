import { z } from 'zod';

export const createTransplantingDtoSchema = z
  .object({
    date: z.string() || z.date(),
    plantId: z.number(),
    potUpsize: z.boolean(),
    soilChange: z.boolean(),
    soilMix: z.string(),
  })
  .required();

export type CreateTransplantingDto = z.infer<
  typeof createTransplantingDtoSchema
>;
