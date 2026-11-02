// Applies the corrections found by comparing the site with the original PDF
// volumes (scripts/content-fixes/pdf-*.json). Safe to run more than once:
// a cell or field is replaced only while it still holds the old text.
//
//   node scripts/apply-pdf-fixes.mjs           apply and write the files
//   node scripts/apply-pdf-fixes.mjs --check   exit 1 if a correction is still pending
import fs from "node:fs";
import path from "node:path";

const CHECK = process.argv.includes("--check");
const ROOT = "public/course";
const FIXES = "scripts/content-fixes";

/** "/chapters[5]/blocks[8]" → ["chapters", 5, "blocks", 8] */
const steps = (p) =>
  [...p.matchAll(/\/([^/[\]]+)|\[(\d+)\]/g)].map((m) => (m[1] !== undefined ? m[1] : Number(m[2])));
const resolve = (doc, p) => steps(p).reduce((o, k) => (o == null ? o : o[k]), doc);

const docs = new Map();
const load = (name) => {
  if (!docs.has(name)) {
    const file = path.join(ROOT, name);
    docs.set(name, { file, before: fs.readFileSync(file, "utf8"), doc: JSON.parse(fs.readFileSync(file, "utf8")) });
  }
  return docs.get(name).doc;
};

const summary = { tableCells: 0, fields: 0, alreadyApplied: 0, stale: 0 };
const stale = [];

const tables = JSON.parse(fs.readFileSync(path.join(FIXES, "pdf-tables.json"), "utf8")).rows;
for (const fix of tables) {
  const table = resolve(load(fix.file), fix.path);
  const row = table?.rows?.[fix.row];
  if (!row) {
    summary.stale++;
    stale.push(fix.file + fix.path);
    continue;
  }
  let done = true;
  for (const [k, [oldText, newText]] of Object.entries(fix.cells)) {
    // texts are compared after the spacing clean-up below, so the order of the
    // passes does not matter
    if (row[k] === newText || tidy(row[k]) === tidy(newText)) summary.alreadyApplied++;
    else if (tidy(row[k]) === tidy(oldText)) {
      row[k] = newText;
      summary.tableCells++;
    } else {
      done = false;
      summary.stale++;
      stale.push(`${fix.file}${fix.path} row ${fix.row} col ${k}`);
    }
  }
  // the archived English copy keeps the old table: mark this one as revised
  if (done && !table.revised) {
    table.revised = true;
    summary.tableCells += CHECK ? 1 : 0;
  }
}

const fieldsFile = path.join(FIXES, "pdf-fields.json");
if (fs.existsSync(fieldsFile)) {
  for (const fix of JSON.parse(fs.readFileSync(fieldsFile, "utf8")).fields) {
    const doc = load(fix.file);
    const parts = steps(fix.path);
    const key = parts.pop();
    const parent = parts.reduce((o, k) => (o == null ? o : o[k]), doc);
    if (!parent) {
      summary.stale++;
      stale.push(fix.file + fix.path);
    } else if ([fix.new, fix.old].some((t) => tidy(String(parent[key])) === tidy(t))) {
      if (tidy(String(parent[key])) === tidy(fix.new)) summary.alreadyApplied++;
      else {
        parent[key] = fix.new;
        summary.fields++;
      }
      // not comparable with the archived English copy any more
      if (!Array.isArray(parent) && !parent.revised) {
        parent.revised = true;
        summary.fields += CHECK ? 1 : 0;
      }
    } else {
      summary.stale++;
      stale.push(fix.file + fix.path);
    }
  }
}

// Spacing left by the old import around Arabic phrases: «⁧X⁩ .» → «⁧X⁩.»,
// «« parola »» → ««parola»», «( X )» → «(X)», and Arabic punctuation that
// belongs to the phrase moves inside it («⁧X⁩ ؟» → «⁧X؟⁩»).
function tidy(value) {
  return value
    .replace(/\u2069 ([؟،؛])/gu, (m, p) => p + "\u2069")
    .replace(/([^\u2069])\u2069([؟،؛])\u2069/gu, "$1$2\u2069")
    .replace(/\u2069 ([.,;:!?…])(?=$|[\s"»)\]\u2067])/gu, "\u2069$1")
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
// the archived English copy gets the same spacing, so the two stay comparable
const names = [
  ...fs.readdirSync(ROOT).filter((n) => n.endsWith(".json")),
  ...(fs.existsSync(path.join(ROOT, "en")) ? fs.readdirSync(path.join(ROOT, "en")).filter((n) => n.endsWith(".json")).map((n) => "en/" + n) : []),
];
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
if (stale.length) console.log("Not applied (text changed since the comparison):\n  " + stale.slice(0, 20).join("\n  "));
if (CHECK && (summary.tableCells || summary.fields || summary.spacing)) process.exit(1);
