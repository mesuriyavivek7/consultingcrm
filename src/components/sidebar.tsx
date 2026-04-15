"use client";

import { LayoutDashboard, Users, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

type SidebarProps = {
  collapsed?: boolean;
  mobile?: boolean;
  onClose?: () => void;
};

function getDashboardHref(role: string | undefined): string {
  if (role === "admin") return "/admin/dashboard";
  return "/account/dashboard";
}

export default function Sidebar({
  collapsed = false,
  mobile = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.user?.role;
  const isAdmin = role === "admin";
  const dashboardHref = getDashboardHref(role);
  const isDashboardActive = pathname.includes("/dashboard");
  const isAccountManagersActive = pathname.includes("/account-managers");

  return (
    <div className="flex h-full flex-col bg-[var(--sidebar-bg)] text-white">
      {mobile ? (
        <div className="absolute right-3 top-3 z-10">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-md bg-white/10 p-1.5 text-white transition hover:bg-white/20"
          >
            <X size={18} />
          </button>
        </div>
      ) : null}

      <div className="border-b border-white/10 px-6 py-5">
        <p className="text-lg font-semibold tracking-wide">
          {collapsed ? "CC" : "Consulting CRM"}
        </p>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        <Link
          href={dashboardHref}
          className={`flex rounded-lg py-3 text-sm font-medium outline-none transition-all duration-200 focus-visible:outline-none ${
            isDashboardActive
              ? "text-[#d7deee]"
              : "text-white hover:text-[#d7deee]"
          } ${
            collapsed
              ? "items-center justify-center px-0"
              : "items-center gap-3 px-4"
          }`}
          aria-label="Dashboard"
          title="Dashboard"
        >
          <LayoutDashboard size={18} />
          {!collapsed ? <span>Dashboard</span> : null}
        </Link>

        {isAdmin && (
          <Link
            href="/admin/account-managers"
            className={`flex rounded-lg py-3 text-sm font-medium outline-none transition-all duration-200 focus-visible:outline-none ${
              isAccountManagersActive
                ? "text-[#d7deee]"
                : "text-white hover:text-[#d7deee]"
            } ${
              collapsed
                ? "items-center justify-center px-0"
                : "items-center gap-3 px-4"
            }`}
            aria-label="Account Managers"
            title="Account Managers"
          >
            <Users size={18} />
            {!collapsed ? <span>Account Managers</span> : null}
          </Link>
        )}
      </nav>
    </div>
  );
}
