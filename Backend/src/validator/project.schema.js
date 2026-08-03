import { z } from "zod";

export const projectRequestSchema = z.object({
  name: z.string(),
  description: z.optional(),
});
