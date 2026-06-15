"use client";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import {
  transactionSuggestionGroups,
  type TransactionSuggestion,
} from "../_lib/suggestions";
import { TransactionSuggestionIcon } from "./transaction-suggestion-icon";

type Props = {
  onSuggestionSelect: (suggestion: TransactionSuggestion) => void;
  onTitleChange: (value: string) => void;
  value: string;
};

export function TransactionTitlePicker({
  onSuggestionSelect,
  onTitleChange,
  value,
}: Props) {
  const [open, setOpen] = useState(false);
  const visibleGroups = useMemo(() => {
    const query = value.trim().toLowerCase();

    if (!query) {
      return transactionSuggestionGroups;
    }

    return transactionSuggestionGroups
      .map((group) => ({
        ...group,
        suggestions: group.suggestions.filter((suggestion) => {
          return (
            suggestion.label.toLowerCase().includes(query) ||
            suggestion.categoryName.toLowerCase().includes(query)
          );
        }),
      }))
      .filter((group) => group.suggestions.length > 0);
  }, [value]);

  function selectSuggestion(suggestion: TransactionSuggestion) {
    onSuggestionSelect(suggestion);
    setOpen(false);
  }

  return (
    <>
      <input name="description" type="hidden" value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <div className="flex h-10 flex-1 items-center">
            <Input
              value={value}
              onChange={(event) => {
                onTitleChange(event.target.value);
                setOpen(true);
              }}
              onClick={() => setOpen(true)}
              onFocus={() => setOpen(true)}
              placeholder="Search or enter description..."
              className="h-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
            />
            <IconSearch className="ml-2 size-4 shrink-0 text-muted-foreground" />
          </div>
        </PopoverAnchor>
        <PopoverContent
          align="start"
          className="w-(--radix-popover-trigger-width) max-h-[460px] overflow-hidden p-2"
          sideOffset={6}
          onOpenAutoFocus={(event) => event.preventDefault()}
          onWheelCapture={(event) => event.stopPropagation()}
          onTouchMoveCapture={(event) => event.stopPropagation()}
        >
          <div className="max-h-[440px] overflow-y-auto pr-1">
            {visibleGroups.length === 0 ? (
              <div className="py-4 text-center text-xs text-muted-foreground">
                Press enter to use &quot;{value || "this description"}&quot;.
              </div>
            ) : null}

            {visibleGroups.map((group) => (
              <div className="mb-4 last:mb-0" key={group.label}>
                <p className="mb-2 px-1 text-xs font-semibold text-muted-foreground">
                  {group.label}
                </p>
                <div className="space-y-2">
                  {group.suggestions.map((suggestion) => {
                    const selected = value.trim() === suggestion.description;
                    const color = suggestion.color;

                    return (
                      <button
                        key={suggestion.id}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => selectSuggestion(suggestion)}
                        className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition-colors ${
                          selected
                            ? "border-indigo-500/40 bg-indigo-500/10"
                            : "border-border bg-muted/30 hover:border-indigo-500/30 hover:bg-indigo-500/10"
                        }`}
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background text-indigo-700 shadow-sm">
                          <TransactionSuggestionIcon
                            className="size-5"
                            icon={suggestion.icon}
                            color={color}
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            {suggestion.label}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {suggestion.categoryName} | {"\u20b9"}
                            {suggestion.amount.toLocaleString("en-IN")}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
