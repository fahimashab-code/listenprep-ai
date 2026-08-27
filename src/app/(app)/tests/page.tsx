"use client";

import { PageHeading } from "@/components/page-heading";
import { TestLibrary } from "@/components/test-library";
import { Card } from "@/components/ui/card";
import { learnerTestService } from "@/lib/api/listenly-service";
import type { PublishedTestSummary } from "@/types/listening";
import { useEffect, useState } from "react";

export default function TestsPage() {
  const [tests, setTests] = useState<PublishedTestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    learnerTestService.list()
      .then((items) => active && setTests(items))
      .catch((reason: unknown) => active && setError(reason instanceof Error ? reason.message : "Tests could not be loaded."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <>
      <PageHeading
        title="Listening Mock Tests"
        description="Choose a complete 4-Part, 40-question Listening mock. Use Mock Test for real-test-style conditions or Practice to learn at your own pace."
      />
      {loading ? (
        <Card className="p-8 text-center text-muted">Loading published tests…</Card>
      ) : error ? (
        <Card className="border-red-200 bg-red-50 p-6 text-sm text-red-800">{error}</Card>
      ) : tests.length === 0 ? (
        <Card className="p-8 text-center"><h2 className="text-lg font-bold">No published tests yet</h2><p className="mt-2 text-muted">An administrator can publish the first test from the Admin panel.</p></Card>
      ) : (
        <TestLibrary tests={tests} />
      )}
    </>
  );
}
