import {
  siCloudflare,
  siDigitalocean,
  siDocker,
  siGithub,
  siJetbrains,
  siPostman,
  siRedhat,
  siSupabase,
  siVercel,
  type SimpleIcon,
} from "simple-icons";
import { SPONSORS } from "../../data/repoOfTheWeek";

/**
 * Partner logos and names on a slow ticker. Marks come from Simple Icons
 * (CC0, the brands' official shapes). Amazon has asked for its marks to be
 * removed from that set, so AWS Community shows its name only rather than an
 * imitation. Everything sits muted and picks up its brand colour on hover.
 */
const LOGOS: Record<string, SimpleIcon> = {
  "GitHub Education": siGithub,
  JetBrains: siJetbrains,
  DigitalOcean: siDigitalocean,
  Vercel: siVercel,
  Supabase: siSupabase,
  Postman: siPostman,
  Cloudflare: siCloudflare,
  "Red Hat": siRedhat,
  Docker: siDocker,
};

const BRAND_COLORS: Record<string, string> = {
  "GitHub Education": "#f5f5f4",
  JetBrains: "#ff318c",
  DigitalOcean: "#0080ff",
  Vercel: "#f5f5f4",
  Supabase: "#3ecf8e",
  Postman: "#ff6c37",
  Cloudflare: "#f38020",
  "Red Hat": "#ee0000",
  Docker: "#2496ed",
  "AWS Community": "#ff9900",
};

export function SponsorsMarquee() {
  const row = [...SPONSORS, ...SPONSORS];

  return (
    <section aria-label="Ecosystem partners" className="mt-24 sm:mt-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-white/10 pb-6">
          <div className="flex items-baseline gap-4">
            <span className="kicker text-flame">Ecosystem</span>
            <span className="kicker">Tools our builders ship with</span>
          </div>
          <span className="font-mono text-[11px] text-ash">{SPONSORS.length} partners</span>
        </div>
      </div>

      <div className="group relative mt-6 flex overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
        {/* Two copies for a seamless loop; the second is hidden from assistive tech. */}
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 animate-marquee items-center gap-12 pr-12 group-hover:[animation-play-state:paused] sm:gap-16 sm:pr-16"
            style={{ animationDuration: "48s" }}
          >
            {row.map((sponsor, i) => (
              <li
                key={`${copy}-${sponsor.name}-${i}`}
                style={{ "--brand": BRAND_COLORS[sponsor.name] ?? "#ff7a1a" } as React.CSSProperties}
                className="group/item flex shrink-0 items-center gap-3 whitespace-nowrap"
              >
                {LOGOS[sponsor.name] && (
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-6 w-6 shrink-0 fill-current text-bone/35 transition-colors duration-300 group-hover/item:text-[var(--brand)] sm:h-7 sm:w-7"
                  >
                    <path d={LOGOS[sponsor.name].path} />
                  </svg>
                )}
                <span className="font-display text-2xl font-semibold tracking-tight text-bone/35 transition-colors duration-300 group-hover/item:text-[var(--brand)] sm:text-3xl">
                  {sponsor.name}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash/0 transition-colors duration-300 group-hover/item:text-ash">
                  {sponsor.tier}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
