import {
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Headphones,
  LockKeyhole,
  PlayCircle,
} from "lucide-react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { listeningTests } from "@/mock-data/listening-tests";

export function generateStaticParams() {
  return listeningTests.map((test) => ({ testId: test.id }));
}

export default async function TestDetailsPage({
  params,
}: PageProps<"/tests/[testId]">) {
  const { testId } = await params;
  const test = listeningTests.find((item) => item.id === testId);
  if (!test) notFound();
  const attemptId = `${test.id}-demo-attempt`;

  return (
    <div className="mx-auto max-w-5xl">
      <ButtonLink href="/tests" variant="ghost" size="sm" className="-ml-3 mb-4">
        <ArrowLeft className="size-4" /> Back to tests
      </ButtonLink>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="green">IELTS Listening mock</Badge>
            </div>
            <h2 className="type-page-title mt-5">
              {test.title}
            </h2>
            <p className="mt-3 max-w-2xl leading-7 text-muted">
              {test.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-5 border-t pt-5 text-sm font-semibold text-muted">
              <span>40 questions</span>
              <span>4 Parts</span>
              <span className="flex items-center gap-2">
                <Clock3 className="size-4" /> Approximately{" "}
                {test.estimatedDurationMinutes} minutes
              </span>
              <span>+ final review time</span>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold">Test structure</h3>
            <div className="mt-5 divide-y">
              {test.parts.map((part) => {
                const partLabels = [
                  "Everyday conversation",
                  "Everyday monologue",
                  "Educational discussion",
                  "Academic monologue",
                ];
                return (
                <div
                  key={part.partNumber}
                  className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[90px_1fr_auto] sm:items-center"
                >
                  <span className="font-bold text-primary">
                    Part {part.partNumber}
                  </span>
                  <div>
                    <p className="font-semibold">
                      {partLabels[part.partNumber - 1]}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {part.context}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-muted">
                    10 questions
                  </span>
                </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
              <LockKeyhole className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold">Mock Test</h3>
            <p className="mt-2 type-body-sm text-muted">
              Practise under real-test-style conditions. Audio plays once with
              no pause, replay, transcript, or feedback before submission.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted">
              {["Audio plays once", "Answers remain editable", "Results after submission"].map(
                (item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ),
              )}
            </ul>
            <ButtonLink
              href={`/test/${attemptId}/setup?mode=mock`}
              className="mt-5 w-full"
            >
              <PlayCircle className="size-4" /> Start Mock Test
            </ButtonLink>
          </Card>
          <Card className="p-5">
            <span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <BookOpenCheck className="size-5" />
            </span>
            <h3 className="mt-4 text-lg font-bold">Practice</h3>
            <p className="mt-2 type-body-sm text-muted">
              Learn at your own pace and review your answers after attempting
              the questions.
            </p>
            <ButtonLink
              href={`/test/${attemptId}/setup?mode=practice`}
              variant="secondary"
              className="mt-5 w-full"
            >
              <Headphones className="size-4" /> Start Practice
            </ButtonLink>
          </Card>
        </div>
      </div>
    </div>
  );
}
