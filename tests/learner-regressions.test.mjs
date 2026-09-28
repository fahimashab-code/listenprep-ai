import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { test } from "node:test";
import { createRequire } from "node:module";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const requireDependency = createRequire(import.meta.url);

// Exercise application modules without a cloud account or extra test dependencies.
function loadApp(overrides = {}) {
  const cache = new Map();
  const values = new Map();
  const localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
  function load(name) {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (!name.startsWith("@/")) return requireDependency(name);
    if (cache.has(name)) return cache.get(name).exports;
    const base = path.join(import.meta.dirname, "../src", name.slice(2));
    const filename = fs.existsSync(`${base}.ts`) ? `${base}.ts` : `${base}.tsx`;
    const moduleRecord = { exports: {} };
    cache.set(name, moduleRecord);
    const code = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    const context = vm.createContext({
      module: moduleRecord, exports: moduleRecord.exports, require: load, localStorage,
      Headers, Error, console, process: { env: { NEXT_PUBLIC_LISTENLY_API_URL: "https://test.invalid" } },
    });
    new vm.Script(code, { filename }).runInContext(context);
    return moduleRecord.exports;
  }
  return { load, localStorage };
}

const attempt = {
  id: "attempt-1", testId: "test-1", userId: "learner-1", mode: "practice",
  status: "final_review", phase: "final_review", currentPart: 4,
  answers: { q1: "museum" }, markedForReview: [], revision: 0, totalMarks: 1,
  exposure: "first", contentClassification: "reviewed", interruptionCount: 0,
  assistanceUsed: false,
  questionOutcomes: { q1: { awarded: 1, available: 1, status: "correct", reason: "accepted" } },
  scoreBreakdown: { byPart: [{ partNumber: 1, score: 1, total: 1 }], byType: [{ type: "short_answer", score: 1, total: 1 }] },
};
const reviewTest = {
  id: "test-1", title: "Regression test", questionCount: 40,
  parts: [{ partNumber: 1, title: "Part 1", audioUrl: "", questions: [{
    id: "q1", number: 1, type: "short_answer", prompt: "Destination",
    acceptedAnswers: ["museum"], explanation: "They agree to meet at the museum.",
    transcriptText: "Meet me at the museum.",
  }] }],
};
const response = (body, status = 200) => ({ ok: status < 400, status, json: async () => body });

test("completed review normalizes optional fields and renders the published explanation", async () => {
  const { load } = loadApp({ "@/lib/api/authenticated-fetch": { authenticatedFetch: async () => response({ ...attempt, status: "completed", reviewTest }) } });
  const result = await load("@/lib/api/listenly-service").learnerAttemptService.get(attempt.id);
  assert.equal(result.reviewTest.parts[0].questions[0].skillTags.length, 0);
  const { ResultView } = load("@/components/results/result-view");
  const html = renderToStaticMarkup(React.createElement(ResultView, { test: result.reviewTest, initialAttempt: result }));
  assert.match(html, /They agree to meet at the museum/);
  assert.match(html, /Meet me at the museum/);
  assert.match(html, /Practice complete/);
  assert.doesNotMatch(html, /Full mock complete/);
});

test("results use the backend outcome instead of re-marking the answer in the browser", () => {
  const { load } = loadApp({ "@/lib/api/authenticated-fetch": { authenticatedFetch: async () => response({}) } });
  const { ResultView } = load("@/components/results/result-view");
  const content = structuredClone(reviewTest);
  content.parts[0].questions[0].acceptedAnswers = ["different answer"];
  const html = renderToStaticMarkup(React.createElement(ResultView, {
    test: content,
    initialAttempt: { ...attempt, status: "completed", rawScore: 1 },
  }));
  assert.match(html, />Correct</);
  assert.doesNotMatch(html, />Incorrect</);
});

test("one-part practice sends the selected Part to the attempt API", async () => {
  let request;
  const { load } = loadApp({ "@/lib/api/authenticated-fetch": { authenticatedFetch: async (url, init) => {
    request = { url, body: JSON.parse(init.body) };
    return response({ ...attempt, selectedPart: 3 });
  } } });
  const created = await load("@/lib/api/listenly-service").learnerAttemptService.create("test-1", "practice", 3);
  assert.equal(created.selectedPart, 3);
  assert.deepEqual(request.body, { testId: "test-1", mode: "practice", partNumber: 3 });
});

test("paginated attempts are returned in global activity order", async () => {
  const pages = [
    { items: [{ ...attempt, id: "older", startedAt: "2026-09-01T00:00:00Z" }], nextToken: "next" },
    { items: [{ ...attempt, id: "newer", startedAt: "2026-09-28T00:00:00Z" }] },
  ];
  const { load } = loadApp({
    "@/lib/api/authenticated-fetch": {
      authenticatedFetch: async () => response(pages.shift()),
    },
  });
  const items = await load("@/lib/api/listenly-service").learnerAttemptService.list();
  assert.deepEqual(Array.from(items, (item) => item.id), ["newer", "older"]);
});

