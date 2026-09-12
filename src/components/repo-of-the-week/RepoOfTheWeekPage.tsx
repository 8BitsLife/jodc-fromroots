import { useState, useEffect } from "react";
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
    window.scrollTo({ top: 100, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative min-h-screen bg-ink text-bone"
    >
      {/* Subtle background radial glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame/10 blur-[160px]" />
      </div>

      <main id="main" className="pt-20 sm:pt-28 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
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
          <div className="max-w-3xl mb-7 sm:mb-9">
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

          {/* Clean 2-Column Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left: Featured Repo + Builder Showcase */}
            <div className="lg:col-span-8">
              <RepoSpotlight repo={selectedRepo} />
            </div>

            {/* Right: Clean Minimal Leaderboard */}
            <div className="lg:col-span-4 sticky top-24">
              <Leaderboard
                repos={LEADERBOARD_REPOS}
                selectedRepoId={selectedRepoId}
                onSelectRepo={handleSelectRepo}
              />
            </div>
          </div>

          {/* Previous Weekly Spotlights Archive */}
          <PreviousSpotlights
            repos={LEADERBOARD_REPOS}
            currentRepoId={selectedRepoId}
            onSelectRepo={handleSelectRepo}
          />
        </div>

        {/* Minimal Moving Sponsors Marquee with Logos & Colorful Hover */}
        <div className="mt-16">
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
