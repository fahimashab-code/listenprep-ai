import { PageHeading } from "@/components/page-heading";
import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
  return (
    <>
      <PageHeading
        title="Profile"
        description="Keep your listening target and practice preference up to date."
      />
      <ProfileForm />
    </>
  );
}
