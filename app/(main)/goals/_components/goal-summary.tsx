import { MetricCard, icons, money } from "../../_components/finance-ui";
import type { FinanceGoalRow } from "../../_lib/finance-data";
import { getGoalMetrics } from "../_lib/goal-metrics";

export function GoalSummary({ goals }: { goals: FinanceGoalRow[] }) {
  const metrics = getGoalMetrics(goals);

  return (
    <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={icons.CircleDollarSign}
        label="Total Saved"
        tone="green"
        trend={`${metrics.activeCount} active goals`}
        value={money.format(metrics.totalSaved)}
      />
      <MetricCard
        icon={icons.Goal}
        label="Total Target"
        tone="violet"
        trend={`${metrics.completedCount} completed`}
        value={money.format(metrics.totalTarget)}
      />
      <MetricCard
        icon={icons.Wallet}
        label="Remaining"
        tone="blue"
        trend="Across all goals"
        value={money.format(metrics.totalRemaining)}
      />
      <MetricCard
        icon={icons.ReceiptText}
        label="Completed"
        tone="green"
        trend={`${metrics.activeCount} still in progress`}
        value={`${metrics.completedCount} / ${goals.length}`}
      />
    </div>
  );
}
