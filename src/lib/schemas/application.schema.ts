import { z } from "zod";

export const applicationSchema = z.object({
  fullName: z.string().min(1, "Nombre completo requerido").max(255),
  email: z.string().email("Correo inválido").max(255),
  dni: z.string().min(4, "DNI muy corto").max(64, "DNI muy largo"),
  phone: z.string().max(64).optional(),
  acceptPolicy: z.literal(true, {
    errorMap: () => ({ message: "Debes aceptar la política de privacidad" }),
  }),
});

export type ApplicationSchema = z.infer<typeof applicationSchema>;
