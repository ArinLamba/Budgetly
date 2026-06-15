import { Button } from "@/components/ui/button";
import Link from "next/link";

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
