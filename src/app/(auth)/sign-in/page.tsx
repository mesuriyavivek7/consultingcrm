"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginSchema, type LoginFormValues } from "@/lib/schemas/auth";

const ADMIN_DASHBOARD_PATH = "/admin/dashboard";
const ACCOUNT_DASHBOARD_PATH = "/account/dashboard";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    const response = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: ACCOUNT_DASHBOARD_PATH,
    });

    if (response?.error) {
      const message =
        response.error === "CredentialsSignin"
          ? "Invalid email or password."
          : response.error;
      setError("root", { message });
      return;
    }

    const session = await getSession();
    const role = session?.user?.role?.toUpperCase();

    if (role === "ADMIN") {
      router.push(ADMIN_DASHBOARD_PATH);
      return;
    }

    router.push(ACCOUNT_DASHBOARD_PATH);
  };

  return (
    <main className="min-h-screen bg-white lg:bg-[#f5f7fb] lg:p-4 xl:p-6">
      <section className="mx-auto min-h-screen grid w-full items-stretch gap-4 lg:min-h-0 lg:h-screen lg:grid-cols-2 lg:gap-8">

        <div
          className="relative hidden flex-col justify-between rounded-2xl p-8 text-white lg:flex"
          style={{
            background:
              "radial-gradient(circle at center, var(--auth-gradient-inside) 0%, var(--auth-gradient-outside) 75%)",
          }}
        >
          <div className="mx-auto mt-10 max-w-md text-center">
            <h1 className="text-4xl font-semibold leading-tight">
              Turn Every Call into an Opportunity
            </h1>
            <p className="mt-3 text-base text-white/80">
              Elevate your team with intelligent control.
            </p>
          </div>
          <div className="relative mx-auto mb-6 w-full max-w-xl">
            <Image
              src="/assets/dashboard.png"
              alt="Dashboard preview"
              width={840}
              height={520}
              priority
              className="h-auto w-full rounded-2xl object-contain"
            />
          </div>
        </div>

        {/* Form panel */}
        <div className="flex w-full flex-col rounded-2xl bg-white lg:border">
          {/* Logo */}
          <div className="flex justify-center p-8 pb-0 lg:justify-start lg:p-6 lg:pb-0">
            <Image
              src="/assets/Logo.png"
              alt="Company logo"
              width={140}
              height={55}
              priority
              className="h-auto w-[140px] lg:w-[120px]"
            />
          </div>

          {/* Form content */}
          <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
            <div className="w-full max-w-sm">
              {/* Heading */}
              <h2 className="md:text-left text-center font-bold leading-tight text-[#1a1d23] text-4xl">
                Login to your
                <br />
                account.
              </h2>
              <p className="mt-3 text-center md:text-left text-sm text-[#9196a0]">
                Hello, welcome back to your account
              </p>

              <form
                className="mt-10 space-y-5"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                {/* Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[#2b2e35]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="example@email.com"
                    className="w-full rounded-xl border border-[#d7deea] px-4 py-3.5 text-sm text-[#2b2e35] outline-none transition focus:border-[#556ee6] focus:ring-2 focus:ring-[#556ee6]/20"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#2b2e35]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Your Password"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-[#d7deea] py-3.5 pl-4 pr-12 text-sm text-[#2b2e35] outline-none transition focus:border-[#556ee6] focus:ring-2 focus:ring-[#556ee6]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af] transition hover:text-[#2b2e35]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" strokeWidth={1.75} />
                      ) : (
                        <Eye className="size-5" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {/* Forgot password */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-[#556ee6] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Root error */}
                {errors.root?.message && (
                  <p className="text-sm text-red-600">
                    {errors.root.message}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-[#556ee6] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#4a5fd4] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Logging in…" : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}