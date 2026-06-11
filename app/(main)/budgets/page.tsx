import {
  BudgetSummary,
  EmptyState,
  MetricCard,
  PageShell,
  PageTitle,
  money,
  icons,
} from "../_components/finance-ui";
import { MonthControls } from "../_components/period-controls";
import {
  addMonths,
  getBudgetRows,
  getFinanceData,
  getMonthTransactions,
  getTotals,
  getUnbudgetedSpending,
} from "../_lib/finance-data";
import {
  AddBudgetDialog,
  EditBudgetTrigger,
} from "./_components/add-budget-dialog";
import { DeleteBudgetButton } from "./_components/delete-budget-button";
import { renderTransactionIcon } from "../transactions/_lib/appearance";
import { BadgeAlert, CheckCircle2, Eye, TriangleAlert } from "lucide-react";
import Link from "next/link";

function getBudgetStatus(progress: number) {
  if (progress > 100) {
    return {
      className: "bg-rose-50 text-rose-700",
      icon: BadgeAlert,
      label: "Over Budget",
      progressClassName: "bg-rose-500",
    };
  }

  if (progress >= 90) {
    return {
      className: "bg-amber-50 text-amber-700",
      icon: TriangleAlert,
      label: "Near Limit",
      progressClassName: "bg-amber-500",
    };
  }

  return {
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
    label: "On Track",
    progressClassName: "bg-emerald-500",
  };
}

