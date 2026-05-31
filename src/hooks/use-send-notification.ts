import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { createOutboundNotification } from "@/services/admin-notifications.service";
import type { CreateOutboundNotificationPayload } from "@/types/notification";

export function useSendNotification() {
  return useMutation({
    mutationFn: (data: CreateOutboundNotificationPayload) =>
      createOutboundNotification(data),
    onSuccess: () => {
      toast.success("Notificación enviada correctamente.");
    },
    onError: (error: unknown) => {
      console.error("Failed to send notification", error);
      let msg = "Ocurrió un error al enviar el correo.";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      }
      toast.error(msg);
    },
  });
}
