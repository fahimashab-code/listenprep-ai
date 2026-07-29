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
        description="Keep your listening target and practice preference up to date."
      />
      <ProfileForm userName={user.name} userEmail={user.email} />
    </>
  );
}
