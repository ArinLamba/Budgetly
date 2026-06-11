import {
  House,
  ArrowLeftRight,
  Wallet,
  Goal,
  Calendar,
  ChartNoAxesCombined,
  Settings,
} from "lucide-react";

export const SIDEBAR_ITEMS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: House,
  },
  {
    title: "Transactions",
    href: "/transactions",
    icon: ArrowLeftRight,
  },
  {
    title: "Budgets",
    href: "/budgets",
    icon: Wallet,
  },
  {
    title: "Goals",
    href: "/goals",
    icon: Goal,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: ChartNoAxesCombined,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];