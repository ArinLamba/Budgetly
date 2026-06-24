"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { IconSearch } from "@tabler/icons-react";
import { AddTransactionDialog } from "./add-transaction-dialog";
import type { TransactionFormOptions } from "../_lib/data";
import type {
  TransactionFilters,
  TransactionSort,
  TransactionSummaryPeriod,
  TransactionTab,
} from "../_lib/types";
import { CardWrapper } from "@/components/card-wrapper";

type Props = TransactionFormOptions & {
  filters: TransactionFilters;
  onCategoryChange: (categoryId: string) => void;
  onPeriodChange: (period: TransactionSummaryPeriod) => void;
  onQueryChange: (query: string) => void;
  onSortChange: (sort: TransactionSort) => void;
  onTabChange: (tab: TransactionTab) => void;
};

export function TransactionsHeader({
  accounts,
  categories,
  filters,
  onCategoryChange,
  onPeriodChange,
  onQueryChange,
  onSortChange,
  onTabChange,
}: Props) {
  const visibleCategories =
    filters.tab === "all"
      ? categories
      : categories.filter((category) => category.type === filters.tab);

  return (
    <>
      <div className="sticky top-0 z-20  px-3 py-2 bg-background">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-sidebar-foreground">Transactions</h1>
            <p className="hidden text-xs font-medium text-muted-foreground sm:block">
              Track income, expenses, and payment activity.
            </p>
          </div>
          <div className="flex min-w-0 flex-1 justify-end gap-2 sm:flex-none">
            <InputGroup className="h-9 max-w-[180px] rounded-lg bg-muted/40 sm:w-56 sm:max-w-none">
              <InputGroupAddon>
                <IconSearch className="size-4 text-muted-foreground" />
              </InputGroupAddon>
              <InputGroupInput
                value={filters.query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Search..."
                className="text-sm"
              />
            </InputGroup>
            <AddTransactionDialog accounts={accounts} categories={categories} />
          </div>
        </div>
      </div>

      <header className="">
        <CardWrapper>        
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Tabs
              value={filters.tab}
              onValueChange={(value) => onTabChange(value as TransactionTab)}
            >
              <TabsList variant="line">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="income">Income</TabsTrigger>
                <TabsTrigger value="expense">Expense</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center">
              <Select
                value={filters.period}
                onValueChange={(value) =>
                  onPeriodChange(value as TransactionSummaryPeriod)
                }
              >
                <SelectTrigger className="h-9 w-full rounded-md bg-background text-xs font-medium sm:w-[118px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filters.categoryId} onValueChange={onCategoryChange}>
                <SelectTrigger className="h-9 w-full rounded-md bg-background text-xs font-medium sm:w-[150px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {visibleCategories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.sort}
                onValueChange={(value) => onSortChange(value as TransactionSort)}
              >
                <SelectTrigger className="h-9 w-full rounded-md bg-background text-xs font-medium sm:w-[142px]">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest first</SelectItem>
                  <SelectItem value="date-asc">Oldest first</SelectItem>
                  <SelectItem value="amount-desc">Highest amount</SelectItem>
                  <SelectItem value="amount-asc">Lowest amount</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardWrapper>
      </header>
    </>
  );
}
