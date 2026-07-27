import { Brand } from "@/components/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <header className="px-5 py-5 sm:px-8">
        <Brand />
      </header>
      <main className="mx-auto flex min-h-[calc(100vh-84px)] max-w-[440px] items-center px-5 pb-16">
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
