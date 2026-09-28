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
  groupId?: string;
  instruction?: string;
  completionTemplate?: string;
  prompt: string;
  label?: string;
  options?: QuestionOption[];
  acceptedAnswers: string[];
  explanation?: string;
  transcriptText?: string;
  skillTags: string[];
  difficulty: Difficulty;
  wordLimit?: number;
  allowNumber?: boolean;
  maxSelections?: number;
  imageUrl?: string;
  imageAlt?: string;
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
  distractorExplanations?: Record<string, string>;
  paraphraseExplanation?: string;
}

export interface ListeningPart {
  partNumber: 1 | 2 | 3 | 4;
  title: string;
  context: string;
  speakerCount: number;
  audioUrl: string;
  readingTimeSeconds?: number;
  checkingTimeSeconds?: number;
  questions: ListeningQuestion[];
}

export interface ListeningTest {
  id: string;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  questionCount: number;
  difficulty: Difficulty;
  status?: "not_started" | "in_progress" | "completed";
  previousScore?: number;
  parts: ListeningPart[];
  source?: "official" | "community";
  visibility?: "official" | "public" | "private";
  publishedAt?: string;
  releaseId?: string;
  contentClassification?: "demo" | "reviewed";
}

export interface PublishedTestSummary {
  id: string;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  questionCount: number;
  difficulty: Difficulty;
  source?: "official" | "community";
  visibility?: "official" | "public" | "private";
  publishedAt?: string;
  releaseId?: string;
  contentClassification?: "demo" | "reviewed";
  parts: Array<
    Pick<ListeningPart, "partNumber" | "title" | "context" | "speakerCount"> & {
      questionCount: number;
    }
  >;
}

export interface TestAttempt {
  id: string;
  testId: string;
  testTitle?: string;
  userId: string;
  mode: "mock" | "practice";
  status: "not_started" | "in_progress" | "final_review" | "completed";
  phase: ExamPhase;
  answers: Record<string, UserAnswer>;
  markedForReview: string[];
  currentPart: number;
  selectedPart?: number;
  releaseId?: string;
  revision?: number;
  exposure?: "first" | "repeat";
  contentClassification?: "demo" | "reviewed";
  interruptionCount?: number;
  assistanceUsed?: boolean;
  playbackPositions?: Record<string, number>;
  reviewEndsAt?: string;
  startedAt?: string;
  completedAt?: string;
  rawScore?: number;
  totalMarks?: number;
  estimatedBand?: number;
  questionOutcomes?: Record<
    string,
    {
      awarded: number;
      available: number;
      status: "unanswered" | "correct" | "partial" | "incorrect";
      reason: string;
    }
  >;
  scoreBreakdown?: {
    byPart: Array<{ partNumber: number; score: number; total: number }>;
    byType: Array<{ type: string; score: number; total: number }>;
  };
}

export interface AttemptWithReview extends TestAttempt {
  reviewTest?: ListeningTest;
}
