import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Card } from "@/components/ui/card";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <Card className="p-6 shadow-[0_16px_45px_rgba(23,32,26,0.07)] sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">
        Choose a new password
      </h1>
      <p className="mt-2 type-body-sm text-muted">
        Enter the code from your email and your new password.
      </p>
      <ResetPasswordForm initialEmail={email} />
      <Link
        href="/forgot-password"
        className="mt-5 block text-center text-sm font-bold text-primary"
      >
        Request another code
      </Link>
    </Card>
  );
}
