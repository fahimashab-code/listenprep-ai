"use client";

import { authenticatedFetch } from "@/lib/api/authenticated-fetch";
import type {
  AttemptWithReview,
  ListeningTest,
  PublishedTestSummary,
  TestAttempt,
} from "@/types/listening";

const apiUrl = process.env.NEXT_PUBLIC_LISTENLY_API_URL?.replace(/\/$/, "");

class ApiError extends Error {
  constructor(message: string, readonly status: number, readonly requestId?: string) {
    super(message);
  }
}

function normalizeAttempt(attempt: AttemptWithReview): AttemptWithReview {
  return attempt.reviewTest
    ? { ...attempt, reviewTest: normalizeTest(attempt.reviewTest) }
    : attempt;
}

// Keep autosaves and submission in order, even on a slow connection.
const pendingWrites = new Map<string, Promise<unknown>>();
const knownRevisions = new Map<string, number>();

function queueWrite<T>(attemptId: string, write: () => Promise<T>): Promise<T> {
  const previous = pendingWrites.get(attemptId) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(write);
  pendingWrites.set(attemptId, next);
  const cleanup = () => {
    if (pendingWrites.get(attemptId) === next) pendingWrites.delete(attemptId);
  };
  void next.then(cleanup, cleanup);
  return next;
}

function writeAttempt(attempt: TestAttempt) {
  const expectedRevision = knownRevisions.get(attempt.id) ?? attempt.revision ?? 0;
  return apiRequest<TestAttempt>(`/attempts/${attempt.id}`, {
    method: "PUT",
    body: JSON.stringify({
      answers: attempt.answers,
      markedForReview: attempt.markedForReview,
      currentPart: attempt.currentPart,
      phase: attempt.phase,
      reviewEndsAt: attempt.reviewEndsAt,
      expectedRevision,
      playbackPositions: attempt.playbackPositions,
      interruptionCount: attempt.interruptionCount,
      assistanceUsed: attempt.assistanceUsed,
    }),
  });
}

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
    requestId?: string;
  };
  if (!response.ok) {
    const reference = body.requestId ? ` Reference: ${body.requestId}.` : "";
    throw new ApiError(
      `${body.message || "Listenly could not complete this request."}${reference}`,
      response.status,
      body.requestId,
    );
  }
  return body;
}

export const learnerTestService = {
  async list(): Promise<PublishedTestSummary[]> {
    const items: PublishedTestSummary[] = [];
    let nextToken: string | undefined;
    do {
      const query = nextToken
        ? `?limit=100&nextToken=${encodeURIComponent(nextToken)}`
        : "?limit=100";
      const result = await apiRequest<{
        items: PublishedTestSummary[];
        nextToken?: string;
      }>(`/tests${query}`);
      items.push(...result.items);
      nextToken = result.nextToken;
    } while (nextToken);
    return items.sort(
      (a, b) =>
        new Date(b.publishedAt ?? 0).getTime() -
        new Date(a.publishedAt ?? 0).getTime(),
    );
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
    const items: TestAttempt[] = [];
    let nextToken: string | undefined;
    do {
      const query = nextToken
        ? `?limit=100&nextToken=${encodeURIComponent(nextToken)}`
        : "?limit=100";
      const result = await apiRequest<{ items: TestAttempt[]; nextToken?: string }>(
        `/attempts${query}`,
      );
      result.items.forEach((attempt) =>
        knownRevisions.set(attempt.id, attempt.revision ?? 0),
      );
      items.push(...result.items);
      nextToken = result.nextToken;
    } while (nextToken);
    return items.sort(
      (a, b) =>
        new Date(b.completedAt ?? b.startedAt ?? 0).getTime() -
        new Date(a.completedAt ?? a.startedAt ?? 0).getTime(),
    );
  },

  async create(testId: string, mode: "mock" | "practice", partNumber?: number) {
    const attempt = await apiRequest<TestAttempt>("/attempts", {
      method: "POST",
      body: JSON.stringify({ testId, mode, ...(partNumber ? { partNumber } : {}) }),
    });
    knownRevisions.set(attempt.id, attempt.revision ?? 0);
    return attempt;
  },

  async get(attemptId: string): Promise<AttemptWithReview> {
    const attempt = normalizeAttempt(
      await apiRequest<AttemptWithReview>(`/attempts/${attemptId}`),
    );
    knownRevisions.set(attempt.id, attempt.revision ?? 0);
    return attempt;
  },

  async save(attempt: TestAttempt): Promise<TestAttempt> {
    return queueWrite(attempt.id, async () => {
      const saved = await writeAttempt(attempt);
      knownRevisions.set(attempt.id, saved.revision ?? 0);
      return saved;
    });
  },

  async submit(attempt: TestAttempt): Promise<AttemptWithReview> {
    return queueWrite(attempt.id, async () => {
      let savedRevision = knownRevisions.get(attempt.id) ?? attempt.revision ?? 0;
      try {
        const saved = await writeAttempt(attempt);
        knownRevisions.set(attempt.id, saved.revision ?? 0);
        savedRevision = saved.revision ?? savedRevision;
      } catch (error) {
        // A previous submission may have succeeded but lost its response.
        if (error instanceof ApiError && error.status === 409) {
          const stored = await this.get(attempt.id);
          if (stored.status === "completed") return stored;
        }
        throw error;
      }
      const completed = normalizeAttempt(await apiRequest<AttemptWithReview>(`/attempts/${attempt.id}/submit`, {
        method: "POST",
        body: JSON.stringify({ expectedRevision: savedRevision }),
      }));
      knownRevisions.set(completed.id, completed.revision ?? savedRevision);
      return completed;
    });
  },

  async reportQuestion(attemptId: string, questionId: string, note: string) {
    return apiRequest<{ reportId: string }>(`/attempts/${attemptId}/report`, {
      method: "POST",
      body: JSON.stringify({ questionId, note }),
    });
  },
};
