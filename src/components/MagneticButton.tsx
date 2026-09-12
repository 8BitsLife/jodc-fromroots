import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { usePointerFine } from "../hooks/usePointerFine";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  external?: boolean;
  className?: string;
};

const base =
  "group relative inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors duration-200";

const styles = {
  solid:
    "bg-flame text-ink hover:bg-flame-hot shadow-[0_10px_40px_-12px_rgba(255,122,26,0.9)]",
  ghost:
    "border border-white/15 text-bone backdrop-blur-sm hover:border-flame/70 hover:text-flame",
} as const;

/** Button that leans toward the cursor. Falls back to a plain link on touch. */
export function MagneticButton({
  href,
  children,
  variant = "solid",
  external,
  className = "",
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fine = usePointerFine();
  const reduced = usePrefersReducedMotion();
  const magnetic = fine && !reduced;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.35 });

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.26);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.34);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={magnetic ? { x: sx, y: sy } : undefined}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </motion.a>
  );
}
