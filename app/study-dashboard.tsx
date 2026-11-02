import { errorQueue, localDay, streak } from "../lib/learning";
import { LEVELS, LEVEL_NAMES, levelOf, type Level } from "../lib/levels";
import metadata from "../data/study-metadata.json";
import { Icon } from "./icons";

type Lesson = { id: string; title: string; level: string; code: string; custom?: boolean; nativeChapters?: number; nativeItems?: number };
type Props = {
  data: Record<string, any>;
  lessons: Lesson[];
  current: Lesson;
  loaded: boolean;
  dueCards: number;
  onOpen: (lesson: Lesson) => void;
  onStudy: () => void;
  navigate: (view: string) => void;
  put: (key: string, value: any) => void;
};
const core = (l: Lesson) => (metadata as Record<string, { core?: boolean }>)[l.id]?.core;

function greeting(d = new Date()) {
  const h = d.getHours();
  return h < 5 ? "Buonanotte" : h < 13 ? "Buongiorno" : h < 18 ? "Buon pomeriggio" : "Buonasera";
}

/** First visit: three ways in, so nobody who can already read starts from the dots of ب. */
function Onboarding({ lessons, onOpen, navigate, put }: Pick<Props, "lessons" | "onOpen" | "navigate" | "put">) {
  const first = (level: string) => lessons.find((l) => levelOf(l) === level && core(l));
  const choose = (start: "zero" | "reader" | "explore") => {
    put("onboarding", { start, at: new Date().toISOString() });
    if (start === "zero") {
      const l = first("A0");
      if (l) onOpen(l);
    } else if (start === "reader") navigate("alphabet");
    else navigate("course");
  };
  return (
    <section className="az-onboarding" aria-labelledby="onboarding-title">
      <div className="az-eyebrow">Benvenuto</div>
      <h2 id="onboarding-title">Da dove partiamo?</h2>
      <p>Il corso va dall'alfabeto al livello C1. Scegli il punto giusto per te: potrai cambiare quando vuoi.</p>
      <div className="az-onboarding-options">
        <button type="button" onClick={() => choose("zero")}>
          <span className="az-option-glyph" lang="ar" aria-hidden="true">ب</span>
          <strong>Non conosco l'alfabeto</strong>
          <small>Inizia dalla prima lezione: cinque lettere e le vocali brevi.</small>
        </button>
        <button type="button" onClick={() => choose("reader")}>
          <span className="az-option-glyph" lang="ar" aria-hidden="true">كتب</span>
          <strong>So già leggere</strong>
          <small>Fai la verifica delle lettere nell'alfabeto, poi passa all'A1.</small>
        </button>
        <button type="button" onClick={() => choose("explore")}>
          <span className="az-option-glyph" aria-hidden="true">
            <Icon name="course" size={26} />
          </span>
          <strong>Voglio guardarmi intorno</strong>
          <small>Apri il corso e scegli tu livello e lezione.</small>
        </button>
      </div>
    </section>
  );
}

