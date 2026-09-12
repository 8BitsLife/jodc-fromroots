import { useState, useRef, useEffect, useCallback } from "react";
import { Star, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { LeaderboardRepo } from "../../data/repoOfTheWeek";

interface PreviousSpotlightsProps {
  repos: LeaderboardRepo[];
  currentRepoId: string;
  onSelectRepo: (id: string) => void;
}

export function PreviousSpotlights({
  repos,
  currentRepoId,
  onSelectRepo,
}: PreviousSpotlightsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Drag-to-scroll state
  const isMouseDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const hasDragged = useRef(false);

  // Check scroll boundary state to toggle button enablement & edge fades
  const checkScrollBoundaries = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const atLeft = el.scrollLeft <= 5;
    const atRight = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;

    setCanScrollLeft(!atLeft);
    setCanScrollRight(!atRight);
  }, []);

  useEffect(() => {
    checkScrollBoundaries();
    const el = scrollContainerRef.current;
    if (!el) return;

    const handleScroll = () => {
      checkScrollBoundaries();
    };

    el.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkScrollBoundaries);

    return () => {
      el.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScrollBoundaries);
    };
  }, [checkScrollBoundaries, repos]);

  // Smooth scroll left or right with button clicks
  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const cardStep = 375;
    const scrollAmount = direction === "left" ? -cardStep : cardStep;

    el.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isMouseDown.current = true;
    hasDragged.current = false;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftStart.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isMouseDown.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.3;
    if (Math.abs(walk) > 6) {
      hasDragged.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  return (
    <section className="mt-20 pt-12 border-t border-white/[0.08] relative">
      {/* Subtle ambient spotlight glow behind the archive */}
      <div className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 h-64 w-96 rounded-full bg-flame/5 blur-[120px]" />

      {/* Header with Title and Bidirectional Scroll Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-flame font-semibold block mb-1">
            JODC REPO Archive
          </span>
          <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-bone">
            Previous Spotlights<span className="text-flame">.</span>
          </h3>
        </div>

        {/* Scroll Controls & Archive Count */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block font-mono text-xs text-ash/60">
            {repos.length} Weekly Releases
          </span>

          <div className="flex items-center gap-1.5 p-1 rounded-full border border-white/10 bg-white/[0.02] backdrop-blur-sm">
            <button
              type="button"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              title="Scroll left"
              aria-label="Scroll left"
              className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] text-ash hover:border-flame/50 hover:bg-flame/15 hover:text-bone disabled:opacity-20 disabled:hover:border-white/10 disabled:hover:bg-white/[0.04] disabled:hover:text-ash transition-all flex items-center justify-center active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={17} />
            </button>

            <button
              type="button"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              title="Scroll right"
              aria-label="Scroll right"
              className="h-9 w-9 rounded-full border border-white/10 bg-white/[0.04] text-ash hover:border-flame/50 hover:bg-flame/15 hover:text-bone disabled:opacity-20 disabled:hover:border-white/10 disabled:hover:bg-white/[0.04] disabled:hover:text-ash transition-all flex items-center justify-center active:scale-95 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel Track with Edge Masks */}
      <div className="relative group/carousel">
        {/* Left Edge Gradient Fade Mask */}
        <div
          className={`pointer-events-none absolute left-0 top-0 bottom-6 w-12 sm:w-16 bg-gradient-to-r from-ink via-ink/80 to-transparent z-10 transition-opacity duration-300 ${canScrollLeft ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Right Edge Gradient Fade Mask */}
        <div
          className={`pointer-events-none absolute right-0 top-0 bottom-6 w-12 sm:w-16 bg-gradient-to-l from-ink via-ink/80 to-transparent z-10 transition-opacity duration-300 ${canScrollRight ? "opacity-100" : "opacity-0"
            }`}
        />

        {/* Smooth Scrollable Container */}
        <div
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className="no-scrollbar flex gap-3.5 sm:gap-5 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none touch-pan-x [-webkit-overflow-scrolling:touch]"
        >
          {[...repos]
            .sort((a, b) => {
              const numA = parseInt(a.week.replace(/\D/g, ""), 10) || 0;
              const numB = parseInt(b.week.replace(/\D/g, ""), 10) || 0;
              return numB - numA;
            })
            .map((repo) => {
            const isCurrent = repo.id === currentRepoId;
            const primaryLang = repo.languages[0];

            return (
              <article
                key={repo.id}
                onClick={() => {
                  if (hasDragged.current) return;
                  onSelectRepo(repo.id);
                }}
                className={`group relative cursor-pointer flex flex-col justify-between overflow-hidden rounded-3xl p-5 sm:p-6 transition-all duration-300 w-[280px] xs:w-[320px] sm:w-[355px] shrink-0 snap-start touch-manipulation ${isCurrent
                    ? "border border-flame/85 bg-gradient-to-b from-white/[0.08] via-flame/[0.05] to-black/95 shadow-[0_0_35px_rgba(255,122,26,0.24),0_15px_30px_rgba(0,0,0,0.85)] ring-1 ring-flame/35"
                    : "border border-white/[0.08] bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-black/85 hover:-translate-y-1.5 hover:border-flame/50 hover:bg-white/[0.06] hover:shadow-[0_20px_45px_rgba(0,0,0,0.7),0_0_30px_rgba(255,122,26,0.18)]"
                  }`}
              >
                {/* Glowing Top Hairline Accent */}
                <div
                  className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-flame to-transparent transition-opacity duration-300 ${isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                />

                {/* Soft Radial Ambient Glow */}
                <div
                  className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 h-28 w-48 rounded-full bg-flame/20 blur-2xl transition-opacity duration-300 ${isCurrent ? "opacity-70" : "opacity-0 group-hover:opacity-100"
                    }`}
                />

                <div>
                  {/* Top Header: Week Pill and Stars Badge */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span
                      className={`font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider inline-flex items-center gap-1.5 ${isCurrent
                          ? "text-flame bg-flame/15 border-flame/35 shadow-[0_0_12px_rgba(255,122,26,0.3)]"
                          : "text-flame bg-flame/10 border-flame/20"
                        }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse" />
                      {isCurrent ? "Active Spotlight" : repo.week}
                    </span>

                    <span className="inline-flex items-center gap-1 font-mono text-xs text-ash/90 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/5 group-hover:border-amber-500/30 group-hover:text-amber-300 transition-colors">
                      <Star size={11} className="text-flame fill-flame/30" />
                      {repo.stars.toLocaleString()}
                    </span>
                  </div>

                  {/* Repo Name */}
                  <h4 className="font-mono text-xl font-bold tracking-tight text-bone group-hover:text-flame transition-colors">
                    {repo.name}
                  </h4>

                  {/* Builder Row */}
                  <div className="flex items-center gap-2 mt-2.5">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center font-mono text-[9px] text-bone font-bold border border-white/15 shadow-inner">
                      {repo.builder.avatarText}
                    </div>
                    <span className="font-mono text-xs font-semibold text-bone/90 group-hover:text-bone">
                      {repo.builder.name}
                    </span>
                  </div>

                  {/* Tagline */}
                  <p className="mt-3 text-xs text-ash/85 line-clamp-2 leading-relaxed font-sans">
                    {repo.tagline}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3.5">
                    {repo.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] text-ash/70 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Meta & Action */}
                <div className="mt-6 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-ash/80">
                    <span
                      className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{
                        backgroundColor: primaryLang?.color || "#ff7a1a",
                        color: primaryLang?.color || "#ff7a1a",
                      }}
                    />
                    <span>{primaryLang?.name}</span>
                  </span>

                  {isCurrent ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-flame px-2.5 py-0.5 rounded-full bg-flame/15 border border-flame/30">
                      <span>Viewing</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-ash group-hover:text-flame px-2.5 py-0.5 rounded-full bg-white/[0.03] group-hover:bg-flame/10 border border-white/5 group-hover:border-flame/30 transition-all">
                      <span>Inspect</span>
                      <ArrowUpRight
                        size={12}
                        className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
