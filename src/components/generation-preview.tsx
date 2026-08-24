"use client";

import {
  ArrowLeft,
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

const practiceFormats = [
  {
    value: "Full Test",
    label: "Full mock test",
    detail: "All four parts · 40 questions",
  },
  {
    value: "Part 1",
    label: "Everyday conversation",
    detail: "Part 1 · 10 questions",
  },
  {
    value: "Part 2",
    label: "Everyday talk",
    detail: "Part 2 · 10 questions",
  },
  {
    value: "Part 3",
    label: "Academic conversation",
    detail: "Part 3 · 10 questions",
  },
  {
    value: "Part 4",
    label: "Academic lecture",
    detail: "Part 4 · 10 questions",
  },
] as const;

type PracticeFormat = (typeof practiceFormats)[number]["value"];

const listeningStyles = [
  {
    value: "Conversation",
    label: "Conversation",
    detail: "Two people speaking naturally",
  },
  {
    value: "Solo talk",
    label: "Solo talk",
    detail: "One person explaining a topic",
  },
] as const;

type ListeningStyle = (typeof listeningStyles)[number]["value"];

export function GenerationPreview() {
  const [active, setActive] = useState(-1);
  const [reviewing, setReviewing] = useState(false);
  const [source, setSource] = useState<"topic" | "text">("topic");
  const [topic, setTopic] = useState("Artificial Intelligence in Healthcare");
  const [sourceText, setSourceText] = useState("");
  const [difficulty, setDifficulty] = useState("Standard");
  const [format, setFormat] = useState<PracticeFormat>("Full Test");
  const [listeningStyle, setListeningStyle] =
    useState<ListeningStyle>("Conversation");
  const [accent, setAccent] = useState("Mixed UK accents");
  const [pace, setPace] = useState("Exam pace");
  const selectedFormat = practiceFormats.find((item) => item.value === format)!;
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
                onClick={() => {
                  setActive(-1);
                  setReviewing(false);
                }}
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

  if (reviewing) {
    return (
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <Card className="overflow-hidden">
          <div className="border-b bg-gradient-to-br from-primary-soft to-white p-5 sm:p-7">
            <span className="grid size-11 place-items-center rounded-lg bg-white text-primary shadow-sm">
              <ClipboardList className="size-5" />
            </span>
            <h3 className="mt-4 text-xl font-bold">Review your practice</h3>
            <p className="mt-2 type-body-sm text-muted">
              Check the choices below before opening the creation preview.
            </p>
          </div>
          <dl className="grid gap-5 p-5 text-sm sm:grid-cols-2 sm:p-7">
            <div className="sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                Content
              </dt>
              <dd className="mt-1 break-words font-semibold">{sourceSummary}</dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                Practice
              </dt>
              <dd className="mt-1 font-semibold">{selectedFormat.label}</dd>
              <dd className="mt-1 text-xs text-muted">{selectedFormat.detail}</dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                Difficulty
              </dt>
              <dd className="mt-1 font-semibold">{difficulty}</dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                Listening style
              </dt>
              <dd className="mt-1 font-semibold">{listeningStyle}</dd>
              <dd className="mt-1 text-xs text-muted">{accent}</dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                Speaking pace
              </dt>
              <dd className="mt-1 font-semibold">{pace}</dd>
            </div>
          </dl>
          <div className="flex flex-col-reverse gap-3 border-t bg-surface-subtle p-5 sm:flex-row sm:justify-end sm:p-7">
            <Button variant="secondary" onClick={() => setReviewing(false)}>
              <ArrowLeft className="size-4" />
              Edit setup
            </Button>
            <Button onClick={simulate}>
              <Sparkles className="size-4" />
              Start preview
            </Button>
          </div>
        </Card>

        <Card className="p-5 lg:sticky lg:top-24">
          <h3 className="font-bold">What the finished flow will include</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {[
              "A listening scenario based on your source",
              "Questions matched to the selected practice part",
              "Answers and score review after the attempt",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 border-t pt-4 text-xs leading-5 text-subtle">
            This remains a frontend preview. It does not create audio, questions,
            or backend records.
          </p>
        </Card>
      </div>
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
      <div className="mt-5">
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
      </div>
      <fieldset className="mt-6">
        <legend className="text-sm font-semibold">
          What do you want to practise?
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {practiceFormats.map((item) => {
            const selected = format === item.value;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setFormat(item.value)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  selected
                    ? "border-primary bg-primary-soft"
                    : "bg-white hover:border-[#a8b8ac] hover:bg-surface-subtle"
                } ${item.value === "Full Test" ? "sm:col-span-2" : ""}`}
              >
                <span className="block text-sm font-bold">{item.label}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {item.detail}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset className="mt-6 border-t pt-6">
        <legend className="text-sm font-semibold">Listening style</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {listeningStyles.map((item) => {
            const selected = listeningStyle === item.value;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={selected}
                onClick={() => setListeningStyle(item.value)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  selected
                    ? "border-primary bg-primary-soft"
                    : "bg-white hover:border-[#a8b8ac] hover:bg-surface-subtle"
                }`}
              >
                <span className="block text-sm font-bold">{item.label}</span>
                <span className="mt-0.5 block text-xs text-muted">
                  {item.detail}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Accent
          <select
            className={fieldClass}
            value={accent}
            onChange={(event) => setAccent(event.target.value)}
          >
            <option>Mixed UK accents</option>
            <option>British</option>
            <option>Australian</option>
            <option>North American</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Speaking pace
          <select
            className={fieldClass}
            value={pace}
            onChange={(event) => setPace(event.target.value)}
          >
            <option>Comfortable pace</option>
            <option>Exam pace</option>
            <option>Fast challenge</option>
          </select>
        </label>
      </div>
      <Button
        className="mt-7 w-full"
        size="lg"
        onClick={() => setReviewing(true)}
        disabled={!hasEnoughContent}
      >
        <ClipboardList className="size-4" /> Review practice setup
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
                  Practice
                </dt>
                <dd className="mt-1 font-semibold">{selectedFormat.label}</dd>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 border-t pt-4">
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                  Style
                </dt>
                <dd className="mt-1 font-semibold">{listeningStyle}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                  Pace
                </dt>
                <dd className="mt-1 font-semibold">{pace}</dd>
              </div>
            </div>
            <div className="border-t pt-4">
              <dt className="text-xs font-bold uppercase tracking-wide text-subtle">
                Accent
              </dt>
              <dd className="mt-1 font-semibold">{accent}</dd>
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
