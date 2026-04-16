import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  fetchAccountProfile,
  updateAccountProfile,
  changeAccountPassword,
  type UpdateAccountProfilePayload,
  type ChangePasswordPayload,
} from "@/services/account.service";
import { queryKeys } from "@/lib/query-keys";

export function useAccountProfile() {
  const { status } = useSession();
  return useQuery({
    queryKey: queryKeys.account.profile(),
    queryFn: fetchAccountProfile,
    enabled: status === "authenticated",
  });
}

export function useUpdateAccountProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAccountProfilePayload) =>
      updateAccountProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.account.profile(), updated);
    },
  });
}

export function useChangeAccountPassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      changeAccountPassword(payload),
  });
}
