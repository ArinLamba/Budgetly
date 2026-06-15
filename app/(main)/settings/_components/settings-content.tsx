import { Button } from "@/components/ui/button";
import type { getFinanceData } from "../../_lib/finance-data";
import { settingsNav } from "../_lib/settings-nav";

type Props = {
  user: Awaited<ReturnType<typeof getFinanceData>>["user"];
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
        <section className="rounded-lg border bg-background p-5 shadow-xs">
          <h2 className="text-base font-bold text-foreground">Profile</h2>
          <div className="mt-5 flex items-center gap-4">
            <div className="size-16 rounded-full bg-[linear-gradient(135deg,#f9a8d4,#fdba74)]" />
            <div>
              <p className="font-bold text-foreground">
                {user.name ?? "Budgetly user"}
              </p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <h3 className="mt-8 text-sm font-bold text-foreground">
            Preferences
          </h3>
          <div className="mt-4 grid max-w-xl gap-3">
            {[
              ["Currency", "INR (Rs)"],
              ["Date Format", "DD MMM YYYY"],
              ["Theme", "Light"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[1fr_180px] items-center gap-3"
              >
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
                <button className="rounded-md border bg-background px-3 py-2 text-left text-sm font-medium text-foreground">
                  {value}
                </button>
              </div>
            ))}
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
