import type {
  FinanceBudgetRow,
  FinanceTransaction,
} from "../../_lib/finance-data";

export function getBudgetMonthContext(monthKey: string, now = new Date()) {
  const selectedMonthDate = new Date(`${monthKey}T00:00:00`);
  const daysInMonth = new Date(
    selectedMonthDate.getFullYear(),
    selectedMonthDate.getMonth() + 1,
    0
  ).getDate();
  const isCurrentMonth =
    selectedMonthDate.getFullYear() === now.getFullYear() &&
    selectedMonthDate.getMonth() === now.getMonth();

  return {
    daysInMonth,
    elapsedDays: isCurrentMonth ? now.getDate() : daysInMonth,
    remainingDays: isCurrentMonth
      ? Math.max(1, daysInMonth - now.getDate() + 1)
      : daysInMonth,
  };
}

export function getBudgetInsights({
  budget,
  context,
  previousMonthTransactions,
}: {
  budget: FinanceBudgetRow;
  context: ReturnType<typeof getBudgetMonthContext>;
  previousMonthTransactions: FinanceTransaction[];
}) {
  const lastMonthSpent = previousMonthTransactions
    .filter(
      (transaction) =>
        transaction.type === "expense" &&
        transaction.categoryId === budget.categoryId
    )
    .reduce((total, transaction) => total + transaction.amount, 0);
  const dailyAvailable = budget.remaining / context.remainingDays;
  const dailyAverage = budget.spent / Math.max(1, context.elapsedDays);
  const forecast = dailyAverage * context.daysInMonth;

  return {
    dailyAvailable,
    dailyAverage,
    forecast,
    forecastDelta: forecast - budget.amount,
    lastMonthSpent,
  };
}
