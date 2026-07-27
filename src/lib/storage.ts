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
    return JSON.parse(value) as TestAttempt;
  } catch {
    return null;
  }
}

export function clearAttempt(attemptId: string) {
  localStorage.removeItem(`${ATTEMPT_PREFIX}${attemptId}`);
}
