"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { beginPasswordReset } from "@/lib/auth/client";
import { getAuthErrorMessage } from "@/lib/auth/errors";

export function ForgotPasswordForm({
  initialEmail,
}: {
  initialEmail: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await beginPasswordReset(email);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (resetError) {
      if (
        resetError instanceof Error &&
        resetError.name === "UserNotFoundException"
      ) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setError(getAuthErrorMessage(resetError));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="mt-7" onSubmit={handleSubmit}>
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-danger-border bg-danger-soft px-3 py-2.5 text-sm text-danger"
        >
          {error}
        </div>
      )}
      <label className="block text-sm font-semibold">
        Email
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-lg border border-border bg-surface px-3 text-base leading-6 text-ink outline-none placeholder:text-subtle focus:border-primary focus:ring-3 focus:ring-primary/15"
          placeholder="you@example.com"
        />
      </label>
      <Button className="mt-5 w-full" size="lg" disabled={submitting}>
        {submitting ? "Sending…" : "Send reset code"}
      </Button>
    </form>
  );
}
