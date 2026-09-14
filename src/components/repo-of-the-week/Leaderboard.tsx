import { useState, useMemo } from "react";
import { Star, ChevronDown, Search, X } from "lucide-react";
import type { LeaderboardRepo } from "../../data/repoOfTheWeek";

interface LeaderboardProps {
  repos: LeaderboardRepo[];
  selectedRepoId: string;
  onSelectRepo: (id: string) => void;
}

export function Leaderboard({ repos, selectedRepoId, onSelectRepo }: LeaderboardProps) {
  const [query, setQuery] = useState("");
  // Open beside the spotlight on desktop; on smaller screens it waits to be asked,
  // since the swipe strip above already handles picking a week there.
  const [expanded, setExpanded] = useState(() => window.matchMedia("(min-width: 1024px)").matches);

  const filteredRepos = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return repos;
    return repos.filter(
      (r) =>
        r.builder.name.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q)) ||
        r.languages.some((l) => l.name.toLowerCase().includes(q)),
    );
  }, [repos, query]);

  return (
    <aside aria-label="All spotlights" className="overflow-hidden rounded-3xl bg-white/[0.02] ring-1 ring-inset ring-white/[0.08]">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="leaderboard-list"
        className="flex w-full items-center justify-between gap-3 p-5 text-left"
      >
        <span>
          <span className="kicker block text-flame">Leaderboard</span>
          <span className="mt-1.5 block text-lg font-medium tracking-tight text-bone">All spotlights</span>
          <span className="mt-0.5 block font-mono text-[11px] text-ash">
            {query ? `${filteredRepos.length} of ${repos.length}` : `${repos.length} weeks`}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-all duration-300 ${
            expanded ? "rotate-180 bg-white/[0.06] text-bone ring-white/15" : "text-ash ring-white/10"
          }`}
        >
          <ChevronDown size={16} />
        </span>
      </button>

      {expanded && (
        <div id="leaderboard-list" className="border-t border-white/[0.06] p-3">
          <label className="relative block">
            <span className="sr-only">Filter by repo, builder, tag or language</span>
            <Search size={13} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter repo, builder or stack"
              className="h-10 w-full rounded-xl bg-white/[0.03] pl-9 pr-9 font-mono text-xs text-bone ring-1 ring-inset ring-white/10 transition-shadow placeholder:text-ash/60 focus:outline-none focus:ring-flame/50 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear filter"
                className="absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-ash hover:bg-white/[0.06] hover:text-bone"
              >
                <X size={13} aria-hidden="true" />
              </button>
            )}
          </label>

          <ol className="mt-2 max-h-[22rem] space-y-0.5 overflow-y-auto no-scrollbar">
            {filteredRepos.length === 0 ? (
              <li className="px-3 py-8 text-center font-mono text-xs text-ash">
                Nothing matches &ldquo;{query}&rdquo;.{" "}
                <button type="button" onClick={() => setQuery("")} className="text-flame hover:underline">
                  Clear
                </button>
              </li>
            ) : (
              filteredRepos.map((repo) => {
                const isSelected = repo.id === selectedRepoId;
                return (
                  <li key={repo.id}>
                    <button
                      type="button"
                      onClick={() => onSelectRepo(repo.id)}
                      aria-current={isSelected ? "true" : undefined}
                      className={`group relative flex min-h-[3.25rem] w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
                        isSelected ? "bg-flame/[0.08]" : "hover:bg-white/[0.04]"
                      }`}
                    >
                      {isSelected && <span aria-hidden="true" className="absolute inset-y-2.5 left-0 w-0.5 rounded-full bg-flame" />}
                      <span className={`w-6 shrink-0 font-mono text-[11px] ${isSelected ? "text-flame" : "text-ash"}`}>
                        {String(repo.rank).padStart(2, "0")}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className={`block truncate font-mono text-sm font-semibold ${isSelected ? "text-flame" : "text-bone group-hover:text-flame"}`}>
                          {repo.name}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 truncate font-mono text-[10px] text-ash">
                          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: repo.languages[0]?.color }} />
                          <span className="truncate">{repo.builder.name}</span>
                          <span aria-hidden="true" className="text-white/20">·</span>
                          <span className="shrink-0">{repo.week}</span>
                        </span>
                      </span>

                      <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] tabular-nums text-ash">
                        <Star size={11} aria-hidden="true" className={isSelected ? "fill-flame text-flame" : ""} />
                        {repo.stars >= 1000 ? `${(repo.stars / 1000).toFixed(1)}k` : repo.stars}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ol>
        </div>
      )}
    </aside>
  );
}
