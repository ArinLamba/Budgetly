import db from "@/db";
import {
  accountsTable,
  budgetsTable,
  categoriesTable,
  goalContributionsTable,
  goalsTable,
  transactionsTable,
} from "@/db/schema";
import { and, asc, desc, eq } from "drizzle-orm";
import {
  ensureTransactionDefaults,
  getCurrentDbUser,
} from "../transactions/_lib/data";
import {
  addDays,
  addMonthsToMonthKey,
  getDayOfMonth,
  getDayOfWeek,
  getDaysInMonth,
  getMonthKey,
  getMonthRangeKeys,
} from "./date-utils";

export type FinanceTransaction = Awaited<
  ReturnType<typeof getFinanceData>
>["transactions"][number];
export type FinanceCategorySummary = ReturnType<typeof getCategorySummaries>[number];
export type FinanceBudgetRow = ReturnType<typeof getBudgetRows>[number];
export type FinanceGoalRow = Awaited<ReturnType<typeof getFinanceData>>["goals"][number];

export function getCurrentMonthKey(date = new Date()) {
  return getMonthKey(date);
}

export function getMonthRange(monthKey = getCurrentMonthKey()) {
  return getMonthRangeKeys(monthKey);
}

export function addMonths(monthKey: string, offset: number) {
  return addMonthsToMonthKey(monthKey, offset);
}

export function isDateInRange(date: string, range: { end: string; start: string }) {
  return date >= range.start && date < range.end;
}

export async function getFinanceData(monthKey = getCurrentMonthKey()) {
  const user = await getCurrentDbUser();
  await ensureTransactionDefaults(user.id);

  const [accounts, categories, transactions, budgets, goals, goalContributions] =
    await Promise.all([
      db.query.accountsTable.findMany({
        where: eq(accountsTable.userId, user.id),
        orderBy: [desc(accountsTable.isDefault), asc(accountsTable.name)],
      }),
      db.query.categoriesTable.findMany({
        where: eq(categoriesTable.userId, user.id),
        orderBy: [asc(categoriesTable.type), asc(categoriesTable.name)],
      }),
      db
        .select({
          amount: transactionsTable.amount,
          category: categoriesTable.name,
          categoryColor: categoriesTable.color,
          categoryIcon: categoriesTable.icon,
          categoryId: transactionsTable.categoryId,
          color: transactionsTable.color,
          date: transactionsTable.transactionDate,
          description: transactionsTable.description,
          icon: transactionsTable.icon,
          id: transactionsTable.id,
          paymentMethod: transactionsTable.paymentMethod,
          title: transactionsTable.title,
          type: transactionsTable.type,
        })
        .from(transactionsTable)
        .leftJoin(
          categoriesTable,
          eq(transactionsTable.categoryId, categoriesTable.id)
        )
        .where(eq(transactionsTable.userId, user.id))
        .orderBy(desc(transactionsTable.transactionDate), desc(transactionsTable.id)),
      db
        .select({
          amount: budgetsTable.limitAmount,
          categoryColor: categoriesTable.color,
          categoryId: budgetsTable.categoryId,
          categoryIcon: categoriesTable.icon,
          categoryName: categoriesTable.name,
          categoryType: categoriesTable.type,
          id: budgetsTable.id,
          month: budgetsTable.month,
        })
        .from(budgetsTable)
        .innerJoin(categoriesTable, eq(budgetsTable.categoryId, categoriesTable.id))
        .where(and(eq(budgetsTable.userId, user.id), eq(budgetsTable.month, monthKey)))
        .orderBy(asc(categoriesTable.name)),
      db.query.goalsTable.findMany({
        where: eq(goalsTable.userId, user.id),
        orderBy: [desc(goalsTable.updatedAt)],
      }),
      db.query.goalContributionsTable.findMany({
        where: eq(goalContributionsTable.userId, user.id),
        orderBy: [desc(goalContributionsTable.contributedAt)],
      }),
    ]);

  const goalsWithContributions = goals.map((goal) => ({
    ...goal,
    contributions: goalContributions.filter(
      (contribution) => contribution.goalId === goal.id
    ),
  }));

  return {
    accounts,
    budgets,
    categories,
    goals: goalsWithContributions,
    monthKey,
    transactions,
    user,
  };
}

