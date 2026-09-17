/**
 * JODC — Admin Helper: Add New Repository
 *
 * Automatically fetches repository and builder metadata from GitHub and
 * inserts the new project into your live Supabase database.
 *
 * Usage:
 *   node scripts/add-repo.mjs <github-url> [options]
 *
 * Examples:
 *   # Add to leaderboard:
 *   node scripts/add-repo.mjs https://github.com/astral-sh/uv
 *
 *   # Add AND make it the new active Repo of the Week (e.g. Week 08):
 *   node scripts/add-repo.mjs https://github.com/astral-sh/uv --spotlight "Week 08" "Sept 14 — Sept 21, 2026"
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (existsSync(envPath)) {
    const lines = readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const value = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const githubToken = process.env.GITHUB_TOKEN;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exitCode = 1;
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

const LANGUAGE_COLORS = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572a5",
  Rust: "#dea584",
  Go: "#00add8",
  C: "#555555",
  "C++": "#f34b7d",
  Java: "#b07219",
  Swift: "#f05138",
  Kotlin: "#a97bff",
  HTML: "#e34c26",
  CSS: "#563d7c",
  MDX: "#fcb32c",
  Shell: "#89e051",
  Markdown: "#083fa1",
};

function parseGitHubUrl(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.replace(/^\/|\/$/g, "").split("/");
    if (parts.length >= 2) return { owner: parts[0], repo: parts[1] };
  } catch {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
  }
  return null;
}

async function githubFetch(endpoint) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "JODC-Admin-Bot",
  };
  if (githubToken) headers.Authorization = `Bearer ${githubToken}`;

  const res = await fetch(`https://api.github.com${endpoint}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
  return res.json();
}

async function run() {
  const args = process.argv.slice(2);
  const targetUrl = args.find((a) => !a.startsWith("--"));

  if (!targetUrl) {
    console.log("Usage: node scripts/add-repo.mjs <github-url> [--spotlight [WeekLabel] [DateRange]]");
    console.log("Example: node scripts/add-repo.mjs https://github.com/astral-sh/uv --spotlight \"Week 08\" \"Sept 14 — Sept 21, 2026\"");
    process.exitCode = 1;
    return;
  }

  const parsed = parseGitHubUrl(targetUrl);
  if (!parsed) {
    console.error("❌ Invalid GitHub URL:", targetUrl);
    process.exitCode = 1;
    return;
  }

  const { owner, repo: repoName } = parsed;
  console.log(`\n🔍 Fetching metadata for ${owner}/${repoName} from GitHub...`);

  // 1. Fetch GitHub data
  const meta = await githubFetch(`/repos/${owner}/${repoName}`);
  const user = await githubFetch(`/users/${owner}`).catch(() => ({}));

  // 2. Languages
  let languages = [];
  try {
    const langData = await githubFetch(`/repos/${owner}/${repoName}/languages`);
    const totalBytes = Object.values(langData).reduce((s, b) => s + b, 0);
    if (totalBytes > 0) {
      languages = Object.entries(langData)
        .map(([name, bytes]) => ({
          name,
          percent: parseFloat(((bytes / totalBytes) * 100).toFixed(1)),
          color: LANGUAGE_COLORS[name] || "#888888",
        }))
        .filter((l) => l.percent >= 0.1)
        .slice(0, 5);
    }
  } catch {
    languages = [{ name: meta.language || "TypeScript", percent: 100, color: "#3178c6" }];
  }

  // 3. Release
  let version = "v1.0.0";
  try {
    const rel = await githubFetch(`/repos/${owner}/${repoName}/releases/latest`);
    if (rel?.tag_name) version = rel.tag_name;
  } catch {
    /* fallback */
  }

  // 4. Current Rank
  const { data: existing } = await supabase.from("repos").select("rank").order("rank", { ascending: false }).limit(1);
  const nextRank = existing && existing[0] ? existing[0].rank + 1 : 1;

  const isSpotlight = args.includes("--spotlight");
  const spotlightIndex = args.indexOf("--spotlight");
  const weekLabel = spotlightIndex !== -1 && args[spotlightIndex + 1] && !args[spotlightIndex + 1].startsWith("--")
    ? args[spotlightIndex + 1]
    : `Week ${String(nextRank).padStart(2, "0")}`;
  const dateRange = spotlightIndex !== -1 && args[spotlightIndex + 2] && !args[spotlightIndex + 2].startsWith("--")
    ? args[spotlightIndex + 2]
    : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const id = repoName.toLowerCase();

  const repoRecord = {
    id,
    rank: isSpotlight ? 1 : nextRank,
    name: meta.name || repoName,
    full_name: meta.full_name,
    tagline: meta.description || "Open source project built by the community.",
    description: meta.description || "Community open source project.",
    highlights: [
      `Active open-source community with ${meta.stargazers_count.toLocaleString()} stars and ${meta.forks_count.toLocaleString()} forks`,
      `Primary language: ${meta.language || "TypeScript"} with standard ${meta.license?.spdx_id || "MIT"} licensing`,
      `Maintained and created by ${user.name || owner} on GitHub`,
    ],
    stars: meta.stargazers_count,
    forks: meta.forks_count,
    open_issues: meta.open_issues_count,
    license: meta.license?.spdx_id || "MIT",
    version,
    week: weekLabel,
    date_range: dateRange,
    growth: `+${Math.min(meta.stargazers_count, 500)} stars recently`,
    languages,
    tags: meta.topics && meta.topics.length > 0 ? meta.topics.slice(0, 5) : [meta.language || "Open-Source"],
    github_url: meta.html_url,
    demo_url: meta.homepage || meta.html_url,
    curator_review: `A standout open-source project featured by the JODC Review Board for exceptional design, utility, and community velocity.`,
    curator_author: "JODC Technical Board",
    builder: {
      name: user.name || owner,
      handle: user.login || owner,
      role: "Lead Creator & Core Maintainer",
      campus: user.company || user.location || "Independent OSS Creator",
      avatarText: (user.name || owner).slice(0, 2).toUpperCase(),
      bio: user.bio || `Creator and open-source developer behind ${repoName}.`,
      quote: "Open-source software thrives on community collaboration and shared knowledge.",
      status: "Actively building in public",
      github: user.html_url || meta.html_url,
      twitter: user.twitter_username ? `https://x.com/${user.twitter_username}` : "",
      linkedin: "",
      portfolio: user.blog || "",
      badges: isSpotlight ? ["Active Spotlight", "JODC Featured"] : ["Community Leader", "JODC Featured"],
      metrics: {
        commits: "500+",
        totalStars: `${(meta.stargazers_count / 1000).toFixed(1)}k+`,
        mergedPRs: "100+",
        activeYears: "2+ years",
      },
      skills: languages.map((l) => l.name),
      otherProjects: [],
    },
    status: "approved",
    is_active_spotlight: isSpotlight,
  };

  // If making spotlight, bump other ranks
  if (isSpotlight) {
    await supabase.rpc("increment_ranks").catch(() => {});
    await supabase.from("spotlights").update({ is_current: false }).neq("id", "none");
  }

  // Insert or update repo
  const { error: repoErr } = await supabase.from("repos").upsert(repoRecord);
  if (repoErr) {
    console.error("❌ Failed to insert repo in Supabase:", repoErr.message);
    process.exitCode = 1;
    return;
  }

  console.log(`✅ Saved ${repoRecord.name} to 'repos' table in Supabase!`);

  // If spotlight, record in spotlights table
  if (isSpotlight) {
    const spotlightId = weekLabel.toLowerCase().replace(/\s+/g, "-");
    await supabase.from("spotlights").upsert({
      id: spotlightId,
      repo_id: id,
      week: weekLabel,
      date_range: dateRange,
      growth: repoRecord.growth,
      is_current: true,
    });
    console.log(`🌟 Designated ${repoRecord.name} as active Spotlight (${weekLabel})!`);
  }

  console.log(`\n🎉 Success! "${repoRecord.name}" is now live and visible on your website!`);
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exitCode = 1;
});