test("history labels selected Part and all recorded attempt conditions", () => {
  const historyAttempt = {
    ...attempt,
    id: "history-attempt",
    status: "completed",
    selectedPart: 3,
    testTitle: "Pinned release title",
    rawScore: 7,
    totalMarks: 9,
    exposure: "repeat",
    interruptionCount: 2,
    assistanceUsed: true,
    contentClassification: "demo",
    completedAt: "2026-09-28T00:00:00Z",
  };
  const { load } = loadApp({
    "@/hooks/use-learner-attempts": {
      useLearnerAttempts: () => ({ attempts: [historyAttempt], loading: false, error: "" }),
    },
    "@/lib/api/listenly-service": {
      learnerTestService: { list: async () => [] },
    },
  });
  const html = renderToStaticMarkup(React.createElement(load("@/components/history-view").HistoryView));
  assert.match(html, /Pinned release title/);
  assert.match(html, /Part 3 practice/);
  assert.match(html, /7 \/ 9/);
  assert.match(html, /Repeat · interrupted 2× · assisted · demo/);
});

test("practice selector uses the published Part mark count", () => {
  const source = fs.readFileSync(
    path.join(import.meta.dirname, "../src/app/(app)/practice/page.tsx"),
    "utf8",
  );
  assert.match(source, /part\.questionCount/);
  assert.doesNotMatch(source, /10 marks/);
});

test("slow autosave finishes before the latest answers are saved and submitted", async () => {
  const calls = [];
  let finishFirst;
  const { load } = loadApp({ "@/lib/api/authenticated-fetch": { authenticatedFetch: async (url, init) => {
    calls.push({ url, method: init.method, body: init.body && JSON.parse(init.body) });
    if (calls.length === 1) await new Promise((resolve) => { finishFirst = resolve; });
    return response(init.method === "POST" ? { ...attempt, status: "completed", reviewTest } : attempt);
  } } });
  const service = load("@/lib/api/listenly-service").learnerAttemptService;
  const first = service.save({ ...attempt, answers: { q1: "old" } });
  const submit = service.submit(attempt);
  await new Promise(setImmediate);
  assert.equal(calls.length, 1);
  finishFirst();
  const [, result] = await Promise.all([first, submit]);
  assert.deepEqual(calls.map((call) => call.method), ["PUT", "PUT", "POST"]);
  assert.equal(calls[1].body.answers.q1, "museum");
  assert.equal(result.status, "completed");
  assert.equal(result.reviewTest.parts[0].questions[0].skillTags.length, 0);
});

test("retry recovers a completed submission whose response was lost", async () => {
  const calls = [];
  const { load } = loadApp({ "@/lib/api/authenticated-fetch": { authenticatedFetch: async (url, init) => {
    calls.push(init.method ?? "GET");
    return init.method === "PUT"
      ? response({ message: "A completed attempt cannot be changed." }, 409)
      : response({ ...attempt, status: "completed", reviewTest });
  } } });
  const result = await load("@/lib/api/listenly-service").learnerAttemptService.submit(attempt);
  assert.equal(result.status, "completed");
  assert.deepEqual(calls, ["PUT", "GET"]);
});

test("a failed save prevents submission and a later retry still works", async () => {
  let fail = true;
  const calls = [];
  const { load } = loadApp({ "@/lib/api/authenticated-fetch": { authenticatedFetch: async (url, init) => {
    calls.push(init.method);
    if (fail) throw new Error("Connection lost");
    return response({ ...attempt, status: init.method === "POST" ? "completed" : "final_review" });
  } } });
  const service = load("@/lib/api/listenly-service").learnerAttemptService;
  await assert.rejects(service.submit(attempt), /Connection lost/);
  assert.deepEqual(calls, ["PUT"]);
  fail = false;
  assert.equal((await service.submit(attempt)).status, "completed");
});

test("pending answers survive reload, while completed server results take precedence", () => {
  const storage = loadApp().load("@/lib/storage");
  storage.saveAttempt(attempt, true);
  assert.equal(storage.restoreAttempt({ ...attempt, answers: { q1: "old" } }).answers.q1, "museum");
  assert.equal(storage.restoreAttempt({ ...attempt, status: "completed", answers: { q1: "server" } }).answers.q1, "server");
});

test("an old save acknowledgement cannot erase a newer pending draft", () => {
  const storage = loadApp().load("@/lib/storage");
  storage.saveAttempt(attempt, true);
  storage.acknowledgeAttempt({ ...attempt, answers: { q1: "old" } });
  assert.equal(storage.loadAttempt(attempt.id).pendingSync, true);
  storage.acknowledgeAttempt(attempt);
  assert.equal(storage.loadAttempt(attempt.id).pendingSync, false);
});

