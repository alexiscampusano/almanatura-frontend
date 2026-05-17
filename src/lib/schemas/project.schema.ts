import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Título requerido").max(255),
  description: z.string().max(10000).optional(),
  pillar: z.enum([
    "TECHNOLOGY",
    "EDUCATION",
    "HEALTH",
    "ENTREPRENEURSHIP",
    "CULTURE",
  ]),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  location: z.string().max(255).optional(),
  imageUrl: z
    .string()
    .url("URL inválida")
    .max(512)
    .optional()
    .or(z.literal("")),
});

export const updateProjectSchema = createProjectSchema.extend({
  status: z.enum(["DRAFT", "PUBLISHED", "CANCELLED"]).optional(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
