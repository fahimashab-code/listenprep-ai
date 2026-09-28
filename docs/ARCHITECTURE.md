# Listenly architecture

Source reviewed 28 September 2026. This document describes the local implementation; deployment and content readiness require separate checks. Planned product work belongs in [Plan](PLAN.md).

## Applications and responsibilities

| Area | Responsibility | Main entry points |
| --- | --- | --- |
| Learner app | Authentication, test selection, playback, answers, results, history | `listenly-frontend/src/app`, `src/components/listening`, `src/components/results` |
| Admin app | Authentication, content preparation, generated audio, test editing and publishing | `listenly-admin/src/app`, `src/components/tests`, `src/services` |
| Backend | Test records, learner attempts and scoring, generation requests and audio workers | `listenly-backend/lambdas` |
| Infrastructure | API routes and authorizers, Lambda packaging and settings, IAM, DynamoDB, private S3 | `Terraform-iaac` |

Both applications use Next.js, React, TypeScript, Tailwind, and Amplify/Cognito. They are separate applications with separate auth configuration. Application logic belongs in the app or backend; cloud resource definitions belong in Terraform.

## The test and learner flow

1. The Admin test builder calls `src/services/api-test-service.ts`. Its active routes are under `/listening-tests`.
2. `src/lib/api/admin-api.ts` attaches the Admin access token and sends requests to the configured API.
3. API Gateway routes `/admin/tests` requests through the Admin JWT authorizer to `tests-api`.
4. `tests-api` saves test records in DynamoDB. Publishing validates the record and changes its publication state.
5. The learner app's `src/lib/api/listenly-service.ts` requests `/tests` and `/tests/{testId}` through a learner-authenticated fetch helper.
6. The backend returns published learner-visible tests and temporary audio URLs. Normal test responses exclude accepted answers and review evidence.
7. A learner creates an attempt, saves answers and the current phase, and submits it. The backend scopes attempts to the authenticated subject and calculates the stored score.
8. Completed attempts can include `reviewTest`, which contains answers, explanations, and transcript material for results review.

Learner writes are serialized per attempt within one page runtime so its slow autosave cannot overtake its submission. Attempts also carry a backend revision: saves and submission use conditional writes against a known revision, consistent reads, and completed-attempt checks so a stale client cannot silently replace newer answers or revert completion. Pending browser answers are restored only after the API verifies the same attempt, learner, and test; a completed server result takes precedence. Submission marks an attempt complete only after server confirmation and returns the durable completion on duplicate or lost-response retries. Attempt lists use the authenticated, paginated API rather than displaying another account's browser cache.

Submission stores authoritative per-question outcomes and part/type breakdowns; Results displays those server outcomes rather than remarking answers in the browser. Results preserves original instructions, choices and visuals, displays accepted answers and explanations, and offers audio replay. Numerically valid evidence timestamps request a passage through an audio fragment; otherwise the control explicitly replays the whole part. Admin and publication validation check timing order and known recording duration, but source validation does not establish live playback correctness. Practice results identify replay/assistance conditions. The reading countdown keeps questions visible before playback.

The current handler adds review content after completion for both attempt modes. A future learning feature that reveals help earlier needs an explicit API decision; adding a button alone does not make that content available.

## Audio generation and assembly

Admin generation requests go to `audio-api` or `audio-segments-api`. Each API writes a processing record and invokes its worker asynchronously with Lambda `InvocationType="Event"`. The current implementation does not use an SQS queue.

| Function | Responsibility |
| --- | --- |
| `audio-api` | Create, list, retrieve, update, and delete generated-audio records; request full-test audio assembly |
| `generate-listening-section` | Generate dialogue audio or assemble stored test clips; save MP3 output and update job status |
| `audio-segments-api` | Manage requests and records for reusable audio segments |
| `generate-audio-segment` | Generate a segment, store it, and update its record |
| `tests-api` | Admin test management, publication, learner tests, attempts, submission, scoring, and review responses |

The generation APIs return a job identifier and processing status. The workers store output in private S3 and update records to completed or failed. Retrieval supplies temporary signed playback URLs. The model credential is read from the worker environment; Terraform currently supplies that environment variable. Do not describe a secret-manager integration that is absent from this source.

Full-test assembly has its own `/admin/test-audio` path and can combine approved part audio, instruction segments, and pauses. The learner test response currently supplies audio per part. An assembled asset's existence does not prove the learner player uses it; trace the consumer before changing playback.

## API families

All listed routes are declared in `Terraform-iaac/api_gateway.tf`.

| Family | Main operations | Authorizer |
| --- | --- | --- |
| `/admin/audio` | POST/GET collection; GET/PUT/DELETE item | Admin |
| `/admin/audio-segments` | POST/GET collection; GET/DELETE item | Admin |
| `/admin/test-audio` | POST assembly; GET assembly status | Admin |
| `/admin/tests` | List/create/get/update/delete; duplicate/publish/archive actions | Admin |
| `/tests` | List and retrieve learner-visible tests | Learner |
| `/attempts` | List/create/get/update; submit and release-bound question-report actions | Learner |

The configuration uses one HTTP API with separate Admin and learner JWT authorizers. The resource's `admin` name does not mean learner requests use the Admin identity. Current issuer URLs specify `us-east-1`; changing regions requires checking those issuer definitions as well as app configuration.

