import { http } from "@/lib/http";

export type AccountManagerStatus = "ACTIVE" | "INACTIVE";

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
