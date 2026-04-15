export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
        <div className="flex flex-col gap-4 md:gap-5 xl:col-span-1">
          <div className="h-48 rounded-xl bg-[#eef2f8]" />
          <div className="h-56 rounded-xl bg-[#eef2f8]" />
        </div>
        <div className="flex flex-col gap-4 md:gap-5 xl:col-span-2">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="h-24 rounded-xl bg-[#eef2f8]" />
            <div className="h-24 rounded-xl bg-[#eef2f8]" />
            <div className="h-24 rounded-xl bg-[#eef2f8]" />
          </div>
          <div className="h-80 rounded-xl bg-[#eef2f8]" />
        </div>
      </div>
      <div className="mt-4 h-96 rounded-xl bg-[#eef2f8] md:mt-5" />
    </div>
  );
}
