import { AttemptRouteLoader } from "@/components/attempt-route-loader";

export default async function SetupPage({
  params,
  searchParams,
}: PageProps<"/test/[attemptId]/setup">) {
  const { attemptId } = await params;
  const query = await searchParams;
  const mode = query.mode === "practice" ? "practice" : "mock";
  return (
    <AttemptRouteLoader
      attemptId={attemptId}
      view="setup"
      requestedMode={mode}
      demoEnabled={query.demo === "true"}
    />
  );
}
