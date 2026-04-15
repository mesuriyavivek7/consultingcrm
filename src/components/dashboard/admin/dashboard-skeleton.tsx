function Bone({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[#eef2f8] ${className ?? ""}`}
    />
  );
}

function WelcomeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="h-28 animate-pulse bg-[#d8dff5]" />
      <div className="px-5 pb-6 pt-2 space-y-3">
        <Bone className="h-10 w-10 rounded-full -mt-5" />
        <Bone className="h-4 w-32" />
        <Bone className="h-3 w-20" />
        <Bone className="h-3 w-48" />
        <Bone className="h-3 w-36" />
      </div>
    </div>
  );
}

function CallSummaryCardSkeleton() {
  return (
    <div className="flex-1 rounded-xl bg-white p-5 shadow-sm space-y-4">
      <Bone className="h-4 w-36" />
      <Bone className="h-3 w-24" />
      <div className="flex items-center justify-between mt-2">
        <div className="space-y-2">
          <Bone className="h-10 w-16" />
          <Bone className="h-3 w-32" />
        </div>
        <Bone className="h-24 w-24 rounded-full" />
      </div>
    </div>
  );
}

function StatCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
      {[0, 1, 2].map((i) => (
        <div key={i} className="rounded-xl bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-3 flex-1">
              <Bone className="h-3 w-28" />
              <Bone className="h-8 w-16" />
            </div>
            <Bone className="h-11 w-11 flex-shrink-0 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex-1 rounded-xl bg-white p-5 shadow-sm md:p-6">
      <div className="mb-5 flex items-center justify-between">
        <Bone className="h-5 w-36" />
        <Bone className="h-8 w-32 rounded-lg" />
      </div>
      <div className="space-y-3">
        <Bone className="h-[220px] w-full md:h-[260px] rounded-xl" />
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="rounded-xl bg-white shadow-sm">
      <div className="border-b border-[#eef2f8] px-5 py-4">
        <Bone className="h-4 w-28" />
        <Bone className="mt-1.5 h-3 w-52" />
      </div>
      <div className="p-5 space-y-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <Bone key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
    </div>
  );
}

export default function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-4 md:gap-5 xl:col-span-1">
          <WelcomeCardSkeleton />
          <CallSummaryCardSkeleton />
        </div>
        <div className="flex flex-col gap-4 md:gap-5 xl:col-span-2">
          <StatCardsSkeleton />
          <ChartSkeleton />
        </div>
      </div>
      <div className="mt-4 md:mt-5">
        <TableSkeleton />
      </div>
    </>
  );
}
