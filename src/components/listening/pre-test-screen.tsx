"use client";

import {
  CheckCircle2,
  Headphones,
  Play,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { learnerAttemptService } from "@/lib/api/listenly-service";
import { saveAttempt } from "@/lib/storage";
import type { ListeningTest, TestAttempt } from "@/types/listening";

export function PreTestScreen({
  test,
  attemptId,
  mode,
  initialAttempt,
}: {
  test: ListeningTest;
  attemptId: string;
  mode: "mock" | "practice";
  initialAttempt: TestAttempt;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);
  const [volume, setVolume] = useState(70);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState("");

  const audioReady =
    test.parts.length > 0 && test.parts.every((part) => Boolean(part.audioUrl));

  async function playTestSound() {
    setChecking(true);
    setChecked(false);
    setStartError("");
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 440;
      gain.gain.value = volume / 100;
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.7);
      oscillator.onended = () => {
        void context.close();
        setChecking(false);
        setChecked(true);
      };
    } catch {
      setChecking(false);
      setStartError("Your browser could not play the audio check.");
    }
  }

  async function start() {
    setStarting(true);
    setStartError("");
    const attempt: TestAttempt = {
      ...initialAttempt,
      status: "in_progress",
      phase: "part_preview",
      startedAt: initialAttempt.startedAt ?? new Date().toISOString(),
    };
    try {
      saveAttempt(attempt);
      await learnerAttemptService.save(attempt);
      const query = new URLSearchParams({ mode });
      router.push(`/test/${attemptId}?${query.toString()}`);
    } catch (reason) {
      setStartError(reason instanceof Error ? reason.message : "The test could not be started.");
      setStarting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="border-b bg-surface">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-contrast">
              <Headphones className="size-5" />
            </span>
            <span className="font-bold">{test.title}</span>
          </div>
          <Badge variant={mode === "mock" ? "green" : "gray"}>
            {mode === "mock" ? "Mock Test" : "Practice"}
          </Badge>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-8 sm:py-12">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
            Before you begin
          </p>
          <h1 className="type-page-title mt-3">
            Settle in and check your audio
          </h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-muted">
            Headphones are recommended. Once the test starts, the screen will
            switch to a distraction-free listening environment.
          </p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_330px]">
          <Card className="p-6">
            <h2 className="text-lg font-bold">Test instructions</h2>
            <ul className="mt-5 space-y-4">
              {[
                [`${test.questionCount} questions`, `${test.parts.length} published Parts.`],
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
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="font-semibold">{title}</p>
                    <p className="mt-1 type-body-sm text-muted">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            {!audioReady && (
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 type-body-sm text-amber-900">
                <strong>Audio unavailable:</strong> this test cannot start
                until the administrator publishes audio for every Part.
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
                <Volume2 className="size-5" />
              </span>
              <div>
                <h2 className="font-bold">Check your audio</h2>
                <p className="mt-0.5 text-xs text-muted">
                  Browser sound check
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
                className="mt-3 w-full accent-primary"
              />
            </div>
            {checking && (
              <Progress value={70} className="mt-5" label="Playing test sound" />
            )}
            <Button
              variant="secondary"
              className="mt-5 w-full"
              onClick={() => void playTestSound()}
              disabled={checking}
            >
              {checking ? (
                <>
                  <Volume2 className="size-4" /> Playing…
                </>
              ) : checked ? (
                <>
                  <CheckCircle2 className="size-4 text-primary" /> Play again
                </>
              ) : (
                <>
                  <Play className="size-4" /> Play test sound
                </>
              )}
            </Button>
            {checked && (
              <p className="mt-3 text-center text-xs font-semibold text-primary">
                Audio check complete
              </p>
            )}
            <div className="mt-6 border-t pt-5">
              {startError && <p className="mb-3 text-sm font-semibold text-red-700">{startError}</p>}
              <Button
                size="lg"
                className="w-full"
                onClick={() => void start()}
                disabled={!audioReady || !checked || starting}
              >
                <ShieldCheck className="size-4" /> {starting ? "Starting…" : "Start Listening Test"}
              </Button>
              <p className="mt-3 text-center text-xs leading-5 text-subtle">
                {checked
                  ? "Starting confirms that you understand the instructions."
                  : "Play the test sound before starting."}
              </p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
