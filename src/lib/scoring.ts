import type {
  ListeningQuestion,
  ListeningTest,
  UserAnswer,
} from "@/types/listening";

export function normalizeAnswer(answer: string) {
  return answer
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:]/g, "")
    .replace(/\s+/g, " ");
}

export function validateWordLimit(answer: string, wordLimit?: number) {
  if (!wordLimit) return true;
  const words = answer.trim().match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) ?? [];
  return words.length <= wordLimit;
}

export function isAnswerCorrect(
  question: ListeningQuestion,
  answer?: UserAnswer,
) {
  if (answer === undefined || answer === "") return false;
  const provided = Array.isArray(answer) ? answer : [answer];
  if (
    provided.some(
      (value) => !validateWordLimit(String(value), question.wordLimit),
    )
  ) {
    return false;
  }

  const normalizedProvided = provided.map((value) =>
    normalizeAnswer(String(value)),
  );
  const normalizedAccepted = question.acceptedAnswers.map(normalizeAnswer);

  if (question.maxSelections && question.maxSelections > 1) {
    return (
      normalizedProvided.length === question.maxSelections &&
      normalizedProvided.every((value) => normalizedAccepted.includes(value))
    );
  }

  return normalizedProvided.some((value) => normalizedAccepted.includes(value));
}

export function questionSlotCount(question: ListeningQuestion) {
  return question.type === "multiple_choice"
    ? Math.max(1, question.maxSelections ?? 1)
    : 1;
}

export function scoreQuestion(
  question: ListeningQuestion,
  answer?: UserAnswer,
) {
  if (question.maxSelections && question.maxSelections > 1) {
    const provided = Array.isArray(answer) ? answer : answer ? [answer] : [];
    const accepted = new Set(question.acceptedAnswers.map(normalizeAnswer));
    return Math.min(
      question.maxSelections,
      new Set(provided.map((value) => normalizeAnswer(String(value))))
        .size === 0
        ? 0
        : provided.filter((value, index) => {
            const normalized = normalizeAnswer(String(value));
            return (
              provided.findIndex(
                (item) => normalizeAnswer(String(item)) === normalized,
              ) === index && accepted.has(normalized)
            );
          }).length,
    );
  }
  return isAnswerCorrect(question, answer) ? 1 : 0;
}

export function calculateRawScore(
  test: ListeningTest,
  answers: Record<string, UserAnswer>,
) {
  return test.parts
    .flatMap((part) => part.questions)
    .reduce(
      (score, question) => score + scoreQuestion(question, answers[question.id]),
      0,
    );
}

// Practice estimate only. This mirrors commonly used IELTS Listening conversion
// ranges, but is not an official IELTS, Cambridge, British Council, or IDP result.
export function estimateListeningBand(score: number) {
  if (score >= 39) return 9;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6;
  if (score >= 18) return 5.5;
  if (score >= 16) return 5;
  if (score >= 13) return 4.5;
  return 4;
}

export function getResultBreakdown(
  test: ListeningTest,
  answers: Record<string, UserAnswer>,
) {
  const questions = test.parts.flatMap((part) =>
    part.questions.map((question) => ({ ...question, part: part.partNumber })),
  );

  const byPart = test.parts.map((part) => ({
    label: `Part ${part.partNumber}`,
    score: part.questions.reduce(
      (score, question) => score + scoreQuestion(question, answers[question.id]),
      0,
    ),
    total: part.questions.reduce(
      (total, question) => total + questionSlotCount(question),
      0,
    ),
  }));

  const byTypeMap = new Map<string, { score: number; total: number }>();
  const bySkillMap = new Map<string, { score: number; total: number }>();

  questions.forEach((question) => {
    const correct = scoreQuestion(question, answers[question.id]);
    const slots = questionSlotCount(question);
    const type = byTypeMap.get(question.type) ?? { score: 0, total: 0 };
    byTypeMap.set(question.type, {
      score: type.score + correct,
      total: type.total + slots,
    });

    question.skillTags.forEach((skill) => {
      const item = bySkillMap.get(skill) ?? { score: 0, total: 0 };
      bySkillMap.set(skill, {
        score: item.score + correct,
        total: item.total + slots,
      });
    });
  });

  const byType = [...byTypeMap.entries()].map(([label, value]) => ({
    label,
    ...value,
  }));
  const bySkill = [...bySkillMap.entries()]
    .map(([label, value]) => ({ label, ...value }))
    .sort((a, b) => a.score / a.total - b.score / b.total);

  return { byPart, byType, bySkill };
}
