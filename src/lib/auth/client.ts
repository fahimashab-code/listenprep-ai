"use client";

import "aws-amplify/auth/enable-oauth-listener";
import { Amplify } from "aws-amplify";
import {
  confirmResetPassword,
  confirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  resendSignUpCode,
  resetPassword,
  signIn,
  signInWithRedirect,
  signOut,
  signUp,
} from "aws-amplify/auth";
import { amplifyConfig } from "@/lib/auth/config";
import { authEnv } from "@/lib/auth/env";

let configured = false;

export function configureAmplifyClient() {
  if (!configured && amplifyConfig) {
    Amplify.configure(amplifyConfig, { ssr: true });
    configured = true;
  }

  return configured;
}

function requireAuthConfiguration() {
  if (!configureAmplifyClient()) {
    throw new Error(
      "Authentication is not configured. Add the Cognito environment variables.",
    );
  }
}

export type SignInResult =
  | { status: "signed-in" }
  | { status: "confirm-sign-up"; email: string }
  | { status: "reset-password"; email: string }
  | { status: "additional-step"; message: string };

function isAlreadyAuthenticatedError(error: unknown) {
  return (
    error instanceof Error &&
    error.name === "UserAlreadyAuthenticatedException"
  );
}

async function signInWithCredentials(email: string, password: string) {
  return signIn({
    username: email,
    password,
  });
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}) {
  requireAuthConfiguration();
  const nameParts = input.name.trim().split(/\s+/);
  const givenName = nameParts[0];
  const familyName = nameParts.slice(1).join(" ");

  const output = await signUp({
    username: input.email.trim().toLowerCase(),
    password: input.password,
    options: {
      userAttributes: {
        email: input.email.trim().toLowerCase(),
        name: input.name.trim(),
        given_name: givenName,
        ...(familyName ? { family_name: familyName } : {}),
      },
    },
  });

  return output.nextStep.signUpStep;
}

export async function confirmUserRegistration(email: string, code: string) {
  requireAuthConfiguration();
  return confirmSignUp({
    username: email.trim().toLowerCase(),
    confirmationCode: code.trim(),
  });
}

export async function resendRegistrationCode(email: string) {
  requireAuthConfiguration();
  return resendSignUpCode({ username: email.trim().toLowerCase() });
}

export async function loginUser(
  email: string,
  password: string,
): Promise<SignInResult> {
  requireAuthConfiguration();
  const normalizedEmail = email.trim().toLowerCase();
  let output;

  try {
    output = await signInWithCredentials(normalizedEmail, password);
  } catch (error) {
    if (!isAlreadyAuthenticatedError(error)) {
      throw error;
    }

    try {
      const session = await fetchAuthSession({ forceRefresh: true });
      if (session.tokens?.accessToken && session.tokens.idToken) {
        return { status: "signed-in" };
      }
    } catch {
      // The stored refresh token is no longer usable. Clear the local session
      // below so the submitted credentials can start a clean sign-in.
    }

    await signOut();
    output = await signInWithCredentials(normalizedEmail, password);
  }

  if (output.isSignedIn || output.nextStep.signInStep === "DONE") {
    return { status: "signed-in" };
  }

  switch (output.nextStep.signInStep) {
    case "CONFIRM_SIGN_UP":
      return { status: "confirm-sign-up", email: normalizedEmail };
    case "RESET_PASSWORD":
      return { status: "reset-password", email: normalizedEmail };
    case "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED":
      return {
        status: "additional-step",
        message:
          "A new password is required for this account. Ask an administrator to complete the temporary-password flow.",
      };
    case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
    case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
      return {
        status: "additional-step",
        message: authEnv.totpMfaEnabled
          ? "TOTP verification is enabled but handled by the separate MFA flow."
          : "This account requires TOTP verification, which is not enabled in this application.",
      };
    case "CONFIRM_SIGN_IN_WITH_EMAIL_CODE":
    case "CONTINUE_SIGN_IN_WITH_EMAIL_SETUP":
      return {
        status: "additional-step",
        message: authEnv.emailMfaEnabled
          ? "Email MFA is enabled but handled by the separate MFA flow."
          : "This account requires email MFA, which is not enabled in this application.",
      };
    default:
      return {
        status: "additional-step",
        message:
          "This account requires an additional sign-in step that is not enabled.",
      };
  }
}

export async function loginWithGoogle() {
  requireAuthConfiguration();
  if (!authEnv.googleEnabled) {
    throw new Error("Google sign-in is not enabled.");
  }

  await signInWithRedirect({ provider: "Google" });
}

export async function beginPasswordReset(email: string) {
  requireAuthConfiguration();
  return resetPassword({ username: email.trim().toLowerCase() });
}

export async function finishPasswordReset(
  email: string,
  code: string,
  password: string,
) {
  requireAuthConfiguration();
  return confirmResetPassword({
    username: email.trim().toLowerCase(),
    confirmationCode: code.trim(),
    newPassword: password,
  });
}

export async function logoutUser() {
  requireAuthConfiguration();
  await signOut();
}

export async function getClientAuthUser() {
  requireAuthConfiguration();
  return getCurrentUser();
}

export async function getAccessToken(forceRefresh = false) {
  requireAuthConfiguration();
  const session = await fetchAuthSession({ forceRefresh });
  return session.tokens?.accessToken?.toString() ?? null;
}
