"use client";

import {
  CheckCircle2,
  ClipboardList,
  FileText,
  LoaderCircle,
  LockKeyhole,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const steps = [
  "Queued",
  "Creating listening scenario…",
  "Creating questions…",
  "Checking answer order…",
  "Preparing audio…",
  "Ready",
];

export function GenerationPreview() {
  const [active, setActive] = useState(-1);
  const [source, setSource] = useState<"topic" | "text">("topic");
  const [topic, setTopic] = useState("Artificial Intelligence in Healthcare");
  const [sourceText, setSourceText] = useState("");
  const [difficulty, setDifficulty] = useState("Standard");
  const [format, setFormat] = useState("Full Test");
  const hasEnoughContent =
    source === "topic"
      ? topic.trim().length >= 3
      : sourceText.trim().length >= 30;
  const sourceSummary =
    source === "topic"
      ? topic.trim() || "No topic added"
      : sourceText.trim()
        ? `${sourceText.trim().split(/\s+/).length} words of source text`
        : "No source text added";

  async function simulate() {
    setActive(0);
    for (let index = 1; index < steps.length; index += 1) {
      await new Promise((resolve) => setTimeout(resolve, 520));
      setActive(index);
    }
  }

  if (active >= 0) {
    const done = active === steps.length - 1;
    return (
      <Card className="mx-auto max-w-2xl overflow-hidden">
        <div className="border-b bg-gradient-to-br from-primary-soft to-white p-6 text-center sm:p-8">
          <span className="mx-auto grid size-14 place-items-center rounded-xl bg-white text-primary shadow-sm">
            {done ? (
              <CheckCircle2 className="size-7" />
            ) : (
              <LoaderCircle className="size-7 animate-spin" />
            )}
          </span>
          <h3 className="mt-5 text-xl font-bold">
            {done ? "Your practice preview is ready" : steps[active]}
          </h3>
          <p className="mt-2 type-body-sm text-muted">
            {done
              ? "Open the sample practice to see how the finished learner experience works."
              : "Showing how the future creation workflow will progress."}
          </p>
          <Progress
            value={(active / (steps.length - 1)) * 100}
            className="mx-auto mt-7 h-2.5 max-w-lg"
            label="Simulated generation progress"
          />
        </div>
        <div className="p-6 sm:p-8">
          <div className="space-y-2">
            {steps.slice(0, -1).map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3 rounded-lg bg-surface-subtle px-4 py-3 text-sm"
              >
                {index <= active ? (
                  <CheckCircle2 className="size-4 text-primary" />
                ) : (
                  <span className="size-4 rounded-full border" />
                )}
                <span
                  className={index <= active ? "font-semibold" : "text-subtle"}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
          {done && (
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/tests/mock-01" className="flex-1">
                Open sample practice
              </ButtonLink>
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setActive(-1)}
              >
                Adjust setup
              </Button>
            </div>
          )}
          <p className="mt-4 text-center text-xs text-subtle">
            This preview does not call an AI service or create new content.
          </p>
        </div>
      </Card>
    );
  }

  const fieldClass =
    "mt-1.5 h-11 w-full rounded-lg border bg-white px-3 text-base leading-6 outline-none focus:border-primary focus:ring-3 focus:ring-green-100";
  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Card className="p-5 sm:p-7">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-700">
          <Sparkles className="size-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">Set up your practice</h3>
            <Badge variant="amber">Preview</Badge>
          </div>
          <p className="mt-2 type-body-sm text-muted">
            Choose what to practise, then review the setup before opening the
            sample flow.
          </p>
        </div>
      </div>
      <div className="mt-7 grid grid-cols-2 rounded-lg border bg-surface-subtle p-1">
        {[
          ["topic", "Start with a topic"],
          ["text", "Use your own text"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={source === value}
            onClick={() => setSource(value as "topic" | "text")}
            className={`rounded-md px-3 py-2.5 text-sm font-semibold ${
              source === value
                ? "bg-white text-primary shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-5">
        {source === "topic" ? (
          <label className="block text-sm font-semibold">
            Practice topic
            <input
              className={fieldClass}
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="For example, renewable energy"
            />
            <span className="mt-1.5 block text-xs font-normal text-subtle">
              Use a specific topic so the practice has a clear focus.
            </span>
          </label>
        ) : (
          <label className="block text-sm font-semibold">
            Source text
            <textarea
              className="mt-1.5 min-h-36 w-full rounded-lg border bg-white p-3 text-base leading-6 outline-none focus:border-primary focus:ring-3 focus:ring-green-100"
              value={sourceText}
              onChange={(event) => setSourceText(event.target.value)}
              placeholder="Paste at least a short paragraph to base the practice on."
            />
            <span className="mt-1.5 block text-xs font-normal text-subtle">
              Add at least 30 characters for this preview.
            </span>
          </label>
        )}
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Difficulty
          <select
            className={fieldClass}
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value)}
          >
            <option>Standard</option>
            <option>Challenging</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Practice format
          <select
            className={fieldClass}
            value={format}
            onChange={(event) => setFormat(event.target.value)}
          >
            <option>Full Test</option>
            <option>Part 1</option>
            <option>Part 2</option>
            <option>Part 3</option>
            <option>Part 4</option>
          </select>
        </label>
      </div>
      <Button
        className="mt-7 w-full"
        size="lg"
        onClick={simulate}
        disabled={!hasEnoughContent}
      >
        <Sparkles className="size-4" /> Preview creation flow
      </Button>
      {!hasEnoughContent && (
        <p className="mt-2 text-center text-xs text-amber-700">
          Add enough source content to continue.
        </p>
      )}
      </Card>

      <aside
        className="space-y-4 lg:sticky lg:top-24"
        aria-label="Practice setup summary"
      >
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary">
              <ClipboardList className="size-4" />
            </span>
            <h3 className="font-bold">Your setup</h3>
          </div>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                Source
              </dt>
              <dd className="mt-1 break-words font-semibold">{sourceSummary}</dd>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t pt-4">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                  Level
                </dt>
                <dd className="mt-1 font-semibold">{difficulty}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                  Format
                </dt>
                <dd className="mt-1 font-semibold">{format}</dd>
              </div>
            </div>
          </dl>
        </Card>

        <Card className="border-[#cfe3d5] bg-primary-soft/60 p-5">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <h3 className="text-sm font-bold">Safe preview</h3>
              <p className="mt-1 text-xs leading-5 text-muted">
                Your input stays on this page. This demo does not send anything
                to an external service.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex items-start gap-3 px-1 text-xs leading-5 text-subtle">
          <FileText className="mt-0.5 size-4 shrink-0" />
          Generated practice history will appear here when the learner API is
          connected.
        </div>
      </aside>
    </div>
  );
}
