"use client";

import { useState, useCallback } from "react";
import { Search, Phone, RefreshCw, PhoneIncoming, PhoneOutgoing, PhoneMissed } from "lucide-react";
import { useCallLogs } from "@/hooks/use-call-logs";
import type { CallLog, CallType, DateFilter } from "@/services/call-log.service";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

const IST_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

function formatUTCDateTime(iso: string): string {
  return IST_FORMATTER.format(new Date(iso));
}

// ─── Call-type badge ──────────────────────────────────────────────────────────

function CallTypeBadge({ type }: { type: CallLog["callType"] }) {
  const config = {
    OUTGOING: {
      icon: <PhoneOutgoing size={12} />,
      label: "Outgoing",
      cls: "bg-blue-50 text-blue-600",
    },
    INCOMING: {
      icon: <PhoneIncoming size={12} />,
      label: "Incoming",
      cls: "bg-green-50 text-green-600",
    },
    MISSED: {
      icon: <PhoneMissed size={12} />,
      label: "Missed",
      cls: "bg-red-50 text-red-500",
    },
  }[type];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.cls}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 border-b border-[#f1f5f9] px-6 py-4"
        >
          <div className="h-3.5 w-28 rounded bg-gray-200" />
          <div className="h-3.5 w-32 rounded bg-gray-200" />
          <div className="h-3.5 w-32 rounded bg-gray-200" />
          <div className="h-3.5 w-14 rounded bg-gray-200" />
          <div className="h-6 w-20 rounded-full bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

// ─── Table rows ──────────────────────────────────────────────────────────────

function TableRows({ logs, startIndex }: { logs: CallLog[]; startIndex: number }) {
  if (logs.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="py-16 text-center text-sm text-[#8a92a6]">
          No call logs found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {logs.map((log, idx) => (
        <tr key={log._id} className="transition-colors hover:bg-[#f8fafd]">
          <td className="px-5 py-3.5 text-sm text-[#6b7280]">
            {startIndex + idx + 1}
          </td>

          <td className="px-5 py-3.5 text-sm text-[#4b5563]">{log.to}</td>

          <td className="px-5 py-3.5 text-sm text-[#4b5563]">
            {formatUTCDateTime(log.callStart)}
          </td>

          <td className="px-5 py-3.5 text-sm text-[#4b5563]">
            {log.callEnd ? formatUTCDateTime(log.callEnd) : "—"}
          </td>

          <td className="px-5 py-3.5 text-sm text-[#4b5563]">
            {formatDuration(log.duration)}
          </td>

          <td className="px-5 py-3.5">
            <CallTypeBadge type={log.callType} />
          </td>
        </tr>
      ))}
    </>
  );
}

// ─── Pagination ──────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPage,
}: {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPage: (p: number) => void;
}) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-start justify-between gap-3 border-t border-[#eef2f8] px-5 py-3 sm:flex-row sm:items-center">
      <p className="text-xs text-[#8a92a6]">
        Showing {from}–{to} of {total} call logs
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="rounded px-2.5 py-1.5 text-xs font-medium text-[#556ee6] transition hover:bg-[#edf1ff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPage(p)}
            className={`h-7 w-7 rounded text-xs font-medium transition ${
              p === page
                ? "bg-[#556ee6] text-white"
                : "text-[#4b5563] hover:bg-[#f1f5f9]"
            }`}
          >
            {p}
          </button>
        ))}
        {totalPages > 7 && (
          <span className="px-1 text-xs text-[#8a92a6]">…</span>
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPage(page + 1)}
          className="rounded px-2.5 py-1.5 text-xs font-medium text-[#556ee6] transition hover:bg-[#edf1ff] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const LIMIT = 10;

export default function AccountCallLogsPage() {
  const [search, setSearch] = useState("");
  const [callTypeFilter, setCallTypeFilter] = useState<CallType | "">("");
  const [dateFilter, setDateFilter] = useState<DateFilter | "">("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, isFetching, refetch } = useCallLogs({
    search,
    callType: callTypeFilter,
    dateFilter,
    page,
    limit: LIMIT,
  });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleCallType = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setCallTypeFilter(e.target.value as CallType | "");
      setPage(1);
    },
    []
  );

  const handleDateFilter = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDateFilter(e.target.value as DateFilter | "");
      setPage(1);
    },
    []
  );

  const startIndex = ((data?.pagination?.page ?? 1) - 1) * LIMIT;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-5">
        <div className="mb-0.5 flex items-center gap-2">
          <Phone size={20} className="text-[#556ee6]" />
          <h1 className="text-xl font-semibold text-[#3a4050]">My Call Logs</h1>
        </div>
        <p className="text-sm text-[#8a92a6]">
          View and filter your personal call activity.
        </p>
      </div>

      {/* Card */}
      <div className="flex flex-1 flex-col rounded-xl bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#eef2f8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
            />
            <input
              type="text"
              placeholder="Search phone number…"
              value={search}
              onChange={handleSearch}
              className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] py-2 pl-9 pr-3 text-sm text-[#3a4050] placeholder-[#9ca3af] outline-none transition focus:border-[#556ee6] focus:bg-white focus:ring-1 focus:ring-[#556ee6]/30"
            />
          </div>

          {/* Filters row */}
          <div className="flex items-center gap-2">
            {/* Call type */}
            <select
              value={callTypeFilter}
              onChange={handleCallType}
              className="flex-1 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-sm text-[#3a4050] outline-none transition focus:border-[#556ee6] focus:bg-white focus:ring-1 focus:ring-[#556ee6]/30 sm:w-36 sm:flex-none"
            >
              <option value="">All Types</option>
              <option value="OUTGOING">Outgoing</option>
              <option value="INCOMING">Incoming</option>
              <option value="MISSED">Missed</option>
            </select>

            {/* Date filter */}
            <select
              value={dateFilter}
              onChange={handleDateFilter}
              className="flex-1 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-sm text-[#3a4050] outline-none transition focus:border-[#556ee6] focus:bg-white focus:ring-1 focus:ring-[#556ee6]/30 sm:w-32 sm:flex-none"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
            </select>

            {/* Refresh */}
            <button
              type="button"
              onClick={() => void refetch()}
              disabled={isFetching}
              title="Refresh"
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[#e5e7eb] text-[#6b7280] transition hover:bg-[#f1f5f9] disabled:opacity-50"
            >
              <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* Error */}
        {isError && (
          <div className="px-6 py-10 text-center text-sm text-red-500">
            {error instanceof Error ? error.message : "Failed to load call logs."}
          </div>
        )}

        {/* Skeleton */}
        {isLoading && <TableSkeleton />}

        {/* Table */}
        {!isLoading && !isError && (
          <div className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <colgroup>
                <col className="w-12" />
                <col className="w-40" />
                <col className="w-44" />
                <col className="w-44" />
                <col className="w-24" />
                <col className="w-28" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#eef2f8] bg-[#f8fafc]">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">No.</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Phone No.</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Start Time</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">End Time</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Duration</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Call Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                <TableRows logs={data?.logs ?? []} startIndex={startIndex} />
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && !isError && data && data.pagination.totalPages > 0 && (
          <Pagination
            page={data.pagination.page}
            totalPages={data.pagination.totalPages}
            total={data.pagination.total}
            limit={LIMIT}
            onPage={setPage}
          />
        )}
      </div>
    </main>
  );
}
