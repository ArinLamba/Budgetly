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
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Pencil, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, ReactNode, useState, useTransition } from "react";
import { createBudget, type FinanceActionState } from "../../_lib/actions";
import { TransactionAppearancePicker } from "../../transactions/_components/transaction-appearance-picker";
import { renderTransactionIcon } from "../../transactions/_lib/appearance";

type CategoryOption = {
  color: string;
  id: number;
  icon: string | null;
  name: string;
  suggestedAmount?: number | null;
  type: "income" | "expense";
};

type Props = {
  budget?: {
    amount: number;
    categoryColor?: string | null;
    categoryId: number;
    categoryIcon?: string | null;
    categoryName: string;
  };
  categories: CategoryOption[];
  existingCategoryIds?: number[];
  month: string;
  trigger?: ReactNode;
};

const initialState: FinanceActionState = { ok: false };

export function AddBudgetDialog({
  budget,
  categories,
  existingCategoryIds = [],
  month,
  trigger,
}: Props) {
  const router = useRouter();
  const isEditing = Boolean(budget);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [pending, startTransition] = useTransition();
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [categoryName, setCategoryName] = useState(budget?.categoryName ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    budget?.categoryId ? String(budget.categoryId) : ""
  );
  const [amount, setAmount] = useState(budget?.amount ? String(budget.amount) : "");
  const [newCategoryIcon, setNewCategoryIcon] = useState("Wallet");
  const [newCategoryColor, setNewCategoryColor] = useState("#6366f1");
  const expenseCategories = categories.filter(
    (category) =>
      category.type === "expense" &&
      (isEditing ||
        !existingCategoryIds.includes(category.id) ||
        category.id === budget?.categoryId)
  );
  const categoryQuery = categoryName.trim().toLowerCase();
  const visibleCategories = categoryQuery
    ? expenseCategories.filter((category) =>
        category.name.toLowerCase().includes(categoryQuery)
      )
    : expenseCategories;

  function applyCategoryAmount(category: CategoryOption) {
    if (!isEditing && category.suggestedAmount && category.suggestedAmount > 0) {
      setAmount(String(Math.round(category.suggestedAmount)));
    }
  }

  function selectCategory(category: CategoryOption) {
    setCategoryName(category.name);
    setSelectedCategoryId(String(category.id));
    setNewCategoryIcon(category.icon ?? "Wallet");
    setNewCategoryColor(category.color);
    applyCategoryAmount(category);
    setSuggestionsOpen(false);
    setState(initialState);
  }

  function handleCategoryNameChange(value: string) {
    const matchingCategory = expenseCategories.find(
      (category) => category.name.toLowerCase() === value.trim().toLowerCase()
    );

    setCategoryName(value);
    setState(initialState);
    setSuggestionsOpen(true);

    if (matchingCategory) {
      setSelectedCategoryId(String(matchingCategory.id));
      setNewCategoryIcon(matchingCategory.icon ?? "Wallet");
      setNewCategoryColor(matchingCategory.color);
      applyCategoryAmount(matchingCategory);
      return;
    }

    setSelectedCategoryId("");
  }

  function resetFormState() {
    setState(initialState);
    setSuggestionsOpen(false);
    setCategoryName(budget?.categoryName ?? "");
    setSelectedCategoryId(budget?.categoryId ? String(budget.categoryId) : "");
    setAmount(budget?.amount ? String(budget.amount) : "");
    setNewCategoryIcon(budget?.categoryIcon ?? "Wallet");
    setNewCategoryColor(budget?.categoryColor ?? "#6366f1");
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (nextOpen) {
      resetFormState();
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createBudget(initialState, formData);
      setState(result);

      if (!result.ok) {
        return;
      }

      form.reset();
      resetFormState();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="main" className="h-9 px-4 text-xs">
            <Plus className="size-4" />
            Add Budget
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit budget" : "Add budget"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Update the limit for ${budget?.categoryName}.`
              : "Set a category limit for the selected month."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <input name="month" type="hidden" value={month} />
          <input name="categoryId" type="hidden" value={selectedCategoryId} />
          <input
            name="newCategoryName"
            type="hidden"
            value={selectedCategoryId ? "" : categoryName}
          />
          <input name="newCategoryIcon" type="hidden" value={newCategoryIcon} />
          <input name="newCategoryColor" type="hidden" value={newCategoryColor} />
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="categoryName">Category</FieldLabel>
              <div className="flex items-center rounded-lg border border-input bg-background pr-2 focus-within:border-indigo-700">
                <TransactionAppearancePicker
                  color={newCategoryColor}
                  icon={newCategoryIcon}
                  onColorChange={setNewCategoryColor}
                  onIconChange={setNewCategoryIcon}
                />
                <div className="mr-3 h-6 w-px bg-border" />
                <Popover open={suggestionsOpen} onOpenChange={setSuggestionsOpen}>
                  <PopoverAnchor asChild>
                    <div className="flex h-10 flex-1 items-center">
                      <Input
                        id="categoryName"
                        value={categoryName}
                        onChange={(event) => {
                          handleCategoryNameChange(event.target.value);
                        }}
                        onClick={() => setSuggestionsOpen(true)}
                        onFocus={() => setSuggestionsOpen(true)}
                        placeholder="Search or create category..."
                        required
                        readOnly={isEditing}
                        className="h-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                      />
                      <Search className="ml-2 size-4 shrink-0 text-muted-foreground" />
                    </div>
                  </PopoverAnchor>
                  <PopoverContent
                    align="start"
                    className="max-h-72 w-(--radix-popover-trigger-width) overflow-hidden p-2"
                    sideOffset={6}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                    onTouchMoveCapture={(event) => event.stopPropagation()}
                    onWheelCapture={(event) => event.stopPropagation()}
                  >
                    {isEditing ? (
                      <div className="rounded-md px-3 py-3 text-xs text-muted-foreground">
                        Change the icon, color, or monthly limit for this category.
                      </div>
                    ) : visibleCategories.length === 0 ? (
                        <div className="rounded-md px-3 py-3 text-xs text-muted-foreground">
                          Press save to create &quot;{categoryName || "this category"}&quot;.
                        </div>
                      ) : (
                        <div className="max-h-64 overflow-y-auto rounded-md border">
                          <div className="divide-y divide-border">
                          {visibleCategories.map((category) => (
                            <button
                              key={category.id}
                              type="button"
                              className="flex w-full items-center gap-3 bg-background px-3 py-2 text-left hover:bg-muted/40"
                              onMouseDown={(event) => event.preventDefault()}
                              onClick={() => selectCategory(category)}
                            >
                              <span
                                className="flex size-8 shrink-0 items-center justify-center rounded-md"
                                style={{
                                  backgroundColor: `${category.color}20`,
                                  color: category.color,
                                }}
                              >
                                {renderTransactionIcon(
                                  category.icon ?? "Wallet",
                                  "size-4"
                                )}
                              </span>
                              <span className="text-sm font-semibold text-foreground">
                                {category.name}
                              </span>
                              {category.suggestedAmount &&
                              category.suggestedAmount > 0 ? (
                                <span className="ml-auto text-xs font-semibold text-muted-foreground">
                                  {Math.round(category.suggestedAmount).toLocaleString("en-IN")}
                                </span>
                              ) : null}
                            </button>
                          ))}
                          </div>
                        </div>
                      )}
                  </PopoverContent>
                </Popover>
              </div>
              {!selectedCategoryId && categoryName ? (
                <p className="text-xs text-muted-foreground">
                  New category will use the selected icon and color.
                </p>
              ) : null}
            </Field>
            <Field>
              <FieldLabel htmlFor="amount">Monthly limit</FieldLabel>
              <Input
                value={amount}
                id="amount"
                min="1"
                name="amount"
                onChange={(event) => setAmount(event.target.value)}
                placeholder="5000"
                required
                step="1"
                type="number"
              />
            </Field>
            <FieldError>{state.message}</FieldError>
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" variant="main" disabled={pending}>
              {pending && <Spinner />}
              {isEditing ? "Save changes" : "Save budget"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditBudgetTrigger() {
  return (
    <Button variant="outline" size="icon-sm">
      <Pencil className="size-4" />
      <span className="sr-only">Edit budget</span>
    </Button>
  );
}
