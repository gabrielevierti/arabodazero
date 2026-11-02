// Applies the corrections found by comparing the site with the original PDF
// volumes (scripts/content-fixes/pdf-*.json). Safe to run more than once: a
// cell, a text or a row is restored only while the content still matches.
//
//   node scripts/apply-pdf-fixes.mjs           apply and write the files
//   node scripts/apply-pdf-fixes.mjs --check   exit 1 if a correction is still pending
//
// 1. pdf-tables.json — cells that the old import merged, moved to the wrong
//    column or wrote with the Arabic words in the order of the printed page
//    instead of the logical one.
// 2. pdf-fields.json — paragraphs, dialogue lines and model answers with the
//    same problem, found by their own text.
// 3. pdf-rows.json — rows dropped from the end of a table (usually where it
//    continued on the next page): they became a stray paragraph after the
//    table, or disappeared altogether.
// 4. Spacing left around the Arabic phrases by the old import.
import fs from "node:fs";
import path from "node:path";

const CHECK = process.argv.includes("--check");
const ROOT = "public/course";
const FIXES = "scripts/content-fixes";

/** Text without spacing or punctuation: compares two versions of the same text. */
const squash = (value) =>
  String(value)
    .replace(/[⁦-⁩‎‏]/gu, "")
    .replace(/[\s.,;:·…!?()«»"'،؛؟-]+/gu, "");

/** "/chapters[5]/blocks" → ["chapters", 5, "blocks"] */
const steps = (p) =>
  [...p.matchAll(/\/([^/[\]]+)|\[(\d+)\]/g)].map((m) => (m[1] !== undefined ? m[1] : Number(m[2])));
const resolve = (doc, p) => steps(p).reduce((o, k) => (o == null ? o : o[k]), doc);
/** The nth table of a list of blocks: stable when other blocks come and go. */
function tableAt(doc, p, n) {
  const blocks = resolve(doc, p);
  if (!Array.isArray(blocks)) return {};
  let seen = -1;
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b && typeof b === "object" && b.type === "table" && Array.isArray(b.rows) && ++seen === n)
      return { blocks, table: b, index: i };
  }
  return { blocks };
}

const docs = new Map();
const load = (name) => {
  if (!docs.has(name)) {
    const file = path.join(ROOT, name);
    docs.set(name, { file, before: fs.readFileSync(file, "utf8"), doc: JSON.parse(fs.readFileSync(file, "utf8")) });
  }
  return docs.get(name).doc;
};
const read = (name) => JSON.parse(fs.readFileSync(path.join(FIXES, name), "utf8"));