test("a browser draft from another account cannot override an authenticated attempt", () => {
  const storage = loadApp().load("@/lib/storage");
  storage.saveAttempt({ ...attempt, userId: "other-learner" }, true);
  assert.equal(storage.restoreAttempt({ ...attempt, answers: {} }).answers.q1, undefined);
});

test("unavailable browser storage does not prevent API-backed usage", () => {
  const app = loadApp();
  app.localStorage.getItem = app.localStorage.setItem = () => { throw new Error("Storage blocked"); };
  const storage = app.load("@/lib/storage");
  assert.doesNotThrow(() => storage.saveAttempt(attempt, true));
  assert.equal(storage.loadAttempt(attempt.id), null);
});

test("login does not silently reuse a different learner's existing session", async () => {
  let signIns = 0;
  let signOuts = 0;
  const { load } = loadApp({
    "aws-amplify/auth/enable-oauth-listener": {},
    "aws-amplify": { Amplify: { configure() {} } },
    "@/lib/auth/config": { amplifyConfig: {} },
    "@/lib/auth/env": { authEnv: { isConfigured: true } },
    "aws-amplify/auth": {
      signIn: async () => {
        if (++signIns === 1) {
          const error = new Error("Existing session");
          error.name = "UserAlreadyAuthenticatedException";
          throw error;
        }
        return { isSignedIn: true };
      },
      fetchAuthSession: async () => ({ tokens: { accessToken: {}, idToken: { payload: { email: "old@example.com" } } } }),
      signOut: async () => { signOuts++; },
    },
  });
  assert.equal((await load("@/lib/auth/client").loginUser("new@example.com", "test-only")).status, "signed-in");
  assert.equal(signIns, 2);
  assert.equal(signOuts, 1);
});

test("review uses a timed passage only when both evidence boundaries are valid", () => {
  const { load } = loadApp({ "@/lib/api/authenticated-fetch": { authenticatedFetch: async () => response({}) } });
  const { ResultView } = load("@/components/results/result-view");
  for (const [startSeconds, endSeconds, label] of [[5, 12, "Listen to the answer passage"], [12, 5, "Listen to Part 1 again"]]) {
    const content = structuredClone(reviewTest);
    content.parts[0].audioUrl = "https://test.invalid/audio.mp3";
    content.parts[0].questions[0].skillTags = [];
    content.parts[0].questions[0].transcriptEvidence = { text: "Evidence", startSeconds, endSeconds };
    const html = renderToStaticMarkup(React.createElement(ResultView, { test: content, initialAttempt: attempt }));
    assert.ok(html.includes(label));
    assert.equal(html.includes("#t=5,12"), startSeconds === 5);
  }
});

test("server authentication still rejects missing or invalid signed tokens", async () => {
  const verifiers = [];
  const { load } = loadApp({
    "server-only": {},
    "@/lib/auth/env": { authEnv: { isConfigured: true, userPoolId: "pool", userPoolClientId: "client" } },
    "aws-jwt-verify/jwk": { SimpleJwksCache: class {} },
    "aws-jwt-verify/https": { SimpleJsonFetcher: class {} },
    "aws-jwt-verify": { CognitoJwtVerifier: { create: (config, options) => {
      verifiers.push({ config, options });
      return { verify: async () => { throw new Error("Invalid signature"); } };
    } } },
    "next/headers": { cookies: async () => ({ get: () => ({ value: "invalid" }) }) },
  });
  const server = load("@/lib/auth/server");
  assert.equal(await server.getServerAuthUser(), null);
  assert.equal(await server.hasServerAuthSession({ cookies: { get: () => undefined } }, {}), false);
  assert.equal(await server.hasServerAuthSession({ cookies: { get: () => ({ value: "invalid" }) } }, {}), false);
  assert.deepEqual(verifiers.map((item) => item.config.tokenUse), ["id", "access"]);
  assert.equal(verifiers[0].options.jwksCache, verifiers[1].options.jwksCache);
});

test("word limits remain visible at narrow viewports", () => {
  const source = fs.readFileSync(
    path.join(import.meta.dirname, "../src/components/listening/question-renderer.tsx"),
    "utf8",
  );
  const label = source.match(
    /question\.wordLimit[\s\S]*?<span className="([^"]+)"[\s\S]*?Max \{question\.wordLimit\} words/,
  );
  assert.ok(label, "word-limit label should be rendered");
  assert.doesNotMatch(label[1], /(?:^|\s)hidden(?:\s|$)/);
});

test("exam dialogs move and contain keyboard focus and support Escape", () => {
  const source = fs.readFileSync(
    path.join(import.meta.dirname, "../src/components/listening/exam-interface.tsx"),
    "utf8",
  );
  assert.match(source, /document\.getElementById\(dialogTitleId\)\?\.focus\(\)/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /event\.key !== "Tab"/);
  assert.match(source, /previouslyFocused\?\.focus\(\)/);
  assert.match(source, /id="exit-title" tabIndex=\{-1\}/);
  assert.match(source, /id="submit-title" tabIndex=\{-1\}/);
});
