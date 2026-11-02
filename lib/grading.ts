export type NormalizationPolicy =
  "choice-id" | "arabic-vocalized" | "arabic-unvocalized" | "text";
export type Gradable = {
  mode: string;
  answers?: string[];
  model?: string;
  prompt?: string;
  strictMarks?: boolean;
  normalization?: NormalizationPolicy;
};
/** Preserve hamza carriers, alif maqsura, ta marbuta and shadda unless explicitly
 * unvocalized. Punctuation is significant: alternatives belong in content. */
export function normalizeAnswer(
  value: string,
  policy: NormalizationPolicy,
): string {
  if (policy === "choice-id") return value.trim();
  let s = value
    .normalize("NFKC")
    .replace(/[\u200e\u200f\u2066-\u2069\u0640]/g, "")
    .trim()
    .replace(/\s+/gu, " ");
  if (policy === "arabic-unvocalized")
    s = s.replace(/[\u064b-\u0652\u0670]/g, "");
  return policy === "text" ? s.toLocaleLowerCase("en") : s;
}
export function policyFor(q: Gradable): NormalizationPolicy {
  return (
    q.normalization ||
    (q.mode === "choice"
      ? "choice-id"
      : q.strictMarks
        ? "arabic-vocalized"
        : "text")
  );
}
export type Rating = "empty" | "model" | "good" | "partial" | "again";
export type Grade = {
  rating: Rating;
  note?: string;
  /** Words of the reference answer that the learner left out (open answers). */
  missing?: string[];
  /** Words the learner added that are not in the reference. */
  extra?: string[];
};

