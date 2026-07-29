import "server-only";

import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import {
  fetchAuthSession,
  fetchUserAttributes,
  getCurrentUser,
} from "aws-amplify/auth/server";
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

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function fullName(givenName: unknown, familyName: unknown) {
  return [stringValue(givenName), stringValue(familyName)]
    .filter(Boolean)
    .join(" ");
}

export async function getServerAuthUser(): Promise<ServerAuthUser | null> {
  if (!serverRunner) {
    return null;
  }

  try {
    return await serverRunner.runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        const [user, attributeResult, session] = await Promise.all([
          getCurrentUser(contextSpec),
          fetchUserAttributes(contextSpec).catch(() => ({})),
          fetchAuthSession(contextSpec).catch(() => null),
        ]);
        const attributes = attributeResult as Record<
          string,
          string | undefined
        >;
        const claims = session?.tokens?.idToken?.payload ?? {};
        const email =
          stringValue(attributes.email) ||
          stringValue(claims.email);
        const name =
          stringValue(attributes.name) ||
          stringValue(claims.name) ||
          fullName(attributes.given_name, attributes.family_name) ||
          fullName(claims.given_name, claims.family_name) ||
          email ||
          "Listenly learner";

        return {
          userId: user.userId,
          username: user.username,
          email,
          name,
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
