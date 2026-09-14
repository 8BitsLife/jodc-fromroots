import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SITE } from "../data/site";
import { STROKE_WORD } from "../data/stroke-word";

const FLAME = "#ff7a1a";

/**
 * Each glyph carries `outbound`: how far along its outer contour the reveal
 * stroke must travel before the whole letter is covered (~0.5 for a stroke,
 * where the contour is a round trip; ~1 for a ring like the O). Measured
 * offline by the generator, so the pen reaches the end of every letter and
 * never idles on a retrace.
 */

const META: Array<[string, string, string]> = [
  ["Where", "JIIT-128, Noida", "and online"],
  ["When", "Weekly", "during term"],
  ["Cost", "Free", "always"],
  ["Bring", "A laptop", "and questions"],
];

type Pt = [number, number];
type Window = [number, number];
type Geometry = {
  width: number;
  height: number;
  fills: string[];
  masks: string[];
  leadIn: string;
  rowBreak: string;
  exit: string;
  linePx: number;
  maskPx: number;
};

const fmt = (p: Pt) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;

/** Apply scale + translate to every coordinate pair in a path string. */
function transformPath(d: string, s: number, tx: number, ty: number) {
  return d.replace(
    /(-?\d+\.?\d*),(-?\d+\.?\d*)/g,
    (_, x, y) => `${(+x * s + tx).toFixed(1)},${(+y * s + ty).toFixed(1)}`,
  );
}

/**
 * Scroll windows for every drawable piece, in writing order: lead-in, row
 * one, the sweep between rows, row two, exit. Glyph windows overlap so the
 * pen flows instead of stamping letters one at a time.
 */
function buildWindows() {
  const glyphs = STROKE_WORD.glyphs;
  const rowOneCount = glyphs.filter((g) => g.row === 0).length;
  const pieces: Array<{ kind: "lead" | "glyph" | "break" | "exit"; w: number }> = [
    { kind: "lead", w: 0.9 },
    ...glyphs.slice(0, rowOneCount).map(() => ({ kind: "glyph" as const, w: 1 })),
    { kind: "break", w: 1.1 },
    ...glyphs.slice(rowOneCount).map(() => ({ kind: "glyph" as const, w: 1 })),
    { kind: "exit", w: 0.9 },
  ];
  const total = pieces.reduce((a, p) => a + p.w, 0);
  let t = 0;
  const windows = pieces.map((p) => {
    const from = t / total;
    t += p.w;
    return { kind: p.kind, window: [from, t / total] as Window };
  });
  const glyphWindows = windows
    .filter((p) => p.kind === "glyph")
    .map(({ window: [a, b] }, i) => [i === 0 ? a : a - (b - a) * 0.35, b] as Window);
  return {
    leadIn: windows[0].window,
    rowBreak: windows.find((p) => p.kind === "break")!.window,
    exit: windows[windows.length - 1].window,
    glyphs: glyphWindows,
  };
}

function Piece({
  d,
  progress,
  window,
  strokeWidth,
  outbound = 1,
  mask = false,
  pathRef,
}: {
  d: string;
  progress: MotionValue<number>;
  window: Window;
  strokeWidth: number;
  outbound?: number;
  mask?: boolean;
  pathRef?: (el: SVGPathElement | null) => void;
}) {
  const pathLength = useTransform(progress, window, [0, outbound]);
  return (
    <motion.path
      ref={pathRef}
      d={d}
      fill="none"
      stroke={mask ? "#fff" : FLAME}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pathLength }}
    />
  );
}

/**
 * Mask-space copy of a glyph's own outline that fades in over the last stretch
 * of its window. The travelling mask stroke can't reach every hairline terminal
 * (the tip of the p, the curl on the S), so once the pen is nearly done the
 * whole letter is let through and nothing is left cut off.
 */
function GlyphSeal({ d, progress, window }: { d: string; progress: MotionValue<number>; window: Window }) {
  const [a, b] = window;
  const opacity = useTransform(progress, [a + (b - a) * 0.8, b], [0, 1]);
  return <motion.path d={d} fill="#fff" style={{ opacity }} />;
}

/**
 * Act-break between the hero and the rest of the page. One flowing line
 * starts at the end of "The rest follow.", writes "Open Source" in a
 * signature script, and runs on down into the flame block under the wordmark.
 *
 * The letters are the font's real outlines. Each is revealed through an SVG
 * mask in which a fat stroke travels along the glyph's outer contour from its
 * entry point, so the letter appears the way a pen would write it. The
 * connecting swashes are ordinary stroked paths. Everything is rebuilt in
 * section-pixel space on layout change, so both ends stay anchored to text.
 */
