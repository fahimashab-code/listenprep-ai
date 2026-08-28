"use client";

import { ArrowRight, CalendarDays, Clock3, Headphones } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLearnerAttempts } from "@/hooks/use-learner-attempts";
import { learnerTestService } from "@/lib/api/listenly-service";
import type { PublishedTestSummary, TestAttempt } from "@/types/listening";

function formatDate(attempt: TestAttempt) {
  const value = attempt.completedAt ?? attempt.startedAt;
  if (!value) return "Date unavailable";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatDuration(attempt: TestAttempt) {
  if (!attempt.startedAt || !attempt.completedAt) return "—";
  const milliseconds =
    new Date(attempt.completedAt).getTime() - new Date(attempt.startedAt).getTime();
  if (!Number.isFinite(milliseconds) || milliseconds < 0) return "—";
  return `${Math.max(1, Math.round(milliseconds / 60000))}m`;
}

export function HistoryView() {
  const { attempts, loading, error } = useLearnerAttempts();
  const [tests, setTests] = useState<PublishedTestSummary[]>([]);

  useEffect(() => {
    let active = true;
    learnerTestService.list().then((items) => {
      if (active) setTests(items);
    }).catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const completed = useMemo(
    () =>
      attempts
        .filter((attempt) => attempt.status === "completed")
        .sort(
          (a, b) =>
            new Date(b.completedAt ?? b.startedAt ?? 0).getTime() -
            new Date(a.completedAt ?? a.startedAt ?? 0).getTime(),
        ),
    [attempts],
  );
  const titles = useMemo(
    () => new Map(tests.map((test) => [test.id, test.title])),
    [tests],
  );

  return (
    <>
      <PageHeading
        title="Listening History"
        description="Open completed tests to review your answers and results."
      />

      {loading && completed.length === 0 ? (
        <Card className="p-8 text-center text-muted">Loading your history…</Card>
      ) : completed.length === 0 ? (
        <Card className="p-8 text-center sm:p-12">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-primary-soft text-primary">
            <Headphones className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-bold">No completed tests yet</h2>
          <p className="mx-auto mt-2 max-w-lg text-muted">
            Your completed listening tests will appear here with their real scores and review links.
          </p>
          {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
          <ButtonLink href="/tests" className="mt-6">
            Choose a listening test <ArrowRight className="size-4" />
          </ButtonLink>
        </Card>
      ) : (
        <>
          {error && (
            <Card className="mb-5 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Live history could not be refreshed. Showing saved results from this browser.
            </Card>
          )}

          <Card className="hidden overflow-hidden md:block">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-surface-subtle text-xs uppercase tracking-wide text-muted">
                <tr>
                  {[
                    "Test",
                    "Type",
                    "Date",
                    "Score",
                    "Estimated band",
                    "Duration",
                    "Action",
                  ].map((heading) => (
                    <th key={heading} className="px-5 py-4 font-bold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {completed.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-surface-subtle">
                    <td className="px-5 py-4 font-bold">
                      {titles.get(attempt.testId) ?? "Listening test"}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={attempt.mode === "mock" ? "green" : "gray"}>
                        {attempt.mode === "mock" ? "Mock test" : "Practice"}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-muted">{formatDate(attempt)}</td>
                    <td className="px-5 py-4 font-bold">
                      {typeof attempt.rawScore === "number" ? `${attempt.rawScore} / 40` : "—"}
                    </td>
                    <td className="px-5 py-4">
                      {typeof attempt.estimatedBand === "number"
                        ? `~${attempt.estimatedBand.toFixed(1)}`
                        : "—"}
                    </td>
                    <td className="px-5 py-4 text-muted">{formatDuration(attempt)}</td>
                    <td className="px-5 py-4">
                      <ButtonLink href={`/results/${attempt.id}`} variant="ghost" size="sm">
                        Review <ArrowRight className="size-4" />
                      </ButtonLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="grid gap-3 md:hidden">
            {completed.map((attempt) => (
              <Card key={attempt.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                      <Headphones className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate font-bold">
                        {titles.get(attempt.testId) ?? "Listening test"}
                      </h3>
                      <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                        <CalendarDays className="size-3.5" /> {formatDate(attempt)}
                      </p>
                    </div>
                  </div>
                  <p className="shrink-0 text-xl font-bold">
                    {typeof attempt.rawScore === "number" ? `${attempt.rawScore}/40` : "—"}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                    <Badge variant={attempt.mode === "mock" ? "green" : "gray"}>
                      {attempt.mode === "mock" ? "Mock" : "Practice"}
                    </Badge>
                    {typeof attempt.estimatedBand === "number" && (
                      <span>Estimated ~{attempt.estimatedBand.toFixed(1)}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock3 className="size-3.5" /> {formatDuration(attempt)}
                    </span>
                  </div>
                  <ButtonLink href={`/results/${attempt.id}`} variant="ghost" size="sm">
                    Review
                  </ButtonLink>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
