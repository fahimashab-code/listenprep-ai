# Listenly — IELTS Listening Practice Frontend

Listenly is a frontend demo for focused IELTS Listening preparation. It
supports full 40-question mocks, strict and practice test modes, local
autosave, educational result analysis, targeted practice, and progress
tracking.

All practice content in this repository is original IELTS-style demo content.
The product is not affiliated with IELTS, Cambridge, the British Council, or
IDP.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. On the sign-in screen, use **Continue with demo
account**; the other authentication controls are intentionally mocked.

Production checks:

```bash
npm run lint
npm run build
```

## Important routes

- `/` — marketing landing page
- `/login`, `/register`, `/forgot-password` — mocked authentication
- `/dashboard` — priority-based learner dashboard
- `/tests` and `/tests/mock-01` — mock library and mode selection
- `/test/mock-01-demo-attempt/setup?mode=mock` — pre-test audio check
- `/test/mock-01-demo-attempt?mode=mock` — distraction-free exam
- `/results/history-07` — populated educational result and review
- `/practice` and `/practice/multiple-choice` — targeted practice journey
- `/progress`, `/history`, `/profile` — learner analytics and settings
- `/generate` — simulated future custom-practice workflow

## Architecture

- `src/types` contains backend-ready Listening test, question, Part, attempt,
  and answer models.
- `src/mock-data` contains five full mocks, focused exercises, progress, and
  historical attempts.
- `src/lib/services.ts` defines service interfaces and local mock
  implementations that can later be replaced by API adapters.
- `src/lib/scoring.ts` normalizes answers, checks word limits, scores attempts,
  estimates practice bands, and produces result breakdowns.
- `src/lib/storage.ts` isolates localStorage persistence.
- `src/components/listening` contains the data-driven question renderer,
  pre-test flow, and exam state.

## Demo behaviour

`DEMO_TIMING` is enabled in `src/config/demo.ts`. It accelerates the simulated
audio flow and exposes a labelled **Demo: next Part** control. No copyrighted
audio is bundled; local placeholder audio paths are represented by a
non-seekable simulated player.

Answers and the current Part are restored from localStorage. Because there is
no real audio file or backend clock in this prototype, simulated audio progress
within the restored Part restarts after a refresh. This limitation is explained
on the pre-test and exit screens.
