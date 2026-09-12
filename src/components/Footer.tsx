import { Github, Instagram, ArrowUpRight } from "lucide-react";
import { LINKS, NAV, SITE } from "../data/site";
import { LogoMark } from "./LogoMark";

interface FooterProps {
  onNavigate?: (route: "home" | "repo-of-the-week", sectionId?: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] bg-ink-soft/90 px-4 pt-14 pb-12 sm:px-8 sm:pt-16">
      {/* Top ambient hairline gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame/50 to-transparent" />

      {/* Ambient background soft glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-48 w-[600px] rounded-full bg-flame/[0.03] blur-[140px]" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/[0.06]">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 flex flex-col justify-between">
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

          {/* Navigation Links (4 cols) */}
          <div className="md:col-span-4">
            <span className="font-mono text-xs uppercase tracking-widest text-ash/80 block mb-4">
              Explore JODC
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="/repo-of-the-week"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate("repo-of-the-week");
                  }
                }}
                className="font-mono text-xs text-bone hover:text-flame transition-colors py-1 flex items-center gap-1 group"
              >
                <span>Repo of the Week</span>
                <ArrowUpRight size={11} className="text-flame transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      const sectionId = item.href.replace("#", "");
                      onNavigate("home", sectionId);
                    }
                  }}
                  className="font-mono text-xs text-ash hover:text-bone transition-colors py-1 cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Socials & Connect (3 cols) */}
          <div className="md:col-span-3 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-ash/80 block mb-4">
                Community
              </span>
              <p className="text-xs text-ash leading-relaxed mb-4">
                Join our dev-sprints, talk proposals, and open source discussions.
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
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line and Back to Top */}
        <div className="mt-8 flex flex-col gap-4 font-mono text-xs text-ash/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} JODC &bull; Student Open Source Development Club
          </p>

          <div className="flex items-center gap-4">
            <p className="flex items-center gap-1.5 text-ash/80">
              <span>Built in the open by students</span>
              <span className="text-flame">&bull;</span>
              <span className="text-bone">Pull requests welcome</span>
            </p>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-mono text-ash hover:border-flame/40 hover:bg-flame/10 hover:text-bone transition-all cursor-pointer active:scale-95 touch-manipulation"
              title="Back to top of page"
            >
              <span>Top</span>
              <ArrowUpRight size={11} className="transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
