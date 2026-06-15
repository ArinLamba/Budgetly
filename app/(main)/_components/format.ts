import { formatDateKey } from "../_lib/date-utils";

export const money = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatDate(date: string) {
  return formatDateKey(date, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
