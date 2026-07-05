import {
  BadgeIndianRupee,
  BriefcaseBusiness,
  Car,
  CircleHelp,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  Plane,
  Shield,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type GoalVisual = {
  accent: string;
  background: string;
  border: string;
  color: string;
  icon: string;
  Icon: LucideIcon;
  label: string;
  progress: string;
};

export const goalVisuals: GoalVisual[] = [
  {
    accent: "text-indigo-700",
    background: "bg-violet-50",
    border: "border-violet-100",
    color: "#6366f1",
    icon: "Shield",
    Icon: Shield,
    label: "Emergency",
    progress: "bg-violet-600",
  },
  {
    accent: "text-emerald-700",
    background: "bg-emerald-50",
    border: "border-emerald-100",
    color: "#10b981",
    icon: "Home",
    Icon: Home,
    label: "Home",
    progress: "bg-emerald-500",
  },
  {
    accent: "text-sky-700",
    background: "bg-sky-50",
    border: "border-sky-100",
    color: "#0ea5e9",
    icon: "Plane",
    Icon: Plane,
    label: "Travel",
    progress: "bg-sky-500",
  },
  {
    accent: "text-amber-700",
    background: "bg-amber-50",
    border: "border-amber-100",
    color: "#f59e0b",
    icon: "Car",
    Icon: Car,
    label: "Vehicle",
    progress: "bg-amber-500",
  },
  {
    accent: "text-rose-700",
    background: "bg-rose-50",
    border: "border-rose-100",
    color: "#e11d48",
    icon: "HeartPulse",
    Icon: HeartPulse,
    label: "Health",
    progress: "bg-rose-500",
  },
  {
    accent: "text-cyan-700",
    background: "bg-cyan-50",
    border: "border-cyan-100",
    color: "#06b6d4",
    icon: "Laptop",
    Icon: Laptop,
    label: "Tech",
    progress: "bg-cyan-500",
  },
  {
    accent: "text-fuchsia-700",
    background: "bg-fuchsia-50",
    border: "border-fuchsia-100",
    color: "#c026d3",
    icon: "Smartphone",
    Icon: Smartphone,
    label: "Gadget",
    progress: "bg-fuchsia-500",
  },
  {
    accent: "text-slate-700",
    background: "bg-slate-50",
    border: "border-slate-200",
    color: "#475569",
    icon: "BriefcaseBusiness",
    Icon: BriefcaseBusiness,
    label: "Career",
    progress: "bg-slate-500",
  },
  {
    accent: "text-blue-700",
    background: "bg-blue-50",
    border: "border-blue-100",
    color: "#2563eb",
    icon: "GraduationCap",
    Icon: GraduationCap,
    label: "Education",
    progress: "bg-blue-500",
  },
  {
    accent: "text-teal-700",
    background: "bg-teal-50",
    border: "border-teal-100",
    color: "#0d9488",
    icon: "BadgeIndianRupee",
    Icon: BadgeIndianRupee,
    label: "Money",
    progress: "bg-teal-500",
  },
  {
    accent: "text-purple-700",
    background: "bg-purple-50",
    border: "border-purple-100",
    color: "#9333ea",
    icon: "Sparkles",
    Icon: Sparkles,
    label: "Dream",
    progress: "bg-purple-500",
  },
];

const fallbackVisual: GoalVisual = {
  accent: "text-muted-foreground",
  background: "bg-muted/50",
  border: "border-border",
  color: "#6366f1",
  icon: "CircleHelp",
  Icon: CircleHelp,
  label: "Other",
  progress: "bg-indigo-600",
};

const keywordVisuals: Array<[RegExp, string]> = [
  [/emergency|security|safe|fund/i, "Shield"],
  [/home|house|flat|apartment|rent/i, "Home"],
  [/travel|trip|vacation|flight/i, "Plane"],
  [/car|bike|vehicle|scooter/i, "Car"],
  [/health|medical|doctor|fitness/i, "HeartPulse"],
  [/laptop|computer|tech|pc/i, "Laptop"],
  [/phone|mobile|iphone|android/i, "Smartphone"],
  [/job|career|business|work/i, "BriefcaseBusiness"],
  [/school|college|course|education|study/i, "GraduationCap"],
  [/money|wealth|invest|saving|cash/i, "BadgeIndianRupee"],
  [/dream|wish|special/i, "Sparkles"],
];

export function getGoalVisual(icon?: string | null, name = "") {
  const explicitVisual = goalVisuals.find((visual) => visual.icon === icon);

  if (explicitVisual) {
    return explicitVisual;
  }

  const inferredIcon = keywordVisuals.find(([pattern]) => pattern.test(name))?.[1];

  return (
    goalVisuals.find((visual) => visual.icon === inferredIcon) ?? fallbackVisual
  );
}
