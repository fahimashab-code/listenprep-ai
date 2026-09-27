# Listenly documentation

Maintained 27 September 2026.

**Start implementation with [the one-page handoff](PLAN.md): goal, verified findings, ordered tasks, acceptance checks, and excluded work.** The other documents support that brief; they are not competing roadmaps.

**Product goal:** prepare for IELTS Listening through dependable full tests, useful answer review, and convenient one-part practice.

## Read what the task needs

| Document | Purpose | Read before |
| --- | --- | --- |
| [Product](PRODUCT.md) | Learners, main tasks, simple experience, and excluded features | Product or UI decisions |
| [Plan](PLAN.md) | Single implementation handoff, evidence, work order, and completion gate | Starting implementation |
| [Architecture](ARCHITECTURE.md) | Current applications, services, storage, and source locations | Changing a data flow or shared behavior |
| [Implementation guidelines](IMPLEMENTATION_GUIDELINES.md) | Scope, contracts, verification, and documentation rules | Any implementation task |
| [Authentication](AUTHENTICATION.md) | Actual learner/Admin differences and configuration names | Login, sessions, or protected API work |
| [Content guidelines](CONTENT_GUIDELINES.md) | Audio, question, marking, and review requirements | Creating or publishing practice material |
| [Learner research](LEARNER_RESEARCH.md) | Public evidence and its limits | Revisiting product priorities |

## Which document answers which question

Product describes the intended experience. Plan lists work still to do. Architecture describes source that exists today. A planned feature is not a working feature, and a service call in source is not proof of a deployed service.

Keep one maintained document for each purpose. Update these files when decisions or behavior change. Do not create parallel overviews, historical implementation prompts, or archived instructions in the project. Record durable working rules in the relevant `AGENTS.md`, with links here.

The [detailed Part 1 reference](references/IELTS_Listening_Part_1_Generation_Specification.docx) is retained for specialized content research. Use Content guidelines for publication requirements; the reference's production targets are not official exam rules or a product roadmap.

Application startup commands belong in the [learner README](../README.md) and [Admin README](https://github.com/fahimashab-code/listenly-admin/blob/master/README.md). Source paths in these documents are relative to the `F:\Listenly` workspace, where the Admin, backend, and Terraform folders are siblings of this repository. Documentation changes do not authorize application changes, paid generation, or deployment.
