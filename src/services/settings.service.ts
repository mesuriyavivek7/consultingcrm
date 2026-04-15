import { http } from "@/lib/http";

export type AdminSettings = {
  dailyCallTarget: number;
};

type SettingsResponse = {
  success: boolean;
  message: string;
  data: AdminSettings;
};

/**
 * Fetch admin settings.
 * Token is injected automatically by the axios interceptor in http.ts.
 */
export async function fetchAdminSettings(): Promise<AdminSettings> {
  const response = await http.get<SettingsResponse>("/admin/settings");

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ?? "Failed to fetch admin settings."
    );
  }

  // Handle both wrapped ({ data: { dailyCallTarget } }) and flat ({ dailyCallTarget })
  const payload = response.data.data ?? (response.data as unknown as AdminSettings);
  return { dailyCallTarget: payload.dailyCallTarget };
}

/**
 * Update admin settings.
 */
export async function updateAdminSettings(
  payload: Partial<AdminSettings>
): Promise<AdminSettings> {
  const response = await http.patch<SettingsResponse>(
    "/admin/settings",
    payload
  );

  if (!response.data?.success) {
    throw new Error(
      response.data?.message ?? "Failed to update admin settings."
    );
  }

  const data = response.data.data ?? (response.data as unknown as AdminSettings);
  return { dailyCallTarget: data.dailyCallTarget };
}