const MARKS = /[\u064B-\u0652\u0670]/gu;
const VOWELS = /[\u064B-\u0650\u0652]/u; // fatḥa…kasra, tanwīn, sukūn (not šadda)
const ARABIC = /[\u0621-\u064Aٱ]/u;
/** Punctuation that never decides an answer: final full stops, quotes, brackets. */
const EDGE_PUNCTUATION = /^[\s.,;:!?،؛؟«»"'()…-]+|[\s.,;:!?،؛؟«»"'()…-]+$/gu;

/** Common base: compatibility forms, invisible marks and spacing removed. */
function canonical(value: string) {
  return value
    .normalize("NFKC")
    .replace(/[\u200E\u200F\u2066-\u2069\u0640]/gu, "")
    .replace(/ٱ/gu, "ا") // alif waṣla is written as a plain alif
    .replace(/\s+/gu, " ")
    .replace(EDGE_PUNCTUATION, "")
    .replace(/\s*([،,;:])\s*/gu, "$1 ")
    .trim();
}
/** Letters only: no short vowels, tanwīn, sukūn, šadda or dagger alif. */
const skeleton = (s: string) => canonical(s).replace(MARKS, "");
/** Also folds the spellings learners confuse: hamza seats, tāʾ marbūṭa, alif maqṣūra. */
const loose = (s: string) =>
  skeleton(s)
    .replace(/[أإآ]/gu, "ا")
    .replace(/ؤ/gu, "و")
    .replace(/ئ/gu, "ي")
    .replace(/ة/gu, "ه")
    .replace(/ى/gu, "ي")
    .replace(/ء/gu, "");
const latinFold = (s: string) =>
  canonical(s)
    .toLocaleLowerCase("it")
    .normalize("NFD")
    .replace(/[̀-ͯʿʾ‘’'`]/gu, "");

/** Each letter with the set of marks written on it. */
function clusters(s: string) {
  const out: { base: string; marks: Set<string> }[] = [];
  for (const ch of canonical(s)) {
    if (/[\u064B-\u0652\u0670]/u.test(ch) && out.length) out.at(-1)!.marks.add(ch);
    else out.push({ base: ch, marks: new Set() });
  }
  return out;
}
/**
 * Compares the vowels of two answers with the same letters.
 * "same": every mark matches; "missing": only some marks are left out;
 * "different": a written vowel contradicts the expected one.
 * The dagger alif of «هٰذَا» or «لٰكِنَّ» can be typed as a fatḥa or omitted:
 * ordinary keyboards do not have it.
 */
function compareVowels(typed: string, expected: string): "same" | "missing" | "different" {
  const t = clusters(typed),
    e = clusters(expected);
  let missing = false;
  for (let i = 0; i < Math.min(t.length, e.length); i++) {
    const want = new Set(e[i].marks),
      got = t[i].marks;
    const dagger = want.delete("\u0670");
    if (dagger) want.add("\u064E");
    for (const m of got) if (!want.has(m) && VOWELS.test(m)) return "different";
    for (const m of want) if (!got.has(m) && !(dagger && m === "\u064E")) missing = true;
  }
  return missing ? "missing" : "same";
}

/** True when the exercise explicitly asks for the vowels. */
export function needsVowels(q: Gradable, instruction = "") {
  return (
    !!q.strictMarks ||
    q.normalization === "arabic-vocalized" ||
    /con (?:tutte )?le vocali|vocali complete|vocalizz/i.test(instruction)
  );
}

/**
 * Grades an answer the way a teacher would for a written exercise:
 * – exact form, or the same letters with the vowels left out → correct;
 * – the right letters with a wrong vowel, a missing hamza or a tāʾ marbūṭa
 *   written as hāʾ → «quasi» (partial), with the reason;
 * – long free answers (translations) that differ from the model are not
 *   marked wrong: the learner compares them with the model.
 */
export function gradeAnswer(q: Gradable, text: string, instruction = ""): Grade {
  if (!text.trim()) return { rating: "empty" };
  if (q.mode === "open" || !q.answers?.length) return gradeOpen(q, text, instruction);
  const policy = policyFor(q);
  if (policy === "choice-id")
    return { rating: q.answers.includes(text.trim()) ? "good" : "again" };
  if (q.answers.some((a) => normalizeAnswer(a, policy) === normalizeAnswer(text, policy)))
    return { rating: "good" };
  const vowels = needsVowels(q, instruction);
  let best: Grade | null = null;
  const consider = (g: Grade) => {
    const rank = { good: 3, partial: 2, model: 1, again: 0, empty: -1 } as const;
    if (!best || rank[g.rating] > rank[best.rating]) best = g;
  };
  for (const answer of q.answers) {
    if (!ARABIC.test(answer)) {
      if (canonical(text).toLocaleLowerCase("it") === canonical(answer).toLocaleLowerCase("it"))
        consider({ rating: "good" });
      else if (latinFold(text) === latinFold(answer))
        consider({ rating: "partial", note: "Quasi: controlla i segni diacritici (ā, ī, ū, ṭ, ʿ…)." });
      continue;
    }
    if (skeleton(text) === skeleton(answer)) {
      const v = compareVowels(text, answer);
      if (v === "same") consider({ rating: "good" });
      else if (v === "different")
        consider({ rating: "partial", note: "Le lettere sono giuste, ma una vocale non corrisponde." });
      else if (vowels)
        consider({ rating: "partial", note: "Le lettere sono giuste: qui servono anche tutte le vocali." });
      else consider({ rating: "good", note: "Accettata anche senza vocali." });
    } else if (loose(text) === loose(answer)) {
      consider({
        rating: "partial",
        note: "Quasi: controlla hamza, tāʾ marbūṭa (ة) e alif maqṣūra (ى).",
      });
    } else if (canonical(answer).split(" ").length >= 3) {
      // a whole sentence: compare word by word instead of letter by letter
      consider(compareWithReference(text, { required: answer, allowed: q.model || "" }));
    }
  }
  return best || { rating: "again" };
}
export function evaluateAnswer(q: Gradable, text: string, instruction = ""): Rating {
  return gradeAnswer(q, text, instruction).rating;
}
export type Attempt = {
  at: string;
  text: string;
  rating: string;
  automatic: boolean;
};
export function withAttempt(
  previous: Record<string, any>,
  value: Record<string, any>,
) {
  const history: Attempt[] = [...(previous.history || [])];
  const event = {
    at: value.checkedAt,
    text: value.text || "",
    rating: value.rating,
    automatic: !!value.automatic,
  };
  if (history.at(-1)?.at === event.at) history[history.length - 1] = event;
  else history.push(event);
  return {
    ...previous,
    ...value,
    history: history.slice(-1000),
    firstAttempt: previous.firstAttempt || event,
  };
}
export function learningEvidence(
  progress: Record<string, any>,
  answers: Record<string, any>[],
  chapters: number,
  questions: number,
) {
  return {
    opened: !!progress.openedAt || !!progress.done || !!progress.read?.length,
    readingStarted: !!progress.read?.length,
    readingCompleted:
      chapters > 0 && new Set(progress.read || []).size >= chapters,
    exercisesAttempted: answers.filter((a) =>
      ["good", "again", "partial"].includes(a.rating),
    ).length,
    exercisesCompleted:
      questions > 0 &&
      answers.filter((a) => ["good", "again", "partial"].includes(a.rating))
        .length >= questions,
    legacyCompletion: !!progress.done && !progress.completionVersion,
    assessmentPassed: false,
    consolidated: false,
  };
}

/* ------------------------------------------------------------------------ */
/* Automatic correction of open answers (translations, short productions).  */
/* ------------------------------------------------------------------------ */

/** Italian words that never decide whether a translation is right. */
const STOP = new Set(
  ("il lo la i gli le l un uno una un' di a da in con su per tra fra e ed o od ma " +
    "del dello della dei degli delle dell al allo alla ai agli alle all dal dallo dalla dai dagli dalle dall " +
    "nel nello nella nei negli nelle nell sul sullo sulla sui sugli sulle sull d c ci si ne che " +
    "cui come anche pure molto")
    .split(" "),
);
const ARABIC_WORD = /[\u0621-\u064A\u0671\u067E\u0686\u06A4\u06AF][\u0621-\u0652\u0670\u0671\u067E\u0686\u06A4\u06AF\u0640]*/gu;
const LATIN_WORD = /[\p{Script=Latin}ʿʾ][\p{Script=Latin}\p{M}ʿʾ]*/gu;

type Token = { shown: string; key: string; arabic: boolean };
/** Arabic: letters only, with the spellings learners confuse folded together.
 * Italian: lower case, no accents, articles and prepositions dropped, the
 * ending removed so that gender and number do not decide. */
function tokens(text: string): Token[] {
  const s = canonical(text);
  const out: Token[] = [];
  for (const m of s.matchAll(ARABIC_WORD)) out.push({ shown: m[0], key: loose(m[0]), arabic: true });
  for (const m of s.matchAll(LATIN_WORD)) {
    const folded = latinFold(m[0]);
    if (!folded || STOP.has(folded)) continue;
    const key = folded.length > 4 ? folded.replace(/[aeiou]+$/u, "") : folded;
    out.push({ shown: m[0], key, arabic: false });
  }
  return out;
}
/** Proclitics written together with the next word: wa-, fa-, bi-, li-, ka-, al-. */
const bareStem = (k: string) => k.replace(/^(?:و|ف)?(?:ب|ل|ك)?(?:ال|ل)?/u, "");
function editDistanceAtMostOne(a: string, b: string) {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0, j = 0, edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (b.length > a.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}
/** How well a typed word stands for a reference word: 1 same, less for small slips. */
function similarity(t: Token, r: Token) {
  if (t.arabic !== r.arabic) return 0;
  if (t.key === r.key) return 1;
  if (t.arabic) {
    const a = bareStem(t.key), b = bareStem(r.key);
    if (a.length >= 2 && a === b) return 0.75; // article or conjunction left out / added
    if (r.key.length >= 5 && editDistanceAtMostOne(t.key, r.key)) return 0.5;
    return 0;
  }
  if (r.key.length >= 5 && editDistanceAtMostOne(t.key, r.key)) return 0.75; // typo
  return 0;
}

/** Splits a model answer into what must be there and what may be there:
 * notes in brackets, alternatives after «/» inside quotes and «(o …)» are optional. */
export function referenceParts(model: string) {
  let s = model.normalize("NFKC").replace(/[\u200E\u200F\u2066-\u2069]/gu, "").replace(/\s+/gu, " ");
  const allowed: string[] = [];
  // bracketed notes and alternatives
  s = s.replace(/\(([^()]*)\)/gu, (_, inner: string) => {
    allowed.push(inner);
    return " ";
  });
  // inside quotes, «a / b» offers alternatives: the first is required
  s = s.replace(/«([^»]*)»/gu, (_, inner: string) => {
    const [first, ...rest] = inner.split(/\s\/\s/u);
    allowed.push(...rest);
    return " " + first + " ";
  });
  return { required: s.replace(/\s+/gu, " ").trim(), allowed: allowed.join(" ") };
}

/** Free writing and comprehension answers are too open for a word-by-word verdict. */
const FREE_TASK = /\b(?:scrivi (?:un|una|il|la|due|tre|\d)|descrivi|racconta|riassumi|prepara|presenta|riscrivi il testo|componi|redigi|argomenta|commenta|rispondi alle domande|immagina)\b/i;
const MAX_REQUIRED = 18;
const NEGATION = new Set(["non", "nessun", "nessuna", "nessuno", "mai", "nie", "لا", "لم", "لن", "ليس", "ليست", "ما", "غير"]);

/** Word-by-word comparison with a reference answer. */
export function compareWithReference(text: string, ref: { required: string; allowed?: string }): Grade {
  const typed = tokens(text);
  const required = tokens(ref.required);
  const optional = tokens(ref.allowed || "");
  if (!required.length || !typed.length) return { rating: "model" };
  // compare in the script of the reference when the learner wrote in it
  const used = new Set<number>();
  let got = 0;
  const missing: string[] = [];
  const near: string[] = [];
  for (const r of required) {
    let best = -1, score = 0;
    typed.forEach((t, i) => {
      if (used.has(i)) return;
      const v = similarity(t, r);
      if (v > score) { score = v; best = i; }
    });
    if (best >= 0) { used.add(best); got += score; }
    if (score === 0) missing.push(r.shown);
    else if (score < 1) near.push("«" + typed[best].shown + "» invece di «" + r.shown + "»");
  }
  const extra = typed
    .filter((t, i) => !used.has(i) && !optional.some((o) => similarity(t, o) >= 0.75) && !required.some((r) => similarity(t, r) >= 0.75))
    .map((t) => t.shown);
  const recall = got / required.length;
  const precision = (typed.length - extra.length) / typed.length;
  const list = (ws: string[]) => ws.slice(0, 4).map((w) => "«" + w + "»").join(", ") + (ws.length > 4 ? "…" : "");
  const details: string[] = [];
  if (near.length) details.push(near.slice(0, 3).join(", "));
  if (missing.length) details.push("rispetto al modello manca " + list(missing));
  if (extra.length) details.push("in più c'è " + list(extra));
  const why = details.length ? details.join("; ") + "." : "";
  const whole = required.length <= 2 ? recall === 1 : recall >= 0.9;
  // a missing negation turns the meaning upside down
  const lostNegation = required.some((r) => NEGATION.has(r.key) && missing.includes(r.shown));
  if (whole && precision >= 0.75 && !lostNegation)
    return {
      rating: "good",
      note: "Correzione automatica: corrisponde alla risposta di riferimento." + (why ? " Controlla comunque: " + why : ""),
      missing,
      extra,
    };
  if (recall >= 0.5 && precision >= 0.4)
    return { rating: "partial", note: "Correzione automatica: quasi, " + why, missing, extra };
  return {
    rating: "again",
    note: "Correzione automatica: la tua risposta è diversa dal modello" + (why ? ": " + why : ".") +
      " Se hai scritto una forma diversa ma corretta, segnalala qui sotto.",
    missing,
    extra,
  };
}

/** Open answers: automatic verdict when the reference is short, otherwise a
 * word-coverage hint and the learner's own judgement. */
export function gradeOpen(q: Gradable, text: string, instruction = ""): Grade {
  if (!text.trim()) return { rating: "empty" };
  const model = q.answers?.[0] || q.model || "";
  if (!model.trim()) return { rating: "model" };
  const ref = q.answers?.length ? { required: q.answers[0], allowed: q.model || "" } : referenceParts(model);
  const required = tokens(ref.required);
  const free = FREE_TASK.test(instruction + " " + (q.prompt || ""));
  if (free || required.length > MAX_REQUIRED) {
    const typed = tokens(text);
    const found = required.filter((r) => typed.some((t) => similarity(t, r) >= 0.75));
    const keys = new Set(required.map((r) => r.key)).size;
    return {
      rating: "model",
      note: required.length
        ? `Risposta libera: hai usato ${new Set(found.map((r) => r.key)).size} delle ${keys} parole chiave del modello. Leggi il modello e valuta tu.`
        : undefined,
    };
  }
  // the learner answered in the other language (e.g. only the Italian gloss)
  const typedArabic = tokens(text).some((t) => t.arabic);
  const refArabic = required.some((t) => t.arabic);
  const refLatin = required.some((t) => !t.arabic);
  if (refArabic && refLatin) {
    // «إِعْلَان «annuncio»»: both parts count, but say which one is missing
    return compareWithReference(text, ref);
  }
  if (refArabic && !typedArabic)
    return { rating: "again", note: "Correzione automatica: qui la risposta va scritta in arabo." };
  return compareWithReference(text, ref);
}
