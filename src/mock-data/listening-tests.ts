import type {
  HistoricalAttempt,
  ListeningPart,
  ListeningQuestion,
  ListeningTest,
  PracticeExercise,
  UserAnswer,
} from "@/types/listening";

const choice = (id: string, label: string) => ({ id, label });
const mcOptions = (labels: string[]) =>
  labels.map((label, index) => choice(String.fromCharCode(65 + index), label));

function question(
  number: number,
  config: Omit<ListeningQuestion, "id" | "number" | "difficulty">,
): ListeningQuestion {
  return {
    id: `mock-01-q${number}`,
    number,
    difficulty: number > 30 ? "challenging" : "standard",
    ...config,
  };
}

const formInstruction =
  "Complete the form. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.";

const part1: ListeningPart = {
  partNumber: 1,
  title: "Accommodation enquiry",
  context: "A customer calls a guest house to arrange accommodation.",
  speakerCount: 2,
  audioUrl: "/audio/mock-01-part-1.mp3",
  questions: [
    question(1, {
      type: "form_completion",
      instruction: formInstruction,
      prompt: "Guest surname",
      label: "Surname",
      acceptedAnswers: ["Carter"],
      wordLimit: 2,
      skillTags: ["names_spelling", "information_detail"],
      transcriptEvidence: {
        text: "Receptionist: Could I take your surname? Guest: Yes, it’s Carter — C-A-R-T-E-R.",
      },
      paraphrase: { questionPhrase: "surname", audioPhrase: "family name" },
    }),
    question(2, {
      type: "form_completion",
      instruction: formInstruction,
      prompt: "Arrival date",
      label: "Arrival",
      acceptedAnswers: ["18 September", "September 18", "18th September"],
      wordLimit: 2,
      skillTags: ["numbers_dates", "information_detail"],
      transcriptEvidence: {
        text: "Guest: I’ll arrive on the eighteenth of September, in the early evening.",
      },
    }),
    question(3, {
      type: "form_completion",
      instruction: formInstruction,
      prompt: "Room requested",
      label: "Room type",
      acceptedAnswers: ["single room", "single"],
      wordLimit: 2,
      skillTags: ["information_detail"],
      transcriptEvidence: {
        text: "Guest: A double would be too large. I only need a single room.",
      },
      distractor: {
        value: "double room",
        type: "rejected_option",
        explanation:
          "The speaker mentions a double room only to reject it, then requests a single room.",
      },
    }),
    question(4, {
      type: "form_completion",
      instruction: formInstruction,
      prompt: "Preferred location",
      label: "Near the",
      acceptedAnswers: ["station", "train station"],
      wordLimit: 2,
      skillTags: ["directions", "information_detail"],
      transcriptEvidence: {
        text: "Guest: Somewhere close to the train station would be most convenient.",
      },
    }),
    question(5, {
      type: "form_completion",
      instruction: formInstruction,
      prompt: "Meal included",
      label: "Include",
      acceptedAnswers: ["breakfast"],
      wordLimit: 2,
      skillTags: ["information_detail"],
      transcriptEvidence: {
        text: "Receptionist: The room price includes breakfast, but dinner is extra.",
      },
      distractor: {
        value: "dinner",
        type: "partial_match",
        explanation:
          "Dinner is mentioned, but it is not included in the room price.",
      },
    }),
    question(6, {
      type: "form_completion",
      instruction: formInstruction,
      prompt: "Maximum nightly price",
      label: "Up to £",
      acceptedAnswers: ["95", "£95"],
      wordLimit: 2,
      skillTags: ["numbers_dates", "similar_number"],
      transcriptEvidence: {
        text: "Guest: I hoped for eighty-five, though I can go up to ninety-five pounds.",
      },
      distractor: {
        value: "85",
        type: "similar_number",
        explanation:
          "£85 is the preferred price, but the question asks for the maximum.",
      },
    }),
    question(7, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "Why is the guest visiting the city?",
      options: mcOptions([
        "To attend a family event",
        "To start a new job",
        "To take a short course",
      ]),
      acceptedAnswers: ["C"],
      skillTags: ["speaker_purpose", "paraphrase_recognition"],
      transcriptEvidence: {
        text: "Guest: It’s a four-day photography course. My cousin’s wedding isn’t until next year.",
      },
      distractor: {
        value: "A",
        type: "future_vs_current",
        explanation:
          "A family wedding is mentioned, but it is next year and not the reason for this visit.",
      },
    }),
    question(8, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "Which facility is most important to the guest?",
      options: mcOptions(["A car park", "Reliable Wi-Fi", "A laundry room"]),
      acceptedAnswers: ["B"],
      skillTags: ["speaker_opinion", "information_detail"],
      transcriptEvidence: {
        text: "Guest: I won’t have a car, and laundry can wait. What I really need is dependable Wi-Fi.",
      },
    }),
    question(9, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "How will the guest travel from the airport?",
      options: mcOptions(["By taxi", "By airport bus", "By train"]),
      acceptedAnswers: ["B"],
      skillTags: ["change_of_mind", "transport"],
      transcriptEvidence: {
        text: "Guest: I was going to take a taxi. Actually, the airport bus stops right outside, so I’ll use that.",
      },
      distractor: {
        value: "A",
        type: "change_of_mind",
        explanation:
          "The guest first considers a taxi, then changes the final decision to the airport bus.",
      },
    }),
    question(10, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "When will the booking confirmation be sent?",
      options: mcOptions([
        "Immediately",
        "By the end of today",
        "The following morning",
      ]),
      acceptedAnswers: ["B"],
      skillTags: ["numbers_dates", "information_detail"],
      transcriptEvidence: {
        text: "Receptionist: I can’t send it this minute, but it will reach you before we close today.",
      },
      paraphrase: {
        questionPhrase: "by the end of today",
        audioPhrase: "before we close today",
      },
    }),
  ],
};

