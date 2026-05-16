import { z } from "zod";

export const notificationSchema = z.object({
  recipientHint: z.string().email("Correo inválido").max(255),
  subject: z.string().max(500).optional(),
  body: z.string().max(10000).optional(),
});

export type NotificationSchema = z.infer<typeof notificationSchema>;
