import { useState, useEffect, useRef, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { LEADERBOARD_REPOS } from "../../data/repoOfTheWeek";
import { RepoSpotlight } from "./RepoSpotlight";
import { Leaderboard } from "./Leaderboard";
import { PreviousSpotlights } from "./PreviousSpotlights";
import { SponsorsMarquee } from "./SponsorsMarquee";
import { SubmitProjectModal } from "./SubmitProjectModal";
import { Footer } from "../Footer";
import { Reveal } from "../Reveal";
import type { Route } from "../../hooks/useRoute";

interface RepoOfTheWeekPageProps {
  onBackToHome: () => void;
  onNavigate?: (route: Route, sectionId?: string) => void;
}

const ease = [0.16, 1, 0.3, 1] as const;
const LATEST = LEADERBOARD_REPOS[0];

/** `?repo=<id>` makes any spotlight linkable; unknown ids fall back to the latest week. */
function repoFromUrl(): string {
  const id = new URLSearchParams(window.location.search).get("repo");
  return LEADERBOARD_REPOS.some((r) => r.id === id) ? (id as string) : LATEST.id;
}

export function RepoOfTheWeekPage({ onBackToHome, onNavigate }: RepoOfTheWeekPageProps) {
  const [selectedRepoId, setSelectedRepoId] = useState<string>(repoFromUrl);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const selectedRepo = LEADERBOARD_REPOS.find((r) => r.id === selectedRepoId) ?? LATEST;

  // Arriving on the page starts at the top — once, not on every selection.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    document.title = `${selectedRepo.name} — JODC Repo of the Week`;
    return () => {
      document.title = "JODC — JIIT-128 Open Source Development Club";
    };
  }, [selectedRepo.name]);

  const handleSelectRepo = (id: string) => {
    setSelectedRepoId(id);

    const url = new URL(window.location.href);
    if (id === LATEST.id) url.searchParams.delete("repo");
    else url.searchParams.set("repo", id);
    window.history.replaceState(null, "", url);

    if (spotlightRef.current) {
      const top = spotlightRef.current.getBoundingClientRect().top + window.scrollY - 96;
      // Only scroll when the spotlight's top is out of view.
      if (Math.abs(top - window.scrollY) > 40) {
        window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      }
    }
  };

  const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackToHome();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative min-h-screen w-full max-w-full overflow-x-clip pt-[68px] text-bone"
    >
      <main id="main" className="w-full pb-8">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <section className="px-5 pb-10 pt-10 sm:px-8 sm:pb-14 sm:pt-14">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-4">
              <a
                href="/"
                onClick={goHome}
                className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs text-ash transition-colors hover:text-bone"
              >
                <ArrowLeft size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1" />
                <span>JODC</span>
                <span aria-hidden="true" className="text-white/20">/</span>
                <span className="text-bone">Repo of the Week</span>
              </a>

              <span className="glass relative hidden items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-bone sm:inline-flex">
                <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
                  <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-flame" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame" />
                </span>
                Live · {LATEST.week}
              </span>
            </nav>

            <div className="mt-12 lg:mt-14">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span className="kicker text-flame">Community spotlight</span>
                  <span className="kicker">{LATEST.dateRange}</span>
                </div>
              </Reveal>
              <h1 className="mt-6 overflow-hidden pb-[0.08em] text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-bone">
                <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease }}>
                  Repo of the <span className="accent">week.</span>
                </motion.span>
              </h1>
            </div>
          </div>
        </section>

        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
          {/* Quick selector for phones and tablets; the leaderboard does this job on desktop. */}
          <div className="mb-6 lg:hidden">
            <div className="mb-3 flex items-center justify-between">
              <span className="kicker text-flame">Pick a week</span>
              <span className="font-mono text-[10px] text-ash">Swipe · {LEADERBOARD_REPOS.length} spotlights</span>
            </div>

            <div className="-mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-2 no-scrollbar sm:-mx-8 sm:px-8">
              {LEADERBOARD_REPOS.map((repo) => {
                const isSelected = repo.id === selectedRepoId;
                return (
                  <button
                    key={repo.id}
                    type="button"
                    onClick={() => handleSelectRepo(repo.id)}
                    aria-pressed={isSelected}
                    className={`flex min-h-12 shrink-0 snap-start items-center gap-2.5 rounded-2xl py-2 pl-2 pr-4 ring-1 ring-inset transition-colors ${
                      isSelected ? "bg-flame/10 text-bone ring-flame/50" : "bg-white/[0.03] text-ash ring-white/10 hover:text-bone hover:ring-white/20"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-[11px] font-semibold ${
                        isSelected ? "bg-flame text-ink" : "bg-white/[0.06] text-bone"
                      }`}
                    >
                      {repo.builder.avatarText}
                    </span>
                    <span className="text-left">
                      <span className={`block font-mono text-xs font-semibold leading-tight ${isSelected ? "text-flame" : "text-bone"}`}>
                        {repo.name}
                      </span>
                      <span className="block font-mono text-[10px] leading-tight text-ash">{repo.week}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
            <div ref={spotlightRef} className="scroll-mt-28 lg:col-span-8">
              <RepoSpotlight key={selectedRepo.id} repo={selectedRepo} />
            </div>

            <div id="leaderboard-section" className="scroll-mt-28 lg:sticky lg:top-24 lg:col-span-4">
              <Leaderboard repos={LEADERBOARD_REPOS} selectedRepoId={selectedRepoId} onSelectRepo={handleSelectRepo} />
            </div>
          </div>

          <div id="archive-section" className="scroll-mt-24">
            <PreviousSpotlights repos={LEADERBOARD_REPOS} currentRepoId={selectedRepoId} onSelectRepo={handleSelectRepo} />
          </div>
        </div>

        <SponsorsMarquee />
      </main>

      <SubmitProjectModal />

      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
