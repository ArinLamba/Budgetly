import { relations } from "drizzle-orm";
import {
  bigint,
  boolean,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const accountTypeEnum = pgEnum("account_type", [
  "cash",
  "bank",
  "card",
  "wallet",
]);

export const categoryTypeEnum = pgEnum("category_type", ["income", "expense"]);

export const transactionTypeEnum = pgEnum("transaction_type", [
  "income",
  "expense",
  "transfer",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "cash",
  "upi",
  "card",
  "bank_transfer",
  "wallet",
  "other",
]);

export const goalStatusEnum = pgEnum("goal_status", [
  "active",
  "completed",
  "archived",
]);

export const usersTable = pgTable(
  "users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
    name: varchar({ length: 255 }),
    email: varchar({ length: 255 }).notNull().unique(),
    imageUrl: text("image_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
);

export const accountsTable = pgTable(
  "accounts",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    name: varchar({ length: 120 }).notNull(),
    type: accountTypeEnum().notNull().default("bank"),
    currency: varchar({ length: 3 }).notNull().default("INR"),
    balanceSnapshot: bigint("balance_snapshot", { mode: "number" }).notNull().default(0),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("accounts_user_id_idx").on(table.userId),
    uniqueIndex("accounts_user_name_idx").on(table.userId, table.name),
  ],
);

export const categoriesTable = pgTable(
  "categories",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    name: varchar({ length: 120 }).notNull(),
    type: categoryTypeEnum().notNull(),
    color: varchar({ length: 32 }).notNull().default("#7c3aed"),
    icon: varchar({ length: 80 }),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("categories_user_id_idx").on(table.userId),
    index("categories_user_type_idx").on(table.userId, table.type),
    uniqueIndex("categories_user_name_type_idx").on(table.userId, table.name, table.type),
  ],
);

export const transactionsTable = pgTable(
  "transactions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    accountId: integer("account_id")
      .notNull()
      .references(() => accountsTable.id, { onDelete: "cascade" }),
    transferAccountId: integer("transfer_account_id").references(() => accountsTable.id, {
      onDelete: "set null",
    }),
    categoryId: integer("category_id").references(() => categoriesTable.id, {
      onDelete: "set null",
    }),
    type: transactionTypeEnum().notNull(),
    amount: bigint({ mode: "number" }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    icon: varchar({ length: 80 }).notNull().default("Wallet"),
    color: varchar({ length: 32 }).notNull().default("#6366f1"),
    paymentMethod: paymentMethodEnum("payment_method").notNull().default("upi"),
    transactionDate: date("transaction_date", { mode: "string" }).notNull(),
    notes: text(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("transactions_user_date_idx").on(table.userId, table.transactionDate),
    index("transactions_user_category_idx").on(table.userId, table.categoryId),
    index("transactions_user_account_idx").on(table.userId, table.accountId),
    index("transactions_user_type_idx").on(table.userId, table.type),
  ],
);

export const budgetsTable = pgTable(
  "budgets",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categoriesTable.id, { onDelete: "cascade" }),
    month: date({ mode: "string" }).notNull(),
    limitAmount: bigint("limit_amount", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("budgets_user_month_idx").on(table.userId, table.month),
    uniqueIndex("budgets_user_category_month_idx").on(
      table.userId,
      table.categoryId,
      table.month,
    ),
  ],
);

export const goalsTable = pgTable(
  "goals",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    name: varchar({ length: 160 }).notNull(),
    targetAmount: bigint("target_amount", { mode: "number" }).notNull(),
    savedAmount: bigint("saved_amount", { mode: "number" }).notNull().default(0),
    targetDate: date("target_date", { mode: "string" }),
    imageUrl: text("image_url"),
    status: goalStatusEnum().notNull().default("active"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("goals_user_id_idx").on(table.userId),
    index("goals_user_status_idx").on(table.userId, table.status),
  ],
);

export const usersRelations = relations(usersTable, ({ many }) => ({
  accounts: many(accountsTable),
  categories: many(categoriesTable),
  transactions: many(transactionsTable),
  budgets: many(budgetsTable),
  goals: many(goalsTable),
}));

export const accountsRelations = relations(accountsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
  transactions: many(transactionsTable, { relationName: "accountTransactions" }),
  transfers: many(transactionsTable, { relationName: "transferTransactions" }),
}));

export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [categoriesTable.userId],
    references: [usersTable.id],
  }),
  transactions: many(transactionsTable),
  budgets: many(budgetsTable),
}));

export const transactionsRelations = relations(transactionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [transactionsTable.userId],
    references: [usersTable.id],
  }),
  account: one(accountsTable, {
    fields: [transactionsTable.accountId],
    references: [accountsTable.id],
    relationName: "accountTransactions",
  }),
  transferAccount: one(accountsTable, {
    fields: [transactionsTable.transferAccountId],
    references: [accountsTable.id],
    relationName: "transferTransactions",
  }),
  category: one(categoriesTable, {
    fields: [transactionsTable.categoryId],
    references: [categoriesTable.id],
  }),
}));

export const budgetsRelations = relations(budgetsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [budgetsTable.userId],
    references: [usersTable.id],
  }),
  category: one(categoriesTable, {
    fields: [budgetsTable.categoryId],
    references: [categoriesTable.id],
  }),
}));

export const goalsRelations = relations(goalsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [goalsTable.userId],
    references: [usersTable.id],
  }),
}));