## Storage and ownership

| Store | Identity | Contents |
| --- | --- | --- |
| Tests table | `testId` | Test definition, parts/questions, asset references, publication state |
| Attempts table | `userId` + `attemptId` | Learner answers, pinned release, revision, mode/selected Part, conditions, completion, score and review outcomes |
| Generated audio table | `audioId` | Generation/assembly input, status, output key and duration |
| Audio segments table | `segmentId` | Reusable segment input, status and output |
| Listening sections table | `testId` + `sectionId` | Declared infrastructure; do not assume every section-editor operation uses it |
| Private S3 bucket | Object key | Generated recordings and assembled audio |

Persist stable asset identifiers and object keys. Signed URLs are temporary access links, not permanent content identities. Browser storage remains useful for local drafts and fallback behavior; it is not interchangeable with backend persistence.

## Existing distinctions that matter

- Active Admin test routes import `api-test-service.ts`. The older local `test-service.ts` still exists; its presence does not make the active builder browser-only.
- `listening-section-service.ts` still stores section drafts in localStorage and delegates audio generation to the API. Do not claim that all content editing is persisted remotely.
- Published form-completion groups carry a shared `completionTemplate` and `groupId` on their learner questions. The learner test renders a valid template once with inline answer fields; missing or malformed template data falls back to the ordinary question cards so questions remain answerable.
- Publishing creates an immutable release record and points the editable source record at its current release. New attempts pin `releaseId`; submission and review read that release, so later source edits or archive operations do not change the pinned result. Legacy attempts without a release reference keep their legacy lookup behavior.
- Some internal test values use `official`. That is a data label, not evidence of IELTS affiliation or licensed official test content.
- The current Terraform CORS configuration permits all origins. Production origin restrictions and deployment state have not been verified.
- One-part selection is available under `/practice`; a saved-mistakes collection remains deferred. Results replay exists; accurate passage selection still depends on editorially supplied and reviewed timestamps.

## Remaining limitations after local implementation

These are the boundaries still present after the 28 September local changes. Browser outcomes, verification evidence and priorities are in [Plan](PLAN.md). None of the backend or API-route changes below has been deployed or live-verified.

| Area / source | Current limitation and consequence |
| --- | --- |
| Backend `tests-api/lambda_function.py`: attempt update/submit/read | Revision-checked conditional writes, consistent reads and idempotent completion are implemented and unit-tested locally. Cross-tab/device behavior and the prior live generic submission failure remain unverified until this code is deployed with usable learner credentials and runtime diagnostics. |
| Same handler: Admin update/publication and learner review | Immutable release records and pinned attempts are implemented locally. Legacy attempts without `releaseId` retain legacy lookup behavior, and no editorially approved 40-question release exists yet. |
| Same handler scoring; learner Results | The backend now owns normalized outcomes, word/number limits, partial credit and breakdowns; Results consumes them and bands are limited to eligible reviewed full mocks. Editorial answer fixtures and live scoring remain unverified. |
| Learner exam/timing | Published audio-plan reading times, automatic mock transitions, untimed practice review, practice position recovery, and interruption/assistance labels are implemented. Real recording, autoplay, refresh and protected device checks remain. |
| Learner exam/question renderer | Save/error and word-limit text remain visible at narrow widths; dialogs have explicit semantics, keyboard focus containment, Escape handling and focus restoration; and the unrelated map fallback was removed. These paths passed fixture browser QA at 390×844, while a signed-in real-phone accessibility pass still remains. |
| Admin question editor; learner Results | Evidence times are preserved and editable, timing is validated, and Results includes original context plus supported explanation fields. Editorial review of every question and actual passage replay is still required. |
| Learner Progress and History | Progress filters to first, uninterrupted, unassisted reviewed full mocks; History labels other conditions and uses pinned titles/counts. Live pagination and retained-history recovery remain unverified. |
| Learner fetch/route loader/player; backend list/error handlers | Verification-service/network failures, invalid sessions and save failures are distinct; audio URLs can be refreshed; lists paginate; unexpected backend failures receive sanitized request references. The prior live exception cannot be diagnosed conclusively without deployed logs/artifact evidence. |

Existing DynamoDB pay-per-request tables, Lambda, API Gateway, Cognito and private S3 are sufficient for the proposed work. Use conditional writes, immutable release references and bounded sanitized diagnostics before proposing additional services. Audio URLs currently expire after one hour. Generation remains an asynchronous draft-production path; no generation/publication mutation was tested during this review.

## Where to inspect a change

| Change | Follow these files |
| --- | --- |
| Test publication or learner visibility | Admin `api-test-service.ts`; backend `tests-api/lambda_function.py`; Terraform `api_gateway.tf` |
| Answers, scoring, or review | Learner `types/listening.ts`, `lib/scoring.ts`, `components/results/result-view.tsx`; backend scoring and learner-response functions |
| Playback and resuming | Learner `components/listening/exam-interface.tsx`, `pre-test-screen.tsx`, `lib/api/listenly-service.ts` |
| Audio generation | Admin audio services; the matching API and worker under `listenly-backend/lambdas`; Terraform `lambda.tf` |
| Login or API identity | [Authentication](AUTHENTICATION.md) and its source map |

Do not infer live authorization, successful audio generation, approved content quality, or reliable cross-device recovery from this file. Those require a scoped runtime check when requested.
