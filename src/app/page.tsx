import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Root page — the middleware handles the redirect before this runs in most
 * cases, but this server component acts as a safe fallback.
 */
export default async function RootPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/sign-in");
  }

  const role = session.user?.role?.toUpperCase();

  if (role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  redirect("/account/dashboard");
}
