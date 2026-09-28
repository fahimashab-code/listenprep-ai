# Listenly authentication

Source reviewed 28 September 2026. This describes the current local application differences, not a complete verification of live Cognito configuration.

## Learner and Admin are separate

| Area | Learner app | Admin app |
| --- | --- | --- |
| Main flow | Email signup, confirmation, login, password recovery, logout | Email/password login and supported email MFA challenge |
| Google | Optional, controlled by app configuration and Cognito | Not part of the current Admin flow |
| Account creation | Public registration flow | Administrators are provisioned outside the app |
| Session handling | Amplify with SSR configuration; server checks verify Cognito tokens from cookies | Amplify client session; Admin service retrieves the access token |
| API calls | Learner access token | Admin access token |

Admin source handles email-code MFA and selects EMAIL when offered. It also accepts a completed Cognito sign-in without another challenge; the application alone does not prove that MFA is enforced. Required email MFA is a Cognito configuration requirement to verify when configuring Admin. Password-reset or new-password challenges direct the Admin to support.

Basic authentication talks to Cognito independently of test/audio APIs. Missing business API configuration should not be treated as a reason to redesign login. A logged-in user still needs an available, correctly configured API to load content.

The Next.js server also needs outbound HTTPS access to Cognito's public signing keys. A browser can sign in successfully while a network-restricted server redirects it back to login. Server token verification shares a key cache and allows a ten-second response timeout; signature, issuer, client, expiry, and token-use checks remain enforced. When a login form is submitted for a different email, the client replaces the previous account's session rather than silently reusing it.

## Known failure and recovery boundary

During 27 September QA, public signing-key retrieval failed inside the restricted server runtime and returned HTTP 200 outside it. Restarting the local server with normal outbound access restored Home. Treat this as evidence of that environment failure, not proof that all sign-in issues are fixed. Check server connectivity before changing authentication code or Cognito settings; never bypass token verification.

The local server check now distinguishes a missing/invalid session from temporary verification-service unavailability. Protected-route redirects preserve the requested destination and use a separate `verification-unavailable` reason; the login page explains that credentials may still be correct. The browser request helper reports transport and timeout failures as service-connection errors instead of clearing the session as expired. These changes passed focused local checks and narrow-viewport browser QA, but they are not deployed and no credentialed protected-route or refresh/expiry flow was available for live verification. Signup, confirmation, password recovery, logout/account switching and cross-device sessions require their own checks.

## Configuration names

Set public Cognito identifiers separately for each application's intended pool and public app client. Do not copy old account-specific values from chat or deleted documents.

| Variable | Application | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_COGNITO_USER_POOL_ID` | Both | Intended Cognito user pool |
| `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID` | Both | Intended public app client |
| `NEXT_PUBLIC_APP_ORIGIN` | Both | App origin; keep local ports and hosted origin consistent |
| `NEXT_PUBLIC_COGNITO_DOMAIN` | Learner | Cognito OAuth domain when Google is enabled |
| `NEXT_PUBLIC_ENABLE_GOOGLE_AUTH` | Learner | Enables Google configuration when the domain also exists |
| `NEXT_PUBLIC_ENABLE_TOTP_MFA`, `NEXT_PUBLIC_ENABLE_EMAIL_MFA` | Learner | Existing flags; verify the supported challenge UI before changing them |
| `NEXT_PUBLIC_LISTENLY_API_URL` | Learner | Test and attempt API base URL |
| `NEXT_PUBLIC_ADMIN_API_URL` | Admin | Admin content API base URL |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Admin | Support destination |

Learner OAuth configuration uses authorization-code flow, `/callback` for sign-in, and `/login` for sign-out under the configured app origin. Match those exact addresses in Cognito when enabling Google. Google provider credentials belong in provider configuration, not public frontend variables. Check current provider setup instructions when changing that configuration.

The current Terraform accepts separate `admin_cognito_user_pool_id`, `admin_cognito_user_pool_client_id`, `learner_cognito_user_pool_id`, and `learner_cognito_user_pool_client_id` inputs. These configure API Gateway authorizers; the current Terraform files do not define the Cognito pools themselves.

## Protected API behavior

Both fetch helpers send `Authorization: Bearer <access token>`. The learner helper refreshes and retries once after a 401, then clears an invalid session. The Admin helper retrieves its access token through the existing auth service.

API Gateway uses separate JWT authorizers for Admin and learner routes. Attempt ownership comes from the verified `sub` claim in the backend. A hidden Admin link or a client-side redirect is not the authorization boundary.

## Source map

| Area | Files |
| --- | --- |
| Learner configuration | `listenly-frontend/src/lib/auth/env.ts`, `config.ts` |
| Learner operations and server checks | `listenly-frontend/src/lib/auth/client.ts`, `server.ts`, `routes.ts` |
| Learner request helper | `listenly-frontend/src/lib/api/authenticated-fetch.ts` |
| Admin configuration | `listenly-admin/src/config/auth-env.ts`, `api-env.ts`, `src/lib/auth/amplify-client.ts` |
| Admin operations and request helper | `listenly-admin/src/services/auth-service.ts`, `src/lib/api/admin-api.ts` |
| API authorizers and ownership | `Terraform-iaac/api_gateway.tf`; `listenly-backend/lambdas/tests-api/lambda_function.py` |

When auth changes are requested, verify the relevant login/challenge, refresh, logout, expiry, and unauthorized API paths. Do not add registration or social login to Admin based on a generic auth template. Do not claim live MFA, Google login, or cross-device sessions have been verified from this source map alone.
