import Link from "next/link";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { AuthForm } from "@/components/auth-form";

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
    <div>
      <AuthPageHeader
        eyebrow="Welcome back"
        title="Sign in to continue"
        description="Resume your listening practice and pick up where you left off."
      />
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
    </div>
  );
}
