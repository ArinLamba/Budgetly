"use client";

import { useTransition } from "react";
import type { TransactionFilters, TransactionTab } from "../_lib/types";
import type {
  getTransactionPage,
  TransactionFormOptions,
} from "../_lib/data";
import { defaultTransactionFilters } from "../_lib/filters";
import { TransactionsHeader } from "./transactions-header";
import { TransactionsSummary } from "./transactions-summary";
import { TransactionsTable } from "./transactions-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PageShell } from "../../_components/layout-parts";

type Props = TransactionFormOptions & {
  transactionPage: Awaited<ReturnType<typeof getTransactionPage>>;
};

function setParam(params: URLSearchParams, key: string, value: string) {
  const defaultValue =
    defaultTransactionFilters[key as keyof TransactionFilters];

  if (value && value !== String(defaultValue)) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
}

export function TransactionsView({
  accounts,
  categories,
  transactionPage,
}: Props) {
  const filters = transactionPage.filters;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function pushFilters(nextFilters: TransactionFilters) {
    const params = new URLSearchParams(searchParams.toString());

    setParam(params, "tab", nextFilters.tab);
    setParam(params, "period", nextFilters.period);
    setParam(params, "categoryId", nextFilters.categoryId);
    setParam(params, "sort", nextFilters.sort);
    setParam(params, "query", nextFilters.query.trim());
    setParam(params, "page", String(nextFilters.page));

    startTransition(() => {
      router.replace(`${pathname}${params.size ? `?${params}` : ""}`, {
        scroll: false,
      });
    });
  }

  function setTab(tab: TransactionTab) {
    pushFilters({
      ...filters,
      categoryId:
        tab === "all" ||
        filters.categoryId === "all" ||
        categories.some(
          (category) =>
            String(category.id) === filters.categoryId && category.type === tab
        )
          ? filters.categoryId
          : "all",
      page: 1,
      tab,
    });
  }

  const pageStart =
    transactionPage.totalCount === 0
      ? 0
      : (filters.page - 1) * transactionPage.pageSize + 1;
  const pageEnd = Math.min(
    filters.page * transactionPage.pageSize,
    transactionPage.totalCount
  );

  return (
    <PageShell classname="space-y-2">
      <TransactionsHeader
        accounts={accounts}
        categories={categories}
        filters={filters}
        onCategoryChange={(categoryId) =>
          pushFilters({ ...filters, categoryId, page: 1 })
        }
        onQueryChange={(query) => pushFilters({ ...filters, page: 1, query })}
        onPeriodChange={(period) => pushFilters({ ...filters, page: 1, period })}
        onSortChange={(sort) => pushFilters({ ...filters, page: 1, sort })}
        onTabChange={setTab}
        pending={pending}
        query={filters.query}
      />
      <TransactionsSummary
        period={filters.period}
        summary={transactionPage.summary}
      />
      <TransactionsTable
        accounts={accounts}
        categories={categories}
        transactions={transactionPage.transactions}
      />
      <div className="flex flex-col items-center gap-3 py-3 text-xs text-muted-foreground sm:flex-row sm:justify-between">
        <p>
          Showing {pageStart}-{pageEnd} of {transactionPage.totalCount}
        </p>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-disabled={!transactionPage.hasPreviousPage}
                className={
                  transactionPage.hasPreviousPage
                    ? undefined
                    : "pointer-events-none opacity-50"
                }
                href={
                  transactionPage.hasPreviousPage
                    ? `?${new URLSearchParams({
                        ...Object.fromEntries(searchParams.entries()),
                        page: String(filters.page - 1),
                      })}`
                    : "#"
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                aria-disabled={!transactionPage.hasNextPage}
                className={
                  transactionPage.hasNextPage
                    ? undefined
                    : "pointer-events-none opacity-50"
                }
                href={
                  transactionPage.hasNextPage
                    ? `?${new URLSearchParams({
                        ...Object.fromEntries(searchParams.entries()),
                        page: String(filters.page + 1),
                      })}`
                    : "#"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </PageShell>
  );
}
