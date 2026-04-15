import { http } from "@/lib/http";

export type AdminProfile = {
  id: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  email: string;
};

export type UpdateAdminProfilePayload = {
  firstName?: string;
  lastName?: string;
  mobileNo?: string;
  email?: string;
};

export type ChangePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

type ProfileResponse = {
  success?: boolean;
  message?: string;
  data?: AdminProfile;
} & Partial<AdminProfile>;

export async function fetchAdminProfile(): Promise<AdminProfile> {
  const response = await http.get<ProfileResponse>("/admin/profile");

  // Handle both wrapped { data: {...} } and flat responses
  const profile =
    response.data?.data ??
    (response.data as unknown as AdminProfile);

  if (!profile?.id) {
    throw new Error("Failed to fetch admin profile.");
  }

  return profile;
}

export async function updateAdminProfile(
  payload: UpdateAdminProfilePayload
): Promise<AdminProfile> {
  const response = await http.patch<ProfileResponse>("/admin/profile", payload);

  if (response.data?.success === false || response.status >= 400) {
    throw new Error(
      response.data?.message ?? "Failed to update admin profile."
    );
  }

  const profile =
    response.data?.data ??
    (response.data as unknown as AdminProfile);

  if (!profile?.id) {
    throw new Error("Failed to update admin profile.");
  }

  return profile;
}

type ApiResponse = { success?: boolean; message?: string };

export async function changeAdminPassword(
  payload: ChangePasswordPayload
): Promise<void> {
  const response = await http.patch<ApiResponse>("/admin/change-password", payload);

  // validateStatus allows 4xx through — throw manually on failure
  if (response.data?.success === false || response.status >= 400) {
    throw new Error(
      response.data?.message ?? "Failed to change password."
    );
  }
}
