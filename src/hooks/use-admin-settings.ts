import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  fetchAdminSettings,
  updateAdminSettings,
  type AdminSettings,
} from "@/services/settings.service";
import { queryKeys } from "@/lib/query-keys";

export function useAdminSettings() {
  const { status } = useSession();
  return useQuery({
    queryKey: queryKeys.settings.admin(),
    queryFn: fetchAdminSettings,
    enabled: status === "authenticated",
  });
}

export function useUpdateAdminSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<AdminSettings>) =>
      updateAdminSettings(payload),
    onSuccess: async (updated) => {
      // Update settings cache instantly with the returned value
      queryClient.setQueryData(queryKeys.settings.admin(), updated);
      // Invalidate dashboard so the progress ring reflects the new target
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.dashboard(),
      });
    },
  });
}
