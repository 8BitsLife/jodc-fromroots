import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { LEADERBOARD_REPOS, type LeaderboardRepo } from "../data/repoOfTheWeek";

export interface ProjectSubmissionPayload {
  githubUrl: string;
  repoName: string;
  tagline?: string;
  category?: string;
  submitterName: string;
  submitterEmail: string;
  submitterHandle?: string;
  campusYear?: string;
  demoUrl?: string;
  pitch?: string;
}

interface DbRepoRow {
  id: string;
  rank: number;
  name: string;
  full_name: string;
  tagline: string;
  description: string;
  highlights: string[];
  stars: number;
  forks: number;
  open_issues: number;
  license: string;
  version: string;
  week: string;
  date_range: string;
  growth: string;
  languages: LeaderboardRepo["languages"];
  tags: string[];
  github_url: string;
  demo_url: string;
  curator_review: string;
  curator_author: string;
  builder: LeaderboardRepo["builder"];
}

function mapRowToLeaderboardRepo(row: DbRepoRow): LeaderboardRepo {
  return {
    id: row.id,
    rank: row.rank,
    name: row.name,
    fullName: row.full_name,
    tagline: row.tagline,
    description: row.description,
    highlights: Array.isArray(row.highlights) ? row.highlights : [],
    stars: row.stars,
    forks: row.forks,
    openIssues: row.open_issues,
    license: row.license,
    version: row.version,
    week: row.week,
    dateRange: row.date_range,
    growth: row.growth,
    languages: Array.isArray(row.languages) ? row.languages : [],
    tags: Array.isArray(row.tags) ? row.tags : [],
    githubUrl: row.github_url,
    demoUrl: row.demo_url,
    curatorReview: row.curator_review,
    curatorAuthor: row.curator_author,
    builder: row.builder,
  };
}

/**
 * Fetches all approved repos sorted by rank.
 * Falls back to static LEADERBOARD_REPOS if Supabase is unavailable.
 */
export async function getLeaderboardRepos(): Promise<LeaderboardRepo[]> {
  if (!isSupabaseConfigured || !supabase) {
    return LEADERBOARD_REPOS;
  }

  try {
    const { data, error } = await supabase
      .from("repos")
      .select("*")
      .eq("status", "approved")
      .order("rank", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("Supabase repos fetch error or empty, using static fallback:", error);
      return LEADERBOARD_REPOS;
    }

    return (data as DbRepoRow[]).map(mapRowToLeaderboardRepo);
  } catch (err) {
    console.error("Failed to fetch repos from Supabase:", err);
    return LEADERBOARD_REPOS;
  }
}

/**
 * Submits a student repository to the submissions table in Supabase.
 * Gracefully handles extended columns (tagline, category, demo_url, campus_year).
 */
export async function submitProject(payload: ProjectSubmissionPayload): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      success: false,
      message: "Database connection is not configured. Please check your .env settings.",
    };
  }

  const baseRow = {
    github_url: payload.githubUrl.trim(),
    repo_name: payload.repoName.trim(),
    submitter_name: payload.submitterName.trim(),
    submitter_email: payload.submitterEmail.trim(),
    submitter_handle: payload.submitterHandle?.trim() || null,
    pitch: payload.pitch?.trim() || null,
    status: "pending",
  };

  const extendedRow = {
    ...baseRow,
    tagline: payload.tagline?.trim() || null,
    category: payload.category?.trim() || null,
    demo_url: payload.demoUrl?.trim() || null,
    campus_year: payload.campusYear?.trim() || null,
  };

  try {
    // Attempt insert with extended fields
    const { error: extError } = await supabase.from("submissions").insert([extendedRow]);

    if (!extError) {
      return { success: true, message: "Project submitted successfully to the JODC database!" };
    }

    // If extended columns don't exist yet, fall back to base columns
    if (extError.message && extError.message.includes("column")) {
      const { error: baseError } = await supabase.from("submissions").insert([baseRow]);
      if (!baseError) {
        return { success: true, message: "Project submitted successfully to the JODC database!" };
      }
      return { success: false, message: baseError.message || "Failed to submit project." };
    }

    return { success: false, message: extError.message || "Failed to submit project." };
  } catch (err: any) {
    console.error("Submission error:", err);
    return { success: false, message: err?.message || "A network error occurred while submitting." };
  }
}
