"use client";

import AuthSync from "@/components/auth-sync";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

type ProvidersProps = Readonly<{ children: React.ReactNode }>;

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 min
            retry: 1,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {/* Keeps Zustand auth store in sync with the NextAuth session */}
        <AuthSync />
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
}