// 4. Spacing left by the old import around Arabic phrases: «⁧X⁩ .» → «⁧X⁩.»,
// «« parola »» → ««parola»», «( X )» → «(X)», and Arabic punctuation that
// belongs to the phrase moves inside it («⁧X⁩ ؟» → «⁧X؟⁩»).
function tidy(value) {
  return value
    .replace(/⁩ ([؟،؛])/gu, (m, p) => p + "⁩")
    .replace(/([^⁩])⁩([؟،؛])⁩/gu, "$1$2⁩")
    .replace(/⁩ ([.,;:!?…])(?=$|[\s"»)\]⁧])/gu, "⁩$1")
    .replace(/« +/gu, "«")
    .replace(/ +»/gu, "»")
    .replace(/\( +/gu, "(")
    .replace(/ +\)/gu, ")");
}
function tidyAll(o) {
  if (typeof o === "string") return tidy(o);
  if (Array.isArray(o)) return o.map(tidyAll);
  if (o && typeof o === "object") {
    for (const k of Object.keys(o)) if (k !== "id") o[k] = tidyAll(o[k]);
    return o;
  }
  return o;
}
const summary = { tableCells: 0, fields: 0, rows: 0, paragraphs: 0, alreadyApplied: 0, stale: 0 };
const stale = [];
const note = (what) => {
  summary.stale++;
  stale.push(what);
};

// 1. cells
for (const fix of read("pdf-tables.json").rows) {
  const { table } = tableAt(load(fix.file), fix.path, fix.table);
  const row = table?.rows?.[fix.row];
  if (!row) {
    note(`${fix.file}${fix.path} table ${fix.table} row ${fix.row}`);
    continue;
  }
  let done = true;
  for (const [k, [oldText, newText]] of Object.entries(fix.cells)) {
    const current = row[k] === undefined ? undefined : tidy(row[k]);
    if (current === tidy(newText)) summary.alreadyApplied++;
    else if (current === tidy(oldText)) {
      row[k] = newText;
      summary.tableCells++;
    } else {
      done = false;
      note(`${fix.file}${fix.path} table ${fix.table} row ${fix.row} col ${k}`);
    }
  }
  // the archived English copy keeps the old table: mark this one as revised
  if (done && !table.revised) {
    table.revised = true;
    summary.tableCells += CHECK ? 1 : 0;
  }
}

// 2. texts, found by their own content
for (const fix of read("pdf-fields.json").fields) {
  const want = tidy(fix.new),
    had = tidy(fix.old);
  let found = 0,
    already = 0;
  const walk = (parent, key) => {
    const value = parent[key];
    if (typeof value === "string") {
      const now = tidy(value);
      if (now === want) already++;
      else if (now === had) {
        parent[key] = fix.new;
        found++;
        if (!Array.isArray(parent) && !parent.revised) parent.revised = true;
      }
      return;
    }
    if (value && typeof value === "object") for (const k of Object.keys(value)) walk(value, k);
  };
  const doc = { root: load(fix.file) };
  walk(doc, "root");
  summary.fields += found;
  summary.alreadyApplied += already;
  if (!found && !already) note(`${fix.file} (text not found)`);
}

// 3. rows dropped from the end of a table
const rows = read("pdf-rows.json").tables.slice();
// last table first: removing a stray paragraph shifts the blocks after it
rows.sort((a, b) => (a.file === b.file && a.path === b.path ? b.table - a.table : 0));
for (const fix of rows) {
  const { blocks, table, index } = tableAt(load(fix.file), fix.path, fix.table);
  if (!table) {
    note(`${fix.file}${fix.path} table ${fix.table} (missing)`);
    continue;
  }
  if (table.rows.length === fix.was + fix.add.length) {
    summary.alreadyApplied++;
    continue;
  }
  if (table.rows.length !== fix.was || squash(table.rows[table.rows.length - 1].join(" ")) !== fix.last) {
    note(`${fix.file}${fix.path} table ${fix.table} (table changed)`);
    continue;
  }
  const after = blocks.slice(index + 1, index + 1 + fix.drop.length);
  if (fix.drop.some((text, i) => !after[i] || squash(String(after[i].text || "")) !== squash(text))) {
    note(`${fix.file}${fix.path} table ${fix.table} (paragraph changed)`);
    continue;
  }
  blocks.splice(index + 1, fix.drop.length);
  table.rows.push(...fix.add);
  table.revised = true;
  summary.rows += fix.add.length;
  summary.paragraphs += fix.drop.length;
  // the archived English copy follows the same structure, so the test that
  // compares the two keeps working; the restored rows keep the Italian text
  // and the table is marked as revised, which excludes it from that comparison
  const archive = path.join(ROOT, "en", fix.file);
  if (!fs.existsSync(archive)) continue;
  const en = tableAt(load("en/" + fix.file), fix.path, fix.table);
  const followers = en.blocks?.slice(en.index + 1, en.index + 1 + fix.drop.length) || [];
  if (
    en.table?.rows.length === fix.was &&
    followers.length === fix.drop.length &&
    followers.every((b) => ["paragraph", "list", "arabic"].includes(b?.type))
  ) {
    en.blocks.splice(en.index + 1, fix.drop.length);
    en.table.rows.push(...fix.add);
    en.table.revised = true;
  } else if (en.table?.rows.length !== fix.was + fix.add.length) {
    note(`en/${fix.file}${fix.path} table ${fix.table} (archive differs)`);
  }
}

// the archived English copy gets the same changes, so the two stay comparable
const names = [
  ...fs.readdirSync(ROOT).filter((n) => n.endsWith(".json")),
  ...(fs.existsSync(path.join(ROOT, "en"))
    ? fs.readdirSync(path.join(ROOT, "en")).filter((n) => n.endsWith(".json")).map((n) => "en/" + n)
    : []),
];
// 3b. A part title of the volume («Parte III — Esame di Livello 0») was read as
// a table with an empty cell and the title: it is a heading, not a table.
for (const name of names) {
  const walk = (node) => {
    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) {
        const b = node[i];
        if (
          b && typeof b === "object" && b.type === "table" && Array.isArray(b.rows) &&
          b.rows.length === 1 && b.rows[0].length === 2 && !String(b.rows[0][0]).trim() &&
          /^(?:Parte|Part)\s+[IVX]+\s*[—•·:-]\s/.test(String(b.rows[0][1]).trim())
        ) {
          node[i] = { type: "heading", text: String(b.rows[0][1]).trim() };
          summary.banners = (summary.banners || 0) + 1;
        } else walk(b);
      }
      return;
    }
    if (node && typeof node === "object") for (const k of Object.keys(node)) walk(node[k]);
  };
  walk(load(name));
}

// 4. spacing, over every document including the archive
for (const name of names) {
  const doc = load(name);
  const before = JSON.stringify(doc);
  tidyAll(doc);
  if (JSON.stringify(doc) !== before) summary.spacing = (summary.spacing || 0) + 1;
}

let changedFiles = 0;
for (const { file, before, doc } of docs.values()) {
  const after = JSON.stringify(doc);
  if (after !== JSON.stringify(JSON.parse(before))) {
    changedFiles++;
    if (!CHECK) fs.writeFileSync(file, after);
  }
}
console.log(JSON.stringify({ ...summary, changedFiles }, null, 1));
if (stale.length) console.log("Not applied (content changed since the comparison):\n  " + stale.slice(0, 20).join("\n  "));
if (CHECK && (summary.tableCells || summary.fields || summary.rows || summary.banners || summary.spacing)) process.exit(1);
