# Listenly product plan

Updated 23 September 2026. Based on local documents, focused source inspection, public learner discussions, app reviews, and official IELTS guidance. No live product tests or learner interviews were performed.

**First make taking a test and reviewing it dependable. Then add a convenient way to practise one part. Add further exercises only when a clear learner need supports them.**

The [product direction](PRODUCT.md) defines the experience. The [research notes](LEARNER_RESEARCH.md) contain the evidence and its limits. Read [Architecture](ARCHITECTURE.md) and [Implementation guidelines](IMPLEMENTATION_GUIDELINES.md) before changing the system.

## What the project already gives us

Keep the full-test builder, reusable audio, reviewed transcripts, existing test screens, saved attempts, and answer review. The source already contains Admin publishing API calls and learner test and attempt API calls. It also contains actual audio playback, Cognito authentication, and result explanations when the question content supplies them.

That is source evidence, not proof that the deployed flow works. We have not checked the available published tests, their audio quality, the completeness of their explanations, or cross-device saving. Do not plan to rebuild these foundations merely because older documents call them demo-only.

## The actual gaps to address

| What we observed | Why it matters | Product decision |
| --- | --- | --- |
| Practice currently sends people to the full-test library. | A learner cannot use that page to choose a single part. | Add one-part practice after the main test and review path is dependable. Keep full tests available. |
| Results labels the lowest-scoring part with a broad description and sends “Focus next” to the test library. | It does not deliver the precise next-practice guidance promised on the homepage. | Lead with the learner's actual wrong answers. Recommend specific further content only when it exists and fits. |
| The inspected results review has text evidence but no question-level audio replay control. | Finding the passage still requires another step outside that review card. | Put contextual audio replay next to the answer. Check available audio boundaries before implementation. |
| Detailed explanations are optional; some questions can show generic advice. | A polished results screen can still leave the learner confused. | Require an answer explanation and matching evidence for content included in the first release. |
| Learner copy refers to tests “published by your administrator.” | It describes internal operations instead of helping someone choose practice. | Use simple learner-facing descriptions of the test and its length. |
| Progress combines completed-attempt summaries. | Assisted practice and fresh mocks need different interpretation. | Label attempt conditions and repeated tests clearly before making improvement claims. |

These are product observations from source. Their effect on real learners still needs observation.

## Work in this order

### 1 Check one complete test and its answers

Choose one full test as the reference experience. The content owner reviews all four parts, questions, answer variants, instructions, audio, and explanations together. Check whether the recording actually supports each answer and whether the speaking style and tasks feel plausible. Use official format guidance as the reference; local speech-rate targets are production preferences, not exam rules.

For each test, record: reviewed parts, unresolved questions, missing explanations, usable audio, and who reviewed it. Do not count generated recordings as finished tests.

**Ready when:** the chosen test has no unresolved answer/audio/instruction conflicts and every question can be explained. If no full test meets this, start with content repair rather than advertising a large library.

### 2 Make the review of that test useful

Prepare a simple walkthrough of the review described in the product direction. Start with the existing answers and transcript evidence. Include the correct audio passage, a short explanation, and a way to return later. A separate AI conversation or a compulsory mistake log is not needed.

Cover correct answers too: a learner may have guessed. Let them review any question, with wrong and unanswered questions easy to find. For missing or disputed evidence, provide a way to report the question; do not invent an explanation.

**Ready when:** a learner can open a question, hear the relevant passage, and understand the accepted answer without searching through the entire recording. No answer is hidden behind an unexpected extra step or payment demand.

### 3 Check the whole path with learners

Ask five people currently preparing for IELTS to use the chosen test or a part of it, then review their answers. Include people who struggle to follow questions as audio plays and someone who mainly needs exam familiarity. Ask them to show how they currently practise so we can compare effort.

Observe these tasks:

- choose practice and explain the controls before starting;
- keep track of the questions while listening;
- submit and find the result;
- open a wrong or uncertain answer and understand its evidence;
- leave and find the same attempt or saved question again.

Record where help was needed, what was confusing, and what explanation was missing. Ask which they would choose next: another full test, one part, or reviewing mistakes. Do not ask only “Do you like it?”

**Ready when:** the main blockers are fixed and the same tasks can be completed without coaching. Report actual observations and counts. A five-person check is not a learning study or a market-size estimate.

### 4 Add one-part practice

Let the learner choose Part 1, 2, 3, or 4 from approved content. Show available recordings and duration. Reuse complete parts and their review material. Keep a part's context; do not cut random sentences into a daily exercise.

Allow replay in learning practice and label the result accordingly. A full mock keeps its own rules. Do not show unavailable parts as ready or claim a Part 1 collection covers the whole exam.

**Ready when:** a person can complete and review one selected part without taking the other three. Saving and review work as clearly as in the full-test path.

### 5 Decide what deserves more investment

Run a small two-week trial after the core path works. Look at completed sessions, content complaints, time spent finding an answer explanation, and voluntary return visits. Note whether reminders prompted a return. Ask which part of the product replaced an awkward step in the learner's old method.

If people repeatedly ask for maps, multiple choice, spelling, or another specific area, prepare a small reviewed collection for that request. If they mostly want more realistic full tests, improve that collection first. Do not build an elaborate recommendation system before there is enough trustworthy content to recommend.

Decide price only after understanding the useful experience and the cost of reviewing and supplying it. Compare first attempts on unseen questions if studying learning improvement; keep repeats and assisted attempts separate.

## What to check before a later implementation brief

| Area | Required behavior |
| --- | --- |
| Starting | The learner knows the length, question count, and playback rules. An audio check is easy to use. |
| Listening | Questions remain readable; answers can be entered without fighting the layout; no interruptions cover the task. |
| Interruption | Saved answers survive where promised. Explain what happens to playback and whether the attempt still counts as an uninterrupted mock. |
| Submission | A slow or failed request does not leave the learner unsure whether answers were submitted. |
| Review | The recording passage, transcript, explanation, and accepted answer agree. Review is available for correct as well as incorrect answers. |
| Return | The learner can find unfinished work, previous results, and saved mistakes. |
| Content problem | The learner can report a suspected bad question; the content owner can identify and correct it. |

Check practice on a phone and full mocks on a laptop. This is planned verification, not completed testing.

## Where the source observations came from

Paths are relative to `F:\Listenly` and were inspected on 22–23 September 2026.

- `listenly-frontend/src/app/(app)/practice/page.tsx` — current Practice destination.
- `listenly-frontend/src/components/results/result-view.tsx` — answer review, optional explanations, broad weakest-part label, and next link.
- `listenly-frontend/src/components/learner-dashboard.tsx` and `src/app/page.tsx` — starting actions and product promises.
- `listenly-frontend/src/components/progress-view.tsx` — completed-attempt summaries.
- `listenly-frontend/src/lib/api/listenly-service.ts` — test and attempt service connections.
- `listenly-frontend/src/lib/auth/client.ts` — Cognito authentication calls.
- `listenly-frontend/src/components/listening/exam-interface.tsx` — recording playback and practice controls.
- `listenly-admin/src/services/api-test-service.ts` and its imports in the active listening-test routes — Admin test management and publication.

## Decisions still open

The plan keeps IELTS Listening as the audience and full tests as a central task. What remains to learn is the most useful first content collection, explanation language, account timing, free access, price, and demand for specific practice types. Public comments do not decide these for Listenly.
