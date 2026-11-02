import React, { useEffect, useRef, useState } from "react";
import { letters, letterForms } from "../lib/alphabet-data";
import { playArabic } from "../lib/audio";
import { Icon } from "./icons";

type Point = { x: number; y: number; w: number };
type Stroke = { nib: Nib; points: Point[] };
type Nib = "pen" | "qalam";
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

const NIBS: { id: Nib; label: string; hint: string }[] = [
  { id: "pen", label: "Penna", hint: "Tratto tondo: si assottiglia quando vai veloce e segue la pressione della penna." },
  { id: "qalam", label: "Calamo", hint: "Punta tagliata come il qalam: spessa in orizzontale, sottile in verticale." },
];
/** Half of the stroke at normal speed. */
const PEN_HALF = 3.7;
/** Half of the nib edge and its angle, as a qalam is cut for Arabic. */
const QALAM_HALF = 5.4;
const QALAM_ANGLE = (-52 * Math.PI) / 180;
const QALAM_DX = Math.cos(QALAM_ANGLE),
  QALAM_DY = Math.sin(QALAM_ANGLE);
const n2 = (v: number) => (Math.round(v * 10) / 10).toString();

/** Width of one sample: the faster the thinner, and a real pen follows pressure. */
function sampleWidth(nib: Nib, speed: number, pressure: number) {
  if (nib === "qalam") return QALAM_HALF * (0.85 + 0.3 * pressure);
  const fast = 1 / (1 + speed * 0.5); // speed in board units per millisecond
  return PEN_HALF * clamp(0.45 + 0.75 * fast, 0.4, 1.25) * (0.7 + 0.6 * pressure);
}

/** Smooth polyline through midpoints, so the sampled corners disappear. */
function curveThrough(points: { x: number; y: number }[]) {
  let d = "";
  for (let i = 1; i < points.length - 1; i++) {
    const a = points[i],
      b = points[i + 1];
    d += `Q${n2(a.x)} ${n2(a.y)} ${n2((a.x + b.x) / 2)} ${n2((a.y + b.y) / 2)}`;
  }
  const last = points[points.length - 1];
  return d + `L${n2(last.x)} ${n2(last.y)}`;
}

/** Three-point average: removes the jitter of the hand without adding delay. */
function smoothed(points: Point[]) {
  if (points.length < 3) return points;
  return points.map((p, i) => {
    if (i === 0 || i === points.length - 1) return p;
    const a = points[i - 1],
      b = points[i + 1];
    return { x: (a.x + 2 * p.x + b.x) / 4, y: (a.y + 2 * p.y + b.y) / 4, w: p.w };
  });
}
/** The stroke thins out at the two ends, as a pen lifted from the paper does. */
function tapered(points: Point[]) {
  const n = points.length;
  if (n < 3) return points;
  const factor = [0.55, 0.8];
  return points.map((p, i) => {
    const f = factor[Math.min(i, n - 1 - i)];
    return f ? { ...p, w: p.w * f } : p;
  });
}

/**
 * The ink of one stroke as a filled shape: the two edges of the nib run along
 * the stroke and come back, so the line can swell and thin like real writing.
 * A round pen is offset along the normal of the movement; a qalam keeps its
 * cut at a fixed angle, which is what makes horizontals thick and verticals thin.
 */
