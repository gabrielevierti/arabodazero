// Repairs artifacts left by the legacy PDF conversion of volumes A0–B2 (and a
// few C1 cells). Safe to run more than once.
//
//   node scripts/repair-pdf-artifacts.mjs            apply and write the files
//   node scripts/repair-pdf-artifacts.mjs --report   only print what would change
//   node scripts/repair-pdf-artifacts.mjs --check    exit 1 if anything would change
//
// 1. Glued Arabic words. When table cells or columns were flattened, the words
//    of different cells were joined without a space («كِتَابَةمَكْتَبَة»). A token
//    is split only when (a) it can be rebuilt entirely from words that appear
//    on their own elsewhere in the course and (b) an independent signal proves
//    that it cannot be a single word: a tāʾ marbūṭa or alif maqṣūra inside the
//    token, a repeated word, an article «ال» starting a second full word, a
//    personal pronoun closing a conjugation row, or an implausible length.
// 2. Conjugation tables whose rows collapsed into one cell, and
// 3. «Errore / Correzione» rows where the correct and the wrong sentence were
//    glued in one cell, are replaced with the versions rebuilt by hand in
//    scripts/content-fixes/tables.json.
// 4. Hard line breaks of the PDF inside explanations and model answers are
//    joined, except table lines («|») and list items.
// 5. Each question of a group gets its own `feedback` taken from the shared
//    solution key («a) … · b) …»), so the correction no longer shows the
//    answers of the other questions.
// 6. The placeholder instruction «Leggi la consegna e prepara la tua risposta.»
//    is removed: the exercise title and blocks already carry the task.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const args = new Set(process.argv.slice(2));
const REPORT = args.has("--report"),
  CHECK = args.has("--check");
const ROOTS = ["public/course", "public/course/en"];

const MARKS = "\u064B-\u0652\u0670\u0640";
const LETTER = "\u0621-\u064A\u0671-\u06D3";
const TOKEN = new RegExp(`[${LETTER}][${LETTER}${MARKS}]*`, "gu");
const bare = (w) => w.replace(new RegExp(`[${MARKS}]`, "gu"), "");
const isLetter = new RegExp(`^[${LETTER}]`, "u");

/** Short words that stand on their own; any other piece needs three letters. */
const SHORT_WORDS = new Set(
  "هو هي لم لن أن إن من في عن قد هل أو يا بل إذ".split(" "),
);
/** Never a separate last piece: they also work as suffixes (-mā, -lā, -kum…). */
const NOT_FINAL = new Set("ما لا كم هم من".split(" "));
const PRONOUNS = new Set(
  "هو هي أنا أنت أنتما أنتم أنتن نحن هما هن".split(" "),
);
/** Pronouns that can close a glued conjugation row: -humā and -hunna are also
 * suffixes («بَيْنَهُمَا»), so they never count as proof. */
const ROW_END = new Set("هو هي أنا أنت أنتما أنتم أنتن نحن".split(" "));

const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const files = (root) =>
  fs.existsSync(root)
    ? fs
        .readdirSync(root)
        .filter((n) => n.endsWith(".json"))
        .map((n) => path.join(root, n))
    : [];

function walkStrings(x, f) {
  if (typeof x === "string") return f(x);
  if (Array.isArray(x)) {
    for (let i = 0; i < x.length; i++) {
      const v = walkStrings(x[i], f);
      if (v !== undefined) x[i] = v;
    }
  } else if (x && typeof x === "object")
    for (const k of Object.keys(x)) {
      const v = walkStrings(x[k], f);
      if (v !== undefined) x[k] = v;
    }
}

// ── 1. Lexicon of words that occur on their own ─────────────────────────────
const freq = new Map();
function countWords(doc) {
  walkStrings(doc, (s) => {
    for (const m of s.matchAll(TOKEN)) freq.set(m[0], (freq.get(m[0]) || 0) + 1);
  });
}

function pieceOk(p, last) {
  if (!isLetter.test(p) || (freq.get(p) || 0) < 2) return false;
  const b = bare(p);
  if (last && NOT_FINAL.has(b)) return false;
  return b.length >= 3 || SHORT_WORDS.has(b);
}

/** Cheapest split of `w` into known words (fewest pieces, then most frequent). */
function split(w) {
  const n = w.length,
    best = new Array(n + 1).fill(null);
  best[0] = { pieces: [], cost: 0 };
  for (let i = 0; i < n; i++) {
    if (!best[i]) continue;
    for (let j = i + 2; j <= n; j++) {
      const p = w.slice(i, j);
      if (p === w || !pieceOk(p, j === n)) continue;
      // a piece never ends right before a combining mark of the next letter
      if (j < n && !isLetter.test(w[j])) continue;
      const cost = best[i].cost + 1000 - Math.min(999, Math.log(freq.get(p)) * 10);
      if (!best[j] || cost < best[j].cost)
        best[j] = { pieces: [...best[i].pieces, p], cost };
    }
  }
  const r = best[n];
  return r && r.pieces.length > 1 ? r.pieces : null;
}

