import { MetricCard, icons, money } from "../../_components/finance-ui";

export function BudgetMetricGrid({
  activeBudgetCount,
  monthlyExpense,
  overBudgetCount,
  totalBudgeted,
  totalRemaining,
  totalSpent,
}: {
  activeBudgetCount: number;
  monthlyExpense: number;
  overBudgetCount: number;
  totalBudgeted: number;
  totalRemaining: number;
  totalSpent: number;
}) {
  return (
    <div className="mb-4 grid gap-4 grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={icons.Wallet}
        label="Total Budgeted"
        tone="blue"
        trend={`${activeBudgetCount} active budgets`}
        value={money.format(totalBudgeted)}
      />
      <MetricCard
        icon={icons.ReceiptText}
        label="Total Spent"
        tone="red"
        trend={`${money.format(monthlyExpense)} monthly expense`}
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
  );
}
