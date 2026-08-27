import { TestDetails } from "@/components/test-details";

export default async function TestDetailsPage({
  params,
}: PageProps<"/tests/[testId]">) {
  const { testId } = await params;
  return <TestDetails testId={testId} />;
}
