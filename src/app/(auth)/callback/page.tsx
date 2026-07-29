import { OAuthCallback } from "@/components/auth/oauth-callback";
import { Card } from "@/components/ui/card";

export default function CallbackPage() {
  return (
    <Card className="p-8 shadow-[0_16px_45px_rgba(23,32,26,0.07)]">
      <OAuthCallback />
    </Card>
  );
}
