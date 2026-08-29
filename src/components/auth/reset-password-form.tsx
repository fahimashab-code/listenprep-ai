"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { finishPasswordReset } from "@/lib/auth/client";
import { getAuthErrorMessage } from "@/lib/auth/errors";

export function ResetPasswordForm({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fieldClass =
    "mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3 text-base leading-6 text-ink outline-none placeholder:text-subtle focus:border-primary focus:ring-3 focus:ring-primary/15";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await finishPasswordReset(email, code, password);
      router.replace("/login?reset=true");
    } catch (resetError) {
      setError(getAuthErrorMessage(resetError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-danger-border bg-danger-soft px-3 py-2.5 text-sm text-danger"
        >
          {error}
        </div>
      )}
      <label className="block text-sm font-semibold">
        Email
        <input
          className={fieldClass}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm font-semibold">
        Reset code
        <input
          className={fieldClass}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm font-semibold">
        New password
        <input
          className={fieldClass}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm font-semibold">
        Confirm new password
        <input
          className={fieldClass}
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />
      </label>
      <Button className="w-full" size="lg" disabled={submitting}>
        {submitting ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
