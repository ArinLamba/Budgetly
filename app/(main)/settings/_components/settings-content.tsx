import { Button } from "@/components/ui/button";
// import type { getFinanceData } from "../../_lib/finance-data";
import { settingsNav } from "../_lib/settings-nav";
import { getCurrentDbUser } from "../../transactions/_lib/data";
import { SignInButton, SignOutButton, UserButton } from "@clerk/nextjs";
import { ThemeSelect } from "@/components/theme-toggle";
import { LogOut } from "lucide-react";

type Props = {
  user: Awaited<ReturnType<typeof getCurrentDbUser>>;
};

export function SettingsContent({ user }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
      <aside className="rounded-lg border bg-muted/40 p-2">
        {settingsNav.map((item) => (
          <button
            key={item}
            className={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
              item === "Profile"
                ? "bg-violet-50 text-indigo-700"
                : "text-muted-foreground hover:bg-background"
            }`}
          >
            {item}
          </button>
        ))}
      </aside>

      <div className="space-y-4">
        <section className="rounded-lg border bg-card p-5 shadow-xs ">
          <h2 className="text-base font-bold text-foreground">Profile</h2>
          <div className="mt-5 flex justify-evenly max-w-xl">
            <div className="flex gap-4 items-center">
              <UserButton />
              <div className="">
                <p className="font-bold text-foreground">
                  {user.name ?? "Budgetly user"}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="w-full flex items-center justify-end">
              <SignOutButton>
                <Button variant="destructive">
                  <LogOut size={18}/>
                  <p>Log Out</p>
                </Button>
              </SignOutButton>
            </div>
          </div>

          <h3 className="mt-8 text-sm font-bold text-foreground">
            Preferences
          </h3>
          <div className="mt-4 grid max-w-xl gap-3">
            <div className="grid grid-cols-[1fr_180px] items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                Crrency
              </span>
              <div className="rounded-md border bg-background px-3 py-2 text-left text-sm font-medium text-foreground">
                INR (Rs)
              </div>
            </div>
            <div className="grid grid-cols-[1fr_180px] items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                Date Format
              </span>
              <div className="rounded-md border bg-background px-3 py-2 text-left text-sm font-medium text-foreground">
                DD MM YYYY              
              </div>
            </div>
            <div className="grid grid-cols-[1fr_180px] items-center gap-3">
              <span className="text-sm font-medium text-foreground">
                Theme
              </span>
              <ThemeSelect />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-rose-100 bg-background p-5 shadow-xs">
          <h2 className="text-sm font-bold text-rose-600">Danger Zone</h2>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-foreground">Clear All Data</p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>
            <Button variant="destructive" className="h-9 px-4 text-xs">
              Clear Data
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
