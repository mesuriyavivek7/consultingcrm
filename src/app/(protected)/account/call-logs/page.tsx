"use client";

import { useAccountManagerCallLogs } from "@/hooks/use-account-manager-call-logs";
import { ChevronLeft, ChevronRight, Phone, PhoneIncoming, PhoneOutgoing } from "lucide-react";
import { useState } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  const day = pad(d.getUTCDate());
  const month = MONTHS[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  const h24 = d.getUTCHours();
  const min = pad(d.getUTCMinutes());
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = pad(h24 % 12 || 12);
  return `${day} ${month} ${year}, ${h12}:${min} ${ampm}`;
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

function CallTypeBadge({ type }: { type: "OUTGOING" | "INCOMING" | "MISSED" }) {
  const config = {
    OUTGOING: { label: "Outgoing", icon: <PhoneOutgoing size={12} />, className: "bg-blue-50 text-blue-600" },
    INCOMING: { label: "Incoming", icon: <PhoneIncoming size={12} />, className: "bg-emerald-50 text-emerald-600" },
    MISSED: { label: "Missed", icon: <Phone size={12} />, className: "bg-red-50 text-red-500" },
  } as const;

  const { label, icon, className } = config[type];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${className}`}>
      {icon}
      {label}
    </span>
  );
}

export default function CallLogsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useAccountManagerCallLogs({
    page,
    limit: 20,
  });

  const logs = data?.items ?? [];
  const pagination = data?.pagination;

  return (
    <main className="p-4 sm:p-5 md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold tracking-tight text-[#3a4050]">CALL LOGS</h1>
        <nav className="hidden text-sm text-[#8a92a6] sm:block" aria-label="Breadcrumb">
          <span>Call Logs</span>
        </nav>
      </div>

      <div className="rounded-xl bg-white shadow-sm">
        <div className="border-b border-[#eef2f8] px-5 py-4 md:px-6">
          <h2 className="font-semibold text-[#3a4050]">All Call Logs</h2>
          <p className="mt-0.5 text-xs text-[#8a92a6]">Complete history of your calls</p>
        </div>

        {isError && <div className="px-5 py-4 text-sm text-red-500">{(error as Error)?.message ?? "Failed to load call logs."}</div>}

        {isLoading && (
          <div className="animate-pulse space-y-0">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-[#f1f5f9] px-5 py-4">
                <div className="h-3 w-32 rounded bg-[#eef2f8]" />
                <div className="h-3 w-36 rounded bg-[#eef2f8]" />
                <div className="h-3 w-36 rounded bg-[#eef2f8]" />
                <div className="h-3 w-12 rounded bg-[#eef2f8]" />
                <div className="h-6 w-20 rounded-full bg-[#eef2f8]" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-[#eef2f8] bg-[#f8fafc]">
                    <th className="px-5 py-3 text-left font-semibold text-[#4b5563]">Phone No.</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Start Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">End Time</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Duration</th>
                    <th className="px-4 py-3 text-left font-semibold text-[#4b5563]">Call Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-[#8a92a6]">No call logs found.</td>
                    </tr>
                  ) : (
                    logs.map((call) => (
                      <tr key={call._id} className="transition-colors hover:bg-[#f8fafd]">
                        <td className="px-5 py-3.5 text-[#5f6880]">{call.to}</td>
                        <td className="px-4 py-3.5 text-[#5f6880]">{formatTime(call.callStart)}</td>
                        <td className="px-4 py-3.5 text-[#5f6880]">{formatTime(call.callEnd)}</td>
                        <td className="px-4 py-3.5 font-medium text-[#3a4050]">{formatDuration(call.duration)}</td>
                        <td className="px-4 py-3.5"><CallTypeBadge type={call.callType} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#eef2f8] px-5 py-4 md:px-6">
                <p className="text-sm text-[#8a92a6]">
                  Showing {((page - 1) * pagination.limit) + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} results
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="inline-flex items-center gap-1 rounded-lg border border-[#e8ecf4] px-3 py-1.5 text-sm font-medium text-[#3a4050] transition-colors hover:bg-[#f8fafd] disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <span className="text-sm text-[#8a92a6]">Page {page} of {pagination.totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="inline-flex items-center gap-1 rounded-lg border border-[#e8ecf4] px-3 py-1.5 text-sm font-medium text-[#3a4050] transition-colors hover:bg-[#f8fafd] disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {(!pagination || pagination.totalPages <= 1) && (
              <div className="border-t border-[#eef2f8] px-5 py-3 text-xs text-[#8a92a6] md:px-6">Showing {logs.length} records</div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
