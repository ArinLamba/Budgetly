import { Button } from "@/components/ui/button";
import { addMonths } from "../_lib/finance-data";
import { formatDateKey } from "../_lib/date-utils";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Link from "next/link";

function buildMonthHref({
  month,
  pathname,
  preserve,
}: {
  month: string;
  pathname: string;
  preserve?: Record<string, string | undefined>;
}) {
  const params = new URLSearchParams();

  params.set("month", month);

  for (const [key, value] of Object.entries(preserve ?? {})) {
    if (value) {
      params.set(key, value);
    }
  }

  return `${pathname}?${params}`;
}

export function MonthControls({
  month,
  pathname,
  preserve,
}: {
  month: string;
  pathname: string;
  preserve?: Record<string, string | undefined>;
}) {
  const label = formatDateKey(month, {
    month: "long",
    year: "numeric",
  });
  const inputValue = month.slice(0, 7);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="icon-sm" asChild>
        <Link
          href={buildMonthHref({
            month: addMonths(month, -1),
            pathname,
            preserve,
          })}
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Previous month</span>
        </Link>
      </Button>
      
      <Button variant="outline" size="icon-sm" asChild>
        <Link
          href={buildMonthHref({
            month: addMonths(month, 1),
            pathname,
            preserve,
          })}
        >
          <ChevronRight className="size-4" />
          <span className="sr-only">Next month</span>
        </Link>
      </Button>
      <form action={pathname} className="flex items-center gap-1">
        {Object.entries(preserve ?? {}).map(([key, value]) =>
          value ? <input key={key} name={key} type="hidden" value={value} /> : null
        )}
        <input
          aria-label="Select month"
          className="h-8 w-[9.5rem] rounded-md border bg-background px-2 text-xs font-medium text-foreground"
          defaultValue={inputValue}
          name="month"
          type="month"
        />
        <Button size="icon-sm" type="submit" variant="outline">
          <Search className="size-4" />
          <span className="sr-only">Show month</span>
        </Button>
      </form>
    </div>
  );
}
