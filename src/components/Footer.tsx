import { Github, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { LINKS, NAV, SITE } from "../data/site";
import { LogoMark } from "./LogoMark";
import { ContributionSignature } from "./ContributionSignature";
import type { Route } from "../hooks/useRoute";

interface FooterProps {
  onNavigate?: (route: Route, sectionId?: string) => void;
}

type FooterLink = { label: string; route: Route; section?: string; featured?: boolean };

/** Pages first, then every home section — each one routes to its real destination. */
const EXPLORE: FooterLink[] = [
  { label: "Repo of the Week", route: "repo-of-the-week", featured: true },
  { label: "Hackathon", route: "hackathon", featured: true },
  { label: "Team", route: "team", featured: true },
  ...NAV.filter((item) => item.label !== "Hackathon").map((item) => ({
    label: item.label,
    route: "home" as const,
    section: item.href.replace("#", ""),
  })),
];

const SOCIALS = [
  { href: LINKS.github, label: "GitHub", Icon: Github },
  { href: LINKS.instagram, label: "Instagram", Icon: Instagram },
  { href: LINKS.linkedin, label: "LinkedIn", Icon: Linkedin },
];

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.08] pane px-4 pt-14 pb-12 sm:px-8 sm:pt-16">
      {/* Top ambient hairline gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame/50 to-transparent" />

      {/* Ambient background soft glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-48 w-[600px] -translate-x-1/2 rounded-full bg-flame/[0.03] blur-[140px]" />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-10 border-b border-white/[0.06] pb-10 sm:pb-12 md:grid-cols-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-6 lg:col-span-3">
            <a
              href="/"
              onClick={(e) => {
                if (!onNavigate) return;
                e.preventDefault();
                onNavigate("home");
              }}
              className="inline-flex items-center gap-3 text-bone"
              aria-label={`${SITE.name} home`}
            >
              <LogoMark size={36} />
              <span className="font-display text-2xl font-bold tracking-tight">
                JODC<span className="text-flame">.</span>
              </span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ash">
              {SITE.longName}. {SITE.tagline}
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Footer" className="md:col-span-6 lg:col-span-4">
            <span className="kicker mb-4 block">Explore JODC</span>
            <ul className="grid grid-cols-2 gap-x-6">
              {EXPLORE.map(({ label, route, section, featured }) => (
                <li key={label}>
                  <a
                    href={route === "home" ? `/#${section}` : `/${route}`}
                    onClick={(e) => {
                      if (!onNavigate) return;
                      e.preventDefault();
                      onNavigate(route, section);
                    }}
                    className={`group flex min-h-9 items-center gap-1 font-mono text-xs transition-colors ${
                      featured ? "text-bone hover:text-flame" : "text-ash hover:text-bone"
                    }`}
                  >
                    {label}
                    {featured && (
                      <ArrowUpRight
                        size={11}
                        aria-hidden="true"
                        className="text-flame transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Community */}
          <div className="md:col-span-6 lg:col-span-2">
            <span className="kicker mb-4 block">Community</span>
            <p className="mb-4 text-xs leading-relaxed text-ash">
              Join our dev-sprints and discussions.
            </p>

            <div className="flex flex-wrap items-center gap-2.5">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`JODC on ${label}`}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-ash transition-all hover:border-flame hover:bg-flame hover:text-ink"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Sign-off: the club name drawn in a contribution graph */}
          <div className="flex flex-col items-center justify-center pt-4 md:col-span-6 md:items-end md:pt-0 lg:col-span-3">
            <ContributionSignature />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 font-mono text-xs text-ash/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} JODC &bull; Student Open Source Development Club
          </p>

          <p className="flex items-center gap-1.5 text-ash/80">
            <span>Built in the open by students</span>
            <span aria-hidden="true" className="text-flame">&bull;</span>
            <span className="text-bone">Pull requests welcome</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
