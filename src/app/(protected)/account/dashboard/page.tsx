"use client";

import AccountCallAnalyticsChart from "@/components/dashboard/account/call-analytics-chart";
import AccountCallSummaryCard from "@/components/dashboard/account/call-summary-card";
import AccountDashboardSkeleton from "@/components/dashboard/account/dashboard-skeleton";
import AccountLatestCallsTable from "@/components/dashboard/account/latest-calls-table";
import AccountStatCards from "@/components/dashboard/account/stat-cards";
import AccountWelcomeCard from "@/components/dashboard/account/welcome-card";
import { useAccountDashboard } from "@/hooks/use-account-dashboard";

export default function AccountManagerDashboardPage() {
  const { data, isLoading, isError, error } = useAccountDashboard();

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
      {isLoading && <AccountDashboardSkeleton />}

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
              <AccountWelcomeCard accountProfile={data.accountProfile} />
              <AccountCallSummaryCard overview={data.todaysOverview} />
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4 md:gap-5 xl:col-span-2">
              <AccountStatCards metrics={data.metrics} />
              <AccountCallAnalyticsChart callAnalytics={data.callAnalytics} />
            </div>
          </div>

          {/* Latest calls table — full width */}
          <div className="mt-4 md:mt-5">
            <AccountLatestCallsTable />
          </div>
        </>
      )}
    </main>
  );
}

