import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateAccountManager,
  type UpdateAccountManagerPayload,
} from "@/services/account-manager.service";
import { queryKeys } from "@/lib/query-keys";

export function useUpdateAccountManager() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAccountManagerPayload }) =>
      updateAccountManager(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}
