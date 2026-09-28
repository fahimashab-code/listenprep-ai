"use client";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  FileText,
  Headphones,
  Lightbulb,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatQuestionType, formatSkill } from "@/lib/utils";
import { learnerAttemptService } from "@/lib/api/listenly-service";
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
  audioUrl,
  partNumber,
  outcome,
  onReport,
}: {
  question: ListeningQuestion;
  answer?: UserAnswer;
  defaultOpen?: boolean;
  audioUrl?: string;
  partNumber: number;
  outcome?: NonNullable<TestAttempt["questionOutcomes"]>[string];
  onReport: (questionId: string, note: string) => Promise<void>;
}) {
  const [audioFailed, setAudioFailed] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportNote, setReportNote] = useState("");
  const [reportStatus, setReportStatus] = useState("");
  const unanswered =
    answer === undefined ||
    (Array.isArray(answer) ? answer.length === 0 : String(answer).trim() === "");
  const correct = outcome?.status === "correct";
  const partial = outcome?.status === "partial";
  const status = outcome?.status === "unanswered" || unanswered
    ? "Unanswered"
    : correct
      ? "Correct"
      : partial
        ? `Partial · ${outcome?.awarded}/${outcome?.available}`
        : outcome
          ? "Incorrect"
          : "Awaiting server result";
  const start = question.transcriptEvidence?.startSeconds;
  const end = question.transcriptEvidence?.endSeconds;
  const hasPassage = typeof start === "number" && Number.isFinite(start) && start >= 0 &&
    typeof end === "number" && Number.isFinite(end) && end > start;

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

        {(question.instruction || question.options?.length || question.imageUrl) && (
          <div className="mt-5 rounded-lg border bg-surface-subtle p-4 text-sm">
            {question.instruction && <p className="font-semibold">{question.instruction}</p>}
            {question.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={question.imageUrl} alt={question.imageAlt || "Question visual"} className="mt-3 max-h-80 rounded-lg border object-contain" />
            )}
            {question.options?.length ? (
              <ul className="mt-3 space-y-1 text-muted">
                {question.options.map((option) => <li key={option.id}><strong>{option.id}.</strong> {option.label}</li>)}
              </ul>
            ) : null}
          </div>
        )}

        {audioUrl && (
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-bold">{hasPassage ? "Listen to the answer passage" : `Listen to Part ${partNumber} again`}</h3>
            <audio
              controls
              preload="none"
              aria-label={`Review audio for question ${question.number}`}
              src={hasPassage ? `${audioUrl.split("#")[0]}#t=${start},${end}` : audioUrl}
              className="h-10 w-full"
              onError={() => setAudioFailed(true)}
            />
            {audioFailed && (
              <button type="button" className="mt-2 text-sm font-semibold text-primary underline" onClick={() => window.location.reload()}>
                Refresh expired audio access
              </button>
            )}
          </div>
        )}

        {(question.explanation || question.distractor?.explanation) && (
          <div className="mt-5">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-amber-700" />
              <h3 className="font-bold">Answer explanation</h3>
            </div>
            <p className="mt-2 type-body-sm text-muted">
              {question.explanation || question.distractor?.explanation}
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

        {(question.transcriptEvidence?.text || question.transcriptText) && (
          <details className="mt-5 rounded-lg border border-blue-100 bg-blue-50/60 p-4">
            <summary className="cursor-pointer text-sm font-bold text-blue-950">Show relevant transcript</summary>
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-blue-700" />
              <h3 className="text-sm font-bold text-blue-950">
                Relevant transcript segment
              </h3>
            </div>
            <p className="mt-2 type-body-sm text-blue-950">
              {question.transcriptEvidence?.text || question.transcriptText}
            </p>
          </details>
        )}

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
        {question.paraphraseExplanation && (
          <p className="mt-4 rounded-lg bg-surface-subtle p-4 text-sm text-muted">{question.paraphraseExplanation}</p>
        )}
        {question.distractorExplanations && Object.keys(question.distractorExplanations).length > 0 && (
          <div className="mt-4 rounded-lg bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-bold">Why other choices do not fit</p>
            <ul className="mt-2 space-y-1">
              {Object.entries(question.distractorExplanations).map(([choice, explanation]) => (
                <li key={choice}><strong>{choice}:</strong> {explanation}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {(question.skillTags ?? []).map((skill) => (
            <Badge key={skill}>{formatSkill(skill)}</Badge>
          ))}
        </div>
        <div className="mt-5 border-t pt-4">
          <button type="button" className="text-sm font-semibold text-muted underline" onClick={() => setReportOpen((open) => !open)}>
            Report a problem with this question
          </button>
          {reportOpen && (
            <div className="mt-3 space-y-2">
              <label className="block text-sm font-semibold" htmlFor={`report-${question.id}`}>What seems wrong?</label>
              <textarea id={`report-${question.id}`} value={reportNote} onChange={(event) => setReportNote(event.target.value)} rows={3} maxLength={1000} className="w-full rounded-lg border bg-surface p-3 text-sm" />
              <Button size="sm" variant="secondary" disabled={!reportNote.trim() || reportStatus === "sending"} onClick={() => {
                setReportStatus("sending");
                void onReport(question.id, reportNote).then(() => {
                  setReportStatus("sent");
                  setReportNote("");
                }).catch((error: unknown) => setReportStatus(error instanceof Error ? error.message : "Report could not be sent."));
              }}>{reportStatus === "sending" ? "Sending…" : "Send report"}</Button>
              {reportStatus && reportStatus !== "sending" && <p role="status" className="text-sm text-muted">{reportStatus === "sent" ? "Report sent. Thank you." : reportStatus}</p>}
            </div>
          )}
        </div>
      </div>
    </details>
  );
}

export function ResultView({
  test,
  initialAttempt,
}: {
  test: ListeningTest;
  initialAttempt: TestAttempt;
}) {
  const answers = initialAttempt.answers;
  const [filter, setFilter] = useState<Filter>("all");

  async function reportQuestion(questionId: string, note: string) {
    await learnerAttemptService.reportQuestion(initialAttempt.id, questionId, note);
  }

  const score = initialAttempt.rawScore ?? 0;
  const totalMarks = initialAttempt.totalMarks ?? test.questionCount;
  const breakdown = {
    byPart: (initialAttempt.scoreBreakdown?.byPart ?? []).map((item) => ({
      label: `Part ${item.partNumber}`,
      score: item.score,
      total: item.total,
    })),
    byType: (initialAttempt.scoreBreakdown?.byType ?? []).map((item) => ({
      label: item.type,
      score: item.score,
      total: item.total,
    })),
  };
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
        const status = initialAttempt.questionOutcomes?.[question.id]?.status;
        const correct = status === "correct";
        if (filter === "incorrect") return !unanswered && !correct;
        if (filter === "correct") return correct;
        if (filter === "unanswered") return unanswered;
        return true;
      }),
    [answers, filter, initialAttempt.questionOutcomes, questions],
  );
  const incorrectCount = Object.values(initialAttempt.questionOutcomes ?? {}).filter(
    (outcome) => outcome.status === "incorrect" || outcome.status === "partial",
  ).length;
  const unansweredCount = Object.values(initialAttempt.questionOutcomes ?? {}).filter(
    (outcome) => outcome.status === "unanswered",
  ).length;

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
                  {initialAttempt.mode === "practice" ? "Practice complete · replay allowed" : "Full mock complete"}
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
                    {score} <span className="text-2xl text-subtle">/ {totalMarks}</span>
                  </p>
                </div>
                {typeof initialAttempt.estimatedBand === "number" && <div>
                  <p className="text-sm font-semibold text-muted">
                    Estimated band
                  </p>
                  <p className="mt-1 text-5xl font-bold text-primary">
                    {initialAttempt.estimatedBand.toFixed(1)}
                  </p>
                </div>}
              </div>
              <p className="mt-6 max-w-2xl type-body-sm text-muted">
                {typeof initialAttempt.estimatedBand === "number"
                  ? "This is an approximate practice estimate, not an official IELTS result."
                  : "Raw score shown. Demo content and one-part practice do not receive a band estimate."}
              </p>
            </div>
            <div className="dark-green-panel p-6 text-white sm:p-8">
              <p className="text-sm font-semibold text-white/70">
                Result insight
              </p>
               <h2 className="mt-3 text-xl font-bold">Review next</h2>
               <p className="mt-2 text-lg font-bold">Check the questions that cost marks</p>
              <p className="mt-3 type-body-sm text-white/75">
                 Reopen the recording evidence and explanation for each answer. A score alone does not diagnose a listening weakness.
              </p>
              <ButtonLink
                href="/tests"
                variant="secondary"
                className="mt-6 w-full"
              >
                Choose another test <ArrowRight className="size-4" />
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
            <ButtonLink href="/tests" variant="secondary">
              Choose another test
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
            <p className="text-sm font-semibold text-muted">Attempt conditions</p>
            <h2 className="mt-1 text-xl font-bold">How to read this result</h2>
            <p className="mt-3 text-sm text-muted">
              {initialAttempt.exposure === "repeat" ? "Repeated material" : "First recorded exposure"}
              {initialAttempt.interruptionCount ? ` · ${initialAttempt.interruptionCount} interruption${initialAttempt.interruptionCount === 1 ? "" : "s"}` : " · no recorded interruptions"}
              {initialAttempt.assistanceUsed ? " · assistance used" : " · no assistance recorded"}
            </p>
          </Card>
          </div>
        </details>

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
                ["all", `All · ${questions.length}`],
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
                outcome={initialAttempt.questionOutcomes?.[question.id]}
                onReport={reportQuestion}
                audioUrl={test.parts.find((part) => part.questions.some((item) => item.id === question.id))?.audioUrl}
                partNumber={test.parts.find((part) => part.questions.some((item) => item.id === question.id))?.partNumber ?? 1}
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
