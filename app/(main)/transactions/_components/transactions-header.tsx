"use client";

import { Button } from "@/components/ui/button";
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
import { IconSearch } from "@tabler/icons-react";
import { AddTransactionDialog } from "./add-transaction-dialog";
import type { TransactionFormOptions } from "../_lib/data";
import type {
  TransactionFilters,
  TransactionSort,
  TransactionSummaryPeriod,
  TransactionTab,
} from "../_lib/types";
import { cn } from "@/lib/utils";

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
      <div className="sticky top-0 z-20 -mx-4 lg:-mx-6 flex items-center justify-between gap-3 border-b px-6 py-3  backdrop-blur-2xl ">
        <h1 className="text-xl font-bold text-slate-950">Transactions</h1>
        <div className="flex shrink-0 gap-2">
          <AddTransactionDialog 
            accounts={accounts} 
            categories={categories} 
          />
         
        </div>
      </div>

      <header className="space-y-5">
        <InputGroup className="h-11 max-w-md rounded-lg bg-slate-50">
          <InputGroupAddon>
            <IconSearch className="size-4 text-slate-500" />
          </InputGroupAddon>
          <InputGroupInput
            value={filters.query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search transactions..."
          />
        </InputGroup>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.tab === "all" ? "main" : "outline"}
              className={cn(
                "h-9 px-4 text-xs shadow-sm",
                filters.tab !== "all" && "bg-background text-slate-600"
              )}
              onClick={() => onTabChange("all")}
            >
              All
            </Button>
            <Button
              variant={filters.tab === "income" ? "main" : "outline"}
              className={cn(
                "h-9 px-4 text-xs shadow-sm",
                filters.tab !== "income" && "bg-background text-slate-600"
              )}
              onClick={() => onTabChange("income")}
            >
              Income
            </Button>
            <Button
              variant={filters.tab === "expense" ? "main" : "outline"}
              className={cn(
                "h-9 px-4 text-xs shadow-sm",
                filters.tab !== "expense" && "bg-background text-slate-600"
              )}
              onClick={() => onTabChange("expense")}
            >
              Expense
            </Button>
            
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={filters.period}
              onValueChange={(value) =>
                onPeriodChange(value as TransactionSummaryPeriod)
              }
            >
              <SelectTrigger className="h-9 w-[120px] rounded-md bg-background text-xs font-medium">
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
              <SelectTrigger className="h-9 w-[140px] rounded-md bg-background text-xs font-medium">
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
              <SelectTrigger className="h-9 w-[140px] rounded-md bg-background text-xs font-medium">
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
      </header>
    </>
  );
}
