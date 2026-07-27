import { PageHeading } from "@/components/page-heading";
import { TestLibrary } from "@/components/test-library";
import { listeningTests } from "@/mock-data/listening-tests";

export default function TestsPage() {
  return (
    <>
      <PageHeading
        title="Listening Mock Tests"
        description="Choose a complete 40-question IELTS Listening mock. Use Mock Exam for a strict run, or Practice Mode to learn as you go."
      />
      <TestLibrary tests={listeningTests} />
    </>
  );
}
