import test from "node:test";
import assert from "node:assert/strict";
import "fake-indexeddb/auto";
import { load } from "./load-ts.mjs";
const storage = load("lib/storage.ts"),
  backup = load("lib/backup.ts"),
  grade = load("lib/grading.ts"),
  routing = load("lib/routing.ts"),
  clock = load("lib/study-clock.ts"),
  cloud = load("lib/cloud-merge.ts"),
  planner = load("lib/session-planner.ts");
test("v1 database upgrades without losing unknown records; atomic CAS prevents stale writers", async () => {
  const old = await new Promise((resolve, reject) => {
    const r = indexedDB.open("arabic-academy:./", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("records");
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
  await new Promise((resolve) => {
    const tx = old.transaction("records", "readwrite");
    tx.objectStore("records").put({ done: true }, "progress:A0-L0-01");
    tx.objectStore("records").put({ x: [1] }, "legacy:unknown");
    tx.oncomplete = resolve;
  });
  old.close();
  const base = await storage.readSnapshot();
  assert.deepEqual(base.data["legacy:unknown"], { x: [1] });
  const first = await storage.commitRecords({ "note:a": "new" }, base);
  await assert.rejects(
    storage.commitRecords({ "note:a": "stale" }, base),
    storage.StorageConflict,
  );
  const second = await storage.commitRecords({ "note:b": "independent" }, base);
  assert.equal(second.data["note:a"], "new");
  assert.equal(second.data["note:b"], "independent");
  await assert.rejects(storage.commitRecords({ goal: 15 }, first, true));
  assert.equal((await storage.readSnapshot()).data["note:b"], "independent");
  const replaced = await storage.commitRecords(
    { goal: 20, "legacy:unknown": { x: [1] } },
    second,
    true,
  );
  assert.equal(replaced.data.goal, 20);
  assert.equal(replaced.data["note:a"], undefined);
});
test("backups v1 and v2 preserve unknown values, validate nested data and reject future formats", () => {
  const data = {
    "progress:A0-L0-01": { done: true, read: [0, 1] },
    "legacy:unknown": { value: [1, 2] },
    goal: 15,
  };
  assert.equal(
    backup.parseBackup(
      JSON.stringify({ format: "arabic-academy", version: 1, data }),
    ).unknown.length,
    1,
  );
  assert.deepEqual(
    backup.parseBackup(JSON.stringify(backup.makeBackup(data))).data,
    data,
  );
  for (const bad of [
    { format: "arabic-academy", version: 9, data },
    {
      format: "arabic-academy",
      version: 1,
      data: { "progress:a": { read: ["bad"] } },
    },
    { format: "arabic-academy", version: 2, schema: 9, data },
  ])
    assert.throws(() => backup.parseBackup(JSON.stringify(bad)));
  assert.throws(() =>
    backup.parseBackup(
      '{"format":"arabic-academy","version":1,"data":{"__proto__":{"x":1}}}',
    ),
  );
  assert.deepEqual(
    backup.backupConflicts(
      { "note:a": "old" },
      { "note:a": "new", "note:b": "b" },
    ),
    ["note:a"],
  );
});
test("normalization preserves meaningful Arabic distinctions and respects explicit policies", () => {
  const q = { mode: "input", answers: ["أَب"], strictMarks: true };
  assert.equal(grade.evaluateAnswer(q, "أَب"), "good");
  // strict exercises: right letters without the required vowels is «quasi», not correct
  assert.equal(grade.evaluateAnswer(q, "اب"), "partial");
  assert.equal(grade.evaluateAnswer(q, "أب"), "partial");
  assert.equal(
    grade.evaluateAnswer({ ...q, normalization: "arabic-unvocalized" }, "أب"),
    "good",
  );
  // open answers are now corrected against the reference too
  assert.equal(
    grade.evaluateAnswer({ mode: "open", answers: ["casa grande"] }, "casa grande"),
    "good",
  );
  assert.equal(grade.evaluateAnswer({ mode: "open" }, "x"), "model");
  assert.equal(grade.evaluateAnswer(q, "  "), "empty");
  assert.equal(
    grade.evaluateAnswer({ mode: "input", answers: ["a", "b"] }, " b "),
    "good",
  );
  assert.notEqual(
    grade.normalizeAnswer("ى", "text"),
    grade.normalizeAnswer("ي", "text"),
  );
  assert.notEqual(
    grade.normalizeAnswer("ة", "text"),
    grade.normalizeAnswer("ه", "text"),
  );
  const first = grade.withAttempt(
    {},
    { text: "x", rating: "model", checkedAt: "2026-01-01", automatic: false },
  );
  const confirmed = grade.withAttempt(first, {
    text: "x",
    rating: "good",
    checkedAt: "2026-01-01",
    automatic: false,
  });
  assert.equal(confirmed.history.length, 1);
  assert.equal(confirmed.firstAttempt.rating, "model");
});
test("completion is never inferred as independent mastery", () => {
  const e = grade.learningEvidence({ done: true }, [], 10, 10);
  assert(e.legacyCompletion);
  assert.equal(e.assessmentPassed, false);
  assert.equal(e.consolidated, false);
});
test("routing survives encoded IDs and unknown routes", () => {
  assert.deepEqual(
    routing.parseRoute(routing.routeHash({ view: "lesson", id: "A0-L0-01" })),
    { view: "lesson", id: "A0-L0-01" },
  );
  assert.equal(routing.parseRoute("#/unknown").view, "missing");
  assert.equal(routing.parseRoute("#/lesson/%ZZ").view, "missing");
});
test("time excludes hidden, unfocused, idle and suspended periods", () => {
  assert.equal(clock.activeSeconds(10000, 9000, 9500, true, true), 1);
  assert.equal(clock.activeSeconds(10000, 9000, 9500, false, true), 0);
  assert.equal(clock.activeSeconds(10000, 9000, 9500, true, false), 0);
  assert.equal(clock.activeSeconds(100000, 9000, 0, true, true), 0);
  assert.equal(clock.activeSeconds(100000, 0, 99000, true, true), 5);
});
test("session extension avoids answered and already planned questions", () => {
  const doc = {
    id: "a",
    chapters: [{}],
    exercises: [{ id: "g", items: [{ id: "1" }, { id: "2" }] }],
  };
  const tasks = planner.tasksForLesson(
    doc,
    { "answer:native:a:g:1": { rating: "good" } },
    new Set(["read:a:0"]),
  );
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].target.questionId, "2");
});
test("bulk transaction abort cannot partially write records", async () => {
  const before = await storage.readSnapshot();
  await assert.rejects(
    storage.commitRecords(
      { "note:atomic": "must not persist", bad: () => {} },
      before,
    ),
  );
  assert.deepEqual((await storage.readSnapshot()).data, before.data);
});
test("SM-2-derived scheduling preserves legacy due dates until actual review", () => {
  const { nextReview } = load("lib/learning.ts");
  const legacy = { due: "2026-11-01", interval: 14, successes: 3 };
  const migrated = nextReview(legacy, "hard", new Date(2026, 10, 1, 12));
  assert.equal(migrated.history.length, 1);
  assert.equal(migrated.scheduler, "sm2-derived-v1");
  assert(migrated.ease < 2.5);
  assert.equal(legacy.due, "2026-11-01");
  assert.equal(
    nextReview(migrated, "again", new Date(2026, 10, 2, 12)).interval,
    0,
  );
});
test("vocabulary lookup does not invent roots; prerequisites use actual completion", () => {
  const v = load("lib/vocabulary.ts"),
    p = load("lib/prerequisites.ts");
  assert.equal(
    v.lookupWord([{ lemma: "بَاب", translation: "door" }], "باب").length,
    1,
  );
  assert.equal(v.lookupWord([{ lemma: "باب" }], "الباب").length, 0);
  assert.deepEqual(v.arabicTokens("Hello بَاب!"), ["بَاب"]);
  assert.deepEqual(p.missingPrerequisites(["first"], {}), ["first"]);
  assert.deepEqual(
    p.missingPrerequisites(["first"], {
      "micro:first": { completedAt: "today" },
    }),
    [],
  );
});
test("Arabic compatibility forms normalize without merging hamza carriers", () => {
  assert.equal(grade.normalizeAnswer("ﺏ", "text"), "ب");
  assert.notEqual(
    grade.normalizeAnswer("أ", "text"),
    grade.normalizeAnswer("ا", "text"),
  );
  assert.equal(grade.normalizeAnswer("ا\u0654", "text"), "أ");
});
test("all micro lessons have real source chapters, questions and acyclic prerequisites", async () => {
  const { readFileSync } = await import("node:fs");
  const modules = JSON.parse(readFileSync("data/micro-lessons.json"));
  const seen = new Set();
  for (const m of modules) {
    assert(m.prerequisites.every((p) => seen.has(p)));
    assert(!seen.has(m.id));
    seen.add(m.id);
    const d = JSON.parse(readFileSync(`public/course/${m.source}.json`));
    assert(d.chapters[m.chapter]?.blocks.length);
    assert(
      m.questions.every((id) =>
        d.exercises
          .find((g) => g.id === "starter")
          .items.some((q) => q.id === id),
      ),
    );
  }
});

test("grading accepts what a teacher accepts and explains the rest", () => {
  const q = (answers, extra = {}) => ({ mode: "input", answers, ...extra });
  const r = (question, text, instruction) =>
    grade.gradeAnswer(question, text, instruction);
  // the dagger alif is not on ordinary keyboards
  assert.equal(r(q(["\u0647\u0670\u0630\u064e\u0627"]), "\u0647\u064e\u0630\u064e\u0627").rating, "good");
  assert.equal(r(q(["\u0647\u0670\u0630\u064e\u0627"]), "\u0647\u0630\u0627").rating, "good");
  // short vowels are optional unless the exercise asks for them
  const city = q(["مَدِينَةٌ قَدِيمَةٌ"]);
  assert.equal(r(city, "مدينة قديمة").rating, "good");
  assert.equal(r(city, "مدينة قديمة", "Scrivi con tutte le vocali.").rating, "partial");
  // a written vowel that contradicts the model is not accepted
  assert.equal(r(q(["أَنْتِ"]), "أنتَ").rating, "partial");
  // tāʾ marbūṭa written as hāʾ, missing hamza: «quasi», with a reason
  const almost = r(city, "مدينه قديمه");
  assert.equal(almost.rating, "partial");
  assert.match(almost.note, /tāʾ marbūṭa/);
  // final punctuation never decides
  assert.equal(r(q(["فِي المَدِينَةِ مَتْحَفٌ"]), "في المدينة متحف.").rating, "good");
  // a sentence with the same words in another order is accepted
  assert.equal(r(q(["فِي المَدِينَةِ مَتْحَفٌ حَدِيثٌ"]), "هناك متحف حديث في المدينة").rating, "good");
  assert.equal(r(q(["هٰذِهِ"]), "هذا").rating, "again");
  // transliteration: the macron is the point of the exercise
  assert.equal(r(q(["banāt"]), "banat").rating, "partial");
  assert.equal(r(q(["bint"]), "Bint").rating, "good");
});

test("open answers are corrected word by word against the reference", () => {
  const open = (model, extra = {}) => ({ mode: "open", model, ...extra });
  const r = (question, text, instruction = "") => grade.gradeOpen(question, text, instruction);
  // translation into Arabic: no vowels needed, article and spelling slips tolerated
  const ar = open("\u2067أَنْقَذَ خَفَرُ السَّوَاحِلِ قَارِبًا يُقِلُّ سِتِّينَ شَخْصًا.\u2069");
  assert.equal(r(ar, "انقذ خفر السواحل قاربا يقل ستين شخصا").rating, "good");
  const half = r(ar, "انقذ خفر السواحل قاربا");
  assert.equal(half.rating, "partial");
  assert.deepEqual(half.missing.length, 3);
  assert.equal(r(ar, "the coast guard").rating, "again");
  // translation into Italian: articles, gender endings and bracketed notes do not count
  const it = open("«Le autorità hanno riconosciuto lo status di rifugiato a duecento persone.» (giuridico)");
  assert.equal(r(it, "le autorita hanno riconosciuto lo status di rifugiati a duecento persone").rating, "good");
  assert.equal(r(it, "Le autorità hanno riconosciuto").rating, "again");
  // alternatives inside quotes: either is fine
  const alt = open("relativo: «Non so che cosa sia successo / quello che è successo.»");
  assert.equal(r(alt, "relativo: non so che cosa sia successo").rating, "good");
  // a lost negation is never «correct»
  const neg = open("«Il ministro non ha confermato la notizia della riunione di domani.»");
  assert.notEqual(r(neg, "Il ministro ha confermato la notizia della riunione di domani").rating, "good");
  // free writing keeps the learner's judgement, with a hint
  const free = open("Esempio di testo lungo con molte parole diverse che descrivono la città, il quartiere, la casa, la famiglia, il lavoro, gli amici e la scuola dove studio ogni giorno");
  const f = r(free, "La mia città è grande", "Scrivi un breve testo sulla tua città");
  assert.equal(f.rating, "model");
  assert.match(f.note, /parole chiave/);
});

test("merging two devices keeps the work done on both", () => {
  const phone = {
    "progress:A1-A1-01": { read: [0, 1, 2], step: 2, openedAt: "2026-03-01T08:00:00.000Z" },
    "answer:native:A1-A1-01:ex1:1": { rating: "again", attempts: 1, checkedAt: "2026-03-01T08:10:00.000Z", history: [{ at: "2026-03-01T08:10:00.000Z", text: "x", rating: "again", automatic: true }] },
    "study:2026-03-01": { seconds: 600 },
    "activity:2026-03-01": true,
    "note:A1-A1-01": "appunti dal telefono",
    goal: 20,
    "alphabet:ب": { known: true, attempts: 3 },
  };
  const computer = {
    "progress:A1-A1-01": { read: [0, 3], step: 3, openedAt: "2026-03-02T19:00:00.000Z" },
    "answer:native:A1-A1-01:ex1:1": { rating: "good", attempts: 2, checkedAt: "2026-03-02T19:05:00.000Z", history: [{ at: "2026-03-01T08:10:00.000Z", text: "x", rating: "again", automatic: true }, { at: "2026-03-02T19:05:00.000Z", text: "y", rating: "good", automatic: true }] },
    "study:2026-03-01": { seconds: 120 },
    "progress:A1-A1-02": { read: [0], step: 0 },
    goal: 30,
  };
  // the computer wrote last: it decides only where neither side shows more work
  const m = cloud.mergeRecords(phone, computer, "remote");
  assert.deepEqual(m.data["progress:A1-A1-01"].read, [0, 1, 2, 3]);
  assert.equal(m.data["progress:A1-A1-01"].step, 3);
  assert.equal(m.data["answer:native:A1-A1-01:ex1:1"].attempts, 2);
  assert.equal(m.data["answer:native:A1-A1-01:ex1:1"].rating, "good");
  assert.equal(m.data["answer:native:A1-A1-01:ex1:1"].history.length, 2);
  assert.equal(m.data["study:2026-03-01"].seconds, 600, "the longer session is kept");
  assert.equal(m.data["activity:2026-03-01"], true);
  assert.equal(m.data["note:A1-A1-01"], "appunti dal telefono", "only this device has the note");
  assert.equal(m.data.goal, 30, "a setting follows the last device used");
  assert.deepEqual(m.data["alphabet:ب"], { known: true, attempts: 3 });
  assert.deepEqual(m.data["progress:A1-A1-02"].read, [0]);
  assert.ok(m.added.includes("progress:A1-A1-02"));
  // merging is stable: merging again changes nothing
  assert.deepEqual(cloud.mergeRecords(m.data, computer, "remote").data, m.data);
  assert.deepEqual(cloud.mergeRecords(m.data, m.data, "local").changed, []);
  // the same two devices in the other order give the same result
  const back = cloud.mergeRecords(computer, phone, "local");
  assert.deepEqual(back.data["progress:A1-A1-01"].read, [0, 1, 2, 3]);
  assert.equal(back.data.goal, 30);
  assert.equal(back.data["study:2026-03-01"].seconds, 600);
  // a flashcard follows the device that reviewed it last
  const older = { "card:vocab:1": { front: "a", back: "b", level: "A1", schedule: { reviewedAt: "2026-03-01T00:00:00.000Z", due: "2026-03-05", successes: 1, interval: 1, lastRating: "good" } } };
  const newer = { "card:vocab:1": { front: "a", back: "b", level: "A1", schedule: { reviewedAt: "2026-03-04T00:00:00.000Z", due: "2026-03-10", successes: 2, interval: 6, lastRating: "good" } } };
  assert.equal(cloud.mergeRecords(older, newer, "remote").data["card:vocab:1"].schedule.due, "2026-03-10");
  assert.equal(cloud.mergeRecords(newer, older, "remote").data["card:vocab:1"].schedule.due, "2026-03-10");
});
