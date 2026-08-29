"use client";

import { authenticatedFetch } from "@/lib/api/authenticated-fetch";
import type {
  AttemptWithReview,
  ListeningTest,
  PublishedTestSummary,
  TestAttempt,
} from "@/types/listening";

const apiUrl = process.env.NEXT_PUBLIC_LISTENLY_API_URL?.replace(/\/$/, "");

function normalizeTest(test: ListeningTest): ListeningTest {
  return {
    ...test,
    parts: test.parts.map((part) => ({
      ...part,
      questions: part.questions.map((question) => ({
        ...question,
        acceptedAnswers: question.acceptedAnswers ?? [],
        skillTags: question.skillTags ?? [],
      })),
    })),
  };
}

async function apiRequest<T>(path: string, init: RequestInit = {}) {
  if (!apiUrl) throw new Error("The Listenly API is not configured.");
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  const response = await authenticatedFetch(`${apiUrl}${path}`, {
    ...init,
    headers,
  });
  const body = (await response.json().catch(() => ({}))) as T & {
    message?: string;
  };
  if (!response.ok) {
    throw new Error(body.message || "Listenly could not complete this request.");
  }
  return body;
}

export const learnerTestService = {
  async list(): Promise<PublishedTestSummary[]> {
    const result = await apiRequest<{ items: PublishedTestSummary[] }>("/tests");
    return result.items;
  },

  async get(testId: string): Promise<ListeningTest | undefined> {
    try {
      return normalizeTest(await apiRequest<ListeningTest>(`/tests/${testId}`));
    } catch (error) {
      if (error instanceof Error && error.message.includes("not available")) {
        return undefined;
      }
      throw error;
    }
  },
};

export const learnerAttemptService = {
  async list(): Promise<TestAttempt[]> {
    const result = await apiRequest<{ items: TestAttempt[] }>("/attempts");
    return result.items;
  },

  async create(testId: string, mode: "mock" | "practice") {
    return apiRequest<TestAttempt>("/attempts", {
      method: "POST",
      body: JSON.stringify({ testId, mode }),
    });
  },

  async get(attemptId: string): Promise<AttemptWithReview> {
    return apiRequest<AttemptWithReview>(`/attempts/${attemptId}`);
  },

  async save(attempt: TestAttempt): Promise<TestAttempt> {
    return apiRequest<TestAttempt>(`/attempts/${attempt.id}`, {
      method: "PUT",
      body: JSON.stringify({
        answers: attempt.answers,
        markedForReview: attempt.markedForReview,
        currentPart: attempt.currentPart,
        phase: attempt.phase,
        reviewEndsAt: attempt.reviewEndsAt,
      }),
    });
  },

  async submit(attempt: TestAttempt): Promise<AttemptWithReview> {
    return apiRequest<AttemptWithReview>(`/attempts/${attempt.id}/submit`, {
      method: "POST",
    });
  },
};
