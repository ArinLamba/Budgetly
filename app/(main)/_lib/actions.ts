"use server";

import db from "@/db";
import { budgetsTable, categoriesTable, goalsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentDbUser } from "../transactions/_lib/data";
import { getCurrentMonthKey } from "./finance-data";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export type FinanceActionState = {
  ok: boolean;
  message?: string;
};

export async function createBudget(
  _previousState: FinanceActionState,
  formData: FormData
): Promise<FinanceActionState> {
  const user = await getCurrentDbUser();
  const categoryId = Number(readString(formData, "categoryId"));
  const newCategoryName = readString(formData, "newCategoryName");
  const newCategoryIcon = readString(formData, "newCategoryIcon") || "Wallet";
  const newCategoryColor = readString(formData, "newCategoryColor") || "#6366f1";
  const amount = Number(readString(formData, "amount"));
  const month = readString(formData, "month") || getCurrentMonthKey();

  if (!categoryId && !newCategoryName) {
    return { ok: false, message: "Choose a category." };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Enter a budget greater than 0." };
  }

  const category = categoryId
    ? await db.query.categoriesTable.findFirst({
        where: and(
          eq(categoriesTable.id, categoryId),
          eq(categoriesTable.userId, user.id),
          eq(categoriesTable.type, "expense")
        ),
      })
    : (
        await db
          .insert(categoriesTable)
          .values({
            color: newCategoryColor,
            icon: newCategoryIcon,
            name: newCategoryName,
            type: "expense",
            userId: user.id,
          })
          .onConflictDoUpdate({
            target: [
              categoriesTable.userId,
              categoriesTable.name,
              categoriesTable.type,
            ],
            set: {
              color: newCategoryColor,
              icon: newCategoryIcon,
            },
          })
          .returning()
      )[0];

  if (!category) {
    return { ok: false, message: "Choose one of your expense categories." };
  }

  if (categoryId) {
    await db
      .update(categoriesTable)
      .set({
        color: newCategoryColor,
        icon: newCategoryIcon,
      })
      .where(
        and(
          eq(categoriesTable.id, category.id),
          eq(categoriesTable.userId, user.id)
        )
      );
  }

  await db
    .insert(budgetsTable)
    .values({
      categoryId: category.id,
      limitAmount: Math.round(amount),
      month,
      userId: user.id,
    })
    .onConflictDoUpdate({
      target: [budgetsTable.userId, budgetsTable.categoryId, budgetsTable.month],
      set: {
        limitAmount: Math.round(amount),
        updatedAt: new Date(),
      },
    });

  revalidatePath("/budgets");
  revalidatePath("/dashboard");

  return { ok: true };
}

export async function deleteBudget(budgetId: number) {
  const user = await getCurrentDbUser();

  await db
    .delete(budgetsTable)
    .where(and(eq(budgetsTable.id, budgetId), eq(budgetsTable.userId, user.id)));

  revalidatePath("/budgets");
  revalidatePath("/dashboard");
}

export async function createGoal(
  _previousState: FinanceActionState,
  formData: FormData
): Promise<FinanceActionState> {
  const user = await getCurrentDbUser();
  const name = readString(formData, "name");
  const targetAmount = Number(readString(formData, "targetAmount"));
  const savedAmount = Number(readString(formData, "savedAmount") || "0");
  const targetDate = readString(formData, "targetDate") || null;

  if (!name) {
    return { ok: false, message: "Goal name is required." };
  }

  if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
    return { ok: false, message: "Enter a target greater than 0." };
  }

  if (!Number.isFinite(savedAmount) || savedAmount < 0) {
    return { ok: false, message: "Saved amount cannot be negative." };
  }

  await db.insert(goalsTable).values({
    name,
    savedAmount: Math.round(savedAmount),
    targetAmount: Math.round(targetAmount),
    targetDate,
    userId: user.id,
  });

  revalidatePath("/goals");
  revalidatePath("/dashboard");

  return { ok: true };
}
