"use client";

import { useAccountManagerDashboard } from "@/hooks/use-account-manager-dashboard";
import { Mail, Phone, User, Hash, CheckCircle, XCircle } from "lucide-react";

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(" ");
  const first = parts[0]?.charAt(0).toUpperCase() ?? "";
  const last = parts[1]?.charAt(0).toUpperCase() ?? "";
  return (first + last) || "U";
}

export default function ProfilePage() {
  const { data, isLoading, isError, error } = useAccountManagerDashboard();

  return (
    <main className="p-4 sm:p-5 md:p-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold tracking-tight text-[#3a4050]">PROFILE</h1>
        <nav className="hidden text-sm text-[#8a92a6] sm:block" aria-label="Breadcrumb">
          <span>Account</span>
          <span className="mx-1">/</span>
          <span className="text-[#4b5563]">Profile</span>
        </nav>
      </div>

      {isLoading && (
        <div className="animate-pulse">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="h-24 w-24 rounded-full bg-[#eef2f8]" />
            <div className="mt-4 space-y-3">
              <div className="h-4 w-48 rounded bg-[#eef2f8]" />
              <div className="h-3 w-32 rounded bg-[#eef2f8]" />
            </div>
          </div>
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          {(error as Error)?.message ?? "Failed to load profile data."}
        </div>
      )}

      {data?.profile && (
        <div className="max-w-2xl">
          <div className="rounded-xl bg-white shadow-sm">
            <div className="border-b border-[#eef2f8] px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#edf1ff] text-2xl font-bold text-[#556ee6]">
                  {getInitials(data.profile.fullName)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#3a4050]">{data.profile.fullName}</h2>
                  <p className="text-sm text-[#8a92a6]">Account Manager</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5">
              <h3 className="mb-4 font-semibold text-[#3a4050]">Personal Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User size={18} className="mt-0.5 flex-shrink-0 text-[#556ee6]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#8a92a6]">Full Name</p>
                    <p className="mt-1 font-medium text-[#3a4050]">{data.profile.fullName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={18} className="mt-0.5 flex-shrink-0 text-[#556ee6]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#8a92a6]">Email Address</p>
                    <p className="mt-1 font-medium text-[#3a4050]">{data.profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="mt-0.5 flex-shrink-0 text-[#556ee6]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#8a92a6]">Mobile Number</p>
                    <p className="mt-1 font-medium text-[#3a4050]">+91 {data.profile.mobileNo}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Hash size={18} className="mt-0.5 flex-shrink-0 text-[#556ee6]" />
                  <div className="flex-1">
                    <p className="text-xs text-[#8a92a6]">Unique ID</p>
                    <p className="mt-1 font-medium text-[#3a4050]">{data.profile.uniqueId}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  {data.profile.status === "ACTIVE" ? (
                    <CheckCircle size={18} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-[#8a92a6]">Status</p>
                    <p className={`mt-1 font-medium ${data.profile.status === "ACTIVE" ? "text-emerald-600" : "text-red-600"}`}>
                      {data.profile.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
