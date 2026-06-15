import {
  formatDateKey,
  getDateKey,
  getDaysBetween,
} from "../../_lib/date-utils";

export function getGoalProgress(savedAmount: number, targetAmount: number) {
  if (targetAmount <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((savedAmount / targetAmount) * 100));
}

export function getGoalRemaining(savedAmount: number, targetAmount: number) {
  return Math.max(0, targetAmount - savedAmount);
}

export function getGoalMonthlyNeed({
  remaining,
  targetDate,
  today = new Date(),
}: {
  remaining: number;
  targetDate: string | null;
  today?: Date;
}) {
  if (!targetDate || remaining <= 0) {
    return null;
  }

  const daysRemaining = getDaysBetween(getDateKey(today), targetDate);

  if (daysRemaining <= 0) {
    return remaining;
  }

  const monthsRemaining = Math.max(1, Math.ceil(daysRemaining / 30));

  return Math.ceil(remaining / monthsRemaining);
}

export function getGoalTargetDateLabel(targetDate: string | null) {
  if (!targetDate) {
    return "No target date";
  }

  return formatDateKey(targetDate, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function getGoalPace({
  savedAmount,
  targetAmount,
  targetDate,
  today = new Date(),
}: {
  savedAmount: number;
  targetAmount: number;
  targetDate: string | null;
  today?: Date;
}) {
  if (savedAmount >= targetAmount) {
    return "completed";
  }

  if (!targetDate) {
    return "no-date";
  }

  if (targetDate < getDateKey(today)) {
    return "behind";
  }

  return "on-track";
}
