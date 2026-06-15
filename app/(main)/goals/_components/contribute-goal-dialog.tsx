"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { FinanceGoalRow } from "../../_lib/finance-data";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { contributeToGoal, type FinanceActionState } from "../../_lib/actions";
import { getDateKey } from "../../_lib/date-utils";

const initialState: FinanceActionState = { ok: false };

function getTodayInputValue() {
  return getDateKey();
}

export function ContributeGoalDialog({ goal }: { goal: FinanceGoalRow }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await contributeToGoal(initialState, formData);
      setState(result);

      if (!result.ok) {
        return;
      }

      form.reset();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="main"
          size="icon-sm"
          disabled={goal.status === "archived" || goal.status === "completed"}
        >
          <Plus className="size-4" />
          <span className="sr-only">Contribute to goal</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Contribute</DialogTitle>
          <DialogDescription>Add saved money to {goal.name}.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <input name="goalId" type="hidden" value={goal.id} />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor={`goal-${goal.id}-amount`}>Amount</FieldLabel>
              <Input
                autoFocus
                id={`goal-${goal.id}-amount`}
                min="1"
                name="amount"
                placeholder="1000"
                required
                step="1"
                type="number"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor={`goal-${goal.id}-date`}>Date</FieldLabel>
              <Input
                defaultValue={getTodayInputValue()}
                id={`goal-${goal.id}-date`}
                name="contributedAt"
                required
                type="date"
              />
            </Field>
            <FieldError>{state.message}</FieldError>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" variant="main" disabled={pending}>
              {pending && <Spinner />}
              Add contribution
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
