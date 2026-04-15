"use client";

import { queryKeys } from "@/lib/query-keys";
import { fetchAdminDashboard } from "@/services/admin.service";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export function useAdminDashboard() {
  const { status } = useSession();

  return useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn: fetchAdminDashboard,
  });
}
