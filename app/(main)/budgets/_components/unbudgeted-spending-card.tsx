import { money } from "../../_components/finance-ui";
import type { getUnbudgetedSpending } from "../../_lib/finance-data";

type UnbudgetedItem = ReturnType<typeof getUnbudgetedSpending>[number];

export function UnbudgetedSpendingCard({
  items,
}: {
  items: UnbudgetedItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 rounded-lg border bg-background p-4 shadow-xs">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-foreground">
          Unbudgeted Spending
        </h2>
        <span className="text-xs font-semibold text-amber-700">
          {money.format(items.reduce((sum, item) => sum + item.spent, 0))}
        </span>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.categoryId}
            className="flex items-center justify-between rounded-md bg-amber-50/70 px-3 py-2 text-sm"
          >
            <span className="font-semibold text-foreground">
              {item.categoryName}
            </span>
            <span className="font-bold text-amber-700">
              {money.format(item.spent)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
