import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const course = read("data/course.json");
test("Every indexed lesson and resource resolves to native content", () => {
  const ids = new Set();
  for (const lesson of course.lessons) {
    assert(!ids.has(lesson.id));
    ids.add(lesson.id);
    const native = read(`public/course/${lesson.id}.json`);
    assert(native.chapters.length > 0, lesson.id);
    assert.equal(
      native.exercises.length,
      lesson.exercises.length + (lesson.id === "A0-L0-01" ? 1 : 0),
      lesson.id,
    );
    for (const exercise of native.exercises) {
      assert(exercise.items.length > 0, `${lesson.id}/${exercise.id}`);
      for (const item of exercise.items)
        assert(
          ["choice", "input", "order", "open"].includes(item.mode),
          JSON.stringify(item),
        );
    }
  }
  for (const book of course.books)
    for (const r of book.resources || [])
      assert(read(`public/course/${r.id}.json`));
});
test("Static app has no account API calls or absolute course paths", () => {
  for (const file of ["app/page.tsx", "app/native-course.tsx"]) {
    const text = readFileSync(file, "utf8");
    assert(!text.includes("/api/records"));
    assert(!text.includes("fetch('/course/"));
  }
});
test("C1 volume is complete and C2 is no longer published", () => {
  assert(!course.books.some((b) => b.id === "C2"));
  assert(!course.lessons.some((l) => l.level === "C2"));
  const book = course.books.find((b) => b.id === "C1");
  assert(book, "C1 book");
  const lessons = course.lessons.filter((l) => l.level === "C1");
  assert.equal(lessons.length, 35);
  assert.deepEqual(
    [...new Set(lessons.map((l) => l.track))].sort(),
    ["C1", "EGY", "INT", "MAG"],
  );
  let questions = 0;
  for (const lesson of lessons) {
    const doc = read(`public/course/${lesson.id}.json`);
    const groups = new Set(doc.exercises.map((g) => g.id));
    // every in-lesson activity link opens an existing exercise group
    for (const chapter of doc.chapters)
      for (const block of chapter.blocks)
        if (block.type === "exercise") assert(groups.has(block.id), `${lesson.id}/${block.id}`);
    for (const g of doc.exercises) questions += g.items.length;
    assert.equal(lesson.nativeChapters, doc.chapters.length, lesson.id);
  }
  assert(questions > 1400, "C1 questions " + questions);
});
test("C1 Arabic text is decoded and directional isolates are balanced", () => {
  for (const r of course.books.find((b) => b.id === "C1").resources) {
    const text = readFileSync(`public/course/${r.id}.json`, "utf8");
    assert(!text.includes("�"), r.id);
    const opens = (text.match(/\u2067/g) || []).length,
      closes = (text.match(/\u2069/g) || []).length;
    assert.equal(opens, closes, r.id);
    // presentation forms or dotless skeletons mean a glyph was not recognised
    // (ornate Quranic parentheses ﴾﴿ and ﷺ are genuine characters)
    assert(
      !/[ﭐ-ﴽ﵀-ﷱﷳ-ﷹﹰ-ﻼٮٯڡں]/.test(text),
      r.id,
    );
  }
});
test("PDF conversion repairs are applied and paradigm tables have one form per cell", async () => {
  const { spawnSync } = await import("node:child_process");
  const { readdirSync } = await import("node:fs");
  const r = spawnSync(process.execPath, ["scripts/repair-pdf-artifacts.mjs", "--check"], { encoding: "utf8" });
  assert.equal(r.status, 0, "run: node scripts/repair-pdf-artifacts.mjs\n" + r.stdout);
  // corrections from the comparison with the original PDFs are all applied
  const p = spawnSync(process.execPath, ["scripts/apply-pdf-fixes.mjs", "--check"], { encoding: "utf8" });
  assert.equal(p.status, 0, "run: node scripts/apply-pdf-fixes.mjs\n" + p.stdout);
  assert.doesNotMatch(p.stdout, /"stale": [1-9]/, "PDF corrections no longer match the text:\n" + p.stdout);
  const strip = (s) => String(s).replace(/[\u2066-\u2069\u200E\u200F]/g, "").trim();
  for (const name of readdirSync("public/course").filter((n) => n.endsWith(".json"))) {
    const d = read(`public/course/${name}`);
    const blocks = [
      ...(d.blocks || []),
      ...(d.chapters || []).flatMap((c) => c.blocks || []),
    ];
    for (const b of blocks) {
      if (b.type !== "table") continue;
      const head = b.rows[0].map(strip);
      if (["Persona", "Pronome", "Errore"].includes(head[0]))
        for (const cell of b.rows.flat()) {
          // no words glued together by the PDF conversion
          for (const w of strip(cell).match(/[\u0621-\u064A][\u0621-\u064A\u064B-\u0652\u0670]*/gu) || []) {
            const bare = w.replace(/[\u064B-\u0652\u0670]/gu, "");
            assert(bare.length < 13, `${name}: «${strip(cell)}»`);
          }
        }
      if (head[0] !== "Persona" || !head.some((h) => /Perfetto|Indicativo/.test(h))) continue;
      for (const row of b.rows.slice(1))
        for (const cell of row.slice(1)) {
          const forms = strip(cell).split(" · ");
          for (const f of forms)
            assert(f.split(/\s+/).length <= 3, `${name}: «${strip(cell)}»`);
        }
    }
  }
});
