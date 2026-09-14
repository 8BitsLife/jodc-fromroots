import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Props = {
  words: readonly string[];
  /** Milliseconds each word holds before the next flips in. */
  interval?: number;
  /** Wait before the first change, so the entrance animation finishes first. */
  startDelay?: number;
  className?: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * A word that cycles through alternatives. Letters leave upward and the next
 * word's letters flip in from below through a short blur, staggered left to
 * right. The box eases between word widths, so the rest of the line slides
 * rather than jumps.
 *
 * Purely decorative: screen readers get the parent's aria-label instead.
 */
export function RotatingWord({ words, interval = 2600, startDelay = 2400, className = "" }: Props) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState<number[]>([]);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Measure every word once in the real font, and again if fonts or size change.
  useLayoutEffect(() => {
    const measure = () => {
      const el = measureRef.current;
      if (!el) return;
      setWidths(Array.from(el.children, (child) => (child as HTMLElement).getBoundingClientRect().width));
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [words]);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    let timer = 0;
    const start = window.setTimeout(() => {
      setIndex((i) => (i + 1) % words.length);
      timer = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    }, startDelay);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(timer);
    };
  }, [reduced, words.length, interval, startDelay]);

  const word = words[index];

  return (
    <motion.span
      aria-hidden="true"
      className={`relative inline-flex whitespace-pre align-baseline [perspective:600px] ${className}`}
      animate={widths[index] ? { width: widths[index] } : undefined}
      transition={{ duration: 0.6, ease }}
    >
      {/* Invisible copies used only for measuring widths. */}
      <span ref={measureRef} className="pointer-events-none invisible absolute left-0 top-0 flex">
        {words.map((w) => (
          <span key={w} className="absolute whitespace-pre">
            {w}
          </span>
        ))}
      </span>

      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={word} className="inline-flex">
          {Array.from(word).map((char, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="inline-block origin-bottom"
              initial={{ y: "70%", rotateX: -85, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: "0%", rotateX: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "-60%", rotateX: 70, opacity: 0, filter: "blur(6px)" }}
              transition={{ duration: 0.55, delay: i * 0.035, ease }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  );
}
