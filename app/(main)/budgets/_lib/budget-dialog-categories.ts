import type {
  FinanceBudgetRow,
  FinanceTransaction,
} from "../../_lib/finance-data";

type Category = {
  color: string;
  icon: string | null;
  id: number;
  name: string;
  type: "income" | "expense";
};

export function buildBudgetDialogCategories({
  budgets,
  categories,
  currentTransactions,
  previousTransactions,
}: {
  budgets: FinanceBudgetRow[];
  categories: Category[];
  currentTransactions: FinanceTransaction[];
  previousTransactions: FinanceTransaction[];
}) {
  return categories.map((category) => {
    const currentSpent = currentTransactions
      .filter((transaction) => transaction.categoryId === category.id)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const previousSpent = previousTransactions
      .filter((transaction) => transaction.categoryId === category.id)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    const currentBudget = budgets.find(
      (budget) => budget.categoryId === category.id
    );

    return {
      ...category,
      suggestedAmount:
        currentBudget?.amount ??
        (Math.max(currentSpent, previousSpent) > 0
          ? Math.max(currentSpent, previousSpent)
          : null),
    };
  });
}
