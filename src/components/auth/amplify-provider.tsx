"use client";

import { configureAmplifyClient } from "@/lib/auth/client";

configureAmplifyClient();

export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return children;
}
