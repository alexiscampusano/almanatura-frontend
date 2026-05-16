import { useState } from "react";
import { getErrorMessage } from "@/lib/error-handler";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createOutboundNotification } from "@/services/admin-notifications.service";
import { useQueryClient } from "@tanstack/react-query";

export function AdminNotificationsPage() {
  const queryClient = useQueryClient();
  const [recipientHint, setRecipientHint] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastId, setLastId] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLastId(null);
    setPending(true);
    try {
      const res = await createOutboundNotification({
        channel: "EMAIL",
        recipientHint: recipientHint.trim(),
        ...(subject.trim() ? { subject: subject.trim() } : {}),
        ...(body.trim() ? { body: body.trim() } : {}),
      });
      setLastId(res.id);
      await queryClient.invalidateQueries({
        queryKey: ["admin-reports", "summary"],
      });
      setRecipientHint("");
      setSubject("");
      setBody("");
    } catch (err) {
      setError(getErrorMessage(err, "No se pudo registrar la notificación."));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-lg space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Registrar notificación</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Deja constancia de un envío previsto (correo). El sistema la guarda
          como pendiente para auditoría; el envío real puede configurarse más
          adelante.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notif-recipient">
            Destinatario (correo o referencia) *
          </Label>
          <Input
            id="notif-recipient"
            required
            maxLength={255}
            type="email"
            autoComplete="email"
            placeholder="actor@ejemplo.org"
            value={recipientHint}
            onChange={(e) => setRecipientHint(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notif-subject">Asunto</Label>
          <Input
            id="notif-subject"
            maxLength={500}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notif-body">Cuerpo del mensaje</Label>
          <Textarea
            id="notif-body"
            rows={6}
            maxLength={10_000}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {lastId != null && (
          <p className="text-sm text-muted-foreground">
            Registro creado (ID {lastId}, estado pendiente). Puedes ver el total
            acumulado en Reportes.
          </p>
        )}

        <Button type="submit" disabled={pending}>
          {pending ? "Guardando..." : "Registrar notificación"}
        </Button>
      </form>
    </section>
  );
}
