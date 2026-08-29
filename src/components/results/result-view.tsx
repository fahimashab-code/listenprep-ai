"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronDown,
  FileText,
  Headphones,
  Lightbulb,
  Target,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  calculateRawScore,
  estimateListeningBand,
  getResultBreakdown,
  isAnswerCorrect,
  questionSlotCount,
  scoreQuestion,
} from "@/lib/scoring";
import { loadAttempt } from "@/lib/storage";
import { cn, formatQuestionType, formatSkill } from "@/lib/utils";
import {
  demoSubmittedAnswers,
  mockTestOne,
} from "@/mock-data/listening-tests";
import type {
  ListeningQuestion,
  ListeningTest,
  TestAttempt,
  UserAnswer,
} from "@/types/listening";

type Filter = "all" | "incorrect" | "correct" | "unanswered";

function ReviewCard({
  question,
  answer,
  defaultOpen,
}: {
  question: ListeningQuestion;
  answer?: UserAnswer;
  defaultOpen?: boolean;
}) {
  const [fullTranscript, setFullTranscript] = useState(false);
  const unanswered =
    answer === undefined ||
    (Array.isArray(answer) ? answer.length === 0 : String(answer).trim() === "");
  const correct = !unanswered && isAnswerCorrect(question, answer);
  const status = unanswered ? "Unanswered" : correct ? "Correct" : "Incorrect";

  return (
    <details
      className="group rounded-xl border bg-surface shadow-[var(--shadow-card)] transition-[border-color,box-shadow] hover:border-primary/35 hover:shadow-md"
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6">
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold",
            correct
              ? "bg-green-50 text-green-700"
              : unanswered
                ? "bg-surface-subtle text-muted"
                : "bg-red-50 text-red-700",
          )}
        >
          {question.number}
        </span>
        <div className="min-w-0 flex-1">
          <p className="line-clamp-2 font-semibold">{question.prompt}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <Badge
              variant={correct ? "green" : unanswered ? "gray" : "red"}
            >
              {status}
            </Badge>
            <span className="text-muted">
              {formatQuestionType(question.type)}
            </span>
          </div>
        </div>
        <ChevronDown className="size-5 shrink-0 text-subtle transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t px-5 pb-6 pt-5 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-surface-subtle p-4">
            <p className="text-xs font-semibold text-muted">Your answer</p>
            <p className="mt-1 font-bold">
              {unanswered
                ? "No answer"
                : Array.isArray(answer)
                  ? answer.join(", ")
                  : answer}
            </p>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <p className="text-xs font-semibold text-green-800">
              Correct answer
            </p>
            <p className="mt-1 font-bold text-green-950">
              {question.acceptedAnswers.join(", ")}
            </p>
          </div>
        </div>

        {!correct && (
          <div className="mt-5">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-amber-700" />
              <h3 className="font-bold">Why was this wrong?</h3>
            </div>
            <p className="mt-2 type-body-sm text-muted">
              {question.distractor?.explanation ??
                "The recording gives the required detail using different wording. Compare the answer with the transcript evidence below."}
            </p>
            {question.distractor && (
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="amber">
                  Listening issue: {formatSkill(question.distractor.type)}
                </Badge>
              </div>
            )}
          </div>
        )}

        <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-blue-700" />
            <h3 className="text-sm font-bold text-blue-950">
              Relevant transcript segment
            </h3>
          </div>
          <p className="mt-2 type-body-sm text-blue-950">
            {question.transcriptEvidence?.text ??
              "The relevant transcript segment is not available for this demo question."}
          </p>
          {fullTranscript && (
            <p className="mt-3 border-t border-blue-200 pt-3 type-body-sm text-blue-900">
              The full transcript would continue here with the surrounding
              context. This demo keeps the relevant evidence first so the
              explanation stays focused.
            </p>
          )}
          <button
            className="mt-3 text-xs font-bold text-blue-800 hover:underline"
            onClick={() => setFullTranscript((value) => !value)}
          >
            {fullTranscript ? "Hide full transcript" : "View full transcript"}
          </button>
        </div>

        {question.paraphrase && (
          <div className="mt-5 rounded-lg bg-surface-subtle p-4">
            <h3 className="text-sm font-bold">Words with the same meaning</h3>
            <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold text-muted">
                  Question
                </dt>
                <dd className="mt-1 font-semibold">
                  “{question.paraphrase.questionPhrase}”
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold text-muted">
                  Recording
                </dt>
                <dd className="mt-1 font-semibold">
                  “{question.paraphrase.audioPhrase}”
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-sm text-muted">
              The recording used different words to express the same idea.
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {question.skillTags.map((skill) => (
            <Badge key={skill}>{formatSkill(skill)}</Badge>
          ))}
        </div>
      </div>
    </details>
  );
}

