import { PageShell, PageTitle } from "../_components/finance-ui";
import { getFinanceData } from "../_lib/finance-data";
import { AddGoalDialog } from "./_components/add-goal-dialog";
import { GoalList } from "./_components/goal-list";

export default async function GoalsPage() {
  const data = await getFinanceData();

  return (
    <PageShell>
      <PageTitle
        action={
          <AddGoalDialog />
        }
      >
        Goals
      </PageTitle>

      <GoalList goals={data.goals} />
    </PageShell>
  );
}
