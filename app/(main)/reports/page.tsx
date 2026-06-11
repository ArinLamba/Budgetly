import {
  DonutChart,
  MetricCard,
  PageShell,
  PageTitle,
  SectionCard,
  TrendLine,
  icons,
} from "../_components/finance-ui";
import { Button } from "@/components/ui/button";
import {
  getCategorySummaries,
  getFinanceData,
  getMonthTransactions,
  getTotals,
  getTrendPoints,
} from "../_lib/finance-data";

export default async function ReportsPage({
  searchParams,
}: PageProps<"/reports">) {
  const params = await searchParams;
  const month = typeof params.month === "string" ? params.month : undefined;
  const data = await getFinanceData(month);
  const monthTransactions = getMonthTransactions(data.transactions, data.monthKey);
  const totals = getTotals(monthTransactions);
  const categorySummaries = getCategorySummaries(
    data.categories,
    monthTransactions
  );
  const trendPoints = getTrendPoints(monthTransactions, data.monthKey);

  return (
    <PageShell>
      <PageTitle
        action={<Button variant="outline" className="h-8 px-3 text-xs">This Month</Button>}
      >
        Reports
      </PageTitle>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard icon={icons.CircleDollarSign} label="Total Income" tone="green" trend="+0% vs last month" value={totals.income.toLocaleString("en-IN", { currency: "INR", maximumFractionDigits: 0, style: "currency" })} />
        <MetricCard icon={icons.ReceiptText} label="Total Expenses" tone="red" trend="+0% vs last month" value={totals.expense.toLocaleString("en-IN", { currency: "INR", maximumFractionDigits: 0, style: "currency" })} />
        <MetricCard icon={icons.Wallet} label="Net Savings" tone="violet" trend="+0% vs last month" value={(totals.income - totals.expense).toLocaleString("en-IN", { currency: "INR", maximumFractionDigits: 0, style: "currency" })} />
      </div>

      <SectionCard className="mt-4">
        <h2 className="mb-3 text-sm font-bold text-slate-950">Spending Trend</h2>
        <TrendLine values={trendPoints} />
      </SectionCard>

      <SectionCard className="mt-4">
        <h2 className="mb-4 text-sm font-bold text-slate-950">Expenses by Category</h2>
        <DonutChart categories={categorySummaries} />
      </SectionCard>
    </PageShell>
  );
}
