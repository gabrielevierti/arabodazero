import React, { useState, useEffect, useRef, lazy, Suspense } from "react";
import OfflineStatus from "./offline-status";
import { Sidebar, MobileBar, sectionOf } from "./navigation";
import CourseHub from "./course-hub";
import StudyDashboard from "./study-dashboard";
import { applyPreferences } from "./preferences";
import { useDialogFocus } from "../lib/use-dialog-focus";
import CourseIndex from "./course-index";
import { routeHash, parseRoute } from "../lib/routing";
import { useProgressStore } from "../lib/use-progress-store";
import { useCloudSync } from "../lib/use-cloud-sync";
import { LEVELS, LEVEL_NAMES, MAIN_TRACKS, levelOf, type Level } from "../lib/levels";
import { PracticeHub, ErrorReview } from "./learning-hub";
import { errorQueue, nextReview } from "../lib/learning";
import { useStudyTime } from "../lib/use-study-time";
import { requestPersistence } from "../lib/persistence";
import { Icon } from "./icons";
import metadata from "../data/study-metadata.json";

const BookLibrary = lazy(() => import("./book-library"));
const Alphabet = lazy(() => import("./alphabet"));
const Progress = lazy(() => import("./progress"));
const GuidedSession = lazy(() => import("./guided-session"));
const HandwritingStudio = lazy(() => import("./handwriting-studio"));
const SettingsPage = lazy(() => import("./settings-page"));
const LessonDecks = lazy(() => import("./lesson-decks"));
const NativeCourse = lazy(() => import("./native-course"));
const NativeResource = lazy(() =>
  import("./native-course").then((m) => ({ default: m.NativeResource })),
);

const levels: readonly string[] = LEVELS;
const day = () => new Date().toLocaleDateString("sv-SE");
const normalize = (s: string) =>
  s
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, " ");
/** Views where the active study timer runs. */
const STUDY_VIEWS = ["lesson", "alphabet", "writing", "review", "flashcards"];

