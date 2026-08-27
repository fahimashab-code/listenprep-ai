import { AttemptRouteLoader } from "@/components/attempt-route-loader";

export default async function ResultsPage({
  params,
}: PageProps<"/results/[attemptId]">) {
  const { attemptId } = await params;
  return <AttemptRouteLoader attemptId={attemptId} view="result" />;
}
