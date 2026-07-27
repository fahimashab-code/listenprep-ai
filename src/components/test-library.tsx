"use client";

import { Clock3, FileCheck2, Headphones, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { loadAttempt } from "@/lib/storage";
import type { ListeningTest, TestAttempt } from "@/types/listening";

function countAnswers(attempt: TestAttempt) {
  return Object.values(attempt.answers).filter((answer) =>
    Array.isArray(answer)
      ? answer.length > 0
      : String(answer ?? "").trim() !== "",
  ).length;
}

export function TestLibrary({ tests }: { tests: ListeningTest[] }) {
  const [attempts, setAttempts] = useState<Record<string, TestAttempt>>({});

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setAttempts(
        Object.fromEntries(
          tests.flatMap((test) => {
            const attempt = loadAttempt(`${test.id}-demo-attempt`);
            return attempt ? [[test.id, attempt]] : [];
          }),
        ),
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, [tests]);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {tests.map((test) => {
        const attempt = attempts[test.id];
        const status =
          attempt?.status === "completed"
            ? "completed"
            : attempt?.status === "in_progress" ||
                attempt?.status === "final_review"
              ? "in_progress"
              : "not_started";
        const answered = attempt ? countAnswers(attempt) : 0;

        return (
          <Card key={test.id} className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-lg bg-primary-soft text-primary">
                <Headphones className="size-5" />
              </span>
              <Badge
                variant={
                  status === "completed"
                    ? "green"
                    : status === "in_progress"
                      ? "amber"
                      : "gray"
                }
              >
                {status === "completed"
                  ? "Completed"
                  : status === "in_progress"
                    ? "In progress"
                    : "Not started"}
              </Badge>
            </div>

            <h3 className="mt-5 text-xl font-bold">{test.title}</h3>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-2">
                <FileCheck2 className="size-4" /> 40 questions
              </span>
              <span>4 Parts</span>
              <span className="flex items-center gap-2">
                <Clock3 className="size-4" /> ~
                {test.estimatedDurationMinutes} min
              </span>
            </div>

            <div className="mt-5 flex flex-col justify-between gap-4 border-t pt-5 sm:flex-row sm:items-center">
              {status === "completed" ? (
                <div>
                  <p className="text-sm text-muted">Your result</p>
                  <p className="mt-0.5 font-bold">
                    {attempt.rawScore ?? 0} / 40{" "}
                    <span className="font-normal text-muted">
                      · Estimated ~{attempt.estimatedBand?.toFixed(1) ?? "—"}
                    </span>
                  </p>
                </div>
              ) : status === "in_progress" ? (
                <div>
                  <p className="text-sm text-muted">
                    {attempt.status === "final_review"
                      ? "Final review"
                      : `Part ${attempt.currentPart} of 4`}
                  </p>
                  <p className="mt-0.5 font-bold">{answered} / 40 answered</p>
                </div>
              ) : (
                <span className="text-sm text-muted">Ready when you are</span>
              )}

              <div className="flex gap-2">
                {status === "completed" && (
                  <ButtonLink
                    href={`/results/${attempt.id}`}
                    variant="secondary"
                    size="sm"
                  >
                    Review
                  </ButtonLink>
                )}
                <ButtonLink
                  href={
                    status === "in_progress"
                      ? `/test/${attempt.id}?mode=${attempt.mode}`
                      : `/tests/${test.id}`
                  }
                  size="sm"
                >
                  {status === "completed" ? (
                    <>
                      <RotateCcw className="size-4" /> Retake
                    </>
                  ) : status === "in_progress" ? (
                    "Continue"
                  ) : (
                    "View test"
                  )}
                </ButtonLink>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
