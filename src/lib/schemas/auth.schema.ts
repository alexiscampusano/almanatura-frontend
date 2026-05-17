import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo inválido").min(1, "Correo requerido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
