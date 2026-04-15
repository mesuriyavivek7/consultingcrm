"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchAccountManagerDashboard } from "@/services/account.service";
import { queryKeys } from "@/lib/query-keys";

export function useAccountDashboard() {
  const { status } = useSession();

  return useQuery({
    queryKey: queryKeys.account.dashboard(),
    queryFn: fetchAccountManagerDashboard,
    enabled: status === "authenticated",
  });
}
