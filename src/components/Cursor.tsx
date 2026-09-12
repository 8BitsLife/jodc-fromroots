import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePointerFine } from "../hooks/usePointerFine";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/**
 * A soft flame halo trailing the mouse. Desktop only, purely decorative,
 * and it never replaces the real cursor — so nothing breaks if it is off.
 */
export function Cursor() {
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const [hot, setHot] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 380, damping: 34, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 380, damping: 34, mass: 0.4 });

  useEffect(() => {
    if (!fine || reduced) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHot(Boolean(el?.closest("a, button, [data-cursor-hot]")));
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[90] hidden md:block"
      style={{ left: sx, top: sy, translateX: "-50%", translateY: "-50%" }}
    >
      <motion.div
        animate={{ scale: hot ? 2.6 : 1, opacity: hot ? 0.5 : 0.28 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="h-10 w-10 rounded-full bg-flame blur-[14px]"
      />
    </motion.div>
  );
}
