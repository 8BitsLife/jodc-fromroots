import { TICKER } from "../data/site";

/**
 * Infinite ticker. The list is rendered twice and translated by -50%, so the
 * loop is seamless; hovering pauses it for anyone trying to read a line.
 */
export function Marquee() {
  // Repeat 4x to prevent blank gaps on ultrawide monitors and high-res screens
  const row = [...TICKER, ...TICKER, ...TICKER, ...TICKER];

  return (
    <div
      aria-hidden="true"
      className="group relative flex overflow-hidden border-y border-white/5 bg-transparent py-4 select-none cursor-default"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-24 bg-gradient-to-r from-ink-soft to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-24 bg-gradient-to-l from-ink-soft to-transparent" />

      <div className="animate-marquee flex shrink-0 gap-8 sm:gap-10 whitespace-nowrap pr-8 sm:pr-10 group-hover:[animation-play-state:paused] active:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 sm:gap-10 font-mono text-xs sm:text-sm text-ash transition-colors hover:text-bone"
          >
            <span>{item}</span>
            <span className="text-flame font-bold">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
