"use client";

import { StickyWrapper } from "@/components/sticky-wrapper";
import { useMemo, useState } from "react";
import { PageShell, PageTitle } from "../../_components/finance-ui";
import type { FinanceGoalRow } from "../../_lib/finance-data";
import { AddGoalDialog } from "./add-goal-dialog";
import { GoalHistoryPanel } from "./goal-history";
import { GoalList } from "./goal-list";
import { GoalSummary } from "./goal-summary";

export function GoalsWorkspace({ goals }: { goals: FinanceGoalRow[] }) {
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id);
  const selectedGoal = useMemo(
    () => goals.find((goal) => goal.id === selectedGoalId) ?? goals[0],
    [goals, selectedGoalId]
  );

  return (
    <div className="">
      <PageShell>
        <PageTitle action={<AddGoalDialog />}>Goals</PageTitle>

        <GoalSummary goals={goals} />
        <GoalList
          goals={goals}
          onGoalSelect={setSelectedGoalId}
          selectedGoalId={selectedGoal?.id}
        />
      </PageShell>

      {selectedGoal ? (
        <StickyWrapper>
          <GoalHistoryPanel goal={selectedGoal} />
        </StickyWrapper>
      ) : null}
    </div>
  );
}
