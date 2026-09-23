# Codex Instructions

## Documentation

Read the shared [documentation index](docs/README.md) and [implementation guidelines](docs/IMPLEMENTATION_GUIDELINES.md) before implementation. Product intent, planned work, and current architecture are separate documents. Read the sections relevant to the task and update the existing document when behavior changes.

## Scope

These instructions apply to the entire `listenly-frontend` repository.

## Project

- This is the customer-facing Listenly IELTS listening practice application.
- The stack is Next.js 16, React 19, TypeScript, Tailwind CSS 4, and AWS Amplify/Cognito.
- Follow the existing App Router structure and established patterns in `src/`.
- For version-sensitive Next.js behavior, consult the bundled documentation in `node_modules/next/dist/docs/`.

## Working rules

- Make focused changes and preserve existing behavior unless the task explicitly changes it.
- Prefer the simplest implementation that meets the requirement; do not add abstractions prematurely.
- Reuse existing components, utilities, types, and styling patterns before creating new ones.
- Do not add dependencies, paid services, or costly external operations without user approval.
- Never expose secrets or commit `.env.local` values.
- Use browser or end-to-end automation only when the task requires it or the user requests it.

Next.js boundaries
Prefer Server Components by default.
Add "use client" only for state, events, effects, or browser APIs.


## Authentication

- Before changing authentication, read [Authentication](docs/AUTHENTICATION.md).
- Keep authentication inside this application and preserve the existing UI architecture.
- Basic Cognito authentication must work without Lambda or API Gateway.
- Lambda and API integrations must remain optional and must not prevent startup when their environment variables are missing.

## Verification

- Run `npm run lint` after code changes.
- Run `npm run build` for changes that can affect compilation, routing, configuration, or production behavior.
- If a relevant check cannot be run, report why.

## Scope and maintenance

- Documentation-only changes need documentation checks, not application tests or builds.
- Do not start servers, generate paid audio, deploy, commit, or push unless requested for the task.
- Keep setup in this README and shared product/technical guidance in `docs/`.
- Do not store task status, chat history, implementation plans, or completed-task notes in `AGENTS.md`.
- Do not add duplicate overviews or archived instruction files.
