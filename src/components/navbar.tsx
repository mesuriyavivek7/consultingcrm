"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, Menu, User } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useMemo } from "react";

type NavbarProps = {
  onOpenMobileSidebar: () => void;
  onToggleDesktopSidebar: () => void;
};

export default function Navbar({ onOpenMobileSidebar, onToggleDesktopSidebar }: NavbarProps) {
  const { data: session } = useSession();
  const firstName = session?.user?.firstName?.trim() || "User";
  const lastName = session?.user?.lastName?.trim() || "";

  const initials = useMemo(() => {
    const firstInitial = firstName.trim().charAt(0).toUpperCase();
    const lastInitial = lastName.trim().charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`.trim() || "U";
  }, [firstName, lastName]);

  return (
    <header className="sticky top-0 z-20 border-b border-[#e8ecf4] bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          aria-label="Open sidebar"
          onClick={onOpenMobileSidebar}
          className="inline-flex h-10 w-10 items-center cursor-pointer justify-center rounded-lg text-[#282e42] outline-none transition hover:bg-[#f4f6fb] focus-visible:outline-none lg:hidden"
        >
          <Menu size={20} />
        </button>

        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={onToggleDesktopSidebar}
          className="hidden h-10 w-10 items-center cursor-pointer justify-center rounded-lg text-[#282e42] outline-none transition hover:bg-[#f4f6fb] focus-visible:outline-none lg:inline-flex"
        >
          <Menu size={20} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open profile menu"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 text-[#2f3852] outline-none transition hover:bg-[#f5f7fc] focus-visible:outline-none"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf0ff] text-xs font-semibold text-[#3a4a7a]">
                {initials}
              </span>
              <span className="hidden text-sm font-medium sm:inline">{firstName}</span>
              <ChevronDown size={16} className="hidden text-[#7b849f] sm:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem asChild>
              <Link href="/admin/profile" className="flex items-center gap-2">
                <User size={16} />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                void signOut({ callbackUrl: "/sign-in" });
              }}
              className="cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <LogOut size={16} />
                <span>Logout</span>
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
