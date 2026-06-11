import { Button } from "@/components/ui/button";
import { addMonths } from "../_lib/finance-data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function MonthControls({
  month,
  pathname,
}: {
  month: string;
  pathname: string;
}) {
  const label = new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${month}T00:00:00`));

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" asChild>
        <Link href={`${pathname}?month=${addMonths(month, -1)}`}>
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous month</span>
        </Link>
      </Button>
      <span className="min-w-28 text-center text-sm font-semibold text-slate-700">
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

export function CategoryPeriodControls({
  month,
  pathname,
  period,
}: {
  month: string;
  pathname: string;
  period: string;
}) {
  const items = [
    { label: "This Month", value: "month" },
    { label: "This Year", value: "year" },
    { label: "All Time", value: "all" },
  ];

  return (
    <div className="flex gap-1 rounded-lg border bg-background p-1">
      {items.map((item) => (
        <Button
          key={item.value}
          variant={period === item.value ? "main" : "ghost"}
          className="h-7 px-2 text-xs"
          asChild
        >
          <Link href={`${pathname}?month=${month}&categoryPeriod=${item.value}`}>
            {item.label}
          </Link>
        </Button>
      ))}
    </div>
  );
}
