import { TICKER } from "../data/site";

/**
 * Infinite ticker. The list is rendered twice and translated by -50%, so the
 * loop is seamless; hovering pauses it for anyone trying to read a line.
 */
export function Marquee() {
  const row = [...TICKER, ...TICKER];

  return (
    <div
      aria-hidden="true"
      className="group relative flex overflow-hidden border-y border-white/5 bg-ink-soft py-4"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink-soft to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink-soft to-transparent" />

      <div className="animate-marquee flex shrink-0 gap-10 whitespace-nowrap pr-10 group-hover:[animation-play-state:paused] active:[animation-play-state:paused]">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-10 font-mono text-sm text-ash"
          >
            {item}
            <span className="text-flame">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
