"use client";

import { ArrowLeft, BookOpenCheck, CheckCircle2, Clock3, Headphones, LockKeyhole, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { learnerAttemptService, learnerTestService } from "@/lib/api/listenly-service";
import { saveAttempt } from "@/lib/storage";
import type { ListeningTest } from "@/types/listening";

export function TestDetails({ testId }: { testId: string }) {
  const router = useRouter();
  const [test, setTest] = useState<ListeningTest>();
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState<"mock" | "practice" | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    learnerTestService.get(testId)
      .then((item) => active && setTest(item))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "Test could not be loaded."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [testId]);

  async function start(mode: "mock" | "practice") {
    setStarting(mode);
    setError("");
    try {
      const attempt = await learnerAttemptService.create(testId, mode);
      saveAttempt(attempt);
      router.push(`/test/${attempt.id}/setup?mode=${mode}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The attempt could not be started.");
      setStarting(null);
    }
  }

  if (loading) return <Card className="p-8 text-center text-muted">Loading test…</Card>;
  if (!test) return <Card className="p-8 text-center"><h2 className="text-lg font-bold">Test unavailable</h2><p className="mt-2 text-muted">{error || "This test may have been archived."}</p><Link href="/tests" className="mt-4 inline-block font-semibold text-primary">Back to tests</Link></Card>;

  const labels = ["Everyday conversation", "Everyday monologue", "Educational discussion", "Academic monologue"];
  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/tests" className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink"><ArrowLeft className="size-4" /> Back to tests</Link>
      {error && <Card className="mb-4 border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</Card>}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="p-6 sm:p-8"><Badge variant="green">IELTS Listening mock</Badge><h2 className="type-page-title mt-5">{test.title}</h2><p className="mt-3 max-w-2xl leading-7 text-muted">{test.description}</p><div className="mt-6 flex flex-wrap gap-5 border-t pt-5 text-sm font-semibold text-muted"><span>{test.questionCount} questions</span><span>{test.parts.length} Parts</span><span className="flex items-center gap-2"><Clock3 className="size-4" /> Approximately {test.estimatedDurationMinutes} minutes</span></div></Card>
          <Card className="p-6"><h3 className="text-lg font-bold">Test structure</h3><div className="mt-5 divide-y">{test.parts.map((part) => <div key={part.partNumber} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[90px_1fr_auto] sm:items-center"><span className="font-bold text-primary">Part {part.partNumber}</span><div><p className="font-semibold">{labels[part.partNumber - 1]}</p><p className="mt-1 text-sm text-muted">{part.context}</p></div><span className="text-sm font-semibold text-muted">{part.questions.length} questions</span></div>)}</div></Card>
        </div>
        <div className="space-y-4">
          <Card className="p-5"><span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary"><LockKeyhole className="size-5" /></span><h3 className="mt-4 text-lg font-bold">Mock Test</h3><p className="mt-2 type-body-sm text-muted">Audio plays once. Results and correct answers appear only after submission.</p><ul className="mt-4 space-y-2 text-sm text-muted">{["Audio plays once", "Answers remain editable", "Results after submission"].map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}</ul><Button onClick={() => void start("mock")} disabled={starting !== null} className="mt-5 w-full"><PlayCircle className="size-4" />{starting === "mock" ? "Starting…" : "Start Mock Test"}</Button></Card>
          <Card className="p-5"><span className="grid size-10 place-items-center rounded-lg bg-blue-50 text-blue-700"><BookOpenCheck className="size-5" /></span><h3 className="mt-4 text-lg font-bold">Practice</h3><p className="mt-2 type-body-sm text-muted">Learn at your own pace with pause and review controls.</p><Button onClick={() => void start("practice")} disabled={starting !== null} variant="secondary" className="mt-5 w-full"><Headphones className="size-4" />{starting === "practice" ? "Starting…" : "Start Practice"}</Button></Card>
        </div>
      </div>
    </div>
  );
}
