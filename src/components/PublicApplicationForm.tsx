import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
    watch,
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

  const acceptPolicy = watch("acceptPolicy");

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
            className={cn("text-sm font-medium", triggerClassName)}
          />
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
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              noValidate
            >
              {errors.root && (
                <p
                  className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  {errors.root.message}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor={`name-${projectId}`}>Nombre completo *</Label>
                <Input
                  id={`name-${projectId}`}
                  maxLength={255}
                  autoComplete="name"
                  disabled={isSubmitting}
                  className="h-12 text-base"
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`email-${projectId}`}>
                  Correo electrónico *
                </Label>
                <Input
                  id={`email-${projectId}`}
                  type="email"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="h-12 text-base"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor={`dni-${projectId}`}>
                  Documento de identidad (DNI/NIE) *
                </Label>
                <Input
                  id={`dni-${projectId}`}
                  minLength={4}
                  maxLength={64}
                  autoComplete="off"
                  disabled={isSubmitting}
                  className="h-12 text-base"
                  {...register("dni")}
                />
                {errors.dni && (
                  <p className="text-sm text-destructive">
                    {errors.dni.message}
                  </p>
                )}
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
                  disabled={isSubmitting}
                  className="h-12 text-base"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`policy-${projectId}`}
                  checked={!!acceptPolicy}
                  onCheckedChange={(checked) =>
                    setValue("acceptPolicy", checked === true, {
                      shouldValidate: true,
                    })
                  }
                  disabled={isSubmitting}
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
              {errors.acceptPolicy && (
                <p className="text-sm text-destructive">
                  {errors.acceptPolicy.message}
                </p>
              )}
              <Button
                type="submit"
                className="h-12 w-full text-base font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando…" : "Enviar postulación"}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
