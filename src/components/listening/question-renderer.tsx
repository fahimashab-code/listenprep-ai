"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ListeningQuestion, UserAnswer } from "@/types/listening";

type Props = {
  question: ListeningQuestion;
  answer?: UserAnswer;
  onChange: (answer: UserAnswer) => void;
  disabled?: boolean;
  compact?: boolean;
};

function OptionLabel({
  id,
  label,
  selected,
  checkbox,
  disabled,
  onSelect,
}: {
  id: string;
  label: string;
  selected: boolean;
  checkbox?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role={checkbox ? "checkbox" : "radio"}
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm hover:border-[#90ad98] hover:bg-[#f8fbf9]",
        selected && "border-[#176b3a] bg-[#edf7f0]",
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid size-5 shrink-0 place-items-center border text-[11px] font-bold",
          checkbox ? "rounded" : "rounded-full",
          selected
            ? "border-[#176b3a] bg-[#176b3a] text-white"
            : "border-[#aeb9b1] bg-white text-[#69746d]",
        )}
      >
        {selected ? <Check className="size-3.5" /> : id}
      </span>
      <span className="leading-5">
        <span className="mr-1 font-bold">{id}.</span> {label}
      </span>
    </button>
  );
}

export function QuestionRenderer({
  question,
  answer,
  onChange,
  disabled,
  compact,
}: Props) {
  const isMultiple = Boolean(
    question.maxSelections && question.maxSelections > 1,
  );

  if (question.type === "multiple_choice") {
    const selected = Array.isArray(answer) ? answer : answer ? [answer] : [];
    return (
      <fieldset disabled={disabled}>
        <legend className="sr-only">{question.prompt}</legend>
        {isMultiple && (
          <p className="mb-3 text-xs font-semibold text-[#69746d]">
            Choose {question.maxSelections} answers · {selected.length} /{" "}
            {question.maxSelections} selected
          </p>
        )}
        <div className={cn("grid gap-2", compact && "sm:grid-cols-2")}>
          {question.options?.map((option) => (
            <OptionLabel
              key={option.id}
              id={option.id}
              label={option.label}
              checkbox={isMultiple}
              disabled={disabled}
              selected={selected.includes(option.id)}
              onSelect={() => {
                if (!isMultiple) {
                  onChange(option.id);
                  return;
                }
                if (selected.includes(option.id)) {
                  onChange(selected.filter((item) => item !== option.id));
                } else if (selected.length < (question.maxSelections ?? 1)) {
                  onChange([...selected, option.id]);
                }
              }}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  if (
    question.type === "matching" ||
    question.type === "map_labelling" ||
    question.type === "diagram_labelling"
  ) {
    return (
      <label className="block">
        <span className="sr-only">Answer for question {question.number}</span>
        <select
          disabled={disabled}
          className="h-11 w-full rounded-lg border bg-white px-3 text-sm font-semibold outline-none focus:border-[#176b3a] focus:ring-3 focus:ring-green-100"
          value={typeof answer === "string" ? answer : ""}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">Choose an answer</option>
          {question.options?.map((option) => (
            <option value={option.id} key={option.id}>
              {option.id} — {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label className="block">
      <span className="sr-only">Answer for question {question.number}</span>
      <div className="flex items-center gap-3">
        <input
          disabled={disabled}
          value={typeof answer === "string" ? answer : ""}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full max-w-md rounded-lg border bg-white px-3 text-sm outline-none placeholder:text-[#98a29b] focus:border-[#176b3a] focus:ring-3 focus:ring-green-100 disabled:bg-gray-50"
          placeholder="Type your answer"
          autoComplete="off"
        />
        {question.wordLimit && (
          <span className="hidden whitespace-nowrap text-xs text-[#7a857e] sm:inline">
            Max {question.wordLimit} words
          </span>
        )}
      </div>
    </label>
  );
}

export function CentreMap() {
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-xl border-2 border-[#cfd8d1] bg-[#f3f6f3] p-4 text-xs font-semibold text-[#566159]"
      role="img"
      aria-label="Plan of the community centre showing the main hall, reception, café, garden, corridors and entrances"
    >
      <div className="absolute inset-x-1/4 top-4 h-12 rounded border bg-white p-2 text-center">
        North entrance
      </div>
      <div className="absolute left-4 top-1/3 w-1/4 rounded border bg-white p-3 text-center">
        Reception
      </div>
      <div className="absolute left-[38%] top-[30%] grid h-[36%] w-[35%] place-items-center rounded border-2 border-[#93b59c] bg-[#e5f2e8] text-sm text-[#176b3a]">
        Main hall
      </div>
      <div className="absolute right-4 top-1/3 w-1/5 rounded border bg-white p-3 text-center">
        Café
      </div>
      <div className="absolute bottom-4 left-4 h-1/4 w-[32%] rounded border border-dashed border-[#7aa486] bg-[#e3f2e7] p-3 text-center">
        Garden
      </div>
      <div className="absolute bottom-4 right-4 h-1/4 w-[34%] rounded border bg-white p-3 text-center">
        South corridor
      </div>
      {["A", "B", "C", "D", "E", "F"].map((label, index) => (
        <span
          key={label}
          className="absolute grid size-6 place-items-center rounded-full bg-[#176b3a] text-[10px] font-bold text-white"
          style={{
            left: `${[49, 29, 79, 55, 18, 79][index]}%`,
            top: `${[17, 42, 55, 72, 77, 82][index]}%`,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}
