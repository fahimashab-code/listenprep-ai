import Link from "next/link";
import { ConfirmSignupForm } from "@/components/auth/confirm-signup-form";
import { Card } from "@/components/ui/card";

export default async function ConfirmSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email = "" } = await searchParams;

  return (
    <Card className="p-6 shadow-[0_16px_45px_rgba(23,32,26,0.07)] sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Confirm your email</h1>
      <p className="mt-2 type-body-sm text-muted">
        Enter the confirmation code Cognito sent to your email address.
      </p>
      <ConfirmSignupForm initialEmail={email} />
      <p className="mt-5 text-center text-sm text-muted">
        Already confirmed?{" "}
        <Link href="/login" className="font-bold text-primary">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
