import { Star, ChevronRight } from "lucide-react";
import type { LeaderboardRepo } from "../../data/repoOfTheWeek";

interface LeaderboardProps {
  repos: LeaderboardRepo[];
  selectedRepoId: string;
  onSelectRepo: (id: string) => void;
}

export function Leaderboard({
  repos,
  selectedRepoId,
  onSelectRepo,
}: LeaderboardProps) {
  return (
    <aside
      aria-label="Community Builders Leaderboard"
      className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-flame block">
            Community
          </span>
          <h3 className="font-display text-base font-semibold text-bone">
            Featured Builders
          </h3>
        </div>
        <span className="font-mono text-[11px] text-ash/60">{repos.length} Builders</span>
      </div>

      {/* Compact and scrollable list */}
      <div className="mt-2.5 max-h-[290px] overflow-y-auto pr-1 space-y-1 no-scrollbar scroll-smooth touch-pan-y">
        {repos.map((repo) => {
          const isSelected = repo.id === selectedRepoId;

          return (
            <button
              key={repo.id}
              type="button"
              onClick={() => onSelectRepo(repo.id)}
              className={`group w-full flex items-center justify-between rounded-xl px-3 py-2.5 sm:py-2 text-left transition-all duration-200 border cursor-pointer touch-manipulation min-h-[44px] ${
                isSelected
                  ? "border-flame/40 bg-flame/[0.08] text-bone shadow-[0_0_15px_rgba(255,122,26,0.12)]"
                  : "border-transparent bg-transparent text-ash hover:border-white/10 hover:bg-white/[0.03] hover:text-bone"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`font-mono text-[11px] font-bold w-5 shrink-0 ${
                    isSelected ? "text-flame" : "text-ash/50 group-hover:text-ash"
                  }`}
                >
                  {String(repo.rank).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  {/* Builder Name displayed as main title */}
                  <div
                    className={`font-display text-xs sm:text-sm font-semibold truncate transition-colors ${
                      isSelected ? "text-flame font-bold" : "text-bone group-hover:text-flame"
                    }`}
                  >
                    {repo.builder.name}
                  </div>
                  {/* Repo Name displayed as secondary detail */}
                  <div className="font-mono text-[10px] text-ash/70 truncate">
                    {repo.name}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <span className="flex items-center gap-1 font-mono text-[10px] text-ash/70">
                  <Star size={10} className={isSelected ? "text-flame" : "text-ash/40"} />
                  {repo.stars.toLocaleString()}
                </span>
                <ChevronRight
                  size={12}
                  className={`transition-transform ${
                    isSelected
                      ? "text-flame translate-x-0.5"
                      : "text-ash/30 group-hover:text-ash/60 group-hover:translate-x-0.5"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
