import { Loader2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type SpinnerProps = React.ComponentProps<"svg"> &
  VariantProps<typeof spinnerVariants>;

/** Indicador de carga alineado con los tokens de tema (patrón shadcn: cva + Lucide). */
export function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label="Cargando"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}

type LoadingStateProps = {
  label?: string;
  className?: string;
};

/** Bloque centrado para listados, grillas de tarjetas o tablas en carga. */
export function LoadingState({
  label = "Cargando…",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-14 text-center text-muted-foreground",
        className,
      )}
    >
      <Spinner size="lg" />
      {label ? (
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
      ) : null}
    </div>
  );
}
