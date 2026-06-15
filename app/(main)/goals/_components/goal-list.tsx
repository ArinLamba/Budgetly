"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EmptyState } from "../../_components/empty-state";
import { money } from "../../_components/format";
import type { FinanceGoalRow } from "../../_lib/finance-data";
import {
  getGoalMonthlyNeed,
  getGoalPace,
  getGoalProgress,
  getGoalRemaining,
  getGoalTargetDateLabel,
} from "../_lib/goal-progress";
import { Goal, Laptop, Shield, Smartphone } from "lucide-react";
import { GoalActions } from "./goal-actions";

function getStatusStyle(status: FinanceGoalRow["status"]) {
  if (status === "completed") {
    return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50";
  }

  if (status === "archived") {
    return "bg-muted text-muted-foreground hover:bg-muted";
  }

  return "bg-violet-50 text-indigo-700 hover:bg-violet-50";
}

function getPaceLabel(pace: ReturnType<typeof getGoalPace>) {
  const labels = {
    behind: "Behind",
    completed: "Completed",
    "no-date": "No date",
    "on-track": "On track",
  };

  return labels[pace];
}

const goalVisuals = [
  {
    accent: "text-indigo-700",
    background: "bg-violet-50",
    border: "border-violet-100",
    progress: "bg-violet-600",
  },
  {
    accent: "text-emerald-700",
    background: "bg-emerald-50",
    border: "border-emerald-100",
    progress: "bg-emerald-500",
  },
  {
    accent: "text-sky-700",
    background: "bg-sky-50",
    border: "border-sky-100",
    progress: "bg-sky-500",
  },
  {
    accent: "text-amber-700",
    background: "bg-amber-50",
    border: "border-amber-100",
    progress: "bg-amber-500",
  },
];

export function GoalList({
  goals,
  onGoalSelect,
  selectedGoalId,
}: {
  goals: FinanceGoalRow[];
  onGoalSelect: (goalId: number) => void;
  selectedGoalId?: number;
}) {
  if (goals.length === 0) {
    return (
      <EmptyState>No goals yet. Add a goal to start tracking progress.</EmptyState>
    );
  }

  const goalIcons = [Laptop, Shield, Smartphone, Goal];

  return (
    <div className="mt-4 grid gap-4">
        {goals.map((goal, index) => {
          const Icon = goalIcons[index % goalIcons.length];
          const visual = goalVisuals[index % goalVisuals.length];
          const progress = getGoalProgress(goal.savedAmount, goal.targetAmount);
          const remaining = getGoalRemaining(goal.savedAmount, goal.targetAmount);
          const monthlyNeed = getGoalMonthlyNeed({
            remaining,
            targetDate: goal.targetDate,
          });
          const pace = getGoalPace(goal);
          const selected = selectedGoalId === goal.id;

          return (
            <div
              key={goal.id}
              role="button"
              tabIndex={0}
              onClick={() => onGoalSelect(goal.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onGoalSelect(goal.id);
                }
              }}
              className={cn(
                "overflow-hidden rounded-lg border bg-background text-left shadow-xs outline-none transition-all hover:shadow-sm focus-visible:ring-3 focus-visible:ring-ring/50",
                selected ? "border-indigo-300 shadow-sm ring-1 ring-indigo-100" : visual.border
              )}
            >
              <div className="flex flex-col gap-4 p-4 sm:flex-row">
                <span
                  className={cn(
                    "flex h-32 shrink-0 items-center justify-center rounded-lg border sm:size-24",
                    visual.background,
                    visual.accent,
                    selected ? "border-indigo-200" : visual.border
                  )}
                >
                  <Icon className="size-10" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-bold text-foreground">{goal.name}</h2>
                        <Badge className={getStatusStyle(goal.status)}>
                          {goal.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {money.format(goal.savedAmount)} /{" "}
                        {money.format(goal.targetAmount)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="text-left sm:text-right">
                        <span className="text-sm font-semibold text-foreground">
                          {progress}%
                        </span>
                        <p className="text-xs font-semibold text-muted-foreground">
                          {getPaceLabel(pace)}
                        </p>
                      </div>
                      <GoalActions goal={goal} />
                    </div>
                  </div>
                  <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        goal.status === "archived" ? "bg-muted-foreground" : visual.progress
                      )}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="mt-4 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                    <div className="min-w-0 rounded-md bg-muted/40 px-3 py-2">
                      <p className="font-semibold text-muted-foreground">Remaining</p>
                      <p className="mt-1 truncate font-bold text-foreground">
                        {money.format(remaining)}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-md bg-muted/40 px-3 py-2">
                      <p className="font-semibold text-muted-foreground">Target date</p>
                      <p className="mt-1 truncate font-bold text-foreground">
                        {getGoalTargetDateLabel(goal.targetDate)}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-md bg-muted/40 px-3 py-2">
                      <p className="font-semibold text-muted-foreground">Monthly need</p>
                      <p className="mt-1 truncate font-bold text-foreground">
                        {monthlyNeed === null ? "Set a date" : money.format(monthlyNeed)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
