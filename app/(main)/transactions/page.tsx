import { FeedWrapper } from "@/components/feed-wrapper";
import { TransactionsView } from "./_components/transactions-view";
import { getTransactionFormOptions, getTransactions } from "./_lib/data";

export default async function Page({
  searchParams,
}: PageProps<"/transactions">) {
  const params = await searchParams;
  const categoryId =
    typeof params.categoryId === "string" ? params.categoryId : undefined;
  const period =
    params.period === "today" ||
    params.period === "week" ||
    params.period === "month" ||
    params.period === "year" ||
    params.period === "all"
      ? params.period
      : undefined;
  const [
    formOptions,
    transactions
  ] = await Promise.all([
    getTransactionFormOptions(),
    getTransactions(),
  ]) 

  return (
    <FeedWrapper>
      <section className="space-y-2  px-2 pb-4 pt-0">
        <TransactionsView
          {...formOptions}
          initialFilters={{
            ...(categoryId ? { categoryId } : {}),
            ...(period ? { period } : {}),
          }}
          transactions={transactions}
        />
      </section>
    </FeedWrapper>
  );
}
