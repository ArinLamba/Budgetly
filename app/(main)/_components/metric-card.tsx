import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { SectionCard } from "./layout-parts";

type MetricTone = "blue" | "green" | "red" | "violet";

export function MetricCard({
  icon: Icon,
  label,
  tone = "blue",
  trend,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone?: MetricTone;
  trend: string;
  value: string;
}) {
  const tones: Record<MetricTone, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <SectionCard className="p-3">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-md",
            tones[tone]
          )}
        >
          <Icon className="size-4" />
        </span>
        <p className="text-xs font-semibold text-slate-600">{label}</p>
      </div>
      <p className="mt-3 text-xl font-bold text-slate-950">{value}</p>
      <p
        className={cn(
          "mt-1 flex items-center gap-1 text-xs font-medium",
          trend.startsWith("-") ? "text-rose-600" : "text-emerald-600"
        )}
      >
        {trend.startsWith("-") ? (
          <ArrowDownRight className="size-3" />
        ) : (
          <ArrowUpRight className="size-3" />
        )}
        {trend}
      </p>
    </SectionCard>
  );
}
