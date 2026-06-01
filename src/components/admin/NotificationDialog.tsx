import { useState } from "react";
import { Envelope } from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSendNotification } from "@/hooks/use-send-notification";

interface NotificationDialogProps {
  recipientEmail: string;
  recipientName?: string;
}

export function NotificationDialog({
  recipientEmail,
  recipientName,
}: NotificationDialogProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { mutate: sendNotification, isPending } = useSendNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;

    sendNotification(
      {
        channel: "EMAIL",
        recipientHint: recipientEmail,
        subject,
        body,
      },
      {
        onSuccess: () => {
          setOpen(false);
          setSubject("");
          setBody("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 text-muted-foreground shrink-0"
            title="Enviar Correo"
          >
            <Envelope size={16} />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enviar Correo Electrónico</DialogTitle>
            <DialogDescription>
              Redacta el mensaje que enviarás a{" "}
              <strong>{recipientName || recipientEmail}</strong> (
              {recipientEmail}).
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="subject" className="text-sm font-medium">
                Asunto
              </label>
              <Input
                id="subject"
                placeholder="Ej: Invitación a entrevista"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="body" className="text-sm font-medium">
                Mensaje
              </label>
              <Textarea
                id="body"
                placeholder="Escribe el contenido del correo aquí..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[150px]"
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !subject.trim() || !body.trim()}
            >
              {isPending ? "Enviando..." : "Enviar Correo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
