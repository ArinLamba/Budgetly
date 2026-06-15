import {
  MiniCalendar,
  PageShell,
  PageTitle,
  SectionCard,
  SpendingCalendarLegend,
} from "../_components/finance-ui";
import { MonthControls } from "../_components/period-controls";
import {
  getCalendarDays,
  getFinanceData,
  getMonthTransactions,
} from "../_lib/finance-data";
import { getDateFromKey } from "../_lib/date-utils";
import { CalendarActivityCard } from "./_components/calendar-activity-card";
import { getCalendarSummary } from "./_lib/calendar-summary";

export default async function CalendarPage({
  searchParams,
}: PageProps<"/calendar">) {
  const params = await searchParams;
  const month = typeof params.month === "string" ? params.month : undefined;
  const data = await getFinanceData(month);
  const monthTransactions = getMonthTransactions(data.transactions, data.monthKey);
  const calendarDays = getCalendarDays(
    monthTransactions,
    getDateFromKey(data.monthKey)
  );
  const summary = getCalendarSummary(monthTransactions);

  return (
    <PageShell>
      <PageTitle
        action={<MonthControls month={data.monthKey} pathname="/calendar" />}
      >
        Spending Calendar
      </PageTitle>

      <SectionCard>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <MiniCalendar days={calendarDays} />
          <div className="lg:min-w-32">
            <SpendingCalendarLegend />
          </div>
        </div>
      </SectionCard>

      <CalendarActivityCard
        title={data.monthKey.slice(0, 7)}
        total={summary.total}
        transactions={monthTransactions}
      />
    </PageShell>
  );
}
