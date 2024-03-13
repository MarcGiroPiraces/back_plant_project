import { z } from 'zod';

export const findAllPlantsSchema = z
  .object({
    userId: z
      .string()
      .min(1)
      .max(255)
      .optional()
      .transform((value) => parseInt(value)),
    spotId: z
      .string()
      .min(1)
      .max(255)
      .optional()
      .transform((value) => parseInt(value)),
  })
  .required();

export type FindAllPlantsDto = z.infer<typeof findAllPlantsSchema>;