const mapOptions = [
  choice("A", "North entrance"),
  choice("B", "Beside reception"),
  choice("C", "Opposite the café"),
  choice("D", "Behind the main hall"),
  choice("E", "Next to the garden"),
  choice("F", "South corridor"),
];

const part2: ListeningPart = {
  partNumber: 2,
  title: "Community centre orientation",
  context: "A coordinator explains the layout and activities at a community centre.",
  speakerCount: 1,
  audioUrl: "/audio/mock-01-part-2.mp3",
  questions: [
    ...[
      [11, "Information desk", "B", "The information desk is immediately beside reception."],
      [12, "Children’s room", "E", "The children’s room is next to the garden, away from the road."],
      [13, "Fitness studio", "D", "Walk behind the main hall to find the fitness studio."],
      [14, "Computer room", "F", "The computer room is at the end of the south corridor."],
      [15, "Notice board", "C", "The main notice board is directly opposite the café."],
    ].map(([number, prompt, answer, text]) =>
      question(number as number, {
        type: "map_labelling",
        instruction:
          "Label the plan below. Choose the correct location, A–F.",
        prompt: prompt as string,
        options: mapOptions,
        acceptedAnswers: [answer as string],
        skillTags: ["directions", "spatial_language"],
        transcriptEvidence: { text: `Guide: ${text}` },
      }),
    ),
    question(16, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "What should new visitors do first?",
      options: mcOptions([
        "Collect a membership card",
        "Book an activity",
        "Speak to a volunteer",
      ]),
      acceptedAnswers: ["A"],
      skillTags: ["sequence", "information_detail"],
      transcriptEvidence: {
        text: "Guide: Before booking anything, please collect your membership card from reception.",
      },
    }),
    question(17, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "The evening art class now begins at",
      options: mcOptions(["5:30", "6:00", "6:30"]),
      acceptedAnswers: ["C"],
      skillTags: ["numbers_dates", "change_of_mind"],
      transcriptEvidence: {
        text: "Guide: It used to begin at six. From this month, the start time has moved to half past six.",
      },
      distractor: {
        value: "B",
        type: "future_vs_current",
        explanation:
          "6:00 was the previous time. The current start time is 6:30.",
      },
    }),
    question(18, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "Which activity needs advance booking?",
      options: mcOptions(["Yoga", "Indoor climbing", "Photography"]),
      acceptedAnswers: ["B"],
      skillTags: ["information_detail"],
      transcriptEvidence: {
        text: "Guide: You can drop into yoga and photography, but climbing places must be reserved.",
      },
    }),
    question(19, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "What is included in the weekend membership?",
      options: mcOptions([
        "Equipment hire",
        "Guest passes",
        "Locker use",
      ]),
      acceptedAnswers: ["C"],
      skillTags: ["negation_contrast", "information_detail"],
      transcriptEvidence: {
        text: "Guide: Lockers are included. Equipment hire and guest passes both carry a small charge.",
      },
    }),
    question(20, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "Why was the café menu changed?",
      options: mcOptions([
        "Members requested healthier food",
        "A new manager arrived",
        "Prices had increased",
      ]),
      acceptedAnswers: ["A"],
      skillTags: ["cause_effect", "paraphrase_recognition"],
      transcriptEvidence: {
        text: "Guide: The change follows repeated suggestions from members for lighter, healthier choices.",
      },
    }),
  ],
};

