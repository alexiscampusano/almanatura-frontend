import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nombre requerido").max(120),
  email: z.string().email("Correo inválido").max(180),
  password: z
    .string()
    .min(12, "Debe tener al menos 12 caracteres")
    .max(100, "Máximo 100 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{}|;:,.?]).*$/,
      "Debe incluir una minúscula, mayúscula, un número y un carácter especial",
    ),
  role: z.enum(["SUPER_USER", "EVENT_MANAGER"]),
});

export type CreateUserSchema = z.infer<typeof createUserSchema>;
