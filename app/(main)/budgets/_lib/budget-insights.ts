import type {
  FinanceBudgetRow,
  FinanceTransaction,
} from "../../_lib/finance-data";
import {
  getDateKey,
  getDayOfMonth,
  getDaysInMonth,
  getMonthKey,
} from "../../_lib/date-utils";

export function getBudgetMonthContext(monthKey: string, now = new Date()) {
  const daysInMonth = getDaysInMonth(monthKey);
  const currentMonth = getMonthKey(now);
  const currentDay = getDayOfMonth(getDateKey(now));
  const isCurrentMonth = monthKey === currentMonth;

  return {
    daysInMonth,
    elapsedDays: isCurrentMonth ? currentDay : daysInMonth,
    remainingDays: isCurrentMonth
      ? Math.max(1, daysInMonth - currentDay + 1)
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
