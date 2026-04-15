"use client";

import { queryKeys } from "@/lib/query-keys";
import { fetchAccountManagerDashboard } from "@/services/account-manager.service";
import { useQuery } from "@tanstack/react-query";

export function useAccountManagerDashboard() {
  return useQuery({
    queryKey: queryKeys.accountManager.dashboard(),
    queryFn: fetchAccountManagerDashboard,
  });
}
