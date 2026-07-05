"use client";

import { cn } from "@/lib/utils";
import { CircleDollarSign, ReceiptText, Wallet } from "lucide-react";
import type { TransactionSummaryPeriod } from "../_lib/types";
import { CardWrapper } from "@/components/card-wrapper";

type Props = {
  period: TransactionSummaryPeriod;
  summary: {
    count: number;
    expense: number;
    income: number;
  };
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

export function TransactionsSummary({ period, summary }: Props) {
  const net = summary.income - summary.expense;
  const cards = [
    {
      icon: CircleDollarSign,
      label: "Income",
      tone: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      value: summary.income,
      valueClassName: "text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Expense",
      icon: ReceiptText,
      tone: "border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      value: summary.expense,
      valueClassName: "text-rose-600 dark:text-rose-400",
    },
    {
      icon: Wallet,
      label: "Net",
      tone: net >= 0 ? "border border-violet-500/20 bg-violet-500/10 text-violet-600 dark:text-violet-400" : "border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      value: net,
      valueClassName: net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <CardWrapper className=" ">
      <div className="md:hidden">
        <div className="">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-bold text-foreground">
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
              <div key={card.label} className={cn(
                "min-w-0 rounded-md px-2 py-2",
                card.tone
              )}>
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

      <div className="hidden items-center justify-between gap-4 md:flex">
        <div>
          <h2 className="text-sm font-bold text-foreground">Overview</h2>
          <p className="text-xs text-muted-foreground">
            {periodLabels[period]} totals across {summary.count} transactions
          </p>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-3">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
          <div
            key={card.label}
            className={cn(
              "rounded-md border p-3 shadow-xs transition-colors ",
              card.tone
            )}
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
                  "truncate text-base font-bold tracking-normal sm:text-lg ml-2",
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
    </CardWrapper>
  );
}
