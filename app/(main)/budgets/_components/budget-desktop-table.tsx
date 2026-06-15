import { EmptyState, money } from "../../_components/finance-ui";
import { renderTransactionIcon } from "../../transactions/_lib/appearance";
import type { getBudgetInsights } from "../_lib/budget-insights";
import { getBudgetStatus } from "../_lib/budget-status";
import { BudgetActions } from "./budget-actions";
import { AddBudgetDialog } from "./add-budget-dialog";
import type { FinanceBudgetRow } from "../../_lib/finance-data";

type BudgetDialogCategory = React.ComponentProps<
  typeof AddBudgetDialog
>["categories"][number];

export function BudgetDesktopTable({
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
  return (
    <div className="hidden overflow-hidden rounded-lg border bg-background md:block">
      <div className="grid grid-cols-[1.35fr_0.65fr_0.65fr_0.65fr_0.75fr_1fr_0.8fr] border-b px-4 py-3 text-xs font-semibold text-muted-foreground">
        <span>Budget</span>
        <span>Spent</span>
        <span>Budgeted</span>
        <span>Remaining</span>
        <span>Status</span>
        <span>Progress</span>
        <span className="text-right">Actions</span>
      </div>
      <div className="divide-y">
        {budgets.length === 0 ? (
          <div className="p-4">
            <EmptyState>No budgets yet.</EmptyState>
          </div>
        ) : (
          budgets.map((budget) => {
            const status = getBudgetStatus(budget.progress);
            const StatusIcon = status.icon;
            const insights = getInsights(budget);

            return (
              <div
                key={budget.id}
                className="grid grid-cols-[1.35fr_0.65fr_0.65fr_0.65fr_0.75fr_1fr_0.8fr] items-center gap-3 px-4 py-4 text-sm"
              >
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
                    <p className="truncate font-bold text-foreground">
                      {budget.categoryName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {money.format(Math.max(0, insights.dailyAvailable))}
                      /day safe <span aria-hidden="true">/</span>{" "}
                      {insights.forecastDelta > 0
                        ? `over by ${money.format(insights.forecastDelta)}`
                        : `${money.format(
                            Math.abs(insights.forecastDelta)
                          )} under forecast`}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-foreground">
                  {money.format(budget.spent)}
                </span>
                <span className="font-semibold text-foreground">
                  {money.format(budget.amount)}
                </span>
                <span className="font-semibold text-foreground">
                  {money.format(budget.remaining)}
                </span>
                <span
                  className={`inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${status.className}`}
                >
                  <StatusIcon className="size-3" />
                  {status.label}
                </span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full ${status.progressClassName}`}
                      style={{ width: `${Math.min(100, budget.progress)}%` }}
                    />
                  </div>
                  <span className="w-8 text-xs font-semibold text-muted-foreground">
                    {budget.progress}%
                  </span>
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
            );
          })
        )}
      </div>
    </div>
  );
}
