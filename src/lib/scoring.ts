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

export function calculateRawScore(
  test: ListeningTest,
  answers: Record<string, UserAnswer>,
) {
  return test.parts
    .flatMap((part) => part.questions)
    .filter((question) => isAnswerCorrect(question, answers[question.id]))
    .length;
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
    score: part.questions.filter((question) =>
      isAnswerCorrect(question, answers[question.id]),
    ).length,
    total: part.questions.length,
  }));

  const byTypeMap = new Map<string, { score: number; total: number }>();
  const bySkillMap = new Map<string, { score: number; total: number }>();

  questions.forEach((question) => {
    const correct = isAnswerCorrect(question, answers[question.id]) ? 1 : 0;
    const type = byTypeMap.get(question.type) ?? { score: 0, total: 0 };
    byTypeMap.set(question.type, {
      score: type.score + correct,
      total: type.total + 1,
    });

    question.skillTags.forEach((skill) => {
      const item = bySkillMap.get(skill) ?? { score: 0, total: 0 };
      bySkillMap.set(skill, {
        score: item.score + correct,
        total: item.total + 1,
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
