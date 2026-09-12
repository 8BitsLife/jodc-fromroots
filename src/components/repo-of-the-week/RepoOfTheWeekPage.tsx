import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { LEADERBOARD_REPOS } from "../../data/repoOfTheWeek";
import { RepoSpotlight } from "./RepoSpotlight";
import { Leaderboard } from "./Leaderboard";
import { PreviousSpotlights } from "./PreviousSpotlights";
import { SponsorsMarquee } from "./SponsorsMarquee";
import { SubmitProjectModal } from "./SubmitProjectModal";
import { Footer } from "../Footer";

interface RepoOfTheWeekPageProps {
  onBackToHome: () => void;
  onNavigate?: (route: "home" | "repo-of-the-week", sectionId?: string) => void;
}

export function RepoOfTheWeekPage({ onBackToHome, onNavigate }: RepoOfTheWeekPageProps) {
  const [selectedRepoId, setSelectedRepoId] = useState<string>(
    LEADERBOARD_REPOS[0]?.id || "ghost-cache"
  );
  const spotlightRef = useRef<HTMLDivElement>(null);

  const selectedRepo =
    LEADERBOARD_REPOS.find((r) => r.id === selectedRepoId) ||
    LEADERBOARD_REPOS[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `${selectedRepo.name} — JODC Repo of the Week`;
    return () => {
      document.title = "JODC — JIIT-128 Open Source Development Club";
    };
  }, [selectedRepo.name]);

  const handleSelectRepo = (id: string) => {
    setSelectedRepoId(id);
    if (spotlightRef.current) {
      const topOffset = spotlightRef.current.getBoundingClientRect().top + window.scrollY - 84;
      window.scrollTo({ top: Math.max(0, topOffset), behavior: "smooth" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative min-h-screen w-full max-w-full overflow-x-hidden bg-ink text-bone"
    >
      {/* Subtle background radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame/10 blur-[160px]" />
      </div>

      <main id="main" className="w-full max-w-full overflow-x-hidden pt-20 sm:pt-28 pb-12">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Bar Navigation */}
          <div className="w-full flex items-center justify-between gap-4 mb-6 sm:mb-8">
            <button
              type="button"
              onClick={onBackToHome}
              className="group inline-flex min-h-[40px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-mono text-ash hover:border-flame/50 hover:text-bone transition-all touch-manipulation cursor-pointer"
            >
              <ArrowLeft
                size={13}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span>Home</span>
            </button>

            <span className="font-mono text-xs uppercase tracking-widest text-ash/60">
              Community Spotlight
            </span>
          </div>

          {/* Hero Headline - Balanced scale */}
          <div className="w-full max-w-3xl mb-7 sm:mb-9">
            <div className="inline-flex items-center gap-2 rounded-full border border-flame/30 bg-flame/10 px-3 py-1 mb-3.5 sm:mb-4 text-xs font-mono font-semibold text-flame">
              <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse" />
              <span>WEEKLY CAMPUS SPOTLIGHT</span>
            </div>

            <h1 className="text-[clamp(2.25rem,6.5vw,4.8rem)] font-bold tracking-tight text-bone leading-[1.04]">
              Repo of the <span className="accent text-flame">Week.</span>
            </h1>

            <p className="mt-3 text-base sm:text-lg text-ash leading-relaxed max-w-xl">
              Spotlighting top student open-source software built at JIIT-128.
            </p>
          </div>

          {/* Mobile Quick Builder Selector Strip (Visible on mobile & tablet) */}
          <div className="w-full lg:hidden mb-6">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-flame flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse" />
                Quick Select Builder
              </span>
              <span className="font-mono text-[10px] text-ash/60">
                Swipe &bull; {LEADERBOARD_REPOS.length} total
              </span>
            </div>

            <div className="w-full flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth touch-pan-x [-webkit-overflow-scrolling:touch]">
              {LEADERBOARD_REPOS.map((repo) => {
                const isSelected = repo.id === selectedRepoId;
                return (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => handleSelectRepo(repo.id)}
                    className={`shrink-0 flex items-center gap-2 rounded-2xl px-3 py-2 border transition-all touch-manipulation cursor-pointer active:scale-95 ${
                      isSelected
                        ? "border-flame bg-flame/15 text-bone shadow-[0_0_15px_rgba(255,122,26,0.25)]"
                        : "border-white/10 bg-white/[0.03] text-ash hover:border-white/20 hover:text-bone"
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-xl font-mono text-[11px] font-bold flex items-center justify-center border ${
                        isSelected
                          ? "border-flame bg-flame text-ink"
                          : "border-white/10 bg-white/[0.05] text-bone"
                      }`}
                    >
                      {repo.builder.avatarText}
                    </div>
                    <div className="text-left">
                      <div
                        className={`font-display text-xs font-semibold leading-tight ${
                          isSelected ? "text-flame font-bold" : "text-bone"
                        }`}
                      >
                        {repo.builder.name}
                      </div>
                      <div className="font-mono text-[9px] text-ash/70 leading-tight">
                        {repo.week}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clean 2-Column Split Layout */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left: Featured Repo + Builder Showcase */}
            <div ref={spotlightRef} className="w-full col-span-1 lg:col-span-8 scroll-mt-24">
              <RepoSpotlight repo={selectedRepo} />
            </div>

            {/* Right: Clean Minimal Leaderboard */}
            <div id="leaderboard-section" className="w-full col-span-1 lg:col-span-4 lg:sticky lg:top-24 scroll-mt-24">
              <Leaderboard
                repos={LEADERBOARD_REPOS}
                selectedRepoId={selectedRepoId}
                onSelectRepo={handleSelectRepo}
              />
            </div>
          </div>

          {/* Previous Weekly Spotlights Archive */}
          <div id="archive-section" className="w-full max-w-full overflow-hidden scroll-mt-24">
            <PreviousSpotlights
              repos={LEADERBOARD_REPOS}
              currentRepoId={selectedRepoId}
              onSelectRepo={handleSelectRepo}
            />
          </div>
        </div>

        {/* Minimal Moving Sponsors Marquee with Logos & Colorful Hover */}
        <div className="w-full max-w-full overflow-hidden mt-16">
          <SponsorsMarquee />
        </div>
      </main>

      {/* Floating Action Button at bottom right */}
      <SubmitProjectModal />

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
