import { MiniCalendar, PageShell, PageTitle, SectionCard, SpendingCalendarLegend, TransactionMiniList } from "../_components/finance-ui";
import { MonthControls } from "../_components/period-controls";
import {
  getCalendarDays,
  getFinanceData,
  getMonthTransactions,
} from "../_lib/finance-data";

export default async function CalendarPage({
  searchParams,
}: PageProps<"/calendar">) {
  const params = await searchParams;
  const month = typeof params.month === "string" ? params.month : undefined;
  const data = await getFinanceData(month);
  const monthTransactions = getMonthTransactions(data.transactions, data.monthKey);
  const calendarDays = getCalendarDays(
    monthTransactions,
    new Date(`${data.monthKey}T00:00:00`)
  );

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

      <SectionCard className="mt-4 max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-950">15 June 2026</h2>
          <span className="text-xs font-semibold text-slate-700">Total ₹1,370</span>
        </div>
        <TransactionMiniList limit={3} transactions={monthTransactions} />
      </SectionCard>
    </PageShell>
  );
}
