/**
 * Centralized React Query key factory.
 * Using objects keeps keys namespaced and avoids string collision.
 * Pass them to useQuery/useMutation/queryClient.invalidateQueries.
 */
export const queryKeys = {
  admin: {
    all: ["admin"] as const,
    dashboard: () => [...queryKeys.admin.all, "dashboard"] as const,
    accountManagers: (params: Record<string, unknown>) =>
      [...queryKeys.admin.all, "accountManagers", params] as const,
  },
  accountManager: {
    all: ["accountManager"] as const,
    dashboard: () => [...queryKeys.accountManager.all, "dashboard"] as const,
    callLogs: (params: Record<string, unknown>) =>
      [...queryKeys.accountManager.all, "callLogs", params] as const,
    profile: () => [...queryKeys.accountManager.all, "profile"] as const,
  },
  callLogs: {
    all: ["callLogs"] as const,
    latest: (limit: number) => [...queryKeys.callLogs.all, "latest", limit] as const,
  },
} as const;
