import Link from "next/link";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <div>
      <AuthPageHeader
        eyebrow="Secure your account"
        title="Choose a new password"
        description="Enter the verification code from your email, then create a new password."
      />
      <ResetPasswordForm initialEmail={email} />
      <Link
        href="/forgot-password"
        className="mt-5 block text-center text-sm font-bold text-primary"
      >
        Request another code
      </Link>
    </div>
  );
}
