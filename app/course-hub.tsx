import metadata from "../data/study-metadata.json";
import { levelOf } from "../lib/levels";
import { Icon } from "./icons";

type Lesson = { id: string; title: string; level: string; code: string; custom?: boolean };

/** Head of the course page: where you are and the one button that matters. */
export default function CourseHub({
  data,
  lessons,
  current,
  loaded,
  onResume,
  onStudy,
}: {
  data: Record<string, any>;
  lessons: Lesson[];
  current: Lesson;
  loaded: boolean;
  onResume: () => void;
  onStudy: () => void;
}) {
  const core = lessons.filter((l) => (metadata as Record<string, { core?: boolean }>)[l.id]?.core);
  const complete = core.filter((l) => data["progress:" + l.id]?.done).length;
  const percent = core.length ? Math.round((complete / core.length) * 100) : 0;
  return (
    <section className="az-course-head">
      <header className="az-page-head">
        <div className="az-eyebrow">Il corso · dall'alfabeto al C1</div>
        <h1>Arabo standard moderno, spiegato in italiano.</h1>
        <p>
          Sei volumi, una lezione alla volta. Le lezioni principali seguono un ordine; le tracce
          complementari (egiziano, darija, approfondimenti) si aggiungono quando vuoi.
        </p>
      </header>
      <div className="az-course-strip">
        <div className="az-course-next">
          <span className="az-level-pill az-level-pill-soft">{levelOf(current)}</span>
          <div>
            <small>Prossimo passo</small>
            <strong>{current.title}</strong>
          </div>
          <button type="button" className="az-btn az-btn-primary" disabled={!loaded} onClick={onResume}>
            Continua <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="az-course-total">
          <strong>{percent}%</strong>
          <div>
            <i
              role="progressbar"
              aria-label="Lezioni principali completate"
              aria-valuemin={0}
              aria-valuemax={core.length}
              aria-valuenow={complete}
            >
              <b style={{ width: percent + "%" }} />
            </i>
            <small>
              {complete} di {core.length} lezioni principali
            </small>
          </div>
          <button type="button" className="az-btn az-btn-outline" disabled={!loaded} onClick={onStudy}>
            <Icon name="play" size={16} /> Sessione guidata · {data.goal || 15} min
          </button>
        </div>
      </div>
    </section>
  );
}