export default function StudyDashboard({ data, lessons, current, loaded, dueCards, onOpen, onStudy, navigate, put }: Props) {
  const goal = data.goal || 15;
  const minutes = Math.floor((data["study:" + localDay()]?.seconds || 0) / 60);
  const goalPercent = Math.min(100, Math.round((minutes / goal) * 100));
  const errors = errorQueue(data).length;
  const days = streak(data);
  const coreLessons = lessons.filter(core);
  const started = Object.keys(data).some((k) => k.startsWith("progress:") || k.startsWith("answer:"));
  const showOnboarding = loaded && !data.onboarding && !started;
  const progress = data["progress:" + current.id] || {};
  const readPercent = current.nativeChapters
    ? Math.round(((progress.read || []).length / current.nativeChapters) * 100)
    : 0;
  const now = new Date();
  const ring = 2 * Math.PI * 26;
  return (
    <div className="az-home">
      <header className="az-home-head">
        <div>
          <div className="az-eyebrow">
            {now.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
          </div>
          <h1>{greeting(now)}.</h1>
        </div>
        {days > 0 && (
          <div className="az-streak" title="Giorni di studio consecutivi">
            <Icon name="flame" size={18} />
            <strong>{days}</strong>
            <span>{days === 1 ? "giorno" : "giorni"} di fila</span>
          </div>
        )}
      </header>

      {showOnboarding ? (
        <Onboarding lessons={lessons} onOpen={onOpen} navigate={navigate} put={put} />
      ) : (
        <div className="az-home-grid">
          <section className="az-resume" aria-labelledby="resume-title">
            <div className="az-resume-top">
              <span className="az-level-pill">{levelOf(current)}</span>
              <span className="az-resume-code">{current.code}</span>
            </div>
            <div className="az-eyebrow az-on-dark">{readPercent ? "Riprendi da qui" : "La tua prossima lezione"}</div>
            <h2 id="resume-title">{current.title}</h2>
            <div className="az-resume-meter" aria-hidden="true">
              <span style={{ width: Math.max(4, readPercent) + "%" }} />
            </div>
            <p className="az-resume-meta">
              {readPercent}% letto · {current.nativeItems || 0} esercizi
            </p>
            <div className="az-resume-actions">
              <button type="button" className="az-btn az-btn-light" disabled={!loaded} onClick={() => onOpen(current)}>
                {readPercent ? "Continua la lezione" : "Inizia la lezione"}
                <Icon name="arrow" size={18} />
              </button>
              <button type="button" className="az-btn az-btn-ghost-light" disabled={!loaded} onClick={() => navigate("course")}>
                Tutte le lezioni
              </button>
            </div>
            <span className="az-resume-art" lang="ar" aria-hidden="true">ع</span>
          </section>

          <section className="az-card az-goal" aria-labelledby="goal-title">
            <div className="az-goal-ring" aria-hidden="true">
              <svg viewBox="0 0 64 64" width="64" height="64">
                <circle cx="32" cy="32" r="26" className="track" />
                <circle cx="32" cy="32" r="26" className="value" strokeDasharray={ring} strokeDashoffset={ring * (1 - goalPercent / 100)} />
              </svg>
              <span>{goalPercent}%</span>
            </div>
            <div>
              <h2 id="goal-title" className="az-card-title">Obiettivo di oggi</h2>
              <p>
                <strong>{minutes}</strong> di {goal} minuti di studio attivo
              </p>
            </div>
            <button type="button" className="az-btn az-btn-outline" disabled={!loaded} onClick={onStudy}>
              <Icon name="play" size={16} />
              {minutes >= goal ? "Continua a studiare" : `Sessione di ${goal} minuti`}
            </button>
          </section>

          <section className="az-card az-due" aria-labelledby="due-title">
            <h2 id="due-title" className="az-card-title">Ripasso di oggi</h2>
            {errors + dueCards ? (
              <>
                <div className="az-due-counts">
                  <div>
                    <strong>{errors}</strong>
                    <span>{errors === 1 ? "risposta da rivedere" : "risposte da rivedere"}</span>
                  </div>
                  <div>
                    <strong>{dueCards}</strong>
                    <span>flashcard</span>
                  </div>
                </div>
                <button type="button" className="az-btn az-btn-primary" onClick={() => navigate("review")}>
                  Ripassa ora <Icon name="arrow" size={18} />
                </button>
              </>
            ) : (
              <p>
                Sei in pari. Gli errori degli esercizi e le parole delle lezioni tornano qui al momento giusto.
              </p>
            )}
          </section>
        </div>
      )}

      <section className="az-section" aria-labelledby="tools-title">
        <h2 id="tools-title" className="az-section-title">Allenamenti brevi</h2>
        <div className="az-tools">
          <button type="button" className="az-tool" onClick={() => navigate("alphabet")}>
            <span className="az-tool-glyph" lang="ar" aria-hidden="true">أ ب ت</span>
            <strong>Alfabeto</strong>
            <small>Forme, suoni e verifica delle 28 lettere</small>
          </button>
          <button type="button" className="az-tool" onClick={() => navigate("writing")}>
            <span className="az-tool-glyph" lang="ar" aria-hidden="true">ج</span>
            <strong>Scrittura a mano</strong>
            <small>Ricalca, copia e scrivi a memoria</small>
          </button>
          <button type="button" className="az-tool" onClick={() => navigate("library")}>
            <span className="az-tool-glyph" aria-hidden="true"><Icon name="library" size={26} /></span>
            <strong>Biblioteca</strong>
            <small>I sei volumi, le tabelle e la ricerca</small>
          </button>
        </div>
      </section>

      <section className="az-section" aria-labelledby="levels-title">
        <div className="az-section-head">
          <h2 id="levels-title" className="az-section-title">Il tuo percorso</h2>
          <button type="button" className="az-link" onClick={() => navigate("stats")}>
            Progressi <Icon name="arrow" size={16} />
          </button>
        </div>
        <ol className="az-levels">
          {LEVELS.map((level) => {
            const ls = coreLessons.filter((l) => levelOf(l) === level);
            const done = ls.filter((l) => data["progress:" + l.id]?.done).length;
            const here = levelOf(current) === level;
            return (
              <li key={level} className={here ? "current" : done && done === ls.length ? "done" : ""}>
                <button type="button" onClick={() => navigate("course/" + level)}>
                  <strong>{level}</strong>
                  <span>{LEVEL_NAMES[level as Level]}</span>
                  <i aria-hidden="true">
                    <b style={{ width: (ls.length ? (done / ls.length) * 100 : 0) + "%" }} />
                  </i>
                  <small>
                    {done}/{ls.length}
                  </small>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}
