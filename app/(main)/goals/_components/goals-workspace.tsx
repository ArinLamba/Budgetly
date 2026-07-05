"use client";

import { StickyWrapper } from "@/components/sticky-wrapper";
import { useMemo, useState } from "react";
import { PageShell, PageTitle } from "../../_components/finance-ui";
import type { FinanceGoalRow } from "../../_lib/finance-data";
import { GoalHistoryPanel } from "./goal-history";
import { GoalList } from "./goal-list";
import { GoalSummary } from "./goal-summary";
import dynamic from "next/dynamic";

const AddGoalDialog = dynamic(() =>
  import("./add-goal-dialog").then((module) => module.AddGoalDialog)
);

export function GoalsWorkspace({ goals }: { goals: FinanceGoalRow[] }) {
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0]?.id);
  const selectedGoal = useMemo(
    () => goals.find((goal) => goal.id === selectedGoalId) ?? goals[0],
    [goals, selectedGoalId]
  );

  return (
    <div className="">
      <PageShell>
        <PageTitle
          heading={<h1 className="text-xl font-bold">Goals</h1>}
          action={<AddGoalDialog />}
        />

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
