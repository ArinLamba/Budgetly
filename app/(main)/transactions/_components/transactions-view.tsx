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
import {
  addDays,
  addMonthsToMonthKey,
  getDateKey,
  getDayOfWeek,
  getMonthKey,
} from "../../_lib/date-utils";

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
  const today = getDateKey();

  if (period === "all") {
    return null;
  }

  if (period === "today") {
    return {
      end: addDays(today, 1),
      start: today,
    };
  }

  if (period === "week") {
    const day = getDayOfWeek(today);
    const daysSinceMonday = day === 0 ? 6 : day - 1;
    const start = addDays(today, -daysSinceMonday);

    return {
      end: addDays(start, 7),
      start,
    };
  }

  if (period === "year") {
    const year = today.slice(0, 4);

    return {
      end: `${Number(year) + 1}-01-01`,
      start: `${year}-01-01`,
    };
  }

  const monthKey = getMonthKey();

  return {
    end: addMonthsToMonthKey(monthKey, 1),
    start: monthKey,
  };
}

function isInPeriod(date: string, period: TransactionSummaryPeriod) {
  const range = getDateRange(period);

  if (!range) {
    return true;
  }

  return date >= range.start && date < range.end;
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
      return left.title.localeCompare(right.title);
    }

    const dateCompare = left.date.localeCompare(right.date);

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
          transaction.title.toLowerCase().includes(query) ||
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
