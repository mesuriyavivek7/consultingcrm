import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const role = session?.user?.role?.toUpperCase();

  if (!session) {
    redirect("/sign-in");
  }

  if (role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  redirect("/account/dashboard");
}
