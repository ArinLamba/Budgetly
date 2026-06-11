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
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { createGoal, type FinanceActionState } from "../../_lib/actions";

const initialState: FinanceActionState = { ok: false };

export function AddGoalDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createGoal(initialState, formData);
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
        <Button variant="main" className="h-9 px-4 text-xs">
          <Plus className="size-4" />
          Add Goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add goal</DialogTitle>
          <DialogDescription>
            Track a saving target with your current progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Goal name</FieldLabel>
              <Input id="name" name="name" placeholder="Emergency fund" required />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="targetAmount">Target</FieldLabel>
                <Input
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
              <Input id="targetDate" name="targetDate" type="date" />
            </Field>
            <FieldError>{state.message}</FieldError>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" variant="main" disabled={pending}>
              {pending && <Spinner />}
              Save goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
