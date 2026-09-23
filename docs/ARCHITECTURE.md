# Listenly architecture

Source inspected 23 September 2026. This document describes the local implementation, not a verified deployment. Planned product work belongs in [Plan](PLAN.md).

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
4. `tests-api` saves test records in DynamoDB. Publishing checks the test structure and that each referenced audio record exists, then changes its publication state. It does not currently require each audio job to be completed; an unfinished job can leave a learner part without a playback URL.
5. The learner app's `src/lib/api/listenly-service.ts` requests `/tests` and `/tests/{testId}` through a learner-authenticated fetch helper.
6. The backend returns published learner-visible tests and temporary audio URLs. Normal test responses exclude accepted answers and review evidence.
7. A learner creates an attempt, saves answers and the current phase, and submits it. The learner service saves the latest attempt before submission. The backend scopes attempts to the authenticated subject and calculates the stored score.
8. Completed attempts can include `reviewTest`, which contains answers, explanations, and transcript material for results review.

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
| `/attempts` | List/create/get/update; submit action | Learner |

The configuration uses one HTTP API with separate Admin and learner JWT authorizers. The resource's `admin` name does not mean learner requests use the Admin identity. Current issuer URLs specify `us-east-1`; changing regions requires checking those issuer definitions as well as app configuration.

## Storage and ownership

| Store | Identity | Contents |
| --- | --- | --- |
| Tests table | `testId` | Test definition, parts/questions, asset references, publication state |
| Attempts table | `userId` + `attemptId` | Learner answers, mode, phase, completion and score |
| Generated audio table | `audioId` | Generation/assembly input, status, output key and duration |
| Audio segments table | `segmentId` | Reusable segment input, status and output |
| Listening sections table | `testId` + `sectionId` | Declared infrastructure; do not assume every section-editor operation uses it |
| Private S3 bucket | Object key | Generated recordings and assembled audio |

Persist stable asset identifiers and object keys. Signed URLs are temporary access links, not permanent content identities. Browser storage remains useful for local drafts and fallback behavior; it is not interchangeable with backend persistence.

## Existing distinctions that matter

- Active Admin test routes import `api-test-service.ts`. The older local `test-service.ts` still exists; its presence does not make the active builder browser-only.
- `listening-section-service.ts` still stores section drafts in localStorage and delegates audio generation to the API. Do not claim that all content editing is persisted remotely.
- Published form-completion groups carry a shared `completionTemplate` and `groupId` on their learner questions. The learner test renders a valid template once with inline answer fields; missing or malformed template data falls back to the ordinary question cards so questions remain answerable.
- Learner attempts refer to a test ID. Submission and review read the current test record; a frozen test snapshot per attempt is not established in this source.
- Some internal test values use `official`. That is a data label, not evidence of IELTS affiliation or licensed official test content.
- The current Terraform CORS configuration permits all origins. Production origin restrictions and deployment state have not been verified.
- One-part selection, question-level replay from results, and a saved-mistakes collection are planned behavior. Inspect existing controls before estimating those changes.

## Where to inspect a change

| Change | Follow these files |
| --- | --- |
| Test publication or learner visibility | Admin `api-test-service.ts`; backend `tests-api/lambda_function.py`; Terraform `api_gateway.tf` |
| Answers, scoring, or review | Learner `types/listening.ts`, `lib/scoring.ts`, `components/results/result-view.tsx`; backend scoring and learner-response functions |
| Playback and resuming | Learner `components/listening/exam-interface.tsx`, `pre-test-screen.tsx`, `lib/api/listenly-service.ts` |
| Audio generation | Admin audio services; the matching API and worker under `listenly-backend/lambdas`; Terraform `lambda.tf` |
| Login or API identity | [Authentication](AUTHENTICATION.md) and its source map |

Do not infer live authorization, successful audio generation, approved content quality, or reliable cross-device recovery from this file. Those require a scoped runtime check when requested.
