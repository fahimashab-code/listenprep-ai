import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Check,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Headphones,
  Map,
  MessageSquareText,
  ShieldCheck,
  Target,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const practiceCards = [
  ["Full Listening Mock", "40 questions · 4 Parts", ClipboardCheck],
  ["Part 1", "Social conversation", MessageSquareText],
  ["Part 2", "Social monologue", Headphones],
  ["Part 3", "Educational discussion", BookOpenCheck],
  ["Part 4", "Academic monologue", BarChart3],
  ["Question Types", "Focused skill practice", Target],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
          <Brand />
          <nav className="hidden items-center gap-7 text-sm font-semibold text-muted md:flex">
            <a href="#practice" className="hover:text-primary">
              Practice
            </a>
            <a href="#how-it-works" className="hover:text-primary">
              How it works
            </a>
            <a href="#structure" className="hover:text-primary">
              Test structure
            </a>
            <ButtonLink href="/login" variant="ghost" size="sm">
              Sign in
            </ButtonLink>
            <ButtonLink href="/register" size="sm">
              Create account
            </ButtonLink>
          </nav>
          <ButtonLink href="/login" size="sm" className="md:hidden">
            Start
          </ButtonLink>
        </div>
      </header>

      <main>
        <section className="landing-hero surface-grid overflow-hidden border-b">
          <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 py-16 sm:px-8 md:py-24 lg:grid-cols-[1.08fr_.92fr] lg:py-28">
            <div>
              <Badge variant="green" className="mb-5">
                Full IELTS Listening practice
              </Badge>
              <h1 className="type-display max-w-2xl text-ink">
                Take a Full{" "}
                <span className="text-primary">IELTS Listening Mock.</span>
              </h1>
              <p className="type-lead mt-6 max-w-xl text-muted">
                Complete all 4 Parts and 40 questions in a focused,
                real-test-style experience. Then review your mistakes and know
                exactly what to practise next.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href="/register" size="lg">
                  Start Full Mock <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink href="/tests" variant="secondary" size="lg">
                  <ClipboardCheck className="size-4" /> Browse published tests
                </ButtonLink>
              </div>
              <p className="mt-5 flex items-center gap-2 text-sm text-muted">
                <Check className="size-4 text-primary" />
                Original practice content. No payment card required.
              </p>
              <div className="mt-7 grid max-w-xl grid-cols-3 gap-3">
                {[
                  { label: "4 Parts", text: "Complete format", icon: ClipboardCheck },
                  { label: "40 Questions", text: "Full mock", icon: FileCheck2 },
                  { label: "~30 min", text: "Realistic timing", icon: Clock3 },
                ].map(({ label, text, icon: Icon }) => (
                  <div
                    key={label}
                    className="rounded-xl border bg-surface/80 p-3 shadow-sm backdrop-blur"
                  >
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                    <p className="mt-2 text-sm font-bold">{label}</p>
                    <p className="text-[11px] text-muted">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[470px]">
              <div className="absolute -left-8 -top-8 size-44 rounded-full bg-primary-soft blur-sm" />
              <div className="absolute -bottom-8 -right-8 size-36 rounded-full bg-primary-soft" />
              <Card className="relative overflow-hidden p-6 shadow-[var(--shadow-elevated)] sm:p-8">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-[#67ae79] to-[#c6e6cf]" />
                <div className="flex items-start justify-between border-b pb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">
                      Before you begin
                    </p>
                    <h2 className="mt-2 text-xl font-bold">A clear listening test flow</h2>
                  </div>
                  <span className="grid size-11 place-items-center rounded-xl border border-primary/25 bg-primary-soft text-primary shadow-sm">
                    <Headphones className="size-5" />
                  </span>
                </div>
                <div className="space-y-3 py-6">
                  {[
                    {
                      icon: Headphones,
                      title: "Check your audio",
                      text: "Confirm your headphones and volume first.",
                    },
                    {
                      icon: ClipboardCheck,
                      title: "Complete all four parts",
                      text: "Answer 40 questions with your progress saved.",
                    },
                    {
                      icon: FileCheck2,
                      title: "Review your result",
                      text: "See your real score only after submission.",
                    },
                  ].map(({ icon: Icon, title, text }) => (
                    <div key={title} className="flex items-start gap-3 rounded-xl bg-surface-subtle p-4">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <p className="font-bold">{title}</p>
                        <p className="mt-1 text-sm text-muted">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary-soft px-4 py-3 text-sm font-semibold text-primary-strong">
                  <Check className="size-4" />
                  Results are based on your completed answers
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8"
        >
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              A simple improvement loop
            </p>
            <h2 className="type-marketing-title mt-3">
              Practise. Understand. Improve.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Practice", "Take a full IELTS-style Listening test or focus on one Part."],
              ["02", "Understand", "See exactly which questions you missed, with transcript evidence and explanations."],
              ["03", "Improve", "Practise your weak question types and track progress over time."],
            ].map(([number, title, text]) => (
              <Card
                key={title}
                className="group relative overflow-hidden p-6 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
              >
                <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-sm font-bold text-primary">
                  {number}
                </span>
                <h3 className="mt-4 text-xl font-bold">{title}</h3>
                <p className="mt-2 leading-7 text-muted">{text}</p>
                <ArrowRight className="absolute bottom-6 right-6 size-4 text-subtle opacity-0 transition-all group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
              </Card>
            ))}
          </div>
        </section>

        <section id="practice" className="bg-surface-subtle py-20">
          <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
                  What you can practise
                </p>
                <h2 className="type-marketing-title mt-3">
                  Every part and common question formats.
                </h2>
              </div>
              <p className="type-body-sm max-w-md text-muted">
                Start with a realistic mock or use a short focused session when
                you have less time.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {practiceCards.map(([title, text, Icon]) => (
                <Card
                  key={String(title)}
                  className="group flex items-center gap-4 p-5 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-bold">{String(title)}</h3>
                    <p className="mt-1 text-sm text-muted">{String(text)}</p>
                  </div>
                  <ArrowRight className="ml-auto size-4 text-subtle group-hover:translate-x-1 group-hover:text-primary" />
                </Card>
              ))}
              <Card className="flex items-center gap-4 border-dashed p-5">
                <span className="grid size-11 place-items-center rounded-lg bg-surface-subtle text-subtle">
                  <Map className="size-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">Custom Practice</h3>
                    <Badge>Coming soon</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    Topic-led listening practice
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        <section
          id="structure"
          className="mx-auto grid max-w-[1180px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[.75fr_1.25fr]"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">
              IELTS Listening structure
            </p>
            <h2 className="type-marketing-title mt-3">
              Build confidence across all four Parts.
            </h2>
            <p className="mt-4 leading-7 text-muted">
              Difficulty generally increases from an everyday conversation to
              an academic monologue.
            </p>
            <div className="mt-7 rounded-xl bg-[#17201a] p-5 text-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/70">Full mock</span>
                <strong>40 questions</strong>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-white/70">Mock Exam audio</span>
                <strong>Played once</strong>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Part 1", "Social conversation", "Everyday booking, services, travel"],
              ["Part 2", "Social monologue", "Community places, tours, facilities"],
              ["Part 3", "Educational discussion", "Students, tutors, training"],
              ["Part 4", "Academic monologue", "Lecture-style presentation"],
            ].map(([part, title, text]) => (
              <Card
                key={part}
                className="group relative overflow-hidden p-5 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span className="absolute -right-1 -top-5 text-7xl font-black text-primary/[0.045]">
                  {part.replace("Part ", "")}
                </span>
                <span className="text-sm font-bold text-primary">{part}</span>
                <h3 className="mt-3 text-lg font-bold">{title}</h3>
                <p className="type-body-sm mt-2 text-muted">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="dark-green-panel px-5 py-16 text-white">
          <div className="mx-auto flex max-w-[920px] flex-col items-center text-center">
            <h2 className="type-marketing-title">
              Take your first full Listening mock
            </h2>
            <p className="mt-3 max-w-xl text-white/75">
              Discover what you already do well and what to practise next.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-white/70">
              <ShieldCheck className="size-4 text-[#a8dab7]" />
              Focused practice · Clear feedback · No distractions
            </div>
            <ButtonLink
              href="/login"
              variant="secondary"
              size="lg"
              className="mt-7"
            >
              Create your account <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </section>
      </main>

      <footer className="border-t bg-surface">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-5 py-8 text-sm text-muted sm:px-8 md:flex-row md:items-center md:justify-between">
          <Brand compact />
          <p>
            IELTS-style practice. Not affiliated with IELTS, Cambridge, British
            Council or IDP.
          </p>
        </div>
      </footer>
    </div>
  );
}
