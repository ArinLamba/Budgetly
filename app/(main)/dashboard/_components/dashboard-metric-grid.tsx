import { MetricCard, icons, money } from "../../_components/finance-ui";

export function DashboardMetricGrid({
  balance,
  budgetCount,
  budgetRemaining,
  expense,
  income,
}: {
  balance: number;
  budgetCount: number;
  budgetRemaining: number;
  expense: number;
  income: number;
}) {
  return (
    <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={icons.Wallet}
        label="Total Balance"
        tone="blue"
        trend="+0% vs last month"
        value={money.format(balance)}
      />
      <MetricCard
        icon={icons.CircleDollarSign}
        label="Income This Month"
        tone="green"
        trend="+0% vs last month"
        value={money.format(income)}
      />
      <MetricCard
        icon={icons.ReceiptText}
        label="Expenses This Month"
        tone="red"
        trend="+0% vs last month"
        value={money.format(expense)}
      />
      <MetricCard
        icon={icons.Goal}
        label="Budget Remaining"
        tone="violet"
        trend={`${budgetCount} active budgets`}
        value={money.format(budgetRemaining)}
      />
    </div>
  );
}
