import { Progress } from "@/components/ui/progress";
import type { FinanceCategorySummary } from "../../_lib/finance-data";
import { EmptyState } from "../../_components/empty-state";
import { renderTransactionIcon } from "../../transactions/_lib/appearance";

export function CategoryProgressList({
  categories,
  compact = false,
}: {
  categories: FinanceCategorySummary[];
  compact?: boolean;
}) {
  const visibleCategories = categories.filter((category) => category.amount > 0);

  if (visibleCategories.length === 0) {
    return <EmptyState>No category spending yet.</EmptyState>;
  }

  return (
    <div className="space-y-3">
      {visibleCategories
        .slice(0, compact ? 4 : visibleCategories.length)
        .map((category) => (
          <div
            key={category.id}
            className="grid grid-cols-[1fr_auto] items-center gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="flex size-9 items-center justify-center rounded-md"
                style={{
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                }}
              >
                {renderTransactionIcon(category.icon ?? "Wallet", "size-4")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">
                  {category.name}
                </p>
                <Progress
                  value={category.percent}
                  className="mt-2 h-1.5"
                  style={{ "--primary": category.color } as React.CSSProperties}
                />
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              {category.percent}%
            </p>
          </div>
        ))}
    </div>
  );
}
