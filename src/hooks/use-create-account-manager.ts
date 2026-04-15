import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createAccountManager,
  type CreateAccountManagerPayload,
} from "@/services/account-manager.service";
import { queryKeys } from "@/lib/query-keys";

/**
 * Mutation hook for creating a new account manager.
 * On success it invalidates all account manager list queries so the
 * list page automatically re-fetches with the latest data.
 */
export function useCreateAccountManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAccountManagerPayload) =>
      createAccountManager(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.admin.all,
      });
    },
  });
}
