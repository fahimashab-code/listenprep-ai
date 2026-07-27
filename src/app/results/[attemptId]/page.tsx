import { ResultView } from "@/components/results/result-view";
import {
  historicalAttempts,
  listeningTests,
  mockTestOne,
} from "@/mock-data/listening-tests";

export function generateStaticParams() {
  return [
    ...listeningTests.map((test) => ({
      attemptId: `${test.id}-demo-attempt`,
    })),
    ...historicalAttempts.map((attempt) => ({ attemptId: attempt.id })),
  ];
}

export default async function ResultsPage({
  params,
}: PageProps<"/results/[attemptId]">) {
  const { attemptId } = await params;
  const test =
    listeningTests.find((item) => attemptId.startsWith(item.id)) ?? mockTestOne;
  return <ResultView test={test} attemptId={attemptId} />;
}
