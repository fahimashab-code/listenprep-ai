import {
  historicalAttempts,
  listeningTests,
  practiceExercises,
  progressData,
} from "@/mock-data/listening-tests";
import type {
  HistoricalAttempt,
  ListeningTest,
  PracticeExercise,
  TestAttempt,
  UserAnswer,
} from "@/types/listening";

export interface TestService {
  list(): Promise<ListeningTest[]>;
  get(testId: string): Promise<ListeningTest | undefined>;
}

export interface AttemptService {
  create(testId: string, mode: "mock" | "practice"): Promise<TestAttempt>;
  saveAnswer(
    attempt: TestAttempt,
    questionId: string,
    answer: UserAnswer,
  ): Promise<TestAttempt>;
}

export interface ProgressService {
  get(): Promise<typeof progressData>;
  history(): Promise<HistoricalAttempt[]>;
  practices(): Promise<PracticeExercise[]>;
}

export interface GenerationService {
  simulate(): AsyncGenerator<string>;
}

export const mockTestService: TestService = {
  async list() {
    return listeningTests;
  },
  async get(testId) {
    return listeningTests.find((test) => test.id === testId);
  },
};

export const mockAttemptService: AttemptService = {
  async create(testId, mode) {
    return {
      id: `${testId}-demo-attempt`,
      testId,
      userId: "demo-alex",
      mode,
      status: "in_progress",
      phase: "part_preview",
      answers: {},
      markedForReview: [],
      currentPart: 1,
      startedAt: new Date().toISOString(),
    };
  },
  async saveAnswer(attempt, questionId, answer) {
    return {
      ...attempt,
      answers: { ...attempt.answers, [questionId]: answer },
    };
  },
};

export const mockProgressService: ProgressService = {
  async get() {
    return progressData;
  },
  async history() {
    return historicalAttempts;
  },
  async practices() {
    return practiceExercises;
  },
};

export const mockGenerationService: GenerationService = {
  async *simulate() {
    for (const step of [
      "Queued",
      "Creating listening scenario…",
      "Creating questions…",
      "Checking answer order…",
      "Preparing audio…",
      "Ready",
    ]) {
      yield step;
    }
  },
};