const opinionOptions = [
  choice("A", "Very useful"),
  choice("B", "Too theoretical"),
  choice("C", "Too difficult"),
  choice("D", "Already familiar"),
  choice("E", "Needs more examples"),
];

const part3: ListeningPart = {
  partNumber: 3,
  title: "University research discussion",
  context:
    "Two students discuss a research project with their course tutor.",
  speakerCount: 3,
  audioUrl: "/audio/mock-01-part-3.mp3",
  questions: [
    question(21, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "What is the main reason the students changed their topic?",
      options: mcOptions([
        "They could not find enough data",
        "They had too little time",
        "Their tutor advised a narrower focus",
      ]),
      acceptedAnswers: ["C"],
      skillTags: ["speaker_opinion", "cause_effect"],
      transcriptEvidence: {
        text: "Tutor: The original topic was workable, but much too broad. I suggested focusing on one neighbourhood.",
      },
    }),
    question(22, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "Maya is most concerned about",
      options: mcOptions([
        "recruiting enough participants",
        "analysing the interview data",
        "designing the questionnaire",
      ]),
      acceptedAnswers: ["B"],
      skillTags: ["speaker_opinion", "paraphrase_recognition"],
      transcriptEvidence: {
        text: "Maya: Finding volunteers should be fine, and the questionnaire is nearly done. It’s making sense of all those interview responses that worries me.",
      },
      distractor: {
        value: "A",
        type: "rejected_option",
        explanation:
          "Maya explicitly says finding volunteers should be fine. Her concern is analysing responses.",
      },
    }),
    question(23, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "What does Leo think about the pilot study?",
      options: mcOptions([
        "It can be omitted",
        "It should involve more people",
        "It needs a clearer purpose",
      ]),
      acceptedAnswers: ["B"],
      skillTags: ["speaker_opinion", "information_detail"],
      transcriptEvidence: {
        text: "Leo: I understand why we need the pilot. I just don’t think testing it on two people tells us enough.",
      },
      distractor: {
        value: "A",
        type: "partial_match",
        explanation:
          "Leo questions the size of the pilot, not whether it should happen.",
      },
    }),
    question(24, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "The tutor recommends conducting interviews",
      options: mcOptions([
        "online",
        "on the university campus",
        "in participants’ homes",
      ]),
      acceptedAnswers: ["A"],
      skillTags: ["change_of_mind", "speaker_opinion"],
      transcriptEvidence: {
        text: "Tutor: Campus rooms were my first thought. On reflection, online interviews will be easier for your participants.",
      },
      distractor: {
        value: "B",
        type: "change_of_mind",
        explanation:
          "The tutor first mentions campus rooms, then changes the recommendation to online interviews.",
      },
    }),
    question(25, {
      type: "multiple_choice",
      instruction: "Choose the correct letter, A, B or C.",
      prompt: "What will the students do next?",
      options: mcOptions([
        "Rewrite the research question",
        "Contact potential participants",
        "Submit an ethics form",
      ]),
      acceptedAnswers: ["C"],
      skillTags: ["sequence", "information_detail"],
      transcriptEvidence: {
        text: "Tutor: Your research question is settled. Before contacting anyone, send in the ethics form.",
      },
    }),
    ...[
      [26, "Research methods workshop", "A", "Maya: The methods workshop gave us a practical structure we can use."],
      [27, "Statistics seminar", "C", "Leo: I followed the opening, but the later calculations were beyond me."],
      [28, "Academic writing session", "D", "Maya: It covered material from last semester, so none of it was new."],
      [29, "Library database training", "E", "Leo: Useful in principle, though another worked example would have helped."],
      [30, "Presentation skills class", "B", "Maya: There were plenty of concepts but almost no chance to practise."],
    ].map(([number, prompt, answer, text]) =>
      question(number as number, {
        type: "matching",
        instruction:
          "Match each course with the student’s opinion. Choose A–E.",
        prompt: prompt as string,
        options: opinionOptions,
        acceptedAnswers: [answer as string],
        skillTags: ["speaker_opinion", "paraphrase_recognition"],
        transcriptEvidence: { text: text as string },
      }),
    ),
  ],
};

