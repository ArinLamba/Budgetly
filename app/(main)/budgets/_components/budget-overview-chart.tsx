"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { FinanceBudgetRow } from "../../_lib/finance-data";
import { EmptyState, SectionCard } from "../../_components/finance-ui";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  remaining: {
    color: "#10b981",
    label: "Remaining",
  },
  spent: {
    color: "#ef4444",
    label: "Spent",
  },
} satisfies ChartConfig;

export function BudgetOverviewChart({
  budgets,
}: {
  budgets: FinanceBudgetRow[];
}) {
  const chartData = budgets.slice(0, 8).map((budget) => ({
    category: budget.categoryName,
    remaining: budget.remaining,
    spent: budget.spent,
  }));

  return (
    <SectionCard className="mb-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-foreground">
            Budget Utilization
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Spent and remaining by category
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <EmptyState>No budget chart data yet.</EmptyState>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="h-72 w-full aspect-auto"
          initialDimension={{ height: 288, width: 760 }}
        >
          <BarChart data={chartData} margin={{ left: 8, right: 8, top: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              axisLine={false}
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              tickFormatter={(value) =>
                String(value).length > 12
                  ? `${String(value).slice(0, 12)}...`
                  : String(value)
              }
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" />}
              cursor={false}
            />
            <Bar
              dataKey="spent"
              fill="var(--color-spent)"
              radius={[4, 4, 0, 0]}
              stackId="budget"
            />
            <Bar
              dataKey="remaining"
              fill="var(--color-remaining)"
              radius={[4, 4, 0, 0]}
              stackId="budget"
            />
          </BarChart>
        </ChartContainer>
      )}
    </SectionCard>
  );
}
