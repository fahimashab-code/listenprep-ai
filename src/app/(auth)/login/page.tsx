import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { AuthForm } from "@/components/auth-form";
import { ButtonLink } from "@/components/ui/button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    next?: string;
    confirmed?: string;
    reset?: string;
    reason?: string;
  }>;
}) {
  const { next, confirmed, reset, reason } = await searchParams;

  return (
    <div>
      <AuthPageHeader
        eyebrow="Welcome back"
        title="Log in to Listenly"
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
      {reason === "verification-unavailable" && (
        <div
          role="alert"
          className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900"
        >
          Your sign-in could not be verified because the authentication service was unreachable. Your credentials may still be correct. Please try again shortly.
        </div>
      )}
      <AuthForm mode="login" nextPath={next} />
      <div className="mt-8 border-t pt-6">
        <p className="mb-3 text-center text-sm text-muted">
          New to Listenly?
        </p>
        <ButtonLink
          href="/register"
          variant="secondary"
          size="lg"
          className="w-full rounded-xl border-primary text-primary"
        >
          Create a new account
        </ButtonLink>
      </div>
    </div>
  );
}