function proofOfGlue(w, pieces) {
  const b = bare(w);
  if (/[ةى][\u0621-\u064A]/u.test(b)) return "tāʾ marbūṭa/alif maqṣūra interna";
  const bases = pieces.map(bare);
  if (new Set(bases).size < bases.length) return "parola ripetuta";
  for (let i = 1; i < pieces.length; i++)
    if (
      bases[i].startsWith("ال") &&
      bases[i - 1].length >= 3 &&
      (freq.get(pieces[i - 1]) || 0) >= 3 &&
      (freq.get(pieces[i]) || 0) >= 3
    )
      return "articolo all'inizio di una seconda parola";
  const last = bases.at(-1);
  if (ROW_END.has(last) && bases.slice(0, -1).every((x) => x.length >= 3))
    return "pronome a fine riga di coniugazione";
  // tanwīn only closes a word (the alif or alif maqṣūra of -an excepted)
  if (/[\u064B-\u064D]\u0651?(?![اى])[\u0621-\u064A]/u.test(w)) return "tanwīn dentro il gruppo";
  for (let i = 1; i < bases.length; i++)
    if (bases[i].length >= 3 && bases[i - 1].length >= 3 && bases[i].slice(0, 3) === bases[i - 1].slice(0, 3))
      return "due forme della stessa parola";
  if (b.length >= 12 && pieces.every((p) => bare(p).length >= 4))
    return "lunghezza non plausibile";
  return null;
}

let glueCache = new Map();
/** Glued tokens also occur more than once (solution key + model answer), so a
 * first pass finds them and removes them from the lexicon before the real pass. */
function prepareLexicon() {
  for (const w of [...freq.keys()]) {
    if (bare(w).length < 5 || freq.get(w) > 12) continue;
    const pieces = split(w);
    if (pieces && proofOfGlue(w, pieces)) glueCache.set(w, pieces.join(" "));
  }
  for (const w of glueCache.keys()) freq.delete(w);
  glueCache = new Map();
}
/** Deliberately wrong forms quoted by the course: never split them. */
const KEEP_AS_IS = new Set(["أَعْطَىنِي"]);
const SUFFIX = new Set("ه ها هما هم هن ك كما كم كن ي نا".split(" "));
const isMark = (c) => /[\u064B-\u0652\u0670\u0640]/u.test(c);
const isArabicLetter = (c) => /[\u0621-\u064A\u0671-\u06D3]/u.test(c);
/** Boundaries that are certain whatever the words: tāʾ marbūṭa, alif maqṣūra
 * and tanwīn only close a word, and inside a word a ḍamma or a sukūn is never
 * followed by alif. Pronoun suffixes after a tāʾ marbūṭa are left alone: they
 * are the course's own examples of a wrong form («مَدِينَةُهَا»). */
function definiteSplit(w) {
  if (KEEP_AS_IS.has(w)) return null;
  const cuts = [];
  let from = 0;
  for (let i = 1; i < w.length; i++) {
    if (!isArabicLetter(w[i])) continue;
    let j = i - 1;
    while (j > 0 && isMark(w[j])) j--;
    const prev = w[j],
      marks = w.slice(j + 1, i),
      left = bare(w.slice(from, i)),
      rest = bare(w.slice(i));
    let cut = false;
    // a tatwīl marks a suffix being quoted («\u0640\u064Eانُ»): not a word boundary
    if (marks.includes("\u0640") || prev === "\u0640") continue;
    if ((prev === "ة" || prev === "ى") && !SUFFIX.has(rest)) cut = true;
    else if (/[\u064C\u064D]/u.test(marks)) cut = true;
    else if (marks.includes("\u064B")) {
      // -an is written with an alif, except after tāʾ marbūṭa, hamza after alif and alif maqṣūra
      const carrier = (w[i] === "ا" || w[i] === "ى") && !/(?:اء|ة|ى)$/u.test(left);
      cut = !carrier;
    } else if (prev === "ا" && w[j - 1] === "\u064B") cut = true;
    else if (/\u064F/u.test(marks) && /[اأإآ]/u.test(w[i]) && left.length >= 3) cut = true;
    else if (marks === "\u0652" && w[i] === "ا" && left.length >= 3) cut = true;
    if (cut) {
      cuts.push(i);
      from = i;
    }
  }
  if (!cuts.length) return null;
  const parts = [];
  let start = 0;
  for (const c of [...cuts, w.length]) {
    parts.push(w.slice(start, c));
    start = c;
  }
  return parts.every((p) => bare(p).length >= 2) ? parts : null;
}
function ungluePiece(w) {
  if (bare(w).length < 5 || (freq.get(w) || 0) > 12) return w;
  const pieces = split(w);
  return pieces && proofOfGlue(w, pieces) ? pieces.join(" ") : w;
}
function unglue(w) {
  if (glueCache.has(w)) return glueCache.get(w);
  const parts = definiteSplit(w) || [w];
  const fixed = parts.map(ungluePiece).join(" ");
  const out = fixed === w ? null : fixed;
  glueCache.set(w, out);
  return out;
}

