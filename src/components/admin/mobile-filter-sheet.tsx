import { useState, type ReactNode } from "react";
import { Funnel } from "@phosphor-icons/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type MobileFilterSheetProps = {
  title?: string;
  description?: string;
  activeFilterCount?: number;
  children: ReactNode;
  onApply?: () => void;
};

export function MobileFilterSheet({
  title = "Filtros",
  description = "Ajusta los criterios para ver solo lo que necesitas.",
  activeFilterCount = 0,
  children,
  onApply,
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger button */}
      <div className="md:hidden">
        <Button
          variant="outline"
          className="h-12 w-full gap-2 text-base font-medium"
          onClick={() => setOpen(true)}
        >
          <Funnel size={20} weight="bold" />
          {title}
          {activeFilterCount > 0 && (
            <Badge
              variant="destructive"
              className="ml-auto h-6 min-w-6 rounded-full px-1.5 text-xs font-bold"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Sheet panel */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh]">
          <SheetHeader>
            <SheetTitle className="text-base">{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>

          <div className="space-y-4 overflow-y-auto px-4 py-2">{children}</div>

          <SheetFooter>
            <Button
              size="lg"
              className="h-12 w-full text-base font-semibold"
              onClick={() => {
                onApply?.();
                setOpen(false);
              }}
            >
              Aplicar filtros
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
