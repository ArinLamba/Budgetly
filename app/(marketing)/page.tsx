"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CreditCard,
  Goal,
  Home as HomeIcon,
  Loader,
  PieChart,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Target,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stats = [
  {
    icon: Wallet,
    label: "Total Balance",
    value: "Rs 24,500",
    hint: "12% vs last month",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: CreditCard,
    label: "Income",
    value: "Rs 35,000",
    hint: "8% vs last month",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: ReceiptText,
    label: "Expenses",
    value: "Rs 10,500",
    hint: "5% vs last month",
    color: "bg-rose-100 text-rose-600",
  },
  {
    icon: Target,
    label: "Budget Remaining",
    value: "Rs 6,600",
    hint: "41% of total budget",
    color: "bg-violet-100 text-violet-600",
  },
];

const transactions = [
  { name: "Swiggy", category: "Food & Dining", amount: "- Rs 250", color: "bg-orange-100 text-orange-600" },
  { name: "Petrol", category: "Transport", amount: "- Rs 1,000", color: "bg-blue-100 text-blue-600" },
  { name: "Coffee", category: "Food & Dining", amount: "- Rs 120", color: "bg-amber-100 text-amber-600" },
  { name: "Salary", category: "Income", amount: "+ Rs 35,000", color: "bg-emerald-100 text-emerald-600" },
];

const categories = [
  { name: "Food & Dining", value: "Rs 3,200", width: "72%", color: "bg-orange-500" },
  { name: "Transport", value: "Rs 2,100", width: "52%", color: "bg-blue-500" },
  { name: "Shopping", value: "Rs 1,800", width: "43%", color: "bg-emerald-500" },
  { name: "Entertainment", value: "Rs 1,400", width: "34%", color: "bg-violet-500" },
];

const calendarDays = [
  26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22,
];

