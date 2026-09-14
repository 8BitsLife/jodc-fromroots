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
      className="group relative flex overflow-hidden pane border-y border-white/5 py-4 select-none cursor-default [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]"
    >
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
