import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="p-6 shadow-[0_16px_45px_rgba(23,32,26,0.07)] sm:p-8">
      <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
      <p className="mt-2 text-sm leading-6 text-[#69746d]">
        Continue your IELTS Listening preparation.
      </p>
      <AuthForm mode="login" />
      <p className="mt-5 text-center text-sm text-[#69746d]">
        New to Listenly?{" "}
        <Link href="/register" className="font-bold text-[#176b3a]">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
