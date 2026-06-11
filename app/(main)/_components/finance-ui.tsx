import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  CreditCard,
  Goal,
  Home,
  Laptop,
  ReceiptText,
  Shield,
  Smartphone,
  Utensils,
  Wallet,
} from "lucide-react";
import type {
  FinanceBudgetRow,
  FinanceCategorySummary,
  FinanceGoalRow,
  FinanceTransaction,
} from "../_lib/finance-data";

export const money = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 0,
  style: "currency",
});

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function getTransactionIcon(type: string) {
  return type === "income" ? Wallet : ReceiptText;
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/80 p-2 md:p-3">
      <section className="min-h-[calc(100vh-1rem)] rounded-lg border bg-background p-4 shadow-sm md:p-6">
        {children}
      </section>
    </div>
  );
}

export function SectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border bg-background p-4 shadow-xs", className)}>
      {children}
    </div>
  );
}

export function PageTitle({
  action,
  children,
}: {
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3">
      <h1 className="text-xl font-bold text-slate-950">{children}</h1>
      {action}
    </div>
  );
}

export function MetricCard({
  icon: Icon,
  label,
  tone = "blue",
  trend,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone?: "blue" | "green" | "red" | "violet";
  trend: string;
  value: string;
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <SectionCard className="p-3">
      <div className="flex items-center gap-2">
        <span className={cn("flex size-8 items-center justify-center rounded-md", tones[tone])}>
          <Icon className="size-4" />
        </span>
        <p className="text-xs font-semibold text-slate-600">{label}</p>
      </div>
      <p className="mt-3 text-xl font-bold text-slate-950">{value}</p>
      <p className={cn("mt-1 flex items-center gap-1 text-xs font-medium", trend.startsWith("-") ? "text-rose-600" : "text-emerald-600")}>
        {trend.startsWith("-") ? <ArrowDownRight className="size-3" /> : <ArrowUpRight className="size-3" />}
        {trend}
      </p>
    </SectionCard>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed bg-slate-50/70 p-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export function TransactionMiniList({
  limit = 4,
  transactions,
}: {
  limit?: number;
  transactions: FinanceTransaction[];
}) {
  if (transactions.length === 0) {
    return <EmptyState>No transactions yet.</EmptyState>;
  }

  return (
    <div className="space-y-3">
      {transactions.slice(0, limit).map((item) => {
        const Icon = getTransactionIcon(item.type);
        const signedAmount =
          item.type === "income" ? item.amount : -item.amount;
        return (
          <div key={item.id} className="flex items-center gap-3">
            <span
              className="flex size-9 items-center justify-center rounded-md"
              style={{ backgroundColor: `${item.color}1f`, color: item.color }}
            >
              <Icon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-950">{item.description}</p>
              <p className="text-xs text-muted-foreground">{item.category ?? "Uncategorized"}</p>
            </div>
            <div className="text-right">
              <p className={cn("text-sm font-bold", signedAmount > 0 ? "text-emerald-600" : "text-slate-950")}>
                {signedAmount > 0 ? "+" : "-"} {money.format(Math.abs(signedAmount))}
              </p>
              <p className="text-[11px] text-muted-foreground">{formatDate(item.date)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CategoryProgressList({
  categories,
  compact = false,
}: {
  categories: FinanceCategorySummary[];
  compact?: boolean;
}) {
  const visibleCategories = categories.filter((category) => category.amount > 0);

  if (visibleCategories.length === 0) {
    return <EmptyState>No category spending yet.</EmptyState>;
  }

  return (
    <div className="space-y-3">
      {visibleCategories.slice(0, compact ? 4 : visibleCategories.length).map((category) => {
        return (
          <div key={category.id} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="flex size-9 items-center justify-center rounded-md"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
              >
                <Utensils className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-950">{category.name}</p>
                <Progress
                  value={category.percent}
                  className="mt-2 h-1.5"
                  style={{ "--primary": category.color } as React.CSSProperties}
                />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-600">{category.percent}%</p>
          </div>
        );
      })}
    </div>
  );
}

export function DonutChart({
  categories,
}: {
  categories: FinanceCategorySummary[];
}) {
  const visibleCategories = categories.filter((category) => category.amount > 0);
  const total = visibleCategories.reduce(
    (sum, category) => sum + category.amount,
    0
  );
  const palette = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#94a3b8"];
  let cursor = 0;
  const gradient =
    total > 0
      ? visibleCategories
          .slice(0, 6)
          .map((category, index) => {
            const start = cursor;
            const end = cursor + (category.amount / total) * 100;
            cursor = end;
            return `${category.color || palette[index]} ${start}% ${end}%`;
          })
          .join(",")
      : "#e2e8f0 0% 100%";

  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-center">
      <div
        className="relative size-42 shrink-0 rounded-full"
        style={{ background: `conic-gradient(${gradient})` }}
      >
        <div className="absolute inset-8 flex flex-col items-center justify-center rounded-full bg-background">
          <p className="text-lg font-bold text-slate-950">{money.format(total)}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>
      <div className="grid flex-1 gap-2">
        {visibleCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No expense data yet.</p>
        ) : visibleCategories.slice(0, 6).map((category, index) => (
          <div key={category.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-xs">
            <span className="flex items-center gap-2 font-medium text-slate-700">
              <span className="size-2 rounded-full" style={{ backgroundColor: category.color || palette[index] }} />
              {category.name}
            </span>
            <span className="font-semibold text-slate-950">{money.format(category.amount)}</span>
            <span className="text-muted-foreground">{category.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MiniCalendar({
  days,
}: {
  days: { amount: number; day: number; inMonth: boolean }[];
}) {
  function colorForAmount(amount: number) {
    if (amount === 0) return "bg-slate-100";
    if (amount <= 500) return "bg-emerald-100";
    if (amount <= 1500) return "bg-yellow-200";
    if (amount <= 3000) return "bg-orange-300";
    return "bg-rose-300";
  }

  return (
    <div>
      <div className="mb-3 grid grid-cols-7 text-center text-xs font-semibold text-slate-700">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((item, index) => {
          return (
            <span
              key={`${item.day}-${index}`}
              className={cn(
                "flex h-8 items-center justify-center rounded-md text-xs font-semibold",
                item.inMonth ? "text-slate-700" : "text-slate-400",
                colorForAmount(item.amount)
              )}
            >
              {item.day}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function SpendingCalendarLegend() {
  const items = [
    ["bg-slate-100", "₹0"],
    ["bg-emerald-100", "₹1 - ₹500"],
    ["bg-yellow-200", "₹501 - ₹1,500"],
    ["bg-orange-300", "₹1,501 - ₹3,000"],
    ["bg-rose-300", "₹3,000+"],
  ];

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground lg:flex-col lg:gap-2">
      {items.map(([color, label]) => (
        <span key={label} className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", color)} />
          {label}
        </span>
      ))}
    </div>
  );
}

export function TrendLine({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  const width = 455;
  const height = 110;
  const points = values.length
    ? values
        .map((value, index) => {
          const x = values.length === 1 ? 0 : (index / (values.length - 1)) * width;
          const y = height - 15 - (value / max) * 80;
          return `${x},${y}`;
        })
        .join(" ")
    : "0,95 455,95";

  return (
    <svg viewBox="0 0 455 110" className="h-56 w-full overflow-visible">
      {[20, 50, 80].map((y) => (
        <line key={y} x1="0" x2="455" y1={y} y2={y} stroke="#e2e8f0" strokeWidth="1" />
      ))}
      <polyline points={points} fill="none" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {points.split(" ").map((point) => {
        const [x, y] = point.split(",");
        return <circle key={point} cx={x} cy={y} r="4" fill="#fff" stroke="#7c3aed" strokeWidth="2" />;
      })}
    </svg>
  );
}

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
            <p className="mt-1 text-lg font-bold text-slate-950">{money.format(totalBudgeted)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="mt-1 text-lg font-bold text-slate-950">{money.format(totalSpent)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Remaining</p>
            <p className="mt-1 text-lg font-bold text-emerald-600">{money.format(remaining)}</p>
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

export function StatusBadge({ children }: { children: React.ReactNode }) {
  return <Badge className="rounded-md bg-violet-50 text-violet-700 hover:bg-violet-50">{children}</Badge>;
}

export const icons = {
  CalendarDays,
  ChartNoAxesCombined,
  CircleDollarSign,
  CreditCard,
  Goal,
  Home,
  ReceiptText,
  Wallet,
};

export function GoalList({ goals }: { goals: FinanceGoalRow[] }) {
  if (goals.length === 0) {
    return <EmptyState>No goals yet. Add a goal to start tracking progress.</EmptyState>;
  }

  const goalIcons = [Laptop, Shield, Smartphone, Goal];

  return (
    <div className="grid gap-4">
      {goals.map((goal, index) => {
        const Icon = goalIcons[index % goalIcons.length];
        const progress =
          goal.targetAmount > 0
            ? Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100))
            : 0;

        return (
          <div key={goal.id} className="rounded-lg border bg-background p-4 shadow-xs">
            <div className="flex items-center gap-4">
              <span className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                <Icon className="size-9" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-slate-950">{goal.name}</h2>
                    <p className="text-sm text-slate-600">
                      {money.format(goal.savedAmount)} / {money.format(goal.targetAmount)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-slate-600">{progress}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
