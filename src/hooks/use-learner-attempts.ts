"use client";

import { useEffect, useState } from "react";
import { learnerAttemptService } from "@/lib/api/listenly-service";
import { loadAttempts } from "@/lib/storage";
import type { TestAttempt } from "@/types/listening";

export function useLearnerAttempts() {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const frame = window.requestAnimationFrame(() => {
      if (active) setAttempts(loadAttempts());
    });

    learnerAttemptService
      .list()
      .then((items) => {
        if (!active) return;
        if (items.length > 0) setAttempts(items);
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
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return { attempts, loading, error };
}
