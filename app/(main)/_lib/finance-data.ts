import db from "@/db";
import {
  accountsTable,
  budgetsTable,
  categoriesTable,
  goalContributionsTable,
  goalsTable,
  transactionsTable,
} from "@/db/schema";
import { and, asc, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";
import { getCurrentDbUser } from "../transactions/_lib/data";
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
  ReturnType<typeof getTransactionsForRange>
>[number];
export type FinanceCategorySummary = ReturnType<typeof getCategorySummaries>[number];
export type FinanceBudgetRow = ReturnType<typeof getBudgetRows>[number];
export type FinanceGoalRow = Awaited<ReturnType<typeof getGoalsData>>["goals"][number];

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

type DateRange = { end: string; start: string };

function transactionRangeWhere(userId: number, range?: DateRange) {
  return range
    ? and(
        eq(transactionsTable.userId, userId),
        gte(transactionsTable.transactionDate, range.start),
        lt(transactionsTable.transactionDate, range.end)
      )
    : eq(transactionsTable.userId, userId);
}

async function getCategories(userId: number) {
  return db.query.categoriesTable.findMany({
    where: eq(categoriesTable.userId, userId),
    orderBy: [asc(categoriesTable.type), asc(categoriesTable.name)],
  });
}

async function getTransactionsForRange(userId: number, range?: DateRange) {
  return db
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
    .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
    .where(transactionRangeWhere(userId, range))
    .orderBy(desc(transactionsTable.transactionDate), desc(transactionsTable.id));
}

async function getRecentTransactions(userId: number, limit = 4) {
  return db
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
    .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
    .where(eq(transactionsTable.userId, userId))
    .orderBy(desc(transactionsTable.transactionDate), desc(transactionsTable.id))
    .limit(limit);
}

async function getBudgetsForMonth(userId: number, monthKey: string) {
  return db
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
    .where(and(eq(budgetsTable.userId, userId), eq(budgetsTable.month, monthKey)))
    .orderBy(asc(categoriesTable.name));
}

async function getTotalsForRange(userId: number, range?: DateRange) {
  const [totals] = await db
    .select({
      expense:
        sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'expense' then ${transactionsTable.amount} else 0 end), 0)`,
      income:
        sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'income' then ${transactionsTable.amount} else 0 end), 0)`,
    })
    .from(transactionsTable)
    .where(transactionRangeWhere(userId, range));

  return {
    expense: Number(totals?.expense ?? 0),
    income: Number(totals?.income ?? 0),
  };
}

