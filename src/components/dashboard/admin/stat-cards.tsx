import type { DashboardMetrics } from "@/services/admin.service";
import { Phone, PhoneCall, Users } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
};

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <article className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-[#8a92a6]">{label}</p>
          <p className="mt-3 text-2xl font-bold text-[#3a4050]">{value}</p>
        </div>
        <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#556ee6] text-white">
          {icon}
        </span>
      </div>
    </article>
  );
}

type StatCardsProps = {
  metrics: DashboardMetrics;
};

export default function StatCards({ metrics }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
      <StatCard
        label="Today's Total Calls"
        value={metrics.todaysTotalCalls}
        icon={<Phone size={18} />}
      />
      <StatCard
        label="Total Calls Overall"
        value={metrics.totalCallsOverall.toLocaleString()}
        icon={<PhoneCall size={18} />}
      />
      <StatCard
        label="Total Account Managers"
        value={metrics.totalAccountManagers}
        icon={<Users size={18} />}
      />
    </div>
  );
}
