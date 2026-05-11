import type { FormEvent } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isAxiosError } from "axios";

import { submitApplication } from "@/services/applications.service";
import type { SubmitApplicationPayload } from "@/types/application";

type PublicApplicationDialogProps = {
  projectId: number;
  projectTitle: string;
};

function parseSubmitError(error: unknown): string {
  if (!isAxiosError(error)) {
    return "No se pudo enviar la solicitud. Inténtalo nuevamente.";
  }
  const status = error.response?.status;
  if (status === 409) {
    return "Ya existe una postulación con este correo para este proyecto.";
  }
  if (status === 404) {
    return "El proyecto no está disponible para postulación.";
  }
  if (status === 429) {
    return "Demasiados intentos. Espera un momento e inténtalo de nuevo.";
  }
  if (status === 400) {
    const body = error.response?.data as { message?: string } | undefined;
    if (body?.message) return body.message;
    return "Revisa los datos del formulario.";
  }
  return "No se pudo enviar la solicitud. Inténtalo nuevamente.";
}

export function PublicApplicationDialog({
  projectId,
  projectTitle,
}: PublicApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [phone, setPhone] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function reset() {
    setFullName("");
    setEmail("");
    setDni("");
    setPhone("");
    setAcceptPolicy(false);
    setError(null);
    setSuccess(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      reset();
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!acceptPolicy) {
      setError("Debes aceptar la política de privacidad.");
      return;
    }
    const payload: SubmitApplicationPayload = {
      projectId,
      fullName: fullName.trim(),
      email: email.trim(),
      dni: dni.trim(),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
    };
    setSubmitting(true);
    try {
      await submitApplication(payload);
      setSuccess(true);
    } catch (err) {
      setError(parseSubmitError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="h-12 w-full rounded-lg text-base font-semibold md:h-12" />
        }
      >
        Quiero participar
      </DialogTrigger>
      <DialogContent className="mx-4 max-h-[90vh] overflow-y-auto sm:max-w-lg">
        {success ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">
                ¡Postulación enviada!
              </DialogTitle>
              <DialogDescription className="text-base text-foreground">
                Hemos registrado tu solicitud para{" "}
                <strong>{projectTitle}</strong>. Te contactaremos si es
                necesario.
              </DialogDescription>
            </DialogHeader>
            <Button
              className="h-12 w-full text-base"
              onClick={() => handleOpenChange(false)}
            >
              Cerrar
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg">Postulación</DialogTitle>
              <DialogDescription className="text-base">
                Completa el formulario para participar en:{" "}
                <strong>{projectTitle}</strong>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor={`name-${projectId}`}>Nombre completo *</Label>
                <Input
                  id={`name-${projectId}`}
                  required
                  maxLength={255}
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`email-${projectId}`}>
                  Correo electrónico *
                </Label>
                <Input
                  id={`email-${projectId}`}
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`dni-${projectId}`}>
                  Documento de identidad (DNI/NIE) *
                </Label>
                <Input
                  id={`dni-${projectId}`}
                  required
                  minLength={4}
                  maxLength={64}
                  autoComplete="off"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`phone-${projectId}`}>
                  Teléfono (opcional)
                </Label>
                <Input
                  id={`phone-${projectId}`}
                  type="tel"
                  maxLength={64}
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 text-base"
                />
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`policy-${projectId}`}
                  checked={acceptPolicy}
                  onCheckedChange={setAcceptPolicy}
                  required
                  className="mt-1 size-5"
                />
                <Label
                  htmlFor={`policy-${projectId}`}
                  className="text-sm font-normal leading-relaxed"
                >
                  Acepto el tratamiento de mis datos personales según la
                  política de privacidad y las finalidades descritas. *
                </Label>
              </div>
              <Button
                type="submit"
                className="h-12 w-full text-base font-semibold"
                disabled={submitting}
              >
                {submitting ? "Enviando…" : "Enviar postulación"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