export default async function BudgetsPage({
  searchParams,
}: PageProps<"/budgets">) {
  const params = await searchParams;
  const month = typeof params.month === "string" ? params.month : undefined;
  const data = await getFinanceData(month);
  const monthTransactions = getMonthTransactions(data.transactions, data.monthKey);
  const previousMonthTransactions = getMonthTransactions(
    data.transactions,
    addMonths(data.monthKey, -1)
  );
  const budgets = getBudgetRows(data.budgets, monthTransactions);
  const unbudgeted = getUnbudgetedSpending(
    data.categories,
    budgets,
    monthTransactions
  );
  const currentTotals = getTotals(monthTransactions);
  const previousTotals = getTotals(previousMonthTransactions);
  const monthDelta = currentTotals.expense - previousTotals.expense;
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalRemaining = Math.max(0, totalBudgeted - totalSpent);
  const overBudgetCount = budgets.filter((budget) => budget.spent > budget.amount).length;
  const existingCategoryIds = budgets.map((budget) => budget.categoryId);
  const budgetDialogCategories = data.categories.map((category) => {
    const currentSpent = monthTransactions
      .filter((transaction) => transaction.categoryId === category.id)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const previousSpent = previousMonthTransactions
      .filter((transaction) => transaction.categoryId === category.id)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const currentBudget = budgets.find(
      (budget) => budget.categoryId === category.id
    );

    return {
      ...category,
      suggestedAmount:
        currentBudget?.amount ??
        (Math.max(currentSpent, previousSpent) > 0
          ? Math.max(currentSpent, previousSpent)
          : null),
    };
  });
  const selectedMonthDate = new Date(`${data.monthKey}T00:00:00`);
  const now = new Date();
  const isCurrentMonth =
    selectedMonthDate.getFullYear() === now.getFullYear() &&
    selectedMonthDate.getMonth() === now.getMonth();
  const daysInMonth = new Date(
    selectedMonthDate.getFullYear(),
    selectedMonthDate.getMonth() + 1,
    0
  ).getDate();
  const elapsedDays = isCurrentMonth ? now.getDate() : daysInMonth;
  const remainingDays = isCurrentMonth
    ? Math.max(1, daysInMonth - now.getDate() + 1)
    : daysInMonth;

  function getBudgetInsights(budget: (typeof budgets)[number]) {
    const lastMonthSpent = previousMonthTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.categoryId === budget.categoryId
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    const dailyAvailable = budget.remaining / remainingDays;
    const dailyAverage = budget.spent / Math.max(1, elapsedDays);
    const forecast = dailyAverage * daysInMonth;

    return {
      dailyAvailable,
      dailyAverage,
      forecast,
      forecastDelta: forecast - budget.amount,
      lastMonthSpent,
    };
  }

  return (
    <PageShell>
      <PageTitle
        action={
          <AddBudgetDialog
            categories={budgetDialogCategories}
            existingCategoryIds={existingCategoryIds}
            month={data.monthKey}
          />
        }
      >
        Budgets
      </PageTitle>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <MonthControls month={data.monthKey} pathname="/budgets" />
        <p className="text-xs font-medium text-muted-foreground">
          {monthDelta === 0
            ? "Spending is unchanged from last month"
            : `${monthDelta > 0 ? "Spent" : "Saved"} ${money.format(
                Math.abs(monthDelta)
              )} ${monthDelta > 0 ? "more" : "less"} than last month`}
        </p>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={icons.Wallet}
          label="Total Budgeted"
          tone="blue"
          trend={`${budgets.length} active budgets`}
          value={money.format(totalBudgeted)}
        />
        <MetricCard
          icon={icons.ReceiptText}
          label="Total Spent"
          tone="red"
          trend={`${money.format(currentTotals.expense)} monthly expense`}
          value={money.format(totalSpent)}
        />
        <MetricCard
          icon={icons.CircleDollarSign}
          label="Remaining"
          tone="green"
          trend="Available this month"
          value={money.format(totalRemaining)}
        />
        <MetricCard
          icon={icons.Goal}
          label="Over Budget"
          tone={overBudgetCount > 0 ? "red" : "violet"}
          trend={overBudgetCount > 0 ? "Needs attention" : "All clear"}
          value={String(overBudgetCount)}
        />
      </div>

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
              const status = getBudgetStatus(
                budget.amount > 0
                  ? Math.round((budget.spent / budget.amount) * 100)
                  : 0
              );
              const StatusIcon = status.icon;
              const insights = getBudgetInsights(budget);

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
                      {renderTransactionIcon(budget.categoryIcon ?? "Wallet", "size-4")}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-950">
                        {budget.categoryName}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {money.format(Math.max(0, insights.dailyAvailable))}
                        /day safe{" "}
                        <span aria-hidden="true">/</span>{" "}
                        {insights.forecastDelta > 0
                          ? `over by ${money.format(insights.forecastDelta)}`
                          : `${money.format(Math.abs(insights.forecastDelta))} under forecast`}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-700">
                    {money.format(budget.spent)}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {money.format(budget.amount)}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {money.format(budget.remaining)}
                  </span>
                  <span
                    className={`inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 text-xs font-bold ${status.className}`}
                  >
                    <StatusIcon className="size-3" />
                    {status.label}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 flex-1 rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${status.progressClassName}`}
                        style={{ width: `${Math.min(100, budget.progress)}%` }}
                      />
                    </div>
                    <span className="w-8 text-xs font-semibold text-muted-foreground">
                      {budget.progress}%
                    </span>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Link
                      className="inline-flex size-8 items-center justify-center rounded-md border text-slate-600 hover:bg-slate-50"
                      href={`/transactions?categoryId=${budget.categoryId}&period=month`}
                    >
                      <Eye className="size-4" />
                      <span className="sr-only">View transactions</span>
                    </Link>
                    <AddBudgetDialog
                      budget={{
                        amount: budget.amount,
                        categoryColor: budget.categoryColor,
                        categoryId: budget.categoryId,
                        categoryIcon: budget.categoryIcon,
                        categoryName: budget.categoryName,
                      }}
                      categories={budgetDialogCategories}
                      month={data.monthKey}
                      trigger={<EditBudgetTrigger />}
                    />
                    <DeleteBudgetButton budgetId={budget.id} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {budgets.length === 0 ? (
          <EmptyState>No budgets yet.</EmptyState>
        ) : (
          budgets.map((budget) => {
            const status = getBudgetStatus(
              budget.amount > 0
                ? Math.round((budget.spent / budget.amount) * 100)
                : 0
            );
            const StatusIcon = status.icon;

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
                      {renderTransactionIcon(budget.categoryIcon ?? "Wallet", "size-4")}
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
                  <div className="flex gap-2">
                    <AddBudgetDialog
                      budget={{
                        amount: budget.amount,
                        categoryColor: budget.categoryColor,
                        categoryId: budget.categoryId,
                        categoryIcon: budget.categoryIcon,
                        categoryName: budget.categoryName,
                      }}
                      categories={budgetDialogCategories}
                      month={data.monthKey}
                      trigger={<EditBudgetTrigger />}
                    />
                    <DeleteBudgetButton budgetId={budget.id} />
                  </div>
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

                {(() => {
                  const insights = getBudgetInsights(budget);

                  return (
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
                            : `${money.format(Math.abs(insights.forecastDelta))} under`}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Last month</span>{" "}
                        <span className="font-bold text-slate-950">
                          {money.format(insights.lastMonthSpent)}
                        </span>
                      </p>
                    </div>
                  );
                })()}

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
          })
        )}
      </div>

      {unbudgeted.length > 0 ? (
        <div className="mt-5 rounded-lg border bg-background p-4 shadow-xs">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-sm font-bold text-slate-950">
              Unbudgeted Spending
            </h2>
            <span className="text-xs font-semibold text-amber-700">
              {money.format(
                unbudgeted.reduce((sum, item) => sum + item.spent, 0)
              )}
            </span>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            {unbudgeted.map((item) => (
              <div
                key={item.categoryId}
                className="flex items-center justify-between rounded-md bg-amber-50/70 px-3 py-2 text-sm"
              >
                <span className="font-semibold text-slate-800">
                  {item.categoryName}
                </span>
                <span className="font-bold text-amber-700">
                  {money.format(item.spent)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5">
        <BudgetSummary budgets={budgets} />
      </div>
    </PageShell>
  );
}
