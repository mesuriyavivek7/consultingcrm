"use client";

import { useState, useCallback } from "react";
import { Search, Users, RefreshCw } from "lucide-react";
import { useAccountManagers } from "@/hooks/use-account-managers";
import type {
  AccountManager,
  AccountManagerStatus,
} from "@/services/account-manager.service";

// ─── Status badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AccountManagerStatus }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      }`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          isActive ? "bg-green-500" : "bg-red-400"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

// ─── Avatar initials ─────────────────────────────────────────────────────────

function Avatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  return (
    <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#edf1ff] text-xs font-semibold text-[#556ee6]">
      {initials}
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
          <div className="h-8 w-8 rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-36 rounded bg-gray-200" />
            <div className="h-3 w-48 rounded bg-gray-100" />
          </div>
          <div className="h-3.5 w-24 rounded bg-gray-200" />
          <div className="h-3.5 w-24 rounded bg-gray-200" />
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-3.5 w-28 rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}

// ─── Table rows ──────────────────────────────────────────────────────────────

function TableRows({
  items,
  startIndex,
}: {
  items: AccountManager[];
  startIndex: number;
}) {
  if (items.length === 0) {
    return (
      <tr>
        <td colSpan={7} className="py-16 text-center text-sm text-[#8a92a6]">
          No account managers found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {items.map((am, idx) => (
        <tr
          key={am.id}
          className="transition-colors hover:bg-[#f8fafd]"
        >
          <td className="px-5 py-3.5 text-sm text-[#6b7280]">
            {startIndex + idx + 1}
          </td>
          <td className="px-5 py-3.5">
            <div className="flex items-center gap-3">
              <Avatar firstName={am.firstName} lastName={am.lastName} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#3a4050]">
                  {am.firstName} {am.lastName}
                </p>
                <p className="truncate text-xs text-[#8a92a6]">{am.uniqueId}</p>
              </div>
            </div>
          </td>
          <td className="px-5 py-3.5 text-sm text-[#4b5563]">{am.email}</td>
          <td className="px-5 py-3.5 text-sm text-[#4b5563]">+91 {am.mobileNo}</td>
          <td className="px-5 py-3.5">
            <StatusBadge status={am.status} />
          </td>
          <td className="px-5 py-3.5 text-sm text-[#4b5563]">
            {am.createdBy.fullName}
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

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-start justify-between gap-3 border-t border-[#eef2f8] px-5 py-3 sm:flex-row sm:items-center">
      <p className="text-xs text-[#8a92a6]">
        Showing {from}–{to} of {total} account managers
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

export default function AccountManagersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountManagerStatus | "">("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAccountManagers({
      search,
      status: statusFilter,
      page,
      limit: LIMIT,
    });

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      setPage(1);
    },
    []
  );

  const handleStatus = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value as AccountManagerStatus | "");
      setPage(1);
    },
    []
  );

  const startIndex = ((data?.pagination?.page ?? 1) - 1) * LIMIT;

  return (
    <main className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-1 flex items-center gap-2">
          <Users size={20} className="text-[#556ee6]" />
          <h1 className="text-xl font-semibold text-[#3a4050]">
            Account Managers
          </h1>
        </div>
        <p className="text-sm text-[#8a92a6]">
          Manage and view all account managers in the system.
        </p>
      </div>

      {/* Card */}
      <div className="rounded-xl bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#eef2f8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
              />
              <input
                type="text"
                placeholder="Search name, email, mobile…"
                value={search}
                onChange={handleSearch}
                className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] py-2 pl-9 pr-3 text-sm text-[#3a4050] placeholder-[#9ca3af] outline-none transition focus:border-[#556ee6] focus:bg-white focus:ring-1 focus:ring-[#556ee6]/30"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={handleStatus}
              className="w-full rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-sm text-[#3a4050] outline-none transition focus:border-[#556ee6] focus:bg-white focus:ring-1 focus:ring-[#556ee6]/30 sm:w-40"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

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

        {/* Error */}
        {isError && (
          <div className="px-6 py-10 text-center text-sm text-red-500">
            {error instanceof Error
              ? error.message
              : "Failed to load account managers."}
          </div>
        )}

        {/* Skeleton */}
        {isLoading && <TableSkeleton />}

        {/* Table */}
        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-[#eef2f8] bg-[#f8fafc]">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                    No.
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                    Account Manager
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                    Mobile
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">
                    Created By
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                <TableRows
                  items={data?.items ?? []}
                  startIndex={startIndex}
                />
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
