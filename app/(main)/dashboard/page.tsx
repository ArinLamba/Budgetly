import { Button } from "@/components/ui/button";
import {
  BudgetSummary,
  DonutChart,
  MiniCalendar,
  PageShell,
  PageTitle,
  SectionCard,
  SpendingCalendarLegend,
  TransactionMiniList,
} from "../_components/finance-ui";
import { MonthControls } from "../_components/period-controls";
import {
  getBudgetRows,
  getCalendarDays,
  getCategorySummaries,
  getFinanceData,
  getMonthTransactions,
  getTotals,
} from "../_lib/finance-data";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  getCategoryPeriodTransactions,
  normalizeCategoryPeriod,
} from "./_lib/dashboard-period";
import { CategoryPeriodControls } from "./_components/category-period-controls";
import { CategoryProgressList } from "./_components/category-progress-list";
import { DashboardMetricGrid } from "./_components/dashboard-metric-grid";

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  const params = await searchParams;
  const month = typeof params.month === "string" ? params.month : undefined;
  const categoryPeriod = normalizeCategoryPeriod(
    typeof params.categoryPeriod === "string"
      ? params.categoryPeriod
      : undefined
  );
  const data = await getFinanceData(month);
  const monthTransactions = getMonthTransactions(data.transactions, data.monthKey);
  const categoryTransactions = getCategoryPeriodTransactions({
    monthKey: data.monthKey,
    monthTransactions,
    period: categoryPeriod,
    transactions: data.transactions,
  });
  const totals = getTotals(monthTransactions);
  const allTimeTotals = getTotals(data.transactions);
  const balance =
    data.accounts.reduce((sum, account) => sum + account.balanceSnapshot, 0) +
    allTimeTotals.income -
    allTimeTotals.expense;
  const categorySummaries = getCategorySummaries(
    data.categories,
    categoryTransactions
  );
  const budgets = getBudgetRows(data.budgets, monthTransactions);
  const budgetRemaining = budgets.reduce(
    (sum, budget) => sum + budget.remaining,
    0
  );
  const calendarDays = getCalendarDays(monthTransactions);

  return (
    <PageShell>
      <PageTitle
        action={
          <Button variant="main" className="h-9 px-4 text-xs">
            <Plus className="size-4" />
            Add Transaction
          </Button>
        }
      >
        Good morning, Honey
      </PageTitle>

      <DashboardMetricGrid
        balance={balance}
        budgetCount={budgets.length}
        budgetRemaining={budgetRemaining}
        expense={totals.expense}
        income={totals.income}
      />

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <SectionCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Expenses Overview</h2>
          </div>
          <DonutChart categories={categorySummaries} />
        </SectionCard>

        <SectionCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Recent Transactions</h2>
            <Link href="/transactions"  className="h-7 px-2 text-xs text-indigo-700">
              View all
            </Link>
          </div>
          <TransactionMiniList transactions={data.transactions} />
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <SectionCard>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-bold text-foreground">Spending Calendar</h2>
            <MonthControls month={data.monthKey} pathname="/dashboard" />
          </div>
          <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <MiniCalendar days={calendarDays} />
            <div className="lg:min-w-28">
              <SpendingCalendarLegend />
            </div>
          </div>
        </SectionCard>
        <SectionCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground">Top Categories</h2>
            <CategoryPeriodControls
              month={data.monthKey}
              pathname="/dashboard"
              period={categoryPeriod}
            />
          </div>
          <CategoryProgressList categories={categorySummaries} compact />
        </SectionCard>
      </div>

      <div className="mt-4">
        <BudgetSummary budgets={budgets} />
      </div>
    </PageShell>
  );
}
