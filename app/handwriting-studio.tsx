import React, { useEffect, useRef, useState } from "react";
import { letters, letterForms } from "../lib/alphabet-data";
import { playArabic } from "../lib/audio";
import { Icon } from "./icons";

type Point = { x: number; y: number };
type Stroke = Point[];
type Mode = "trace" | "copy" | "memory";
type Position = "isolated" | "initial" | "medial" | "final";
const MODES: { id: Mode; label: string; hint: string }[] = [
  { id: "trace", label: "Ricalca", hint: "Ripassa la sagoma con il dito, il mouse o la penna." },
  { id: "copy", label: "Copia", hint: "Guarda il modello nell'angolo e riscrivilo accanto." },
  { id: "memory", label: "A memoria", hint: "Scrivi senza modello, poi controlla." },
];
const POSITIONS: { id: Position; label: string }[] = [
  { id: "isolated", label: "Isolata" },
  { id: "initial", label: "Iniziale" },
  { id: "medial", label: "Mediana" },
  { id: "final", label: "Finale" },
];
const W = 640,
  H = 360;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/** Smooth path through the sampled points (quadratic midpoints). */
function pathFor(points: Stroke) {
  if (!points.length) return "";
  if (points.length === 1) return `M${points[0].x} ${points[0].y}l0.1 0.1`;
  let d = `M${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i],
      b = points[i + 1];
    d += ` Q${a.x.toFixed(1)} ${a.y.toFixed(1)} ${((a.x + b.x) / 2).toFixed(1)} ${((a.y + b.y) / 2).toFixed(1)}`;
  }
  const p = points[points.length - 1];
  return `${d} L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
}

