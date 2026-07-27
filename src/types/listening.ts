export type QuestionType =
  | "multiple_choice"
  | "matching"
  | "map_labelling"
  | "diagram_labelling"
  | "form_completion"
  | "note_completion"
  | "table_completion"
  | "flowchart_completion"
  | "summary_completion"
  | "sentence_completion"
  | "short_answer";

export type Difficulty = "standard" | "challenging";
export type UserAnswer = string | string[];
export type ExamPhase =
  | "part_preview"
  | "part_playing"
  | "part_transition"
  | "final_review"
  | "submitted";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface ListeningQuestion {
  id: string;
  number: number;
  type: QuestionType;
  instruction?: string;
  prompt: string;
  label?: string;
  options?: QuestionOption[];
  acceptedAnswers: string[];
  skillTags: string[];
  difficulty: Difficulty;
  wordLimit?: number;
  maxSelections?: number;
  transcriptEvidence?: {
    text: string;
    startSeconds?: number;
    endSeconds?: number;
  };
  paraphrase?: {
    questionPhrase: string;
    audioPhrase: string;
  };
  distractor?: {
    value: string;
    type:
      | "correction"
      | "change_of_mind"
      | "negation"
      | "rejected_option"
      | "similar_number"
      | "speaker_disagreement"
      | "future_vs_current"
      | "partial_match";
    explanation: string;
  };
}

export interface ListeningPart {
  partNumber: 1 | 2 | 3 | 4;
  title: string;
  context: string;
  speakerCount: number;
  audioUrl: string;
  questions: ListeningQuestion[];
}

export interface ListeningTest {
  id: string;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  questionCount: 40;
  difficulty: Difficulty;
  status?: "not_started" | "in_progress" | "completed";
  previousScore?: number;
  parts: ListeningPart[];
}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  mode: "mock" | "practice";
  status: "not_started" | "in_progress" | "final_review" | "completed";
  phase: ExamPhase;
  answers: Record<string, UserAnswer>;
  markedForReview: string[];
  currentPart: number;
  reviewEndsAt?: string;
  startedAt?: string;
  completedAt?: string;
  rawScore?: number;
  estimatedBand?: number;
}

export interface PracticeExercise {
  id: string;
  slug: string;
  title: string;
  description: string;
  questionCount: number;
  durationMinutes: number;
  accuracy: number;
  category: "part" | "question_type" | "skill";
  focus: string[];
}

export interface HistoricalAttempt {
  id: string;
  testTitle: string;
  date: string;
  score: number;
  estimatedBand: number;
  durationMinutes: number;
}
