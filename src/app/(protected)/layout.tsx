import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ProtectedShell from "@/components/protected-shell";

type ProtectedLayoutProps = Readonly<{ children: React.ReactNode }>;

/**
 * Server component — validates the session before rendering anything.
 * Unauthenticated requests are redirected to /sign-in immediately,
 * before any client JS is sent to the browser.
 */
export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  return <ProtectedShell>{children}</ProtectedShell>;
}
