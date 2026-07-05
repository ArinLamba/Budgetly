"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  renderTransactionIcon,
  transactionColors,
  transactionIconCategories,
} from "../_lib/appearance";

type Props = {
  color: string;
  icon: string;
  onColorChange: (color: string) => void;
  onIconChange: (icon: string) => void;
};

export function TransactionAppearancePicker({
  color,
  icon,
  onColorChange,
  onIconChange,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-10 w-10 shrink-0 rounded-md p-0 "
          style={{ color }}
        >
          {renderTransactionIcon(icon, "size-5")}
          <span className="sr-only">Pick transaction icon and color</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="max-h-[80dvh] w-80 overflow-hidden p-3"
        onTouchMoveCapture={(event) => event.stopPropagation()}
        onWheelCapture={(event) => event.stopPropagation()}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-muted-foreground">
              Appearance
            </h4>
            <div
              className="size-2 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>

          <div className="grid grid-cols-9 gap-2 px-1">
            {transactionColors.map((item) => (
              <button
                key={item}
                type="button"
                className={cn(
                  "size-5 rounded-full border-2 transition-transform hover:scale-110",
                  color === item
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent"
                )}
                style={{ backgroundColor: item }}
                onClick={() => onColorChange(item)}
              />
            ))}
          </div>

          <Separator />

          <div className="max-h-[40dvh] overflow-y-auto overscroll-contain pr-1">
            {transactionIconCategories.map((category) => (
              <div key={category.label}>
                <div className="sticky top-0 z-10 bg-popover py-1 text-xs font-medium text-muted-foreground">
                  {category.label}
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {category.icons.map((item) => {
                    const selected = icon === item.name;

                    return (
                      <Button
                        key={item.name}
                        type="button"
                        variant="ghost"
                        className={cn(
                          "size-9 p-0  ",
                          selected && "hover:bg-muted"
                        )}
                        style={selected ? { border: color, borderWidth: 1, borderStyle: "solid"} : undefined}
                        onClick={() => onIconChange(item.name)}
                      >
                        {renderTransactionIcon(item.name, "size-5", { color })}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
