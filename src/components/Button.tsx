import type { MouseEvent, ReactNode } from "react";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  /** Icon in the trailing chip. Swaps out and back in on hover. */
  icon?: LucideIcon;
  /** Which way the icon leaves on hover: out the top-right, or down. */
  travel?: "diagonal" | "down" | "left";
  external?: boolean;
  /** For in-app navigation: call preventDefault() to stay on the page. */
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
};

const styles = {
  solid:
    "bg-flame text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_28px_-10px_rgba(255,122,26,0.75)] hover:bg-flame-hot hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_14px_40px_-10px_rgba(255,122,26,0.95)]",
  ghost:
    "bg-white/[0.04] text-bone ring-1 ring-inset ring-white/15 backdrop-blur-md hover:bg-white/[0.08] hover:ring-white/30",
} as const;

const chip = {
  solid: "bg-ink text-flame",
  ghost: "bg-white/10 text-bone group-hover:bg-flame group-hover:text-ink",
} as const;

const iconOut = {
  diagonal: "group-hover:-translate-y-6 group-hover:translate-x-6",
  down: "group-hover:translate-y-6",
  left: "group-hover:-translate-x-6",
} as const;

const iconIn = {
  diagonal: "-translate-x-6 translate-y-6",
  down: "-translate-y-6",
  left: "translate-x-6",
} as const;

/**
 * Pill with a trailing icon chip. Hover: colour and glow deepen, a light sheen
 * crosses once and the icon slides out and back in. Press settles it by 2%.
 * No positional pull — the button stays exactly where the eye expects it.
 */
export function Button({
  href,
  children,
  variant = "solid",
  icon: Icon = ArrowUpRight,
  travel = "diagonal",
  external,
  onClick,
  className = "",
}: Props) {
  return (
    <a
      href={href}
      onClick={onClick}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      className={`group relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-full pl-6 pr-1.5 text-sm font-semibold tracking-tight transition-[background-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] ${styles[variant]} ${className}`}
    >
      {/* Sheen: parked off the left edge, sweeps across on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[300%] group-hover:opacity-100 motion-reduce:hidden"
      />

      <span className="relative">{children}</span>

      <span
        aria-hidden="true"
        className={`relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-colors duration-300 ${chip[variant]}`}
      >
        <Icon
          size={16}
          strokeWidth={2.25}
          className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${iconOut[travel]}`}
        />
        <Icon
          size={16}
          strokeWidth={2.25}
          className={`absolute transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 ${iconIn[travel]}`}
        />
      </span>
    </a>
  );
}
