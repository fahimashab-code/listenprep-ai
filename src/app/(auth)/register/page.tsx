import Link from "next/link";
import { AuthPageHeader } from "@/components/auth/auth-page-header";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <div>
      <AuthPageHeader
        eyebrow="Get started"
        title="Create your Listenly account"
        description="Start with a full listening mock, then improve through focused practice and review."
      />
      <AuthForm mode="register" />
      <p className="mt-5 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
