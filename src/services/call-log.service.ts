import { http } from "@/lib/http";

export type CalledBy = {
  _id: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  uniqueId: string;
};

export type CallLog = {
  _id: string;
  to: string;
  calledBy: CalledBy;
  callStart: string;
  callEnd: string;
  duration: number;
  callType: "OUTGOING" | "INCOMING" | "MISSED";
  createdAt: string;
  updatedAt: string;
};

type AppliedFilters = {
  callType: string;
  dateFilter: string;
  search: string;
};

type Pagination = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

type CallLogsPayload = {
  appliedFilters: AppliedFilters;
  data: CallLog[];
  pagination: Pagination;
};

type CallLogsResponse = {
  success: boolean;
  message: string;
  data: CallLogsPayload;
};

type FetchCallLogsParams = {
  limit?: number;
};

/**
 * Fetch latest call logs.
 * Token is injected automatically by the axios interceptor in http.ts.
 */
export async function fetchLatestCallLogs({
  limit = 10,
}: FetchCallLogsParams = {}): Promise<CallLog[]> {
  const response = await http.get<CallLogsResponse>("/call-logs", {
    params: { limit },
  });

  if (!response.data?.success) {
    throw new Error(response.data?.message ?? "Failed to fetch call logs.");
  }

  // API wraps call logs in { data: [...], appliedFilters, pagination }
  const logs = response.data.data?.data;
  return Array.isArray(logs) ? logs : [];
}
