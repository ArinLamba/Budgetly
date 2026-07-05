import { PageShell, PageTitle } from "../_components/finance-ui";
import { getCurrentDbUser } from "../transactions/_lib/data";
import { SettingsContent } from "./_components/settings-content";

export default async function SettingsPage() {
  const user = await getCurrentDbUser();

  return (
    <PageShell>
      <PageTitle
        heading={<h1 className="text-xl font-bold">Settings</h1>}
      />
      <SettingsContent user={user} />
    </PageShell>
  );
}
