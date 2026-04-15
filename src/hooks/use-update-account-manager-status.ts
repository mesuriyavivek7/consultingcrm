import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAccountManagerStatus,
  type AccountManagerStatus,
} from "@/services/account-manager.service";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateAccountManagerStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AccountManagerStatus }) =>
      updateAccountManagerStatus(id, status),
    onSuccess: async () => {
      // Invalidate list + dashboard so counts update everywhere
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}
