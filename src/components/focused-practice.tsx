"use client";

import { ArrowLeft, CheckCircle2, RotateCcw, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { QuestionRenderer } from "@/components/listening/question-renderer";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { isAnswerCorrect } from "@/lib/scoring";
import { mockTestOne, practiceExercises } from "@/mock-data/listening-tests";
import type { UserAnswer } from "@/types/listening";

export function FocusedPractice({ slug }: { slug: string }) {
  const exercise =
    practiceExercises.find((item) => item.slug === slug) ??
    practiceExercises.find((item) => item.slug === "multiple-choice")!;
  const [answers, setAnswers] = useState<Record<string, UserAnswer>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = useMemo(() => {
    if (slug === "part-1") return mockTestOne.parts[0].questions;
    if (slug === "part-3") return mockTestOne.parts[2].questions;
    if (slug === "part-2" || slug === "map-plan")
      return mockTestOne.parts[1].questions;
    if (slug === "part-4") return mockTestOne.parts[3].questions;
    if (slug === "completion") return mockTestOne.parts[0].questions;
    return mockTestOne.parts
      .flatMap((part) => part.questions)
      .filter((question) => question.type === "multiple_choice")
      .slice(0, 10);
  }, [slug]);

  const score = questions.filter((question) =>
    isAnswerCorrect(question, answers[question.id]),
  ).length;

  if (submitted) {
    return (
      <div className="mx-auto max-w-3xl">
        <ButtonLink href="/practice" variant="ghost" size="sm" className="-ml-3">
          <ArrowLeft className="size-4" /> Practice home
        </ButtonLink>
        <Card className="mt-4 overflow-hidden">
          <div className="bg-[#174f30] p-7 text-white sm:p-9">
            <Badge className="border-white/20 bg-white/10 text-white">
              Focused practice complete
            </Badge>
            <p className="mt-6 text-sm text-white/70">Your score</p>
            <p className="mt-1 text-5xl font-bold">
              {score} <span className="text-2xl text-white/65">/ {questions.length}</span>
            </p>
          </div>
          <div className="p-6 sm:p-8">
            <div className="rounded-xl bg-amber-50 p-5">
              <div className="flex gap-3">
                <Target className="mt-0.5 size-5 text-amber-700" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Main issue
                  </p>
                  <h3 className="mt-1 font-bold text-amber-950">
                    Change-of-mind distractors
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-amber-900">
                    Listen for the speaker’s final decision after words such as
                    “actually”, “on reflection”, and “instead”.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {questions
                .filter(
                  (question) =>
                    !isAnswerCorrect(question, answers[question.id]),
                )
                .slice(0, 3)
                .map((question) => (
                  <div key={question.id} className="rounded-lg border p-4 text-sm">
                    <p className="font-bold">Question {question.number}</p>
                    <p className="mt-1 text-[#69746d]">
                      Correct answer: {question.acceptedAnswers[0]}
                    </p>
                    {question.distractor && (
                      <p className="mt-2 leading-6 text-[#566159]">
                        {question.distractor.explanation}
                      </p>
                    )}
                  </div>
                ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <RotateCcw className="size-4" /> Practice again
              </Button>
              <ButtonLink href="/dashboard" variant="secondary" size="lg">
                Return to Dashboard
              </ButtonLink>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <ButtonLink href="/practice" variant="ghost" size="sm" className="-ml-3">
        <ArrowLeft className="size-4" /> Practice home
      </ButtonLink>
      <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Badge variant="green">{exercise.category.replace("_", " ")}</Badge>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">
            {exercise.title}
          </h2>
          <p className="mt-2 max-w-2xl leading-7 text-[#69746d]">
            {exercise.description}
          </p>
        </div>
        <div className="shrink-0 text-sm">
          <p className="font-semibold">Your current accuracy</p>
          <p className="mt-1 text-2xl font-bold text-[#176b3a]">
            {exercise.accuracy}%
          </p>
        </div>
      </div>

      <Card className="mt-6 border-blue-200 bg-blue-50/40 p-5">
        <h3 className="font-bold text-blue-950">Before you start</h3>
        <p className="mt-1 text-sm leading-6 text-blue-900">
          Multiple-choice questions often mention several possible answers.
          Focus on the speaker’s final or intended meaning, not just the first
          familiar word you hear.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {exercise.focus.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
      </Card>

      <div className="sticky top-16 z-10 mt-6 rounded-xl border bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">
            {Object.keys(answers).filter((key) => answers[key] !== "").length} of{" "}
            {questions.length} answered
          </span>
          <span className="text-[#69746d]">Answers saved in this session</span>
        </div>
        <Progress
          value={
            (Object.keys(answers).filter((key) => answers[key] !== "").length /
              questions.length) *
            100
          }
          className="mt-3"
        />
      </div>

      <div className="mt-4 space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="p-5 sm:p-6">
            <div className="flex gap-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e8f5ec] text-sm font-bold text-[#176b3a]">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-6">{question.prompt}</p>
                <div className="mt-4">
                  <QuestionRenderer
                    question={question}
                    answer={answers[question.id]}
                    onChange={(answer) =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: answer,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-6 flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
        <div className="flex gap-3">
          <CheckCircle2 className="size-5 text-[#176b3a]" />
          <div>
            <p className="font-bold">Ready to check your answers?</p>
            <p className="mt-1 text-sm text-[#69746d]">
              You can review explanations after submitting this practice.
            </p>
          </div>
        </div>
        <Button
          size="lg"
          onClick={() => {
            localStorage.setItem(
              "listenly-last-practice",
              `${score}/${questions.length} in ${exercise.title}`,
            );
            setSubmitted(true);
          }}
        >
          Finish practice
        </Button>
      </Card>
    </div>
  );
}
