import type { ResourcesConfig } from "aws-amplify";
import { authEnv } from "@/lib/auth/env";

function createAuthConfig(): ResourcesConfig | null {
  if (!authEnv.isConfigured) {
    return null;
  }

  const loginWith: NonNullable<
    NonNullable<ResourcesConfig["Auth"]>["Cognito"]["loginWith"]
  > = {
    email: true,
  };

  if (authEnv.googleEnabled) {
    loginWith.oauth = {
      domain: authEnv.domain,
      scopes: ["email", "openid", "profile"],
      redirectSignIn: [`${authEnv.appOrigin}/callback`],
      redirectSignOut: [`${authEnv.appOrigin}/login`],
      responseType: "code",
      providers: ["Google"],
    };
  }

  return {
    Auth: {
      Cognito: {
        userPoolId: authEnv.userPoolId,
        userPoolClientId: authEnv.userPoolClientId,
        signUpVerificationMethod: "code",
        loginWith,
      },
    },
  };
}

export const amplifyConfig = createAuthConfig();
