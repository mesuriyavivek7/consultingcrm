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
  callLogs: {
    all: ["callLogs"] as const,
    latest: (limit: number) => [...queryKeys.callLogs.all, "latest", limit] as const,
    list: (params: Record<string, unknown>) =>
      [...queryKeys.callLogs.all, "list", params] as const,
  },
  settings: {
    all: ["settings"] as const,
    admin: () => [...queryKeys.settings.all, "admin"] as const,
  },
  profile: {
    all: ["profile"] as const,
    admin: () => [...queryKeys.profile.all, "admin"] as const,
  },
} as const;
