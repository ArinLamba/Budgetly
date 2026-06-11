import { cn } from "@/lib/utils";
import type { FinanceTransaction } from "../_lib/finance-data";
import { renderTransactionIcon } from "../transactions/_lib/appearance";
import { EmptyState } from "./empty-state";
import { formatDate, money } from "./format";

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
        const signedAmount = item.type === "income" ? item.amount : -item.amount;
        const icon = item.icon ?? item.categoryIcon ?? "Wallet";
        const iconColor = item.color ?? item.categoryColor ?? "#6366f1";

        return (
          <div key={item.id} className="flex items-center gap-3">
            <span
              className="flex size-9 items-center justify-center rounded-md"
              style={{ backgroundColor: `${iconColor}1f`, color: iconColor }}
            >
              {renderTransactionIcon(icon, "size-4")}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-950">
                {item.description}
              </p>
              <p className="text-xs text-muted-foreground">
                {item.category ?? "Uncategorized"}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-bold",
                  signedAmount > 0 ? "text-emerald-600" : "text-slate-950"
                )}
              >
                {signedAmount > 0 ? "+" : "-"}{" "}
                {money.format(Math.abs(signedAmount))}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {formatDate(item.date)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
