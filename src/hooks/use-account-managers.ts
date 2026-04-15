import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  fetchAccountManagers,
  type FetchAccountManagersParams,
} from "@/services/account-manager.service";
import { queryKeys } from "@/lib/query-keys";

export function useAccountManagers(params: FetchAccountManagersParams = {}) {
  const { status } = useSession();

  return useQuery({
    queryKey: queryKeys.admin.accountManagers(
      params as Record<string, unknown>
    ),
    queryFn: () => fetchAccountManagers(params),
    enabled: status === "authenticated",
    placeholderData: (prev) => prev,
  });
}
