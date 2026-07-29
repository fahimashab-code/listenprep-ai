import Link from "next/link";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { ConfirmSignupForm } from "@/components/auth/confirm-signup-form";

export default async function ConfirmSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <div>
      <AuthPageHeader
        eyebrow="Verify your account"
        title="Confirm your email"
        description="Enter the verification code we sent to your email address."
      />
      <ConfirmSignupForm initialEmail={email} />
      <p className="mt-5 text-center text-sm text-muted">
        Already confirmed?{" "}
        <Link href="/login" className="font-bold text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
