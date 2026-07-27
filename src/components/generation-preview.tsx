"use client";

import { CheckCircle2, LoaderCircle, Sparkles } from "lucide-react";
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
      <Card className="mx-auto max-w-2xl p-6 sm:p-8">
        <div className="text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-xl bg-primary-soft text-primary">
            {done ? (
              <CheckCircle2 className="size-7" />
            ) : (
              <LoaderCircle className="size-7 animate-spin" />
            )}
          </span>
          <h3 className="mt-5 text-xl font-bold">
            {done ? "Your demo practice is ready" : steps[active]}
          </h3>
          <p className="mt-2 type-body-sm text-muted">
            {done
              ? "This preview loaded a pre-existing local test. No AI service or real API was called."
              : "Simulating the future generation workflow with local frontend states."}
          </p>
        </div>
        <Progress
          value={(active / (steps.length - 1)) * 100}
          className="mt-7 h-2.5"
          label="Simulated generation progress"
        />
        <div className="mt-6 space-y-2">
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
              <span className={index <= active ? "font-semibold" : "text-subtle"}>
                {step}
              </span>
            </div>
          ))}
        </div>
        {done && (
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/tests/mock-01" className="flex-1">
              Open generated practice
            </ButtonLink>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setActive(-1)}
            >
              Create another
            </Button>
          </div>
        )}
      </Card>
    );
  }

  const fieldClass =
    "mt-1.5 h-11 w-full rounded-lg border bg-white px-3 text-base leading-6 outline-none focus:border-primary focus:ring-3 focus:ring-green-100";
  return (
    <Card className="mx-auto max-w-3xl p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-700">
          <Sparkles className="size-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">Custom AI Practice</h3>
            <Badge variant="amber">Preview · Coming soon</Badge>
          </div>
          <p className="mt-2 type-body-sm text-muted">
            Explore how topic-led practice could work. The demo uses simulated
            progress and loads existing local content.
          </p>
        </div>
      </div>
      <div className="mt-7 grid grid-cols-2 rounded-lg border p-1">
        {[
          ["topic", "Topic"],
          ["text", "Paste text"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setSource(value as "topic" | "text")}
            className={`rounded-md px-3 py-2 text-sm font-semibold ${
              source === value
                ? "bg-primary-soft text-primary"
                : "text-muted"
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
              defaultValue="Artificial Intelligence in Healthcare"
            />
          </label>
        ) : (
          <label className="block text-sm font-semibold">
            Source text
            <textarea
              className="mt-1.5 min-h-32 w-full rounded-lg border p-3 text-base leading-6 outline-none focus:border-primary focus:ring-3 focus:ring-green-100"
              placeholder="Paste your source text here…"
            />
          </label>
        )}
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Difficulty
          <select className={fieldClass}>
            <option>Standard</option>
            <option>Challenging</option>
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Practice format
          <select className={fieldClass}>
            <option>Full Test</option>
            <option>Part 1</option>
            <option>Part 2</option>
            <option>Part 3</option>
            <option>Part 4</option>
          </select>
        </label>
      </div>
      <Button className="mt-7 w-full" size="lg" onClick={simulate}>
        <Sparkles className="size-4" /> Generate Practice
      </Button>
      <p className="mt-3 text-center text-xs text-subtle">
        Frontend simulation only. No content is sent to an external service.
      </p>
    </Card>
  );
}
