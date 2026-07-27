import { GenerationPreview } from "@/components/generation-preview";
import { PageHeading } from "@/components/page-heading";

export default function GeneratePage() {
  return (
    <>
      <PageHeading
        title="Custom Practice Preview"
        description="A frontend-only preview of a future custom listening generation workflow."
      />
      <GenerationPreview />
    </>
  );
}