export default function App() {
  return <CourseIndex>{(course) => <Academy course={course} />}</CourseIndex>;
}
/** Level names with soft hyphens, so a long word breaks cleanly in a narrow box ("Alfabetiz-zazione"). */
const SOFT_BREAKS: Record<string, string> = {
  // the only word longer than the narrowest box (3 columns on a 360px phone)
  Alfabetizzazione: "Alfa\u00ADbetiz\u00ADzazione",
};
const tabLabel = (name = "") => name.replace(/\p{L}+/gu, (w) => SOFT_BREAKS[w] || w);
function SectionLoading() {
  return (
    <section className="az-loading" role="status" aria-live="polite">
      <span className="az-eyebrow">Arabo da Zero</span>
      <h2>Un attimo…</h2>
      <div className="az-skeleton" aria-hidden="true" />
      <div className="az-skeleton short" aria-hidden="true" />
    </section>
  );
}
function Academy({ course }: { course: typeof import("../data/course.json") }) {
  const [entryTab, setEntryTab] = useState("learn"),
    [sessionId, setSessionId] = useState(0);
  const [resource, setResource] = useState("");
  const [routeId, setRouteId] = useState("");
  const [view, setViewState] = useState("home"),
    [level, setLevel] = useState("A0"),
    [search, setSearch] = useState(""),
    [selected, setSelected] = useState<any>(null),
    [modal, setModal] = useState(""),
    [notice, setNotice] = useState(""),
    [flip, setFlip] = useState(false),
    [reviewIndex, setReviewIndex] = useState(0),
    [quizAnswer, setQuizAnswer] = useState(""),
    [quizResult, setQuizResult] = useState("");
  const { data, dataRef, loaded, error: storageError, put: putRecord, flush, load, importData } =
    useProgressStore();
  const { cloud, connect, disconnect, syncNow, scheduleCloudSync } = useCloudSync({
    dataRef,
    loaded,
    flush,
    importData,
  });
  const put = (key: string, value: any) => {
    putRecord(key, value);
    scheduleCloudSync();
  };
  useStudyTime(loaded && STUDY_VIEWS.includes(view), data, put);
  const custom = Object.entries(data)
    .filter(([k, v]) => k.startsWith("lesson:") && v)
    .map(([, v]) => v);
  const lessons: any[] = [...course.lessons, ...custom];
  const current =
    lessons.find((l) => l.id === data.last && !l.custom && !data["progress:" + l.id]?.done) ||
    lessons.find((l) => (metadata as any)[l.id]?.core && !data["progress:" + l.id]?.done) ||
    lessons.find((l) => !l.custom) ||
    lessons[0];
  function startSession(review = false) {
    setSessionId((n) => n + 1);
    setView(review ? "error-session" : "session");
    window.scrollTo(0, 0);
  }
  const cards = Object.entries(data)
    .filter(([k, v]) => k.startsWith("card:") && v)
    .map(([key, v]) => ({ ...(v as any), key }));
  const due = cards.filter((c) => !c.due || c.due <= day());
  const errorsDue = loaded ? errorQueue(data).length : 0;
  const customExercises = Object.entries(data)
    .filter(([k, v]) => k.startsWith("quiz:") && v)
    .map(([key, v]) => ({ ...(v as any), key }));
  // Ask the browser to keep the progress once the learner has actually started.
  const askedPersistence = useRef(false);
  useEffect(() => {
    if (!loaded || askedPersistence.current) return;
    if (Object.keys(data).some((k) => k.startsWith("progress:"))) {
      askedPersistence.current = true;
      void requestPersistence();
    }
  }, [loaded, data]);
  function openLesson(l: any, mode = "learn") {
    setEntryTab(mode);
    setSelected(l);
    setViewState("lesson");
    history.pushState(null, "", routeHash({ view: "lesson", id: l.id }));
    put("last", l.id);
    put("progress:" + l.id, {
      ...dataRef.current["progress:" + l.id],
      openedAt: dataRef.current["progress:" + l.id]?.openedAt || new Date().toISOString(),
    });
    put("activity:" + day(), true);
    window.scrollTo(0, 0);
  }
  function progress(p: any) {
    put("progress:" + selected.id, { ...dataRef.current["progress:" + selected.id], ...p });
    put("activity:" + day(), true);
  }
  const activeCard = due[reviewIndex % Math.max(1, due.length)];
  function review(rating: string) {
    if (!activeCard) return;
    const previous = activeCard.schedule || {
      due: activeCard.due,
      interval: activeCard.interval,
      successes: 0,
    };
    const schedule = nextReview(previous, rating);
    put(activeCard.key, {
      ...activeCard,
      key: undefined,
      schedule,
      interval: schedule.interval,
      due: schedule.due,
      reviews: (activeCard.reviews || 0) + 1,
    });
    put("activity:" + day(), true);
    setFlip(false);
    setReviewIndex(0);
  }
  function submitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      id = Array.from(crypto.getRandomValues(new Uint32Array(4)), (n) =>
        n.toString(16).padStart(8, "0"),
      ).join("");
    if (modal === "card")
      put("card:" + id, {
        front: f.get("front"),
        back: f.get("back"),
        level: f.get("level"),
        due: day(),
        interval: 0,
      });
    if (modal === "lesson")
      put("lesson:" + id, {
        id: "custom-" + id,
        code: "PERSONALE",
        level: f.get("level"),
        title: f.get("title"),
        content: f.get("content"),
        exercises: [],
        sections: [],
        custom: true,
      });
    if (modal === "quiz")
      put("quiz:" + id, {
        question: f.get("front"),
        answer: f.get("back"),
        level: f.get("level"),
      });
    setModal("");
    setNotice(modal === "card" ? "Flashcard aggiunta al ripasso." : "Aggiunta al tuo corso.");
  }
  useDialogFocus(!!modal, () => setModal(""));
  useEffect(() => {
    const update = () => applyPreferences(data.preferences || {});
    update();
    const media = matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [data.preferences]);
  const routeData = useRef({ lessons, loaded });
  routeData.current = { lessons, loaded };
  /** Navigates by hash so that back/forward and shared links work. */
  function setView(v: string) {
    const [name, arg] = v.split("/");
    const hash = routeHash(
      name === "course" ? { view: name, level: arg } : arg ? { view: name, id: arg } : { view: name },
    );
    if (location.hash !== hash) location.hash = hash;
    else setViewState(name);
  }
  useEffect(() => {
    const update = () => {
      const r = parseRoute(location.hash);
      if (r.view === "lesson") {
        const l = routeData.current.lessons.find((l) => l.id === r.id);
        if (l) setSelected(l);
        else if (routeData.current.loaded) {
          setViewState("missing");
          return;
        }
      }
      if (r.view === "resource") setResource(r.id || "");
      setRouteId(r.id || "");
      if (r.level && levels.includes(r.level)) setLevel(r.level);
      setViewState(r.view === "micro" ? "course" : r.view);
      setSearch("");
      requestAnimationFrame(() => {
        document.getElementById("main-content")?.focus({ preventScroll: true });
        window.scrollTo(0, 0);
      });
    };
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, [course, loaded]);
  // the course list follows the level of the lesson in progress
  const levelChosen = useRef(false);
  useEffect(() => {
    if (loaded && !levelChosen.current && !parseRoute(location.hash).level) {
      levelChosen.current = true;
      setLevel(levelOf(current));
    }
  }, [loaded]);
  const badges = { review: errorsDue + due.length };
  const levelLessons = lessons.filter((l) => levelOf(l) === level);
  const shown = levelLessons.filter((l) =>
    normalize(l.title + " " + l.code).includes(normalize(search)),
  );
  const mainTrack = shown.filter((l) => !l.custom && (!l.track || MAIN_TRACKS.includes(l.track)));
  const sideTrack = shown.filter((l) => !l.custom && l.track && !MAIN_TRACKS.includes(l.track));
  const personal = shown.filter((l) => l.custom);
  const lessonRow = (l: any, i: number) => {
    const p = data["progress:" + l.id];
    const read = p?.read?.length || 0;
    const pct = l.nativeChapters ? Math.round((read / l.nativeChapters) * 100) : 0;
    return (
      <li key={l.id}>
        <button
          type="button"
          className={"az-lesson" + (p?.done ? " done" : p ? " started" : "") + (l.id === current.id ? " current" : "")}
          disabled={!loaded}
          onClick={() => openLesson(l)}
        >
          <span className="az-lesson-num" aria-hidden="true">
            {p?.done ? <Icon name="check" size={18} /> : String(i + 1).padStart(2, "0")}
          </span>
          <span className="az-lesson-body">
            <small>
              {l.code}
              {l.id === current.id ? " · prossima" : ""}
            </small>
            <strong>{l.title}</strong>
            <span className="az-lesson-meta">
              {l.custom
                ? "Lezione personale"
                : `${l.nativeChapters || 0} passaggi · ${l.nativeItems || 0} esercizi`}
            </span>
          </span>
          <span className="az-lesson-state">
            {p?.done ? (
              "Completata"
            ) : p ? (
              <>
                <i aria-hidden="true">
                  <b style={{ width: Math.max(6, pct) + "%" }} />
                </i>
                {pct}%
              </>
            ) : (
              ""
            )}
          </span>
          <Icon name="arrow" size={18} className="az-lesson-arrow" />
        </button>
      </li>
    );
  };
  const section = sectionOf(view);
  return (
    <div className={"az-shell view-" + view}>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Vai al contenuto
      </a>
      <Sidebar view={view} navigate={setView} badges={badges} />
      <MobileBar view={view} navigate={setView} badges={badges} />
      <main className="az-main">
        <div className={"az-content section-" + section} id="main-content" tabIndex={-1}>
          <OfflineStatus flush={flush} />
          {storageError && (
            <div className="az-notice warning" role="alert">
              {storageError}
              <button
                className="az-btn az-btn-outline az-btn-small"
                onClick={() => {
                  void (loaded ? flush() : load()).catch(() => {});
                }}
              >
                Riprova il salvataggio
              </button>
            </div>
          )}
          {notice && (
            <div className="az-notice" role="status">
              {notice}
              <button className="az-icon-btn" onClick={() => setNotice("")} aria-label="Chiudi avviso">
                <Icon name="close" size={18} />
              </button>
            </div>
          )}
          <Suspense fallback={<SectionLoading />}>
            {view === "missing" && (
              <div className="az-card az-empty">
                <h1>Pagina non trovata</h1>
                <p>Il collegamento non corrisponde a nessuna lezione.</p>
                <button className="az-btn az-btn-primary" onClick={() => setView("course")}>
                  Apri il corso
                </button>
              </div>
            )}
            {view === "home" && (
              <StudyDashboard
                data={data}
                lessons={lessons}
                current={current}
                loaded={loaded}
                dueCards={due.length}
                onOpen={(l) => openLesson(l)}
                onStudy={() => startSession()}
                navigate={setView}
                put={put}
              />
            )}
            {view === "alphabet" && loaded && (
              <Alphabet data={data} put={put} onWrite={(letter) => setView("writing/" + letter)} />
            )}
            {view === "writing" && loaded && (
              <HandwritingStudio
                key={routeId}
                data={data}
                put={put}
                initialLetter={routeId}
                onAlphabet={() => setView("alphabet")}
              />
            )}
            {["session", "error-session"].includes(view) && loaded && (
              <GuidedSession
                key={sessionId}
                onRestart={() => startSession()}
                review={view === "error-session"}
                data={data}
                put={put}
                lessons={lessons}
                current={current}
                onExit={() => setView("home")}
                onFlashcard={() => setModal("card")}
              />
            )}
            {view === "course" && (
              <>
                <CourseHub
                  data={data}
                  lessons={lessons}
                  current={current}
                  loaded={loaded}
                  onResume={() => openLesson(current)}
                  onStudy={() => startSession()}
                />
                <div className="az-course-tools">
                  <div className="az-level-tabs" role="tablist" aria-label="Livello">
                    {levels.map((l) => (
                      <button
                        role="tab"
                        aria-selected={l === level}
                        className={l === level ? "active" : ""}
                        key={l}
                        onClick={() => {
                          setLevel(l);
                          history.replaceState(null, "", routeHash({ view: "course", level: l }));
                        }}
                      >
                        <strong>{l}</strong>
                        <span>{tabLabel(LEVEL_NAMES[l as Level])}</span>
                      </button>
                    ))}
                  </div>
                  <label className="az-search">
                    <Icon name="search" size={18} />
                    <input
                      type="search"
                      aria-label="Cerca una lezione"
                      placeholder="Cerca una lezione…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </label>
                </div>
                <div className="az-level-head">
                  <h2>
                    {level} · {LEVEL_NAMES[level as Level] || ""}
                  </h2>
                  <span className="az-muted">
                    {levelLessons.filter((l) => data["progress:" + l.id]?.done).length} di{" "}
                    {levelLessons.length} completate
                  </span>
                </div>
                {mainTrack.length > 0 && <ol className="az-lessons">{mainTrack.map(lessonRow)}</ol>}
                {sideTrack.length > 0 && (
                  <>
                    <h3 className="az-track-title">Tracce complementari</h3>
                    <p className="az-small">Dialetti e approfondimenti: affiancali al percorso principale quando vuoi.</p>
                    <ol className="az-lessons">{sideTrack.map(lessonRow)}</ol>
                  </>
                )}
                {personal.length > 0 && (
                  <>
                    <h3 className="az-track-title">Le tue lezioni</h3>
                    <ol className="az-lessons">{personal.map(lessonRow)}</ol>
                  </>
                )}
                {!shown.length && (
                  <div className="az-card az-empty">
                    <p>Nessuna lezione corrisponde alla ricerca.</p>
                  </div>
                )}
                <div className="az-course-foot">
                  <button className="az-link" disabled={!loaded} onClick={() => setModal("lesson")}>
                    <Icon name="plus" size={16} /> Crea una lezione personale
                  </button>
                  <button className="az-link" onClick={() => setView("practice")}>
                    Solo esercizi, lezione per lezione <Icon name="arrow" size={16} />
                  </button>
                </div>
              </>
            )}
            {view === "lesson" && selected && !selected.custom && (
              <NativeCourse
                entryTab={entryTab}
                key={selected.id + entryTab}
                lesson={selected}
                data={data}
                put={put}
                onBack={() => {
                  setView("course/" + levelOf(selected));
                }}
                onNext={() => {
                  const next = lessons[lessons.findIndex((l) => l.id === selected.id) + 1];
                  if (next) openLesson(next);
                  else setView("stats");
                }}
                onFlashcard={() => setModal("card")}
              />
            )}
            {view === "lesson" && selected?.custom && (
              <div className="az-custom-lesson">
                <button className="az-back" onClick={() => setView("course")}>
                  <Icon name="back" size={18} /> Torna al corso
                </button>
                <header className="az-page-head az-row-between">
                  <div>
                    <div className="az-eyebrow">Lezione personale · {levelOf(selected)}</div>
                    <h1>{selected.title}</h1>
                  </div>
                  <button
                    className="az-btn az-btn-primary"
                    onClick={() => progress({ done: !data["progress:" + selected.id]?.done })}
                  >
                    {data["progress:" + selected.id]?.done ? "Completata · annulla" : "Segna come completata"}
                  </button>
                </header>
                <article className="az-card custom-text">{selected.content}</article>
                <div className="az-card notes">
                  <h2 className="az-card-title">Appunti</h2>
                  <textarea
                    aria-label="Appunti della lezione"
                    value={data["note:" + selected.id] || ""}
                    onChange={(e) => put("note:" + selected.id, e.target.value)}
                  />
                </div>
              </div>
            )}
            {view === "resource" && (
              <NativeResource key={resource} id={resource} onBack={() => setView("library")} />
            )}
            {(view === "review" || view === "flashcards") && loaded && (
              <div className="az-review">
                <header className="az-page-head">
                  <div className="az-eyebrow">Ripasso</div>
                  <h1>Quello che ripassi, resta.</h1>
                  <p>
                    Gli errori degli esercizi e le parole delle lezioni tornano qui a intervalli sempre più
                    lunghi.
                  </p>
                </header>
                <div className="az-review-grid">
                  <ErrorReview data={data} lessons={lessons} onStart={() => startSession(true)} />
                  <section className="az-card az-flash" aria-labelledby="flash-title">
                    <div className="az-row-between">
                      <h2 id="flash-title" className="az-card-title">
                        <Icon name="cards" /> Flashcard
                      </h2>
                      <span className="az-muted">
                        {due.length} da ripassare · {cards.length} nel mazzo
                      </span>
                    </div>
                    {activeCard ? (
                      <div className="review-wrap">
                        <div
                          className={"flashcard" + (flip ? " flipped" : "")}
                          onClick={() => setFlip(!flip)}
                          role="button"
                          tabIndex={0}
                          aria-label={flip ? "Risposta: tocca per tornare alla domanda" : "Tocca per vedere la risposta"}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setFlip(!flip);
                            }
                          }}
                        >
                          <span className="az-eyebrow">
                            {levelOf(activeCard)} · {flip ? "Risposta" : "Ricordi?"}
                          </span>
                          <div dir="auto" lang={/[\u0600-\u06FF]/.test(flip ? activeCard.back : activeCard.front) ? "ar" : undefined}>
                            {flip ? activeCard.back : activeCard.front}
                          </div>
                          <small>{flip ? "Com'è andata?" : "Tocca per girare"}</small>
                        </div>
                        {flip && (
                          <div className="az-rate">
                            <button className="again" onClick={() => review("again")}>
                              Di nuovo<small>oggi</small>
                            </button>
                            <button className="hard" onClick={() => review("hard")}>
                              Difficile
                            </button>
                            <button className="good" onClick={() => review("good")}>
                              Ricordata
                            </button>
                            <button className="easy" onClick={() => review("easy")}>
                              Facile
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="az-empty-line">
                        {cards.length
                          ? "Sei in pari: le prossime carte arriveranno alla data prevista."
                          : "Il mazzo è vuoto. Aggiungi le parole delle lezioni qui sotto, o crea una carta tua."}
                      </p>
                    )}
                    <button className="az-link" disabled={!loaded} onClick={() => setModal("card")}>
                      <Icon name="plus" size={16} /> Nuova flashcard
                    </button>
                  </section>
                </div>
                <LessonDecks lessons={lessons} data={data} put={put} />
                {cards.length > 0 && (
                  <details className="az-card az-deck-list">
                    <summary>Tutte le carte del mazzo · {cards.length}</summary>
                    <ul>
                      {cards.map((c) => (
                        <li key={c.key}>
                          <b dir="auto" lang={/[\u0600-\u06FF]/.test(c.front) ? "ar" : undefined}>
                            {c.front}
                          </b>
                          <span dir="auto">{c.back}</span>
                          <small>{c.due}</small>
                          <button
                            className="az-link danger"
                            onClick={() => {
                              if (confirm("Eliminare questa flashcard?")) put(c.key, null);
                            }}
                          >
                            Elimina
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}
            {view === "practice" && loaded && (
              <>
                <PracticeHub
                  lessons={lessons}
                  data={data}
                  onOpen={(l) => openLesson(l, "practice")}
                  onReview={() => setView("review")}
                />
                {customExercises.length > 0 && (
                  <details className="personal-exercises az-card">
                    <summary>I tuoi esercizi personali · {customExercises.length}</summary>
                    {customExercises.map((q) => (
                      <div className="az-card quiz" key={q.key}>
                        <span className="az-eyebrow">{levelOf(q)} · risposta breve</span>
                        <h2 dir="auto">{q.question}</h2>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const a = String(new FormData(e.currentTarget).get("answer"));
                            const ok = normalize(a) === normalize(q.answer);
                            put("answer:" + q.key, { text: a, rating: ok ? "good" : "again" });
                            put("activity:" + day(), true);
                            setQuizResult(q.key);
                            setQuizAnswer(ok ? "Corretto." : "Risposta attesa: " + q.answer);
                          }}
                        >
                          <input name="answer" dir="auto" aria-label="La tua risposta" placeholder="La tua risposta…" required />
                          <button className="az-btn az-btn-primary">Verifica</button>
                        </form>
                        {quizResult === q.key && (
                          <p role="status" className="quiz-result">
                            {quizAnswer}
                          </p>
                        )}
                        <button
                          className="az-link danger"
                          onClick={() => {
                            if (confirm("Eliminare questo esercizio?")) put(q.key, null);
                          }}
                        >
                          Elimina esercizio
                        </button>
                      </div>
                    ))}
                  </details>
                )}
              </>
            )}
            {view === "stats" && loaded && (
              <Progress data={data} lessons={lessons} onStudy={() => startSession()} />
            )}
            {view === "library" && (
              <BookLibrary
                books={course.books}
                lessons={lessons}
                data={data}
                put={put}
                onLesson={(id) => {
                  const l = lessons.find((l) => l.id === id);
                  if (l) openLesson(l);
                }}
                onResource={(id) => {
                  setResource(id);
                  setViewState("resource");
                  location.hash = routeHash({ view: "resource", id });
                  window.scrollTo(0, 0);
                }}
              />
            )}
            {view === "settings" && (
              <SettingsPage
                data={data}
                put={put}
                loaded={loaded}
                importData={importData}
                cloud={cloud}
                connectCloud={connect}
                disconnectCloud={disconnect}
                syncCloud={syncNow}
              />
            )}
          </Suspense>
        </div>
        <footer className="az-footer">
          <span>
            <strong>Arabo da Zero</strong> · gratuito e open source
          </span>
          <span>
            © {new Date().getFullYear()} Gabriele Vierti ·{" "}
            <a href="https://github.com/gabrielevierti/arabic-academy" target="_blank" rel="noopener noreferrer">
              Codice e segnalazioni su GitHub
            </a>
          </span>
        </footer>
      </main>
      {modal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModal("");
          }}
        >
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <button className="close az-icon-btn" aria-label="Chiudi" onClick={() => setModal("")}>
              <Icon name="close" size={18} />
            </button>
            <div className="az-eyebrow">Personalizza il corso</div>
            <h2 id="modal-title">
              {modal === "card" ? "Nuova flashcard" : modal === "lesson" ? "Una lezione tutta tua" : "Nuovo esercizio"}
            </h2>
            <form onSubmit={submitForm}>
              <label>
                Livello
                <select name="level" defaultValue={levelOf(selected || {}) || level}>
                  {levels.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </label>
              {modal === "lesson" ? (
                <>
                  <label>
                    Titolo
                    <input name="title" required maxLength={200} placeholder="Che cosa vuoi imparare?" />
                  </label>
                  <label>
                    Contenuto della lezione
                    <textarea name="content" dir="auto" required maxLength={50000} placeholder="Spiegazioni, esempi e riferimenti…" />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    {modal === "card" ? "Fronte · parola o domanda" : "Domanda"}
                    <textarea name="front" dir="auto" required maxLength={3000} />
                  </label>
                  <label>
                    {modal === "card" ? "Retro · significato o risposta" : "Risposta attesa"}
                    <textarea name="back" dir="auto" required maxLength={3000} />
                  </label>
                </>
              )}
              <button className="az-btn az-btn-primary az-btn-block" type="submit">
                <Icon name="plus" size={18} /> Aggiungi
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