async function getCategorySummariesForRange(
  userId: number,
  categories: Awaited<ReturnType<typeof getCategories>>,
  range?: DateRange
) {
  const expenseCategories = categories.filter(
    (category) => category.type === "expense"
  );
  const categoryAmounts = await db
    .select({
      amount: sql<number>`coalesce(sum(${transactionsTable.amount}), 0)`,
      categoryId: transactionsTable.categoryId,
    })
    .from(transactionsTable)
    .where(
      and(transactionRangeWhere(userId, range), eq(transactionsTable.type, "expense"))
    )
    .groupBy(transactionsTable.categoryId);
  const amountByCategory = new Map(
    categoryAmounts.map((item) => [item.categoryId, Number(item.amount)])
  );
  const totalExpense = categoryAmounts.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  return expenseCategories
    .map((category) => {
      const amount = amountByCategory.get(category.id) ?? 0;

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

async function getBalance(userId: number) {
  const [accountSnapshot, totals] = await Promise.all([
    db
      .select({
        balance:
          sql<number>`coalesce(sum(${accountsTable.balanceSnapshot}), 0)`,
      })
      .from(accountsTable)
      .where(eq(accountsTable.userId, userId)),
    getTotalsForRange(userId),
  ]);

  return Number(accountSnapshot[0]?.balance ?? 0) + totals.income - totals.expense;
}

function getCategoryRange(monthKey: string, period: "all" | "month" | "year") {
  if (period === "all") {
    return undefined;
  }

  if (period === "year") {
    const year = monthKey.slice(0, 4);
    return { start: `${year}-01-01`, end: `${Number(year) + 1}-01-01` };
  }

  return getMonthRange(monthKey);
}

export async function getDashboardData({
  categoryPeriod,
  monthKey = getCurrentMonthKey(),
}: {
  categoryPeriod: "all" | "month" | "year";
  monthKey?: string;
}) {
  const user = await getCurrentDbUser();
  const range = getMonthRange(monthKey);
  const [categories, monthTransactions, recentTransactions, budgets, balance] =
    await Promise.all([
      getCategories(user.id),
      getTransactionsForRange(user.id, range),
      getRecentTransactions(user.id),
      getBudgetsForMonth(user.id, monthKey),
      getBalance(user.id),
    ]);
  const [categorySummaries, totals] = await Promise.all([
    getCategorySummariesForRange(
      user.id,
      categories,
      getCategoryRange(monthKey, categoryPeriod)
    ),
    getTotalsForRange(user.id, range),
  ]);

  return {
    balance,
    budgets,
    categories,
    categorySummaries,
    monthKey,
    monthTransactions,
    recentTransactions,
    totals,
    user,
  };
}

export async function getBudgetsData(monthKey = getCurrentMonthKey()) {
  const user = await getCurrentDbUser();
  const currentRange = getMonthRange(monthKey);
  const previousMonthKey = addMonths(monthKey, -1);
  const previousRange = getMonthRange(previousMonthKey);
  const [categories, currentTransactions, previousTransactions, budgets] =
    await Promise.all([
      getCategories(user.id),
      getTransactionsForRange(user.id, currentRange),
      getTransactionsForRange(user.id, previousRange),
      getBudgetsForMonth(user.id, monthKey),
    ]);

  return {
    budgets,
    categories,
    currentTransactions,
    monthKey,
    previousTransactions,
    user,
  };
}

export async function getReportsData(monthKey = getCurrentMonthKey()) {
  const user = await getCurrentDbUser();
  const range = getMonthRange(monthKey);
  const [categories, monthTransactions, totals] = await Promise.all([
    getCategories(user.id),
    getTransactionsForRange(user.id, range),
    getTotalsForRange(user.id, range),
  ]);
  const categorySummaries = await getCategorySummariesForRange(
    user.id,
    categories,
    range
  );

  return {
    categorySummaries,
    monthKey,
    monthTransactions,
    totals,
    user,
  };
}

export async function getCalendarData(monthKey = getCurrentMonthKey()) {
  const user = await getCurrentDbUser();
  const monthTransactions = await getTransactionsForRange(
    user.id,
    getMonthRange(monthKey)
  );

  return {
    monthKey,
    monthTransactions,
    user,
  };
}

export async function getGoalsData() {
  const user = await getCurrentDbUser();
  const goals = await db.query.goalsTable.findMany({
    where: eq(goalsTable.userId, user.id),
    orderBy: [desc(goalsTable.updatedAt)],
  });
  const goalIds = goals.map((goal) => goal.id);
  const goalContributions =
    goalIds.length > 0
      ? await db.query.goalContributionsTable.findMany({
          where: and(
            eq(goalContributionsTable.userId, user.id),
            inArray(goalContributionsTable.goalId, goalIds)
          ),
          orderBy: [desc(goalContributionsTable.contributedAt)],
        })
      : [];
  const contributionsByGoal = new Map<number, typeof goalContributions>();

  for (const contribution of goalContributions) {
    const contributions = contributionsByGoal.get(contribution.goalId) ?? [];
    contributions.push(contribution);
    contributionsByGoal.set(contribution.goalId, contributions);
  }

  return {
    goals: goals.map((goal) => ({
      ...goal,
      contributions: contributionsByGoal.get(goal.id) ?? [],
    })),
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
  categories: Awaited<ReturnType<typeof getCategories>>,
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
  budgets: Awaited<ReturnType<typeof getBudgetsForMonth>>,
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
  categories: Awaited<ReturnType<typeof getCategories>>,
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
