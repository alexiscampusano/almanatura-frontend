import { TextAUnderline, Minus, Plus } from "@phosphor-icons/react";
import { useAccessibilityStore } from "@/stores/accessibility.store";

export function AccessibilityBar() {
  const { increaseFontSize, decreaseFontSize, resetFontSize } =
    useAccessibilityStore();

  return (
    <div className="w-full bg-foreground text-background px-3 py-1.5 flex items-center justify-center sm:justify-end gap-2 border-b border-background/20">
      <span className="text-xs font-medium hidden sm:inline mr-2 opacity-90">
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
          className="flex h-10 w-11 items-center justify-center rounded-sm hover:bg-background/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-bold text-sm active:scale-95 transition-transform"
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
    </div>
  );
}
