import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export const CardWrapper = ({ children, className }: Props) => {
  return (
    <div className={cn(
      "rounded-md border border-border/80 bg-card p-3 text-card-foreground shadow-[0_1px_2px_rgb(35_28_20/0.06)] dark:shadow-none",
      className,
    )}>
      {children}
    </div>
  );
};
