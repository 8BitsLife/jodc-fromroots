import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogoMark } from "./LogoMark";
import { SITE } from "../data/site";

const SEEN_KEY = "jodc:preloaded";
/** How long the mark holds before the curtain lifts. */
const HOLD_MS = 1900;
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The intro plays once per browser session, and never for visitors who have
 * asked their OS for less motion — they get the page straight away.
 */
export function shouldShowPreloader(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === null;
  } catch {
    return true;
  }
}

type Ember = { x: number; y: number; vx: number; vy: number; r: number; a: number; hot: boolean };

/** Sparks drifting up and right across the curtain, in the logo's flame and white. */
function useEmbers(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    const embers: Ember[] = [];

    const spawn = (anywhere: boolean): Ember => ({
      x: anywhere ? Math.random() * width : -10,
      y: anywhere ? Math.random() * height : height * (0.35 + Math.random() * 0.65),
      vx: 0.35 + Math.random() * 1.1,
      vy: -(0.25 + Math.random() * 0.9),
      r: Math.random() < 0.1 ? 1.6 + Math.random() * 1.6 : 0.5 + Math.random() * 1.1,
      a: 0.25 + Math.random() * 0.65,
      hot: Math.random() < 0.72,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const count = width < 640 ? 70 : 150;
    for (let i = 0; i < count; i++) embers.push(spawn(true));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.x += e.vx;
        e.y += e.vy;
        if (e.x > width + 10 || e.y < -10) embers[i] = spawn(false);

        ctx.globalAlpha = e.a;
        ctx.fillStyle = e.hot ? "#ff7a1a" : "#f5f5f4";
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef]);
}

interface PreloaderProps {
  /** Fires the moment the curtain starts lifting, so the page can animate in beneath it. */
  onReveal: () => void;
}

export function Preloader({ onReveal }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Held in a ref so a parent re-render can never restart the timer.
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  useEmbers(canvasRef);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* storage blocked — the intro simply plays again next visit */
      }
      document.body.style.overflow = "";
      setVisible(false);
      onRevealRef.current();
    }, HOLD_MS);

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-label={`Loading ${SITE.name}`}
          className="fixed inset-0 z-[200] flex select-none items-center justify-center overflow-hidden bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          style={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame/15 blur-[140px]"
          />

          <div className="relative flex flex-col items-center px-6 text-center">
            <motion.div
              className="text-bone"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease }}
            >
              <LogoMark size={96} animated />
            </motion.div>

            <div className="mt-7 overflow-hidden">
              <motion.p
                className="font-display text-[clamp(3rem,11vw,6rem)] font-bold leading-none tracking-[-0.05em] text-bone"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease }}
              >
                JODC<span className="text-flame">.</span>
              </motion.p>
            </div>

            <motion.p
              className="kicker mt-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease }}
            >
              {SITE.longName}
            </motion.p>

            {/* Progress hairline that fills over the hold. */}
            <div aria-hidden="true" className="mt-8 h-px w-40 overflow-hidden bg-white/10">
              <motion.div
                className="h-full origin-left bg-flame"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: HOLD_MS / 1000, ease: [0.65, 0, 0.35, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
