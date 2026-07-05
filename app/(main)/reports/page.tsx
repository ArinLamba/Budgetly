import {
  DonutChart,
  PageShell,
  PageTitle,
  SectionCard,
  SpendingTrendChart,
} from "../_components/finance-ui";
import { Button } from "@/components/ui/button";
import {
  getReportsData,
  getTrendPoints,
} from "../_lib/finance-data";
import { ReportsMetricGrid } from "./_components/reports-metric-grid";

export default async function ReportsPage({
  searchParams,
}: PageProps<"/reports">) {
  const params = await searchParams;
  const month = typeof params.month === "string" ? params.month : undefined;
  const data = await getReportsData(month);
  const trendPoints = getTrendPoints(data.monthTransactions, data.monthKey);

  return (
    <PageShell>
      <PageTitle
        heading={<h1 className="text-xl font-bold">Reports</h1>}
        action={<Button variant="outline" className="h-8 px-3 text-xs">This Month</Button>}
      />


      <ReportsMetricGrid
        expense={data.totals.expense}
        income={data.totals.income}
      />

      <SectionCard className="mt-4">
        <h2 className="mb-3 text-sm font-bold text-foreground">Spending Trend</h2>
        <SpendingTrendChart values={trendPoints} />
      </SectionCard>

      <SectionCard className="mt-4">
        <h2 className="mb-4 text-sm font-bold text-foreground">Expenses by Category</h2>
        <DonutChart categories={data.categorySummaries} />
      </SectionCard>
    </PageShell>
  );
}
