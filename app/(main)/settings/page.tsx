import { PageShell, PageTitle } from "../_components/finance-ui";
import { getFinanceData } from "../_lib/finance-data";
import { getCurrentDbUser } from "../transactions/_lib/data";
import { SettingsContent } from "./_components/settings-content";

export default async function SettingsPage() {
  const user = await getCurrentDbUser();

  return (
    <PageShell>
      <PageTitle>Settings</PageTitle>
      <SettingsContent user={user} />
    </PageShell>
  );
}
