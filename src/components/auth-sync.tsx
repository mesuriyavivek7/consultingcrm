"use client";

import { useAuthStore } from "@/store/auth-store";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

/**
 * Invisible component that keeps the Zustand auth store in sync with
 * the NextAuth session. Mount it once inside Providers.
 */
export default function AuthSync() {
  const { data: session, status } = useSession();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);
  const clearAccessToken = useAuthStore((s) => s.clearAccessToken);

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      setAccessToken(session.accessToken);
    } else if (status === "unauthenticated") {
      clearAccessToken();
    }
  }, [status, session?.accessToken, setAccessToken, clearAccessToken]);

  return null;
}
