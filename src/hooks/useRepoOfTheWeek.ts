import { useState, useEffect, useCallback } from "react";
import { LEADERBOARD_REPOS, type LeaderboardRepo } from "../data/repoOfTheWeek";
import { getLeaderboardRepos } from "../services/repoService";
import { isSupabaseConfigured } from "../lib/supabase";

function getInitialRepoId(initialRepos: LeaderboardRepo[]): string {
  const urlParam = new URLSearchParams(window.location.search).get("repo");
  if (urlParam && initialRepos.some((r) => r.id === urlParam)) {
    return urlParam;
  }
  return initialRepos[0]?.id ?? "superset";
}

export function useRepoOfTheWeek() {
  const [repos, setRepos] = useState<LeaderboardRepo[]>(LEADERBOARD_REPOS);
  const [selectedRepoId, setSelectedRepoId] = useState<string>(() => getInitialRepoId(LEADERBOARD_REPOS));
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const fetchRepos = useCallback(async () => {
    if (!isSupabaseConfigured) return;

    setIsLoading(true);
    try {
      const liveRepos = await getLeaderboardRepos();
      if (liveRepos && liveRepos.length > 0) {
        setRepos(liveRepos);
        setIsLive(true);

        // Keep current selectedRepoId if valid, otherwise adjust to first
        setSelectedRepoId((prev) => (liveRepos.some((r) => r.id === prev) ? prev : liveRepos[0].id));
      }
    } catch (err) {
      console.warn("Could not load live repos, using static data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const selectRepo = useCallback(
    (id: string) => {
      setSelectedRepoId(id);

      const url = new URL(window.location.href);
      const topId = repos[0]?.id;
      if (id === topId) {
        url.searchParams.delete("repo");
      } else {
        url.searchParams.set("repo", id);
      }
      window.history.replaceState(null, "", url);
    },
    [repos]
  );

  const selectedRepo = repos.find((r) => r.id === selectedRepoId) ?? repos[0] ?? LEADERBOARD_REPOS[0];

  return {
    repos,
    selectedRepo,
    selectedRepoId,
    selectRepo,
    isLoading,
    isLive,
    refresh: fetchRepos,
  };
}
