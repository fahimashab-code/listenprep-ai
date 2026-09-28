"use client";

import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  Flag,
  Headphones,
  LogOut,
  Pause,
  Play,
  Save,
  Timer,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CompletionTemplateRenderer,
  isCompletionTemplateUsable,
  QuestionRenderer,
} from "@/components/listening/question-renderer";
import { Badge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  FINAL_REVIEW_SECONDS,
  PART_PREVIEW_SECONDS,
} from "@/config/listening-timing";
import { questionSlotCount } from "@/lib/scoring";
import { learnerAttemptService } from "@/lib/api/listenly-service";
import { acknowledgeAttempt, saveAttempt } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type {
  ListeningPart,
  ListeningQuestion,
  ListeningTest,
  TestAttempt,
  UserAnswer,
} from "@/types/listening";

function hasAnswer(answer?: UserAnswer) {
  return Array.isArray(answer)
    ? answer.length > 0
    : String(answer ?? "").trim() !== "";
}

function answeredSlots(question: ListeningQuestion, answer?: UserAnswer) {
  if (question.maxSelections && question.maxSelections > 1) {
    return Math.min(
      question.maxSelections,
      Array.isArray(answer) ? answer.filter(Boolean).length : 0,
    );
  }
  return hasAnswer(answer) ? 1 : 0;
}

function lastQuestionNumber(question: ListeningQuestion) {
  return question.number + questionSlotCount(question) - 1;
}

