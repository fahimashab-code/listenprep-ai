import { ArrowRight, Target, TrendingUp } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { ScoreChart } from "@/components/score-chart";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { progressData } from "@/mock-data/listening-tests";

export default function ProgressPage() {
  return (
    <>
      <PageHeading
        title="Your Listening Progress"
        description="A practical view of whether your full-mock scores and listening skills are improving."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-[#bddbc5] bg-[#174f30] p-5 text-white">
          <p className="text-sm font-semibold text-white/70">
            Current estimated performance
          </p>
          <p className="mt-3 text-4xl font-bold">7.0</p>
          <p className="mt-3 text-xs text-white/65">
            Practice estimate, not an official result
          </p>
        </Card>
        {[
          ["Recent average", "30 / 40"],
          ["Best", "34 / 40"],
          ["Tests completed", "12"],
        ].map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="text-sm font-semibold text-[#69746d]">{label}</p>
            <p className="mt-3 text-3xl font-bold">{value}</p>
            <p className="mt-3 text-xs text-[#7a857e]">Full Listening mocks</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold text-[#69746d]">
              Last 7 full mocks
            </p>
            <h3 className="mt-1 text-xl font-bold">Score trend</h3>
          </div>
          <Badge variant="green">
            <TrendingUp className="mr-1 size-3.5" /> Improving
          </Badge>
        </div>
        <div className="mt-4">
          <ScoreChart scores={progressData.recentScores} />
        </div>
        <p className="mt-3 text-sm text-[#69746d]">
          Your recent average has increased from 26 to 31 questions. Day-to-day
          variation is normal; the overall direction is positive.
        </p>
      </Card>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-[#69746d]">
                Accuracy by section
              </p>
              <h3 className="mt-1 text-xl font-bold">Part performance</h3>
            </div>
            <Target className="size-5 text-[#176b3a]" />
          </div>
          <div className="mt-6 space-y-5">
            {progressData.partPerformance.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-semibold">{item.label}</span>
                  <span
                    className={
                      item.value === 62
                        ? "font-bold text-amber-700"
                        : "text-[#69746d]"
                    }
                  >
                    {item.value}%
                  </span>
                </div>
                <Progress
                  value={item.value}
                  indicatorClassName={
                    item.value === 62 ? "bg-amber-500" : undefined
                  }
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between rounded-lg bg-amber-50 p-4">
            <div>
              <p className="text-xs font-semibold text-amber-800">Weakest Part</p>
              <p className="mt-1 font-bold text-amber-950">Part 3 · 62%</p>
            </div>
            <ButtonLink href="/practice/part-3" size="sm">
              Practice Part 3
            </ButtonLink>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="text-sm font-semibold text-[#69746d]">
            Accuracy by format
          </p>
          <h3 className="mt-1 text-xl font-bold">Question-type performance</h3>
          <div className="mt-6 space-y-4">
            {progressData.questionTypePerformance.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[130px_1fr_40px] items-center gap-3 text-sm sm:grid-cols-[160px_1fr_44px]"
              >
                <span className="font-semibold">{item.label}</span>
                <Progress
                  value={item.value}
                  indicatorClassName={
                    item.value < 65 ? "bg-amber-500" : undefined
                  }
                />
                <span className="text-right text-[#69746d]">{item.value}%</span>
              </div>
            ))}
          </div>
          <ButtonLink
            href="/practice/multiple-choice"
            variant="secondary"
            className="mt-7 w-full"
          >
            Practice weakest question type <ArrowRight className="size-4" />
          </ButtonLink>
        </Card>
      </div>

      <Card className="mt-6 p-5 sm:p-6">
        <p className="text-sm font-semibold text-[#69746d]">
          Learning analytics
        </p>
        <h3 className="mt-1 text-xl font-bold">Skill progress</h3>
        <p className="mt-2 text-sm text-[#69746d]">
          These are learning categories, not official IELTS scoring criteria.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {progressData.skillPerformance.map((item) => (
            <div key={item.label} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold">{item.label}</p>
                  <p className="mt-1 text-2xl font-bold">{item.value}%</p>
                </div>
                <Badge
                  variant={item.trend === "improving" ? "green" : "amber"}
                >
                  {item.trend === "improving" ? "↑ improving" : "Needs practice"}
                </Badge>
              </div>
              <Progress
                value={item.value}
                className="mt-4"
                indicatorClassName={
                  item.trend === "needs practice" ? "bg-amber-500" : undefined
                }
              />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
