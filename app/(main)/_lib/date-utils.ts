const APP_TIME_ZONE = "Asia/Kolkata";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

function getDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: APP_TIME_ZONE,
    year: "numeric",
  }).formatToParts(date);

  const partMap = new Map(parts.map((part) => [part.type, part.value]));

  return {
    day: Number(partMap.get("day")),
    month: Number(partMap.get("month")),
    year: Number(partMap.get("year")),
  };
}

export function getDateKey(date = new Date()) {
  const { day, month, year } = getDateParts(date);

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

export function getMonthKey(date = new Date()) {
  return `${getDateKey(date).slice(0, 7)}-01`;
}

export function getDateFromKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day, 12));
}

export function addDays(dateKey: string, offset: number) {
  const date = getDateFromKey(dateKey);
  date.setUTCDate(date.getUTCDate() + offset);

  return getDateKey(date);
}

export function addMonthsToMonthKey(monthKey: string, offset: number) {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 1, 12));

  return getMonthKey(date);
}

export function getMonthRangeKeys(monthKey = getMonthKey()) {
  return {
    end: addMonthsToMonthKey(monthKey, 1),
    start: monthKey,
  };
}

export function getDaysInMonth(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);

  return new Date(Date.UTC(year, month, 0, 12)).getUTCDate();
}

export function getDayOfMonth(dateKey = getDateKey()) {
  return Number(dateKey.slice(8, 10));
}

export function getDayOfWeek(dateKey: string) {
  return getDateFromKey(dateKey).getUTCDay();
}

export function formatDateKey(
  dateKey: string,
  options: Intl.DateTimeFormatOptions
) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: APP_TIME_ZONE,
    ...options,
  }).format(getDateFromKey(dateKey));
}

export function getDaysBetween(startDateKey: string, endDateKey: string) {
  return Math.ceil(
    (getDateFromKey(endDateKey).getTime() - getDateFromKey(startDateKey).getTime()) /
      DAY_IN_MS
  );
}
