"use client";

import { useEffect, useState } from "react";
import { ExamInterface } from "@/components/listening/exam-interface";
import { PreTestScreen } from "@/components/listening/pre-test-screen";
import { ResultView } from "@/components/results/result-view";
import { Card } from "@/components/ui/card";
import { hasLiveApi, learnerAttemptService, learnerTestService } from "@/lib/api/listenly-service";
import { loadAttempt, saveAttempt } from "@/lib/storage";
import type { AttemptWithReview, ListeningTest } from "@/types/listening";

export function AttemptRouteLoader({ attemptId, view, requestedMode = "mock", demoEnabled = false }: {
  attemptId: string;
  view: "setup" | "exam" | "result";
  requestedMode?: "mock" | "practice";
  demoEnabled?: boolean;
}) {
  const [attempt, setAttempt] = useState<AttemptWithReview>();
  const [test, setTest] = useState<ListeningTest>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const current: AttemptWithReview | null = hasLiveApi
          ? await learnerAttemptService.get(attemptId)
          : loadAttempt(attemptId);
        if (!current) throw new Error("This attempt could not be found.");
        const currentTest = current.reviewTest ?? await learnerTestService.get(current.testId);
        if (!currentTest) throw new Error("The test for this attempt is unavailable.");
        saveAttempt(current);
        if (active) { setAttempt(current); setTest(currentTest); }
      } catch (reason) {
        if (active) setError(reason instanceof Error ? reason.message : "This attempt could not be loaded.");
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => { active = false; };
  }, [attemptId]);

  if (loading) return <div className="min-h-screen bg-surface-subtle p-6"><Card className="mx-auto max-w-xl p-8 text-center text-muted">Loading your attempt…</Card></div>;
  if (!attempt || !test) return <div className="min-h-screen bg-surface-subtle p-6"><Card className="mx-auto max-w-xl border-red-200 bg-red-50 p-8 text-center text-red-800">{error}</Card></div>;
  if (view === "setup") return <PreTestScreen test={test} attemptId={attemptId} mode={attempt.mode ?? requestedMode} demoEnabled={demoEnabled} initialAttempt={attempt} />;
  if (view === "exam") return <ExamInterface test={test} attemptId={attemptId} requestedMode={attempt.mode ?? requestedMode} demoEnabled={demoEnabled} initialAttempt={attempt} />;
  return <ResultView test={attempt.reviewTest ?? test} attemptId={attemptId} initialAttempt={attempt} />;
}
