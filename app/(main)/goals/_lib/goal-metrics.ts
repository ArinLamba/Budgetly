import type { FinanceGoalRow } from "../../_lib/finance-data";
import { getGoalRemaining } from "./goal-progress";

export function getGoalMetrics(goals: FinanceGoalRow[]) {
  return goals.reduce(
    (metrics, goal) => {
      metrics.totalSaved += goal.savedAmount;
      metrics.totalTarget += goal.targetAmount;

      if (goal.status === "active") {
        metrics.activeCount += 1;
      }

      if (goal.status === "completed" || goal.savedAmount >= goal.targetAmount) {
        metrics.completedCount += 1;
      }

      return metrics;
    },
    {
      activeCount: 0,
      completedCount: 0,
      totalSaved: 0,
      totalTarget: 0,
      get totalRemaining() {
        return getGoalRemaining(this.totalSaved, this.totalTarget);
      },
    }
  );
}

export function sortGoalsByUrgency(goals: FinanceGoalRow[]) {
  return [...goals].sort((left, right) => {
    if (left.status !== right.status) {
      if (left.status === "active") return -1;
      if (right.status === "active") return 1;
    }

    if (left.targetDate && right.targetDate) {
      return left.targetDate.localeCompare(right.targetDate);
    }

    if (left.targetDate) return -1;
    if (right.targetDate) return 1;

    return right.updatedAt.getTime() - left.updatedAt.getTime();
  });
}
