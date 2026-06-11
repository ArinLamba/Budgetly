import Link from "next/link";
import { Eye } from "lucide-react";
import { AddBudgetDialog, EditBudgetTrigger } from "./add-budget-dialog";
import { DeleteBudgetButton } from "./delete-budget-button";

type BudgetDialogCategory = React.ComponentProps<
  typeof AddBudgetDialog
>["categories"][number];

export function BudgetActions({
  amount,
  categories,
  categoryColor,
  categoryIcon,
  categoryId,
  categoryName,
  id,
  month,
}: {
  amount: number;
  categories: BudgetDialogCategory[];
  categoryColor: string;
  categoryIcon: string | null;
  categoryId: number;
  categoryName: string;
  id: number;
  month: string;
}) {
  return (
    <div className="flex justify-end gap-2">
      <Link
        className="inline-flex size-8 items-center justify-center rounded-md border text-slate-600 hover:bg-slate-50"
        href={`/transactions?categoryId=${categoryId}&period=month`}
      >
        <Eye className="size-4" />
        <span className="sr-only">View transactions</span>
      </Link>
      <AddBudgetDialog
        budget={{
          amount,
          categoryColor,
          categoryId,
          categoryIcon,
          categoryName,
        }}
        categories={categories}
        month={month}
        trigger={<EditBudgetTrigger />}
      />
      <DeleteBudgetButton budgetId={id} />
    </div>
  );
}
