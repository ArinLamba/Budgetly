import { cn } from "@/lib/utils";
import { FinanceGoalRow } from "../../_lib/finance-data";
import { money } from "../../_components/format";

function formatContributionDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export const GoalHistoryPanel = ({ goal }: { goal: FinanceGoalRow }) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-background">
      <div className="shrink-0 border-b p-3">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">
          Contribution history
        </p>
        <h2 className="mt-1 truncate text-base font-bold text-foreground">
          {goal.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {goal.contributions.length} entries
        </p>
      </div>
      {goal.contributions.length === 0 ? (
        <div className="p-3 text-sm text-muted-foreground">No contributions yet.</div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <div className="divide-y rounded-md border bg-background">
            {goal.contributions.map((contribution) => (
              <div
                key={contribution.id}
                className="flex items-start justify-between gap-3 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {contribution.note ?? "Contribution"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatContributionDate(contribution.contributedAt)}
                  </p>
                </div>
                <p
                  className={cn(
                    "shrink-0 text-sm font-bold",
                    contribution.amount >= 0 ? "text-emerald-700" : "text-red-600"
                  )}
                >
                  {contribution.amount >= 0 ? "+" : "-"}
                  {money.format(Math.abs(contribution.amount))}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
