"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Headphones,
  Library,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  learnerAttemptService,
  learnerTestService,
} from "@/lib/api/listenly-service";
import { loadAttempts } from "@/lib/storage";
import type { PublishedTestSummary, TestAttempt } from "@/types/listening";

function hasAnswer(answer: TestAttempt["answers"][string]) {
  return Array.isArray(answer)
    ? answer.length > 0
    : String(answer ?? "").trim() !== "";
}

function newestFirst(a: TestAttempt, b: TestAttempt) {
  const aTime = new Date(a.completedAt ?? a.startedAt ?? 0).getTime();
  const bTime = new Date(b.completedAt ?? b.startedAt ?? 0).getTime();
  return bTime - aTime;
}

export function LearnerDashboard() {
  const [attempts, setAttempts] = useState<TestAttempt[]>([]);
  const [tests, setTests] = useState<PublishedTestSummary[]>([]);

  useEffect(() => {
    let active = true;
    const frame = window.requestAnimationFrame(() => {
      if (active) setAttempts(loadAttempts());
    });

    Promise.allSettled([
      learnerAttemptService.list(),
      learnerTestService.list(),
    ]).then(([attemptResult, testResult]) => {
      if (!active) return;
      if (attemptResult.status === "fulfilled" && attemptResult.value.length) {
        setAttempts(attemptResult.value);
      }
      if (testResult.status === "fulfilled") {
        setTests(testResult.value);
      }
    });

    return () => {
      active = false;
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const activeAttempt = useMemo(
    () =>
      attempts
        .filter(
          (attempt) =>
            attempt.status === "in_progress" ||
            attempt.status === "final_review",
        )
        .sort(newestFirst)[0] ?? null,
    [attempts],
  );
  const completedAttempts = useMemo(
    () => attempts.filter((attempt) => attempt.status === "completed").sort(newestFirst),
    [attempts],
  );
  const activeTest = activeAttempt
    ? tests.find((test) => test.id === activeAttempt.testId)
    : undefined;
  const answeredCount = activeAttempt
    ? Object.values(activeAttempt.answers).filter(hasAnswer).length
    : 0;
  const latestCompleted = completedAttempts[0];
  const latestCompletedTest = latestCompleted
    ? tests.find((test) => test.id === latestCompleted.testId)
    : undefined;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Listening practice
          </p>
          <h2 className="type-page-title mt-2">
            {activeAttempt ? "Welcome back" : "Ready to practise?"}
          </h2>
          <p className="mt-2 max-w-2xl text-muted">
            {activeAttempt
              ? "Your last test is saved, so you can continue where you stopped."
              : "Choose a listening test published by your Listenly administrator."}
          </p>
        </div>
      </div>

      <Card className="overflow-hidden border-primary/30 shadow-[0_16px_42px_rgba(23,79,48,.09)]">
        <div className="grid lg:grid-cols-[1fr_320px]">
          <div className="p-6 sm:p-8">
            <Badge variant="green">
              {activeAttempt ? "Continue your test" : "Start here"}
            </Badge>
            <h3 className="type-section-title mt-4">
              {activeAttempt
                ? `Continue ${activeTest?.title ?? "your listening test"}`
                : "Take a complete listening test"}
            </h3>
            <p className="mt-3 max-w-xl leading-7 text-muted">
              {activeAttempt
                ? activeAttempt.status === "final_review"
                  ? "Your answers are saved. Finish your review when you are ready."
                  : `You stopped in Part ${activeAttempt.currentPart}. Your answers and marked questions are still here.`
                : "Browse the tests published by your Listenly administrator, then choose test or practice mode."}
            </p>

            {activeAttempt ? (
              <div className="mt-6 max-w-xl">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold">
                    {activeAttempt.status === "final_review"
                      ? "Final review"
                      : `Part ${activeAttempt.currentPart} of 4`}
                  </span>
                  <span className="text-muted">{answeredCount} of 40 answered</span>
                </div>
                <Progress
                  value={(answeredCount / 40) * 100}
                  className="h-2.5"
                  label="Test answer progress"
                />
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted">
                <span>4 parts</span>
                <span>40 questions</span>
                <span>About 30 minutes</span>
              </div>
            )}

            <ButtonLink
              href={
                activeAttempt
                  ? `/test/${activeAttempt.id}?mode=${activeAttempt.mode}`
                  : "/tests"
              }
              className="mt-7"
              size="lg"
            >
              {activeAttempt ? "Continue test" : "Browse published tests"}
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          <div className="dark-green-panel relative hidden overflow-hidden p-8 text-white lg:block">
            <div className="absolute -right-12 -top-12 size-44 rounded-full border-[32px] border-white/5" />
            <Headphones className="size-9 text-[#a8dab7]" />
            <p className="mt-9 text-sm text-white/70">
              {activeAttempt ? "Current position" : "Published tests"}
            </p>
            <p className="mt-1 text-xl font-bold">
              {activeAttempt
                ? activeAttempt.status === "final_review"
                  ? "Final review"
                  : `Part ${activeAttempt.currentPart} of 4`
                : tests.length > 0
                  ? `${tests.length} available now`
                  : "Your test library"}
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-white/75">
              <Clock3 className="size-4" />
              {activeAttempt ? "Your progress is saved" : "Start when you are ready"}
            </div>
          </div>
        </div>
      </Card>

      <section>
        <Card className="p-5 sm:p-6">
          <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
            <Library className="size-5" />
          </span>
          <h3 className="mt-5 text-xl font-bold">Published tests</h3>
          <p className="mt-2 type-body-sm text-muted">
            Choose from the listening tests available to learners. Each test shows its format before you begin.
          </p>
          <ButtonLink href="/tests" variant="secondary" className="mt-5" size="sm">
            View all tests <ArrowRight className="size-4" />
          </ButtonLink>
        </Card>

      </section>

      <Card className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
            <CheckCircle2 className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-muted">Latest result</p>
            {latestCompleted ? (
              <>
                <h3 className="mt-1 text-xl font-bold">
                  {latestCompletedTest?.title ?? "Completed listening test"}
                </h3>
                <p className="mt-2 text-muted">
                  Score: <strong className="text-ink">{latestCompleted.rawScore ?? 0} of 40</strong>
                  {typeof latestCompleted.estimatedBand === "number"
                    ? ` · Estimated band ${latestCompleted.estimatedBand.toFixed(1)}`
                    : ""}
                </p>
                <ButtonLink href={`/results/${latestCompleted.id}`} variant="secondary" className="mt-4" size="sm">
                  Review answers
                </ButtonLink>
              </>
            ) : (
              <>
                <h3 className="mt-1 text-xl font-bold">No completed tests yet</h3>
                <p className="mt-2 text-muted">
                  Your score and answer review will appear here after your first completed test.
                </p>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
