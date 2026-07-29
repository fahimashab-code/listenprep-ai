import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
    confirmed?: string;
    reset?: string;
  }>;
}) {
  const { next, confirmed, reset } = await searchParams;

  return (
    <Card className="p-6 shadow-[0_16px_45px_rgba(23,32,26,0.07)] sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 type-body-sm text-muted">
        Continue your IELTS Listening preparation.
      </p>
      {(confirmed === "true" || reset === "true") && (
        <div
          role="status"
          className="mt-5 rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-800"
        >
          {confirmed === "true"
            ? "Your email is confirmed. You can sign in now."
            : "Your password has been updated. You can sign in now."}
        </div>
      )}
      <AuthForm mode="login" nextPath={next} />
      <p className="mt-5 text-center text-sm text-muted">
        New to Listenly?{" "}
        <Link href="/register" className="font-bold text-primary">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
