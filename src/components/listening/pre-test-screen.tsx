"use client";

import {
  CheckCircle2,
  Headphones,
  Play,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { saveAttempt } from "@/lib/storage";
import type { ListeningTest } from "@/types/listening";

export function PreTestScreen({
  test,
  attemptId,
  mode,
}: {
  test: ListeningTest;
  attemptId: string;
  mode: "mock" | "practice";
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const [volume, setVolume] = useState(70);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (checking) {
      timeout = setTimeout(() => {
        setChecking(false);
        setChecked(true);
      }, 1300);
    }
    return () => clearTimeout(timeout);
  }, [checking]);

  function start() {
    saveAttempt({
      id: attemptId,
      testId: test.id,
      userId: "demo-alex",
      mode,
      status: "in_progress",
      answers: {},
      currentPart: 1,
      startedAt: new Date().toISOString(),
    });
    router.push(`/test/${attemptId}?mode=${mode}`);
  }

  return (
    <div className="min-h-screen bg-[#f5f8f5]">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-[#176b3a] text-white">
              <Headphones className="size-5" />
            </span>
            <span className="font-bold">{test.title}</span>
          </div>
          <Badge variant={mode === "mock" ? "green" : "gray"}>
            {mode === "mock" ? "Mock Exam" : "Practice Mode"}
          </Badge>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-8 sm:py-12">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#176b3a]">
            Before you begin
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Settle in and check your audio
          </h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-[#69746d]">
            Headphones are recommended. Once the test starts, the screen will
            switch to a distraction-free listening environment.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_330px]">
          <Card className="p-6">
            <h2 className="text-lg font-bold">Test instructions</h2>
            <ul className="mt-5 space-y-4">
              {[
                ["40 questions", "Ten questions in each of four Parts."],
                ["Answer every question", "You can change answers while the test is active."],
                [
                  mode === "mock" ? "Audio plays once" : "Learning controls available",
                  mode === "mock"
                    ? "You cannot pause, rewind, seek or restart the audio."
                    : "You may pause and replay a question block.",
                ],
                ["Respect word limits", "For example: NO MORE THAN TWO WORDS AND/OR A NUMBER."],
              ].map(([title, text]) => (
                <li key={title} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#176b3a]" />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 text-sm leading-6 text-[#69746d]">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {mode === "mock" && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                <strong>Demo restore limitation:</strong> answers and the
                current Part are restored after refresh. Because there is no
                real audio file in this prototype, the simulated progress for
                that Part restarts.
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-[#e8f5ec] text-[#176b3a]">
                <Volume2 className="size-5" />
              </span>
              <div>
                <h2 className="font-bold">Check your audio</h2>
                <p className="mt-0.5 text-xs text-[#69746d]">
                  Simulated test sound
                </p>
              </div>
            </div>
            <div className="mt-6">
              <label className="text-sm font-semibold" htmlFor="volume">
                Volume · {volume}%
              </label>
              <input
                id="volume"
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="mt-3 w-full accent-[#176b3a]"
              />
            </div>
            {checking && (
              <Progress value={70} className="mt-5" label="Playing test sound" />
            )}
            <Button
              variant="secondary"
              className="mt-5 w-full"
              onClick={() => {
                setChecked(false);
                setChecking(true);
              }}
              disabled={checking}
            >
              {checking ? (
                <>
                  <Volume2 className="size-4" /> Playing…
                </>
              ) : checked ? (
                <>
                  <CheckCircle2 className="size-4 text-[#176b3a]" /> Play again
                </>
              ) : (
                <>
                  <Play className="size-4" /> Play test sound
                </>
              )}
            </Button>
            {checked && (
              <p className="mt-3 text-center text-xs font-semibold text-[#176b3a]">
                Audio check complete
              </p>
            )}
            <div className="mt-6 border-t pt-5">
              <Button size="lg" className="w-full" onClick={start}>
                <ShieldCheck className="size-4" /> Start Listening Test
              </Button>
              <p className="mt-3 text-center text-xs leading-5 text-[#7a857e]">
                Starting confirms that you understand the instructions.
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
