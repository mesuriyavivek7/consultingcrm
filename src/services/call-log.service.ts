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

export type CallType = "OUTGOING" | "INCOMING" | "MISSED";
export type DateFilter = "today" | "all";

export type FetchCallLogsParams = {
  search?: string;
  callType?: CallType | "";
  dateFilter?: DateFilter | "";
  page?: number;
  limit?: number;
};

export type CallLogsResult = {
  logs: CallLog[];
  pagination: Pagination;
};

/**
 * Fetch latest call logs (dashboard widget — no filters, fixed limit).
 */
export async function fetchLatestCallLogs({
  limit = 10,
}: { limit?: number } = {}): Promise<CallLog[]> {
  const response = await http.get<CallLogsResponse>("/call-logs", {
    params: { limit },
  });
  if (!response.data?.success) {
    throw new Error(response.data?.message ?? "Failed to fetch call logs.");
  }
  const logs = response.data.data?.data;
  return Array.isArray(logs) ? logs : [];
}

/**
 * Fetch call logs with full filter + pagination support (call logs page).
 */
export async function fetchCallLogs(
  params: FetchCallLogsParams = {}
): Promise<CallLogsResult> {
  const { search, callType, dateFilter, page = 1, limit = 10 } = params;

  const query: Record<string, string | number> = { page, limit };
  if (search?.trim()) query.search = search.trim();
  if (callType) query.callType = callType;
  if (dateFilter) query.dateFilter = dateFilter;

  const response = await http.get<CallLogsResponse>("/call-logs", {
    params: query,
  });

  if (!response.data?.success) {
    throw new Error(response.data?.message ?? "Failed to fetch call logs.");
  }

  const logs = response.data.data?.data;
  return {
    logs: Array.isArray(logs) ? logs : [],
    pagination: response.data.data?.pagination,
  };
}
