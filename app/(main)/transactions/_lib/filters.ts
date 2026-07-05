import type {
  TransactionFilters,
  TransactionSort,
  TransactionSummaryPeriod,
  TransactionTab,
} from "./types";
import { getMonthKey, normalizeMonthKey } from "../../_lib/date-utils";

export const transactionPageSize = 50;

export const defaultTransactionFilters: TransactionFilters = {
  categoryId: "all",
  month: getMonthKey(),
  page: 1,
  period: "month",
  query: "",
  sort: "date-desc",
  tab: "all",
};

function normalizePeriod(value: string | undefined): TransactionSummaryPeriod {
  return value === "today" ||
    value === "week" ||
    value === "month" ||
    value === "year" ||
    value === "all"
    ? value
    : defaultTransactionFilters.period;
}

function normalizeTab(value: string | undefined): TransactionTab {
  return value === "income" || value === "expense" || value === "all"
    ? value
    : defaultTransactionFilters.tab;
}

function normalizeSort(value: string | undefined): TransactionSort {
  return value === "date-desc" ||
    value === "date-asc" ||
    value === "amount-desc" ||
    value === "amount-asc" ||
    value === "title-asc"
    ? value
    : defaultTransactionFilters.sort;
}

export function normalizeTransactionFilters(
  params: Record<string, string | string[] | undefined>
): TransactionFilters {
  const pageValue = typeof params.page === "string" ? Number(params.page) : 1;

  return {
    categoryId:
      typeof params.categoryId === "string" && params.categoryId
        ? params.categoryId
        : defaultTransactionFilters.categoryId,
    month: normalizeMonthKey(
      typeof params.month === "string" ? params.month : undefined
    ),
    page: Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1,
    period: normalizePeriod(
      typeof params.period === "string" ? params.period : undefined
    ),
    query:
      typeof params.query === "string"
        ? params.query.trim().slice(0, 120)
        : defaultTransactionFilters.query,
    sort: normalizeSort(typeof params.sort === "string" ? params.sort : undefined),
    tab: normalizeTab(typeof params.tab === "string" ? params.tab : undefined),
  };
}
