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
    <main className="h-screen bg-[#f5f7fb] p-4 md:p-6">
      <section className="mx-auto h-full grid w-full items-stretch gap-4 lg:grid-cols-2 lg:gap-8">

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

        <div className="w-full rounded-2xl border bg-white">
          <div className="p-4 sm:p-5">
            <Image
              src="/assets/Logo.png"
              alt="Company logo"
              width={120}
              height={50}
              priority
              className="h-auto w-[120px]"
            />
          </div>  

          <div className="px-4 py-8 sm:px-8 mt-10 sm:py-10">
            <div className="mx-auto w-full max-w-md">
              <h2 className="text-2xl font-semibold text-[#2b2e35] sm:text-3xl">
                Login
              </h2>
              <p className="mt-2 text-sm text-[#787f8f]">
                Welcome back! Please enter your credentials.
              </p>

              <form
                className="mt-8 space-y-5"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-[#2b2e35]"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-[#d7deea] px-4 py-3 text-sm text-[#2b2e35] outline-none transition focus:border-[#3d84f5]"
                  />
                  {errors.email ? (
                    <p className="mt-1 text-xs text-[#db3e3e]">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-[#2b2e35]"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-lg border border-[#d7deea] py-3 pl-4 pr-12 text-sm text-[#2b2e35] outline-none transition focus:border-[#3d84f5]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#787f8f] outline-none transition hover:bg-[#f0f3f9] hover:text-[#2b2e35] focus-visible:ring-2 focus-visible:ring-[#3d84f5]/40"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" strokeWidth={1.75} />
                      ) : (
                        <Eye className="size-5" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="mt-1 text-xs text-[#db3e3e]">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-[#3d84f5] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                {errors.root?.message ? (
                  <p className="text-sm text-red-600">{errors.root.message}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer rounded-lg bg-[#3d84f5] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3579e1] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}