const changes = { glued: new Map(), conjugation: 0, errorTables: 0, lineBreaks: 0, feedback: 0, placeholders: 0 };
function repairGlue(s) {
  if (!/[\u0621-\u064A]/u.test(s)) return s;
  // a doubled identical vowel sign is never valid: it comes from a merged suffix column
  s = s.replace(/([\u064B-\u0652])\1+/gu, "$1");
  return s.replace(TOKEN, (w) => {
    const fixed = unglue(w);
    if (!fixed) return w;
    changes.glued.set(w, fixed);
    return fixed;
  });
}

// ── 2–3. Tables rebuilt by hand ─────────────────────────────────────────────
// Conjugation tables and «Errore / Correzione» rows whose cells were merged are
// replaced from scripts/content-fixes/tables.json. Each entry is keyed by the
// hash of the original rows, so an entry applies to every copy of the table
// (lesson and library resource) and never touches a table edited since.
const FIXES = read(new URL("./content-fixes/tables.json", import.meta.url)).tables;
const tableKey = (rows) =>
  crypto.createHash("sha1").update(JSON.stringify(rows)).digest("hex").slice(0, 12);
const ARABIC_RUN =
  /[\u0621-\u064A\u0671-\u06D3][\u0621-\u064A\u0671-\u06D3\u064B-\u0652\u0670\u0640 ،؟…]*[\u0621-\u064A\u0671-\u06D3\u064B-\u0652\u0670؟]|[\u0621-\u064A\u0671-\u06D3]/gu;
/** Wraps every Arabic run of a cell in a right-to-left isolate, as the importer does. */
const isolateArabic = (cell) =>
  cell.replace(ARABIC_RUN, (run) => "\u2067" + run + "\u2069");
/** «: \u2067correct form\u2069 note» → «\u2067correct form\u2069 — note» (colon moved by the RTL extraction). */
const LEADING_COLON = /^\s*:\s*((?:\u2067[^\u2069]*\u2069[\s,]*)+)(.*)$/su;
function tidyErrorTable(block, patched) {
  if (block.rows[0]?.[0]?.trim() !== "Errore") return;
  block.rows.forEach((row, i) => {
    if (!i || patched.has(i) || !row[0]?.trim()) return;
    const m = LEADING_COLON.exec(row[1] || "");
    if (!m) return;
    const note = m[2].trim();
    row[1] = m[1].replace(/[\s,]+$/u, "") + (note ? " — " + note : "");
    changes.errorTables++;
  });
}
function applyTableFix(block) {
  if (block?.type !== "table" || !Array.isArray(block.rows)) return;
  const fix = FIXES[tableKey(block.rows)];
  if (!fix) {
    tidyErrorTable(block, new Set());
    return;
  }
  const width = block.rows[0].length;
  // a null cell keeps the original one (e.g. the «Unità» column)
  const cells = (row, original = []) => {
    if (row.length !== width) throw new Error("tables.json: wrong column count " + JSON.stringify(row));
    return row.map((c, k) => (c === null ? original[k] : isolateArabic(c)));
  };
  if (fix.header) block.rows[0] = cells(fix.header, block.rows[0]);
  if (fix.rows) {
    block.rows = [block.rows[0], ...fix.rows.map((r) => cells(r))];
    changes.conjugation++;
  }
  for (const [i, row] of Object.entries(fix.patch || {})) {
    block.rows[Number(i)] = cells(row, block.rows[Number(i)]);
    changes.errorTables++;
  }
  tidyErrorTable(block, new Set(Object.keys(fix.patch || {}).map(Number)));
  // the archived English copy keeps the original table: tests compare it only
  // where the Italian table was not rebuilt
  block.revised = true;
}

