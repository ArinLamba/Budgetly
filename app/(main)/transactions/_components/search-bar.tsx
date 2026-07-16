"use client";

import { useEffect, useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconSearch } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";
import { Separator } from "@/components/ui/separator";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  loading = false,
  className,
}: SearchBarProps) {
  const [search, setSearch] = useState(value);

  const handleSearch = () => {
    onChange(search);
  };

  return (
    <InputGroup
      className={cn(
        "h-9 max-w-[180px] rounded-lg bg-muted/40",
        className
      )}
    >
      <InputGroupInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={loading ? "Searching..." : placeholder}
        className="text-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Separator orientation="vertical" />
      {loading 
      ? <Spinner className="mx-2"/> 
      : <InputGroupButton
        variant="ghost"
        onClick={handleSearch}
        disabled={loading}
        >
          <IconSearch className="size-4" />

        </InputGroupButton>
      }
    </InputGroup>
  );
}