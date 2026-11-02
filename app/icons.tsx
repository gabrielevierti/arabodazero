/** Line icons drawn on a 24px grid, stroke inherits the text colour. */
const paths: Record<string, string> = {
  today: "M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z",
  course: "M4 5.5C7 4 10 4.3 12 6c2-1.7 5-2 8-.5V19c-3-1.5-6-1.2-8 .5-2-1.7-5-2-8-.5zM12 6v13.5",
  review: "M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6",
  progress: "M4 20V10m5.3 10V4m5.4 16v-7M20 20v-4",
  library: "M5 4h3v16H5zM10 4h3v16h-3zM15.2 4.7l2.9-.8 3.9 15.4-2.9.8z",
  writing: "M15.5 4.5l4 4L9 19H5v-4zM13.5 6.5l4 4",
  settings:
    "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zM19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7.6 7.6 0 0 1-1.9 1.1L15 20.5h-4l-.3-2a7.6 7.6 0 0 1-1.9-1.1l-1.9.7-2-3.4 1.6-1.2a7.4 7.4 0 0 1 0-3l-1.6-1.2 2-3.4 1.9.7a7.6 7.6 0 0 1 1.9-1.1l.3-2h4l.3 2a7.6 7.6 0 0 1 1.9 1.1l1.9-.7 2 3.4-1.6 1.2a7.4 7.4 0 0 1 0 3z",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6 6 18",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  back: "M19 12H5m6-6-6 6 6 6",
  check: "m5 12.5 4.2 4.2L19 7",
  plus: "M12 5v14M5 12h14",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 20 20",
  play: "M8 5.5v13l10.5-6.5z",
  sound: "M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11",
  flame: "M12 21c3.9 0 6.5-2.6 6.5-6.2 0-3.7-3-6-4.4-9.3-2.4 1.6-3.3 4-3.3 5.8-1.2-.6-2-2-2.2-3.3C7 9.6 5.5 11.8 5.5 14.8 5.5 18.4 8.1 21 12 21z",
  cards: "M8 4h10a2 2 0 0 1 2 2v10M5 8h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z",
  undo: "M9 7 4 12l5 5M4 12h11a5 5 0 0 1 0 10h-1",
  redo: "m15 7 5 5-5 5M20 12H9a5 5 0 0 0 0 10h1",
  erase: "M20 20H9.5L4 14.5 13.5 5 20 11.5 13 18.5M7.5 11l6 6",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  lines: "M4 8h16M4 16h16",
  download: "M12 4v11m-5-5 5 5 5-5M5 20h14",
  shield: "M12 3.5 19 6v5.5c0 4.2-2.9 7.6-7 9-4.1-1.4-7-4.8-7-9V6z",
  cloud: "M7 19h10.5a3.5 3.5 0 0 0 .8-6.9 5.5 5.5 0 0 0-10.7-1.4A4 4 0 0 0 7 19z",
  spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18",
};

export function Icon({
  name,
  size = 20,
  className,
}: {
  name: keyof typeof paths | string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name] || paths.course} />
    </svg>
  );
}
