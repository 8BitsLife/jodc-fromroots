import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** 5 × 7 bitmaps for the four letters of the wordmark. */
const LETTERS: Record<string, string[]> = {
  J: ["00111", "00010", "00010", "00010", "00010", "10010", "01100"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  C: ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
};

const COLS = 25;
const ROWS = 7;
const FILL_SECONDS = 1.8;

type Cell = { col: number; lit: boolean; alpha: number };

/** "JODC" laid into a contribution grid: one blank column, then 5-wide letters with a gap between each. */
function buildCells(): Cell[] {
  const cells: Cell[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const w = Math.floor((c - 1) / 6);
      const x = (c - 1) % 6;
      const letter = "JODC"[w];
      const lit = c >= 1 && w < 4 && x < 5 && LETTERS[letter][r][x] === "1";
      // Deterministic variation, so lit squares read as activity of different weights.
      const seed = (r * 31 + c * 17) % 100;
      cells.push({ col: c, lit, alpha: 0.55 + (seed / 100) * 0.45 });
    }
  }
  return cells;
}

/**
 * Footer sign-off: the club's name drawn in a contribution graph. Columns fill
 * left to right once the footer is on screen, the readout counts up with them,
 * and afterwards the odd lit square pulses like a fresh commit.
 */
export function ContributionSignature() {
  const cells = useMemo(buildCells, []);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = usePrefersReducedMotion();
  const [reach, setReach] = useState(0);
  const [pulse, setPulse] = useState(-1);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setReach(COLS);
      return;
    }
    const controls = animate(0, COLS, {
      duration: FILL_SECONDS,
      ease: [0.45, 0, 0.25, 1],
      onUpdate: (v) => setReach(v),
    });
    return () => controls.stop();
  }, [inView, reduced]);

  // Once full, light up a random lit square every couple of seconds.
  useEffect(() => {
    if (reach < COLS || reduced) return;
    const litIndexes = cells.flatMap((c, i) => (c.lit ? [i] : []));
    const timer = window.setInterval(() => {
      setPulse(litIndexes[Math.floor(Math.random() * litIndexes.length)]);
    }, 1800);
    return () => window.clearInterval(timer);
  }, [reach, reduced, cells]);

  const percent = Math.round((Math.min(reach, COLS) / COLS) * 100);

  return (
    <div ref={ref} className="w-full max-w-[19rem] select-none" role="img" aria-label="JODC, drawn in a contribution graph">
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }} aria-hidden="true">
        {cells.map((cell, i) => {
          const on = cell.col < reach;
          return (
            <span
              key={i}
              className={`aspect-square rounded-[2px] transition-[opacity,transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,1.4,0.4,1)] ${
                cell.lit ? "bg-flame" : "bg-white/[0.05]"
              } ${pulse === i ? "shadow-[0_0_12px_rgba(255,122,24,0.9)]" : cell.lit && on ? "shadow-[0_0_8px_rgba(255,122,24,0.3)]" : ""}`}
              style={{
                opacity: on ? (cell.lit ? (pulse === i ? 1 : cell.alpha) : 1) : 0,
                transform: on ? (pulse === i ? "scale(1.25)" : "scale(1)") : "scale(0.4)",
              }}
            />
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-ash" aria-hidden="true">
        <span>
          jodc <span className="text-white/25">/</span> contributions
        </span>
        <span className="tabular-nums text-flame">{percent}%</span>
      </div>
    </div>
  );
}
