# Listenly learner app

Listenly is an IELTS Listening practice application. The current source supports published full tests, mock and practice modes, answers and submission, results, review, and attempt history.

The [product documents](docs/README.md) describe the next direction: dependable tests, easier mistake review, and one-part practice. Results now include explanations and audio replay; passage playback depends on supplied evidence timestamps. One-part selection remains planned. Shared structure and working rules are in [Architecture](docs/ARCHITECTURE.md) and [Implementation guidelines](docs/IMPLEMENTATION_GUIDELINES.md).

This README was checked against source on 23 September 2026. It does not establish that the deployed application, available content, or cloud configuration works.

## Run locally

```bash
npm install
npm run dev
```

In Windows PowerShell, use `npm.cmd` if script execution is restricted. The default local address is [localhost:3000](http://localhost:3000). If Admin is also running, the apps need separate ports.

Authentication uses Amplify/Cognito. Follow the shared [authentication guide](docs/AUTHENTICATION.md). The source reads `NEXT_PUBLIC_COGNITO_USER_POOL_ID` and `NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID`; optional Google sign-in also depends on its feature flag and Cognito domain configuration.

Test and attempt requests require `NEXT_PUBLIC_LISTENLY_API_URL` and an available backend. Authentication and test APIs are separate: basic authentication configuration does not make test content available. Do not commit secrets or `.env.local` values.

## Main routes

| Route | Current purpose |
| --- | --- |
| `/` | Public landing page |
| `/login`, `/register`, `/confirm-signup` | Sign-in and account confirmation |
| `/forgot-password`, `/reset-password`, `/callback` | Recovery and OAuth callback |
| `/dashboard` | Start or continue a test; recent activity |
| `/tests`, `/tests/[testId]` | Published tests and mode selection |
| `/test/[attemptId]/setup` | Pre-test instructions and audio check |
| `/test/[attemptId]` | Test questions and recording playback |
| `/results/[attemptId]` | Score and question review |
| `/practice` | Entry to published full tests in practice mode; not a separate skill-exercise library |
| `/progress`, `/history`, `/profile` | Attempt summaries, past attempts, and account details |
| `/generate` | Redirects to `/practice` |

Use actual test and attempt IDs from the configured service. Old demo IDs are not setup instructions.

## Source map

- `src/lib/api/listenly-service.ts` calls learner test and attempt endpoints.
- `src/lib/auth/` contains Cognito configuration and session operations.
- `src/components/listening/` contains setup, question rendering, and playback.
- `src/components/results/result-view.tsx` presents answers and review evidence supplied by question content.
- `src/lib/scoring.ts` contains answer and result helpers.
- `src/lib/storage.ts` preserves pending answers for an API-verified attempt belonging to the same learner. Account-wide lists use the authenticated API.
- `src/types/listening.ts` defines test, question, and attempt shapes.

The active playback path uses published audio URLs. Existence of a URL or route does not prove a complete, reviewed test is available. Resume behavior and saved playback position must be checked before making guarantees to learners.

Practice estimates are not official IELTS results. Listenly is not affiliated with IELTS, Cambridge, British Council, or IDP.

## Code checks

```bash
npm run lint
npm run build
node --test tests/learner-regressions.test.mjs
```

Run these checks after code changes. The shared documents by themselves do not require an application build.
