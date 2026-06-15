"use server";

import db from "@/db";
import {
  budgetsTable,
  categoriesTable,
  goalContributionsTable,
  goalsTable,
} from "@/db/schema";
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

  const status = savedAmount >= targetAmount ? "completed" : "active";

  const goal = (
    await db
      .insert(goalsTable)
      .values({
        name,
        savedAmount: Math.round(savedAmount),
        status,
        targetAmount: Math.round(targetAmount),
        targetDate,
        userId: user.id,
      })
      .returning()
  )[0];

  if (goal && savedAmount > 0) {
    await db.insert(goalContributionsTable).values({
      amount: Math.round(savedAmount),
      goalId: goal.id,
      note: "Initial saved",
      userId: user.id,
    });
  }

  revalidatePath("/goals");
  revalidatePath("/dashboard");

  return { ok: true };
}

function readGoalStatus(value: string) {
  if (value === "completed" || value === "archived") {
    return value;
  }

  return "active";
}

export async function updateGoal(
  _previousState: FinanceActionState,
  formData: FormData
): Promise<FinanceActionState> {
  const user = await getCurrentDbUser();
  const goalId = Number(readString(formData, "goalId"));
  const name = readString(formData, "name");
  const targetAmount = Number(readString(formData, "targetAmount"));
  const savedAmount = Number(readString(formData, "savedAmount") || "0");
  const targetDate = readString(formData, "targetDate") || null;
  const requestedStatus = readGoalStatus(readString(formData, "status"));

  if (!Number.isInteger(goalId) || goalId <= 0) {
    return { ok: false, message: "Choose a valid goal." };
  }

  if (!name) {
    return { ok: false, message: "Goal name is required." };
  }

  if (!Number.isFinite(targetAmount) || targetAmount <= 0) {
    return { ok: false, message: "Enter a target greater than 0." };
  }

  if (!Number.isFinite(savedAmount) || savedAmount < 0) {
    return { ok: false, message: "Saved amount cannot be negative." };
  }

  const existingGoal = await db.query.goalsTable.findFirst({
    where: and(eq(goalsTable.id, goalId), eq(goalsTable.userId, user.id)),
  });

  if (!existingGoal) {
    return { ok: false, message: "Goal not found." };
  }

  const status =
    savedAmount >= targetAmount && requestedStatus !== "archived"
      ? "completed"
      : requestedStatus;
  const savedDelta = Math.round(savedAmount) - existingGoal.savedAmount;

  await db
    .update(goalsTable)
    .set({
      name,
      savedAmount: Math.round(savedAmount),
      status,
      targetAmount: Math.round(targetAmount),
      targetDate,
      updatedAt: new Date(),
    })
    .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, user.id)));

  if (savedDelta !== 0) {
    await db.insert(goalContributionsTable).values({
      amount: savedDelta,
      goalId,
      note: savedDelta > 0 ? "Saved amount adjusted" : "Saved amount reduced",
      userId: user.id,
    });
  }

  revalidatePath("/goals");
  revalidatePath("/dashboard");

  return { ok: true };
}

export async function contributeToGoal(
  _previousState: FinanceActionState,
  formData: FormData
): Promise<FinanceActionState> {
  const user = await getCurrentDbUser();
  const goalId = Number(readString(formData, "goalId"));
  const amount = Number(readString(formData, "amount"));
  const contributedAtValue = readString(formData, "contributedAt");
  const contributedAt = contributedAtValue
    ? new Date(`${contributedAtValue}T12:00:00`)
    : new Date();

  if (!Number.isInteger(goalId) || goalId <= 0) {
    return { ok: false, message: "Choose a valid goal." };
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return { ok: false, message: "Enter a contribution greater than 0." };
  }

  if (Number.isNaN(contributedAt.getTime())) {
    return { ok: false, message: "Choose a valid contribution date." };
  }

  const goal = await db.query.goalsTable.findFirst({
    where: and(eq(goalsTable.id, goalId), eq(goalsTable.userId, user.id)),
  });

  if (!goal) {
    return { ok: false, message: "Goal not found." };
  }

  const savedAmount = goal.savedAmount + Math.round(amount);
  const status =
    savedAmount >= goal.targetAmount && goal.status !== "archived"
      ? "completed"
      : goal.status;

  await db
    .update(goalsTable)
    .set({
      savedAmount,
      status,
      updatedAt: new Date(),
    })
    .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, user.id)));

  await db.insert(goalContributionsTable).values({
    amount: Math.round(amount),
    contributedAt,
    goalId,
    note: "Contribution",
    userId: user.id,
  });

  revalidatePath("/goals");
  revalidatePath("/dashboard");

  return { ok: true };
}

export async function updateGoalStatus(
  goalId: number,
  status: "active" | "archived" | "completed"
) {
  const user = await getCurrentDbUser();
  const goal = await db.query.goalsTable.findFirst({
    where: and(eq(goalsTable.id, goalId), eq(goalsTable.userId, user.id)),
  });

  if (!goal) {
    return;
  }

  const completionContribution =
    status === "completed" ? Math.max(0, goal.targetAmount - goal.savedAmount) : 0;

  await db
    .update(goalsTable)
    .set({
      savedAmount: status === "completed" ? goal.targetAmount : goal.savedAmount,
      status,
      updatedAt: new Date(),
    })
    .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, user.id)));

  if (completionContribution > 0) {
    await db.insert(goalContributionsTable).values({
      amount: completionContribution,
      goalId,
      note: "Marked complete",
      userId: user.id,
    });
  }

  revalidatePath("/goals");
  revalidatePath("/dashboard");
}

export async function deleteGoal(goalId: number) {
  const user = await getCurrentDbUser();

  await db
    .delete(goalsTable)
    .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, user.id)));

  revalidatePath("/goals");
  revalidatePath("/dashboard");
}