export function getMonthTransactions(
  transactions: FinanceTransaction[],
  monthKey = getCurrentMonthKey()
) {
  const range = getMonthRange(monthKey);
  return transactions.filter((transaction) =>
    isDateInRange(transaction.date, range)
  );
}

export function getTotals(transactions: FinanceTransaction[]) {
  return transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === "income") {
        totals.income += transaction.amount;
      }

      if (transaction.type === "expense") {
        totals.expense += transaction.amount;
      }

      return totals;
    },
    { expense: 0, income: 0 }
  );
}

export function getCategorySummaries(
  categories: Awaited<ReturnType<typeof getFinanceData>>["categories"],
  transactions: FinanceTransaction[]
) {
  const expenseCategories = categories.filter(
    (category) => category.type === "expense"
  );
  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0);

  return expenseCategories
    .map((category) => {
      const amount = transactions
        .filter((transaction) => transaction.categoryId === category.id)
        .reduce((total, transaction) => total + transaction.amount, 0);

      return {
        amount,
        color: category.color,
        id: category.id,
        icon: category.icon,
        name: category.name,
        percent: totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0,
      };
    })
    .sort((left, right) => right.amount - left.amount);
}

export function getBudgetRows(
  budgets: Awaited<ReturnType<typeof getFinanceData>>["budgets"],
  transactions: FinanceTransaction[]
) {
  return budgets.map((budget) => {
    const spent = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          transaction.categoryId === budget.categoryId
      )
      .reduce((total, transaction) => total + transaction.amount, 0);
    const remaining = Math.max(0, budget.amount - spent);
    const progress =
      budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;

    return {
      ...budget,
      progress,
      remaining,
      spent,
    };
  });
}

export function getUnbudgetedSpending(
  categories: Awaited<ReturnType<typeof getFinanceData>>["categories"],
  budgets: ReturnType<typeof getBudgetRows>,
  transactions: FinanceTransaction[]
) {
  const budgetedCategoryIds = new Set(
    budgets.map((budget) => budget.categoryId)
  );

  return categories
    .filter(
      (category) =>
        category.type === "expense" && !budgetedCategoryIds.has(category.id)
    )
    .map((category) => {
      const spent = transactions
        .filter(
          (transaction) =>
            transaction.type === "expense" &&
            transaction.categoryId === category.id
        )
        .reduce((total, transaction) => total + transaction.amount, 0);

      return {
        categoryColor: category.color,
        categoryIcon: category.icon,
        categoryId: category.id,
        categoryName: category.name,
        spent,
      };
    })
    .filter((item) => item.spent > 0)
    .sort((left, right) => right.spent - left.spent);
}

export function getCalendarDays(transactions: FinanceTransaction[], date = new Date()) {
  const monthKey = getCurrentMonthKey(date);
  const startOffset = (getDayOfWeek(monthKey) + 6) % 7;
  const gridStart = addDays(monthKey, -startOffset);

  return Array.from({ length: 35 }, (_, index) => {
    const key = addDays(gridStart, index);
    const amount = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" && transaction.date === key
      )
      .reduce((total, transaction) => total + transaction.amount, 0);

    return {
      amount,
      date: key,
      day: getDayOfMonth(key),
      inMonth: key.startsWith(monthKey.slice(0, 7)),
    };
  });
}

export function getTrendPoints(
  transactions: FinanceTransaction[],
  monthKey = getCurrentMonthKey()
) {
  const range = getMonthRange(monthKey);
  const daysInMonth = getDaysInMonth(monthKey);
  const points = Array.from({ length: daysInMonth }, (_, index) => {
    const key = addDays(range.start, index);
    const amount = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" && transaction.date === key
      )
      .reduce((total, transaction) => total + transaction.amount, 0);

    return amount;
  });

  return points;
}
