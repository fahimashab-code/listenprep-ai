# Listenly implementation guidelines

These are working rules for future implementation. Read the current user request first, then the relevant documents in the [index](README.md).

## Start with the learner task

Identify the action being improved and how we will recognize success. Use [Product](PRODUCT.md) for the intended experience and [Plan](PLAN.md) for work order. Do not add planned features simply because they appear in those documents; implement the task the user requested.

Prefer familiar labels and one clear next action. Keep question reading and listening free from interruptions. Include useful empty, loading, interrupted, and failure states. Preserve the existing visual foundation unless a redesign is requested.

## Inspect the active path before editing

- Check the relevant repository and existing local changes.
- Use [Architecture](ARCHITECTURE.md) to find the caller, service, handler, and data shape involved.
- Follow actual imports. Local/demo services can coexist with API-backed services.
- Reuse existing components and helpers. Make the smallest complete change to the requested behavior.
- Keep app UI, backend logic, and infrastructure in their existing folders. Do not introduce a new service or abstraction without a concrete need.

## Preserve the important contracts

- The approved transcript, recording, questions, accepted answers, and review evidence must agree.
- Keep Admin and learner identities separate. Derive learner ownership from verified authentication, not a request-body user ID.
- Keep answer keys out of ordinary learner test responses. Changes to practice-mode help must deliberately preserve the mock-test boundary.
- Treat backend submission as the source of the saved result. Keep any frontend scoring helpers consistent with that contract.
- Keep test mode, practice mode, and repeated attempts distinguishable when describing progress.
- Keep stable audio IDs and storage keys. Do not persist temporary signed URLs as permanent assets.
- Explain what resume preserves. Saved answers do not by themselves guarantee an identical playback position or uninterrupted mock conditions.
- Avoid changing published questions in a way that silently changes the meaning of earlier attempts. The current implementation reads the current test record; inspect versioning needs when publication editing is in scope.

## Keep operations deliberate

Do not expose credentials, token values, or private configuration in browser code, documentation, logs, or commits. Use environment-variable names in docs, not account-specific values. Real environment files, Terraform state, saved plans, and generated packages are not documentation.

Run application servers, paid generation, cloud operations, commits, pushes, and deployments only when requested for the task. Reuse existing session authorization without repeatedly asking. Documentation-only work needs documentation checks, not application builds or deployment.

## Verify the behavior changed

For frontend code changes, run the checks required by that application's `AGENTS.md`: lint, and build when compilation, routing, configuration, or production behavior can be affected. Use focused behavior checks for risky changes such as answers, scoring, publication, identity, or recovery. Do not add tests that merely repeat the implementation.

For backend changes, check the affected request/response contract and failure path. For infrastructure changes, review the actual plan before a requested apply. Do not describe static inspection or a successful build as live end-to-end proof.

Report what changed, what was checked, and what remains unverified. Preserve unrelated local work.

## Keep documentation useful

Update the existing document for its purpose. Product intent belongs in Product, future work in Plan, implemented structure in Architecture, and content rules in Content guidelines. Keep `AGENTS.md` short and durable. Remove obsolete instructions and repair their links when replacing them. Do not leave competing roadmaps or copied implementation prompts behind.
