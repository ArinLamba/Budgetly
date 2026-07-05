import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageTitleProps = {
    heading: ReactNode;
    action?: ReactNode;
};

type PageShellProps = {
  children: ReactNode;
  classname?: string;
}

export function PageShell({ children, classname }: PageShellProps) {
  return (
    <div className="min-h-screen bg-muted/40">
      <section className={cn(
        "min-h-[calc(100vh-1rem)] rounded-lg border bg-background px-2 pb-4 md:px-4 shadow-sm",
        classname
      )}>
        {children}
      </section>
    </div>
  );
}

export function PageTitle({
    heading,
    action,
}: PageTitleProps) {
  return (
    <div className="sticky top-0 z-20 bg-background px-5 py-3 -mx-2 border-b mb-2 md:border-b-0 md:mb-0">
      <div className="flex items-center justify-between gap-3">
        {heading}

        {action && (
          <div className="flex gap-2">
            {action}
          </div>
        )}
      </div>
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

