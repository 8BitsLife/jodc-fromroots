/**
 * JODC — GitHub Repository Metrics Sync Worker
 *
 * This script synchronizes live star counts, forks, open issues, release versions,
 * and language percentages from the GitHub REST API into your Supabase `repos` table.
 *
 * Usage:
 *   node scripts/sync-github.mjs
 *
 * Requirements in your .env or environment:
 *   - VITE_SUPABASE_URL or SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)
 *   - GITHUB_TOKEN (Personal Access Token)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// 1. Simple .env parser to avoid extra dependencies
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
        if (!process.env[key]) {
          process.env[key] = value;
        }
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
  console.error("Please set them in your .env file or environment variables.");
  process.exitCode = 1;
  throw new Error("Missing Supabase credentials");
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Color mapping for common programming languages
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
  YARA: "#22ff88",
};

function parseGitHubUrl(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.replace(/^\/|\/$/g, "").split("/");
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  } catch {
    // Fallback regex
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
  }
  return null;
}

async function githubFetch(endpoint) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "JODC-RepoSync-Bot",
  };
  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(`https://api.github.com${endpoint}`, { headers });

  if (response.status === 403) {
    const rateLimitRemaining = response.headers.get("x-ratelimit-remaining");
    if (rateLimitRemaining === "0") {
      throw new Error("GitHub API rate limit exceeded. Ensure GITHUB_TOKEN is configured in .env!");
    }
  }

  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

async function syncAllRepos() {
  console.log("⚡ [JODC] Starting GitHub Repository Sync...");
  if (!githubToken) {
    console.warn("⚠️  Warning: GITHUB_TOKEN is not set. You may hit strict rate limits (60 req/hr).");
  } else {
    console.log("🔑 Authenticated with GITHUB_TOKEN.");
  }

  // Fetch all repos from Supabase
  const { data: repos, error } = await supabase.from("repos").select("*");
  if (error) {
    console.error("❌ Failed to fetch repositories from Supabase:", error.message || error);
    console.log("💡 Tip: Make sure you have run 'supabase/full_setup.sql' in your Supabase SQL Editor first!");
    process.exitCode = 1;
    return;
  }

  console.log(`📦 Found ${repos.length} repositories to sync in database.\n`);

  for (const repo of repos) {
    const parsed = parseGitHubUrl(repo.github_url);
    if (!parsed) {
      console.warn(`⏩ Skipping ${repo.name}: Unable to parse GitHub URL (${repo.github_url})`);
      continue;
    }

    const { owner, repo: repoName } = parsed;
    console.log(`🔄 Syncing: ${owner}/${repoName} (${repo.name})...`);

    try {
      // 1. Get Repo Metadata
      const meta = await githubFetch(`/repos/${owner}/${repoName}`);

      // 2. Get Language Breakdown
      let languages = repo.languages;
      try {
        const langData = await githubFetch(`/repos/${owner}/${repoName}/languages`);
        const totalBytes = Object.values(langData).reduce((sum, bytes) => sum + bytes, 0);
        if (totalBytes > 0) {
          languages = Object.entries(langData)
            .map(([name, bytes]) => ({
              name,
              percent: parseFloat(((bytes / totalBytes) * 100).toFixed(1)),
              color: LANGUAGE_COLORS[name] || "#888888",
            }))
            .filter((lang) => lang.percent >= 0.1)
            .slice(0, 5);
        }
      } catch (err) {
        console.warn(`  ↳ Note: Languages not updated (${err.message})`);
      }

      // 3. Get Latest Release Tag (if available)
      let version = repo.version;
      try {
        const release = await githubFetch(`/repos/${owner}/${repoName}/releases/latest`);
        if (release && release.tag_name) {
          version = release.tag_name;
        }
      } catch {
        // Many repos don't use releases, keep existing version
      }

      // 4. Update in Supabase
      const { error: updateErr } = await supabase
        .from("repos")
        .update({
          stars: meta.stargazers_count,
          forks: meta.forks_count,
          open_issues: meta.open_issues_count,
          license: meta.license?.spdx_id || repo.license,
          version,
          languages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", repo.id);

      if (updateErr) {
        console.error(`  ❌ Update failed for ${repo.name}:`, updateErr.message);
      } else {
        console.log(
          `  ✅ Synced: ⭐ ${meta.stargazers_count} stars | 🍴 ${meta.forks_count} forks | 🏷️ ${version}`
        );
      }
    } catch (err) {
      console.error(`  ❌ Failed to sync ${owner}/${repoName}:`, err.message);
    }

    // Gentle throttle to respect GitHub API
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log("\n🎉 [JODC] All repositories synchronized successfully!\n");
}

syncAllRepos().catch((err) => {
  console.error("Fatal sync error:", err);
  process.exitCode = 1;
});
