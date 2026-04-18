"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Users, RefreshCw, UserPlus, Pencil, Trash2 } from "lucide-react";

import { useAccountManagers } from "@/hooks/use-account-managers";
import { useUpdateAccountManagerStatus } from "@/hooks/use-update-account-manager-status";
import { useDeleteAccountManager } from "@/hooks/use-delete-account-manager";
import { Switch } from "@/components/ui/switch";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type {
  AccountManager,
  AccountManagerStatus,
} from "@/services/account-manager.service";

// ─── Avatar initials ─────────────────────────────────────────────────────────

function Avatar({ firstName, lastName }: { firstName: string; lastName: string }) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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
          <div className="h-6 w-10 rounded-full bg-gray-200" />
          <div className="h-3.5 w-28 rounded bg-gray-200" />
          <div className="flex gap-2">
            <div className="h-7 w-7 rounded bg-gray-200" />
            <div className="h-7 w-7 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Table rows ──────────────────────────────────────────────────────────────

function TableRows({
  items,
  startIndex,
  onEdit,
  onDelete,
}: {
  items: AccountManager[];
  startIndex: number;
  onEdit: (am: AccountManager) => void;
  onDelete: (am: AccountManager) => void;
}) {
  const { mutate: updateStatus, isPending, variables } = useUpdateAccountManagerStatus();

  if (items.length === 0) {
    return (
      <tr>
        <td colSpan={8} className="py-16 text-center text-sm text-[#8a92a6]">
          No account managers found.
        </td>
      </tr>
    );
  }

  return (
    <>
      {items.map((am, idx) => {
        const isTogglingThis = isPending && variables?.id === am.id;
        const isActive = am.status === "ACTIVE";

        return (
          <tr key={am.id} className="transition-colors hover:bg-[#f8fafd]">
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

            {/* Status toggle */}
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isActive}
                  disabled={isTogglingThis}
                  onCheckedChange={(checked) =>
                    updateStatus({
                      id: am.id,
                      status: checked ? "ACTIVE" : "INACTIVE",
                    })
                  }
                />
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-green-600" : "text-[#9ca3af]"
                  }`}
                >
                  {isTogglingThis ? "…" : isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </td>

            <td className="px-5 py-3.5 text-center text-sm font-medium text-[#3a4050]">
              {am.totalCallCount}
            </td>

            <td className="px-5 py-3.5 text-center">
              <span className="inline-flex items-center justify-center rounded-full bg-[#edf1ff] px-2.5 py-0.5 text-xs font-semibold text-[#556ee6]">
                {am.todaysCallCount}
              </span>
            </td>

            {/* Actions */}
            <td className="px-5 py-3.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="Edit"
                  onClick={() => onEdit(am)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-[#556ee6] transition hover:bg-[#edf1ff]"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => onDelete(am)}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-red-400 transition hover:bg-red-50"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AccountManagerStatus | "">("");
  const [page, setPage] = useState(1);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<AccountManager | null>(null);
  const { mutate: deleteManager, isPending: isDeleting } = useDeleteAccountManager();

  const { data, isLoading, isError, error, isFetching, refetch } =
    useAccountManagers({ search, status: statusFilter, page, limit: LIMIT });

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleStatusFilter = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(e.target.value as AccountManagerStatus | "");
      setPage(1);
    },
    []
  );

  function handleEdit(am: AccountManager) {
    const params = new URLSearchParams({
      firstName: am.firstName,
      lastName: am.lastName,
      email: am.email,
      mobileNo: am.mobileNo,
      status: am.status,
    });
    router.push(`/admin/account-managers/${am.id}/edit?${params.toString()}`);
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    deleteManager(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  }

  const startIndex = ((data?.pagination?.page ?? 1) - 1) * LIMIT;

  return (
    <main className="flex min-h-[calc(100vh-4rem)] flex-col p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-0.5 flex items-center gap-2">
            <Users size={20} className="text-[#556ee6]" />
            <h1 className="text-xl font-semibold text-[#3a4050]">
              Account Managers
            </h1>
          </div>
          <p className="text-sm text-[#8a92a6]">
            Manage and view all account managers in the system.
          </p>
        </div>
        <Link
          href="/admin/account-managers/new"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#556ee6] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#4a5fd4] sm:w-auto"
        >
          <UserPlus size={16} />
          <span>Add Account Manager</span>
        </Link>
      </div>

      {/* Card */}
      <div className="flex flex-1 flex-col rounded-xl bg-white shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-[#eef2f8] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
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

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={handleStatusFilter}
              className="flex-1 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-sm text-[#3a4050] outline-none transition focus:border-[#556ee6] focus:bg-white focus:ring-1 focus:ring-[#556ee6]/30 sm:w-40 sm:flex-none"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>

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
            {error instanceof Error
              ? error.message
              : "Failed to load account managers."}
          </div>
        )}

        {/* Skeleton */}
        {isLoading && <TableSkeleton />}

        {/* Table */}
        {!isLoading && !isError && (
          <div className="flex-1 overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <colgroup>
                <col className="w-12" />
                <col className="w-52" />
                <col className="w-48" />
                <col className="w-36" />
                <col className="w-32" />
                <col className="w-28" />
                <col className="w-28" />
                <col className="w-24" />
              </colgroup>
              <thead>
                <tr className="border-b border-[#eef2f8] bg-[#f8fafc]">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">No.</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Account Manager</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Mobile</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Status</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Total Calls</th>
                  <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Today&apos;s Calls</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#6b7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                <TableRows
                  items={data?.items ?? []}
                  startIndex={startIndex}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
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

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Account Manager"
        description={`Are you sure you want to delete "${deleteTarget?.firstName} ${deleteTarget?.lastName}"? This action cannot be undone.`}
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        isLoading={isDeleting}
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </main>
  );
}
