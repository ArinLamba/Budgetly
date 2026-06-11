import { MetricCard, icons } from "../../_components/finance-ui";
import { reportMoney } from "../_lib/report-format";

export function ReportsMetricGrid({
  expense,
  income,
}: {
  expense: number;
  income: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard
        icon={icons.CircleDollarSign}
        label="Total Income"
        tone="green"
        trend="+0% vs last month"
        value={reportMoney.format(income)}
      />
      <MetricCard
        icon={icons.ReceiptText}
        label="Total Expenses"
        tone="red"
        trend="+0% vs last month"
        value={reportMoney.format(expense)}
      />
      <MetricCard
        icon={icons.Wallet}
        label="Net Savings"
        tone="violet"
        trend="+0% vs last month"
        value={reportMoney.format(income - expense)}
      />
    </div>
  );
}
