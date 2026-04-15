import { http } from "@/lib/http";

export type AccountManagerStatus = "ACTIVE" | "INACTIVE";

export type CallDataPoint = {
  label: string;
  calls: number;
};

export type CreatedBy = {
  id: string;
  fullName: string;
  mobileNo: string;
};

export type AccountManager = {
  id: string;
  uniqueId: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
  status: AccountManagerStatus;
  role: string;
  createdBy: CreatedBy;
};

export type AccountManagerPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type AccountManagersResult = {
  items: AccountManager[];
  pagination: AccountManagerPagination;
};

type AccountManagersPayload = {
  items: AccountManager[];
  pagination: AccountManagerPagination;
};

type AccountManagersResponse = {
  success: boolean;
  message: string;
  data: AccountManagersPayload;
};

export type FetchAccountManagersParams = {
  search?: string;
  status?: AccountManagerStatus | "";
  page?: number;
  limit?: number;
};

/**
 * Fetch paginated list of account managers.
 * Token is injected automatically by the axios interceptor in http.ts.
 */
export async function fetchAccountManagers(
  params: FetchAccountManagersParams = {}
): Promise<AccountManagersResult> {
  const { search, status, page = 1, limit = 10 } = params;

  const query: Record<string, string | number> = { page, limit };
  if (search?.trim()) query.search = search.trim();
  if (status) query.status = status;

  const response = await http.get<AccountManagersResponse>(
    "/admin/account-manager",
    { params: query }
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ?? "Failed to fetch account managers."
    );
  }

  return {
    items: response.data.data?.items ?? [],
    pagination: response.data.data?.pagination,
  };
}

export type AccountManagerProfile = {
  fullName: string;
  email: string;
  mobileNo: string;
  uniqueId: string;
  status: AccountManagerStatus;
};

export type AccountManagerDashboardMetrics = {
  todaysTotalCalls: number;
  totalCallsOverall: number;
  monthlyTarget: number;
};

export type AccountManagerCallAnalytics = {
  weeklyData: CallDataPoint[];
  monthlyData: CallDataPoint[];
};

export type AccountManagerTodaysOverview = {
  todaysTotalCalls: number;
  targetCalls: number;
  progressPercentage: number;
  changeFromYesterdayPercent: number;
};

export type AccountManagerDashboardData = {
  profile: AccountManagerProfile;
  metrics: AccountManagerDashboardMetrics;
  callAnalytics: AccountManagerCallAnalytics;
  todaysOverview: AccountManagerTodaysOverview;
};

type AccountManagerDashboardResponse = {
  success: boolean;
  message: string;
  data: AccountManagerDashboardData;
};

export async function fetchAccountManagerDashboard(): Promise<AccountManagerDashboardData> {
  const response = await http.get<AccountManagerDashboardResponse>("/account-manager/dashboard");

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ?? "Failed to fetch account manager dashboard."
    );
  }

  return response.data.data;
}

export type FetchAccountManagerCallLogsParams = {
  page?: number;
  limit?: number;
};

type CallLogsData = {
  items: Array<{
    _id: string;
    to: string;
    calledBy: {
      _id: string;
      firstName: string;
      lastName: string;
      mobileNo: string;
      uniqueId: string;
    };
    callStart: string;
    callEnd: string;
    duration: number;
    callType: "OUTGOING" | "INCOMING" | "MISSED";
    createdAt: string;
    updatedAt: string;
  }>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type AccountManagerCallLogsResponse = {
  success: boolean;
  message: string;
  data: CallLogsData;
};

export async function fetchAccountManagerCallLogs(
  params: FetchAccountManagerCallLogsParams = {}
): Promise<CallLogsData> {
  const { page = 1, limit = 10 } = params;

  const query: Record<string, string | number> = { page, limit };

  const response = await http.get<AccountManagerCallLogsResponse>(
    "/account-manager/call-logs",
    { params: query }
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ?? "Failed to fetch call logs."
    );
  }

  return response.data.data;
}
