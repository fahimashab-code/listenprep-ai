"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  confirmUserRegistration,
  resendRegistrationCode,
} from "@/lib/auth/client";
import { getAuthErrorMessage } from "@/lib/auth/errors";

export function ConfirmSignupForm({ initialEmail }: { initialEmail: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const fieldClass =
    "mt-1.5 h-11 w-full rounded-lg border border-[#cfd8d1] bg-white px-3 text-base leading-6 outline-none placeholder:text-subtle focus:border-primary focus:ring-3 focus:ring-green-100";

  async function handleConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");
    setSubmitting(true);

    try {
      const result = await confirmUserRegistration(email, code);
      if (result.isSignUpComplete) {
        router.replace("/login?confirmed=true");
      } else {
        setError("Another confirmation step is required. Please try again.");
      }
    } catch (confirmationError) {
      setError(getAuthErrorMessage(confirmationError));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError("");
    setNotice("");
    setResending(true);

    try {
      await resendRegistrationCode(email);
      setNotice("A new confirmation code has been sent.");
    } catch (resendError) {
      setError(getAuthErrorMessage(resendError));
    } finally {
      setResending(false);
    }
  }

  return (
    <form className="mt-7 space-y-4" onSubmit={handleConfirm}>
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
        >
          {error}
        </div>
      )}
      {notice && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800"
        >
          {notice}
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
        Confirmation code
        <input
          className={fieldClass}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Enter the code"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          required
        />
      </label>
      <Button className="w-full" size="lg" disabled={submitting || resending}>
        {submitting ? "Confirming…" : "Confirm email"}
      </Button>
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        disabled={submitting || resending || !email}
        onClick={handleResend}
      >
        {resending ? "Sending…" : "Resend confirmation code"}
      </Button>
    </form>
  );
}
