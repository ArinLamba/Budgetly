import { BudgetSummary, PageShell, PageTitle } from "../_components/finance-ui";
import {
  getBudgetRows,
  getBudgetsData,
  getTotals,
  getUnbudgetedSpending,
} from "../_lib/finance-data";
import { AddBudgetDialog } from "./_components/add-budget-dialog";
import { BudgetDesktopTable } from "./_components/budget-desktop-table";
import { BudgetMetricGrid } from "./_components/budget-metric-grid";
import { BudgetMobileList } from "./_components/budget-mobile-list";
import { BudgetOverviewChart } from "./_components/budget-overview-chart";
import { BudgetToolbar } from "./_components/budget-toolbar";
import { UnbudgetedSpendingCard } from "./_components/unbudgeted-spending-card";
import { buildBudgetDialogCategories } from "./_lib/budget-dialog-categories";
import {
  getBudgetInsights,
  getBudgetMonthContext,
} from "./_lib/budget-insights";
import { getBudgetMetrics } from "./_lib/budget-metrics";

export default async function BudgetsPage({
  searchParams,
}: PageProps<"/budgets">) {
  const params = await searchParams;
  const month = typeof params.month === "string" ? params.month : undefined;
  const data = await getBudgetsData(month);
  const budgets = getBudgetRows(data.budgets, data.currentTransactions);
  const budgetMetrics = getBudgetMetrics(budgets);
  const currentTotals = getTotals(data.currentTransactions);
  const previousTotals = getTotals(data.previousTransactions);
  const monthContext = getBudgetMonthContext(data.monthKey);
  const budgetDialogCategories = buildBudgetDialogCategories({
    budgets,
    categories: data.categories,
    currentTransactions: data.currentTransactions,
    previousTransactions: data.previousTransactions,
  });
  const existingCategoryIds = budgets.map((budget) => budget.categoryId);
  const unbudgeted = getUnbudgetedSpending(
    data.categories,
    budgets,
    data.currentTransactions
  );
  const getInsights = (budget: (typeof budgets)[number]) =>
    getBudgetInsights({
      budget,
      context: monthContext,
      previousMonthTransactions: data.previousTransactions,
    });

  return (
    <PageShell>
      <PageTitle
        heading={<h1 className="text-xl font-bold">Budgets</h1>}
        action={
          <AddBudgetDialog
            categories={budgetDialogCategories}
            existingCategoryIds={existingCategoryIds}
            month={data.monthKey}
          />
        }
      />
      
      <BudgetToolbar
        month={data.monthKey}
        monthDelta={currentTotals.expense - previousTotals.expense}
      />

      <BudgetMetricGrid
        activeBudgetCount={budgets.length}
        monthlyExpense={currentTotals.expense}
        overBudgetCount={budgetMetrics.overBudgetCount}
        totalBudgeted={budgetMetrics.totalBudgeted}
        totalRemaining={budgetMetrics.totalRemaining}
        totalSpent={budgetMetrics.totalSpent}
      />

      <BudgetOverviewChart budgets={budgets} />

      <BudgetDesktopTable
        budgets={budgets}
        categories={budgetDialogCategories}
        getInsights={getInsights}
        month={data.monthKey}
      />
      <BudgetMobileList
        budgets={budgets}
        categories={budgetDialogCategories}
        getInsights={getInsights}
        month={data.monthKey}
      />

      <UnbudgetedSpendingCard items={unbudgeted} />

      <div className="mt-5">
        <BudgetSummary budgets={budgets} />
      </div>
    </PageShell>
  );
}
