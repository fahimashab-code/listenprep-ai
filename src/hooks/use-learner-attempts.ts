"use client";

import { useEffect, useState } from "react";
import { learnerAttemptService } from "@/lib/api/listenly-service";
import type { TestAttempt } from "@/types/listening";

export function useLearnerAttempts() {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    learnerAttemptService
      .list()
      .then((items) => {
        if (!active) return;
        setAttempts(items);
        setError("");
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setError(
          reason instanceof Error
            ? reason.message
            : "Your saved attempts could not be loaded.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { attempts, loading, error };
}
