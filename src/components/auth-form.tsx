"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const registerSchema = loginSchema
  .extend({
    name: z.string().min(2, "Enter your name."),
    confirmPassword: z.string().min(6),
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

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const schema = mode === "register" ? registerSchema : loginSchema;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit() {
    await new Promise((resolve) => setTimeout(resolve, 400));
    localStorage.setItem("listenly-demo-auth", "true");
    router.push("/dashboard");
  }

  function demoLogin() {
    localStorage.setItem("listenly-demo-auth", "true");
    router.push("/dashboard");
  }

  const fieldClass =
    "mt-1.5 h-11 w-full rounded-lg border border-[#cfd8d1] bg-white px-3 text-sm outline-none placeholder:text-[#98a29b] focus:border-[#176b3a] focus:ring-3 focus:ring-green-100";

  return (
    <form className="mt-7 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {mode === "register" && (
        <label className="block text-sm font-semibold">
          Name
          <input
            className={fieldClass}
            autoComplete="name"
            placeholder="Alex Morgan"
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
            placeholder="At least 6 characters"
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
            className="text-sm font-semibold text-[#176b3a] hover:underline"
          >
            Forgot password?
          </a>
        </div>
      )}
      <Button className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting
          ? "Please wait…"
          : mode === "login"
            ? "Sign in"
            : "Create account"}
        {!isSubmitting && <ArrowRight className="size-4" />}
      </Button>
      <div className="flex items-center gap-3 py-1 text-xs text-[#89938c]">
        <span className="h-px flex-1 bg-[#e0e5e1]" />
        or
        <span className="h-px flex-1 bg-[#e0e5e1]" />
      </div>
      <Button type="button" variant="secondary" className="w-full" size="lg">
        <span className="font-bold text-blue-600">G</span> Continue with Google
      </Button>
      <button
        type="button"
        onClick={demoLogin}
        className="w-full rounded-lg py-2 text-sm font-bold text-[#176b3a] hover:bg-[#edf6ef]"
      >
        Continue with demo account
      </button>
    </form>
  );
}
