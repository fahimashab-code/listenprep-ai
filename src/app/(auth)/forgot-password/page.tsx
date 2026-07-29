import Link from "next/link";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <div>
      <AuthPageHeader
        eyebrow="Account recovery"
        title="Reset your password"
        description="Enter your account email and we’ll send you a secure verification code."
      />
      <ForgotPasswordForm initialEmail={email} />
      <Link
        href="/login"
        className="mt-5 block text-center text-sm font-bold text-primary"
      >
        Back to sign in
      </Link>
    </div>
  );
}
