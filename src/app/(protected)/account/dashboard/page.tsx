"use client";

import CallAnalyticsChart from "@/components/dashboard/account-manager/call-analytics-chart";
import CallOverviewCard from "@/components/dashboard/account-manager/call-overview-card";
import DashboardSkeleton from "@/components/dashboard/account-manager/dashboard-skeleton";
import LatestCallsTable from "@/components/dashboard/account-manager/latest-calls-table";
import StatCards from "@/components/dashboard/account-manager/stat-cards";
import WelcomeCard from "@/components/dashboard/account-manager/welcome-card";
import { useAccountManagerDashboard } from "@/hooks/use-account-manager-dashboard";

export default function AccountManagerDashboardPage() {
  const { data, isLoading, isError, error } = useAccountManagerDashboard();

  return (
    <main className="p-4 sm:p-5 md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold tracking-tight text-[#3a4050]">DASHBOARD</h1>
        <nav className="hidden text-sm text-[#8a92a6] sm:block" aria-label="Breadcrumb">
          <span>Dashboards</span>
          <span className="mx-1">/</span>
          <span className="text-[#4b5563]">Dashboard</span>
        </nav>
      </div>

      {isLoading && <DashboardSkeleton />}

      {isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {(error as Error)?.message ?? "Failed to load dashboard data."}
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 md:gap-5 xl:grid-cols-3">
            <div className="flex flex-col gap-4 md:gap-5 xl:col-span-1">
              <WelcomeCard profile={data.profile} />
              <CallOverviewCard overview={data.todaysOverview} />
            </div>

            <div className="flex flex-col gap-4 md:gap-5 xl:col-span-2">
              <StatCards metrics={data.metrics} />
              <CallAnalyticsChart callAnalytics={data.callAnalytics} />
            </div>
          </div>

          <div className="mt-4 md:mt-5">
            <LatestCallsTable />
          </div>
        </>
      )}
    </main>
  );
}
