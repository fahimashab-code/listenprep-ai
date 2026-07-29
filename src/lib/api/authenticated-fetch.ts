"use client";

import { getAccessToken, logoutUser } from "@/lib/auth/client";

export class AuthSessionError extends Error {
  constructor(message = "Your session has expired. Please sign in again.") {
    super(message);
    this.name = "AuthSessionError";
  }
}

async function requestWithToken(
  input: RequestInfo | URL,
  init: RequestInit,
  forceRefresh: boolean,
) {
  const token = await getAccessToken(forceRefresh);
  if (!token) {
    throw new AuthSessionError();
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
}

/**
 * Use for existing or future protected HTTP requests.
 * The API must still verify the Cognito access token and authorization claims.
 */
export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
) {
  let response: Response;

  try {
    response = await requestWithToken(input, init, false);
  } catch {
    throw new AuthSessionError();
  }

  if (response.status !== 401) {
    return response;
  }

  try {
    response = await requestWithToken(input, init, true);
  } catch {
    await logoutUser().catch(() => undefined);
    throw new AuthSessionError();
  }

  if (response.status === 401) {
    await logoutUser().catch(() => undefined);
    throw new AuthSessionError();
  }

  return response;
}