// ── 4. PDF line breaks ──────────────────────────────────────────────────────
const KEEP_LINE = /^\s*(?:[•\-–]|\d+[.)]|[a-z]\)|\(?[a-z]\)|.*\s\|\s|\|)/u;
function joinLines(s) {
  if (!s.includes("\n")) return s;
  const lines = s.split("\n");
  const out = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    const prev = out[out.length - 1],
      cur = lines[i];
    const keep =
      !prev.trim() ||
      !cur.trim() ||
      KEEP_LINE.test(cur) ||
      prev.includes(" | ") ||
      /[.:;!?»…]\s*$/u.test(prev) && /^\s*[A-ZÀ-Ý«]/u.test(cur);
    if (keep) out.push(cur);
    else out[out.length - 1] = prev.replace(/\s+$/u, "") + " " + cur.replace(/^\s+/u, "");
  }
  const joined = out.join("\n");
  if (joined !== s) changes.lineBreaks++;
  return joined;
}

// ── 5. Per-question feedback ────────────────────────────────────────────────
/** «a) … · b) … · c) …» → { a: "…", b: "…" } */
function keyParts(text) {
  const marker = /(?:^|\s[·;]\s|\n|\s)\(?([a-z]|\d{1,2})\)\s/gu;
  const hits = [...text.matchAll(marker)];
  if (hits.length < 2) return null;
  const parts = {};
  hits.forEach((m, i) => {
    const start = m.index + m[0].length,
      end = i + 1 < hits.length ? hits[i + 1].index : text.length;
    const id = m[1];
    if (id in parts) return;
    let part = text.slice(start, end).replace(/^[\s|·;:]+/u, "").replace(/[\s·;|]+$/u, "");
    // a short dangling last line is the start of the next paragraph
    part = part.replace(/\n[^\n]{0,12}$/u, (tail) => (/[.!?»)]$/u.test(tail) ? tail : ""));
    parts[id] = part.trim();
  });
  // ids must be a consecutive run a, b, c… or 1, 2, 3…
  const ids = Object.keys(parts);
  const seq = /^\d/.test(ids[0])
    ? ids.every((id, i) => Number(id) === i + 1)
    : ids.every((id, i) => id === String.fromCharCode(97 + i));
  return seq ? parts : null;
}
function repairGroup(group) {
  const items = group.items || [];
  const shared = new Map();
  for (const it of items) if (it.explanation) shared.set(it.explanation, (shared.get(it.explanation) || 0) + 1);
  for (const it of items) {
    if (!it.explanation || shared.get(it.explanation) < 2 || it.feedback) continue;
    const parts = keyParts(it.explanation);
    const own = parts?.[it.id];
    if (own && own.length < it.explanation.length * 0.8) {
      it.feedback = own;
      changes.feedback++;
    }
  }
  if (group.instruction?.trim() === "Leggi la consegna e prepara la tua risposta.") {
    group.instruction = "";
    changes.placeholders++;
  }
}

// ── Apply ───────────────────────────────────────────────────────────────────
function fixTables(doc) {
  const visit = (blocks) => (blocks || []).forEach(applyTableFix);
  visit(doc.blocks);
  visit(doc.solutionBlocks);
  for (const ch of doc.chapters || []) visit(ch.blocks);
  for (const g of doc.exercises || []) {
    visit(g.blocks);
    visit(g.solutionBlocks);
  }
}
// Tables are fixed first, so the forms they now show separately also enter the
// lexicon used to split the copies glued elsewhere (explanations, models).
const docs = ROOTS.flatMap((root, r) =>
  files(root).map((file) => {
    const before = fs.readFileSync(file, "utf8");
    const doc = JSON.parse(before);
    fixTables(doc);
    if (r === 0) countWords(doc);
    return { file, before, doc };
  }),
);
prepareLexicon();
let touched = 0;
for (const { file, before, doc } of docs) {
  walkStrings(doc, repairGlue);
  for (const g of doc.exercises || []) {
    for (const it of g.items || [])
      for (const k of ["explanation", "model", "feedback"])
        if (typeof it[k] === "string") it[k] = joinLines(it[k]);
    repairGroup(g);
  }
  // course documents are stored minified
  const after = JSON.stringify(doc);
  if (after !== JSON.stringify(JSON.parse(before))) {
    touched++;
    if (!REPORT && !CHECK) fs.writeFileSync(file, after);
  }
}

const summary = {
  files: touched,
  gluedWords: changes.glued.size,
  conjugationRows: changes.conjugation,
  errorTableRows: changes.errorTables,
  lineBreakFixes: changes.lineBreaks,
  perQuestionFeedback: changes.feedback,
  placeholderInstructions: changes.placeholders,
};
console.log(JSON.stringify(summary, null, 1));
if (REPORT)
  for (const [w, f] of changes.glued) console.log(w + "  →  " + f);
if (CHECK && touched) process.exit(1);
