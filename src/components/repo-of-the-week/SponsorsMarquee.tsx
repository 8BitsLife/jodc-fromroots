interface Sponsor {
  name: string;
  brandColor: string;
  glowColor: string;
  logo: React.ReactNode;
}

const SPONSORS: Sponsor[] = [
  {
    name: "GitHub",
    brandColor: "#ffffff",
    glowColor: "rgba(255, 255, 255, 0.45)",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    name: "JetBrains",
    brandColor: "#ff318c",
    glowColor: "rgba(255, 49, 140, 0.5)",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 0v24h24V0H0zm2.25 2.25h19.5v19.5H2.25V2.25zm2.75 2.75v14h14v-14H5zm2 2h3.5v1.5H7V7zm0 3h5v1.5H7V10zm0 3h7v1.5H7V13z" />
      </svg>
    ),
  },
  {
    name: "DigitalOcean",
    brandColor: "#0080FF",
    glowColor: "rgba(0, 128, 255, 0.5)",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 0C5.41 0 0.04 5.37 0.04 12c0 4.7 2.72 8.76 6.64 10.68v-3.79c-2.08-.85-3.56-2.9-3.56-5.29 0-3.17 2.57-5.74 5.74-5.74 2.39 0 4.44 1.48 5.29 3.56h3.79c-.8-3.08-2.88-5.63-5.76-6.84V1.43C12.18 1.43 12.11 0 12.04 0zm5.66 12h-3.48c0 1.92-1.56 3.48-3.48 3.48v3.48c3.84 0 6.96-3.12 6.96-6.96zm2.32 0h3.48c0 5.12-4.16 9.28-9.28 9.28v-3.48c3.2 0 5.8-2.6 5.8-5.8z" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    brandColor: "#f5f5f4",
    glowColor: "rgba(255, 255, 255, 0.55)",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L24 22H0L12 1Z" />
      </svg>
    ),
  },
  {
    name: "Supabase",
    brandColor: "#3ECF8E",
    glowColor: "rgba(62, 207, 142, 0.5)",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.362 9.354H12V.396a.396.396 0 0 0-.716-.233L2.203 12.424a.395.395 0 0 0 .319.638H12v8.958a.396.396 0 0 0 .716.233l9.081-12.261a.395.395 0 0 0-.435-.638z" />
      </svg>
    ),
  },
  {
    name: "Postman",
    brandColor: "#FF6C37",
    glowColor: "rgba(255, 108, 55, 0.5)",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5 0C6.044 0 0 6.044 0 13.5S6.044 27 13.5 27 27 20.956 27 13.5 20.956 0 13.5 0zm0 4.5c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm-1.5 3v6h6v-6h-6z" />
      </svg>
    ),
  },
  {
    name: "Cloudflare",
    brandColor: "#F38020",
    glowColor: "rgba(243, 128, 32, 0.5)",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.3 12.6c-.2-2-1.8-3.6-3.8-3.6-.9 0-1.7.3-2.3.9-.7-1.7-2.4-2.9-4.4-2.9-2.6 0-4.7 2.1-4.7 4.7 0 .3 0 .6.1.9C1.3 13.2 0 14.9 0 17c0 2.5 2 4.5 4.5 4.5h13.9c2.3 0 4.2-1.9 4.2-4.2 0-2.2-1.7-4-3.9-4.3-.1-.1-.3-.2-.4-.4z" />
      </svg>
    ),
  },
  {
    name: "Docker",
    brandColor: "#2496ED",
    glowColor: "rgba(36, 150, 237, 0.5)",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.186m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.715h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m21.758 1.488c-.37-.24-1.28-.783-2.61-.418-.21-.715-.693-1.34-1.39-1.815l-.478-.292-.305.47c-.52.793-.728 1.767-.585 2.688-.847.48-2.07.697-3.66.697H1.942a.96.96 0 00-.96.96 7.42 7.42 0 003.54 6.365c2.47 1.487 5.76 1.753 9.49 1.753 7.84 0 10.63-4.37 10.63-7.51 0-.79-.19-1.5-.47-2.09-.13-.27-.29-.53-.47-.8z" />
      </svg>
    ),
  },
  {
    name: "Red Hat",
    brandColor: "#EE0000",
    glowColor: "rgba(238, 0, 0, 0.5)",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-2h2v2zm0-4h-2V7h2v5.5z" />
      </svg>
    ),
  },
  {
    name: "AWS Community",
    brandColor: "#FF9900",
    glowColor: "rgba(255, 153, 0, 0.5)",
    logo: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13.5c-1.5 1-3.4 1.5-5 1.5-2.6 0-4.8-1-6.1-2.5-.2-.2-.1-.5.1-.6.3-.1.5 0 .6.2 1.1 1.2 3.1 2.1 5.4 2.1 1.5 0 3.1-.4 4.5-1.3.3-.2.6-.1.7.2.1.2 0 .5-.2.6z" />
      </svg>
    ),
  },
];

export function SponsorsMarquee() {
  const items = [...SPONSORS, ...SPONSORS, ...SPONSORS, ...SPONSORS];

  return (
    <section className="w-full max-w-full relative overflow-hidden border-t border-white/[0.08] py-12">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-flame font-semibold block mb-1">
              Supported By
            </span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-bone">
              Ecosystem Partners<span className="text-flame">.</span>
            </h3>
          </div>
        </div>
      </div>

      {/* High-Aesthetic Non-Link Marquee Track */}
      <div className="relative flex w-full max-w-full overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex shrink-0 animate-marquee items-center gap-3.5 sm:gap-5 pr-5 py-2 hover:[animation-play-state:paused] active:[animation-play-state:paused]">
          {items.map((sponsor, idx) => (
            <div
              key={`${sponsor.name}-${idx}`}
              style={
                {
                  "--brand-color": sponsor.brandColor,
                  "--brand-glow": sponsor.glowColor,
                } as React.CSSProperties
              }
              className="group flex items-center gap-2.5 sm:gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 sm:px-4.5 sm:py-3 backdrop-blur-xl transition-all duration-200 hover:bg-white/[0.05] hover:border-[var(--brand-color)] hover:shadow-[0_0_16px_var(--brand-glow)] whitespace-nowrap cursor-default select-none"
            >
              {/* Authentic Brand Logo */}
              <span className="text-ash/60 transition-colors duration-200 group-hover:text-[var(--brand-color)]">
                {sponsor.logo}
              </span>

              {/* Only Sponsor Name */}
              <span className="font-display text-sm font-bold text-bone/90 transition-colors duration-200 group-hover:text-[var(--brand-color)]">
                {sponsor.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
