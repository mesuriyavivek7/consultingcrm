import { http } from "@/lib/http";

// ─── Types ──────────────────────────────────────────────────────────────────

export type AccountProfile = {
  id: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  uniqueId: string;
  email: string;
};

export type AccountDashboardMetrics = {
  todaysTotalCalls: number;
  totalCallsOverall: number;
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

export type AccountDashboardData = {
  accountProfile: {
    fullName: string;
    email: string;
    mobileNo: string;
    uniqueId: string;
  };
  metrics: AccountDashboardMetrics;
  callAnalytics: CallAnalytics;
  todaysOverview: TodaysOverview;
};

export type UpdateAccountProfilePayload = {
  firstName?: string;
  lastName?: string;
  mobileNo?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

// ─── API response wrappers ───────────────────────────────────────────────────

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

export async function fetchAccountManagerDashboard(): Promise<AccountDashboardData> {
  const response = await http.get<ApiResponse<AccountDashboardData>>(
    "/account/dashboard"
  );
  if (!response.data?.success) {
    throw new Error(
      response.data?.message ?? "Failed to fetch account manager dashboard."
    );
  }
  return response.data.data;
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function fetchAccountProfile(): Promise<AccountProfile> {
  const response = await http.get<ApiResponse<AccountProfile>>("/account/profile");
  if (!response.data?.success) {
    throw new Error(response.data?.message ?? "Failed to fetch profile.");
  }
  return response.data.data;
}

export async function updateAccountProfile(
  payload: UpdateAccountProfilePayload
): Promise<AccountProfile> {
  const response = await http.patch<ApiResponse<AccountProfile>>(
    "/account/profile",
    payload
  );
  if (response.data?.success === false || response.status >= 400) {
    throw new Error(response.data?.message ?? "Failed to update profile.");
  }
  return response.data.data;
}

export async function changeAccountPassword(
  payload: ChangePasswordPayload
): Promise<void> {
  const response = await http.patch<{ success?: boolean; message?: string }>(
    "/account/change-password",
    payload
  );
  if (response.data?.success === false || response.status >= 400) {
    throw new Error(response.data?.message ?? "Failed to change password.");
  }
}
