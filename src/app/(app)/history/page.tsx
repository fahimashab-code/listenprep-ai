import { ArrowRight, CalendarDays, Clock3, Headphones } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { historicalAttempts } from "@/mock-data/listening-tests";

export default function HistoryPage() {
  return (
    <>
      <PageHeading
        title="Listening History"
        description="Review previous full mocks to revisit mistakes and transcript evidence."
      />

      <Card className="hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-surface-subtle text-xs uppercase tracking-wide text-muted">
            <tr>
              {["Test", "Date", "Score", "Estimated Band", "Duration", "Action"].map(
                (heading) => (
                  <th key={heading} className="px-5 py-4 font-bold">
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y">
            {historicalAttempts.map((attempt) => (
              <tr key={attempt.id} className="hover:bg-[#fafcfa]">
                <td className="px-5 py-4 font-bold">{attempt.testTitle}</td>
                <td className="px-5 py-4 text-muted">{attempt.date}</td>
                <td className="px-5 py-4 font-bold">{attempt.score} / 40</td>
                <td className="px-5 py-4">
                  <Badge variant="green">~{attempt.estimatedBand.toFixed(1)}</Badge>
                </td>
                <td className="px-5 py-4 text-muted">
                  {attempt.durationMinutes}m
                </td>
                <td className="px-5 py-4">
                  <ButtonLink href={`/results/${attempt.id}`} variant="ghost" size="sm">
                    Review <ArrowRight className="size-4" />
                  </ButtonLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid gap-3 md:hidden">
        {historicalAttempts.map((attempt) => (
          <Card key={attempt.id} className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary-soft text-primary">
                  <Headphones className="size-5" />
                </span>
                <div>
                  <h3 className="font-bold">{attempt.testTitle}</h3>
                  <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                    <CalendarDays className="size-3.5" /> {attempt.date}
                  </p>
                </div>
              </div>
              <p className="text-xl font-bold">{attempt.score}/40</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-3 text-sm text-muted">
                <Badge variant="green">~{attempt.estimatedBand.toFixed(1)}</Badge>
                <span className="flex items-center gap-1">
                  <Clock3 className="size-3.5" /> {attempt.durationMinutes}m
                </span>
              </div>
              <ButtonLink href={`/results/${attempt.id}`} variant="ghost" size="sm">
                Review
              </ButtonLink>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
