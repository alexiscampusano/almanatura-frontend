import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Stable filter toolbar grid (avoids flex-wrap layout shift). */
export const adminFilterGridClassName =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 [&_.space-y-2]:min-w-0";

/** Reserved height while list data loads or is empty. */
export const adminListRegionClassName = "min-h-[12rem]";

type AdminPageProps = {
  children: ReactNode;
  className?: string;
};

/** Full-width admin page shell; width is constrained by AdminLayout. */
export function AdminPage({ children, className }: AdminPageProps) {
  return (
    <section className={cn("w-full min-w-0 space-y-6", className)}>
      {children}
    </section>
  );
}

type AdminPageNarrowProps = {
  children: ReactNode;
  className?: string;
};

/** Centers form/card blocks without shrinking the main layout column. */
export function AdminPageNarrow({ children, className }: AdminPageNarrowProps) {
  return (
    <div className={cn("mx-auto w-full max-w-lg", className)}>{children}</div>
  );
}
