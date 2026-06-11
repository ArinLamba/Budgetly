import type { FinanceTransaction } from "../../_lib/finance-data";

export function getCalendarSummary(transactions: FinanceTransaction[]) {
  const total = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return { total };
}