const noteInstruction =
  "Complete the notes. Write NO MORE THAN TWO WORDS for each answer.";

const part4: ListeningPart = {
  partNumber: 4,
  title: "Urban wetlands lecture",
  context:
    "A lecturer explains how urban wetlands support resilient cities.",
  speakerCount: 1,
  audioUrl: "/audio/mock-01-part-4.mp3",
  questions: [
    ...[
      [31, "Wetlands can reduce the risk of urban ___ after heavy rain.", "flooding", "Wetlands store excess water and therefore reduce urban flooding.", ["academic_vocabulary", "cause_effect"]],
      [32, "They also filter pollutants from ___ water.", "storm", "They filter pollutants carried in storm water before it reaches rivers.", ["academic_vocabulary", "information_detail"]],
      [33, "Dense vegetation provides a habitat for birds and ___.", "insects", "Dense planting creates shelter for birds and insects.", ["information_detail"]],
      [34, "One restored site was previously used as a ___.", "car park", "The Eastbank wetland occupies land that was formerly a car park.", ["paraphrase_recognition", "information_detail"]],
      [35, "The project initially faced opposition from local ___.", "business owners", "Some local business owners objected during the early consultation.", ["speaker_attitude", "information_detail"]],
      [36, "Residents were most worried about an increase in ___.", "mosquitoes", "The most frequently expressed concern was that mosquitoes would increase.", ["academic_vocabulary", "information_detail"]],
      [37, "Water levels are controlled using a simple ___ system.", "gate", "A simple gate system controls how much water moves between the pools.", ["process", "information_detail"]],
      [38, "Schools use the wetland as an outdoor ___.", "classroom", "For nearby schools, the site has effectively become an outdoor classroom.", ["paraphrase_recognition"]],
      [39, "Future plans include improving the ___ path.", "cycling", "The next phase will improve the cycling path along the northern boundary.", ["information_detail", "directions"]],
      [40, "Long-term success depends on regular ___.", "maintenance", "Without regular maintenance, even a well-designed wetland will decline.", ["cause_effect", "academic_vocabulary"]],
    ].map(([number, prompt, answer, text, skills]) =>
      question(number as number, {
        type: "note_completion",
        instruction: noteInstruction,
        prompt: prompt as string,
        acceptedAnswers: [answer as string],
        wordLimit: 2,
        skillTags: skills as string[],
        transcriptEvidence: { text: `Lecturer: ${text}` },
        paraphrase:
          number === 34
            ? { questionPhrase: "previously used as", audioPhrase: "formerly" }
            : undefined,
      }),
    ),
  ],
};

export const mockTestOne: ListeningTest = {
  id: "mock-01",
  title: "Listening Mock 01",
  description:
    "A complete IELTS-style Listening mock with four realistic Parts and detailed learning feedback.",
  estimatedDurationMinutes: 31,
  questionCount: 40,
  difficulty: "standard",
  status: "not_started",
  parts: [part1, part2, part3, part4],
};

const testMeta = [
  ["mock-02", "Listening Mock 02", 30, "completed", 28],
  ["mock-03", "Listening Mock 03", 32, "not_started", undefined],
  ["mock-04", "Listening Mock 04", 31, "in_progress", undefined],
  ["mock-05", "Listening Mock 05", 30, "completed", 31],
] as const;

export const listeningTests: ListeningTest[] = [
  mockTestOne,
  ...testMeta.map(([id, title, duration, status, score], index) => ({
    ...mockTestOne,
    id,
    title,
    description:
      index % 2
        ? "A slightly more demanding IELTS-style Listening mock."
        : "Balanced practice across social and academic listening contexts.",
    estimatedDurationMinutes: duration,
    difficulty: index === 1 ? ("challenging" as const) : ("standard" as const),
    status,
    previousScore: score,
    parts: mockTestOne.parts.map((part) => ({
      ...part,
      questions: part.questions.map((item) => ({
        ...item,
        id: `${id}-q${item.number}`,
      })),
    })),
  })),
];

const incorrectFallbacks: Record<number, string> = {
  17: "B",
  22: "A",
  23: "A",
  24: "B",
  27: "B",
  29: "A",
  34: "parking area",
  36: "birds",
  39: "",
};

