import { notFound } from "next/navigation";
import { ExamInterface } from "@/components/listening/exam-interface";
import { listeningTests } from "@/mock-data/listening-tests";

export function generateStaticParams() {
  return listeningTests.map((test) => ({
    attemptId: `${test.id}-demo-attempt`,
  }));
}

export default async function TestPage({
  params,
  searchParams,
}: PageProps<"/test/[attemptId]">) {
  const { attemptId } = await params;
  const query = await searchParams;
  const test = listeningTests.find((item) => attemptId.startsWith(item.id));
  if (!test) notFound();
  const requestedMode = query.mode === "practice" ? "practice" : "mock";
  return (
    <ExamInterface
      test={test}
      attemptId={attemptId}
      requestedMode={requestedMode}
    />
  );
}
