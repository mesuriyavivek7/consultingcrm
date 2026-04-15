import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccountManager } from "@/services/account-manager.service";
import { queryKeys } from "@/lib/query-keys";

export function useDeleteAccountManager() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAccountManager(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}
