import { MonthControls } from "../../_components/period-controls";
import { money } from "../../_components/finance-ui";

export function BudgetToolbar({
  month,
  monthDelta,
}: {
  month: string;
  monthDelta: number;
}) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <MonthControls month={month} pathname="/budgets" />
      <p className="text-xs font-medium text-muted-foreground">
        {monthDelta === 0
          ? "Spending is unchanged from last month"
          : `${monthDelta > 0 ? "Spent" : "Saved"} ${money.format(
              Math.abs(monthDelta)
            )} ${monthDelta > 0 ? "more" : "less"} than last month`}
      </p>
    </div>
  );
}
