"use client";

import { Clock3, FileCheck2, Headphones, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ListeningTest } from "@/types/listening";

const filters = [
  ["all", "All"],
  ["not_started", "Not Started"],
  ["completed", "Completed"],
] as const;

export function TestLibrary({ tests }: { tests: ListeningTest[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number][0]>("all");
  const visible = tests.filter(
    (test) => filter === "all" || test.status === filter,
  );

  return (
    <>
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border bg-white p-1 sm:w-fit">
        {filters.map(([value, label]) => (
          <button
            key={value}
            className={cn(
              "whitespace-nowrap rounded-md px-4 py-2 text-sm font-semibold",
              filter === value
                ? "bg-primary-soft text-primary"
                : "text-muted hover:bg-gray-50",
            )}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {visible.map((test) => (
          <Card key={test.id} className="p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-lg bg-primary-soft text-primary">
                <Headphones className="size-5" />
              </span>
              <Badge
                variant={
                  test.status === "completed"
                    ? "green"
                    : test.status === "in_progress"
                      ? "amber"
                      : "gray"
                }
              >
                {test.status === "not_started"
                  ? "Not started"
                  : test.status === "in_progress"
                    ? "In progress"
                    : "Completed"}
              </Badge>
            </div>
            <h3 className="mt-5 text-xl font-bold">{test.title}</h3>
            <p className="mt-2 type-body-sm text-muted">
              {test.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-y py-4 text-sm text-muted">
              <span className="flex items-center gap-2">
                <FileCheck2 className="size-4" /> 40 questions
              </span>
              <span>4 Parts</span>
              <span className="flex items-center gap-2">
                <Clock3 className="size-4" />
                {test.estimatedDurationMinutes} min
              </span>
              <span className="capitalize">{test.difficulty}</span>
            </div>
            <div className="mt-5 flex items-center justify-between gap-4">
              {test.status === "completed" ? (
                <div>
                  <p className="text-sm text-muted">Previous score</p>
                  <p className="mt-0.5 font-bold">
                    {test.previousScore} / 40{" "}
                    <span className="font-normal text-muted">
                      · Est. 6.5
                    </span>
                  </p>
                </div>
              ) : test.status === "in_progress" ? (
                <div>
                  <p className="text-sm text-muted">Current progress</p>
                  <p className="mt-0.5 font-bold">22 / 40 questions</p>
                </div>
              ) : (
                <span className="text-sm text-muted">
                  Ready when you are
                </span>
              )}
              <div className="flex gap-2">
                {test.status === "completed" && (
                  <ButtonLink
                    href="/results/history-07"
                    variant="secondary"
                    size="sm"
                  >
                    Review
                  </ButtonLink>
                )}
                <ButtonLink href={`/tests/${test.id}`} size="sm">
                  {test.status === "completed" ? (
                    <>
                      <RotateCcw className="size-4" /> Retake
                    </>
                  ) : test.status === "in_progress" ? (
                    "Continue"
                  ) : (
                    "View test"
                  )}
                </ButtonLink>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
