import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

export function StatusBadge({ children }: { children: ReactNode }) {
  return (
    <Badge className="rounded-md bg-violet-50 text-violet-700 hover:bg-violet-50">
      {children}
    </Badge>
  );
}
