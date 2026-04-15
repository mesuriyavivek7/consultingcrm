"use client";

import { queryKeys } from "@/lib/query-keys";
import { fetchLatestCallLogs } from "@/services/call-log.service";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

const LATEST_LIMIT = 10;

export function useLatestCallLogs() {
  const { status } = useSession();

  return useQuery({
    queryKey: queryKeys.callLogs.latest(LATEST_LIMIT),
    queryFn: () => fetchLatestCallLogs({ limit: LATEST_LIMIT }),
    enabled: status === "authenticated",
  });
}
