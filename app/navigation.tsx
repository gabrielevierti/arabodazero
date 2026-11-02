import { useEffect, useRef, useState } from "react";
import { Icon } from "./icons";

type Item = { id: string; label: string; short?: string; icon: string };

const PRIMARY: Item[] = [
  { id: "home", label: "Oggi", icon: "today" },
  { id: "course", label: "Corso", icon: "course" },
  { id: "review", label: "Ripasso", icon: "review" },
  { id: "stats", label: "Progressi", icon: "progress" },
];
const TOOLS: Item[] = [
  { id: "alphabet", label: "Alfabeto", icon: "alphabet" },
  { id: "writing", label: "Scrittura a mano", short: "Scrittura", icon: "writing" },
  { id: "library", label: "Biblioteca", icon: "library" },
];
const SETTINGS: Item = { id: "settings", label: "Impostazioni", icon: "settings" };

/** Which navigation entry a view belongs to: exactly one is current. */
export function sectionOf(view: string) {
  if (["course", "lesson", "practice", "missing"].includes(view)) return "course";
  if (["review", "flashcards", "error-session"].includes(view)) return "review";
  if (view === "resource") return "library";
  if (view === "session") return "home";
  return view;
}

function Glyph({ item, size = 20 }: { item: Item; size?: number }) {
  // the alphabet entry uses the letter ʿayn instead of a pictogram
  return item.icon === "alphabet" ? (
    <span className="nav-letter" lang="ar" aria-hidden="true">
      ع
    </span>
  ) : (
    <Icon name={item.icon} size={size} />
  );
}

export function Brand({ onHome }: { onHome: () => void }) {
  return (
    <a
      className="az-brand"
      href="#/"
      onClick={(e) => {
        e.preventDefault();
        onHome();
      }}
    >
      <span className="az-brand-mark" lang="ar" aria-hidden="true">
        ع
      </span>
      <span className="az-brand-name">
        Arabo da Zero
        <small>arabo per italiani</small>
      </span>
    </a>
  );
}

export function Sidebar({
  view,
  navigate,
  badges = {},
}: {
  view: string;
  navigate: (v: string) => void;
  badges?: Record<string, number>;
}) {
  const current = sectionOf(view);
  const link = (item: Item) => (
    <button
      key={item.id}
      type="button"
      className={"az-nav-link" + (current === item.id ? " active" : "")}
      aria-current={current === item.id ? "page" : undefined}
      onClick={() => navigate(item.id)}
    >
      <Glyph item={item} />
      <span>{item.label}</span>
      {badges[item.id] ? (
        <em className="az-badge" aria-label={badges[item.id] + " da fare"}>
          {badges[item.id] > 99 ? "99+" : badges[item.id]}
        </em>
      ) : null}
    </button>
  );
  return (
    <aside className="az-sidebar">
      <Brand onHome={() => navigate("home")} />
      <nav aria-label="Navigazione principale" className="az-nav">
        <div className="az-nav-group">{PRIMARY.map(link)}</div>
        <div className="az-nav-label">Strumenti</div>
        <div className="az-nav-group">{TOOLS.map(link)}</div>
      </nav>
      <div className="az-sidebar-foot">{link(SETTINGS)}</div>
    </aside>
  );
}

export function MobileBar({
  view,
  navigate,
  badges = {},
}: {
  view: string;
  navigate: (v: string) => void;
  badges?: Record<string, number>;
}) {
  const current = sectionOf(view);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const inMore = [...TOOLS, SETTINGS].some((t) => t.id === current);
  useEffect(() => setOpen(false), [view]);
  useEffect(() => {
    if (!open) return;
    sheet.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const go = (id: string) => {
    setOpen(false);
    navigate(id);
  };
  return (
    <>
      <header className="az-topbar">
        <Brand onHome={() => go("home")} />
      </header>
      {open && (
        <div className="az-sheet-backdrop" onClick={() => setOpen(false)}>
          <div
            className="az-sheet"
            id="az-more-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Altri strumenti"
            ref={sheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="az-sheet-handle" aria-hidden="true" />
            {[...TOOLS, SETTINGS].map((item) => (
              <button
                key={item.id}
                type="button"
                className={"az-sheet-item" + (current === item.id ? " active" : "")}
                aria-current={current === item.id ? "page" : undefined}
                onClick={() => go(item.id)}
              >
                <Glyph item={item} size={22} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <nav className="az-tabbar" aria-label="Navigazione principale">
        {PRIMARY.map((item) => (
          <button
            key={item.id}
            type="button"
            className={current === item.id ? "active" : ""}
            aria-current={current === item.id ? "page" : undefined}
            onClick={() => go(item.id)}
          >
            <span className="az-tab-icon">
              <Glyph item={item} size={22} />
              {badges[item.id] ? <em className="az-dot" aria-hidden="true" /> : null}
            </span>
            <span>{item.short || item.label}</span>
          </button>
        ))}
        <button
          ref={trigger}
          type="button"
          className={inMore ? "active" : ""}
          aria-expanded={open}
          aria-controls="az-more-sheet"
          onClick={() => setOpen(!open)}
        >
          <span className="az-tab-icon">
            <Icon name="more" size={22} />
          </span>
          <span>Altro</span>
        </button>
      </nav>
    </>
  );
}
