import { useState } from "react";
import { motion } from "framer-motion";
import { Github, Twitter, Globe, Copy, Check, Share2, Star, ExternalLink, TrendingUp } from "lucide-react";
import type { LeaderboardRepo } from "../../data/repoOfTheWeek";
import { Button } from "../Button";

interface RepoSpotlightProps {
  repo: LeaderboardRepo;
}

const ease = [0.16, 1, 0.3, 1] as const;

/** Copy text, tolerating browsers or contexts where the clipboard API is unavailable. */
async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function useFlash(): [boolean, () => void] {
  const [on, setOn] = useState(false);
  return [
    on,
    () => {
      setOn(true);
      window.setTimeout(() => setOn(false), 2000);
    },
  ];
}

/** Quiet text action: no outline, just an icon and a label that brighten on hover. */
const action =
  "inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm text-ash transition-colors hover:bg-white/[0.05] hover:text-bone";

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : String(n));

export function RepoSpotlight({ repo }: RepoSpotlightProps) {
  const [copiedClone, flashClone] = useFlash();
  const [copiedShare, flashShare] = useFlash();

  const cloneCmd = `git clone ${repo.githubUrl}.git`;
  const shareUrl = `${window.location.origin}/repo-of-the-week?repo=${repo.id}`;

  const handleShare = async () => {
    // Phones get the native share sheet; everywhere else the link is copied.
    if (navigator.share) {
      try {
        await navigator.share({ title: `${repo.name} — JODC Repo of the Week`, text: repo.tagline, url: shareUrl });
        return;
      } catch {
        /* dismissed — fall through to copying */
      }
    }
    if (await copy(shareUrl)) flashShare();
  };

  const stats: Array<[string, string]> = [
    ["Stars", compact(repo.stars)],
    ["Forks", compact(repo.forks)],
    ["Issues", compact(repo.openIssues)],
    ["License", repo.license],
    ["Release", repo.version],
  ];

  const builderLinks = [
    { href: repo.builder.github, label: "GitHub", Icon: Github },
    { href: repo.builder.twitter, label: "X", Icon: Twitter },
    { href: repo.builder.portfolio, label: "Website", Icon: Globe },
  ].filter((l) => Boolean(l.href));

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease }}
      className="rounded-3xl bg-white/[0.02] ring-1 ring-inset ring-white/[0.07]"
    >
      {/* ── Introduction ───────────────────────────────────────────────── */}
      <div className="p-6 sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-mono text-xs text-ash">
          <p>
            <span className="text-flame">{repo.week}</span>
            <span aria-hidden="true" className="mx-2 text-white/20">
              ·
            </span>
            {repo.dateRange}
          </p>
          {repo.growth && (
            <p className="flex items-center gap-1.5">
              <TrendingUp size={13} aria-hidden="true" className="text-flame" />
              {repo.growth}
            </p>
          )}
        </div>

        <h2 className="mt-8 break-words font-mono text-[clamp(2rem,4.5vw,3rem)] font-semibold leading-none tracking-[-0.03em] text-bone">
          {repo.name}
        </h2>
        <p className="mt-2 font-mono text-xs text-ash/80">{repo.fullName}</p>

        <p className="mt-7 max-w-2xl text-pretty text-lg leading-snug text-bone/90 sm:text-xl">{repo.tagline}</p>
        <p className="mt-4 max-w-2xl text-pretty text-[0.95rem] leading-relaxed text-ash">{repo.description}</p>

        <div className="mt-9 flex flex-wrap items-center gap-x-2 gap-y-3">
          <Button href={repo.githubUrl} external icon={Github} className="mr-2">
            View on GitHub
          </Button>

          <button type="button" onClick={async () => (await copy(cloneCmd)) && flashClone()} title={cloneCmd} className={action}>
            {copiedClone ? <Check size={15} aria-hidden="true" className="text-flame" /> : <Copy size={15} aria-hidden="true" />}
            <span className={`font-mono text-[13px] ${copiedClone ? "text-flame" : ""}`}>{copiedClone ? "Copied" : "git clone"}</span>
          </button>

          <a href={`${repo.githubUrl}/stargazers`} target="_blank" rel="noreferrer noopener" className={action}>
            <Star size={15} aria-hidden="true" />
            Star
          </a>

          {repo.demoUrl && (
            <a href={repo.demoUrl} target="_blank" rel="noreferrer noopener" className={action}>
              <ExternalLink size={15} aria-hidden="true" />
              Website
            </a>
          )}

          <button type="button" onClick={handleShare} className={action}>
            {copiedShare ? <Check size={15} aria-hidden="true" className="text-flame" /> : <Share2 size={15} aria-hidden="true" />}
            <span className={copiedShare ? "text-flame" : ""}>{copiedShare ? "Link copied" : "Share"}</span>
          </button>
        </div>
      </div>

      {/* ── Numbers ────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.06] px-6 py-7 sm:px-10">
        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash/80">{label}</dt>
              <dd className="mt-1 font-mono text-[0.95rem] tabular-nums text-bone">{value}</dd>
            </div>
          ))}
        </dl>

        {repo.languages.length > 0 && (
          <div className="mt-7">
            <div
              className="flex h-1 gap-0.5 overflow-hidden rounded-full"
              role="img"
              aria-label={repo.languages.map((l) => `${l.name} ${l.percent}%`).join(", ")}
            >
              {repo.languages.map((lang, i) => (
                <motion.span
                  key={lang.name}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.06, ease }}
                  className="h-full origin-left rounded-full opacity-80"
                  style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
                />
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 font-mono text-[11px] text-ash">
              {repo.languages.map((lang) => (
                <li key={lang.name} className="flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: lang.color }} />
                  {lang.name}
                  <span className="text-ash/60">{lang.percent}%</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── Context: highlights, why it was picked, who built it ───────── */}
      <div className="border-t border-white/[0.06] px-6 py-8 sm:px-10 sm:py-10">
        {repo.highlights.length > 0 && (
          <ul className="max-w-2xl space-y-3">
            {repo.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[0.95rem] leading-relaxed text-ash">
                <span aria-hidden="true" className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-flame/80" />
                {h}
              </li>
            ))}
          </ul>
        )}

        {repo.curatorReview && (
          <figure className="mt-9 max-w-2xl">
            <blockquote className="text-pretty font-serif text-[1.35rem] italic leading-snug text-bone/85">
              &ldquo;{repo.curatorReview}&rdquo;
            </blockquote>
            {repo.curatorAuthor && (
              <figcaption className="mt-3 font-mono text-[11px] text-ash">— {repo.curatorAuthor}</figcaption>
            )}
          </figure>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white/[0.025] p-4 sm:p-5">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.06] font-mono text-xs font-semibold text-bone">
              {repo.builder.avatarText}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-bone">{repo.builder.name}</p>
              <p className="truncate font-mono text-[11px] text-ash">
                @{repo.builder.handle} · {repo.builder.role}
              </p>
            </div>
          </div>

          <div className="flex items-center">
            {builderLinks.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${repo.builder.name} on ${label}`}
                className="flex h-10 w-10 items-center justify-center rounded-full text-ash transition-colors hover:bg-white/[0.06] hover:text-bone"
              >
                <Icon size={16} aria-hidden="true" />
              </a>
            ))}
          </div>

          {repo.builder.quote && (
            <p className="basis-full text-pretty font-serif text-[0.95rem] italic leading-relaxed text-ash">
              &ldquo;{repo.builder.quote}&rdquo;
            </p>
          )}
        </div>
      </div>
    </motion.article>
  );
}
