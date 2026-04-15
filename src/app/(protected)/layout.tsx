"use client";

import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { useState } from "react";

type ProtectedLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div
        className={`fixed inset-y-0 left-0 z-30 hidden transition-all duration-200 lg:block ${
          isDesktopSidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        <Sidebar collapsed={isDesktopSidebarCollapsed} />
      </div>

      {isMobileSidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar backdrop"
            className="absolute inset-0 bg-black/45"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <aside className="relative h-full w-60 shadow-xl">
            <Sidebar mobile onClose={() => setIsMobileSidebarOpen(false)} />
          </aside>
        </div>
      ) : null}

      <div
        className={`transition-all duration-200 ${
          isDesktopSidebarCollapsed ? "lg:pl-16" : "lg:pl-60"
        }`}
      >
        <Navbar
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onToggleDesktopSidebar={() =>
            setIsDesktopSidebarCollapsed((previousValue) => !previousValue)
          }
        />

        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
