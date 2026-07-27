"use client";

import type { TestAttempt } from "@/types/listening";

const ATTEMPT_PREFIX = "listenly-attempt:";

export function saveAttempt(attempt: TestAttempt) {
  localStorage.setItem(`${ATTEMPT_PREFIX}${attempt.id}`, JSON.stringify(attempt));
}

export function loadAttempt(attemptId: string): TestAttempt | null {
  const value = localStorage.getItem(`${ATTEMPT_PREFIX}${attemptId}`);
  if (!value) return null;
  try {
    const attempt = JSON.parse(value) as TestAttempt;
    return {
      ...attempt,
      phase:
        attempt.phase ??
        (attempt.status === "final_review"
          ? "final_review"
          : attempt.status === "completed"
            ? "submitted"
            : "part_playing"),
      markedForReview: attempt.markedForReview ?? [],
    };
  } catch {
    return null;
  }
}

export function loadAttempts() {
  const attempts: TestAttempt[] = [];

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key?.startsWith(ATTEMPT_PREFIX)) continue;
    const attempt = loadAttempt(key.slice(ATTEMPT_PREFIX.length));
    if (attempt) attempts.push(attempt);
  }

  return attempts;
}

export function loadActiveAttempt() {
  return (
    loadAttempts()
      .filter(
        (attempt) =>
          attempt.status === "in_progress" ||
          attempt.status === "final_review",
      )
      .sort(
        (a, b) =>
          new Date(b.startedAt ?? 0).getTime() -
          new Date(a.startedAt ?? 0).getTime(),
      )[0] ?? null
  );
}

export function clearAttempt(attemptId: string) {
  localStorage.removeItem(`${ATTEMPT_PREFIX}${attemptId}`);
}
