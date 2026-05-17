import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AdminPage, AdminPageNarrow } from "@/components/admin/admin-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getErrorMessage } from "@/lib/error-handler";
import { notificationSchema, type NotificationSchema } from "@/lib/schemas";
import { createOutboundNotification } from "@/services/admin-notifications.service";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminNotificationsPage() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<NotificationSchema>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      recipientHint: "",
      subject: "",
      body: "",
    },
  });

  const onSubmit = async (data: NotificationSchema) => {
    try {
      const res = await createOutboundNotification({
        channel: "EMAIL",
        recipientHint: data.recipientHint.trim(),
        ...(data.subject?.trim() ? { subject: data.subject.trim() } : {}),
        ...(data.body?.trim() ? { body: data.body.trim() } : {}),
      });
      reset();
      await queryClient.invalidateQueries({
        queryKey: ["admin-reports", "summary"],
      });
      return res;
    } catch (err) {
      setError("root", {
        message: getErrorMessage(err, "No se pudo registrar la notificación."),
      });
      throw err;
    }
  };

  return (
    <AdminPage>
      <div>
        <h2 className="text-2xl font-semibold">Registrar notificación</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Deja constancia de un envío previsto (correo). El sistema la guarda
          como pendiente para auditoría; el envío real puede configurarse más
          adelante.
        </p>
      </div>

      <AdminPageNarrow>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {errors.root && (
            <p className="text-sm text-destructive" role="alert">
              {errors.root.message}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="notif-recipient">
              Destinatario (correo o referencia) *
            </Label>
            <Input
              id="notif-recipient"
              type="email"
              autoComplete="email"
              placeholder="actor@ejemplo.org"
              disabled={isSubmitting}
              className="h-11 w-full"
              {...register("recipientHint")}
            />
            {errors.recipientHint && (
              <p className="text-sm text-destructive">
                {errors.recipientHint.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notif-subject">Asunto</Label>
            <Input
              id="notif-subject"
              maxLength={500}
              disabled={isSubmitting}
              className="h-11 w-full"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">
                {errors.subject.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notif-body">Cuerpo del mensaje</Label>
            <Textarea
              id="notif-body"
              rows={6}
              maxLength={10_000}
              disabled={isSubmitting}
              className="w-full"
              {...register("body")}
            />
            {errors.body && (
              <p className="text-sm text-destructive">{errors.body.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Guardando..." : "Registrar notificación"}
          </Button>
        </form>
      </AdminPageNarrow>
    </AdminPage>
  );
}
