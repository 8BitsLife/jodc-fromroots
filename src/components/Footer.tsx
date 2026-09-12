import { Github, Instagram } from "lucide-react";
import { LINKS, NAV, SITE } from "../data/site";
import { LogoMark } from "./LogoMark";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-soft px-5 py-14 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex min-h-[44px] items-center gap-3 text-bone">
              <LogoMark size={38} />
              <span className="font-display text-lg font-bold">
                JODC<span className="text-flame">.</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ash">
              {SITE.longName}. {SITE.tagline}
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-8 gap-y-3">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[44px] items-center text-sm text-ash transition-colors hover:text-flame"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-2">
            <a
              href={LINKS.instagram}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="JODC on Instagram"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-ash transition-colors hover:border-flame hover:text-flame"
            >
              <Instagram size={18} aria-hidden="true" />
            </a>
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="JODC on GitHub"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-ash transition-colors hover:border-flame hover:text-flame"
            >
              <Github size={18} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/5 pt-6 font-mono text-xs text-ash sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} JODC · {SITE.campus}</p>
          <p>
            Built in the open by students. Pull requests welcome
            <span className="text-flame"> ↗</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
