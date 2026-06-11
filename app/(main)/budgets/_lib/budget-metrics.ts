import type { FinanceBudgetRow } from "../../_lib/finance-data";

export function getBudgetMetrics(budgets: FinanceBudgetRow[]) {
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);

  return {
    overBudgetCount: budgets.filter((budget) => budget.spent > budget.amount)
      .length,
    totalBudgeted,
    totalRemaining: Math.max(0, totalBudgeted - totalSpent),
    totalSpent,
  };
}