function PartVisual({ part }: { part: ListeningPart }) {
  const question = part.questions.find((item) =>
    ["map_labelling", "diagram_labelling"].includes(item.type),
  );
  if (!question?.imageUrl) return null;
  return (
    <Card className="mt-4 p-5 sm:p-6">
      <p className="mb-4 text-sm font-bold">
        {question.imageAlt || "Map, plan or diagram"}
      </p>
      {/* Admin-authored visuals may be compact data URLs. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={question.imageUrl}
        alt={question.imageAlt || "Question visual"}
        className="mx-auto max-h-[560px] w-auto rounded-xl border object-contain"
      />
    </Card>
  );
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function partLabel(partNumber: number) {
  return [
    "Everyday conversation",
    "Everyday monologue",
    "Educational discussion",
    "Academic monologue",
  ][partNumber - 1];
}

export function ExamInterface({
  test,
  attemptId,
  initialAttempt: loadedAttempt,
}: {
  test: ListeningTest;
  attemptId: string;
  initialAttempt: TestAttempt;
}) {
  const router = useRouter();
  const reviewDuration = FINAL_REVIEW_SECONDS;
  const initialPart = test.parts.find((part) => part.partNumber === loadedAttempt.currentPart) ?? test.parts[0];
  const initialPreviewDuration = initialPart.readingTimeSeconds ?? PART_PREVIEW_SECONDS;
  const [attempt, setAttempt] = useState<TestAttempt>(loadedAttempt);
  const attemptRef = useRef(attempt);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPersistedAudioSecond = useRef(-1);
  const submittingRef = useRef(false);
  const autoSubmittedRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const questionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [hydrated, setHydrated] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioError, setAudioError] = useState("");
  const [previewSeconds, setPreviewSeconds] = useState(initialPreviewDuration);
  const [reviewSeconds, setReviewSeconds] = useState(0);
  const [volume, setVolume] = useState(70);
  const [paused, setPaused] = useState(false);
  const [saved, setSaved] = useState(true);
  const [exitOpen, setExitOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [activeQuestionId, setActiveQuestionId] = useState(
    test.parts[0].questions[0].id,
  );

  const allQuestions = useMemo(
    () => test.parts.flatMap((part) => part.questions),
    [test.parts],
  );
  const currentPart = test.parts.find((part) => part.partNumber === attempt.currentPart) ?? test.parts[0];
  const previewDuration = currentPart.readingTimeSeconds ?? PART_PREVIEW_SECONDS;
  const currentPartIndex = test.parts.findIndex((part) => part.partNumber === currentPart.partNumber);
  const isLastPart = currentPartIndex === test.parts.length - 1;
  const answeredCount = allQuestions.reduce(
    (total, question) =>
      total + answeredSlots(question, attempt.answers[question.id]),
    0,
  );
  const totalQuestionSlots = allQuestions.reduce(
    (total, question) => total + questionSlotCount(question),
    0,
  );
  const unansweredCount = totalQuestionSlots - answeredCount;
  const markedCount = allQuestions.reduce(
    (total, question) =>
      total +
      (attempt.markedForReview.includes(question.id)
        ? questionSlotCount(question)
        : 0),
    0,
  );

  useEffect(() => {
    attemptRef.current = attempt;
  }, [attempt]);

  useEffect(() => {
    const titleId = exitOpen
      ? "exit-title"
      : submitOpen
        ? "submit-title"
        : undefined;
    if (!titleId) return;
    const dialogTitleId = titleId;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(dialogTitleId)?.focus();
    });

    function handleDialogKeyDown(event: KeyboardEvent) {
      const dialog = document.querySelector<HTMLElement>(
        `[role="dialog"][aria-labelledby="${dialogTitleId}"]`,
      );
      if (!dialog) return;

      if (event.key === "Escape") {
        if (exitOpen) setExitOpen(false);
        else if (!submittingRef.current) setSubmitOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable.at(-1)!;
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog || document.activeElement === document.getElementById(dialogTitleId))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleDialogKeyDown);
      previouslyFocused?.focus();
    };
  }, [exitOpen, submitOpen]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const restored = loadedAttempt;
      if (restored?.status === "completed") {
        router.replace(`/results/${attemptId}`);
        return;
      }
      if (
        restored &&
        (restored.status === "in_progress" ||
          restored.status === "final_review")
      ) {
        const restoredAttempt =
          restored.status === "final_review" && !restored.reviewEndsAt
            ? {
                ...restored,
                phase: "final_review" as const,
                reviewEndsAt: new Date(
                  Date.now() + reviewDuration * 1000,
                ).toISOString(),
              }
            : restored;
        setAttempt(restoredAttempt);
        attemptRef.current = restoredAttempt;
        if (restoredAttempt.phase === "part_preview") {
          setPreviewSeconds(previewDuration);
          setActiveQuestionId(
            (test.parts.find((part) => part.partNumber === restoredAttempt.currentPart) ?? test.parts[0]).questions[0].id,
          );
        }
      }
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [attemptId, loadedAttempt, previewDuration, reviewDuration, router, test.parts]);

  useEffect(() => {
    if (!hydrated || submitting || attempt.status === "completed") return;
    saveAttempt(attempt, true);
    const timeout = window.setTimeout(() => {
      learnerAttemptService.save(attempt)
        .then(() => {
          acknowledgeAttempt(attempt);
          if (attemptRef.current === attempt) { setSaved(true); setSaveError(""); }
        })
        .catch((reason: unknown) => {
          if (attemptRef.current !== attempt || submittingRef.current) return;
          setSaved(false);
          setSaveError(reason instanceof Error ? reason.message : "Your progress could not be saved.");
        });
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [attempt, hydrated, submitting]);

  const startPart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      setAudioError(`Audio is unavailable for Part ${attemptRef.current.currentPart}.`);
      return;
    }
    const restoredPosition = attemptRef.current.mode === "practice"
      ? Number(attemptRef.current.playbackPositions?.[String(attemptRef.current.currentPart)] ?? 0)
      : 0;
    setAudioSeconds(restoredPosition);
    setPaused(false);
    setAudioError("");
    setAttempt((current) => ({
      ...current,
      status: "in_progress",
      phase: "part_playing",
    }));
    audio.currentTime = restoredPosition;
    void audio.play().catch(() => {
      setPaused(true);
      setAudioError("Audio could not start automatically. Use Resume audio to continue.");
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!hydrated || attempt.phase !== "part_preview" || !currentPart.audioUrl) return;
    const timer = window.setInterval(() => {
      setPreviewSeconds((seconds) => {
        if (seconds <= 1) {
          window.setTimeout(startPart, 0);
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [attempt.phase, currentPart.audioUrl, hydrated, startPart]);

  const enterFinalReview = useCallback(() => {
    const reviewEndsAt = attemptRef.current.mode === "mock"
      ? new Date(Date.now() + reviewDuration * 1000).toISOString()
      : undefined;
    setPaused(true);
    setReviewSeconds(attemptRef.current.mode === "mock" ? reviewDuration : 0);
    setAttempt((current) => ({
      ...current,
      status: "final_review",
      phase: "final_review",
      reviewEndsAt,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [reviewDuration]);

  const finishCurrentPart = useCallback(() => {
    audioRef.current?.pause();
    setPaused(true);
    setAttempt((current) =>
      !isLastPart
        ? { ...current, phase: "part_transition" }
        : current,
    );
    if (isLastPart) enterFinalReview();
  }, [enterFinalReview, isLastPart]);

  useEffect(() => {
    if (!currentPart.audioUrl) {
      audioRef.current = null;
      const frame = window.requestAnimationFrame(() => setAudioDuration(0));
      return () => window.cancelAnimationFrame(frame);
    }
    const audio = new Audio(currentPart.audioUrl);
    audio.preload = "metadata";
    audio.volume = 0.7;
    const updateTime = () => {
      const seconds = Math.floor(audio.currentTime);
      setAudioSeconds(seconds);
      if (
        attemptRef.current.mode === "practice" &&
        seconds >= 0 &&
        seconds % 5 === 0 &&
        lastPersistedAudioSecond.current !== seconds
      ) {
        lastPersistedAudioSecond.current = seconds;
        setAttempt((current) => ({
          ...current,
          playbackPositions: {
            ...current.playbackPositions,
            [String(current.currentPart)]: seconds,
          },
        }));
      }
    };
    const updateDuration = () => {
      setAudioDuration(audio.duration || 0);
      const restoredAttempt = attemptRef.current;
      const restoredPosition = Number(
        restoredAttempt.playbackPositions?.[String(currentPart.partNumber)] ?? 0,
      );
      if (
        restoredAttempt.mode === "practice" &&
        restoredAttempt.phase === "part_playing" &&
        restoredPosition > 0 &&
        restoredPosition < audio.duration
      ) {
        audio.currentTime = restoredPosition;
        setAudioSeconds(Math.floor(restoredPosition));
      }
    };
    const fail = () => setAudioError(`Audio could not be loaded for Part ${currentPart.partNumber}.`);
    const finish = () => finishCurrentPart();
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("error", fail);
    audio.addEventListener("ended", finish);
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("error", fail);
      audio.removeEventListener("ended", finish);
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [currentPart.audioUrl, currentPart.partNumber, finishCurrentPart]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    function recordHiddenMock() {
      if (
        document.visibilityState === "hidden" &&
        attemptRef.current.mode === "mock" &&
        attemptRef.current.phase === "part_playing"
      ) {
        setAttempt((current) => ({
          ...current,
          interruptionCount: (current.interruptionCount ?? 0) + 1,
        }));
      }
    }
    document.addEventListener("visibilitychange", recordHiddenMock);
    return () => document.removeEventListener("visibilitychange", recordHiddenMock);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || attempt.phase !== "part_playing") return;
    if (paused || exitOpen || submitOpen) {
      audio.pause();
    } else {
      void audio.play().catch(() => {
        setPaused(true);
        setAudioError("Select Resume audio to continue playback.");
      });
    }
  }, [attempt.phase, exitOpen, paused, submitOpen]);

  const playbackDuration = audioDuration || 1;

  const submitAttempt = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setSubmitOpen(true);
    setSubmitError("");
    const current = attemptRef.current;
    saveAttempt(current, true);
    try {
      const result = await learnerAttemptService.submit(current);
      saveAttempt(result);
      router.push(`/results/${attemptId}`);
    } catch (reason) {
      submittingRef.current = false;
      setSubmitting(false);
      setSubmitOpen(true);
      setSubmitError(reason instanceof Error ? reason.message : "The attempt could not be submitted. Please try again.");
    }
  }, [attemptId, router]);

  useEffect(() => {
    if (!hydrated || attempt.phase !== "final_review" || attempt.mode === "practice") return;

    function updateReviewTimer() {
      const end = new Date(
        attemptRef.current.reviewEndsAt ??
          Date.now() + reviewDuration * 1000,
      ).getTime();
      const remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      setReviewSeconds(remaining);
      if (remaining === 0 && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        void submitAttempt();
      }
    }

    updateReviewTimer();
    const timer = window.setInterval(updateReviewTimer, 250);
    return () => window.clearInterval(timer);
  }, [
    attempt.phase,
    attempt.reviewEndsAt,
    attempt.mode,
    hydrated,
    reviewDuration,
    submitAttempt,
  ]);

  function setAnswer(questionId: string, answer: UserAnswer) {
    setSaved(false);
    setAttempt((current) => {
      const next = {
        ...current,
        answers: { ...current.answers, [questionId]: answer },
      };
      attemptRef.current = next;
      saveAttempt(next, true);
      return next;
    });
  }

  function toggleReview(questionId: string) {
    setSaved(false);
    setAttempt((current) => {
      const next = {
        ...current,
        markedForReview: current.markedForReview.includes(questionId)
          ? current.markedForReview.filter((id) => id !== questionId)
          : [...current.markedForReview, questionId],
      };
      attemptRef.current = next;
      saveAttempt(next, true);
      return next;
    });
  }

  function continueToNextPart() {
    const nextPart = test.parts[currentPartIndex + 1];
    if (!nextPart) {
      enterFinalReview();
      return;
    }
    setAudioSeconds(0);
    setAudioDuration(0);
    setAudioError("");
    setPaused(false);
    setPreviewSeconds(previewDuration);
    setActiveQuestionId(nextPart.questions[0].id);
    setAttempt((current) => ({
      ...current,
      currentPart: nextPart.partNumber,
      phase: "part_preview",
    }));
  }

  function recordAssistance() {
    setAttempt((current) => ({ ...current, assistanceUsed: true }));
  }

  function replayPart() {
    recordAssistance();
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setAudioSeconds(0);
    setPaused(false);
    setAttempt((current) => ({
      ...current,
      phase: "part_playing",
      playbackPositions: { ...current.playbackPositions, [String(current.currentPart)]: 0 },
    }));
    void audio.play().catch(() => setAudioError("Audio playback is unavailable. Check the recording and browser permissions."));
  }

  function openExitDialog() {
    setAttempt((current) => ({
      ...current,
      interruptionCount: (current.interruptionCount ?? 0) + 1,
    }));
    setExitOpen(true);
  }

  useEffect(() => {
    if (attempt.phase !== "part_transition" || attempt.mode !== "mock") return;
    const timeout = window.setTimeout(continueToNextPart, 1500);
    return () => window.clearTimeout(timeout);
    // continueToNextPart deliberately uses this rendered transition.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt.mode, attempt.phase]);

  function goToQuestion(question: ListeningQuestion) {
    const targetPart = test.parts.find((part) =>
      part.questions.some((item) => item.id === question.id),
    );
    if (
      attempt.phase !== "final_review" &&
      targetPart?.partNumber !== attempt.currentPart
    ) {
      return;
    }
    setActiveQuestionId(question.id);
    questionRefs.current[question.id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  function reviewFirstUnanswered() {
    setSubmitOpen(false);
    const question = allQuestions.find(
      (item) => !hasAnswer(attempt.answers[item.id]),
    );
    if (question) goToQuestion(question);
  }

  async function resumeAudio() {
    setPaused(false);
    setAudioError("");
    try {
      await audioRef.current?.play();
    } catch {
      setPaused(true);
      setAudioError("Audio playback is unavailable. Check the recording and browser permissions.");
    }
  }

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-surface-subtle">
        <div className="text-center">
          <Headphones className="mx-auto size-8 animate-pulse text-primary" />
          <p className="mt-3 text-sm font-semibold text-muted">
            Restoring your test…
          </p>
        </div>
      </div>
    );
  }

  if (attempt.phase === "part_transition") {
    const nextPart = test.parts[currentPartIndex + 1];
    if (!nextPart) return null;
    return (
      <div className="grid min-h-screen place-items-center bg-brand-panel px-5 text-brand-panel-contrast">
        <div className="max-w-xl text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-white/10">
            <Check className="size-7" />
          </span>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
            Part {attempt.currentPart} complete
          </p>
          <h1 className="mt-3 text-3xl font-bold">
            Next: Part {nextPart.partNumber}
          </h1>
          <p className="mt-3 text-white/75">
            Questions {nextPart.questions[0].number}–
            {nextPart.questions.at(-1)
              ? lastQuestionNumber(nextPart.questions.at(-1)!)
              : nextPart.questions[0].number} ·{" "}
            {partLabel(nextPart.partNumber)}
          </p>
          <Button
            variant="secondary"
            size="lg"
            className="mt-8"
            onClick={continueToNextPart}
            disabled={attempt.mode === "mock"}
          >
            {attempt.mode === "mock" ? "Continuing automatically…" : "Continue"} <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  const finalReview = attempt.phase === "final_review";
  const partPreview = attempt.phase === "part_preview";
  const displayedParts: ListeningPart[] = finalReview
    ? test.parts
    : [currentPart];

  return (
    <div className="min-h-screen bg-surface-subtle">
      <header className="sticky top-0 z-30 border-b bg-surface">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6">
          <div className="flex min-h-16 items-center justify-between gap-4 py-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold">
                  {finalReview
                    ? "Final Review"
                    : attempt.selectedPart
                      ? `Part ${attempt.selectedPart} practice`
                      : `Part ${currentPartIndex + 1} of ${test.parts.length}`}
                </p>
                <Badge variant={attempt.mode === "mock" ? "green" : "gray"}>
                  {attempt.mode === "mock" ? "Mock Test" : "Practice"}
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                {finalReview
                  ? `${answeredCount} answered · ${unansweredCount} unanswered`
                  : `Questions ${currentPart.questions[0].number}–${
                      currentPart.questions.at(-1)
                        ? lastQuestionNumber(currentPart.questions.at(-1)!)
                        : currentPart.questions[0].number
                    }`}
              </p>
            </div>

            {finalReview ? (
              <div
                className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-950"
                aria-live="polite"
              >
                <Timer className="size-4" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide">
                    {attempt.mode === "mock" ? "Review time" : "Practice review"}
                  </p>
                  <p className="font-bold tabular-nums">
                    {attempt.mode === "mock" ? formatTime(reviewSeconds) : "Untimed"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="hidden min-w-[320px] items-center gap-3 md:flex">
                <Volume2 className="size-4 text-primary" />
                <div className="flex-1">
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="font-semibold">
                      {partPreview ? "Read the questions below" : paused ? "Audio paused" : "Audio playing"}
                    </span>
                    <span className="text-subtle">
                      {Math.floor(audioSeconds / 60)}:
                      {String(audioSeconds % 60).padStart(2, "0")}
                    </span>
                  </div>
                  <Progress
                    value={(audioSeconds / playbackDuration) * 100}
                    className="h-1.5"
                    label="Non-interactive audio progress"
                  />
                </div>
                <label className="flex items-center gap-1 text-xs">
                  <span className="sr-only">Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(event) => setVolume(Number(event.target.value))}
                    className="w-16 accent-primary"
                  />
                </label>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-1.5 text-xs ${saveError ? "text-red-700" : "text-muted"}`} title={saveError || undefined} role={saveError ? "alert" : undefined}>
                <Save className="size-3.5" />
                {saveError ? "Save failed" : saved ? "Saved" : "Saving…"}
              </span>
              {!finalReview && !partPreview && attempt.mode === "practice" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => { recordAssistance(); setPaused((value) => !value); }}
                >
                  {paused ? (
                    <Play className="size-4" />
                  ) : (
                    <Pause className="size-4" />
                  )}
                  <span className="hidden sm:inline">
                    {paused ? "Resume" : "Pause"}
                  </span>
                </Button>
              )}
              <button
                className="grid size-9 place-items-center rounded-lg border text-muted hover:bg-surface-subtle hover:text-ink"
                onClick={openExitDialog}
                aria-label="Exit test"
              >
                <LogOut className="size-4" />
              </button>
            </div>
          </div>

          {!finalReview && (
            <div className="flex items-center gap-2 pb-3 md:hidden">
              <Volume2 className="size-4 text-primary" />
              <Progress
                value={(audioSeconds / playbackDuration) * 100}
                className="flex-1"
                label="Non-interactive audio progress"
              />
              <span className="text-xs font-semibold">
                {partPreview ? "Reading time" : paused ? "Paused" : "Playing"}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto grid max-w-[1440px] gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[1fr_280px]">
        {partPreview && (
          <Card className="flex flex-wrap items-center justify-between gap-4 border-primary/30 bg-primary-soft p-5 lg:col-span-2">
            <div>
              <h1 className="text-xl font-bold">Read Part {attempt.currentPart} questions</h1>
              <p className="mt-1 text-sm">{currentPart.audioUrl ? `Audio starts in ${formatTime(previewSeconds)}` : "Audio is unavailable. Your answers remain saved."}</p>
            </div>
            <Button onClick={startPart} disabled={!currentPart.audioUrl}>Start Part {attempt.currentPart} <Play className="size-4" /></Button>
          </Card>
        )}
        {audioError && (
          <Card className="flex flex-col gap-3 border-amber-300 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between lg:col-span-2">
            <p className="text-sm font-semibold">{audioError}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={() => void resumeAudio()}><Play className="size-4" /> Resume audio</Button>
              <Button variant="secondary" size="sm" onClick={() => window.location.reload()}>Refresh audio access</Button>
            </div>
          </Card>
        )}
        <div className="min-w-0">
          {finalReview && (
            <Card className="mb-5 border-amber-200 bg-amber-50/60 p-5 sm:p-6">
              <div className="flex gap-3">
                <Timer className="mt-0.5 size-5 shrink-0 text-amber-700" />
                <div>
                  <h1 className="text-xl font-bold text-amber-950">
                    Check all {totalQuestionSlots} answers
                  </h1>
                  <p className="mt-2 type-body-sm text-amber-900">
                    Complete blank answers, check spelling and word limits, and revisit questions marked for review.
                    {attempt.mode === "mock" ? " Audio cannot be replayed." : " Practice review is untimed."}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {displayedParts.map((part) => (
            <section key={part.partNumber} className="mb-6">
              <Card className="p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  Part {part.partNumber} · Questions {part.questions[0].number}–
                  {part.questions.at(-1)
                    ? lastQuestionNumber(part.questions.at(-1)!)
                    : part.questions[0].number}
                </p>
                <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                  {part.title}
                </h2>
                <p className="mt-2 type-body-sm text-muted">{part.context}</p>
              </Card>

              <PartVisual part={part} />

              <div className="mt-4 space-y-4">
                {part.questions.map((question, index) => {
                  const templateQuestions = question.groupId
                    ? part.questions.filter(
                        (item) => item.groupId === question.groupId,
                      )
                    : [];
                  const renderCompletionTemplate = Boolean(
                    question.completionTemplate &&
                      question.groupId &&
                      templateQuestions.every(
                        (item) =>
                          item.completionTemplate ===
                          question.completionTemplate,
                      ) &&
                      isCompletionTemplateUsable(
                        question.completionTemplate,
                        templateQuestions.length,
                      ),
                  );

                  if (
                    renderCompletionTemplate &&
                    templateQuestions[0]?.id !== question.id
                  ) {
                    return null;
                  }

                  if (renderCompletionTemplate && question.completionTemplate) {
                    const templateAnswered = templateQuestions.some((item) =>
                      hasAnswer(attempt.answers[item.id]),
                    );
                    const templateMarked = templateQuestions.some((item) =>
                      attempt.markedForReview.includes(item.id),
                    );
                    const templateActive = templateQuestions.some(
                      (item) => item.id === activeQuestionId,
                    );
                    return (
                      <section key={question.groupId ?? question.id}>
                        <Card
                          className={cn(
                            "p-5 sm:p-6",
                            templateAnswered && "border-primary/30",
                            templateActive && "ring-2 ring-primary/30",
                            templateMarked && "border-amber-300",
                          )}
                        >
                          <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50/60 p-4 type-body-sm text-blue-950">
                            <strong>
                              Questions {templateQuestions[0].number}–
                              {lastQuestionNumber(templateQuestions.at(-1)!)}
                            </strong>
                            <br />
                            {question.instruction}
                          </div>
                          <CompletionTemplateRenderer
                            template={question.completionTemplate}
                            questions={templateQuestions}
                            answers={attempt.answers}
                            markedForReview={attempt.markedForReview}
                            activeQuestionId={activeQuestionId}
                            onChange={setAnswer}
                            onFocus={setActiveQuestionId}
                            onToggleReview={toggleReview}
                            setQuestionRef={(questionId, node) => {
                              questionRefs.current[questionId] = node;
                            }}
                          />
                        </Card>
                      </section>
                    );
                  }

                  const marked = attempt.markedForReview.includes(question.id);
                  const answered = hasAnswer(attempt.answers[question.id]);
                  return (
                    <section
                      key={question.id}
                      id={`question-${question.number}`}
                      ref={(node) => {
                        questionRefs.current[question.id] = node;
                      }}
                      onFocus={() => setActiveQuestionId(question.id)}
                    >
                      <Card
                        className={cn(
                          "p-5 sm:p-6",
                          answered && "border-primary/30",
                          activeQuestionId === question.id &&
                            "ring-2 ring-primary/30",
                          marked && "border-amber-300",
                        )}
                      >
                        {index === 0 ||
                        part.questions[index - 1].instruction !==
                          question.instruction ? (
                          <div className="mb-5 rounded-lg border border-blue-100 bg-blue-50/60 p-4 type-body-sm text-blue-950">
                            <strong>
                              Questions {question.number}–
                              {part.questions
                                .slice(index)
                                .findLast(
                                  (item) =>
                                    item.instruction === question.instruction,
                                )
                                ? lastQuestionNumber(
                                    part.questions
                                      .slice(index)
                                      .findLast(
                                        (item) =>
                                          item.instruction === question.instruction,
                                      )!,
                                  )
                                : lastQuestionNumber(question)}
                            </strong>
                            <br />
                            {question.instruction}
                          </div>
                        ) : null}

                        <div className="flex gap-4">
                          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-surface-subtle text-sm font-bold text-ink">
                            {questionSlotCount(question) > 1
                              ? `${question.number}–${lastQuestionNumber(question)}`
                              : question.number}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-semibold leading-6">
                                {question.prompt}
                              </h3>
                              <button
                                type="button"
                                onClick={() => toggleReview(question.id)}
                                aria-pressed={marked}
                                className={cn(
                                  "flex h-9 shrink-0 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-bold",
                                  marked
                                    ? "border-amber-300 bg-amber-50 text-amber-900"
                                    : "text-muted hover:bg-surface-subtle",
                                )}
                              >
                                <Flag
                                  className={cn(
                                    "size-3.5",
                                    marked && "fill-current",
                                  )}
                                />
                                {marked ? "Marked" : "Review"}
                              </button>
                            </div>
                            <div className="mt-4">
                              <QuestionRenderer
                                question={question}
                                answer={attempt.answers[question.id]}
                                onChange={(answer) =>
                                  setAnswer(question.id, answer)
                                }
                              />
                            </div>

                          </div>
                        </div>
                      </Card>
                    </section>
                  );
                })}
              </div>
            </section>
          ))}

          <Card className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold">
                Answered {answeredCount} / {totalQuestionSlots}
              </p>
              <p className="mt-1 text-sm text-muted">
                {unansweredCount} unanswered · {markedCount} marked for review
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {finalReview ? (
                <>
                  {unansweredCount > 0 && (
                    <Button variant="secondary" onClick={reviewFirstUnanswered}>
                      Review unanswered
                    </Button>
                  )}
                  <Button onClick={() => setSubmitOpen(true)}>
                    Submit Listening Test <Check className="size-4" />
                  </Button>
                </>
              ) : (
                <>
                  {attempt.mode === "practice" && !partPreview && (
                    <Button variant="secondary" onClick={replayPart}>
                      <Play className="size-4" /> Replay this part
                    </Button>
                  )}
                  {attempt.mode === "practice" && (
                    <Button onClick={finishCurrentPart}>
                      {!isLastPart
                        ? "Next Part"
                        : "Start final review"}
                      <ArrowRight className="size-4" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>

        <aside className="lg:sticky lg:top-[84px] lg:h-fit">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Question navigator</h2>
              <span className="text-xs text-muted">{answeredCount}/{totalQuestionSlots}</span>
            </div>
            <div className="mt-4 grid grid-cols-8 gap-1.5 sm:grid-cols-10 lg:grid-cols-5">
              {allQuestions
                .flatMap((question) =>
                  Array.from(
                    { length: questionSlotCount(question) },
                    (_, slotIndex) => ({
                      question,
                      slotIndex,
                      number: question.number + slotIndex,
                    }),
                  ),
                )
                .map(({ question, slotIndex, number }) => {
                const questionPart = test.parts.find((part) =>
                  part.questions.some((item) => item.id === question.id),
                );
                const available =
                  finalReview ||
                  questionPart?.partNumber === attempt.currentPart;
                const answer = attempt.answers[question.id];
                const answered =
                  question.maxSelections && question.maxSelections > 1
                    ? Array.isArray(answer) && Boolean(answer[slotIndex])
                    : hasAnswer(answer);
                const marked = attempt.markedForReview.includes(question.id);
                const current = activeQuestionId === question.id;
                return (
                  <button
                    key={`${question.id}-${number}`}
                    disabled={!available}
                    onClick={() => goToQuestion(question)}
                    className={cn(
                      "relative grid aspect-square place-items-center rounded-md border text-xs font-bold",
                      answered &&
                        "border-primary/30 bg-primary-soft text-primary",
                      available &&
                        !answered &&
                        "border-border bg-surface text-ink",
                      !available && "bg-surface-subtle text-subtle",
                      current &&
                        "border-primary ring-2 ring-primary ring-offset-1",
                      marked && "rounded-tr-none border-amber-400",
                    )}
                    aria-current={current ? "true" : undefined}
                    aria-label={`Question ${number}, ${
                      answered ? "answered" : "unanswered"
                    }${marked ? ", marked for review" : ""}`}
                  >
                    {number}
                    {answered && (
                      <CheckCircle2 className="absolute -bottom-1 -right-1 size-3.5 rounded-full bg-surface text-primary" />
                    )}
                    {marked && (
                      <Flag className="absolute -right-1 -top-1 size-3.5 fill-amber-400 text-amber-700" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 border-t pt-4 text-xs text-muted">
              <p className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-primary" />
                Answered
              </p>
              <p className="flex items-center gap-2">
                <span className="size-3 rounded-sm border border-border bg-surface" />
                Unanswered
              </p>
              <p className="flex items-center gap-2">
                <Flag className="size-3.5 fill-amber-400 text-amber-700" />
                Marked for review
              </p>
              <p className="flex items-center gap-2">
                <span className="size-3 rounded-sm border-2 border-primary" />
                Current
              </p>
            </div>
          </Card>
        </aside>
      </main>

      {exitOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#17201a]/45 px-5" role="presentation">
          <Card className="w-full max-w-md p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="exit-title">
            <span className="grid size-11 place-items-center rounded-lg bg-amber-50 text-amber-700">
              <LogOut className="size-5" />
            </span>
            <h2 id="exit-title" tabIndex={-1} className="mt-4 text-xl font-bold outline-none">Leave this test?</h2>
            <p className="mt-2 type-body-sm text-muted">
              Your answers, current Part, and marked questions are saved. Practice also restores the last saved playback position. Leaving a mock records an interruption.
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setExitOpen(false)}
              >
                Stay
              </Button>
              <ButtonLink href="/dashboard" variant="danger" className="flex-1">
                Exit test
              </ButtonLink>
            </div>
          </Card>
        </div>
      )}

      {submitOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[#17201a]/45 px-5" role="presentation">
          <Card className="w-full max-w-lg p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="submit-title">
            <span className="grid size-11 place-items-center rounded-lg bg-primary-soft text-primary">
              {unansweredCount ? (
                <AlertTriangle className="size-5 text-amber-700" />
              ) : (
                <Check className="size-5" />
              )}
            </span>
            <h2 id="submit-title" tabIndex={-1} className="mt-4 text-xl font-bold outline-none">Submit Listening Test?</h2>
            {submitError && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{submitError} Your answers are still here. Try submitting again.</p>}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-surface-subtle p-4">
                <p className="text-xs text-muted">Answered</p>
                <p className="mt-1 text-2xl font-bold">{answeredCount} / {totalQuestionSlots}</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-xs text-amber-800">Unanswered</p>
                <p className="mt-1 text-2xl font-bold text-amber-950">
                  {unansweredCount}
                </p>
              </div>
            </div>
            {unansweredCount > 0 && (
              <p className="mt-4 type-body-sm text-muted">
                You have {unansweredCount} unanswered question
                {unansweredCount === 1 ? "" : "s"}.
              </p>
            )}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="secondary"
                className="flex-1"
                disabled={submitting}
                onClick={() => {
                  if (unansweredCount > 0) reviewFirstUnanswered();
                  else setSubmitOpen(false);
                }}
              >
                Review answers
              </Button>
              <Button className="flex-1" disabled={submitting} onClick={() => void submitAttempt()}>
                {submitting ? "Submitting…" : unansweredCount > 0 ? "Submit anyway" : "Submit test"}
              </Button>
            </div>
            <button
              disabled={submitting}
              onClick={() => setSubmitOpen(false)}
              className="mt-4 flex w-full items-center justify-center gap-1 text-sm font-semibold text-muted"
            >
              Return to review <ChevronDown className="size-4 rotate-180" />
            </button>
          </Card>
        </div>
      )}
    </div>
  );
}
