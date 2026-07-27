"use client";

import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  Check,
  ChevronDown,
  Headphones,
  LogOut,
  Pause,
  Play,
  Save,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CentreMap,
  QuestionRenderer,
} from "@/components/listening/question-renderer";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DEMO_PART_SECONDS, DEMO_TIMING } from "@/config/demo";
import { calculateRawScore, estimateListeningBand } from "@/lib/scoring";
import { loadAttempt, saveAttempt } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type {
  ListeningTest,
  TestAttempt,
  UserAnswer,
} from "@/types/listening";

export function ExamInterface({
  test,
  attemptId,
  requestedMode,
}: {
  test: ListeningTest;
  attemptId: string;
  requestedMode: "mock" | "practice";
}) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<TestAttempt>({
    id: attemptId,
    testId: test.id,
    userId: "demo-alex",
    mode: requestedMode,
    status: "in_progress",
    answers: {},
    currentPart: 1,
    startedAt: new Date().toISOString(),
  });
  const [hydrated, setHydrated] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [saved, setSaved] = useState(true);
  const [transitionTo, setTransitionTo] = useState<number | null>(null);
  const [exitOpen, setExitOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const questionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const restored = loadAttempt(attemptId);
      if (restored && restored.status === "in_progress") {
        setAttempt(restored);
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [attemptId]);

  useEffect(() => {
    if (!hydrated) return;
    saveAttempt(attempt);
    const timeout = setTimeout(() => setSaved(true), 450);
    return () => clearTimeout(timeout);
  }, [attempt, hydrated]);

  useEffect(() => {
    if (!hydrated || paused || transitionTo !== null || submitOpen) return;
    const timer = setInterval(() => {
      setAudioSeconds((seconds) => {
        if (seconds + 1 >= DEMO_PART_SECONDS) {
          if (attempt.currentPart < 4) {
            window.setTimeout(
              () => setTransitionTo(attempt.currentPart + 1),
              0,
            );
          }
          return DEMO_PART_SECONDS;
        }
        return seconds + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [
    attempt.currentPart,
    hydrated,
    paused,
    transitionTo,
    submitOpen,
  ]);

  const currentPart = test.parts[attempt.currentPart - 1];
  const allQuestions = useMemo(
    () => test.parts.flatMap((part) => part.questions),
    [test.parts],
  );
  const answeredCount = Object.values(attempt.answers).filter((answer) =>
    Array.isArray(answer) ? answer.length > 0 : String(answer).trim() !== "",
  ).length;
  const unanswered = allQuestions.length - answeredCount;

  function setAnswer(questionId: string, answer: UserAnswer) {
    setSaved(false);
    setAttempt((current) => ({
      ...current,
      answers: { ...current.answers, [questionId]: answer },
    }));
  }

  function moveToPart(partNumber: number) {
    setTransitionTo(null);
    setAudioSeconds(0);
    setPaused(false);
    setReviewMode(false);
    setAttempt((current) => ({ ...current, currentPart: partNumber }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function submit() {
    const rawScore = calculateRawScore(test, attempt.answers);
    const completed: TestAttempt = {
      ...attempt,
      status: "completed",
      completedAt: new Date().toISOString(),
      rawScore,
      estimatedBand: estimateListeningBand(rawScore),
    };
    saveAttempt(completed);
    router.push(`/results/${attemptId}`);
  }

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface-subtle">
        <div className="text-center">
          <Headphones className="mx-auto size-8 animate-pulse text-primary" />
          <p className="mt-3 text-sm font-semibold text-muted">
            Restoring your test…
          </p>
        </div>
      </div>
    );
  }

  if (transitionTo !== null) {
    const nextPart = test.parts[transitionTo - 1];
    return (
      <div className="grid min-h-screen place-items-center bg-primary-strong px-5 text-white">
        <div className="max-w-xl text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-white/10">
            <Check className="size-7" />
          </span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
            Part {transitionTo - 1} complete
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Next: Part {transitionTo} — Questions{" "}
            {nextPart.questions[0].number}–{nextPart.questions.at(-1)?.number}
          </h1>
          <p className="mt-4 text-white/75">
            Use this time to read the next questions.
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="mt-8"
            onClick={() => moveToPart(transitionTo)}
          >
            Continue to Part {transitionTo} <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="sticky top-0 z-30 border-b bg-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold">Part {attempt.currentPart} of 4</p>
                <Badge variant={attempt.mode === "mock" ? "green" : "gray"}>
                  {attempt.mode === "mock" ? "Mock Exam" : "Practice"}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                Questions {currentPart.questions[0].number}–
                {currentPart.questions.at(-1)?.number}
              </p>
            </div>
            <div className="hidden min-w-[280px] items-center gap-3 md:flex">
              <Volume2 className="size-4 text-primary" />
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-semibold">
                    {paused ? "Audio paused" : "Audio playing"}
                  </span>
                  <span className="text-subtle">
                    {Math.floor(audioSeconds / 60)}:
                    {String(audioSeconds % 60).padStart(2, "0")}
                  </span>
                </div>
                <Progress
                  value={(audioSeconds / DEMO_PART_SECONDS) * 100}
                  className="h-1.5"
                  label="Non-interactive audio progress"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 text-xs text-muted sm:flex">
                <Save className="size-3.5" />
                {saved ? "Saved" : "Saving…"}
              </span>
              {attempt.mode === "practice" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPaused((value) => !value)}
                >
                  {paused ? (
                    <Play className="size-4" />
                  ) : (
                    <Pause className="size-4" />
                  )}
                  <span className="hidden sm:inline">
                    {paused ? "Resume" : "Pause"}
                  </span>
                </Button>
              )}
              <button
                className="grid size-9 place-items-center rounded-lg border text-muted hover:bg-gray-50"
                onClick={() => setExitOpen(true)}
                aria-label="Exit test"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 pb-3 md:hidden">
            <Volume2 className="size-4 text-primary" />
            <Progress
              value={(audioSeconds / DEMO_PART_SECONDS) * 100}
              className="flex-1"
              label="Non-interactive audio progress"
            />
            <span className="text-xs font-semibold">
              {paused ? "Paused" : "Playing"}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          <Card className="p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Part {currentPart.partNumber}
            </p>
            <h1 className="mt-2 text-xl font-bold sm:text-2xl">
              {currentPart.title}
            </h1>
            <p className="mt-2 type-body-sm text-muted">
              {currentPart.context}
            </p>
          </Card>

          {currentPart.questions.some(
            (question) => question.type === "map_labelling",
          ) && (
            <Card className="mt-4 p-5 sm:p-6">
              <p className="mb-4 text-sm font-bold">
                Community centre plan · Questions 11–15
              </p>
              <CentreMap />
            </Card>
          )}

          <div className="mt-4 space-y-4">
            {currentPart.questions.map((question, index) => (
              <section
                key={question.id}
                id={`question-${question.number}`}
                ref={(node) => {
                  questionRefs.current[question.id] = node;
                }}
              >
                <Card
                  className={cn(
                    "p-5 sm:p-6",
                    attempt.answers[question.id] !== undefined &&
                      "border-[#bfd8c5]",
                  )}
                >
                  {index === 0 ||
                  currentPart.questions[index - 1].instruction !==
                    question.instruction ? (
                    <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50/60 p-4 type-body-sm text-blue-950">
                      <strong>Questions {question.number}–
                      {currentPart.questions
                        .slice(index)
                        .findLast(
                          (item) => item.instruction === question.instruction,
                        )?.number ?? question.number}</strong>
                      <br />
                      {question.instruction}
                    </div>
                  ) : null}
                  <div className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#edf3ee] text-sm font-bold text-ink">
                      {question.number}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold leading-6">
                        {question.prompt}
                      </h2>
                      <div className="mt-4">
                        <QuestionRenderer
                          question={question}
                          answer={attempt.answers[question.id]}
                          onChange={(answer) => setAnswer(question.id, answer)}
                        />
                      </div>
                      {attempt.mode === "practice" &&
                        reviewMode &&
                        attempt.answers[question.id] !== undefined && (
                          <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm">
                            <p className="font-bold text-green-950">
                              Transcript evidence
                            </p>
                            <p className="mt-2 leading-6 text-green-900">
                              {question.transcriptEvidence?.text}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </Card>
              </section>
            ))}
          </div>

          <Card className="mt-5 flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold">
                Part {attempt.currentPart} ·{" "}
                {
                  currentPart.questions.filter(
                    (question) =>
                      attempt.answers[question.id] !== undefined &&
                      String(attempt.answers[question.id]).trim() !== "",
                  ).length
                }{" "}
                of 10 answered
              </p>
              <p className="mt-1 text-sm text-muted">
                Review your answers while the test remains active.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {attempt.mode === "practice" && (
                <Button
                  variant="secondary"
                  onClick={() => setReviewMode((value) => !value)}
                >
                  <BookOpenCheck className="size-4" />
                  {reviewMode ? "Hide transcript" : "Review block"}
                </Button>
              )}
              {attempt.currentPart < 4 ? (
                <Button
                  onClick={() => setTransitionTo(attempt.currentPart + 1)}
                >
                  {DEMO_TIMING ? "Demo: next Part" : "Next Part"}
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={() => setSubmitOpen(true)}>
                  Finish test <Check className="size-4" />
                </Button>
              )}
            </div>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-[84px] lg:h-fit">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Question navigator</h2>
              <span className="text-xs text-muted">
                {answeredCount}/40
              </span>
            </div>
            <div className="mt-4 grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
              {allQuestions.map((question) => {
                const isCurrentPart =
                  question.number >= currentPart.questions[0].number &&
                  question.number <=
                    (currentPart.questions.at(-1)?.number ?? 10);
                const answered =
                  attempt.answers[question.id] !== undefined &&
                  String(attempt.answers[question.id]).trim() !== "";
                return (
                  <button
                    key={question.id}
                    disabled={!isCurrentPart}
                    onClick={() =>
                      questionRefs.current[question.id]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      })
                    }
                    className={cn(
                      "grid aspect-square place-items-center rounded-md border text-xs font-bold",
                      answered && "border-[#b9d8c1] bg-primary-soft text-primary",
                      isCurrentPart &&
                        !answered &&
                        "border-[#789881] bg-white text-ink",
                      !isCurrentPart && "bg-gray-50 text-gray-400",
                    )}
                    aria-label={`Question ${question.number}${answered ? ", answered" : ", unanswered"}`}
                  >
                    {question.number}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 border-t pt-4 text-xs text-muted">
              <p className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-primary-soft ring-1 ring-[#b9d8c1]" />
                Answered
              </p>
              <p className="flex items-center gap-2">
                <span className="size-3 rounded-sm bg-white ring-1 ring-[#789881]" />
                Current Part, unanswered
              </p>
            </div>
          </Card>
        </aside>
      </main>

      {exitOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#17201a]/45 px-5">
          <Card className="w-full max-w-md p-6 shadow-2xl">
            <span className="grid size-11 place-items-center rounded-lg bg-amber-50 text-amber-700">
              <LogOut className="size-5" />
            </span>
            <h2 className="mt-4 text-xl font-bold">Leave this test?</h2>
            <p className="mt-2 type-body-sm text-muted">
              Your answers and current Part are saved. In this frontend demo,
              simulated audio progress within the Part will restart.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setExitOpen(false)}
              >
                Stay
              </Button>
              <ButtonLink href="/dashboard" variant="danger" className="flex-1">
                Exit test
              </ButtonLink>
            </div>
          </Card>
        </div>
      )}

      {submitOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#17201a]/45 px-5">
          <Card className="w-full max-w-lg p-6 shadow-2xl">
            <span className="grid size-11 place-items-center rounded-lg bg-primary-soft text-primary">
              {unanswered ? (
                <AlertTriangle className="size-5 text-amber-700" />
              ) : (
                <Check className="size-5" />
              )}
            </span>
            <h2 className="mt-4 text-xl font-bold">
              Listening test complete
            </h2>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-surface-subtle p-4">
                <p className="text-xs text-muted">Answered</p>
                <p className="mt-1 text-2xl font-bold">{answeredCount} / 40</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-xs text-amber-800">Unanswered</p>
                <p className="mt-1 text-2xl font-bold text-amber-950">
                  {unanswered}
                </p>
              </div>
            </div>
            {unanswered > 0 && (
              <p className="mt-4 type-body-sm text-muted">
                You have {unanswered} unanswered question
                {unanswered === 1 ? "" : "s"}. Submit anyway?
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {unanswered > 0 && (
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    setSubmitOpen(false);
                    const firstUnanswered = allQuestions.find(
                      (question) =>
                        attempt.answers[question.id] === undefined ||
                        String(attempt.answers[question.id]).trim() === "",
                    );
                    if (firstUnanswered) {
                      const part = test.parts.find((item) =>
                        item.questions.some(
                          (question) => question.id === firstUnanswered.id,
                        ),
                      );
                      if (part?.partNumber === attempt.currentPart) {
                        questionRefs.current[
                          firstUnanswered.id
                        ]?.scrollIntoView({ behavior: "smooth" });
                      }
                    }
                  }}
                >
                  Review unanswered
                </Button>
              )}
              <Button className="flex-1" onClick={submit}>
                Submit test
              </Button>
            </div>
            <button
              onClick={() => setSubmitOpen(false)}
              className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-semibold text-muted"
            >
              Return to test <ChevronDown className="size-4 rotate-180" />
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
