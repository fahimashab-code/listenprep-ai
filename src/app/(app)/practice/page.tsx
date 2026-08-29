import { ArrowRight, ClipboardCheck, Headphones, Library } from "lucide-react";
import { PageHeading } from "@/components/page-heading";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PracticePage() {
  return (
    <>
      <PageHeading
        title="Listening Practice"
        description="Practise with a listening test published by your Listenly administrator."
      />

      <Card className="overflow-hidden border-primary/35">
        <div className="grid lg:grid-cols-[1fr_280px]">
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Available now
            </p>
            <h3 className="mt-3 text-2xl font-bold">
              Choose a published test
            </h3>
            <p className="mt-3 max-w-xl leading-7 text-muted">
              Open a test and select Practice mode for pause and review
              controls, or Mock Test mode for a timed exam-style session.
            </p>
            <ButtonLink href="/tests" className="mt-6">
              Browse published tests <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
          <div className="hidden place-items-center bg-primary-strong lg:grid">
            <div className="grid size-28 place-items-center rounded-full border border-white/15 bg-white/5 text-white">
              <Headphones className="size-12" />
            </div>
          </div>
        </div>
      </Card>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
            <ClipboardCheck className="size-5" />
          </span>
          <h3 className="mt-4 text-lg font-bold">Mock Test mode</h3>
          <p className="mt-2 type-body-sm text-muted">
            Complete the published recording once with exam-style controls,
            then submit your answers for scoring.
          </p>
        </Card>
        <Card className="p-5 sm:p-6">
          <span className="grid size-11 place-items-center rounded-xl bg-primary-soft text-primary">
            <Library className="size-5" />
          </span>
          <h3 className="mt-4 text-lg font-bold">Practice mode</h3>
          <p className="mt-2 type-body-sm text-muted">
            Use the same published test with learning controls, including
            pause and transcript review when that content is available.
          </p>
        </Card>
      </section>
    </>
  );
}
