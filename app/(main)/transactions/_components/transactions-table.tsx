import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { IconPencil } from "@tabler/icons-react";
import { Fragment } from "react";
import type { TransactionFormOptions, TransactionRow } from "../_lib/data";
import { renderTransactionIcon } from "../_lib/appearance";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { DeleteTransactionButton } from "./delete-transaction-button";

type Props = TransactionFormOptions & {
  transactions: TransactionRow[];
};

type TransactionGroup = {
  label: string;
  transactions: TransactionRow[];
};

const paymentMethodLabels: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  bank_transfer: "Bank Transfer",
  wallet: "Wallet",
  other: "Other",
};

const currency = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  style: "currency",
  maximumFractionDigits: 0,
});

const displayDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(date: string) {
  return displayDate.format(new Date(`${date}T00:00:00`));
}

function getGroupLabel(date: string) {
  const today = new Date();
  const transactionDate = new Date(`${date}T00:00:00`);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (transactionDate.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (transactionDate.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return formatDate(date);
}

function groupTransactions(transactions: TransactionRow[]) {
  return transactions.reduce<TransactionGroup[]>((groups, transaction) => {
    const label = getGroupLabel(transaction.date);
    const group = groups.find((item) => item.label === label);

    if (group) {
      group.transactions.push(transaction);
    } else {
      groups.push({ label, transactions: [transaction] });
    }

    return groups;
  }, []);
}

export function TransactionsTable({ accounts, categories, transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-lg border bg-background p-8 text-center">
        <p className="font-medium text-slate-900">No transactions yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Use Add Transaction to record your first income or expense.
        </p>
      </div>
    );
  }

  const groups = groupTransactions(transactions);

  return (
    <>
    <div className="space-y-4 md:hidden">
      {groups.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className="px-1 pb-1 text-xs font-bold text-slate-700">
            {group.label}
          </p>
          <div className="divide-y rounded-lg border bg-background">
            {group.transactions.map((transaction) => {
              const signedAmount =
                transaction.type === "income"
                  ? transaction.amount
                  : -transaction.amount;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 px-3 py-3"
                >
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-md"
                    style={{
                      backgroundColor: `${transaction.color}18`,
                      color: transaction.color,
                    }}
                  >
                    {renderTransactionIcon(transaction.icon, "size-5")}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-950">
                      {transaction.description}
                    </p>
                    <p className="truncate text-xs font-medium text-muted-foreground">
                      {transaction.category ?? "Uncategorized"} ·{" "}
                      {paymentMethodLabels[transaction.paymentMethod]}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          transaction.type === "income"
                            ? "text-emerald-600"
                            : "text-slate-950"
                        )}
                      >
                        {currency.format(signedAmount)}
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>

                    <AddTransactionDialog
                      accounts={accounts}
                      categories={categories}
                      transaction={transaction}
                      trigger={
                        <Button variant="ghost" size="icon-sm">
                          <IconPencil className="size-4" />
                          <span className="sr-only">Edit transaction</span>
                        </Button>
                      }
                    />
                    <DeleteTransactionButton transactionId={transaction.id} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>

    <div className="hidden overflow-hidden rounded-lg border bg-background md:block">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[140px] px-4 text-xs text-slate-500">
              Date
            </TableHead>
            <TableHead className="min-w-[180px] text-xs text-slate-500">
              Description
            </TableHead>
            <TableHead className="min-w-[150px] text-xs text-slate-500">
              Category
            </TableHead>
            <TableHead className="w-[120px] text-xs text-slate-500">
              Type
            </TableHead>
            <TableHead className="w-[140px] text-xs text-slate-500">
              Amount
            </TableHead>
            <TableHead className="min-w-[150px] text-xs text-slate-500">
              Payment Method
            </TableHead>
            <TableHead className="w-[92px] pr-4">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {groups.map((group) => (
            <Fragment key={group.label}>
              <TableRow className="border-b-0 hover:bg-transparent">
                <TableCell
                  colSpan={7}
                  className="px-4 pb-2 pt-4 text-xs font-bold text-slate-700"
                >
                  {group.label}
                </TableCell>
              </TableRow>
              {group.transactions.map((transaction) => {
                const signedAmount =
                  transaction.type === "income"
                    ? transaction.amount
                    : -transaction.amount;

                return (
                  <TableRow
                    key={transaction.id}
                    className="h-14 bg-background hover:bg-slate-50"
                  >
                    <TableCell className="px-4 text-xs font-medium text-slate-700">
                      {formatDate(transaction.date)}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-md"
                          style={{
                            backgroundColor: `${transaction.color}18`,
                            color: transaction.color,
                          }}
                        >
                          {renderTransactionIcon(transaction.icon, "size-4")}
                        </span>
                        <span>{transaction.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="rounded-md"
                        style={{
                          backgroundColor: `${transaction.categoryColor ?? "#e2e8f0"}24`,
                          color: transaction.categoryColor ?? "#334155",
                        }}
                      >
                        {transaction.category ?? "Uncategorized"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "rounded-md capitalize",
                          transaction.type === "income"
                            ? "bg-emerald-50 text-slate-700"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-bold",
                        transaction.type === "income"
                          ? "text-emerald-600"
                          : "text-slate-900"
                      )}
                    >
                      {currency.format(signedAmount)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {paymentMethodLabels[transaction.paymentMethod]}
                    </TableCell>
                    <TableCell className="pr-4">
                      <div className="flex justify-end gap-2 text-muted-foreground">
                        <AddTransactionDialog
                          accounts={accounts}
                          categories={categories}
                          transaction={transaction}
                          trigger={
                            <Button variant="ghost" size="icon-sm">
                              <IconPencil className="size-4" />
                              <span className="sr-only">
                                Edit transaction
                              </span>
                            </Button>
                          }
                        />
                        <DeleteTransactionButton
                          transactionId={transaction.id}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
    </>
  );
}
