"use client";

import { useLatestCallLogs } from "@/hooks/use-latest-call-logs";
import type { CallLog } from "@/services/call-log.service";
import { Phone, PhoneIncoming, PhoneOutgoing } from "lucide-react";

/* ─── Date formatting (IST, AM/PM) ─── */

const IST_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

function formatTime(isoString: string): string {
  return IST_FORMATTER.format(new Date(isoString));
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return "0s";
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/* ─── Call type badge ─── */

function CallTypeBadge({ type }: { type: CallLog["callType"] }) {
  const config = {
    OUTGOING: {
      label: "Outgoing",
      icon: <PhoneOutgoing size={12} />,
      className: "bg-blue-50 text-blue-600",
    },
    INCOMING: {
      label: "Incoming",
      icon: <PhoneIncoming size={12} />,
      className: "bg-emerald-50 text-emerald-600",
    },
    MISSED: {
      label: "Missed",
      icon: <Phone size={12} />,
      className: "bg-red-50 text-red-500",
    },
  } as const;

  const { label, icon, className } = config[type];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {icon}
      {label}
    </span>
  );
}

/* ─── Skeleton ─── */

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-0">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 border-b border-[#f1f5f9] px-5 py-4">
          <div className="h-3 w-28 rounded bg-[#eef2f8]" />
          <div className="h-3 w-32 rounded bg-[#eef2f8]" />
          <div className="h-3 w-36 rounded bg-[#eef2f8]" />
          <div className="h-3 w-36 rounded bg-[#eef2f8]" />
          <div className="h-3 w-12 rounded bg-[#eef2f8]" />
          <div className="h-6 w-20 rounded-full bg-[#eef2f8]" />
        </div>
      ))}
    </div>
  );
}

/* ─── Table rows ─── */

function TableRows({ logs }: { logs: CallLog[] }) {
  if (logs.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-5 py-10 text-center text-sm text-[#8a92a6]">
          No call logs found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {logs.map((call) => (
        <tr key={call._id} className="transition-colors hover:bg-[#f8fafd]">
          <td className="px-5 py-3.5 font-medium text-[#3a4050]">
            {call.calledBy.firstName} {call.calledBy.lastName}
          </td>
          <td className="px-4 py-3.5 text-[#5f6880]">{call.to}</td>
          <td className="px-4 py-3.5 text-[#5f6880]">{formatTime(call.callStart)}</td>
          <td className="px-4 py-3.5 text-[#5f6880]">{formatTime(call.callEnd)}</td>
          <td className="px-4 py-3.5 font-medium text-[#3a4050]">
            {formatDuration(call.duration)}
          </td>
          <td className="px-4 py-3.5">
            <CallTypeBadge type={call.callType} />
          </td>
        </tr>
      ))}
    </>
  );
}

/* ─── Main component ─── */

export default function LatestCallsTable() {
  const { data: logs, isLoading, isError, error } = useLatestCallLogs();

  return (
    <div className="rounded-xl bg-white shadow-sm">
      {/* Card header */}
      <div className="border-b border-[#eef2f8] px-5 py-4 md:px-6">
        <h2 className="font-semibold text-[#3a4050]">Latest Calls</h2>
        <p className="mt-0.5 text-xs text-[#8a92a6]">
          Recent call activity from account managers
        </p>
      </div>

      {/* Error state */}
      {isError && (
        <div className="px-5 py-4 text-sm text-red-500">
          {(error as Error)?.message ?? "Failed to load call logs."}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && <TableSkeleton />}

      {/* Loaded table */}
      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[#eef2f8] bg-[#f8fafc]">
                <th className="px-5 py-3 text-left font-semibold text-[#4b5563]">Caller Name</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Phone No.</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Start Time</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">End Time</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Duration</th>
                <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Call Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              <TableRows logs={Array.isArray(logs) ? logs : []} />
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {!isLoading && !isError && (
        <div className="border-t border-[#eef2f8] px-5 py-3 text-xs text-[#8a92a6] md:px-6">
          Showing {logs?.length ?? 0} latest records
        </div>
      )}
    </div>
  );
}
