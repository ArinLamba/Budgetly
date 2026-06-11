import {
  DonutChart,
  PageShell,
  PageTitle,
  SectionCard,
  SpendingTrendChart,
} from "../_components/finance-ui";
import { Button } from "@/components/ui/button";
import {
  getCategorySummaries,
  getFinanceData,
  getMonthTransactions,
  getTotals,
  getTrendPoints,
} from "../_lib/finance-data";
import { ReportsMetricGrid } from "./_components/reports-metric-grid";

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

      <ReportsMetricGrid expense={totals.expense} income={totals.income} />

      <SectionCard className="mt-4">
        <h2 className="mb-3 text-sm font-bold text-slate-950">Spending Trend</h2>
        <SpendingTrendChart values={trendPoints} />
      </SectionCard>

      <SectionCard className="mt-4">
        <h2 className="mb-4 text-sm font-bold text-slate-950">Expenses by Category</h2>
        <DonutChart categories={categorySummaries} />
      </SectionCard>
    </PageShell>
  );
}
