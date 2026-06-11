"use client";

import { useMemo, useState } from "react";
import type {
  TransactionFilters,
  TransactionSort,
  TransactionSummaryPeriod,
  TransactionTab,
} from "../_lib/types";
import type {
  TransactionFormOptions,
  TransactionRow,
} from "../_lib/data";
import { TransactionsHeader } from "./transactions-header";
import { TransactionsSummary } from "./transactions-summary";
import { TransactionsTable } from "./transactions-table";

type Props = TransactionFormOptions & {
  initialFilters?: Partial<TransactionFilters>;
  transactions: TransactionRow[];
};

const initialFilters: TransactionFilters = {
  categoryId: "all",
  period: "month",
  query: "",
  sort: "date-desc",
  tab: "all",
};

function getDateRange(period: TransactionSummaryPeriod) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (period === "all") {
    return null;
  }

  if (period === "today") {
    return {
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1),
      start: today,
    };
  }

  if (period === "week") {
    const day = today.getDay();
    const daysSinceMonday = day === 0 ? 6 : day - 1;
    const start = new Date(today);
    start.setDate(today.getDate() - daysSinceMonday);

    return {
      end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7),
      start,
    };
  }

  if (period === "year") {
    return {
      end: new Date(today.getFullYear() + 1, 0, 1),
      start: new Date(today.getFullYear(), 0, 1),
    };
  }

  return {
    end: new Date(today.getFullYear(), today.getMonth() + 1, 1),
    start: new Date(today.getFullYear(), today.getMonth(), 1),
  };
}

function isInPeriod(date: string, period: TransactionSummaryPeriod) {
  const range = getDateRange(period);

  if (!range) {
    return true;
  }

  const transactionDate = new Date(`${date}T00:00:00`);
  return transactionDate >= range.start && transactionDate < range.end;
}

function compareBySort(sort: TransactionSort) {
  return (left: TransactionRow, right: TransactionRow) => {
    if (sort === "amount-desc") {
      return right.amount - left.amount;
    }

    if (sort === "amount-asc") {
      return left.amount - right.amount;
    }

    if (sort === "title-asc") {
      return left.description.localeCompare(right.description);
    }

    const dateCompare =
      new Date(left.date).getTime() - new Date(right.date).getTime();

    if (dateCompare !== 0) {
      return sort === "date-asc" ? dateCompare : -dateCompare;
    }

    return sort === "date-asc" ? left.id - right.id : right.id - left.id;
  };
}

export function TransactionsView({
  accounts,
  categories,
  initialFilters: initialFiltersProp,
  transactions,
}: Props) {
  const [filters, setFilters] = useState<TransactionFilters>({
    ...initialFilters,
    ...initialFiltersProp,
  });

  const periodTransactions = useMemo(() => {
    return transactions.filter((transaction) =>
      isInPeriod(transaction.date, filters.period)
    );
  }, [filters.period, transactions]);

  const filteredTransactions = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return periodTransactions
      .filter((transaction) => {
        const matchesTab =
          filters.tab === "all" || transaction.type === filters.tab;
        const matchesCategory =
          filters.categoryId === "all" ||
          String(transaction.categoryId) === filters.categoryId;
        const matchesQuery =
          !query ||
          transaction.description.toLowerCase().includes(query) ||
          transaction.category?.toLowerCase().includes(query) ||
          transaction.account.toLowerCase().includes(query) ||
          transaction.paymentMethod.toLowerCase().includes(query);

        return matchesTab && matchesCategory && matchesQuery;
      })
      .sort(compareBySort(filters.sort));
  }, [filters, periodTransactions]);

  function updateFilters(nextFilters: TransactionFilters) {
    setFilters(nextFilters);
  }

  function setTab(tab: TransactionTab) {
    setFilters((current) => {
      const nextFilters = {
        ...current,
        categoryId:
          tab === "all" ||
          current.categoryId === "all" ||
          categories.some(
            (category) =>
              String(category.id) === current.categoryId &&
              category.type === tab
          )
            ? current.categoryId
            : "all",
        tab,
      };

      return nextFilters;
    });
  }

  return (
    <>
      <TransactionsHeader
        accounts={accounts}
        categories={categories}
        filters={filters}
        onCategoryChange={(categoryId) =>
          updateFilters({ ...filters, categoryId })
        }
        onQueryChange={(query) =>
          updateFilters({ ...filters, query })
        }
        onPeriodChange={(period) => updateFilters({ ...filters, period })}
        onSortChange={(sort) => updateFilters({ ...filters, sort })}
        onTabChange={setTab}
      />
      <TransactionsSummary
        period={filters.period}
        transactions={periodTransactions}
      />
      <TransactionsTable
        accounts={accounts}
        categories={categories}
        transactions={filteredTransactions}
      />
    </>
  );
}
