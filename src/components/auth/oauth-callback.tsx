"use client";

import { Hub } from "aws-amplify/utils";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getClientAuthUser } from "@/lib/auth/client";
import { getAuthErrorMessage } from "@/lib/auth/errors";

export function OAuthCallback() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const finish = () => {
      if (!active) return;
      router.replace("/dashboard");
      router.refresh();
    };

    const cancel = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signInWithRedirect") {
        finish();
      }

      if (payload.event === "signInWithRedirect_failure" && active) {
        setError("Google sign-in could not be completed. Please try again.");
      }
    });

    getClientAuthUser().then(finish).catch((callbackError) => {
      const queryError = new URLSearchParams(window.location.search).get(
        "error_description",
      );

      if (queryError && active) {
        setError(queryError);
      } else if (
        callbackError instanceof Error &&
        callbackError.message.startsWith("Authentication is not configured") &&
        active
      ) {
        setError(getAuthErrorMessage(callbackError));
      }
    });

    const timeoutId = window.setTimeout(() => {
      if (active) {
        setError(
          "Google sign-in took too long to complete. Please return to sign in and try again.",
        );
      }
    }, 15000);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
      cancel();
    };
  }, [router]);

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Sign-in was not completed
        </h1>
        <p role="alert" className="mt-3 type-body-sm text-red-700">
          {error}
        </p>
        <a
          href="/login"
          className="mt-6 inline-block text-sm font-bold text-primary"
        >
          Return to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="text-center" aria-live="polite">
      <LoaderCircle className="mx-auto size-8 animate-spin text-primary" />
      <h1 className="mt-4 text-xl font-bold">Completing sign-in…</h1>
      <p className="mt-2 type-body-sm text-muted">
        You will be redirected automatically.
      </p>
    </div>
  );
}