export const demoSubmittedAnswers: Record<string, UserAnswer> =
  Object.fromEntries(
    mockTestOne.parts.flatMap((part) =>
      part.questions.map((item) => [
        item.id,
        incorrectFallbacks[item.number] ?? item.acceptedAnswers[0],
      ]),
    ),
  );

export const practiceExercises: PracticeExercise[] = [
  {
    id: "practice-part-3-01",
    slug: "part-3",
    title: "Part 3 — Speaker Opinions",
    description:
      "Educational discussions involving students, tutors, and supervisors.",
    questionCount: 10,
    durationMinutes: 8,
    accuracy: 62,
    category: "part",
    focus: ["Speaker opinions", "Multiple choice"],
  },
  {
    id: "practice-part-2-01",
    slug: "part-2",
    title: "Part 2 — Directions",
    description: "Follow a speaker describing community places and facilities.",
    questionCount: 10,
    durationMinutes: 7,
    accuracy: 74,
    category: "part",
    focus: ["Directions", "Map labelling"],
  },
  {
    id: "practice-part-4-01",
    slug: "part-4",
    title: "Part 4 — Academic Notes",
    description: "Keep pace with a structured academic monologue.",
    questionCount: 10,
    durationMinutes: 9,
    accuracy: 69,
    category: "part",
    focus: ["Note completion", "Academic vocabulary"],
  },
  {
    id: "practice-mc-01",
    slug: "multiple-choice",
    title: "Multiple Choice",
    description:
      "Distinguish between ideas mentioned and identify the speaker’s final meaning.",
    questionCount: 10,
    durationMinutes: 8,
    accuracy: 58,
    category: "question_type",
    focus: ["Change of mind", "Speaker opinions"],
  },
  {
    id: "practice-map-01",
    slug: "map-plan",
    title: "Map / Plan Labelling",
    description: "Track location language and changes in direction.",
    questionCount: 10,
    durationMinutes: 7,
    accuracy: 68,
    category: "question_type",
    focus: ["Directions", "Spatial language"],
  },
  {
    id: "practice-completion-01",
    slug: "completion",
    title: "Completion Questions",
    description: "Listen for precise details while respecting word limits.",
    questionCount: 10,
    durationMinutes: 8,
    accuracy: 82,
    category: "question_type",
    focus: ["Spelling", "Numbers and dates"],
  },
];

export const historicalAttempts: HistoricalAttempt[] = [
  { id: "history-07", testTitle: "Listening Mock 07", date: "Jul 26", score: 31, estimatedBand: 7, durationMinutes: 29 },
  { id: "history-06", testTitle: "Listening Mock 06", date: "Jul 23", score: 28, estimatedBand: 6.5, durationMinutes: 30 },
  { id: "history-05", testTitle: "Listening Mock 05", date: "Jul 19", score: 31, estimatedBand: 7, durationMinutes: 31 },
  { id: "history-04", testTitle: "Listening Mock 04", date: "Jul 15", score: 30, estimatedBand: 7, durationMinutes: 30 },
  { id: "history-03", testTitle: "Listening Mock 03", date: "Jul 10", score: 28, estimatedBand: 6.5, durationMinutes: 31 },
  { id: "history-02", testTitle: "Listening Mock 02", date: "Jul 06", score: 27, estimatedBand: 6.5, durationMinutes: 30 },
  { id: "history-01", testTitle: "Listening Mock 01", date: "Jul 01", score: 26, estimatedBand: 6.5, durationMinutes: 32 },
];

export const progressData = {
  learner: {
    name: "Alex",
    email: "alex@example.com",
    targetBand: 8,
    examDate: "2026-10-17",
  },
  recentScores: [26, 27, 29, 28, 30, 31, 31],
  partPerformance: [
    { label: "Part 1", value: 86 },
    { label: "Part 2", value: 78 },
    { label: "Part 3", value: 62 },
    { label: "Part 4", value: 74 },
  ],
  questionTypePerformance: [
    { label: "Form Completion", value: 82 },
    { label: "Multiple Choice", value: 58 },
    { label: "Matching", value: 71 },
    { label: "Map Labelling", value: 68 },
    { label: "Sentence Completion", value: 79 },
    { label: "Short Answer", value: 76 },
  ],
  skillPerformance: [
    { label: "Numbers & Dates", value: 82, trend: "improving" },
    { label: "Paraphrase Recognition", value: 71, trend: "improving" },
    { label: "Speaker Opinions", value: 60, trend: "needs practice" },
    { label: "Corrections & Changes", value: 54, trend: "needs practice" },
  ],
};
