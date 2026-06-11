"use client";

import { cn } from "@/lib/utils";
import { CircleDollarSign, ReceiptText, Wallet } from "lucide-react";
import { useMemo } from "react";
import type { TransactionRow } from "../_lib/data";
import type { TransactionSummaryPeriod } from "../_lib/types";

type Props = {
  period: TransactionSummaryPeriod;
  transactions: TransactionRow[];
};

const currency = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  style: "currency",
  maximumFractionDigits: 0,
});

const periodLabels: Record<TransactionSummaryPeriod, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
  all: "All Time",
};

export function TransactionsSummary({ period, transactions }: Props) {
  const summary = useMemo(() => {
    return transactions
      .reduce(
        (totals, transaction) => {
          if (transaction.type === "income") {
            totals.income += transaction.amount;
          }

          if (transaction.type === "expense") {
            totals.expense += transaction.amount;
          }

          totals.count += 1;
          return totals;
        },
        { count: 0, expense: 0, income: 0 }
      );
  }, [transactions]);

  const net = summary.income - summary.expense;
  const cards = [
    {
      icon: CircleDollarSign,
      label: "Income",
      tone: "bg-emerald-50 text-emerald-600",
      value: summary.income,
      valueClassName: "text-emerald-600",
    },
    {
      label: "Expense",
      icon: ReceiptText,
      tone: "bg-rose-50 text-rose-600",
      value: summary.expense,
      valueClassName: "text-slate-950",
    },
    {
      icon: Wallet,
      label: "Net",
      tone: net >= 0 ? "bg-violet-50 text-violet-600" : "bg-rose-50 text-rose-600",
      value: net,
      valueClassName: net >= 0 ? "text-emerald-600" : "text-red-600",
    },
  ];

  return (
    <section className="border-y py-3 md:space-y-3 md:py-4">
      <div className="md:hidden">
        <div className="rounded-lg border bg-slate-50/70 px-3 py-2">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-950">
              {periodLabels[period]}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">
              {summary.count} transactions
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
              <div key={card.label} className="min-w-0">
                <span className={cn("mb-1 flex size-6 items-center justify-center rounded-md", card.tone)}>
                  <Icon className="size-3.5" />
                </span>
                <p className="text-[11px] font-medium text-muted-foreground">{card.label}</p>
                <p
                  className={cn(
                    "truncate text-sm font-bold",
                    card.valueClassName
                  )}
                >
                  {currency.format(card.value)}
                </p>
              </div>
            )})}
          </div>
        </div>
      </div>

      <div className="hidden max-w-5xl items-center justify-between gap-4 md:flex">
        <div>
          <h2 className="text-sm font-bold text-slate-950">Overview</h2>
          <p className="text-xs text-muted-foreground">
            {periodLabels[period]} totals across {summary.count} transactions
          </p>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-2">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
          <div
            key={card.label}
            className="rounded-lg border bg-background p-3 shadow-xs"
          >
            <div className="flex items-center gap-2">
              <span className={cn("flex size-8 items-center justify-center rounded-md", card.tone)}>
                <Icon className="size-4" />
              </span>
              <p className="text-xs font-semibold text-muted-foreground">
                {card.label}
              </p>
            </div>
            <div className="mt-2 min-w-0">
              <p
                className={cn(
                  "truncate text-base font-bold tracking-normal sm:text-lg",
                  card.valueClassName
                )}
              >
                {currency.format(card.value)}
              </p>
            </div>
          </div>
        )})}
        </div>
      </div>
    </section>
  );
}
