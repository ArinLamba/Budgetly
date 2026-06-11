import { BadgeAlert, CheckCircle2, TriangleAlert } from "lucide-react";

export function getBudgetStatus(progress: number) {
  if (progress > 100) {
    return {
      className: "bg-rose-50 text-rose-700",
      icon: BadgeAlert,
      label: "Over Budget",
      progressClassName: "bg-rose-500",
    };
  }

  if (progress >= 90) {
    return {
      className: "bg-amber-50 text-amber-700",
      icon: TriangleAlert,
      label: "Near Limit",
      progressClassName: "bg-amber-500",
    };
  }

  return {
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
    label: "On Track",
    progressClassName: "bg-emerald-500",
  };
}
