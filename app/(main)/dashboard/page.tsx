import { Button } from "@/components/ui/button";
import {
  BudgetSummary,
  CategoryProgressList,
  DonutChart,
  MetricCard,
  MiniCalendar,
  PageShell,
  PageTitle,
  SectionCard,
  SpendingCalendarLegend,
  TransactionMiniList,
  icons,
} from "../_components/finance-ui";
import { CategoryPeriodControls, MonthControls } from "../_components/period-controls";
import {
  getBudgetRows,
  getCalendarDays,
  getCategorySummaries,
  getFinanceData,
  getMonthTransactions,
  getTotals,
} from "../_lib/finance-data";
import { Plus } from "lucide-react";

export default async function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  const params = await searchParams;
  const month = typeof params.month === "string" ? params.month : undefined;
  const categoryPeriod =
    typeof params.categoryPeriod === "string" ? params.categoryPeriod : "month";
  const data = await getFinanceData(month);
  const monthTransactions = getMonthTransactions(data.transactions, data.monthKey);
  const categoryTransactions =
    categoryPeriod === "all"
      ? data.transactions
      : categoryPeriod === "year"
        ? data.transactions.filter((transaction) =>
            transaction.date.startsWith(data.monthKey.slice(0, 4))
          )
        : monthTransactions;
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={icons.Wallet} label="Total Balance" tone="blue" trend="+0% vs last month" value={balance.toLocaleString("en-IN", { currency: "INR", maximumFractionDigits: 0, style: "currency" })} />
        <MetricCard icon={icons.CircleDollarSign} label="Income This Month" tone="green" trend="+0% vs last month" value={totals.income.toLocaleString("en-IN", { currency: "INR", maximumFractionDigits: 0, style: "currency" })} />
        <MetricCard icon={icons.ReceiptText} label="Expenses This Month" tone="red" trend="+0% vs last month" value={totals.expense.toLocaleString("en-IN", { currency: "INR", maximumFractionDigits: 0, style: "currency" })} />
        <MetricCard icon={icons.Goal} label="Budget Remaining" tone="violet" trend={`${budgets.length} active budgets`} value={budgetRemaining.toLocaleString("en-IN", { currency: "INR", maximumFractionDigits: 0, style: "currency" })} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <SectionCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-950">Expenses Overview</h2>
          </div>
          <DonutChart categories={categorySummaries} />
        </SectionCard>

        <SectionCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-950">Recent Transactions</h2>
            <Button variant="ghost" className="h-7 px-2 text-xs text-violet-700">
              View all
            </Button>
          </div>
          <TransactionMiniList transactions={data.transactions} />
        </SectionCard>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
        <SectionCard>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-bold text-slate-950">Spending Calendar</h2>
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
            <h2 className="text-sm font-bold text-slate-950">Top Categories</h2>
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
