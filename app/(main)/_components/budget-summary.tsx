import type { FinanceBudgetRow } from "../_lib/finance-data";
import { money } from "./format";
import { SectionCard } from "./layout-parts";

export function BudgetSummary({ budgets }: { budgets: FinanceBudgetRow[] }) {
  const totalBudgeted = budgets.reduce((sum, budget) => sum + budget.amount, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remaining = Math.max(0, totalBudgeted - totalSpent);
  const percent =
    totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;

  return (
    <SectionCard>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid flex-1 grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Total Budgeted</p>
            <p className="mt-1 text-lg font-bold text-slate-950">
              {money.format(totalBudgeted)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="mt-1 text-lg font-bold text-slate-950">
              {money.format(totalSpent)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="mt-1 text-lg font-bold text-emerald-600">
              {money.format(remaining)}
            </p>
          </div>
        </div>
        <div
          className="relative mx-auto size-24 rounded-full"
          style={{
            background: `conic-gradient(#7c3aed 0 ${percent}%, #e5e7eb ${percent}% 100%)`,
          }}
        >
          <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-background">
            <p className="text-lg font-bold">{percent}%</p>
            <p className="text-xs text-muted-foreground">Spent</p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
