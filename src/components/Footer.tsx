import { Github, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { LINKS, SITE } from "../data/site"
import { LogoMark } from "./LogoMark";
import { JODCSignature } from "./JODCSignature";
import type { Route } from "../hooks/useRoute";

interface FooterProps {
  onNavigate?: (route: Route, sectionId?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-transparent px-4 pt-14 pb-12 sm:px-8 sm:pt-16">
      {/* Top ambient hairline gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame/50 to-transparent" />

      {/* Ambient background soft glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-48 w-[600px] rounded-full bg-flame/[0.03] blur-[140px]" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/[0.06]">
          {/* Brand Info (4 cols) */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <a
                href="#top"
                className="inline-flex items-center gap-3 text-bone group"
                aria-label={`${SITE.name} home`}
              >
                <LogoMark size={36} />
                <span className="font-display text-2xl font-bold tracking-tight">
                  JODC<span className="text-flame">.</span>
                </span>
              </a>

              <p className="mt-4 text-sm leading-relaxed text-ash max-w-sm">
                {SITE.longName}. {SITE.tagline}
              </p>
            </div>
          </div>

          {/* Explore JODC — every button routes to its real destination */}
          <div className="md:col-span-5">
            <span className="font-mono text-xs uppercase tracking-widest text-ash/80 block mb-4">Explore JODC</span>
            <div className="grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-2">
              {[
                { label: "Repo of the Week", action: () => onNavigate?.("repo-of-the-week") },
                { label: "Hackathon", action: () => onNavigate?.("hackathon") },
                { label: "Team", action: () => onNavigate?.("team") },
                { label: "About", action: () => onNavigate?.("home", "about") },
                { label: "What we do", action: () => onNavigate?.("home", "what-we-do") },
                { label: "Contribute", action: () => onNavigate?.("home", "contribute") },
                { label: "Programs", action: () => onNavigate?.("home", "programs") },
                { label: "Events", action: () => onNavigate?.("home", "events") },
                { label: "Join", action: () => onNavigate?.("home", "join") },
              ].map((item) => (
                <button key={item.label} type="button" onClick={item.action} className="group flex min-h-9 items-center justify-between rounded-lg px-0 font-mono text-xs text-ash transition-all hover:text-bone">
                  <span>{item.label}</span>
                  <ArrowUpRight size={11} className="text-flame opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Socials & Connect (2 cols) */}
          <div className="md:col-span-2 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-ash/80 block mb-4">
                Community
              </span>
              <p className="text-xs text-ash leading-relaxed mb-4">
                Join our dev-sprints and discussions.
              </p>

              <div className="flex items-center gap-2.5">
                <a
                  href={LINKS.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="JODC on GitHub"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-ash transition-all hover:border-flame hover:bg-flame hover:text-ink shadow-sm touch-manipulation"
                >
                  <Github size={18} />
                </a>
                <a
                  href={LINKS.instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="JODC on Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-ash transition-all hover:border-flame hover:bg-flame hover:text-ink shadow-sm touch-manipulation"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="JODC on LinkedIn"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-ash transition-all hover:border-flame hover:bg-flame hover:text-ink shadow-sm touch-manipulation"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Moving Cursive Sign of JODC (3 cols - Right side of Community) */}
          <div className="md:col-span-2 flex flex-col items-center md:items-end justify-center pt-4 md:pt-0">
            <JODCSignature />
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 flex flex-col gap-4 font-mono text-xs text-ash/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} JODC &bull; Student Open Source Development Club
          </p>


        </div>
      </div>
    </footer>
  );
}
