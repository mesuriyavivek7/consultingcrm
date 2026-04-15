"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod/v4";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, Loader2, User, X } from "lucide-react";

import {
  useAccountProfile,
  useUpdateAccountProfile,
  useChangeAccountPassword,
} from "@/hooks/use-account-profile";

/* ─── Schemas ─── */
const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  mobileNo: z
    .string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number is too long")
    .regex(/^\d+$/, "Mobile number must contain only digits"),
});

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

/* ─── Helpers ─── */
function getInitials(firstName?: string, lastName?: string) {
  return `${(firstName?.[0] ?? "").toUpperCase()}${(lastName?.[0] ?? "").toUpperCase()}`;
}

/* ─── Change Password Dialog ─── */
function ChangePasswordDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate, isPending } = useChangeAccountPassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: standardSchemaResolver(changePasswordSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    if (!open) {
      reset();
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [open, reset]);

  const onSubmit = (values: ChangePasswordFormValues) => {
    mutate(
      { currentPassword: values.currentPassword, newPassword: values.newPassword },
      {
        onSuccess: () => {
          toast.success("Password changed successfully.");
          onClose();
        },
        onError: (err: unknown) => {
          const msg =
            err instanceof Error ? err.message : "Failed to change password.";
          toast.error(msg);
        },
      }
    );
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-pwd-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1 text-[#9ca3af] transition hover:bg-[#f3f4f6] hover:text-[#3a4050] disabled:opacity-40"
        >
          <X size={16} />
        </button>

        <div className="px-6 pb-6 pt-6">
          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#556ee6]/10">
              <KeyRound size={18} className="text-[#556ee6]" />
            </div>
            <div>
              <h2
                id="change-pwd-title"
                className="text-base font-semibold text-[#1f2937]"
              >
                Change Password
              </h2>
              <p className="text-xs text-[#9ca3af]">
                Enter your current password to set a new one.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#374151]">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  {...register("currentPassword")}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-[#e5e7eb] py-3 pl-4 pr-11 text-sm text-[#1f2937] outline-none transition focus:border-[#556ee6] focus:ring-2 focus:ring-[#556ee6]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
                >
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-red-500">{errors.currentPassword.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#374151]">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  {...register("newPassword")}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-[#e5e7eb] py-3 pl-4 pr-11 text-sm text-[#1f2937] outline-none transition focus:border-[#556ee6] focus:ring-2 focus:ring-[#556ee6]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-500">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[#374151]">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  placeholder="Re-enter new password"
                  className="w-full rounded-xl border border-[#e5e7eb] py-3 pl-4 pr-11 text-sm text-[#1f2937] outline-none transition focus:border-[#556ee6] focus:ring-2 focus:ring-[#556ee6]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151]"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isPending}
                className="flex-1 rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#556ee6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d63cf] disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>Updating…</span>
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AccountProfilePage() {
  const [pwdDialogOpen, setPwdDialogOpen] = useState(false);

  const { data: profile, isLoading } = useAccountProfile();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateAccountProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: standardSchemaResolver(profileSchema),
    mode: "onTouched",
  });

  /* Pre-fill form when profile loads */
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        mobileNo: profile.mobileNo,
      });
    }
  }, [profile, reset]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile(values, {
      onSuccess: () => toast.success("Profile updated successfully."),
      onError: (err: unknown) => {
        const msg =
          err instanceof Error ? err.message : "Failed to update profile.";
        toast.error(msg);
      },
    });
  };

  const initials = getInitials(profile?.firstName, profile?.lastName);
  const fullName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "—";

  return (
    <>
      <ChangePasswordDialog
        open={pwdDialogOpen}
        onClose={() => setPwdDialogOpen(false)}
      />

      <div className="p-4 sm:p-6 xl:p-8">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#1f2937] sm:text-2xl">
            My Profile
          </h1>
          <p className="mt-1 text-sm text-[#9ca3af]">
            View and update your account details.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          {/* ── Left: Avatar card ── */}
          <div className="xl:col-span-1">
            <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 text-center shadow-sm">
              {/* Avatar */}
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#556ee6] text-2xl font-bold text-white shadow-md">
                {isLoading ? (
                  <User size={28} className="text-white/70" />
                ) : (
                  initials || <User size={28} />
                )}
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  <div className="mx-auto h-5 w-32 animate-pulse rounded-md bg-[#f3f4f6]" />
                  <div className="mx-auto h-4 w-44 animate-pulse rounded-md bg-[#f3f4f6]" />
                  <div className="mx-auto h-4 w-36 animate-pulse rounded-md bg-[#f3f4f6]" />
                </div>
              ) : (
                <>
                  <h2 className="text-base font-semibold text-[#1f2937]">
                    {fullName}
                  </h2>
                  <p className="mt-0.5 text-sm text-[#9ca3af]">
                    {profile?.email}
                  </p>
                  <p className="mt-0.5 text-sm text-[#9ca3af]">
                    ID: {profile?.uniqueId}
                  </p>
                </>
              )}

              {/* Role badge */}
              <span className="mt-4 inline-block rounded-full bg-[#556ee6]/10 px-3 py-1 text-xs font-medium text-[#556ee6]">
                Account Manager
              </span>

              {/* Change password button */}
              <button
                type="button"
                onClick={() => setPwdDialogOpen(true)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-sm font-medium text-[#374151] transition hover:bg-[#f9fafb] hover:text-[#556ee6]"
              >
                <KeyRound size={15} />
                Change Password
              </button>
            </div>
          </div>

          {/* ── Right: Edit form ── */}
          <div className="xl:col-span-2">
            <div className="rounded-2xl border border-[#e5e7eb] bg-white shadow-sm">
              <div className="border-b border-[#f3f4f6] px-6 py-4">
                <h3 className="text-sm font-semibold text-[#1f2937]">
                  Personal Information
                </h3>
                <p className="mt-0.5 text-xs text-[#9ca3af]">
                  Update your name and phone number. Contact admin to change your email.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="grid gap-5 p-6 sm:grid-cols-2">
                  {/* First Name */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#374151]">
                      First Name
                    </label>
                    {isLoading ? (
                      <div className="h-11 w-full animate-pulse rounded-xl bg-[#f3f4f6]" />
                    ) : (
                      <input
                        {...register("firstName")}
                        placeholder="First name"
                        className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#556ee6] focus:ring-2 focus:ring-[#556ee6]/20"
                      />
                    )}
                    {errors.firstName && (
                      <p className="text-xs text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#374151]">
                      Last Name
                    </label>
                    {isLoading ? (
                      <div className="h-11 w-full animate-pulse rounded-xl bg-[#f3f4f6]" />
                    ) : (
                      <input
                        {...register("lastName")}
                        placeholder="Last name"
                        className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#556ee6] focus:ring-2 focus:ring-[#556ee6]/20"
                      />
                    )}
                    {errors.lastName && (
                      <p className="text-xs text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>

                  {/* Email — read only */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#374151]">
                      Email Address
                    </label>
                    {isLoading ? (
                      <div className="h-11 w-full animate-pulse rounded-xl bg-[#f3f4f6]" />
                    ) : (
                      <input
                        type="email"
                        value={profile?.email ?? ""}
                        readOnly
                        className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-sm text-[#6b7280] outline-none cursor-not-allowed"
                      />
                    )}
                    <p className="text-xs text-[#9ca3af]">Email cannot be changed here.</p>
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-[#374151]">
                      Mobile Number
                    </label>
                    {isLoading ? (
                      <div className="h-11 w-full animate-pulse rounded-xl bg-[#f3f4f6]" />
                    ) : (
                      <input
                        type="tel"
                        {...register("mobileNo")}
                        placeholder="9876543210"
                        className="w-full rounded-xl border border-[#e5e7eb] px-4 py-3 text-sm text-[#1f2937] outline-none transition focus:border-[#556ee6] focus:ring-2 focus:ring-[#556ee6]/20"
                      />
                    )}
                    {errors.mobileNo && (
                      <p className="text-xs text-red-500">{errors.mobileNo.message}</p>
                    )}
                  </div>
                </div>

                {/* Save */}
                <div className="flex justify-end border-t border-[#f3f4f6] px-6 py-4">
                  <button
                    type="submit"
                    disabled={isSaving || !isDirty || isLoading}
                    className="flex items-center gap-2 rounded-xl bg-[#556ee6] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4d63cf] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        <span>Saving…</span>
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
