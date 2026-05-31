import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createOutboundNotification } from "@/services/admin-notifications.service";
import type { CreateOutboundNotificationPayload } from "@/types/notification";

export function useSendNotification() {
  return useMutation({
    mutationFn: (data: CreateOutboundNotificationPayload) =>
      createOutboundNotification(data),
    onSuccess: () => {
      toast.success("Notificación enviada correctamente.");
    },
    onError: (error: Error | unknown) => {
      console.error("Failed to send notification", error);
      // @ts-expect-error - axios error structure
      const msg =
        error?.response?.data?.message ||
        "Ocurrió un error al enviar el correo.";
      toast.error(msg);
    },
  });
}
