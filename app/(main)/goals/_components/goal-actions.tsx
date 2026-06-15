"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { FinanceGoalRow } from "../../_lib/finance-data";
import { Archive, Check, Pencil, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { updateGoalStatus } from "../../_lib/actions";
import { AddGoalDialog } from "./add-goal-dialog";
import { ContributeGoalDialog } from "./contribute-goal-dialog";
import { DeleteGoalButton } from "./delete-goal-button";

export function GoalActions({ goal }: { goal: FinanceGoalRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(status: "active" | "archived" | "completed") {
    startTransition(async () => {
      await updateGoalStatus(goal.id, status);
      router.refresh();
    });
  }

  return (
    <div className="flex justify-end gap-2" onClick={(event) => event.stopPropagation()}>
      <ContributeGoalDialog goal={goal} />
      <AddGoalDialog
        goal={goal}
        trigger={
          <Button variant="outline" size="icon-sm">
            <Pencil className="size-4" />
            <span className="sr-only">Edit goal</span>
          </Button>
        }
      />
      {goal.status === "archived" ? (
        <Button
          variant="outline"
          size="icon-sm"
          disabled={pending}
          onClick={() => setStatus("active")}
        >
          {pending ? <Spinner /> : <RotateCcw className="size-4" />}
          <span className="sr-only">Restore goal</span>
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={pending || goal.status === "completed"}
            onClick={() => setStatus("completed")}
          >
            {pending ? <Spinner /> : <Check className="size-4" />}
            <span className="sr-only">Mark goal complete</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={pending}
            onClick={() => setStatus("archived")}
          >
            {pending ? <Spinner /> : <Archive className="size-4" />}
            <span className="sr-only">Archive goal</span>
          </Button>
        </>
      )}
      <DeleteGoalButton goalId={goal.id} />
    </div>
  );
}
