"use client";

import { queryKeys } from "@/lib/query-keys";
import {
  fetchAccountManagerCallLogs,
  type FetchAccountManagerCallLogsParams,
} from "@/services/account-manager.service";
import { useQuery } from "@tanstack/react-query";

export function useAccountManagerCallLogs(params: FetchAccountManagerCallLogsParams = {}) {
  return useQuery({
    queryKey: queryKeys.accountManager.callLogs(params),
    queryFn: () => fetchAccountManagerCallLogs(params),
  });
}
