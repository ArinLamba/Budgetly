import { EmptyState, money } from "../../_components/finance-ui";
import type { FinanceBudgetRow } from "../../_lib/finance-data";
import { renderTransactionIcon } from "../../transactions/_lib/appearance";
import type { getBudgetInsights } from "../_lib/budget-insights";
import { getBudgetStatus } from "../_lib/budget-status";
import { AddBudgetDialog } from "./add-budget-dialog";
import { BudgetActions } from "./budget-actions";

type BudgetDialogCategory = React.ComponentProps<
  typeof AddBudgetDialog
>["categories"][number];

export function BudgetMobileList({
  budgets,
  categories,
  getInsights,
  month,
}: {
  budgets: FinanceBudgetRow[];
  categories: BudgetDialogCategory[];
  getInsights: (budget: FinanceBudgetRow) => ReturnType<typeof getBudgetInsights>;
  month: string;
}) {
  if (budgets.length === 0) {
    return (
      <div className="grid gap-3 md:hidden">
        <EmptyState>No budgets yet.</EmptyState>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:hidden">
      {budgets.map((budget) => {
        const status = getBudgetStatus(budget.progress);
        const StatusIcon = status.icon;
        const insights = getInsights(budget);

        return (
          <div key={budget.id} className="rounded-lg border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="flex size-9 items-center justify-center rounded-md"
                  style={{
                    backgroundColor: `${budget.categoryColor}20`,
                    color: budget.categoryColor,
                  }}
                >
                  {renderTransactionIcon(
                    budget.categoryIcon ?? "Wallet",
                    "size-4"
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold text-slate-950">
                    {budget.categoryName}
                  </p>
                  <span
                    className={`mt-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${status.className}`}
                  >
                    <StatusIcon className="size-3" />
                    {status.label}
                  </span>
                </div>
              </div>
              <BudgetActions
                amount={budget.amount}
                categories={categories}
                categoryColor={budget.categoryColor}
                categoryIcon={budget.categoryIcon}
                categoryId={budget.categoryId}
                categoryName={budget.categoryName}
                id={budget.id}
                month={month}
              />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
              <div>
                <p className="text-muted-foreground">Spent</p>
                <p className="mt-1 font-bold text-slate-950">
                  {money.format(budget.spent)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Budget</p>
                <p className="mt-1 font-bold text-slate-950">
                  {money.format(budget.amount)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Left</p>
                <p className="mt-1 font-bold text-emerald-600">
                  {money.format(budget.remaining)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 rounded-md bg-slate-50 p-3 text-xs sm:grid-cols-2">
              <p>
                <span className="text-muted-foreground">Safe/day</span>{" "}
                <span className="font-bold text-slate-950">
                  {money.format(Math.max(0, insights.dailyAvailable))}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Avg/day</span>{" "}
                <span className="font-bold text-slate-950">
                  {money.format(insights.dailyAverage)}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Forecast</span>{" "}
                <span
                  className={
                    insights.forecastDelta > 0
                      ? "font-bold text-rose-600"
                      : "font-bold text-emerald-600"
                  }
                >
                  {insights.forecastDelta > 0
                    ? `Over by ${money.format(insights.forecastDelta)}`
                    : `${money.format(
                        Math.abs(insights.forecastDelta)
                      )} under`}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Last month</span>{" "}
                <span className="font-bold text-slate-950">
                  {money.format(insights.lastMonthSpent)}
                </span>
              </p>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${status.progressClassName}`}
                  style={{ width: `${Math.min(100, budget.progress)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {budget.progress}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
