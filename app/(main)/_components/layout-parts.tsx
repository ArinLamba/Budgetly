import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40 p-2 md:p-3">
      <section className="min-h-[calc(100vh-1rem)] rounded-lg border bg-background p-4 shadow-sm md:p-6">
        {children}
      </section>
    </div>
  );
}

export function SectionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 text-card-foreground shadow-xs", className)}>
      {children}
    </div>
  );
}

export function PageTitle({
  action,
  children,
}: {
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h1 className="text-xl font-bold text-foreground">{children}</h1>
      {action}
    </div>
  );
}
