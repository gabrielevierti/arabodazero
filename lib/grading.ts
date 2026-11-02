export type NormalizationPolicy =
  "choice-id" | "arabic-vocalized" | "arabic-unvocalized" | "text";
export type Gradable = {
  mode: string;
  answers?: string[];
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
export type Grade = { rating: Rating; note?: string };

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
  if (q.mode === "open" || !q.answers?.length) return { rating: "model" };
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
      consider({
        rating: "model",
        note: "Una frase si può scrivere in più modi: confronta la tua con il modello.",
      });
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
