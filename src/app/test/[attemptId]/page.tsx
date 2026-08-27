import { AttemptRouteLoader } from "@/components/attempt-route-loader";

export default async function TestPage({
  params,
  searchParams,
}: PageProps<"/test/[attemptId]">) {
  const { attemptId } = await params;
  const query = await searchParams;
  const requestedMode = query.mode === "practice" ? "practice" : "mock";
  return (
    <AttemptRouteLoader
      attemptId={attemptId}
      view="exam"
      requestedMode={requestedMode}
      demoEnabled={query.demo === "true"}
    />
  );
}
