import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  fetchAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  type UpdateAdminProfilePayload,
  type ChangePasswordPayload,
} from "@/services/admin-profile.service";
import { queryKeys } from "@/lib/query-keys";

export function useAdminProfile() {
  const { status } = useSession();
  return useQuery({
    queryKey: queryKeys.profile.admin(),
    queryFn: fetchAdminProfile,
    enabled: status === "authenticated",
  });
}

export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateAdminProfilePayload) =>
      updateAdminProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.profile.admin(), updated);
    },
  });
}

export function useChangeAdminPassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      changeAdminPassword(payload),
  });
}
