import type { FinanceTransaction } from "../../_lib/finance-data";

export function normalizeCategoryPeriod(period: string | undefined) {
  return period === "all" || period === "year" ? period : "month";
}

export function getCategoryPeriodTransactions({
  monthKey,
  period,
  transactions,
  monthTransactions,
}: {
  monthKey: string;
  monthTransactions: FinanceTransaction[];
  period: string;
  transactions: FinanceTransaction[];
}) {
  if (period === "all") {
    return transactions;
  }

  if (period === "year") {
    return transactions.filter((transaction) =>
      transaction.date.startsWith(monthKey.slice(0, 4))
    );
  }

  return monthTransactions;
}
