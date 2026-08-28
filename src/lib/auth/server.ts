import "server-only";

import { CognitoJwtVerifier } from "aws-jwt-verify";
import { cookies } from "next/headers";
import type { NextRequest, NextResponse } from "next/server";
import { authEnv } from "@/lib/auth/env";

export type ServerAuthUser = {
  userId: string;
  username: string;
  email: string;
  name: string;
};

type CookieReader = {
  get(name: string): { value: string } | undefined;
};

const idTokenVerifier = authEnv.isConfigured
  ? CognitoJwtVerifier.create({
      userPoolId: authEnv.userPoolId,
      clientId: authEnv.userPoolClientId,
      tokenUse: "id",
    })
  : null;

const accessTokenVerifier = authEnv.isConfigured
  ? CognitoJwtVerifier.create({
      userPoolId: authEnv.userPoolId,
      clientId: authEnv.userPoolClientId,
      tokenUse: "access",
    })
  : null;

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function readAuthToken(
  reader: CookieReader,
  tokenName: "idToken" | "accessToken",
) {
  const prefix = `CognitoIdentityServiceProvider.${authEnv.userPoolClientId}`;
  const lastUser = reader.get(`${prefix}.LastAuthUser`)?.value;
  if (!lastUser) return "";

  const username = decodeURIComponent(lastUser);
  return reader.get(`${prefix}.${username}.${tokenName}`)?.value ?? "";
}

export async function getServerAuthUser(): Promise<ServerAuthUser | null> {
  if (!idTokenVerifier) return null;

  try {
    const cookieStore = await cookies();
    const token = readAuthToken(cookieStore, "idToken");
    if (!token) return null;

    const claims = await idTokenVerifier.verify(token);
    const email = stringValue(claims.email);
    const name =
      stringValue(claims.name) ||
      [stringValue(claims.given_name), stringValue(claims.family_name)]
        .filter(Boolean)
        .join(" ") ||
      email ||
      "Listenly learner";

    return {
      userId: stringValue(claims.sub),
      username: stringValue(claims["cognito:username"]) || email,
      email,
      name,
    };
  } catch {
    return null;
  }
}

export async function hasServerAuthSession(
  request: NextRequest,
  response: NextResponse,
) {
  void response;
  if (!accessTokenVerifier) return false;

  try {
    const token = readAuthToken(request.cookies, "accessToken");
    if (!token) return false;
    await accessTokenVerifier.verify(token);
    return true;
  } catch {
    return false;
  }
}
