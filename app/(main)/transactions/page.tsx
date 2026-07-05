import { FeedWrapper } from "@/components/feed-wrapper";
import { TransactionsView } from "./_components/transactions-view";
import {
  getTransactionFormOptions,
  getTransactionPage,
} from "./_lib/data";
import { normalizeTransactionFilters } from "./_lib/filters";

export default async function Page({
  searchParams,
}: PageProps<"/transactions">) {
  const params = await searchParams;
  const filters = normalizeTransactionFilters(params);
  const [formOptions, transactionPage] = await Promise.all([
    getTransactionFormOptions(),
    getTransactionPage(filters),
  ]);

  return (
    <FeedWrapper>
      <TransactionsView
        {...formOptions}
        transactionPage={transactionPage}
      />
    </FeedWrapper>
  );
}
