import type { FinanceCategorySummary } from "../_lib/finance-data";
import { money } from "./format";

export function DonutChart({
  categories,
}: {
  categories: FinanceCategorySummary[];
}) {
  const visibleCategories = categories.filter((category) => category.amount > 0);
  const total = visibleCategories.reduce(
    (sum, category) => sum + category.amount,
    0
  );
  const palette = [
    "#f97316",
    "#3b82f6",
    "#10b981",
    "#8b5cf6",
    "#f59e0b",
    "#94a3b8",
  ];
  let cursor = 0;
  const gradient =
    total > 0
      ? visibleCategories
          .slice(0, 6)
          .map((category, index) => {
            const start = cursor;
            const end = cursor + (category.amount / total) * 100;
            cursor = end;
            return `${category.color || palette[index]} ${start}% ${end}%`;
          })
          .join(",")
      : "#e2e8f0 0% 100%";

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-center">
      <div
        className="relative size-42 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-background">
          <p className="text-lg font-bold text-foreground">
            {money.format(total)}
          </p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
      <div className="grid flex-1 gap-2">
        {visibleCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expense data yet.</p>
        ) : (
          visibleCategories.slice(0, 6).map((category, index) => (
            <div
              key={category.id}
              className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-xs"
            >
              <span className="flex items-center gap-2 font-medium text-foreground">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: category.color || palette[index] }}
                />
                {category.name}
              </span>
              <span className="font-semibold text-foreground">
                {money.format(category.amount)}
              </span>
              <span className="text-muted-foreground">{category.percent}%</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
