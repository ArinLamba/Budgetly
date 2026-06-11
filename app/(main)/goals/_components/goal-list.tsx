import { EmptyState } from "../../_components/empty-state";
import { money } from "../../_components/format";
import type { FinanceGoalRow } from "../../_lib/finance-data";
import { getGoalProgress } from "../_lib/goal-progress";
import { Goal, Laptop, Shield, Smartphone } from "lucide-react";

export function GoalList({ goals }: { goals: FinanceGoalRow[] }) {
  if (goals.length === 0) {
    return (
      <EmptyState>No goals yet. Add a goal to start tracking progress.</EmptyState>
    );
  }

  const goalIcons = [Laptop, Shield, Smartphone, Goal];

  return (
    <div className="grid gap-4">
      {goals.map((goal, index) => {
        const Icon = goalIcons[index % goalIcons.length];
        const progress = getGoalProgress(goal.savedAmount, goal.targetAmount);

        return (
          <div
            key={goal.id}
            className="rounded-lg border bg-background p-4 shadow-xs"
          >
            <div className="flex items-center gap-4">
              <span className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <Icon className="size-9" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-950">{goal.name}</h2>
                    <p className="text-sm text-slate-600">
                      {money.format(goal.savedAmount)} /{" "}
                      {money.format(goal.targetAmount)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">
                    {progress}%
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
