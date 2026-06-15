import { getFinanceData } from "../_lib/finance-data";
import { GoalsWorkspace } from "./_components/goals-workspace";
import { sortGoalsByUrgency } from "./_lib/goal-metrics";

export default async function GoalsPage() {
  const data = await getFinanceData();
  const goals = sortGoalsByUrgency(data.goals);

  return <GoalsWorkspace goals={goals} />;
}
