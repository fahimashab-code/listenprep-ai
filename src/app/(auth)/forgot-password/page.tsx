"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  return (
    <Card className="p-6 shadow-[0_16px_45px_rgba(23,32,26,0.07)] sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
      <p className="mt-2 type-body-sm text-muted">
        This is a frontend demo. Enter an email to preview the reset state.
      </p>
      {sent ? (
        <div className="mt-7 rounded-xl border border-green-200 bg-green-50 p-5">
          <h2 className="font-bold text-green-900">Check your email</h2>
          <p className="mt-1 type-body-sm text-green-800">
            If an account exists, a reset link has been sent. No real email was
            sent in this demo.
          </p>
        </div>
      ) : (
        <form
          className="mt-7"
          onSubmit={(event) => {
            event.preventDefault();
            setSent(true);
          }}
        >
          <label className="block text-sm font-semibold">
            Email
            <input
              required
              type="email"
              className="mt-1.5 h-11 w-full rounded-lg border bg-white px-3 text-base leading-6 outline-none focus:border-primary focus:ring-3 focus:ring-green-100"
              placeholder="you@example.com"
            />
          </label>
          <Button className="mt-5 w-full" size="lg">
            Send reset link
          </Button>
        </form>
      )}
      <a
        href="/login"
        className="mt-5 block text-center text-sm font-bold text-primary"
      >
        Back to sign in
      </a>
    </Card>
  );
}