export function ResultView({
  test,
  attemptId,
  initialAttempt,
}: {
  test: ListeningTest;
  attemptId: string;
  initialAttempt: TestAttempt;
}) {
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>(() => {
    if (initialAttempt.status === "completed") return initialAttempt.answers;
    const demoAnswersByNumber = new Map(
      mockTestOne.parts.flatMap((part) =>
        part.questions.map((question) => [
          question.number,
          demoSubmittedAnswers[question.id],
        ]),
      ),
    );
    return Object.fromEntries(
      test.parts.flatMap((part) =>
        part.questions.map((question) => [
          question.id,
          demoAnswersByNumber.get(question.number) ??
            question.acceptedAnswers[0],
        ]),
      ),
    );
  });
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const attempt = loadAttempt(attemptId);
      if (attempt?.status === "completed") setAnswers(attempt.answers);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [attemptId]);

  const calculatedScore = calculateRawScore(test, answers);
  const score = initialAttempt.rawScore ?? calculatedScore;
  const band = initialAttempt.estimatedBand ?? estimateListeningBand(score);
  const breakdown = getResultBreakdown(test, answers);
  const weakestPart = breakdown.byPart.reduce((weakest, item) =>
    item.score / item.total < weakest.score / weakest.total ? item : weakest,
  );
  const weakestPartNumber = Number(weakestPart.label.replace("Part ", ""));
  const weaknessTitle =
    weakestPartNumber === 3
      ? "Part 3 — Speaker opinions"
      : `${weakestPart.label} — ${
          [
            "Everyday details",
            "Directions and main ideas",
            "Speaker opinions",
            "Academic information",
          ][weakestPartNumber - 1]
        }`;
  const weaknessHref = `/practice/part-${weakestPartNumber}`;
  const questions = test.parts.flatMap((part) => part.questions);
  const visibleQuestions = useMemo(
    () =>
      questions.filter((question) => {
        const answer = answers[question.id];
        const unanswered =
          answer === undefined ||
          (Array.isArray(answer)
            ? answer.length === 0
            : String(answer).trim() === "");
        const correct =
          !unanswered &&
          scoreQuestion(question, answer) === questionSlotCount(question);
        if (filter === "incorrect") return !unanswered && !correct;
        if (filter === "correct") return correct;
        if (filter === "unanswered") return unanswered;
        return true;
      }),
    [answers, filter, questions],
  );

  const answeredCount = questions.reduce((total, question) => {
    const answer = answers[question.id];
    return (
      total +
      (Array.isArray(answer)
        ? Math.min(questionSlotCount(question), answer.filter(Boolean).length)
        : String(answer ?? "").trim()
          ? 1
          : 0)
    );
  }, 0);
  const incorrectCount = Math.max(0, answeredCount - calculatedScore);
  const unansweredCount = Math.max(0, 40 - answeredCount);

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="sticky top-0 z-30 border-b bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <ButtonLink href="/dashboard" variant="ghost" size="sm">
            <ArrowLeft className="size-4" /> Home
          </ButtonLink>
          <span className="hidden items-center gap-2 text-sm font-bold sm:flex">
            <Headphones className="size-4 text-primary" />
            Listenly results
          </span>
          <ButtonLink href="/tests" variant="secondary" size="sm">
            Mock Tests
          </ButtonLink>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
        <Card className="overflow-hidden border-primary/40 shadow-[0_18px_48px_rgba(23,79,48,.1)]">
          <div className="grid lg:grid-cols-[1fr_330px]">
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Badge variant="green">Practice estimate</Badge>
                <span className="text-xs font-semibold text-muted">
                  Full mock complete
                </span>
              </div>
              <h1 className="type-page-title mt-4">
                {test.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-end gap-x-12 gap-y-5">
                <div>
                  <p className="text-sm font-semibold text-muted">
                    Listening score
                  </p>
                  <p className="mt-1 text-5xl font-bold">
                    {score} <span className="text-2xl text-subtle">/ 40</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted">
                    Estimated band
                  </p>
                  <p className="mt-1 text-5xl font-bold text-primary">
                    {band.toFixed(1)}
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-2xl type-body-sm text-muted">
                This is an estimated Listening band based on practice
                performance. It is not an official IELTS result.
              </p>
            </div>
            <div className="dark-green-panel p-6 text-white sm:p-8">
              <p className="text-sm font-semibold text-white/70">
                Result insight
              </p>
              <h2 className="mt-3 text-xl font-bold">Focus next</h2>
              <p className="mt-2 text-lg font-bold">{weaknessTitle}</p>
              <p className="mt-3 type-body-sm text-white/75">
                This Part cost you the most marks in this test. Review the
                mistakes, then practise similar questions.
              </p>
              <ButtonLink
                href={weaknessHref}
                variant="secondary"
                className="mt-6 w-full"
              >
                Practice this weakness <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Card>

        <section className="mt-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-muted">
              Where marks were gained and lost
            </p>
            <h2 className="mt-1 text-xl font-bold">Part breakdown</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {breakdown.byPart.map((item) => (
              <Card
                key={item.label}
                className="group p-5 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{item.label}</h3>
                  <span className="text-lg font-bold">
                    {item.score}/{item.total}
                  </span>
                </div>
                <Progress value={(item.score / item.total) * 100} className="mt-4" />
                <p className="mt-3 text-xs text-muted">
                  {Math.round((item.score / item.total) * 100)}% accuracy
                </p>
              </Card>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => {
                setFilter("incorrect");
                document
                  .getElementById("question-review")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Review mistakes <ArrowRight className="size-4" />
            </Button>
            <ButtonLink href={weaknessHref} variant="secondary">
              Practice weakness
            </ButtonLink>
          </div>
        </section>

        <details className="group mt-6 rounded-xl border bg-surface shadow-[var(--shadow-card)] open:border-primary/35">
          <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-bold sm:p-6">
            View detailed analysis
            <ChevronDown className="size-5 text-subtle transition-transform group-open:rotate-180" />
          </summary>
          <div className="grid gap-6 border-t p-5 sm:p-6 lg:grid-cols-2">
          <Card className="p-5 sm:p-6">
            <p className="text-sm font-semibold text-muted">
              Detailed breakdown
            </p>
            <h2 className="mt-1 text-xl font-bold">By question type</h2>
            <div className="mt-5 space-y-4">
              {breakdown.byType.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-semibold">
                      {formatQuestionType(item.label)}
                    </span>
                    <span className="text-muted">
                      {item.score}/{item.total} ·{" "}
                      {Math.round((item.score / item.total) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(item.score / item.total) * 100}
                    indicatorClassName={
                      item.score / item.total < 0.65 ? "bg-amber-500" : undefined
                    }
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <p className="text-sm font-semibold text-muted">
              Learning analytics
            </p>
            <h2 className="mt-1 text-xl font-bold">Skill analysis</h2>
            <p className="mt-2 text-xs leading-5 text-subtle">
              These categories support learning and are not official IELTS
              scoring criteria.
            </p>
            <div className="mt-5 space-y-3">
              {breakdown.bySkill.slice(0, 6).map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg bg-surface-subtle px-4 py-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "grid size-7 place-items-center rounded-full",
                        index < 2
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-800",
                      )}
                    >
                      <Target className="size-3.5" />
                    </span>
                    <span className="font-semibold">
                      {formatSkill(item.label)}
                    </span>
                  </div>
                  <span className="font-bold">
                    {Math.round((item.score / item.total) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
          </div>
        </details>

        <Card className="mt-6 border-primary/35 bg-gradient-to-br from-surface to-primary-soft/60 p-5 shadow-md sm:p-6">
          <div className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
              <BookOpenCheck className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-primary">
                Recommended next practice
              </p>
              <h2 className="mt-1 text-xl font-bold">
                {weaknessTitle}
              </h2>
              <p className="mt-2 type-body-sm text-muted">
                Practise the Part that caused the most difficulty before taking
                your next full Listening mock.
              </p>
              <ButtonLink href={weaknessHref} className="mt-4" size="sm">
                Start recommended practice <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </div>
        </Card>

        <section className="mt-8" id="question-review">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold text-muted">
                Understand every mistake
              </p>
              <h2 className="type-section-title mt-1">Question review</h2>
            </div>
            <div className="flex gap-1 overflow-x-auto rounded-lg border bg-surface p-1">
              {[
                ["all", `All · 40`],
                ["incorrect", `Incorrect · ${incorrectCount}`],
                ["correct", `Correct · ${score}`],
                ["unanswered", `Unanswered · ${unansweredCount}`],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value as Filter)}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-2 text-xs font-bold",
                    filter === value
                      ? "bg-primary-soft text-primary"
                      : "text-muted hover:bg-surface-subtle",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {visibleQuestions.map((question, index) => (
              <ReviewCard
                key={question.id}
                question={question}
                answer={answers[question.id]}
                defaultOpen={filter === "incorrect" && index === 0}
              />
            ))}
          </div>
          {visibleQuestions.length === 0 && (
            <Card className="mt-5 p-8 text-center">
              {filter === "unanswered" ? (
                <CheckCircle2 className="mx-auto size-8 text-primary" />
              ) : (
                <XCircle className="mx-auto size-8 text-muted" />
              )}
              <h3 className="mt-3 font-bold">No questions in this filter</h3>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
}
