import { FocusedPractice } from "@/components/focused-practice";

export function generateStaticParams() {
  return [
    "part-1",
    "part-2",
    "part-3",
    "part-4",
    "multiple-choice",
    "matching",
    "map-plan",
    "completion",
  ].map((slug) => ({ slug }));
}

export default async function PracticeDetailPage({
  params,
}: PageProps<"/practice/[slug]">) {
  const { slug } = await params;
  return <FocusedPractice slug={slug} />;
}
