import { Button } from "@/components/ui/button";
import { PageShell, PageTitle } from "../_components/finance-ui";
import { getFinanceData } from "../_lib/finance-data";

const settingsNav = [
  "Profile",
  "Categories",
  "Payment Methods",
  "Currency",
  "Notifications",
  "Security",
  "Backup & Restore",
  "About",
];

export default async function SettingsPage() {
  const data = await getFinanceData();

  return (
    <PageShell>
      <PageTitle>Settings</PageTitle>

      <div className="grid gap-4 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-lg border bg-slate-50/80 p-2">
          {settingsNav.map((item) => (
            <button
              key={item}
              className={`block w-full rounded-md px-3 py-2 text-left text-sm font-medium ${
                item === "Profile"
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-background"
              }`}
            >
              {item}
            </button>
          ))}
        </aside>

        <div className="space-y-4">
          <section className="rounded-lg border bg-background p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-950">Profile</h2>
            <div className="mt-5 flex items-center gap-4">
              <div className="size-16 rounded-full bg-[linear-gradient(135deg,#f9a8d4,#fdba74)]" />
              <div>
                <p className="font-bold text-slate-950">{data.user.name ?? "Budgetly user"}</p>
                <p className="text-sm text-muted-foreground">{data.user.email}</p>
              </div>
            </div>

            <h3 className="mt-8 text-sm font-bold text-slate-950">Preferences</h3>
            <div className="mt-4 grid max-w-xl gap-3">
              {[
                ["Currency", "INR (₹)"],
                ["Date Format", "DD MMM YYYY"],
                ["Theme", "Light"],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[1fr_180px] items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                  <button className="rounded-md border bg-background px-3 py-2 text-left text-sm font-medium text-slate-700">
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
                <p className="font-semibold text-slate-950">Clear All Data</p>
                <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
              </div>
              <Button variant="destructive" className="h-9 px-4 text-xs">
                Clear Data
              </Button>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}
