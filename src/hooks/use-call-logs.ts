import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { fetchCallLogs, type FetchCallLogsParams } from "@/services/call-log.service";
import { queryKeys } from "@/lib/query-keys";

export function useCallLogs(params: FetchCallLogsParams = {}) {
  const { status } = useSession();
  return useQuery({
    queryKey: queryKeys.callLogs.list(params as Record<string, unknown>),
    queryFn: () => fetchCallLogs(params),
    enabled: status === "authenticated",
    placeholderData: (prev) => prev,
  });
}
