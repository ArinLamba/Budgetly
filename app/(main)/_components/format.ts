export const money = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  maximumFractionDigits: 0,
  style: "currency",
});

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}
