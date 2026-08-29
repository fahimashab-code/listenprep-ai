import { PageHeading } from "@/components/page-heading";
import { ProfileForm } from "@/components/profile-form";
import { getServerAuthUser } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getServerAuthUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <PageHeading
        title="Profile"
        description="Review your account details and choose how Listenly looks on this browser."
      />
      <ProfileForm userName={user.name} userEmail={user.email} />
    </>
  );
}
