import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

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
import { getErrorMessage } from "@/lib/error-handler";
import { applicationSchema, type ApplicationSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { submitApplication } from "@/services/applications.service";

type PublicApplicationDialogProps = {
  projectId: number;
  projectTitle: string;
  triggerClassName?: string;
};

export function PublicApplicationDialog({
  projectId,
  projectTitle,
  triggerClassName,
}: PublicApplicationDialogProps) {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset: resetForm,
    control,
    setValue,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ApplicationSchema>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      dni: "",
      phone: "",
    },
  });

  const acceptPolicy = useWatch({ control, name: "acceptPolicy" });

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      resetForm();
      setSuccess(false);
    }
  }

  const onSubmit = async (data: ApplicationSchema) => {
    try {
      await submitApplication({
        projectId,
        fullName: data.fullName.trim(),
        email: data.email.trim(),
        dni: data.dni.trim(),
        ...(data.phone?.trim() ? { phone: data.phone.trim() } : {}),
      });
      setSuccess(true);
    } catch (err) {
      setError("root", {
        message: getErrorMessage(
          err,
          "No se pudo enviar la solicitud. Inténtalo nuevamente.",
        ),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="default"
            size="default"
            className={cn(
              "text-[var(--text-size-sm)] font-medium",
              triggerClassName,
            )}
          />
        }
      >
        Quiero participar
      </DialogTrigger>
      <DialogContent
        className="max-h-[100dvh] h-[100dvh] w-full max-w-full border-0 p-4 sm:h-auto sm:max-w-lg sm:rounded-xl sm:border sm:p-6 overflow-y-auto"
        // @ts-expect-error - onInteractOutside works on some UI libs but not typed here
        onInteractOutside={(e: Event) => e.preventDefault()}
      >
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
              <DialogTitle className="text-xl font-bold text-primary">
                Me interesa este proyecto
              </DialogTitle>
              <DialogDescription className="text-base text-foreground/80">
                Déjanos tus datos para que podamos contactarte sobre:{" "}
                <strong className="block mt-1 text-foreground">
                  {projectTitle}
                </strong>
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 mt-2"
              noValidate
            >
              {errors.root && (
                <p
                  className="rounded-md bg-destructive/10 px-3 py-2 text-[var(--text-size-sm)] text-destructive"
                  role="alert"
                >
                  {errors.root.message}
                </p>
              )}
              <div className="space-y-2.5">
                <Label
                  htmlFor={`name-${projectId}`}
                  className="text-base font-medium"
                >
                  Nombre completo{" "}
                  <span className="text-muted-foreground font-normal text-[var(--text-size-sm)]">
                    (Obligatorio)
                  </span>
                </Label>
                <Input
                  id={`name-${projectId}`}
                  maxLength={255}
                  autoComplete="name"
                  disabled={isSubmitting}
                  className="h-14 text-base md:text-lg"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-[var(--text-size-sm)] font-medium text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor={`email-${projectId}`}
                  className="text-base font-medium"
                >
                  Correo electrónico{" "}
                  <span className="text-muted-foreground font-normal text-[var(--text-size-sm)]">
                    (Obligatorio)
                  </span>
                </Label>
                <Input
                  id={`email-${projectId}`}
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="h-14 text-base md:text-lg"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-[var(--text-size-sm)] font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor={`dni-${projectId}`}
                  className="text-base font-medium"
                >
                  Documento de identidad (DNI/NIE){" "}
                  <span className="text-muted-foreground font-normal text-[var(--text-size-sm)]">
                    (Obligatorio)
                  </span>
                </Label>
                <Input
                  id={`dni-${projectId}`}
                  minLength={4}
                  maxLength={64}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck="false"
                  disabled={isSubmitting}
                  className="h-14 text-base md:text-lg uppercase"
                  {...register("dni")}
                />
                {errors.dni && (
                  <p className="text-[var(--text-size-sm)] font-medium text-destructive">
                    {errors.dni.message}
                  </p>
                )}
              </div>
              <div className="space-y-2.5">
                <Label
                  htmlFor={`phone-${projectId}`}
                  className="text-base font-medium"
                >
                  Teléfono{" "}
                  <span className="text-muted-foreground font-normal text-[var(--text-size-sm)]">
                    (Opcional)
                  </span>
                </Label>
                <Input
                  id={`phone-${projectId}`}
                  type="tel"
                  maxLength={64}
                  autoComplete="tel"
                  disabled={isSubmitting}
                  className="h-14 text-base md:text-lg tracking-wider"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-[var(--text-size-sm)] font-medium text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="flex items-start gap-4 rounded-lg border border-border/50 bg-muted/20 p-4 transition-colors hover:bg-muted/40">
                <Checkbox
                  id={`policy-${projectId}`}
                  checked={!!acceptPolicy}
                  onCheckedChange={(checked) =>
                    setValue("acceptPolicy", checked === true, {
                      shouldValidate: true,
                    })
                  }
                  disabled={isSubmitting}
                  className="mt-0.5 h-6 w-6 shrink-0 rounded-md data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label
                  htmlFor={`policy-${projectId}`}
                  className="text-[0.95rem] font-medium leading-relaxed cursor-pointer"
                >
                  Acepto que mis datos sean guardados para que puedan
                  contactarme sobre este u otros proyectos similares.
                </Label>
              </div>
              {errors.acceptPolicy && (
                <p className="text-[var(--text-size-sm)] font-medium text-destructive px-1">
                  {errors.acceptPolicy.message}
                </p>
              )}
              <Button
                type="submit"
                className="h-14 w-full text-lg font-bold shadow-md mt-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando tus datos…" : "Enviar mis datos"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
