import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import type { LeaderboardRepo } from "../../data/repoOfTheWeek";

interface PreviousSpotlightsProps {
  repos: LeaderboardRepo[];
  currentRepoId: string;
  onSelectRepo: (id: string) => void;
}

const weekNumber = (r: LeaderboardRepo) => parseInt(r.week.replace(/\D/g, ""), 10) || 0;

export function PreviousSpotlights({ repos, currentRepoId, onSelectRepo }: PreviousSpotlightsProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Drag to scroll with a mouse; a drag never counts as a click on a card.
  const drag = useRef({ down: false, startX: 0, startLeft: 0, moved: false });

  const ordered = useMemo(() => [...repos].sort((a, b) => weekNumber(b) - weekNumber(a)), [repos]);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    syncEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges, repos]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = trackRef.current;
    const card = el?.querySelector<HTMLElement>("[data-card]");
    if (!el || !card) return;
    el.scrollBy({ left: direction * (card.offsetWidth + 16), behavior: "smooth" });
  };

  // Fade only the edges that have more cards behind them, via a mask rather
  // than a painted gradient, so it works over any background.
  const fade = `linear-gradient(to right, ${canScrollLeft ? "transparent, #000 4rem" : "#000"}, ${
    canScrollRight ? "#000 calc(100% - 4rem), transparent" : "#000"
  })`;

  return (
    <section className="mt-24 sm:mt-32">
      <div className="grid gap-6 border-b border-white/10 pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <div className="flex items-baseline gap-4">
            <span className="kicker text-flame">Archive</span>
            <span className="kicker">{repos.length} weeks</span>
          </div>
          <motion.h2
            initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 28 }}
            whileInView={{ clipPath: "inset(0% 0% -15% 0%)", y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-[clamp(2.2rem,5vw,3.75rem)]"
          >
            Previous <span className="accent">spotlights.</span>
          </motion.h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            aria-label="Earlier spotlights"
            className="flex h-11 w-11 items-center justify-center rounded-full text-bone ring-1 ring-inset ring-white/15 transition-all hover:bg-white/[0.06] hover:ring-white/30 disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowLeft size={17} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            aria-label="Later spotlights"
            className="flex h-11 w-11 items-center justify-center rounded-full text-bone ring-1 ring-inset ring-white/15 transition-all hover:bg-white/[0.06] hover:ring-white/30 disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        role="region"
        aria-label="Previous spotlights"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            scrollByCard(-1);
          } else if (e.key === "ArrowRight") {
            e.preventDefault();
            scrollByCard(1);
          }
        }}
        onMouseDown={(e) => {
          const el = trackRef.current;
          if (!el) return;
          drag.current = { down: true, startX: e.pageX, startLeft: el.scrollLeft, moved: false };
        }}
        onMouseMove={(e) => {
          const el = trackRef.current;
          if (!el || !drag.current.down) return;
          const dx = e.pageX - drag.current.startX;
          if (Math.abs(dx) > 6) drag.current.moved = true;
          el.scrollLeft = drag.current.startLeft - dx;
        }}
        onMouseUp={() => (drag.current.down = false)}
        onMouseLeave={() => (drag.current.down = false)}
        style={{ maskImage: fade, WebkitMaskImage: fade }}
        className="mt-8 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar active:cursor-grabbing focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-flame/50"
      >
        {ordered.map((repo) => {
          const isCurrent = repo.id === currentRepoId;
          const lang = repo.languages[0];

          return (
            <article
              key={repo.id}
              data-card
              className={`group relative flex w-[17.5rem] shrink-0 snap-start flex-col rounded-3xl p-6 transition-colors duration-300 sm:w-[21rem] ${
                isCurrent ? "bg-flame/[0.06] ring-1 ring-inset ring-flame/45" : "bg-white/[0.02] ring-1 ring-inset ring-white/[0.08] hover:bg-white/[0.04] hover:ring-white/20"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-x-6 top-0 h-px origin-left bg-flame transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isCurrent ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />

              <div className="flex items-center justify-between gap-2">
                <span className={`kicker ${isCurrent ? "text-flame" : ""}`}>{isCurrent ? "Viewing now" : repo.week}</span>
                <span className="inline-flex items-center gap-1 font-mono text-xs tabular-nums text-ash">
                  <Star size={11} aria-hidden="true" />
                  {repo.stars.toLocaleString()}
                </span>
              </div>

              <h3 className="mt-6 font-mono text-xl font-bold tracking-tight text-bone transition-colors group-hover:text-flame">
                {/* Stretched button: the whole card selects the week, and it is keyboard reachable. */}
                <button
                  type="button"
                  onClick={() => {
                    if (drag.current.moved) return;
                    onSelectRepo(repo.id);
                  }}
                  aria-current={isCurrent ? "true" : undefined}
                  className="text-left after:absolute after:inset-0 after:rounded-3xl after:content-['']"
                >
                  {repo.name}
                </button>
              </h3>
              <p className="mt-1 font-mono text-[11px] text-ash">{repo.builder.name}</p>

              <p className="mt-4 line-clamp-2 text-pretty text-sm leading-relaxed text-ash">{repo.tagline}</p>

              <div className="mt-auto pt-6">
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-4 font-mono text-[11px] text-ash">
                <span className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: lang?.color }} />
                  {lang?.name}
                </span>
                <span className={`flex items-center gap-1 transition-colors ${isCurrent ? "text-flame" : "group-hover:text-flame"}`}>
                  {isCurrent ? "Open above" : "View"}
                  {!isCurrent && (
                    <ArrowUpRight size={12} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  )}
                </span>
              </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
