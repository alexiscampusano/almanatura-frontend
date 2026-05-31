import { Button } from "@/components/ui/button";
import { useAccessibilityStore } from "@/stores/accessibility.store";

export default function ResetAccessibility() {
  const resetFontSize = useAccessibilityStore((s) => s.resetFontSize);

  const handleReset = () => {
    if (!confirm("Reset accessibility settings to defaults?")) return;
    try {
      localStorage.removeItem("alma-natura-accessibility");
    } catch (e) {
      // non-fatal; log for debugging

      console.warn("Could not remove accessibility key:", e);
    }
    resetFontSize();
    // Force a small visual hint by blurring active element
    try {
      (document.activeElement as HTMLElement | null)?.blur();
    } catch (e) {
      // non-fatal

      console.warn("Could not blur active element:", e);
    }
  };

  return (
    <Button
      variant="ghost"
      className="hidden h-[var(--size-button-sm)] items-center gap-2 px-3 text-sm sm:inline-flex"
      onClick={handleReset}
      aria-label="Reset accessibility settings"
      title="Reset accessibility settings"
    >
      Reset accessibility
    </Button>
  );
}
