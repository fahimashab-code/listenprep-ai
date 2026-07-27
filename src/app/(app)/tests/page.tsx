import { PageHeading } from "@/components/page-heading";
import { TestLibrary } from "@/components/test-library";
import { listeningTests } from "@/mock-data/listening-tests";

export default function TestsPage() {
  return (
    <>
      <PageHeading
        title="Listening Mock Tests"
        description="Choose a complete 4-Part, 40-question Listening mock. Use Mock Test for real-test-style conditions or Practice to learn at your own pace."
      />
      <TestLibrary tests={listeningTests} />
    </>
  );
}
