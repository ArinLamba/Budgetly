import {
  SectionCard,
  TransactionMiniList,
  money,
} from "../../_components/finance-ui";
import type { FinanceTransaction } from "../../_lib/finance-data";

export function CalendarActivityCard({
  title,
  total,
  transactions,
}: {
  title: string;
  total: number;
  transactions: FinanceTransaction[];
}) {
  return (
    <SectionCard className="mt-4 max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        <span className="text-xs font-semibold text-foreground">
          Total {money.format(total)}
        </span>
      </div>
      <TransactionMiniList limit={3} transactions={transactions} />
    </SectionCard>
  );
}
