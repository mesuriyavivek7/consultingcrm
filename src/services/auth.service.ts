import axios from "axios";

import type { LoginFormValues } from "@/lib/schemas/auth";
import { http } from "@/lib/http";

/** Shape returned by POST /auth/login on success */
export type LoginApiResponse = {
  message: string;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    accessToken: string;
  };
  success: boolean;
};

function getErrorMessageFromResponseData(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const msg = (data as { message?: unknown }).message;
  return typeof msg === "string" && msg.trim() ? msg : null;
}

/**
 * Calls the backend login endpoint. Throws Error with a user-visible message on failure.
 */
export async function loginWithApi(
  credentials: LoginFormValues
): Promise<LoginApiResponse> {
  try {
    const response = await http.post<LoginApiResponse>(
      "/auth/login",
      credentials
    );

    if (response.status >= 200 && response.status < 300) {
      const body = response.data;
      if (
        body?.success &&
        body.data?.id &&
        body.data.email &&
        body.data.accessToken
      ) {
        return body;
      }
      throw new Error(
        getErrorMessageFromResponseData(body) ??
          "Login failed. Please try again."
      );
    }

    throw new Error(
      getErrorMessageFromResponseData(response.data) ??
        `Login failed (${response.status}).`
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const fromBody = getErrorMessageFromResponseData(error.response?.data);
      throw new Error(
        fromBody ?? error.message ?? "Could not reach the server. Try again."
      );
    }
    throw error;
  }
}
