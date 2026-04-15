import type { TodaysOverview } from "@/services/admin.service";
import { ArrowUpRight } from "lucide-react";

function CircleProgress({ percent }: { percent: number }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <svg width={110} height={110} viewBox="0 0 110 110" aria-hidden="true">
      <circle cx={55} cy={55} r={r} fill="none" stroke="#e8ecf4" strokeWidth={9} />
      <circle
        cx={55}
        cy={55}
        r={r}
        fill="none"
        stroke="#556ee6"
        strokeWidth={9}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
      />
      <text x={55} y={51} textAnchor="middle" fill="#4b5563" fontSize={14} fontWeight={600}>
        {percent.toFixed(0)}%
      </text>
      <text x={55} y={67} textAnchor="middle" fill="#8a92a6" fontSize={11}>
        Calls done
      </text>
    </svg>
  );
}

type CallSummaryCardProps = {
  overview: TodaysOverview;
};

export default function CallSummaryCard({ overview }: CallSummaryCardProps) {
  const {
    todaysTotalCalls,
    progressPercentage,
    changeFromYesterdayPercent,
  } = overview;

  // API sends progressPercentage as a decimal (e.g. 0.57 = 57%)
  const displayPercent = progressPercentage > 1
    ? progressPercentage
    : progressPercentage * 100;

  return (
    <div className="flex-1 rounded-xl bg-white p-4 shadow-sm md:p-5">
      <p className="font-semibold text-[#3a4050]">Today&apos;s Call Overview</p>
      <p className="mt-0.5 text-xs text-[#8a92a6]">Current day summary</p>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-3xl font-bold text-[#3a4050] md:text-4xl">
            {todaysTotalCalls}
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-1 text-sm font-medium text-emerald-500">
            <ArrowUpRight size={14} />
            {changeFromYesterdayPercent}%
            <span className="font-normal text-[#8a92a6]">from yesterday</span>
          </p>
        </div>
        <div className="flex-shrink-0">
          <CircleProgress percent={Math.round(displayPercent)} />
        </div>
      </div>
    </div>
  );
}
