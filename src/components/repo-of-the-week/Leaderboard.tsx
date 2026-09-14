import { useState, useMemo } from "react";
import { Star, ChevronRight, Search, X } from "lucide-react";
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
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const filteredRepos = useMemo(() => {
    if (!query.trim()) return repos;
    const q = query.toLowerCase().trim();
    return repos.filter(
      (r) =>
        r.builder.name.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.languages.some((l) => l.name.toLowerCase().includes(q))
    );
  }, [repos, query]);

  return (
    <aside
      aria-label="Community Builders Leaderboard"
      className="w-full rounded-3xl border border-white/[0.08] bg-white/[0.02] p-4 sm:p-5 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
    >
      <div className="flex items-center justify-between gap-3 pb-3.5">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-flame block">
            Community
          </span>
          <h3 className="font-display text-base font-semibold text-bone">
            Featured Builders
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-ash/70">
            Open the community list when you want to explore builders.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="shrink-0 rounded-full border border-flame/35 bg-flame/10 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-flame transition-all hover:bg-flame hover:text-ink touch-manipulation"
        >
          {expanded ? "Close" : "Explore"}
        </button>
      </div>

      {expanded && (
        <>
          <div className="mb-3 border-t border-white/[0.06] pt-3" />

          {/* Interactive Quick Search Bar */}
      <div className="mt-3 relative">
        <Search
          size={12}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ash/50 pointer-events-none"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter builder or stack..."
          className="w-full rounded-lg border border-white/10 bg-white/[0.03] pl-8 pr-7 py-1.5 font-mono text-xs text-bone placeholder:text-ash/40 focus:border-flame/50 focus:bg-white/[0.05] focus:outline-none transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-ash/60 hover:text-bone cursor-pointer p-0.5"
            aria-label="Clear filter"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Compact, responsive and touch-friendly scrollable list */}
      <div
        className="mt-3 max-h-[300px] overflow-y-auto pr-1 space-y-1 no-scrollbar scroll-smooth touch-pan-y [-webkit-overflow-scrolling:touch]"
      >
        {filteredRepos.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-ash/60">
            <p>No builders matched &quot;{query}&quot;</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-2 inline-flex items-center gap-1 text-flame hover:underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        ) : (
          filteredRepos.map((repo) => {
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
                    <div className="font-mono text-[10px] text-ash/70 truncate flex items-center gap-1">
                      <span>{repo.name}</span>
                      <span className="text-white/20">&bull;</span>
                      <span className="text-[9px] text-ash/50">{repo.languages[0]?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="flex items-center gap-1 font-mono text-[10px] text-ash/70">
                    <Star size={10} className={isSelected ? "text-flame fill-flame" : "text-ash/40"} />
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
          })
        )}
      </div>

        </>
      )}
    </aside>
  );
}
