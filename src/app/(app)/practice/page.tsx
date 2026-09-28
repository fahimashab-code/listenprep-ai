"use client";

import { ArrowRight, Clock3, Headphones } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { learnerAttemptService, learnerTestService } from "@/lib/api/listenly-service";
import { saveAttempt } from "@/lib/storage";
import type { PublishedTestSummary } from "@/types/listening";

export default function PracticePage() {
  const router = useRouter();
  const [tests, setTests] = useState<PublishedTestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    learnerTestService.list()
      .then((items) => active && setTests(items))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "Practice parts could not be loaded."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  async function startPart(testId: string, partNumber: number) {
    const key = `${testId}:${partNumber}`;
    setStarting(key);
    setError("");
    try {
      const attempt = await learnerAttemptService.create(testId, "practice", partNumber);
      saveAttempt(attempt);
      router.push(`/test/${attempt.id}/setup?mode=practice`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "This practice part could not be started.");
      setStarting("");
    }
  }

  return (
    <>
      <PageHeading
        title="Practise one Part"
        description="Choose one complete listening Part. You can pause, replay and review it without a timed final review."
      />
      {error && <Card className="mb-5 border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</Card>}
      {loading ? (
        <Card className="p-8 text-center text-muted">Loading practice Parts…</Card>
      ) : tests.length === 0 ? (
        <Card className="p-8 text-center"><h2 className="font-bold">No practice material is available</h2><p className="mt-2 text-muted">A reviewed published test is needed before a Part can be selected.</p></Card>
      ) : (
        <div className="space-y-6">
          {tests.map((test) => (
            <Card key={test.id} className="overflow-hidden">
              <div className="border-b p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={test.contentClassification === "reviewed" ? "green" : "amber"}>{test.contentClassification === "reviewed" ? "Reviewed material" : "Demo material"}</Badge>
                  <span className="text-xs text-muted">{test.title}</span>
                </div>
                <h2 className="mt-3 text-xl font-bold">Choose a Part</h2>
              </div>
              <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-6">
                {test.parts.map((part) => {
                  const key = `${test.id}:${part.partNumber}`;
                  return (
                    <div key={part.partNumber} className="rounded-xl border p-4">
                      <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary"><Headphones className="size-5" /></span>
                      <h3 className="mt-3 font-bold">Part {part.partNumber} · {part.title}</h3>
                      <p className="mt-2 text-sm text-muted">{part.context}</p>
                      <p className="mt-3 flex items-center gap-2 text-xs text-muted">
                        <Clock3 className="size-3.5" /> One complete Part · {part.questionCount} mark{part.questionCount === 1 ? "" : "s"}
                      </p>
                      <Button className="mt-4 w-full" variant="secondary" disabled={Boolean(starting)} onClick={() => void startPart(test.id, part.partNumber)}>
                        {starting === key ? "Starting…" : <>Practise Part {part.partNumber} <ArrowRight className="size-4" /></>}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
