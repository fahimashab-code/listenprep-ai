import "server-only";

import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { fetchUserAttributes, getCurrentUser } from "aws-amplify/auth/server";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { amplifyConfig } from "@/lib/auth/config";

const serverRunner = amplifyConfig
  ? createServerRunner({ config: amplifyConfig })
  : null;

export type ServerAuthUser = {
  userId: string;
  username: string;
  email: string;
  name: string;
};

export async function getServerAuthUser(): Promise<ServerAuthUser | null> {
  if (!serverRunner) {
    return null;
  }

  try {
    return await serverRunner.runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        const [user, attributeResult] = await Promise.all([
          getCurrentUser(contextSpec),
          fetchUserAttributes(contextSpec).catch(() => ({})),
        ]);
        const attributes = attributeResult as Record<
          string,
          string | undefined
        >;

        return {
          userId: user.userId,
          username: user.username,
          email: attributes.email ?? user.username,
          name:
            attributes.name ??
            attributes.given_name ??
            attributes.email ??
            user.username,
        };
      },
    });
  } catch {
    return null;
  }
}

export async function hasServerAuthSession(
  request: NextRequest,
  response: NextResponse,
) {
  if (!serverRunner) {
    return false;
  }

  try {
    await serverRunner.runWithAmplifyServerContext({
      nextServerContext: { request, response },
      operation: (contextSpec) => getCurrentUser(contextSpec),
    });
    return true;
  } catch {
    return false;
  }
}
