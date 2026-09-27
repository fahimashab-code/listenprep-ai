# Listenly implementation handoff

Updated 27 September 2026. This is the single implementation brief and work order; it replaces the earlier roadmap. Supporting contracts and evidence are linked below.

## Goal and completion gate

**Deliver one trustworthy learner journey: choose a reviewed test → sign in → check audio → answer and recover saved work → submit once → understand mistakes through recording evidence → reopen the same result from History.** Keep the current UI foundation and existing serverless services.

Portfolio-ready means this entire journey works live with one reviewed four-part, 40-question test. Independent practice additionally needs useful part-level review, honest attempt labels, and selectable one-part practice. A build, generated recording, or attractive screen does not satisfy either gate.

## What the completed investigation established

- **Observed:** library, Admin preview, sound-check controls, keyboard answer entry, review marking, and answer recovery worked. Refresh preserved two QA answers and a mark, but restarted reading time and reset paused playback from 0:27 to 0:00.
- **Observed blocker:** live submission and retry both failed with a generic test-service error; History showed no completed result. The local Decimal patch exists, but its deployment and the current server exception were not verified. Diagnose before choosing a fix.
- **Observed:** the local login loop cleared after the QA server received normal outbound access to Cognito signing keys. This does not establish that all login problems are resolved; verification errors currently become silent redirects.
- **Observed:** the only published Portfolio QA Mock repeats hotel/transport material across parts. It is demonstration content. At a narrow measured viewport, word-limit labels and save status disappeared. Practice still imposed a timed final review.
- **Source risks:** browser/backend marking disagree; saves lack conditional concurrency protection; attempts read mutable current content; evidence editing can discard timing; progress mixes conditions. See [Architecture](ARCHITECTURE.md#known-limitations-from-the-review).
- **Unverified:** successful live Results/replay, cross-device consistency, a realistic uninterrupted mock, registration/recovery/logout flows, real-phone accessibility, and editorial accuracy of all content. Prior passing checks are historical, not current end-to-end proof. No learner interviews were performed.

## Implement in this order

Paths below are within the apps/services mapped in [Architecture](ARCHITECTURE.md). Estimates are engineering days, exclude editorial work, and are not commitments. All tasks are open.

| Order / scope | Smallest coherent task and locations | Acceptance / verification | Dependency; effort |
| --- | --- | --- | --- |
| 1 · Demo blocker | Diagnose live submission; fix the proven cause; add sanitized error/request context. Distinguish invalid login from verification-service failure. Learner auth, `authenticated-fetch.ts`, attempt service; backend `tests-api`. | Fresh sign-in retains destination; submit reaches Results; refresh and History reopen it. Lost-response retry returns the same completion. Focused tests plus authorized live QA. | Deployed error/artifact evidence and separately authorized deployment; 1–3d, medium uncertainty. |
| 2 · Demo blocker | Make backend per-question marks/outcomes authoritative. Align variants, punctuation, word/number limits and multi-selection rules; remove contradictory frontend judgments. Backend scorer, learner `scoring.ts`/Results, Admin schema. | Total equals question marks and breakdowns. Shared fixtures cover blanks, spelling, numbers, hyphens, limits and partial credit. | Reviewed answer fixtures; 2–4d, medium. |
| 3 · Demo blocker | Add attempt revisions and conditional writes; submit a known answer revision atomically. Preserve completed results against stale saves. Attempt handlers, service queue and storage. | Two tabs cannot silently overwrite newer answers or revert completion; double submit and lost responses produce one result. Test races deliberately. | Task 2 contract; 2–4d, medium. |
| 4 · Demo blocker | Publish immutable content releases; pin attempts and retain referenced audio. Validate edits before release. Clearly classify demo content. Admin builder/validation and `tests-api`. | Correcting or archiving content does not change old results or strand existing attempts. One editorially approved full test passes [content gates](CONTENT_GUIDELINES.md#publication-decision). | Content owner; 2–4d plus editorial work, high uncertainty. |
| 5 · Demo blocker | Separate mock/practice playback and review. Use a reviewed mock timeline, track interruptions, restore practice position, keep limits/save state visible, repair keyboard/dialog behavior, remove unrelated map fallback. Exam/setup/question renderer and attempt schema. | No unlimited mock transition pauses; practice review is untimed; recovery is honestly labeled. Desktop, narrow/real-phone, keyboard, autoplay and audio-failure checks pass. | Tasks 3–4; 3–5d, medium. |
| 6 · Practice essential | Complete review with original choices/instructions/visuals, accepted answers, explanation, valid passage replay, optional transcript and question reporting. Reconcile evidence fields; add timing editing/validation. Results, Admin editor and review API. | Every reference-test question is understandable; correct guesses and marked answers are reviewable; missing/expired evidence has honest recovery. Check all questions and actual playback. | Tasks 2, 4–5; 3–5d plus editorial timing, medium. |
| 7 · Practice essential | Add complete one-part selection using existing reviewed material; remove hardcoded 4-part/40-question assumptions. `/practice`, attempts, exam and Results. | Finish, submit and reopen only the chosen part; score uses its actual count and never a band. | Tasks 2–6; 3–5d, medium. |
| 8 · Practice essential | Simplify Home/History/Progress; label first/repeat, mode, interruptions and assistance. Exclude demo/QA from progress. Add pagination, truthful save/network errors and signed-audio refresh. | Familiar or assisted attempts never appear as fresh mock improvement; retained results remain findable; recovery preserves answers. | Tasks 3–4; 2–4d, medium. |

## Settled defaults and work to avoid

Use raw scores first; no band for demo content or one-part practice. Consider clearly approximate bands only for reviewed full mocks. Practice feedback follows a complete part; mock answers remain hidden until submission. Browse/sample before account creation is the preferred later access flow. Keep History reopening exact reviews before building a separate saved-mistakes collection.

After the core gate, observe five IELTS learners choosing, finishing, recovering, reviewing and returning; then run a small return-use trial. Prepare a second distinct reviewed test before claiming useful unseen follow-up practice. Neither establishes learning gains or calibrated difficulty.

Defer chatbots, AI diagnosis, streaks/badges, reminders, compulsory diagnostics, elaborate dashboards, bulk generation, pricing work and infrastructure rewrites. Do not repeat the broad research. Recheck only the task's current source/runtime evidence. Follow [implementation guidelines](IMPLEMENTATION_GUIDELINES.md); documentation is not authorization for deployment, paid generation, account changes or Git publishing. Report each task as implemented, locally verified, live verified, or blocked with exact evidence. Do not mark the overall goal complete while the live journey or editorial gate is missing.
