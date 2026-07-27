import { notFound } from "next/navigation";
import { PreTestScreen } from "@/components/listening/pre-test-screen";
import { listeningTests } from "@/mock-data/listening-tests";

export function generateStaticParams() {
  return listeningTests.map((test) => ({
    attemptId: `${test.id}-demo-attempt`,
  }));
}

export default async function SetupPage({
  params,
  searchParams,
}: PageProps<"/test/[attemptId]/setup">) {
  const { attemptId } = await params;
  const query = await searchParams;
  const test = listeningTests.find((item) => attemptId.startsWith(item.id));
  if (!test) notFound();
  const mode = query.mode === "practice" ? "practice" : "mock";
  return (
    <PreTestScreen
      test={test}
      attemptId={attemptId}
      mode={mode}
      demoEnabled={query.demo === "true"}
    />
  );
}
