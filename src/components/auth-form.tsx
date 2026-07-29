"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { authEnv } from "@/lib/auth/env";
import {
  loginUser,
  loginWithGoogle,
  registerUser,
} from "@/lib/auth/client";
import { getAuthErrorMessage } from "@/lib/auth/errors";
import { safeRedirectPath } from "@/lib/auth/routes";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

const registerSchema = loginSchema
  .extend({
    name: z.string().trim().min(2, "Enter your name."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type AuthValues = {
  name?: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export function AuthForm({
  mode,
  nextPath,
}: {
  mode: "login" | "register";
  nextPath?: string;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const schema = mode === "register" ? registerSchema : loginSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  async function onSubmit(values: AuthValues) {
    setFormError("");

    try {
      if (mode === "register") {
        const nextStep = await registerUser({
          name: values.name ?? "",
          email: values.email,
          password: values.password,
        });

        if (nextStep === "CONFIRM_SIGN_UP") {
          router.push(
            `/confirm-signup?email=${encodeURIComponent(values.email)}`,
          );
          return;
        }

        router.replace("/login");
        return;
      }

      const result = await loginUser(values.email, values.password);
      if (result.status === "signed-in") {
        router.replace(safeRedirectPath(nextPath));
        router.refresh();
      } else if (result.status === "confirm-sign-up") {
        router.push(
          `/confirm-signup?email=${encodeURIComponent(result.email)}`,
        );
      } else if (result.status === "reset-password") {
        router.push(
          `/forgot-password?email=${encodeURIComponent(result.email)}`,
        );
      } else {
        setFormError(result.message);
      }
    } catch (error) {
      if (
        mode === "login" &&
        error instanceof Error &&
        error.name === "UserNotConfirmedException"
      ) {
        router.push(
          `/confirm-signup?email=${encodeURIComponent(values.email)}`,
        );
        return;
      }

      if (
        mode === "login" &&
        error instanceof Error &&
        error.name === "PasswordResetRequiredException"
      ) {
        router.push(
          `/forgot-password?email=${encodeURIComponent(values.email)}`,
        );
        return;
      }

      setFormError(getAuthErrorMessage(error));
    }
  }

  async function handleGoogleLogin() {
    setFormError("");
    setGoogleLoading(true);

    try {
      await loginWithGoogle();
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
      setGoogleLoading(false);
    }
  }

  const fieldClass =
    "mt-1.5 h-11 w-full rounded-lg border border-[#cfd8d1] bg-white px-3 text-base leading-6 outline-none placeholder:text-subtle focus:border-primary focus:ring-3 focus:ring-green-100";

  return (
    <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {formError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {formError}
        </div>
      )}
      {mode === "register" && (
        <label className="block text-sm font-semibold">
          Full name
          <input
            className={fieldClass}
            autoComplete="name"
            placeholder="Your full name"
            {...register("name")}
          />
          {errors.name && (
            <span className="mt-1 block text-xs font-normal text-red-600">
              {errors.name.message}
            </span>
          )}
        </label>
      )}
      <label className="block text-sm font-semibold">
        Email
        <input
          className={fieldClass}
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          {...register("email")}
        />
        {errors.email && (
          <span className="mt-1 block text-xs font-normal text-red-600">
            {errors.email.message}
          </span>
        )}
      </label>
      <label className="block text-sm font-semibold">
        Password
        <div className="relative">
          <input
            className={`${fieldClass} pr-11`}
            type={showPassword ? "text" : "password"}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            placeholder="At least 8 characters"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-1 top-2 grid size-9 place-items-center rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <span className="mt-1 block text-xs font-normal text-red-600">
            {errors.password.message}
          </span>
        )}
      </label>
      {mode === "register" && (
        <label className="block text-sm font-semibold">
          Confirm password
          <input
            className={fieldClass}
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <span className="mt-1 block text-xs font-normal text-red-600">
              {errors.confirmPassword.message}
            </span>
          )}
        </label>
      )}
      {mode === "login" && (
        <div className="text-right">
          <a
            href="/forgot-password"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Forgot password?
          </a>
        </div>
      )}
      <Button
        className="w-full"
        size="lg"
        disabled={isSubmitting || googleLoading}
      >
        {isSubmitting
          ? "Please wait…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
        {!isSubmitting && <ArrowRight className="size-4" />}
      </Button>
      {authEnv.googleEnabled && (
        <>
          <div className="flex items-center gap-3 py-1 text-xs text-subtle">
            <span className="h-px flex-1 bg-[#e0e5e1]" />
            or
            <span className="h-px flex-1 bg-[#e0e5e1]" />
          </div>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            size="lg"
            disabled={isSubmitting || googleLoading}
            onClick={handleGoogleLogin}
          >
            <span className="font-bold text-blue-600">G</span>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </Button>
        </>
      )}
    </form>
  );
}
