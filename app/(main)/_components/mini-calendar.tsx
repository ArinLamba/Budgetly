import { cn } from "@/lib/utils";

export function MiniCalendar({
  days,
}: {
  days: { amount: number; day: number; inMonth: boolean }[];
}) {
  function colorForAmount(amount: number) {
    if (amount === 0) return "bg-slate-100";
    if (amount <= 500) return "bg-emerald-100";
    if (amount <= 1500) return "bg-yellow-200";
    if (amount <= 3000) return "bg-orange-300";
    return "bg-rose-300";
  }

  return (
    <div>
      <div className="mb-3 grid grid-cols-7 text-center text-xs font-semibold text-slate-700">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((item, index) => (
          <span
            key={`${item.day}-${index}`}
            className={cn(
              "flex h-8 items-center justify-center rounded-md text-xs font-semibold",
              item.inMonth ? "text-slate-700" : "text-slate-400",
              colorForAmount(item.amount)
            )}
          >
            {item.day}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SpendingCalendarLegend() {
  const items = [
    ["bg-slate-100", "Rs 0"],
    ["bg-emerald-100", "Rs 1 - Rs 500"],
    ["bg-yellow-200", "Rs 501 - Rs 1,500"],
    ["bg-orange-300", "Rs 1,501 - Rs 3,000"],
    ["bg-rose-300", "Rs 3,000+"],
  ];

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground lg:flex-col lg:gap-2">
      {items.map(([color, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", color)} />
          {label}
        </span>
      ))}
    </div>
  );
}
