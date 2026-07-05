import { PageShell, SectionCard } from "./finance-ui";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

export function FinancePageLoading() {
  return (
    <PageShell>
      <div className="my-3 flex items-center justify-between gap-3">
        <SkeletonBlock className="h-7 w-40" />
        <SkeletonBlock className="h-9 w-32" />
      </div>
      <div className="grid gap-3 grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SectionCard key={index}>
            <SkeletonBlock className="h-4 w-20" />
            <SkeletonBlock className="mt-4 h-8 w-28" />
            <SkeletonBlock className="mt-3 h-3 w-24" />
          </SectionCard>
        ))}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <SectionCard>
          <SkeletonBlock className="h-5 w-36" />
          <SkeletonBlock className="mt-5 h-56 w-full" />
        </SectionCard>
        <SectionCard>
          <SkeletonBlock className="h-5 w-32" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <SkeletonBlock key={index} className="h-11 w-full" />
            ))}
          </div>
        </SectionCard>
      </div>
    </PageShell>
  );
}
