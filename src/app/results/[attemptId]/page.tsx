import { ResultView } from "@/components/results/result-view";
import { historicalAttempts, mockTestOne } from "@/mock-data/listening-tests";

export function generateStaticParams() {
  return [
    { attemptId: "mock-01-demo-attempt" },
    ...historicalAttempts.map((attempt) => ({ attemptId: attempt.id })),
  ];
}

export default async function ResultsPage({
  params,
}: PageProps<"/results/[attemptId]">) {
  const { attemptId } = await params;
  return <ResultView test={mockTestOne} attemptId={attemptId} />;
}
