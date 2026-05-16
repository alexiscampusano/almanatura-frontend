import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nombre requerido").max(120),
  email: z.string().email("Correo inválido").max(180),
  password: z.string().min(8, "Mínimo 8 caracteres").max(128),
  role: z.enum(["SUPER_USER", "EVENT_MANAGER"]),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
