const normalizeOrigin = (value: string | undefined) =>
  (value || "http://localhost:3000").replace(/\/+$/, "");

const normalizeDomain = (value: string | undefined) =>
  (value || "").replace(/^https?:\/\//, "").replace(/\/+$/, "");

const isEnabled = (value: string | undefined) =>
  value?.trim().toLowerCase() === "true";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID?.trim() || "";
const userPoolClientId =
  process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID?.trim() || "";
const domain = normalizeDomain(process.env.NEXT_PUBLIC_COGNITO_DOMAIN);
const appOrigin = normalizeOrigin(process.env.NEXT_PUBLIC_APP_ORIGIN);

export const authEnv = {
  userPoolId,
  userPoolClientId,
  domain,
  appOrigin,
  isConfigured: Boolean(userPoolId && userPoolClientId),
  googleEnabled:
    isEnabled(process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH) && Boolean(domain),
  totpMfaEnabled: isEnabled(process.env.NEXT_PUBLIC_ENABLE_TOTP_MFA),
  emailMfaEnabled: isEnabled(process.env.NEXT_PUBLIC_ENABLE_EMAIL_MFA),
} as const;
