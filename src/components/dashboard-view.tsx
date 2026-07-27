"use client";

import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  Headphones,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ScoreChart } from "@/components/score-chart";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const weakAreas = [
  { label: "Multiple Choice", value: 58, href: "/practice/multiple-choice" },
  { label: "Map Labelling", value: 64, href: "/practice/map-plan" },
  { label: "Speaker Opinion", value: 67, href: "/practice/part-3" },
  { label: "Numbers & Dates", value: 71, href: "/practice/completion" },
];

export function DashboardView() {
  const [recentPractice, setRecentPractice] = useState<string | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setRecentPractice(localStorage.getItem("listenly-last-practice"));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#69746d]">Monday, 27 July</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Good morning, Alex
        </h2>
        <p className="mt-2 text-[#69746d]">
          Your next useful step is ready.
        </p>
      </div>

      {recentPractice && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900">
          <CheckCircle2 className="size-5 shrink-0 text-green-700" />
          <p>
            <strong>Practice progress updated.</strong> Your latest focused
            session ({recentPractice}) has been saved to this demo profile.
          </p>
        </div>
      )}

      <Card className="overflow-hidden border-[#bddbc5]">
        <div className="grid lg:grid-cols-[1fr_310px]">
          <div className="p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <Badge variant="green">Continue your preparation</Badge>
              <span className="text-xs font-semibold text-[#7a857e]">
                Saved
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-bold">Continue Listening Mock 04</h3>
            <p className="mt-2 max-w-xl leading-7 text-[#69746d]">
              You stopped during Part 3. Your answers and place in the test have
              been saved.
            </p>
            <div className="mt-5 max-w-xl">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold">22 of 40 questions</span>
                <span className="text-[#69746d]">55%</span>
              </div>
              <Progress value={55} className="h-2.5" label="Test progress" />
            </div>
            <ButtonLink
              href="/test/mock-01-demo-attempt/setup?mode=mock"
              className="mt-6"
              size="lg"
            >
              Continue test <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="relative hidden overflow-hidden bg-[#174f30] p-7 text-white lg:block">
            <div className="absolute -right-12 -top-12 size-44 rounded-full border-[32px] border-white/5" />
            <Headphones className="size-8 text-[#a8dab7]" />
            <p className="mt-8 text-sm text-white/70">Current position</p>
            <p className="mt-1 text-xl font-bold">Part 3 · Questions 21–30</p>
            <div className="mt-8 flex items-center gap-3 text-sm text-white/75">
              <Clock3 className="size-4" />
              About 14 minutes remaining
            </div>
          </div>
        </div>
      </Card>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#176b3a]">
              Recommended next action
            </p>
            <h3 className="mt-1 text-xl font-bold">Recommended for you</h3>
          </div>
          <ButtonLink href="/practice" variant="ghost" size="sm">
            View all
          </ButtonLink>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="flex flex-col p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-lg bg-amber-50 text-amber-700">
                <Lightbulb className="size-5" />
              </span>
              <Badge variant="amber">Highest priority</Badge>
            </div>
            <h4 className="mt-5 text-lg font-bold">Change-of-mind distractors</h4>
            <p className="mt-2 flex-1 text-sm leading-6 text-[#69746d]">
              You missed 4 recent questions where a speaker corrected their
              first answer.
            </p>
            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <span className="text-sm text-[#69746d]">
                10 questions · ~8 min
              </span>
              <ButtonLink href="/practice/multiple-choice" size="sm">
                Start practice
              </ButtonLink>
            </div>
          </Card>
          <Card className="flex flex-col p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-lg bg-[#e8f5ec] text-[#176b3a]">
                <BookOpenCheck className="size-5" />
              </span>
              <Badge variant="green">Part focus</Badge>
            </div>
            <h4 className="mt-5 text-lg font-bold">Part 3 — Speaker opinions</h4>
            <p className="mt-2 flex-1 text-sm leading-6 text-[#69746d]">
              Your Part 3 accuracy is currently 62%, with speaker opinion
              questions needing the most attention.
            </p>
            <div className="mt-5 flex items-center justify-between border-t pt-4">
              <span className="text-sm text-[#69746d]">
                10 questions · ~8 min
              </span>
              <ButtonLink href="/practice/part-3" variant="secondary" size="sm">
                Start practice
              </ButtonLink>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-bold">Current performance</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <span className="text-sm font-semibold text-[#69746d]">
                Estimated Listening Band
              </span>
              <Target className="size-5 text-[#176b3a]" />
            </div>
            <p className="mt-4 text-4xl font-bold text-[#176b3a]">7.0</p>
            <p className="mt-2 text-xs leading-5 text-[#7a857e]">
              Practice estimate, based on recent performance.
            </p>
          </Card>
          {[
            ["Recent average", "29 / 40", TrendingUp],
            ["Best score", "33 / 40", Sparkles],
            ["Tests completed", "7", Headphones],
          ].map(([label, value, Icon]) => (
            <Card key={String(label)} className="p-5">
              <div className="flex items-start justify-between">
                <span className="text-sm font-semibold text-[#69746d]">
                  {String(label)}
                </span>
                <Icon className="size-5 text-[#7a857e]" />
              </div>
              <p className="mt-4 text-3xl font-bold">{String(value)}</p>
              <p className="mt-3 text-xs text-[#7a857e]">
                Across full Listening mocks
              </p>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-[#69746d]">
                Last five full mocks
              </p>
              <h3 className="mt-1 text-xl font-bold">Your improvement</h3>
            </div>
            <Badge variant="green">+6 questions</Badge>
          </div>
          <div className="mt-4">
            <ScoreChart scores={[25, 27, 28, 30, 31]} compact />
          </div>
          <p className="mt-2 text-sm text-[#69746d]">
            You have improved by 6 questions over your last five tests.
          </p>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#69746d]">
                Based on recent answers
              </p>
              <h3 className="mt-1 text-xl font-bold">Your weakest areas</h3>
            </div>
            <Target className="size-5 text-[#176b3a]" />
          </div>
          <div className="mt-5 space-y-5">
            {weakAreas.map((area) => (
              <div key={area.label}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold">{area.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[#69746d]">{area.value}%</span>
                    <a
                      href={area.href}
                      className="font-bold text-[#176b3a] hover:underline"
                    >
                      Practice →
                    </a>
                  </div>
                </div>
                <Progress
                  value={area.value}
                  indicatorClassName={
                    area.value < 65 ? "bg-amber-500" : "bg-[#176b3a]"
                  }
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
