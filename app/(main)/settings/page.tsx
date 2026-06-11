import { PageShell, PageTitle } from "../_components/finance-ui";
import { getFinanceData } from "../_lib/finance-data";
import { SettingsContent } from "./_components/settings-content";

export default async function SettingsPage() {
  const data = await getFinanceData();

  return (
    <PageShell>
      <PageTitle>Settings</PageTitle>
      <SettingsContent user={data.user} />
    </PageShell>
  );
}
