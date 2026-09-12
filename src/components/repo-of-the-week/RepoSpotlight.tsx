import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Star,
  ExternalLink,
  Twitter,
  Globe,
  Quote,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import type { LeaderboardRepo } from "../../data/repoOfTheWeek";

interface RepoSpotlightProps {
  repo: LeaderboardRepo;
}

export function RepoSpotlight({ repo }: RepoSpotlightProps) {
  const [starred, setStarred] = useState(false);
  const currentStars = starred ? repo.stars + 1 : repo.stars;

  const handleToggleStar = () => {
    setStarred(!starred);
  };

  return (
    <motion.article
      key={repo.id}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.02] p-5 sm:p-8 md:p-10 backdrop-blur-2xl"
    >
      {/* Subtle top ambient gradient hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame/60 to-transparent" />

      {/* Header Tag */}
      <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-flame/30 bg-flame/10 px-3 py-1 font-mono text-[11px] font-semibold text-flame">
          <Flame size={12} />
          {repo.week} Spotlight
        </span>
        <span className="font-mono text-xs text-ash/50">&bull;</span>
        <span className="font-mono text-xs text-ash/70">{repo.dateRange}</span>
      </div>

      {/* Title */}
      <h2 className="font-mono text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-bone break-words">
        {repo.name}
      </h2>

      {/* Aesthetic High-End Description Box */}
      <div className="mt-6 relative overflow-hidden rounded-2xl border border-white/[0.09] bg-gradient-to-br from-white/[0.035] via-white/[0.015] to-transparent p-5 sm:p-6 shadow-inner backdrop-blur-md group hover:border-flame/35 transition-all duration-300">
        {/* Ambient warm corner glow */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-flame/[0.08] blur-2xl transition-opacity duration-300 group-hover:bg-flame/[0.14]" />

        {/* Header of the Description Box */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06] mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-flame" />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-bone/80">
              Overview
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {repo.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-ash/80 group-hover:text-bone group-hover:border-white/10 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <p className="text-base sm:text-lg font-medium text-bone/95 leading-snug">
          {repo.tagline}
        </p>

        {/* Detailed Explanation */}
        <p className="mt-3 text-xs sm:text-sm text-ash/90 leading-relaxed max-w-2xl">
          {repo.description}
        </p>
      </div>

      {/* Minimal Metadata Strip */}
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-ash/80 pt-5 border-t border-white/[0.06]">
        <span className="flex items-center gap-1.5 text-bone">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: repo.languages[0]?.color || "#ff7a1a" }}
          />
          {repo.languages[0]?.name}
        </span>
        <span className="text-white/20">&bull;</span>
        <span>{currentStars.toLocaleString()} Stars</span>
        <span className="text-white/20">&bull;</span>
        <span>{repo.forks} Forks</span>
        <span className="text-white/20">&bull;</span>
        <span>{repo.license}</span>
        <span className="text-white/20">&bull;</span>
        <span>{repo.version}</span>
      </div>

      {/* Primary Action Buttons */}
      <div className="mt-7 flex flex-wrap items-center gap-2.5 sm:gap-3">
        <a
          href={repo.githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-flame px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink transition-all hover:bg-flame-hot shadow-[0_0_20px_rgba(255,122,26,0.3)] touch-manipulation cursor-pointer"
        >
          <Github size={15} />
          <span>View on GitHub</span>
          <ArrowUpRight size={14} />
        </a>

        <button
          type="button"
          onClick={handleToggleStar}
          className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2.5 text-xs sm:text-sm font-medium transition-all touch-manipulation cursor-pointer ${
            starred
              ? "border-flame/60 bg-flame/15 text-flame"
              : "border-white/10 bg-white/[0.03] text-bone hover:border-white/20 hover:bg-white/[0.06]"
          }`}
        >
          <Star
            size={14}
            className={starred ? "fill-flame text-flame" : "text-ash"}
          />
          <span>{starred ? "Starred" : "Star"}</span>
          <span className="font-mono text-xs text-ash">
            {currentStars.toLocaleString()}
          </span>
        </button>

        {repo.demoUrl && (
          <a
            href={repo.demoUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs sm:text-sm font-medium text-ash transition-colors hover:text-bone hover:border-white/20"
          >
            <span>Demo</span>
            <ExternalLink size={12} className="opacity-60" />
          </a>
        )}
      </div>

      {/* Integrated Builder Details */}
      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-3.5">
            {/* Minimal Avatar Monogram */}
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.03] border border-white/10 flex items-center justify-center font-mono text-sm font-bold text-bone">
              {repo.builder.avatarText}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-base font-semibold text-bone">
                  {repo.builder.name}
                </span>
                <span className="font-mono text-xs text-ash/60">
                  @{repo.builder.handle}
                </span>
              </div>
              <div className="font-mono text-xs text-ash/70 mt-0.5">
                {repo.builder.role}
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href={repo.builder.github}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-ash hover:text-bone hover:border-flame/40 transition-colors"
              aria-label="GitHub profile"
            >
              <Github size={14} />
            </a>
            <a
              href={repo.builder.twitter}
              target="_blank"
              rel="noreferrer noopener"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-ash hover:text-bone hover:border-flame/40 transition-colors"
              aria-label="Twitter / X profile"
            >
              <Twitter size={14} />
            </a>
            {repo.builder.portfolio && (
              <a
                href={repo.builder.portfolio}
                target="_blank"
                rel="noreferrer noopener"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-ash hover:text-bone hover:border-flame/40 transition-colors"
                aria-label="Website"
              >
                <Globe size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Builder's Quote */}
        <div className="mt-4 flex items-start gap-2.5">
          <Quote size={16} className="text-flame/40 shrink-0 mt-0.5" />
          <p className="font-serif italic text-xs sm:text-sm text-bone/80 leading-relaxed">
            &ldquo;{repo.builder.quote}&rdquo;
          </p>
        </div>
      </div>
    </motion.article>
  );
}
