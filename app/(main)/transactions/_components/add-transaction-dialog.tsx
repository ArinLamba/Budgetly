"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import {
  FormEvent,
  ReactNode,
  useMemo,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { createTransaction, updateTransaction } from "../_lib/actions";
import { mapSuggestionIconToTransactionIcon } from "../_lib/appearance";
import { type TransactionSuggestion } from "../_lib/suggestions";
import type { TransactionFormOptions } from "../_lib/data";
import type { TransactionRow } from "../_lib/data";
import type {
  PaymentMethod,
  TransactionActionState,
  TransactionType,
} from "../_lib/types";
import { TransactionTitlePicker } from "./transaction-title-picker";
import { TransactionAppearancePicker } from "./transaction-appearance-picker";
import { renderTransactionIcon } from "../_lib/appearance";

const initialState: TransactionActionState = {
  ok: false,
};

const transactionTypes: { label: string; value: TransactionType }[] = [
  { label: "Expense", value: "expense" },
  { label: "Income", value: "income" },
];

const paymentMethods: { label: string; value: PaymentMethod }[] = [
  { label: "UPI", value: "upi" },
  { label: "Cash", value: "cash" },
  { label: "Card", value: "card" },
  { label: "Bank", value: "bank_transfer" },
  { label: "Wallet", value: "wallet" },
  { label: "Other", value: "other" },
];

type Props = TransactionFormOptions & {
  transaction?: TransactionRow;
  trigger?: ReactNode;
};

