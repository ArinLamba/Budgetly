import db from "@/db";
import {
  accountsTable,
  categoriesTable,
  transactionsTable,
  usersTable,
} from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, asc, desc, eq, isNull } from "drizzle-orm";

const defaultCategories = [
  { name: "Food & Dining", type: "expense", color: "#fb923c", icon: "Food" },
  { name: "Groceries", type: "expense", color: "#22c55e", icon: "Grocery" },
  { name: "Transport", type: "expense", color: "#60a5fa", icon: "Bus" },
  { name: "Travel", type: "expense", color: "#06b6d4", icon: "Plane" },
  { name: "Shopping", type: "expense", color: "#8b5cf6", icon: "Shopping" },
  { name: "Entertainment", type: "expense", color: "#a78bfa", icon: "Movie" },
  { name: "Bills & Utilities", type: "expense", color: "#fbbf24", icon: "Receipt" },
  { name: "Home", type: "expense", color: "#14b8a6", icon: "Home" },
  { name: "Rent", type: "expense", color: "#0f766e", icon: "Apartment" },
  { name: "Healthcare", type: "expense", color: "#ef4444", icon: "Health" },
  { name: "Fitness", type: "expense", color: "#22c55e", icon: "Gym" },
  { name: "Education", type: "expense", color: "#0ea5e9", icon: "School" },
  { name: "Personal Care", type: "expense", color: "#ec4899", icon: "Heart" },
  { name: "Subscriptions", type: "expense", color: "#a855f7", icon: "TV" },
  { name: "Pets", type: "expense", color: "#84cc16", icon: "Pet Dog" },
  { name: "Gifts", type: "expense", color: "#f97316", icon: "Gift" },
  { name: "Donations", type: "expense", color: "#ec4899", icon: "Care" },
  { name: "Insurance", type: "expense", color: "#6366f1", icon: "Health" },
  { name: "Investments", type: "expense", color: "#10b981", icon: "Trending Up" },
  { name: "Savings", type: "expense", color: "#22c55e", icon: "Piggy Bank" },
  { name: "Loan & EMI", type: "expense", color: "#64748b", icon: "Invoice" },
  { name: "Work", type: "expense", color: "#475569", icon: "Briefcase" },
  { name: "Taxes", type: "expense", color: "#64748b", icon: "Report Money" },
  { name: "General Expense", type: "expense", color: "#94a3b8", icon: "Wallet" },
  { name: "Income", type: "income", color: "#34d399", icon: "Cash" },
  { name: "Salary", type: "income", color: "#10b981", icon: "Cash" },
  { name: "Freelance", type: "income", color: "#14b8a6", icon: "Briefcase" },
  { name: "Business", type: "income", color: "#6366f1", icon: "Business" },
  { name: "Investments", type: "income", color: "#22c55e", icon: "Trending Up" },
  { name: "Refunds", type: "income", color: "#3b82f6", icon: "Receipt" },
  { name: "Cashback", type: "income", color: "#f59e0b", icon: "Card" },
  { name: "Rental Income", type: "income", color: "#0f766e", icon: "Home" },
] as const;

export type TransactionRow = Awaited<ReturnType<typeof getTransactions>>[number];
export type TransactionFormOptions = Awaited<ReturnType<typeof getTransactionFormOptions>>;

export async function getCurrentDbUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    throw new Error("Unauthorized");
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ?? `${clerkUser.id}@clerk.local`;

  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.clerkId, clerkUser.id),
  });

  if (existingUser) {
    return existingUser;
  }

  const [createdUser] = await db
    .insert(usersTable)
    .values({
      clerkId: clerkUser.id,
      email,
      name: clerkUser.fullName,
      imageUrl: clerkUser.imageUrl,
    })
    .onConflictDoUpdate({
      target: usersTable.clerkId,
      set: {
        email,
        name: clerkUser.fullName,
        imageUrl: clerkUser.imageUrl,
      },
    })
    .returning();

  return createdUser;
}

export async function getTransactions() {
  const user = await getCurrentDbUser();

  return db
    .select({
      id: transactionsTable.id,
      accountId: transactionsTable.accountId,
      categoryId: transactionsTable.categoryId,
      date: transactionsTable.transactionDate,
      description: transactionsTable.description,
      title: transactionsTable.title,
      type: transactionsTable.type,
      amount: transactionsTable.amount,
      color: transactionsTable.color,
      icon: transactionsTable.icon,
      paymentMethod: transactionsTable.paymentMethod,
      category: categoriesTable.name,
      categoryColor: categoriesTable.color,
      account: accountsTable.name,
    })
    .from(transactionsTable)
    .innerJoin(accountsTable, eq(transactionsTable.accountId, accountsTable.id))
    .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
    .where(eq(transactionsTable.userId, user.id))
    .orderBy(desc(transactionsTable.transactionDate), desc(transactionsTable.id));
}

export async function getTransactionFormOptions() {
  const user = await getCurrentDbUser();
  await ensureTransactionDefaults(user.id);

  const [accounts, categories] = await Promise.all([
    db.query.accountsTable.findMany({
      where: eq(accountsTable.userId, user.id),
      orderBy: [desc(accountsTable.isDefault), desc(accountsTable.id)],
    }),
    db.query.categoriesTable.findMany({
      where: eq(categoriesTable.userId, user.id),
      orderBy: [asc(categoriesTable.type), asc(categoriesTable.name)],
    }),
  ]);

  return { accounts, categories };
}

export async function ensureTransactionDefaults(userId: number) {
  const [account] = await db
    .insert(accountsTable)
    .values({
      userId,
      name: "Primary Account",
      type: "bank",
      isDefault: true,
    })
    .onConflictDoNothing({
      target: [accountsTable.userId, accountsTable.name],
    })
    .returning();

  const existingAccount =
    account ??
    (await db.query.accountsTable.findFirst({
      where: eq(accountsTable.userId, userId),
      orderBy: [desc(accountsTable.isDefault), desc(accountsTable.id)],
    }));

  const existingCategories = await db.query.categoriesTable.findMany({
    where: eq(categoriesTable.userId, userId),
  });
  const existingKeys = new Set(
    existingCategories.map((category) => `${category.name}:${category.type}`)
  );

  const missingCategories = defaultCategories.filter(
    (category) => !existingKeys.has(`${category.name}:${category.type}`)
  );

  if (missingCategories.length > 0) {
    await db.insert(categoriesTable).values(
      missingCategories.map((category) => ({
        userId,
        ...category,
        isDefault:
          category.name === "General Expense" || category.name === "Income",
      }))
    );
  }

  await Promise.all(
    defaultCategories.map((category) =>
      db
        .update(categoriesTable)
        .set({ icon: category.icon })
        .where(
          and(
            eq(categoriesTable.userId, userId),
            eq(categoriesTable.name, category.name),
            eq(categoriesTable.type, category.type),
            isNull(categoriesTable.icon)
          )
        )
    )
  );

  return existingAccount;
}
