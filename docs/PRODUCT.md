# What Listenly should do

Updated 27 September 2026. Product decisions below describe the intended experience; current readiness and implementation order are in [Plan](PLAN.md).

**Help people prepare for IELTS Listening with trustworthy tests and an easy way to understand their mistakes.**

People should be able to open Listenly, practise, check their answers, and hear what they missed. They should not need several websites, a separate audio player, and a spreadsheet to review one test.

## Who it is for

Start with people preparing for IELTS who already use practice tests. Some want a realistic full test; others need to work through a difficult part or understand a wrong answer. Do not assume everyone has the same score, time available, or weakness.

This direction follows the [learner research](LEARNER_RESEARCH.md). The research contains real public complaints and requests, but it is not a survey of Listenly users. We still need to watch people use our product.

## Three things a learner can do

| Action | What the learner gets |
| --- | --- |
| **Take a full test** | Four parts, 40 questions, clear exam-style rules, saved answers, and a result after submission. |
| **Practise one part** | One complete listening part with its questions, plus pause, replay, and review. Show its actual length before starting. |
| **Review my mistakes** | Saved questions, the learner's answer, accepted answers, the relevant recording, and a useful explanation. |

Full tests remain central. One-part practice is a proposed addition; it should use complete, reviewed material. Do not force everyone through a short diagnostic, a daily challenge, or a set of unrelated drills.

## What a useful review looks like

A learner opens a wrong answer and sees:

1. **Your answer** and **Correct answer** side by side.
2. **Listen to this part again**, starting before the important detail and ending after enough context to understand it.
3. The matching transcript passage, available when wanted.
4. A short explanation of what makes the answer correct. For multiple choice, explain why the tempting option does not fit. For a word-limit or spelling error, identify the actual issue.
5. **Next mistake** and a dependable way to reopen the same review from History. Add a separate **Save for later** collection only if learners need more than that. Offer similar fresh questions only when suitable reviewed content exists.

Example: the recording gives one appointment time and then changes it. Replay includes both times. The explanation points to the change. The learner should not have to restart the entire test to find that sentence.

Explain the question confidently when the evidence supports it. Do not pretend to know why someone made a mistake from their answer alone. If needed, let them optionally choose “I did not hear it,” “I misunderstood it,” or “I wrote it incorrectly.” Do not make that extra work compulsory.

## Make starting and returning simple

On Home, give a returning learner **Continue** when something is unfinished. Otherwise make **Start a test** the main action, with **Practise one part** available when that feature is ready. Make previous reviews easy to reopen without turning Home into a wall of statistics.

Use familiar labels: Home, Tests, Practice, Results, History. Keep progress inside results and history until there is a clear need for a separate destination. Do not add navigation just to match this document.

Before starting, show the length, number of questions, and whether replay is allowed. Keep the questions readable while audio plays. Avoid pop-ups, upsells, rewards, or other interruptions during listening.

Let people return to unfinished work and previous reviews. Label content already attempted, including parts reused in different tests. These are practical reasons to come back. Streaks, badges, daily quotas, and reminders are not first-release requirements.

## What must be trustworthy

- Audio, questions, instructions, and answers must agree. Review them together before publication.
- Accept legitimate answer variants consistently. Explain genuine spelling, grammar, and word-limit errors. Do not invent marking rules from forum comments.
- Generated content must sound natural and have a believable task. More difficult does not automatically mean more realistic.
- Keep practice and mock results distinct. A score after replay is not equivalent to a first attempt under exam conditions.
- A one-part score is out of that part's question count. Do not turn it into an IELTS band estimate.
- Lead with raw scores. Do not show bands for demo content or one-part practice. Consider an explicitly approximate, unofficial band only for reviewed full mocks; do not imply calibrated difficulty or promise an exam score.
- Distinguish first attempts on unseen content, repeats, assisted practice and interrupted mocks. Do not average them into an improvement claim or diagnose a weakness from the lowest-scoring part.
- Published releases and their review assets must remain stable for existing attempts; corrections produce a new release.
- Use original or properly licensed material. Official sample content can guide review without being copied into the product.

## Mode and access decisions

Mock mode should reproduce meaningful computer-test behavior rather than copy every visual detail: readable tasks, clear numbering, answer navigation, recordings heard once, and a reviewed timing sequence. Recovery remains possible, but disrupted mocks are labeled interrupted and excluded from uninterrupted comparisons. Keep question navigation separate from audio progression.

Practice allows pause/replay, deliberate progression, and untimed final review. Reveal answers, explanations and transcripts after completing a whole part; this requires an explicit part-attempt API contract. Keep transcripts optional during review and correct but uncertain answers reviewable. Save playback position for practice and explain any recovery limitations.

Prefer public test information and a sample before requiring an account to save a full attempt. Keep the existing layout, make length/rules visible before starting, and show meaningful loading, empty and retry states. Recommend desktop for mock familiarity while supporting phone practice. Word limits, saving feedback and accessible control names must remain available at narrow widths.

## What we will not add now

No compulsory mini lessons, public AI generator, generic chatbot, social feed, leaderboard, reward currency, or large personal study-plan questionnaire. No three-skill Part 1 curriculum chosen simply because it is easiest to generate. The public requests include difficulties in Parts 2–4 and following questions during audio.

The first priority is a dependable test and review experience. A separate skill exercise should earn its place by solving a problem learners actually show us.

## How we will know it helps

Watch whether learners can start without help, finish without technical trouble, find the passage they missed, and explain the answer afterward. Ask whether review is easier than their current method. Check whether they voluntarily return to another test or saved mistakes.

Later, use fresh comparable questions to examine improvement. Recalling an answer already seen is not proof of learning. Pricing, reminders, explanation languages, and broader courses remain undecided.

The next work is listed in the [product plan](PLAN.md). Use [Content guidelines](CONTENT_GUIDELINES.md) for publication requirements and [Architecture](ARCHITECTURE.md) for what exists today.
