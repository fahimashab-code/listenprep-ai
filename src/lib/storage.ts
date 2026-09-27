"use client";

import type { TestAttempt } from "@/types/listening";

const ATTEMPT_PREFIX = "listenly-attempt:";

type StoredAttempt = TestAttempt & { pendingSync?: boolean };

export function saveAttempt(attempt: TestAttempt, pendingSync = false) {
  try {
    localStorage.setItem(`${ATTEMPT_PREFIX}${attempt.id}`, JSON.stringify({ ...attempt, pendingSync }));
  } catch {
    // Browser storage can be unavailable; API-backed saving must still work.
  }
}

export function loadAttempt(attemptId: string): StoredAttempt | null {
  try {
    const value = localStorage.getItem(`${ATTEMPT_PREFIX}${attemptId}`);
    if (!value) return null;
    const attempt = JSON.parse(value) as StoredAttempt;
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

export function restoreAttempt<T extends TestAttempt>(serverAttempt: T): T {
  const local = loadAttempt(serverAttempt.id);
  if (
    serverAttempt.status !== "completed" && local?.pendingSync &&
    local.status !== "completed" && local.userId === serverAttempt.userId &&
    local.testId === serverAttempt.testId
  ) {
    return { ...serverAttempt, ...local };
  }
  saveAttempt(serverAttempt);
  return serverAttempt;
}

export function acknowledgeAttempt(attempt: TestAttempt) {
  const local = loadAttempt(attempt.id);
  // An older request must not mark a newer local edit as synchronized.
  if (local && JSON.stringify({ ...local, pendingSync: false }) ===
    JSON.stringify({ ...attempt, pendingSync: false })) {
    saveAttempt(local);
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
