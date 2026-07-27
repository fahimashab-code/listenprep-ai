import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <Card className="p-6 shadow-[0_16px_45px_rgba(23,32,26,0.07)] sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">
        Start your listening practice
      </h1>
      <p className="mt-2 type-body-sm text-muted">
        Create a demo account. No payment details are needed.
      </p>
      <AuthForm mode="register" />
      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary">
          Sign in
        </Link>
      </p>
    </Card>
  );
}
