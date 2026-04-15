"use client";

import { use, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { ChevronRight, Eye, EyeOff, Loader2, Save } from "lucide-react";

import { Switch } from "@/components/ui/switch";

import { useUpdateAccountManager } from "@/hooks/use-update-account-manager";
import {
  editAccountManagerSchema,
  type EditAccountManagerFormValues,
} from "@/lib/schemas/account-manager";

// ─── Shared sub-components (identical to create page) ────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-[#3a4050]">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

function TextInput({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#3a4050] outline-none placeholder:text-[#9ca3af] transition focus:ring-1 ${
        error
          ? "border-red-400 focus:border-red-400 focus:ring-red-200"
          : "border-[#e5e7eb] focus:border-[#556ee6] focus:ring-[#556ee6]/20"
      }`}
    />
  );
}

function PasswordLikeInput({
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        {...props}
        type={show ? "text" : "password"}
        className={`w-full rounded-lg border bg-white py-2.5 pl-3.5 pr-10 text-sm text-[#3a4050] outline-none placeholder:text-[#9ca3af] transition focus:ring-1 ${
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-200"
            : "border-[#e5e7eb] focus:border-[#556ee6] focus:ring-[#556ee6]/20"
        }`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] transition hover:text-[#556ee6]"
        aria-label={show ? "Hide" : "Show"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white shadow-sm">
      <div className="border-b border-[#eef2f8] px-6 py-4">
        <h2 className="text-sm font-semibold text-[#3a4050]">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditAccountManagerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate, isPending, isError, error } = useUpdateAccountManager();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<EditAccountManagerFormValues>({
    resolver: standardSchemaResolver(editAccountManagerSchema),
    mode: "onTouched",
  });

  // Pre-fill form from query params passed by the list page
  useEffect(() => {
    const rawStatus = searchParams.get("status");
    reset({
      firstName: searchParams.get("firstName") ?? "",
      lastName: searchParams.get("lastName") ?? "",
      email: searchParams.get("email") ?? "",
      mobileNo: searchParams.get("mobileNo") ?? "",
      status: rawStatus === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    });
  }, [reset, searchParams]);

  function onSubmit(values: EditAccountManagerFormValues) {
    mutate(
      { id, payload: values },
      { onSuccess: () => router.push("/admin/account-managers") }
    );
  }

  return (
    <main className="p-4 sm:p-6 md:p-8">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-sm text-[#8a92a6]">
        <Link
          href="/admin/account-managers"
          className="transition hover:text-[#556ee6]"
        >
          Account Managers
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-[#3a4050]">Edit</span>
      </nav>

      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf1ff]">
          <Save size={20} className="text-[#556ee6]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#3a4050]">
            Edit Account Manager
          </h1>
          <p className="text-sm text-[#8a92a6]">
            Update the account manager&apos;s details below.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          {/* ── Left / main column ── */}
          <div className="flex flex-col gap-5 xl:col-span-2">
            <SectionCard title="Personal Information">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="First Name"
                  required
                  error={errors.firstName?.message}
                >
                  <TextInput
                    placeholder="Enter first name"
                    error={!!errors.firstName}
                    {...register("firstName")}
                  />
                </Field>

                <Field
                  label="Last Name"
                  required
                  error={errors.lastName?.message}
                >
                  <TextInput
                    placeholder="Enter last name"
                    error={!!errors.lastName}
                    {...register("lastName")}
                  />
                </Field>

                <Field
                  label="Email Address"
                  required
                  error={errors.email?.message}
                >
                  <TextInput
                    type="email"
                    placeholder="Enter email address"
                    error={!!errors.email}
                    {...register("email")}
                  />
                </Field>

                <Field
                  label="Mobile Number"
                  required
                  error={errors.mobileNo?.message}
                >
                  <TextInput
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    error={!!errors.mobileNo}
                    {...register("mobileNo")}
                  />
                </Field>
              </div>
            </SectionCard>

            {/* API error */}
            {isError && (
              <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error instanceof Error
                  ? error.message
                  : "Something went wrong. Please try again."}
              </p>
            )}

            {/* Desktop submit */}
            <div className="hidden justify-end xl:flex">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-[#556ee6] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#4a5fd4] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>

          {/* ── Right / status column ── */}
          <div className="flex flex-col gap-4">
            <SectionCard title="Status">
              <Controller
                name="status"
                control={control}
                render={({ field }) => {
                  const isActive = field.value === "ACTIVE";
                  return (
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#3a4050]">
                          Account Status
                        </p>
                        <p className="text-xs text-[#8a92a6]">
                          {isActive
                            ? "Active — can log in"
                            : "Inactive — cannot log in"}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 flex-col items-center gap-1">
                        <Switch
                          checked={isActive}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? "ACTIVE" : "INACTIVE")
                          }
                        />
                        <span
                          className={`text-xs font-medium ${
                            isActive ? "text-green-600" : "text-[#8a92a6]"
                          }`}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
            </SectionCard>

            {/* Mobile submit */}
            <div className="flex justify-end xl:hidden">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-[#556ee6] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#4a5fd4] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>Save Changes</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