function outline(stroke: Stroke) {
  const pts = tapered(smoothed(stroke.points));
  if (!pts.length) return "";
  const qalam = stroke.nib === "qalam";
  if (pts.length < 3) {
    const p = pts[0];
    const w = Math.max(p.w, 1.6);
    return qalam
      ? `M${n2(p.x + QALAM_DX * w)} ${n2(p.y + QALAM_DY * w)}L${n2(p.x - QALAM_DX * w)} ${n2(p.y - QALAM_DY * w)}L${n2(p.x - QALAM_DX * w + 1.4)} ${n2(p.y - QALAM_DY * w + 1.4)}L${n2(p.x + QALAM_DX * w + 1.4)} ${n2(p.y + QALAM_DY * w + 1.4)}Z`
      : `M${n2(p.x - w)} ${n2(p.y)}a${n2(w)} ${n2(w)} 0 1 0 ${n2(w * 2)} 0a${n2(w)} ${n2(w)} 0 1 0 ${n2(-w * 2)} 0Z`;
  }
  const left: { x: number; y: number }[] = [],
    right: { x: number; y: number }[] = [];
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i];
    let dx = QALAM_DX,
      dy = QALAM_DY;
    if (!qalam) {
      // normal of the local tangent
      const a = pts[Math.max(0, i - 1)],
        b = pts[Math.min(pts.length - 1, i + 1)];
      const tx = b.x - a.x,
        ty = b.y - a.y;
      const len = Math.hypot(tx, ty) || 1;
      dx = -ty / len;
      dy = tx / len;
    }
    left.push({ x: p.x + dx * p.w, y: p.y + dy * p.w });
    right.push({ x: p.x - dx * p.w, y: p.y - dy * p.w });
  }
  right.reverse();
  return (
    `M${n2(left[0].x)} ${n2(left[0].y)}` +
    curveThrough(left) +
    `L${n2(right[0].x)} ${n2(right[0].y)}` +
    curveThrough(right) +
    "Z"
  );
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
  /** Last sample of the stroke in progress, to measure speed. */
  const last = useRef<{ x: number; y: number; t: number; w: number } | null>(null);
  const nib: Nib = data.preferences?.nib === "qalam" ? "qalam" : "pen";
  const setNib = (value: Nib) => put("preferences", { ...(data.preferences || {}), nib: value });
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

  function coordinates(e: { clientX: number; clientY: number }) {
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
  /** Pressure is real only on a pen; mouse and finger report a constant. */
  function pressureOf(e: { pressure: number; pointerType: string }) {
    if (e.pointerType === "pen" && e.pressure > 0) return clamp(e.pressure * 1.25, 0.15, 1);
    return 0.5;
  }
  /** One sample: position plus the half-width the nib has at this speed. */
  function sample(point: { x: number; y: number }, pressure: number, time: number): Point {
    const previous = last.current;
    const dt = previous ? Math.max(4, time - previous.t) : 16;
    const speed = previous ? Math.hypot(point.x - previous.x, point.y - previous.y) / dt : 0;
    let w = sampleWidth(nib, speed, pressure);
    // the width follows the hand gradually: no steps from one sample to the next
    if (previous) w = previous.w + (w - previous.w) * 0.35;
    last.current = { x: point.x, y: point.y, t: time, w };
    return { ...point, w };
  }
  function begin(e: React.PointerEvent<SVGSVGElement>) {
    if (pointer.current !== null || e.button !== 0) return;
    e.preventDefault();
    pointer.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    setRedo([]);
    setMessage("");
    last.current = null;
    const first = sample(coordinates(e), pressureOf(e), e.timeStamp);
    setStrokes((s) => [...s, { nib, points: [first] }]);
  }
  function move(e: React.PointerEvent<SVGSVGElement>) {
    if (pointer.current !== e.pointerId) return;
    e.preventDefault();
    // a pen or a finger reports several positions per frame: use them all
    const native = e.nativeEvent as PointerEvent & { getCoalescedEvents?: () => PointerEvent[] };
    const events = native.getCoalescedEvents?.().length ? native.getCoalescedEvents!() : [native];
    const added: Point[] = [];
    for (const ev of events) {
      const p = coordinates(ev);
      const previous = added.length ? added[added.length - 1] : last.current;
      if (previous && Math.hypot(p.x - previous.x, p.y - previous.y) < 0.9) continue;
      added.push(sample(p, pressureOf(ev), ev.timeStamp));
    }
    if (!added.length) return;
    setStrokes((prev) => {
      const current = prev[prev.length - 1];
      if (!current?.points.length) return prev;
      const copy = prev.slice();
      copy[copy.length - 1] = { ...current, points: [...current.points, ...added] };
      return copy;
    });
  }
  function end(e: React.PointerEvent<SVGSVGElement>) {
    if (pointer.current !== e.pointerId) return;
    pointer.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    last.current = null;
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
                <path key={i} d={outline(s)} className="az-ink" />
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
            <div className="az-nib" role="group" aria-label="Punta">
              {NIBS.map((n) => (
                <button key={n.id} type="button" aria-pressed={nib === n.id} onClick={() => setNib(n.id)}>
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          <p className="az-hint az-nib-hint">{NIBS.find((n) => n.id === nib)!.hint}</p>
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
