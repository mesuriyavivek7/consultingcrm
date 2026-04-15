import { http } from "@/lib/http";

export type AdminProfile = {
  fullName: string;
  email: string;
  mobileNo: string;
};

export type DashboardMetrics = {
  todaysTotalCalls: number;
  totalCallsOverall: number;
  totalAccountManagers: number;
};

export type CallDataPoint = {
  label: string;
  calls: number;
};

export type CallAnalytics = {
  weeklyData: CallDataPoint[];
  monthlyData: CallDataPoint[];
};

export type TodaysOverview = {
  todaysTotalCalls: number;
  targetCallsForToday: number;
  progressPercentage: number;
  changeFromYesterdayPercent: number;
};

export type AdminDashboardData = {
  adminProfile: AdminProfile;
  metrics: DashboardMetrics;
  callAnalytics: CallAnalytics;
  todaysOverview: TodaysOverview;
};

type AdminDashboardResponse = {
  success: boolean;
  message: string;
  data: AdminDashboardData;
};

/**
 * Token is automatically attached by the axios interceptor in http.ts.
 * No need to pass it here manually.
 */
export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const response = await http.get<AdminDashboardResponse>("/admin/dashboard");

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ?? "Failed to fetch admin dashboard."
    );
  }

  return response.data.data;
}
