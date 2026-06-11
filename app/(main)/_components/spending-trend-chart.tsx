"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  amount: {
    color: "#7c3aed",
    label: "Spending",
  },
} satisfies ChartConfig;

export function SpendingTrendChart({ values }: { values: number[] }) {
  const data = values.map((amount, index) => ({
    amount,
    day: String(index + 1),
  }));

  return (
    <ChartContainer
      config={chartConfig}
      className="h-64 w-full aspect-auto"
      initialDimension={{ height: 260, width: 720 }}
    >
      <AreaChart data={data} margin={{ left: 8, right: 8, top: 16 }}>
        <defs>
          <linearGradient id="spendingTrend" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.28} />
            <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="4 4" />
        <XAxis
          axisLine={false}
          dataKey="day"
          interval="preserveStartEnd"
          tickLine={false}
          tickMargin={10}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(label) => `Day ${label}`}
            />
          }
          cursor={false}
        />
        <Area
          dataKey="amount"
          fill="url(#spendingTrend)"
          stroke="var(--color-amount)"
          strokeWidth={3}
          type="monotone"
        />
      </AreaChart>
    </ChartContainer>
  );
}
