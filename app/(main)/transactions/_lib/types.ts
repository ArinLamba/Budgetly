export type TransactionType = "income" | "expense";

export type PaymentMethod =
  | "cash"
  | "upi"
  | "card"
  | "bank_transfer"
  | "wallet"
  | "other";

export type TransactionActionState = {
  ok: boolean;
  message?: string;
};

export type TransactionTab = "all" | TransactionType;

export type TransactionSort =
  | "date-desc"
  | "date-asc"
  | "amount-desc"
  | "amount-asc"
  | "title-asc";

export type TransactionSummaryPeriod =
  | "today"
  | "week"
  | "month"
  | "year"
  | "all";

export type TransactionFilters = {
  categoryId: string;
  period: TransactionSummaryPeriod;
  query: string;
  sort: TransactionSort;
  tab: TransactionTab;
};
