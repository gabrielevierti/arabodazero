import type { VocabularyEntry } from "./vocabulary";

/** Flashcards built from the course vocabulary of one lesson. */
export type DeckCard = {
  key: string;
  front: string;
  back: string;
  level: string;
  source: string;
  transliteration?: string;
};

export const vocabCardKey = (entry: VocabularyEntry) => "card:vocab:" + entry.id;

export function lessonDeck(entries: VocabularyEntry[], lessonId: string): DeckCard[] {
  const seen = new Set<string>();
  return entries
    .filter((e) => e.source === lessonId && e.lemma && e.translation)
    .filter((e) => {
      const k = e.lemma.trim();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .map((e) => ({
      key: vocabCardKey(e),
      front: e.lemma.trim(),
      back: e.translation.trim() + (e.transliteration ? " · " + e.transliteration.trim() : ""),
      level: e.level,
      source: e.source,
      transliteration: e.transliteration || undefined,
    }));
}

/** Records to add for a deck: new cards are due today, existing ones keep their schedule. */
export function deckRecords(
  deck: DeckCard[],
  existing: Record<string, unknown>,
  today: string,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of deck)
    if (!existing[c.key])
      out[c.key] = {
        front: c.front,
        back: c.back,
        level: c.level,
        source: c.source,
        due: today,
        interval: 0,
      };
  return out;
}
