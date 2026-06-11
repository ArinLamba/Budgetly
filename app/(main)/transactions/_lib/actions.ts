"use server";

import db from "@/db";
import { accountsTable, categoriesTable, transactionsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { ensureTransactionDefaults, getCurrentDbUser } from "./data";
import type { PaymentMethod, TransactionActionState } from "./types";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function readTransactionPayload(formData: FormData) {
  const user = await getCurrentDbUser();
  const defaultAccount = await ensureTransactionDefaults(user.id);

  if (!defaultAccount) {
    return {
      error: "Create an account before adding transactions.",
      user,
    } as const;
  }

  const description = readString(formData, "description");
  const type = readString(formData, "type");
  const amount = Number(readString(formData, "amount"));
  const transactionDate = readString(formData, "transactionDate");
  const paymentMethod = readString(formData, "paymentMethod") || "upi";
  const icon = readString(formData, "icon") || "Wallet";
  const color = readString(formData, "color") || "#6366f1";
  const accountId = Number(readString(formData, "accountId")) || defaultAccount.id;
  const newAccountName = readString(formData, "newAccountName");
  const submittedCategoryId = Number(readString(formData, "categoryId"));
  const newCategoryName = readString(formData, "newCategoryName");

  if (!description) {
    return { error: "Description is required.", user } as const;
  }

  if (type !== "income" && type !== "expense") {
    return { error: "Choose income or expense.", user } as const;
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Enter an amount greater than 0.", user } as const;
  }

  if (!transactionDate) {
    return { error: "Transaction date is required.", user } as const;
  }

  let account = await db.query.accountsTable.findFirst({
    where: and(eq(accountsTable.id, accountId), eq(accountsTable.userId, user.id)),
  });

  if (!account && newAccountName) {
    const [createdAccount] = await db
      .insert(accountsTable)
      .values({
        userId: user.id,
        name: newAccountName,
        type:
          paymentMethod === "cash"
            ? "cash"
            : paymentMethod === "wallet"
              ? "wallet"
              : paymentMethod === "card"
                ? "card"
                : "bank",
      })
      .onConflictDoNothing({
        target: [accountsTable.userId, accountsTable.name],
      })
      .returning();

    account =
      createdAccount ??
      (await db.query.accountsTable.findFirst({
        where: and(
          eq(accountsTable.userId, user.id),
          eq(accountsTable.name, newAccountName)
        ),
      }));
  }

  if (!account) {
    return { error: "Choose or enter an account.", user } as const;
  }

  let submittedCategory = submittedCategoryId
    ? await db.query.categoriesTable.findFirst({
        where: and(
          eq(categoriesTable.id, submittedCategoryId),
          eq(categoriesTable.userId, user.id),
          eq(categoriesTable.type, type)
        ),
      })
    : undefined;

  if (!submittedCategory && newCategoryName) {
    const [createdCategory] = await db
      .insert(categoriesTable)
      .values({
        userId: user.id,
        name: newCategoryName,
        type,
        color,
        icon,
      })
      .onConflictDoNothing({
        target: [
          categoriesTable.userId,
          categoriesTable.name,
          categoriesTable.type,
        ],
      })
      .returning();

    submittedCategory =
      createdCategory ??
      (await db.query.categoriesTable.findFirst({
        where: and(
          eq(categoriesTable.userId, user.id),
          eq(categoriesTable.name, newCategoryName),
          eq(categoriesTable.type, type)
        ),
      }));
  }

  const fallbackCategory = await db.query.categoriesTable.findFirst({
    where: and(eq(categoriesTable.userId, user.id), eq(categoriesTable.type, type)),
  });

  return {
    payload: {
      userId: user.id,
      accountId: account.id,
      categoryId: submittedCategory?.id ?? fallbackCategory?.id,
      type,
      amount: Math.round(amount),
      color,
      description,
      icon,
      paymentMethod: paymentMethod as PaymentMethod,
      transactionDate,
    },
    user,
  } as const;
}

export async function createTransaction(
  _previousState: TransactionActionState,
  formData: FormData
): Promise<TransactionActionState> {
  const result = await readTransactionPayload(formData);

  if ("error" in result) {
    return { ok: false, message: result.error };
  }

  await db.insert(transactionsTable).values({
    ...result.payload,
  });

  revalidatePath("/transactions");

  return { ok: true };
}

export async function updateTransaction(
  transactionId: number,
  _previousState: TransactionActionState,
  formData: FormData
): Promise<TransactionActionState> {
  const result = await readTransactionPayload(formData);

  if ("error" in result) {
    return { ok: false, message: result.error };
  }

  await db
    .update(transactionsTable)
    .set({ ...result.payload, updatedAt: new Date() })
    .where(
      and(
        eq(transactionsTable.id, transactionId),
        eq(transactionsTable.userId, result.user.id)
      )
    );

  revalidatePath("/transactions");

  return { ok: true };
}

export async function deleteTransaction(transactionId: number) {
  const user = await getCurrentDbUser();

  await db
    .delete(transactionsTable)
    .where(
      and(
        eq(transactionsTable.id, transactionId),
        eq(transactionsTable.userId, user.id)
      )
    );

  revalidatePath("/transactions");
}
