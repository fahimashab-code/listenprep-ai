"use client";

import {
  ArrowRight,
  Clock3,
  Headphones,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { loadActiveAttempt } from "@/lib/storage";
import { listeningTests } from "@/mock-data/listening-tests";
import type { TestAttempt } from "@/types/listening";

function hasAnswer(answer: TestAttempt["answers"][string]) {
  return Array.isArray(answer)
    ? answer.length > 0
    : String(answer ?? "").trim() !== "";
}

export function DashboardView() {
  const [activeAttempt, setActiveAttempt] = useState<TestAttempt | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setActiveAttempt(loadActiveAttempt());
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const activeTest = activeAttempt
    ? listeningTests.find((test) => test.id === activeAttempt.testId)
    : undefined;
  const answeredCount = activeAttempt
    ? Object.values(activeAttempt.answers).filter(hasAnswer).length
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
            Your IELTS Listening
          </p>
          <h2 className="type-page-title mt-2">What should you do now?</h2>
          <p className="mt-2 text-muted">
            Continue your test or start a complete four-Part mock.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-fit rounded-full border bg-white px-4 py-2 text-sm shadow-sm">
            <span className="text-muted">Target band</span>{" "}
            <strong className="text-primary">8.0</strong>
          </div>
          <ButtonLink href="/generate" variant="secondary" size="sm">
            <Sparkles className="size-4" />
            Create practice
          </ButtonLink>
        </div>
      </div>

      <Card className="overflow-hidden border-[#9fc8aa] shadow-[0_16px_42px_rgba(23,79,48,.09)]">
        <div className="grid lg:grid-cols-[1fr_320px]">
          <div className="p-6 sm:p-8">
            <Badge variant="green">
              {activeAttempt ? "Continue current test" : "Recommended next step"}
            </Badge>
            <h3 className="type-section-title mt-4">
              {activeTest
                ? `Continue ${activeTest.title}`
                : "Take a Full IELTS Listening Mock"}
            </h3>
            <p className="mt-3 max-w-xl leading-7 text-muted">
              {activeAttempt
                ? activeAttempt.status === "final_review"
                  ? "Your answers are saved. Continue your final review before submitting."
                  : `You stopped in Part ${activeAttempt.currentPart}. Your answers and marked questions are saved.`
                : "Practise under real-test-style conditions with four Parts and 40 questions."}
            </p>

            {activeAttempt ? (
              <div className="mt-6 max-w-xl">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold">
                    {activeAttempt.status === "final_review"
                      ? "Final review"
                      : `Part ${activeAttempt.currentPart} of 4`}
                  </span>
                  <span className="text-muted">{answeredCount} / 40 answered</span>
                </div>
                <Progress
                  value={(answeredCount / 40) * 100}
                  className="h-2.5"
                  label="Test answer progress"
                />
              </div>
            ) : (
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-muted">
                <span>4 Parts</span>
                <span>40 questions</span>
                <span>Approximately 30 minutes</span>
              </div>
            )}

            <ButtonLink
              href={
                activeAttempt
                  ? `/test/${activeAttempt.id}?mode=${activeAttempt.mode}`
                  : "/tests/mock-01"
              }
              className="mt-7"
              size="lg"
            >
              {activeAttempt ? "Continue test" : "Start Full Mock"}
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>

          <div className="dark-green-panel relative hidden overflow-hidden p-8 text-white lg:block">
            <div className="absolute -right-12 -top-12 size-44 rounded-full border-[32px] border-white/5" />
            <Headphones className="size-9 text-[#a8dab7]" />
            <p className="mt-9 text-sm text-white/70">
              {activeAttempt ? "Current position" : "Full mock format"}
            </p>
            <p className="mt-1 text-xl font-bold">
              {activeAttempt
                ? activeAttempt.status === "final_review"
                  ? "Final Review"
                  : `Part ${activeAttempt.currentPart} of 4`
                : "4 Parts · 40 Questions"}
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-white/75">
              <Clock3 className="size-4" />
              {activeAttempt ? "Your place is saved locally" : "~30 minutes"}
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="group p-5 hover:-translate-y-0.5 hover:border-[#b9d4c0] hover:shadow-lg sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-muted">
                Recent performance
              </p>
              <h3 className="mt-1 text-xl font-bold">Listening Mock 07</h3>
            </div>
            <span className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
              <TrendingUp className="size-5" />
            </span>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted">Recent score</p>
              <p className="mt-1 text-3xl font-bold">31 / 40</p>
            </div>
            <div>
              <p className="text-sm text-muted">Estimated band</p>
              <p className="mt-1 text-3xl font-bold text-primary">~7.0</p>
            </div>
          </div>
          <p className="mt-5 text-xs leading-5 text-subtle">
            Practice estimate, not an official IELTS result.
          </p>
        </Card>

        <Card className="group border-amber-200 bg-gradient-to-br from-white to-amber-50/60 p-5 hover:-translate-y-0.5 hover:shadow-lg sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <span className="grid size-11 place-items-center rounded-lg bg-amber-50 text-amber-700">
              <Lightbulb className="size-5" />
            </span>
            <Badge variant="amber">Focus next</Badge>
          </div>
          <h3 className="mt-5 text-xl font-bold">
            Part 3 — Speaker opinions
          </h3>
          <p className="mt-2 type-body-sm text-muted">
            You missed four recent questions when speakers changed, compared,
            or clarified their opinions.
          </p>
          <ButtonLink href="/practice/part-3" className="mt-5" size="sm">
            Practice this <ArrowRight className="size-4" />
          </ButtonLink>
        </Card>
      </section>

      <Card className="overflow-hidden p-5 hover:border-[#b9d4c0] hover:shadow-md sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-muted">Recent scores</p>
            <h3 className="mt-1 text-xl font-bold">You are improving</h3>
          </div>
          <div
            className="flex flex-wrap items-center gap-2"
            aria-label="Recent scores: 26, 27, 29, 30, 31"
          >
            {[26, 27, 29, 30, 31].map((score, index) => (
              <div key={score} className="flex items-center gap-2">
                <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-sm font-bold text-primary">
                  {score}
                </span>
                {index < 4 && (
                  <ArrowRight className="size-4 text-subtle" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex items-center gap-2 border-t pt-4 text-sm text-muted">
          <Target className="size-4 text-primary" />
          Your latest score is five marks higher than the first score shown.
        </div>
      </Card>
    </div>
  );
}
