import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** 5 × 7 bitmaps for every letter the loop spells. */
const LETTERS: Record<string, string[]> = {
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
};

/** The loop: the name, then what the club is about. */
const WORDS = ["JODC", "OPEN", "SHIP", "CODE"] as const;

const COLS = 25;
const ROWS = 7;

const WRITE_S = 1.6;
const HOLD_MS = 3200;
const ERASE_S = 0.9;
const GAP_MS = 250;

/** One lit-map per word: a blank column, then 5-wide letters with a one-column gap. */
function buildMap(word: string): boolean[] {
  const map: boolean[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const w = Math.floor((c - 1) / 6);
      const x = (c - 1) % 6;
      map.push(c >= 1 && w < 4 && x < 5 && LETTERS[word[w]][r][x] === "1");
    }
  }
  return map;
}

/** Fixed per-square brightness, so lit squares read as commits of different weights. */
const ALPHA = Array.from({ length: COLS * ROWS }, (_, i) => {
  const r = Math.floor(i / COLS);
  const c = i % COLS;
  return 0.55 + (((r * 31 + c * 17) % 100) / 100) * 0.45;
});

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Footer sign-off: words drawn in a contribution graph, on a loop. Each word is
 * written left to right, holds while squares pulse like fresh commits, then is
 * erased right to left before the next one — JODC, OPEN, SHIP, CODE, and round.
 * The loop only runs while the footer is on screen.
 */
export function ContributionSignature() {
  const maps = useMemo(() => WORDS.map(buildMap), []);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduced = usePrefersReducedMotion();

  const [wordIndex, setWordIndex] = useState(0);
  const [reach, setReach] = useState(reduced ? COLS : 0);
  const [holding, setHolding] = useState(false);
  const [pulse, setPulse] = useState(-1);

  // The write → hold → erase → next-word cycle.
  useEffect(() => {
    if (reduced) {
      setWordIndex(0);
      setReach(COLS);
      return;
    }
    if (!inView) return;

    let cancelled = false;
    let stop: (() => void) | undefined;
    const tween = (from: number, to: number, duration: number) =>
      new Promise<void>((resolve) => {
        const controls = animate(from, to, {
          duration,
          ease: [0.45, 0, 0.25, 1],
          onUpdate: (v) => !cancelled && setReach(v),
          onComplete: () => resolve(),
        });
        stop = () => controls.stop();
      });

    (async () => {
      let index = wordIndex;
      while (!cancelled) {
        await tween(0, COLS, WRITE_S);
        if (cancelled) return;
        setHolding(true);
        await wait(HOLD_MS);
        if (cancelled) return;
        setHolding(false);
        setPulse(-1);
        await tween(COLS, 0, ERASE_S);
        if (cancelled) return;
        await wait(GAP_MS);
        index = (index + 1) % WORDS.length;
        setWordIndex(index);
      }
    })();

    return () => {
      cancelled = true;
      stop?.();
      setHolding(false);
    };
    // Restart only when visibility or motion preference changes; the loop tracks its own word.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  // While a word holds, light a random square of it every so often.
  useEffect(() => {
    if (!holding) return;
    const lit = maps[wordIndex].flatMap((on, i) => (on ? [i] : []));
    const pick = () => setPulse(lit[Math.floor(Math.random() * lit.length)]);
    pick();
    const timer = window.setInterval(pick, 700);
    return () => window.clearInterval(timer);
  }, [holding, wordIndex, maps]);

  const map = maps[wordIndex];
  const percent = Math.round((Math.max(0, Math.min(reach, COLS)) / COLS) * 100);

  return (
    <div ref={ref} className="w-full max-w-[19rem] select-none" role="img" aria-label="JODC, drawn in a contribution graph">
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }} aria-hidden="true">
        {map.map((lit, i) => {
          const on = i % COLS < reach;
          const hot = pulse === i;
          return (
            <span
              key={i}
              className={`aspect-square rounded-[2px] transition-[opacity,transform,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.2,1.4,0.4,1)] ${
                lit ? "bg-flame" : "bg-white/[0.05]"
              } ${hot ? "shadow-[0_0_12px_rgba(255,122,24,0.9)]" : lit && on ? "shadow-[0_0_8px_rgba(255,122,24,0.3)]" : ""}`}
              style={{
                opacity: on ? (lit ? (hot ? 1 : ALPHA[i]) : 1) : 0,
                transform: on ? (hot ? "scale(1.25)" : "scale(1)") : "scale(0.4)",
              }}
            />
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-ash" aria-hidden="true">
        <span>
          jodc <span className="text-white/25">/</span>{" "}
          <span className="text-bone/80">{WORDS[wordIndex].toLowerCase()}</span>
        </span>
        <span className="tabular-nums text-flame">{percent}%</span>
      </div>
    </div>
  );
}
