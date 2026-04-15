"use client";

import type { CallAnalytics } from "@/services/admin.service";
import { CalendarRange } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type AnalyticsFilter = "weekly" | "monthly";

type CallAnalyticsChartProps = {
  callAnalytics: CallAnalytics;
};

export default function CallAnalyticsChart({ callAnalytics }: CallAnalyticsChartProps) {
  const [filter, setFilter] = useState<AnalyticsFilter>("weekly");

  const chartData =
    filter === "weekly" ? callAnalytics.weeklyData : callAnalytics.monthlyData;

  return (
    <div className="flex-1 rounded-xl bg-white p-4 shadow-sm md:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <CalendarRange size={17} className="text-[#556ee6]" />
          <h2 className="font-semibold text-[#3a4050]">Call Analytics</h2>
        </div>
        <div className="inline-flex flex-shrink-0 rounded-lg bg-[#f1f4fb] p-0.5">
          <button
            type="button"
            onClick={() => setFilter("weekly")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all md:px-4 ${
              filter === "weekly"
                ? "bg-[#556ee6] text-white shadow-sm"
                : "text-[#6b7280] hover:bg-white"
            }`}
          >
            Week
          </button>
          <button
            type="button"
            onClick={() => setFilter("monthly")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all md:px-4 ${
              filter === "monthly"
                ? "bg-[#556ee6] text-white shadow-sm"
                : "text-[#6b7280] hover:bg-white"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="h-[220px] w-full md:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 6, right: 6, left: -14, bottom: 0 }}
          >
            <CartesianGrid stroke="#e9edf5" strokeDasharray="4 4" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "#8a92a6", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "#8a92a6", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={46}
            />
            <Tooltip
              formatter={(value) => [value, "Calls"]}
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid #e8ecf4",
                boxShadow: "0 4px 12px rgba(0,0,0,.06)",
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey="calls"
              stroke="#556ee6"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "#556ee6", strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
