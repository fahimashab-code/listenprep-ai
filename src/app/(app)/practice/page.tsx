import {
  ArrowRight,
  BookOpenCheck,
  CalendarClock,
  Headphones,
  Map,
  MessageSquareText,
  SpellCheck2,
  Target,
} from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const parts = [
  ["Part 1", "Social conversation", "/practice/part-1"],
  ["Part 2", "Social monologue", "/practice/part-2"],
  ["Part 3", "Educational discussion", "/practice/part-3"],
  ["Part 4", "Academic monologue", "/practice/part-4"],
];

const questionTypes = [
  ["Multiple Choice", "58% accuracy", "/practice/multiple-choice", MessageSquareText],
  ["Matching", "71% accuracy", "/practice/matching", BookOpenCheck],
  ["Map / Plan", "68% accuracy", "/practice/map-plan", Map],
  ["Completion", "82% accuracy", "/practice/completion", SpellCheck2],
  ["Sentence Completion", "79% accuracy", "/practice/completion", Target],
  ["Short Answer", "76% accuracy", "/practice/completion", Headphones],
];

const skills = [
  "Numbers & Dates",
  "Names & Spelling",
  "Directions",
  "Speaker Opinions",
  "Corrections & Changes",
  "Paraphrasing",
  "Negation & Contrast",
  "Academic Vocabulary",
];

export default function PracticePage() {
  return (
    <>
      <PageHeading
        title="Practice Listening Skills"
        description="Use a short, focused exercise to improve the skill that is currently costing you the most marks."
      />
      <Card className="overflow-hidden border-primary/35">
        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="p-6 sm:p-8">
            <Badge variant="green">Recommended for you</Badge>
            <h3 className="mt-4 text-2xl font-bold">
              Part 3 — Speaker Opinions
            </h3>
            <p className="mt-2 max-w-xl leading-7 text-muted">
              Based on recent mistakes. Your Part 3 accuracy is 62%, and
              changes of opinion are the main issue.
            </p>
            <div className="mt-5 flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-2">
                <CalendarClock className="size-4" /> 8 minutes
              </span>
              <span>10 questions</span>
            </div>
            <ButtonLink href="/practice/part-3" className="mt-6">
              Start practice <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="hidden place-items-center bg-primary-strong lg:grid">
            <div className="grid size-28 place-items-center rounded-full border border-white/15 bg-white/5 text-white">
              <Headphones className="size-12" />
            </div>
          </div>
        </div>
      </Card>

      <section className="mt-8">
        <h3 className="text-xl font-bold">Practice by Part</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {parts.map(([title, text, href]) => (
            <ButtonLink
              key={title}
              href={href}
              variant="secondary"
              className="h-auto items-start justify-between p-5 text-left"
            >
              <span>
                <strong className="block">{title}</strong>
                <span className="mt-1 block text-xs font-normal text-muted">
                  {text}
                </span>
              </span>
              <ArrowRight className="mt-1 size-4" />
            </ButtonLink>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-bold">Practice by Question Type</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {questionTypes.map(([title, accuracy, href, Icon]) => (
            <Card key={String(title)} className="flex items-center gap-4 p-5">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                <Icon className="size-5" />
              </span>
              <div>
                <h4 className="font-bold">{String(title)}</h4>
                <p className="mt-1 text-xs text-muted">{String(accuracy)}</p>
              </div>
              <ButtonLink
                href={String(href)}
                variant="ghost"
                size="sm"
                className="ml-auto px-2"
              >
                <ArrowRight className="size-4" />
              </ButtonLink>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h3 className="text-xl font-bold">Practice by Listening Skill</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <ButtonLink
              key={skill}
              href={
                skill.includes("Opinion") || skill.includes("Correction")
                  ? "/practice/multiple-choice"
                  : "/practice/completion"
              }
              variant="secondary"
              size="sm"
            >
              {skill}
            </ButtonLink>
          ))}
        </div>
      </section>

      <Card className="mt-8 flex flex-col justify-between gap-4 border-dashed p-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold">Create Custom Practice</h3>
            <Badge variant="amber">Preview</Badge>
          </div>
          <p className="mt-1 text-sm text-muted">
            Choose a topic and preview a practice created with local demo data.
          </p>
        </div>
        <ButtonLink href="/generate" variant="secondary">
          Create practice <ArrowRight className="size-4" />
        </ButtonLink>
      </Card>
    </>
  );
}
