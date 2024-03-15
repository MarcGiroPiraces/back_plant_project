import { z } from 'zod';

export const findAllTransplantingsSchema = z
  .object({
    plantId: z
      .string()
      .min(1)
      .max(255)
      .optional()
      .transform((value) => parseInt(value)),
  })
  .required();

export type FindAllTransplantingsDto = z.infer<
  typeof findAllTransplantingsSchema
>;
