import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";
import { IconSearch } from "@tabler/icons-react";

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
  return (
    <InputGroup
      className={cn(
        "h-9 max-w-[180px] rounded-lg bg-muted/40 sm:w-56 sm:max-w-none",
        className
      )}
    >
      <InputGroupAddon>
        <IconSearch className="size-4 text-muted-foreground" />
      </InputGroupAddon>

      <InputGroupInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={loading ? "Searching..." : placeholder}
        className="text-sm"
      />
    </InputGroup>
  );
}