export function AddTransactionDialog({
  accounts,
  categories,
  transaction,
  trigger,
}: Props) {
  const router = useRouter();
  const isEditing = Boolean(transaction);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(initialState);
  const [pending, startTransition] = useTransition();

  const today = new Date().toISOString().slice(0, 10);
  const defaultAccountId = accounts[0]?.id ? String(accounts[0].id) : "";
  const initialDescription = transaction?.description ?? "";
  const initialType: TransactionType =
    transaction?.type === "income" || transaction?.type === "expense"
      ? transaction.type
      : "expense";
  const initialAmount = transaction?.amount ? String(transaction.amount) : "";
  const initialDate = transaction?.date ?? today;
  const initialPaymentMethod = transaction?.paymentMethod ?? "upi";
  const initialAccountId = transaction?.accountId
    ? String(transaction.accountId)
    : defaultAccountId;
  const initialAccountName =
    transaction?.account ?? accounts.find((account) => String(account.id) === initialAccountId)?.name ?? "";
  const initialCategoryId = transaction?.categoryId
    ? String(transaction.categoryId)
    : "";
  const initialCategoryName = transaction?.category ?? "";
  const initialIcon = transaction?.icon ?? "Wallet";
  const initialColor = transaction?.color ?? "#6366f1";

  const [description, setDescription] = useState(initialDescription);
  const [type, setType] = useState<TransactionType>(initialType);
  const [amount, setAmount] = useState(initialAmount);
  const [transactionDate, setTransactionDate] = useState(initialDate);
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>(initialPaymentMethod);
  const [accountId, setAccountId] = useState(initialAccountId);
  const [accountName, setAccountName] = useState(initialAccountName);
  const [accountSuggestionsOpen, setAccountSuggestionsOpen] = useState(false);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [categoryName, setCategoryName] = useState(initialCategoryName);
  const [categorySuggestionsOpen, setCategorySuggestionsOpen] = useState(false);
  const [icon, setIcon] = useState(initialIcon);
  const [color, setColor] = useState(initialColor);

  function resetFormState() {
    setDescription(initialDescription);
    setType(initialType);
    setAmount(initialAmount);
    setTransactionDate(initialDate);
    setPaymentMethod(initialPaymentMethod);
    setAccountId(initialAccountId);
    setAccountName(initialAccountName);
    setAccountSuggestionsOpen(false);
    setCategoryId(initialCategoryId);
    setCategoryName(initialCategoryName);
    setCategorySuggestionsOpen(false);
    setIcon(initialIcon);
    setColor(initialColor);
    setState(initialState);
  }

  const categoryIdBySuggestion = useMemo(() => {
    return new Map(
      categories.map((category) => [
        `${category.name}:${category.type}`,
        String(category.id),
      ])
    );
  }, [categories]);

  const visibleAccounts = accountName.trim()
    ? accounts.filter((account) =>
        account.name.toLowerCase().includes(accountName.trim().toLowerCase())
      )
    : accounts;

  const visibleCategories = categories
    .filter((category) => category.type === type)
    .filter((category) =>
      categoryName.trim()
        ? category.name.toLowerCase().includes(categoryName.trim().toLowerCase())
        : true
    );

  function applySuggestion(suggestion: TransactionSuggestion) {
    setDescription(suggestion.description);
    setType(suggestion.type);
    setAmount(String(suggestion.amount));
    setPaymentMethod(suggestion.paymentMethod);
    setIcon(mapSuggestionIconToTransactionIcon(suggestion.icon));
    setColor(suggestion.color);
    setCategoryName(suggestion.categoryName);
    setCategoryId(
      categoryIdBySuggestion.get(`${suggestion.categoryName}:${suggestion.type}`) ??
        ""
    );
    setState(initialState);
  }

  function selectAccount(account: (typeof accounts)[number]) {
    setAccountId(String(account.id));
    setAccountName(account.name);
    setAccountSuggestionsOpen(false);
    setState(initialState);
  }

  function selectCategory(category: (typeof categories)[number]) {
    setCategoryId(String(category.id));
    setCategoryName(category.name);
    setIcon(category.icon ?? icon);
    setColor(category.color);
    setCategorySuggestionsOpen(false);
    setState(initialState);
  }

  function handleCategoryNameChange(value: string) {
    const matchingCategory = categories.find(
      (category) =>
        category.type === type &&
        category.name.toLowerCase() === value.trim().toLowerCase()
    );

    setCategoryName(value);
    setCategorySuggestionsOpen(true);
    setState(initialState);

    if (matchingCategory) {
      setCategoryId(String(matchingCategory.id));
      setIcon(matchingCategory.icon ?? icon);
      setColor(matchingCategory.color);
      return;
    }

    setCategoryId("");
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const action = transaction
        ? updateTransaction.bind(null, transaction.id)
        : createTransaction;
      const result = await action(initialState, formData);
      setState(result);

      if (!result.ok) {
        return;
      }

      form.reset();
      resetFormState();
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          resetFormState();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="main" className="h-9 px-4 shadow-sm">
            <IconPlus className="size-4" />
            <span className="text-xs">Add Transaction</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit transaction" : "Add transaction"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the transaction details."
              : "Pick a suggestion or enter the details manually."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-3">
          <FieldGroup>
            <Field>
              <FieldLabel>Title</FieldLabel>
              <div className="flex items-center rounded-lg border border-input bg-background pr-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                <TransactionAppearancePicker
                  color={color}
                  icon={icon}
                  onColorChange={setColor}
                  onIconChange={setIcon}
                />
                <div className="mr-3 h-6 w-px bg-border" />
                <TransactionTitlePicker
                  value={description}
                  onTitleChange={setDescription}
                  onSuggestionSelect={applySuggestion}
                />
              </div>
              <input name="icon" type="hidden" value={icon} />
              <input name="color" type="hidden" value={color} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel>Type</FieldLabel>
                <input name="type" type="hidden" value={type} />
                <div className="grid grid-cols-2 rounded-lg border bg-slate-50 p-1">
                  {transactionTypes.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`rounded-md px-3 py-2 text-xs font-bold transition-colors ${
                        type === item.value
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-muted-foreground hover:text-slate-900"
                      }`}
                      onClick={() => {
                        const selectedCategory = categories.find(
                          (category) => String(category.id) === categoryId
                        );

                        setType(item.value);

                        if (
                          selectedCategory &&
                          selectedCategory.type !== item.value
                        ) {
                          setCategoryId("");
                          setCategoryName("");
                        }
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="amount">Amount</FieldLabel>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="250"
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="transactionDate">Date</FieldLabel>
                <Input
                  id="transactionDate"
                  name="transactionDate"
                  type="date"
                  value={transactionDate}
                  onChange={(event) => setTransactionDate(event.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel>Payment</FieldLabel>
                <input name="paymentMethod" type="hidden" value={paymentMethod} />
                <div className="grid grid-cols-3 gap-1 rounded-lg border bg-slate-50 p-1">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      className={`rounded-md px-2 py-2 text-xs font-bold transition-colors ${
                        paymentMethod === method.value
                          ? "bg-white text-slate-950 shadow-sm"
                          : "text-muted-foreground hover:text-slate-900"
                      }`}
                      onClick={() => setPaymentMethod(method.value)}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="accountName">Account</FieldLabel>
                <input name="accountId" type="hidden" value={accountId} />
                <input
                  name="newAccountName"
                  type="hidden"
                  value={accountId ? "" : accountName}
                />
                <Popover
                  open={accountSuggestionsOpen}
                  onOpenChange={setAccountSuggestionsOpen}
                >
                  <PopoverAnchor asChild>
                    <div className="flex h-10 items-center rounded-lg border border-input bg-background px-3 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                      <Input
                        id="accountName"
                        value={accountName}
                        onChange={(event) => {
                          setAccountName(event.target.value);
                          setAccountId("");
                          setAccountSuggestionsOpen(true);
                          setState(initialState);
                        }}
                        onClick={() => setAccountSuggestionsOpen(true)}
                        onFocus={() => setAccountSuggestionsOpen(true)}
                        placeholder="Search or create..."
                        required
                        className="h-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                      />
                      <IconSearch className="ml-2 size-4 shrink-0 text-muted-foreground" />
                    </div>
                  </PopoverAnchor>
                  <PopoverContent
                    align="start"
                    className="max-h-64 w-(--radix-popover-trigger-width) overflow-y-auto p-2"
                    sideOffset={6}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                  >
                    {visibleAccounts.length === 0 ? (
                      <div className="rounded-md px-3 py-3 text-xs text-muted-foreground">
                        Press save to create &quot;{accountName || "this account"}&quot;.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {visibleAccounts.map((account) => (
                          <button
                            key={account.id}
                            type="button"
                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => selectAccount(account)}
                          >
                            <span>{account.name}</span>
                            <span className="text-xs font-medium capitalize text-muted-foreground">
                              {account.type.replace("_", " ")}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </Field>

              <Field>
                <FieldLabel htmlFor="categoryName">Category</FieldLabel>
                <input name="categoryId" type="hidden" value={categoryId} />
                <input
                  name="newCategoryName"
                  type="hidden"
                  value={categoryId ? "" : categoryName}
                />
                <Popover
                  open={categorySuggestionsOpen}
                  onOpenChange={setCategorySuggestionsOpen}
                >
                  <PopoverAnchor asChild>
                    <div className="flex h-10 items-center rounded-lg border border-input bg-background px-3 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                      <Input
                        id="categoryName"
                        value={categoryName}
                        onChange={(event) => {
                          handleCategoryNameChange(event.target.value);
                        }}
                        onClick={() => setCategorySuggestionsOpen(true)}
                        onFocus={() => setCategorySuggestionsOpen(true)}
                        placeholder="Search or create..."
                        required
                        className="h-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                      />
                      <IconSearch className="ml-2 size-4 shrink-0 text-muted-foreground" />
                    </div>
                  </PopoverAnchor>
                  <PopoverContent
                    align="start"
                    className="max-h-72 w-(--radix-popover-trigger-width) overflow-y-auto p-2"
                    sideOffset={6}
                    onOpenAutoFocus={(event) => event.preventDefault()}
                  >
                    {visibleCategories.length === 0 ? (
                      <div className="rounded-md px-3 py-3 text-xs text-muted-foreground">
                        Press save to create &quot;{categoryName || "this category"}&quot;.
                      </div>
                    ) : (
                      <div className="max-h-64 overflow-y-auto rounded-md border">
                        <div className="divide-y divide-border">
                        {visibleCategories.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            className="flex w-full items-center gap-3 bg-background px-3 py-2 text-left hover:bg-slate-50"
                            onMouseDown={(event) => event.preventDefault()}
                            onClick={() => selectCategory(category)}
                          >
                            <span
                              className="flex size-8 shrink-0 items-center justify-center rounded-md"
                              style={{
                                backgroundColor: `${category.color}20`,
                                color: category.color,
                              }}
                            >
                              {renderTransactionIcon(
                                category.icon ?? "Wallet",
                                "size-4"
                              )}
                            </span>
                            <span className="text-sm font-semibold text-slate-900">
                              {category.name}
                            </span>
                          </button>
                        ))}
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </Field>
            </div>

            <FieldError>{state.message}</FieldError>
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" variant="main" disabled={pending}>
              {pending && <Spinner />}
              {isEditing ? "Save changes" : "Save transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
