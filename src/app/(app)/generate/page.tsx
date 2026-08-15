import { GenerationPreview } from "@/components/generation-preview";
import { PageHeading } from "@/components/page-heading";

export default function GeneratePage() {
  return (
    <>
      <PageHeading
        eyebrow="Personalised practice"
        title="Create Custom Listening Practice"
        description="Choose a topic or bring your own source text, then preview how a tailored IELTS Listening practice will be created."
      />
      <GenerationPreview />
    </>
  );
}