export default function HandwritingStudio({
  data,
  put,
  onAlphabet,
  initialLetter,
}: {
  data: Record<string, any>;
  put: (key: string, value: any) => void;
  onAlphabet: () => void;
  initialLetter?: string;
}) {
  const [index, setIndex] = useState(() =>
    Math.max(0, letters.findIndex((l) => l[0] === initialLetter)),
  );
  const [mode, setMode] = useState<Mode>("trace");
  const [position, setPosition] = useState<Position>("isolated");
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [redo, setRedo] = useState<Stroke[]>([]);
  const [lines, setLines] = useState(true);
  const [peek, setPeek] = useState(false);
  const [message, setMessage] = useState("");
  const board = useRef<SVGSVGElement>(null);
  const pointer = useRef<number | null>(null);
  const letter = letters[index];
  const forms = letterForms(letter[0]);
  const glyph = forms[position];
  const record = data[`writing:${letter[0]}`];
  const practised = letters.filter((l) => data[`writing:${l[0]}`]?.completed).length;
  const modelVisible = mode !== "memory" || peek;
  useEffect(() => {
    setStrokes([]);
    setRedo([]);
    setMessage("");
    setPeek(false);
  }, [index, mode, position]);

  function coordinates(e: React.PointerEvent<SVGSVGElement>): Point {
    const svg = board.current!;
    // getScreenCTM accounts for viewBox scaling, letterboxing and CSS transforms
    const m = svg.getScreenCTM();
    const r = svg.getBoundingClientRect();
    const local = m ? new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()) : null;
    return {
      x: clamp(local?.x ?? ((e.clientX - r.left) / r.width) * W, 0, W),
      y: clamp(local?.y ?? ((e.clientY - r.top) / r.height) * H, 0, H),
    };
  }
  function begin(e: React.PointerEvent<SVGSVGElement>) {
    if (pointer.current !== null || e.button !== 0) return;
    e.preventDefault();
    pointer.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setRedo([]);
    setMessage("");
    setStrokes((s) => [...s, [coordinates(e)]]);
  }
  function move(e: React.PointerEvent<SVGSVGElement>) {
    if (pointer.current !== e.pointerId) return;
    e.preventDefault();
    const p = coordinates(e);
    setStrokes((prev) => {
      const last = prev[prev.length - 1];
      if (!last?.length) return prev;
      const q = last[last.length - 1];
      if (Math.hypot(p.x - q.x, p.y - q.y) < 1.2) return prev;
      const copy = prev.slice();
      copy[copy.length - 1] = [...last, p];
      return copy;
    });
  }
  function end(e: React.PointerEvent<SVGSVGElement>) {
    if (pointer.current !== e.pointerId) return;
    pointer.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  }
  const undo = () => {
    if (!strokes.length) return;
    setRedo((r) => [...r, strokes[strokes.length - 1]]);
    setStrokes((s) => s.slice(0, -1));
  };
  const redoLast = () => {
    if (!redo.length) return;
    setStrokes((s) => [...s, redo[redo.length - 1]]);
    setRedo((r) => r.slice(0, -1));
  };
  function finish() {
    if (!strokes.length) {
      setMessage("Scrivi la lettera prima di segnarla come esercitata.");
      return;
    }
    put(`writing:${letter[0]}`, {
      completed: true,
      attempts: (record?.attempts || 0) + 1,
      lastMode: mode,
      updatedAt: new Date().toISOString(),
    });
    put("activity:" + new Date().toLocaleDateString("sv-SE"), true);
    setMessage(mode === "memory" ? "Fatto. Ora confronta con il modello." : "Fatto. Prova la modalità successiva quando ti senti sicuro.");
    if (mode === "memory") setPeek(true);
  }
  async function listen() {
    setMessage("");
    try {
      await playArabic(letter[3], 0.75);
    } catch {
      setMessage("Sul dispositivo non c'è una voce araba: puoi aggiungerla dalle impostazioni della sintesi vocale.");
    }
  }
  const go = (n: number) => setIndex((n + letters.length) % letters.length);

  return (
    <div className="az-writing">
      <header className="az-page-head">
        <div className="az-eyebrow">Scrittura a mano</div>
        <h1>Un tratto alla volta.</h1>
        <p>
          Ricalca, copia e poi scrivi a memoria, in tutte e quattro le posizioni. Si scrive da destra a
          sinistra; i punti si aggiungono alla fine.
        </p>
      </header>

      <div className="az-writing-layout">
        <section className="az-card az-board-card" aria-labelledby="writing-letter">
          <div className="az-board-head">
            <div>
              <div className="az-eyebrow">
                Lettera {index + 1} di {letters.length}
                {record?.completed ? " · già esercitata" : ""}
              </div>
              <h2 id="writing-letter">
                {letter[1]} <span className="az-muted">/{letter[2]}/</span>
              </h2>
            </div>
            <button type="button" className="az-icon-btn" onClick={() => void listen()} aria-label={"Ascolta il nome della lettera " + letter[1]}>
              <Icon name="sound" />
            </button>
          </div>

          <div className="az-segmented" role="group" aria-label="Modalità">
            {MODES.map((m) => (
              <button key={m.id} type="button" aria-pressed={mode === m.id} onClick={() => setMode(m.id)}>
                {m.label}
              </button>
            ))}
          </div>
          <div className="az-segmented az-segmented-small" role="group" aria-label="Posizione nella parola">
            {POSITIONS.map((p) => (
              <button key={p.id} type="button" aria-pressed={position === p.id} onClick={() => setPosition(p.id)}>
                {p.label}
              </button>
            ))}
          </div>
          <p className="az-hint">{MODES.find((m) => m.id === mode)!.hint}</p>

          <div className="az-board">
            <svg
              ref={board}
              viewBox={`0 0 ${W} ${H}`}
              role="img"
              aria-label="Lavagna di scrittura a mano: disegna con il dito, il mouse o la penna"
              onPointerDown={begin}
              onPointerMove={move}
              onPointerUp={end}
              onPointerCancel={end}
            >
              {lines && (
                <g className="az-board-lines">
                  <path d="M20 112H620M20 252H620" />
                  <path d="M20 182H620" strokeDasharray="6 9" />
                </g>
              )}
              {mode === "trace" && (
                <text x={W / 2} y={250} className="az-board-guide" textAnchor="middle" direction="rtl">
                  {glyph}
                </text>
              )}
              <g className="az-board-direction" aria-hidden="true">
                <path d="M600 334H530m12-9-12 9 12 9" />
              </g>
              {strokes.map((s, i) => (
                <path key={i} d={pathFor(s)} className="az-ink" />
              ))}
            </svg>
            {mode !== "trace" && (
              <div className="az-board-model" aria-live="polite">
                {modelVisible ? (
                  <span lang="ar" dir="rtl">
                    {glyph}
                  </span>
                ) : (
                  <button type="button" onClick={() => setPeek(true)}>
                    <Icon name="eye" size={18} /> Mostra
                  </button>
                )}
              </div>
            )}
            {!strokes.length && <span className="az-board-placeholder">Scrivi qui</span>}
          </div>

          <div className="az-board-tools">
            <button type="button" onClick={undo} disabled={!strokes.length}>
              <Icon name="undo" size={18} /> Annulla
            </button>
            <button type="button" onClick={redoLast} disabled={!redo.length}>
              <Icon name="redo" size={18} /> Ripristina
            </button>
            <button
              type="button"
              onClick={() => {
                setStrokes([]);
                setRedo([]);
              }}
              disabled={!strokes.length}
            >
              <Icon name="erase" size={18} /> Cancella
            </button>
            <button type="button" aria-pressed={lines} onClick={() => setLines(!lines)}>
              <Icon name="lines" size={18} /> Righe
            </button>
          </div>
          <div className="az-board-foot">
            <button type="button" className="az-btn az-btn-primary" onClick={finish}>
              <Icon name="check" size={18} /> Segna come esercitata
            </button>
            {message && (
              <p role="status" className="az-board-message">
                {message}
              </p>
            )}
          </div>
        </section>

        <aside className="az-card az-letter-card" aria-label="Scheda della lettera">
          <div className="az-letter-big" lang="ar" dir="rtl">
            {modelVisible ? letter[0] : "؟"}
          </div>
          <div className="az-forms" dir="rtl">
            {POSITIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={position === p.id ? "active" : ""}
                onClick={() => setPosition(p.id)}
              >
                <span lang="ar">{modelVisible ? forms[p.id] : "؟"}</span>
                <small dir="ltr">{p.label}</small>
              </button>
            ))}
          </div>
          <p className="az-small">
            {forms.joins
              ? "Si collega sia alla lettera precedente sia a quella successiva."
              : "Si collega solo alla lettera precedente: all'inizio di parola resta isolata, in mezzo usa la forma finale."}
          </p>
          <div className="az-example">
            <span lang="ar" dir="rtl">
              {letter[4]}
            </span>
            <small>{letter[5]}</small>
          </div>
          <button type="button" className="az-link" onClick={onAlphabet}>
            Apri l'alfabeto interattivo <Icon name="arrow" size={16} />
          </button>
        </aside>
      </div>

      <nav className="az-letter-strip" aria-label="Scegli la lettera" dir="rtl">
        {letters.map((l, i) => (
          <button
            key={l[0]}
            type="button"
            aria-pressed={i === index}
            aria-label={l[1] + (data[`writing:${l[0]}`]?.completed ? ", esercitata" : "")}
            onClick={() => go(i)}
            className={data[`writing:${l[0]}`]?.completed ? "done" : ""}
          >
            <span lang="ar">{l[0]}</span>
          </button>
        ))}
      </nav>
      <p className="az-small az-center">
        {practised} di {letters.length} lettere esercitate · i tratti restano sul dispositivo e non vengono salvati
      </p>
    </div>
  );
}
