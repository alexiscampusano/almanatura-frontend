import { useState } from "react";
import {
  TextAUnderline,
  Minus,
  Plus,
  ArrowCounterClockwise,
} from "@phosphor-icons/react";
import { useAccessibilityStore } from "@/stores/accessibility.store";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";

export function AccessibilityBar() {
  const [open, setOpen] = useState(false);
  const { increaseFontSize, decreaseFontSize, resetFontSize } =
    useAccessibilityStore();

  const handleFullReset = () => {
    try {
      localStorage.removeItem("alma-natura-accessibility");
    } catch (e) {
      console.warn("Could not remove accessibility key:", e);
    }
    resetFontSize();
    try {
      (document.activeElement as HTMLElement | null)?.blur();
    } catch (err) {
      console.warn("Could not blur active element:", err);
    }
    setOpen(false);
  };

  return (
    <div className="w-full bg-foreground text-background px-3 py-1.5 flex items-center justify-center sm:justify-end gap-2 border-b border-background/20">
      <span className="text-[var(--text-size-xs)] font-medium hidden sm:inline mr-2 opacity-90">
        Accesibilidad:
      </span>

      <div className="flex items-center border border-background/20 rounded-md p-0.5 bg-background/5">
        <button
          onClick={decreaseFontSize}
          className="flex h-10 w-11 items-center justify-center rounded-sm hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 transition-transform"
          aria-label="Disminuir tamaño de letra"
          title="Disminuir letra"
        >
          <TextAUnderline size={16} weight="bold" />
          <Minus size={12} weight="bold" className="-ml-0.5" />
        </button>

        <div className="w-[1px] h-6 bg-background/20 mx-0.5" aria-hidden></div>

        <button
          onClick={resetFontSize}
          className="flex h-10 w-11 items-center justify-center rounded-sm hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-bold text-[var(--text-size-sm)] active:scale-95 transition-transform"
          aria-label="Tamaño de letra original"
          title="Tamaño original"
        >
          A
        </button>

        <div className="w-[1px] h-6 bg-background/20 mx-0.5" aria-hidden></div>

        <button
          onClick={increaseFontSize}
          className="flex h-10 w-11 items-center justify-center rounded-sm hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-95 transition-transform"
          aria-label="Aumentar tamaño de letra"
          title="Aumentar letra"
        >
          <TextAUnderline size={20} weight="bold" />
          <Plus size={12} weight="bold" className="-ml-0.5" />
        </button>
      </div>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger
          className="flex h-10 items-center justify-center gap-1.5 px-3 ml-1 rounded-md bg-background/10 hover:bg-background/20 text-[var(--text-size-xs)] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all active:scale-95"
          aria-label="Restablecer todos los ajustes visuales"
          title="Restablecer ajustes"
        >
          <ArrowCounterClockwise size={18} weight="bold" />
          <span className="hidden sm:inline">Restablecer</span>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Restablecer ajustes
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              ¿Estás seguro de que deseas devolver el tamaño de la letra y todos
              los ajustes visuales a su estado original?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogPrimitive.Close
              render={<Button variant="default" onClick={handleFullReset} />}
            >
              Sí, restablecer
            </AlertDialogPrimitive.Close>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
