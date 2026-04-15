"use client";

import CallAnalyticsChart from "@/components/dashboard/admin/call-analytics-chart";
import CallSummaryCard from "@/components/dashboard/admin/call-summary-card";
import DashboardSkeleton from "@/components/dashboard/admin/dashboard-skeleton";
import LatestCallsTable from "@/components/dashboard/admin/latest-calls-table";
import StatCards from "@/components/dashboard/admin/stat-cards";
import WelcomeCard from "@/components/dashboard/admin/welcome-card";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useAdminDashboard();

  return (
    <main className="p-4 sm:p-5 md:p-8">
      {/* Page header */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold tracking-tight text-[#3a4050]">
          DASHBOARD
        </h1>
        <nav className="hidden text-sm text-[#8a92a6] sm:block" aria-label="Breadcrumb">
          <span>Dashboards</span>
          <span className="mx-1">/</span>
          <span className="text-[#4b5563]">Dashboard</span>
        </nav>
      </div>

      {/* Loading state */}
      {isLoading && <DashboardSkeleton />}

      {/* Error state */}
      {isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {(error as Error)?.message ?? "Failed to load dashboard data."}
        </div>
      )}

      {/* Loaded state */}
      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
            {/* Left column */}
            <div className="flex flex-col gap-4 md:gap-5 xl:col-span-1">
              <WelcomeCard adminProfile={data.adminProfile} />
              <CallSummaryCard overview={data.todaysOverview} />
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4 md:gap-5 xl:col-span-2">
              <StatCards metrics={data.metrics} />
              <CallAnalyticsChart callAnalytics={data.callAnalytics} />
            </div>
          </div>

          {/* Latest calls table — full width */}
          <div className="mt-4 md:mt-5">
            <LatestCallsTable />
          </div>
        </>
      )}
    </main>
  );
}
