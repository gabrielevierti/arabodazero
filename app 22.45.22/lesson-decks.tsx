import { useEffect, useState } from "react";
import { loadStudyIndex, type VocabularyEntry } from "../lib/vocabulary";
import { deckRecords, lessonDeck } from "../lib/vocabulary-deck";
import { localDay } from "../lib/learning";
import { levelOf } from "../lib/levels";
import { Icon } from "./icons";

type Lesson = { id: string; title: string; level: string; code: string; custom?: boolean };
const cache = new Map<string, Promise<VocabularyEntry[]>>();
export function vocabularyFor(level: string) {
  if (!cache.has(level))
    cache.set(
      level,
      loadStudyIndex<VocabularyEntry[]>("it", level, "vocabulary").catch((e) => {
        cache.delete(level);
        throw e;
      }),
    );
  return cache.get(level)!;
}

/** Adds the words of one lesson to the spaced-repetition deck. */
export function AddLessonWords({
  lesson,
  data,
  put,
  compact = false,
}: {
  lesson: Lesson;
  data: Record<string, any>;
  put: (k: string, v: any) => void;
  compact?: boolean;
}) {
  const [entries, setEntries] = useState<VocabularyEntry[] | null>(null);
  useEffect(() => {
    let live = true;
    vocabularyFor(levelOf(lesson))
      .then((e) => live && setEntries(e))
      .catch(() => live && setEntries([]));
    return () => {
      live = false;
    };
  }, [lesson.id]);
  if (!entries) return null;
  const deck = lessonDeck(entries, lesson.id);
  if (!deck.length) return null;
  const missing = deck.filter((c) => !data[c.key]).length;
  return (
    <div className={"az-deck-row" + (compact ? " compact" : "")}>
      <div>
        <strong>{compact ? "Parole di questa lezione" : lesson.title}</strong>
        <small>
          {lesson.code} · {deck.length} {deck.length === 1 ? "parola" : "parole"}
        </small>
      </div>
      {missing ? (
        <button
          type="button"
          className="az-btn az-btn-outline az-btn-small"
          onClick={() => {
            for (const [k, v] of Object.entries(deckRecords(deck, data, localDay()))) put(k, v);
          }}
        >
          <Icon name="plus" size={16} />
          {missing === deck.length ? "Aggiungi al ripasso" : `Aggiungi le ${missing} nuove`}
        </button>
      ) : (
        <span className="az-chip az-chip-ok">
          <Icon name="check" size={16} /> Nel ripasso
        </span>
      )}
    </div>
  );
}

/** Lessons already opened, newest first, with their word decks. */
export default function LessonDecks({
  lessons,
  data,
  put,
}: {
  lessons: Lesson[];
  data: Record<string, any>;
  put: (k: string, v: any) => void;
}) {
  const opened = lessons
    .filter((l) => !l.custom && data["progress:" + l.id])
    .sort((a, b) =>
      String(data["progress:" + b.id]?.openedAt || "").localeCompare(
        String(data["progress:" + a.id]?.openedAt || ""),
      ),
    )
    .slice(0, 8);
  return (
    <section className="az-card az-decks" aria-labelledby="decks-title">
      <h2 id="decks-title" className="az-card-title">
        Le parole delle tue lezioni
      </h2>
      <p className="az-small">
        Ogni lezione ha il suo lessico. Aggiungilo al ripasso: le parole tornano a intervalli
        sempre più lunghi, finché le ricordi senza sforzo.
      </p>
      {opened.length ? (
        opened.map((l) => <AddLessonWords key={l.id} lesson={l} data={data} put={put} />)
      ) : (
        <p className="az-empty-line">Apri una lezione: il suo lessico comparirà qui.</p>
      )}
    </section>
  );
}
