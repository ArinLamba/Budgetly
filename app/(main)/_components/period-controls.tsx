import { Button } from "@/components/ui/button";
import { addMonths } from "../_lib/finance-data";
import { formatDateKey } from "../_lib/date-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function MonthControls({
  month,
  pathname,
}: {
  month: string;
  pathname: string;
}) {
  const label = formatDateKey(month, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" asChild>
        <Link href={`${pathname}?month=${addMonths(month, -1)}`}>
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous month</span>
        </Link>
      </Button>
      <span className="min-w-28 text-center text-sm font-semibold text-foreground">
        {label}
      </span>
      <Button variant="outline" size="icon-sm" asChild>
        <Link href={`${pathname}?month=${addMonths(month, 1)}`}>
          <ChevronRight className="size-4" />
          <span className="sr-only">Next month</span>
        </Link>
      </Button>
    </div>
  );
}
