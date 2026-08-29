"use client";

import { ArrowRight, CheckCircle2, ClipboardList, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { PageHeading } from "@/components/page-heading";
import { ScoreChart } from "@/components/score-chart";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLearnerAttempts } from "@/hooks/use-learner-attempts";

export function ProgressView() {
  const { attempts, loading, error } = useLearnerAttempts();
  const completed = useMemo(
    () =>
      attempts
        .filter(
          (attempt) =>
            attempt.status === "completed" &&
            typeof attempt.rawScore === "number",
        )
        .sort(
          (a, b) =>
            new Date(b.completedAt ?? b.startedAt ?? 0).getTime() -
            new Date(a.completedAt ?? a.startedAt ?? 0).getTime(),
        ),
    [attempts],
  );
  const latest = completed[0];
  const recent = completed.slice(0, 7);
  const recentScores = recent.map((attempt) => attempt.rawScore ?? 0).reverse();
  const average = recent.length
    ? recent.reduce((total, attempt) => total + (attempt.rawScore ?? 0), 0) /
      recent.length
    : 0;
  const best = completed.length
    ? Math.max(...completed.map((attempt) => attempt.rawScore ?? 0))
    : 0;
  const scoreChange =
    recent.length > 1
      ? (recent[0].rawScore ?? 0) - (recent[recent.length - 1].rawScore ?? 0)
      : null;

  return (
    <>
      <PageHeading
        title="Your Listening Progress"
        description="See results from the listening tests you have actually completed."
      />

      {loading && completed.length === 0 ? (
        <Card className="p-8 text-center text-muted">Loading your progress…</Card>
      ) : completed.length === 0 ? (
        <Card className="p-8 text-center sm:p-12">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary-soft text-primary">
            <ClipboardList className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-bold">No completed tests yet</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted">
            Complete your first published listening test to see scores and progress here.
          </p>
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          <ButtonLink href="/tests" className="mt-6">
            Browse published tests <ArrowRight className="size-4" />
          </ButtonLink>
        </Card>
      ) : (
        <>
          {error && (
            <Card className="mb-5 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Live progress could not be refreshed. Showing saved results from this browser.
            </Card>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Card className="border-primary/30 bg-brand-panel p-5 text-brand-panel-contrast">
              <p className="text-sm font-semibold text-white/70">Latest estimated band</p>
              <p className="mt-3 text-4xl font-bold">
                {typeof latest.estimatedBand === "number"
                  ? latest.estimatedBand.toFixed(1)
                  : "—"}
              </p>
              <p className="mt-3 text-xs text-white/70">
                Practice estimate, not an official IELTS result
              </p>
            </Card>
            {[
              ["Recent average", `${average.toFixed(1)} / 40`],
              ["Best score", `${best} / 40`],
              ["Tests completed", String(completed.length)],
            ].map(([label, value]) => (
              <Card key={label} className="p-5">
                <p className="text-sm font-semibold text-muted">{label}</p>
                <p className="mt-3 text-3xl font-bold">{value}</p>
                <p className="mt-3 text-xs text-subtle">Completed listening tests</p>
              </Card>
            ))}
          </div>

          <Card className="mt-6 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-semibold text-muted">
                  {recent.length === 1 ? "Your first result" : `Last ${recent.length} results`}
                </p>
                <h3 className="mt-1 text-xl font-bold">Score history</h3>
              </div>
              {scoreChange !== null && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-sm font-semibold text-primary">
                  <TrendingUp className="size-4" />
                  {scoreChange > 0
                    ? `${scoreChange} more correct`
                    : scoreChange < 0
                      ? `${Math.abs(scoreChange)} fewer correct`
                      : "Same score"}
                </span>
              )}
            </div>
            <div className="mt-4">
              <ScoreChart scores={recentScores} />
            </div>
            <p className="mt-3 text-sm text-muted">
              Scores can vary between tests. Use answer review to understand each mistake.
            </p>
          </Card>

          <Card className="mt-6 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                  <CheckCircle2 className="size-5" />
                </span>
                <div>
                  <h3 className="font-bold">Review your latest answers</h3>
                  <p className="mt-1 text-sm text-muted">
                    Part and question-type breakdowns will appear when answer-level analytics are available.
                  </p>
                </div>
              </div>
              <ButtonLink href={`/results/${latest.id}`} variant="secondary" size="sm">
                Review latest result <ArrowRight className="size-4" />
              </ButtonLink>
            </div>
          </Card>
        </>
      )}
    </>
  );
}
