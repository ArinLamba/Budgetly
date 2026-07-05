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
import { FormEvent, ReactNode, useState, useTransition } from "react";
import {
  createGoal,
  updateGoal,
  type FinanceActionState,
} from "../../_lib/actions";
import { cn } from "@/lib/utils";
import { getGoalVisual, goalVisuals } from "../_lib/goal-visuals";

const initialState: FinanceActionState = { ok: false };

export function AddGoalDialog({
  goal,
  trigger,
}: {
  goal?: FinanceGoalRow;
  trigger?: ReactNode;
}) {
  const router = useRouter();
  const isEditing = Boolean(goal);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [pending, startTransition] = useTransition();
  const initialVisual = getGoalVisual(goal?.icon, goal?.name);
  const [selectedVisual, setSelectedVisual] = useState(initialVisual);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = isEditing
        ? await updateGoal(initialState, formData)
        : await createGoal(initialState, formData);
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
        {trigger ?? (
          <Button variant="main" className="h-9 px-4 text-xs">
            <Plus className="size-4" />
            Add Goal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit goal" : "Add goal"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the target, timeline, or saved amount."
              : "Track a saving target with your current progress."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <input name="icon" type="hidden" value={selectedVisual.icon} />
          <input name="color" type="hidden" value={selectedVisual.color} />
          {goal ? (
            <>
              <input name="goalId" type="hidden" value={goal.id} />
              <input name="status" type="hidden" value={goal.status} />
            </>
          ) : null}
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Goal name</FieldLabel>
              <Input
                defaultValue={goal?.name}
                id="name"
                name="name"
                placeholder="Emergency fund"
                required
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="targetAmount">Target</FieldLabel>
                <Input
                  defaultValue={goal?.targetAmount}
                  id="targetAmount"
                  min="1"
                  name="targetAmount"
                  placeholder="50000"
                  required
                  step="1"
                  type="number"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="savedAmount">Saved</FieldLabel>
                <Input
                  defaultValue={goal?.savedAmount}
                  id="savedAmount"
                  min="0"
                  name="savedAmount"
                  placeholder="0"
                  step="1"
                  type="number"
                />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="targetDate">Target date</FieldLabel>
              <Input
                defaultValue={goal?.targetDate ?? undefined}
                id="targetDate"
                name="targetDate"
                type="date"
              />
            </Field>
            <Field>
              <FieldLabel>Visual</FieldLabel>
              <div className="grid grid-cols-4 gap-2">
                {goalVisuals.map((visual) => {
                  const Icon = visual.Icon;
                  const selected = visual.icon === selectedVisual.icon;

                  return (
                    <button
                      aria-pressed={selected}
                      className={cn(
                        "flex h-14 flex-col items-center justify-center gap-1 rounded-md border text-[10px] font-semibold transition-colors",
                        selected
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100"
                          : "bg-background text-muted-foreground hover:bg-muted/50"
                      )}
                      key={visual.icon}
                      onClick={() => setSelectedVisual(visual)}
                      type="button"
                    >
                      <Icon className="size-4" style={{ color: visual.color }} />
                      <span className="max-w-full truncate px-1">
                        {visual.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>
            <FieldError>{state.message}</FieldError>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" variant="main" disabled={pending}>
              {pending && <Spinner />}
              {isEditing ? "Save changes" : "Save goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
