import { redirect } from "next/navigation";
import { getServerAuthUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function ProtectedResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login");
  }

  return children;
}
