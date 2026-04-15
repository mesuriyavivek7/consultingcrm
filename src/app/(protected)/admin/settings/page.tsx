"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { Settings, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAdminSettings, useUpdateAdminSettings } from "@/hooks/use-admin-settings";

// ─── Schema ───────────────────────────────────────────────────────────────────

const settingsSchema = z.object({
  dailyCallTarget: z
    .number({ error: "Please enter a valid number" })
    .int("Must be a whole number")
    .min(1, "Daily target must be at least 1")
    .max(10000, "Daily target cannot exceed 10,000"),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

// ─── Section card ─────────────────────────────────────────────────────────────

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white shadow-sm">
      <div className="border-b border-[#eef2f8] px-6 py-4">
        <h2 className="text-sm font-semibold text-[#3a4050]">{title}</h2>
        {description && (
          <p className="mt-0.5 text-xs text-[#8a92a6]">{description}</p>
        )}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-4 w-40 rounded bg-gray-200" />
        <div className="h-10 w-full max-w-xs rounded-lg bg-gray-200" />
        <div className="mt-2 h-3 w-64 rounded bg-gray-100" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  const { data: settings, isLoading, isError, error: fetchError } = useAdminSettings();
  const { mutate, isPending } = useUpdateAdminSettings();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsFormValues>({
    resolver: standardSchemaResolver(settingsSchema),
    mode: "onTouched",
  });

  // Populate form once data is loaded
  useEffect(() => {
    if (settings) {
      reset({ dailyCallTarget: settings.dailyCallTarget });
    }
  }, [settings, reset]);

  function onSubmit(values: SettingsFormValues) {
    mutate(
      { dailyCallTarget: values.dailyCallTarget },
      {
        onSuccess: (updated) => {
          reset({ dailyCallTarget: updated.dailyCallTarget });
          toast.success("Settings saved successfully.", {
            description: `Daily call target updated to ${updated.dailyCallTarget.toLocaleString()}.`,
          });
        },
        onError: (err) => {
          toast.error("Failed to save settings.", {
            description:
              err instanceof Error ? err.message : "Please try again.",
          });
        },
      }
    );
  }

  return (
    <main className="p-4 sm:p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf1ff]">
          <Settings size={20} className="text-[#556ee6]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-[#3a4050]">Settings</h1>
          <p className="text-sm text-[#8a92a6]">
            Manage system-wide configuration for your CRM.
          </p>
        </div>
      </div>

      {/* Fetch error */}
      {isError && (
        <div className="mb-5 rounded-xl bg-red-50 px-5 py-4 text-sm text-red-600">
          {fetchError instanceof Error
            ? fetchError.message
            : "Failed to load settings."}
        </div>
      )}

      {/* Skeleton while loading */}
      {isLoading && <PageSkeleton />}

      {/* Form */}
      {!isLoading && !isError && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {/* ── Left / main column ── */}
            <div className="flex flex-col gap-5 xl:col-span-2">
              <SectionCard
                title="Call Targets"
                description="Set the expected number of calls per day across all account managers."
              >
                <div className="flex flex-col gap-4">
                  {/* Daily call target */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-[#3a4050]">
                      Daily Call Target
                      <span className="ml-0.5 text-red-500">*</span>
                    </label>

                    <div className="flex items-center gap-3">
                      {/* Icon prefix */}
                      <div className="relative flex-1 max-w-xs">
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]">
                          <Phone size={15} />
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={10000}
                          placeholder="e.g. 250"
                          {...register("dailyCallTarget", { valueAsNumber: true })}
                          className={`w-full rounded-lg border bg-white py-2.5 pl-9 pr-3.5 text-sm text-[#3a4050] outline-none placeholder:text-[#9ca3af] transition focus:ring-1 ${
                            errors.dailyCallTarget
                              ? "border-red-400 focus:border-red-400 focus:ring-red-200"
                              : "border-[#e5e7eb] focus:border-[#556ee6] focus:ring-[#556ee6]/20"
                          }`}
                        />
                      </div>

                      {/* Current value chip */}
                      {settings && (
                        <span className="flex-shrink-0 rounded-lg bg-[#f1f5f9] px-3 py-2 text-xs text-[#6b7280]">
                          Current:{" "}
                          <span className="font-semibold text-[#3a4050]">
                            {settings.dailyCallTarget.toLocaleString()}
                          </span>
                        </span>
                      )}
                    </div>

                    {errors.dailyCallTarget && (
                      <p className="text-xs text-red-500">
                        {errors.dailyCallTarget.message}
                      </p>
                    )}

                    <p className="text-xs text-[#8a92a6]">
                      This target is used across all dashboards and progress
                      indicators. Min: 1 · Max: 10,000.
                    </p>
                  </div>
                </div>
              </SectionCard>

            </div>

            {/* ── Right / save column ── */}
            <div className="flex flex-col gap-4">
              <SectionCard title="Save Changes">
                <p className="mb-4 text-xs text-[#8a92a6]">
                  Changes take effect immediately across all dashboards and
                  progress rings.
                </p>
                <button
                  type="submit"
                  disabled={isPending || !isDirty}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#556ee6] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#4a5fd4] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving…</span>
                    </>
                  ) : (
                    <span>Save Settings</span>
                  )}
                </button>
              </SectionCard>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}
