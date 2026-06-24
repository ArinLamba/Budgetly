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
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { Fragment } from "react";
import type { TransactionFormOptions, TransactionRow } from "../_lib/data";
import { renderTransactionIcon } from "../_lib/appearance";
import { AddTransactionDialog } from "./add-transaction-dialog";
import { DeleteTransactionButton } from "./delete-transaction-button";
import { addDays, formatDateKey, getDateKey } from "../../_lib/date-utils";
import { CardWrapper } from "@/components/card-wrapper";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

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

function formatDate(date: string) {
  return formatDateKey(date, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getGroupLabel(date: string) {
  const today = getDateKey();
  const yesterday = addDays(today, -1);

  if (date === today) {
    return "Today";
  }

  if (date === yesterday) {
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
      <div className="rounded-lg border bg-background p-8 text-center shadow-xs">
        <p className="font-medium text-foreground">No transactions yet</p>
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
          <p className="px-1 pb-1 text-xs font-bold text-indigo-700">
            {group.label}
          </p>
          <div className="divide-y rounded-lg border bg-card shadow-xs">
            {group.transactions.map((transaction) => {
              const signedAmount =
                transaction.type === "income"
                  ? transaction.amount
                  : -transaction.amount;

              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 px-3 py-3 transition-colors active:bg-muted/50"
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
                    <p className="truncate text-sm font-bold text-foreground">
                      {transaction.title}
                    </p>
                    <p className="truncate text-xs font-medium text-muted-foreground">
                      {transaction.description} -{" "}
                      {transaction.category ?? "Uncategorized"} -{" "}
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
                            : "text-foreground"
                        )}
                      >
                        {currency.format(signedAmount)}
                      </p>
                      <p className="text-[11px] font-medium text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <EllipsisVertical size={18} className="h-full w-ful ml-2 g-amber-400"/>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="space-y-1" align="center">
                        <AddTransactionDialog
                          accounts={accounts}
                          categories={categories}
                          transaction={transaction}
                          trigger={
                            <Button variant={"ghost"} className=" flex w-full justify-between items-center">
                              <p >Edit </p>
                              <IconPencil className="size-4 text-muted-foreground" />
                            </Button>
                          }
                        />
                        <DeleteTransactionButton 
                          trigger={
                            <Button variant={"destructive"} className=" flex w-full justify-between items-center">
                              <p >Delete </p>
                              <IconTrash className="size-4" />
                            </Button>
                          }
                          transactionId={transaction.id} 
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>

    <CardWrapper className="hidden overflow-hidden md:block p-0">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[180px] px-4 text-xs font-semibold text-muted-foreground">
              Title
            </TableHead>
            <TableHead className="min-w-[180px] text-xs font-semibold text-muted-foreground">
              Description
            </TableHead>
            <TableHead className="min-w-[150px] text-xs font-semibold text-muted-foreground">
              Category
            </TableHead>
            <TableHead className="w-[120px] text-xs font-semibold text-muted-foreground">
              Type
            </TableHead>
            <TableHead className="w-[140px] text-xs font-semibold text-muted-foreground">
              Amount
            </TableHead>
            <TableHead className="min-w-[150px] text-xs font-semibold text-muted-foreground">
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
                  className="px-4 pb-2 pt-4 text-xs font-bold text-indigo-700 bg-background"
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
                    className="h-14 bg-backgrond hover:bg-muted/50"
                  >
                    <TableCell className="px-4 text-sm font-medium text-foreground">
                      {transaction.title}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
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
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
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
                          : "text-foreground"
                      )}
                    >
                      {currency.format(signedAmount)}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
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
    </CardWrapper>
    </>
  );
}
