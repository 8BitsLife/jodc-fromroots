import { motion, type Transition } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Props = {
  size?: number;
  /** Draws itself in on mount, then breathes. */
  animated?: boolean;
  className?: string;
};

const spin: Transition = { duration: 26, repeat: Infinity, ease: "linear" };

/**
 * The club mark, rebuilt as vector so it can be animated and themed:
 * white ring, white core, three orange wedges.
 */
export function LogoMark({ size = 56, animated = false, className }: Props) {
  const reduced = usePrefersReducedMotion();
  const live = animated && !reduced;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="JODC logo"
    >
      <title>JODC</title>

      <motion.circle
        cx="60"
        cy="60"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        initial={live ? { pathLength: 0, opacity: 0 } : false}
        animate={live ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ rotate: -90, transformOrigin: "60px 60px" }}
      />

      <motion.circle
        cx="60"
        cy="60"
        r="27"
        fill="currentColor"
        initial={live ? { scale: 0 } : false}
        animate={live ? { scale: 1 } : undefined}
        transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "60px 60px" }}
      />

      <motion.g
        fill="var(--color-flame)"
        initial={live ? { opacity: 0, rotate: -40 } : false}
        animate={live ? { opacity: 1, rotate: 0 } : undefined}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformOrigin: "60px 60px" }}
      >
        <motion.g
          animate={live ? { rotate: 360 } : undefined}
          transition={live ? spin : undefined}
          style={{ transformOrigin: "60px 60px" }}
        >
          <path d="M60 60 L45 24 L75 24 Z" />
          <path
            d="M35.6 84.4 A 34.5 34.5 0 0 1 24.6 65.6 L 2.5 70 A 57 57 0 0 0 20 100 Z"
            transform="rotate(-8 60 60)"
          />
          <path
            d="M84.4 84.4 A 34.5 34.5 0 0 0 95.4 65.6 L 117.5 70 A 57 57 0 0 1 100 100 Z"
            transform="rotate(8 60 60)"
          />
        </motion.g>
      </motion.g>
    </svg>
  );
}
