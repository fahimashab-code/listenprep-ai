import { Brand } from "@/components/brand";
import { AuthShowcase } from "@/components/auth/auth-showcase";
import { redirect } from "next/navigation";
import { getServerAuthUser } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerAuthUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-surface lg:grid lg:grid-cols-[minmax(0,1.08fr)_minmax(440px,0.92fr)]">
      <AuthShowcase />
      <section className="flex min-h-screen flex-col border-l bg-surface">
        <header className="flex h-20 items-center px-5 sm:px-8 lg:px-10 xl:px-14">
          <Brand />
        </header>
        <main className="flex flex-1 items-center px-5 py-8 sm:px-8 lg:px-10 xl:px-14">
          <div className="mx-auto w-full max-w-[460px]">{children}</div>
        </main>
        <footer className="px-5 pb-6 text-center text-xs text-subtle sm:px-8 lg:px-10 lg:text-left xl:px-14">
          IELTS-style practice by Listenly. Not affiliated with IELTS.
        </footer>
      </section>
    </div>
  );
}