const features = [
  {
    icon: ReceiptText,
    title: "Transactions without friction",
    text: "Capture income and expenses quickly, then keep every rupee grouped by category and payment method.",
  },
  {
    icon: PieChart,
    title: "Budgets that stay visible",
    text: "See what is budgeted, spent, and remaining before small purchases become month-end surprises.",
  },
  {
    icon: Goal,
    title: "Goals beside daily money",
    text: "Track savings targets, emergency funds, trips, and big purchases alongside your monthly cash flow.",
  },
];

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <Loader className="h-5 w-5 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-slate-50 text-slate-950">
      <section className="px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-3 py-1 text-xs font-bold text-violet-700 shadow-sm">
              <Sparkles className="size-3.5" />
              Built for budgets, bills, and better money habits
            </div>

            <h1 className="max-w-xl text-5xl font-black tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              Budgetly
            </h1>
            <p className="mt-5 max-w-xl text-lg font-semibold leading-8 text-slate-600">
              A personal finance dashboard for tracking transactions, planning
              monthly budgets, and seeing exactly where your money is going.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {isSignedIn ? (
                <Button asChild className="h-12 bg-violet-600 px-6 text-white hover:bg-violet-500">
                  <Link href="/dashboard">
                    Open Budgetly <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <SignUpButton mode="modal">
                    <Button className="h-12 bg-violet-600 px-6 text-white hover:bg-violet-500">
                      Start budgeting <ArrowRight className="size-4" />
                    </Button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <Button
                      className="h-12 border-slate-200 bg-white px-6 text-slate-900 hover:bg-slate-100"
                      variant="outline"
                    >
                      I already have an account
                    </Button>
                  </SignInButton>
                </>
              )}
            </div>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              <Metric label="Saved this month" value="Rs 24.5k" />
              <Metric label="Budget left" value="41%" />
              <Metric label="Goals active" value="4" />
            </div>
          </div>

          <DashboardPreview />
        </div>
      </section>

      <section id="features" className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-3 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
              key={feature.title}
            >
              <feature.icon className="mb-4 size-5 text-violet-600" />
              <h2 className="text-base font-extrabold text-slate-950">{feature.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-lg border border-violet-100 bg-violet-50 p-5 sm:p-6">
            <h2 className="text-lg font-black tracking-normal text-slate-950">How Budgetly works</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-4">
              <Step icon={Plus} title="Add transactions" text="Record income and expenses." />
              <Step icon={PieChart} title="Set budgets" text="Assign money to categories." />
              <Step icon={BarChart3} title="Track spending" text="Watch budgets update live." />
              <Step icon={Goal} title="Achieve goals" text="Save with a clear target." />
            </div>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 sm:p-6">
            <ShieldCheck className="size-6 text-amber-600" />
            <h2 className="mt-4 text-lg font-black tracking-normal text-slate-950">
              Give every rupee a purpose
            </h2>
            <p className="mt-3 text-sm leading-6 text-amber-900">
              Keep the dashboard close to the decisions you make every day:
              bills, groceries, travel, subscriptions, savings, and the next goal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{label}</p>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-200">
        <div className="grid min-h-[620px] grid-cols-[150px_1fr]">
          <Sidebar />
          <div className="min-w-0 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-2xl font-black tracking-normal text-slate-950">
                  Good morning, Honey
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Here is your financial overview
                </p>
              </div>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 text-sm font-bold text-white">
                <Plus className="size-4" />
                Add Transaction
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-black text-slate-950">Expenses Overview</h3>
                  <span className="rounded-md border border-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
                    This Month
                  </span>
                </div>
                <div className="mt-6 grid items-center gap-5 sm:grid-cols-[170px_1fr]">
                  <div className="relative mx-auto size-40 rounded-full bg-[conic-gradient(#fb6a2a_0_32%,#3b82f6_32%_52%,#34d399_52%_69%,#8b5cf6_69%_82%,#fbbf24_82%_92%,#94a3b8_92%_100%)]">
                    <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-lg font-black">Rs 10,500</span>
                      <span className="text-xs font-semibold text-slate-500">Total</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <CategoryRow key={category.name} {...category} />
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-950">Recent Transactions</h3>
                  <span className="text-xs font-bold text-violet-600">View all</span>
                </div>
                <div className="mt-4 divide-y divide-slate-100">
                  {transactions.map((transaction) => (
                    <TransactionRow key={transaction.name} {...transaction} />
                  ))}
                </div>
              </section>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.82fr]">
              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-black text-slate-950">
                  Spending Calendar <span className="font-semibold text-slate-500">(June 2025)</span>
                </h3>
                <div className="mt-5 grid grid-cols-7 gap-2 text-center text-xs font-bold">
                  {calendarDays.map((day, index) => (
                    <div
                      key={`${day}-${index}`}
                      className={[
                        "rounded-md px-2 py-2 text-slate-700",
                        index % 7 === 0 ? "bg-emerald-100" : "",
                        index % 7 === 2 ? "bg-lime-100" : "",
                        index % 7 === 4 ? "bg-amber-100" : "",
                        index % 7 === 5 ? "bg-orange-100" : "",
                        index === 17 ? "bg-rose-200 text-rose-700" : "",
                        index > 21 ? "bg-slate-100" : "",
                      ].join(" ")}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-black text-slate-950">Top Categories</h3>
                <div className="mt-5 space-y-4">
                  {categories.map((category) => (
                    <div key={category.name}>
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>{category.name}</span>
                        <span>{category.value}</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${category.color}`} style={{ width: category.width }} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:hidden">
        <PhonePreview title="Transactions" />
        <PhonePreview title="Budgets" />
      </div>
    </div>
  );
}

function Sidebar() {
  const items = [
    { icon: HomeIcon, label: "Dashboard", active: true },
    { icon: ReceiptText, label: "Transactions" },
    { icon: PieChart, label: "Budgets" },
    { icon: Goal, label: "Goals" },
    { icon: CalendarDays, label: "Calendar" },
    { icon: BarChart3, label: "Reports" },
  ];

  return (
    <aside className="hidden bg-slate-950 p-4 text-white sm:block">
      <div className="flex items-center gap-2">
        <Image alt="Budgetly logo" className="rounded-md" height={30} src="/logo.svg" width={30} />
        <span className="text-sm font-black">Budgetly</span>
      </div>
      <nav className="mt-8 space-y-2">
        {items.map((item) => (
          <div
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-3 text-xs font-bold",
              item.active ? "bg-violet-600 text-white" : "text-slate-300",
            ].join(" ")}
            key={item.label}
          >
            <item.icon className="size-4" />
            {item.label}
          </div>
        ))}
      </nav>
      <div className="mt-12 rounded-lg bg-white/10 p-4">
        <p className="text-sm font-black">June 2025</p>
        <p className="mt-4 text-xs leading-5 text-slate-300">
          A budget is telling your money where to go instead of wondering where it went.
        </p>
      </div>
    </aside>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  color,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  hint: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className={`flex size-9 items-center justify-center rounded-md ${color}`}>
          <Icon className="size-4" />
        </span>
        <p className="text-xs font-black text-slate-700">{label}</p>
      </div>
      <p className="mt-4 text-2xl font-black tracking-normal text-slate-950">{value}</p>
      <p className="mt-2 text-xs font-semibold text-emerald-600">{hint}</p>
    </div>
  );
}

function CategoryRow({
  name,
  value,
  color,
}: {
  name: string;
  value: string;
  width: string;
  color: string;
}) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 text-xs font-bold">
      <div className="flex items-center gap-2">
        <span className={`size-2.5 rounded-full ${color}`} />
        <span className="text-slate-700">{name}</span>
      </div>
      <span className="text-slate-950">{value}</span>
    </div>
  );
}

function TransactionRow({
  name,
  category,
  amount,
  color,
}: {
  name: string;
  category: string;
  amount: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className={`flex size-10 items-center justify-center rounded-md ${color}`}>
        <ReceiptText className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-black text-slate-950">{name}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">{category}</p>
      </div>
      <p className={["text-sm font-black", amount.startsWith("+") ? "text-emerald-600" : "text-slate-950"].join(" ")}>
        {amount}
      </p>
    </div>
  );
}

function PhonePreview({ title }: { title: string }) {
  return (
    <div className="rounded-md border-[6px] border-slate-950 bg-white p-4 shadow-xl">
      <div className="flex items-center justify-between">
        <p className="text-lg font-black">{title}</p>
        <span className="text-xs font-black">9:41</span>
      </div>
      <div className="mt-4 rounded-lg bg-violet-600 p-4 text-white">
        <p className="text-xs font-bold">Total Balance</p>
        <p className="mt-2 text-2xl font-black">Rs 24,500</p>
      </div>
      <div className="mt-4 space-y-3">
        {transactions.slice(0, 3).map((transaction) => (
          <TransactionRow key={`${title}-${transaction.name}`} {...transaction} />
        ))}
      </div>
      <button className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 text-sm font-bold text-white">
        <Plus className="size-4" />
        Add Transaction
      </button>
    </div>
  );
}

function Step({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Plus;
  title: string;
  text: string;
}) {
  return (
    <div>
      <span className="flex size-11 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-4 text-sm font-black text-slate-950">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-slate-600">{text}</p>
    </div>
  );
}