export function ScrollStroke() {
  const sectionRef = useRef<HTMLElement>(null);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLParagraphElement>(null);
  const pieceRefs = useRef<(SVGPathElement | null)[]>([]);

  const windows = useMemo(buildWindows, []);
  const [geo, setGeo] = useState<Geometry | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const build = () => {
      const anchor = anchorRef.current;
      const slot = slotRef.current;
      const block = blockRef.current;
      const mark = markRef.current;
      if (!anchor || !slot || !block || !mark) return;

      const base = section.getBoundingClientRect();
      const rel = (r: DOMRect) => ({
        left: r.left - base.left,
        top: r.top - base.top,
        right: r.right - base.left,
        bottom: r.bottom - base.top,
        width: r.width,
        height: r.height,
      });
      const a = rel(anchor.getBoundingClientRect());
      const w = rel(slot.getBoundingClientRect());
      const b = rel(block.getBoundingClientRect());
      const m = rel(mark.getBoundingClientRect());

      const { bbox, glyphs, start, end, rowBreak, stroke } = STROKE_WORD;
      const s = Math.min(w.width / bbox.w, w.height / bbox.h);
      const tx = w.left + (w.width - bbox.w * s) / 2 - bbox.x * s;
      const ty = w.top + (w.height - bbox.h * s) / 2 - bbox.y * s;
      const px = (p: readonly [number, number]): Pt => [p[0] * s + tx, p[1] * s + ty];

      const wordStart = px(start);
      const wordEnd = px(end);
      const breakFrom = px(rowBreak.from);
      const breakTo = px(rowBreak.to);

      // Lead-in: off the full stop of "The rest follow.", down into the O.
      const from: Pt = [a.right - 6, a.bottom - a.height * 0.28];
      const leadIn =
        `M${fmt(from)}C${fmt([from[0] + 80, from[1] + 150])} ` +
        `${fmt([wordStart[0] - 120, wordStart[1] - 60])} ${fmt(wordStart)}`;

      // Row break: a tail off the n, a sweep back through the gap, into the S.
      const gapY = (breakFrom[1] + breakTo[1]) / 2;
      const rowBreakD =
        `M${fmt(breakFrom)}C${fmt([breakFrom[0] + 180, breakFrom[1] + 10])} ` +
        `${fmt([breakFrom[0] + 220, gapY - 40])} ${fmt([breakFrom[0] + 60, gapY])}` +
        `C${fmt([(breakFrom[0] + breakTo[0]) / 2, gapY + 30])} ` +
        `${fmt([breakTo[0] - 160, breakTo[1] - 90])} ${fmt(breakTo)}`;

      // Exit: off the last e, down into the flame block above the wordmark.
      const to: Pt = [m.left + m.width / 2, b.top + 4];
      const exit =
        `M${fmt(wordEnd)}C${fmt([wordEnd[0] + 160, wordEnd[1] + 40])} ` +
        `${fmt([to[0], to[1] - 170])} ${fmt(to)}`;

      setGeo({
        width: base.width,
        height: base.height,
        fills: glyphs.map((g) => transformPath(g.fill, s, tx, ty)),
        masks: glyphs.map((g) => transformPath(g.mask, s, tx, ty)),
        leadIn,
        rowBreak: rowBreakD,
        exit,
        linePx: Math.max(2, Math.min(9, stroke * s * 0.7)),
        maskPx: Math.max(6, stroke * s * 2.8),
      });
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(section);
    document.fonts?.ready.then(build);
    return () => ro.disconnect();
  }, []);

  // 0 when the section top reaches mid-viewport (heading in view), 1 when the
  // section bottom meets the viewport bottom (block fully in view).
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.5", "end 1"],
  });

  // Wheel scrolling arrives in steps; a light spring turns those steps into a
  // continuous glide so the pen writes instead of stuttering. Still tied to
  // scroll position — it just catches up smoothly.
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  });

  // Pen dot lives in motion values so it moves every frame without
  // re-rendering the whole drawing through React state.
  const penX = useMotionValue(0);
  const penY = useMotionValue(0);
  const penOpacity = useMotionValue(0);

  // Path lengths only change when geometry is rebuilt; measuring them every
  // frame was a large share of the per-scroll cost.
  const lengths = useRef(new Map<SVGPathElement, number>());
  useEffect(() => lengths.current.clear(), [geo]);

  const order = useMemo(() => {
    const n = windows.glyphs.length;
    return [
      { window: windows.leadIn, index: 0, outbound: 1 },
      ...windows.glyphs.map((win, i) => ({
        window: win,
        index: 1 + i,
        outbound: STROKE_WORD.glyphs[i].outbound,
      })),
      { window: windows.rowBreak, index: 1 + n, outbound: 1 },
      { window: windows.exit, index: 2 + n, outbound: 1 },
    ];
  }, [windows]);

  // Pen dot: find the last piece whose window we are in and read its tip.
  useMotionValueEvent(progress, "change", (v) => {
    let active: (typeof order)[number] | undefined;
    for (const piece of order) {
      if (v >= piece.window[0] && v <= piece.window[1]) active = piece;
    }
    if (!active || v <= 0.002 || v >= 0.998) {
      penOpacity.set(0);
      return;
    }
    const el = pieceRefs.current[active.index];
    if (!el) return;
    let total = lengths.current.get(el);
    if (total === undefined) {
      total = el.getTotalLength();
      lengths.current.set(el, total);
    }
    if (!total) return;
    const [a, b] = active.window;
    const local = Math.min(1, ((v - a) / (b - a)) * active.outbound);
    const p = el.getPointAtLength(local * total);
    penX.set(p.x);
    penY.set(p.y);
    penOpacity.set(1);
  });
  const setRef = (i: number) => (el: SVGPathElement | null) => {
    pieceRefs.current[i] = el;
  };
  const n = windows.glyphs.length;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stroke-heading"
      className="relative flex min-h-[170vh] w-full flex-col items-center overflow-hidden border-t border-white/5 px-5 pb-6 sm:px-8 sm:pb-8"
    >
      {geo && (
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${geo.width} ${geo.height}`}
          width={geo.width}
          height={geo.height}
          preserveAspectRatio="none"
          className="pointer-events-none absolute left-0 top-0 z-[5] overflow-visible"
        >
          <defs>
            <mask
              id="stroke-word-mask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={geo.width}
              height={geo.height}
            >
              {geo.masks.map((d, i) => (
                <Piece
                  key={i}
                  d={d}
                  progress={progress}
                  window={windows.glyphs[i]}
                  strokeWidth={geo.maskPx}
                  outbound={STROKE_WORD.glyphs[i].outbound}
                  mask
                  pathRef={setRef(1 + i)}
                />
              ))}
              {geo.fills.map((d, i) => (
                <GlyphSeal key={`seal-${i}`} d={d} progress={progress} window={windows.glyphs[i]} />
              ))}
            </mask>
          </defs>

          <g style={{ filter: `drop-shadow(0 0 ${geo.linePx * 2.2}px rgba(255,122,26,0.5))` }}>
            <Piece
              d={geo.leadIn}
              progress={progress}
              window={windows.leadIn}
              strokeWidth={geo.linePx}
              pathRef={setRef(0)}
            />
            <Piece
              d={geo.rowBreak}
              progress={progress}
              window={windows.rowBreak}
              strokeWidth={geo.linePx}
              pathRef={setRef(1 + n)}
            />
            <Piece
              d={geo.exit}
              progress={progress}
              window={windows.exit}
              strokeWidth={geo.linePx}
              pathRef={setRef(2 + n)}
            />
            <g mask="url(#stroke-word-mask)">
              {geo.fills.map((d, i) => (
                <path key={i} d={d} fill={FLAME} />
              ))}
            </g>
          </g>

          <motion.g style={{ opacity: penOpacity }}>
            <motion.circle cx={penX} cy={penY} r={geo.linePx * 3} fill={FLAME} opacity={0.22} />
            <motion.circle cx={penX} cy={penY} r={geo.linePx * 1.1} fill="#fff3e6" />
          </motion.g>
        </svg>
      )}

      <div className="relative z-10 mt-28 flex w-fit flex-col items-center gap-6 text-center sm:mt-40">
        <h2
          id="stroke-heading"
          className="text-[clamp(2.6rem,8.2vw,7.4rem)] leading-[0.95] tracking-[-0.045em] text-bone"
        >
          Your first line
          <br />
          is the hard one.
          <br />
          <span ref={anchorRef} className="accent">
            The rest follow.
          </span>
        </h2>
        <p className="max-w-lg text-pretty text-base leading-relaxed text-ash sm:text-lg">
          Keep scrolling. The line writes it out the further you go, which is
          also how contributing works.
        </p>
      </div>

      {/* Reserved space the word is fitted into. */}
      <div
        ref={slotRef}
        aria-hidden="true"
        className="mb-10 mt-12 w-full max-w-4xl sm:mb-16 sm:mt-16"
        style={{ aspectRatio: `${STROKE_WORD.bbox.w} / ${STROKE_WORD.bbox.h}` }}
      />
      <span className="sr-only">Open Source</span>

      <div
        ref={blockRef}
        className="relative z-10 mt-auto w-full rounded-[2.5rem] bg-flame pb-8 pt-2 text-ink sm:pb-10"
      >
        <p
          ref={markRef}
          aria-label={SITE.name}
          className="mt-8 text-center font-display text-[24vw] font-bold leading-[0.85] tracking-[-0.06em] sm:mt-10 lg:text-[17vw]"
        >
          {SITE.name}
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 px-6 font-mono text-[0.7rem] uppercase tracking-[0.16em] sm:px-10 lg:mt-4 lg:grid-cols-4">
          {META.map(([label, line1, line2]) => (
            <div key={label}>
              <dt className="text-ink/60">{label}</dt>
              <dd className="mt-1.5 font-semibold leading-snug">
                {line1}
                <br />
                {line2}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
