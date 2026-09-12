import { Trophy, Check } from "lucide-react";
import { PRIZE_TIERS } from "../../data/hackathon";

export function HackathonPrizes() {
  return (
    <section id="prizes-section" className="w-full max-w-full overflow-hidden mt-20 pt-12 border-t border-white/[0.08]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-flame font-semibold block mb-1">
            Rewards & Grants
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-bone">
            Prize Pool & Perks<span className="text-flame">.</span>
          </h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-flame/40 bg-flame/15 px-3.5 py-1.5 font-mono text-xs font-bold text-flame shadow-[0_0_20px_rgba(255,122,26,0.25)]">
          <Trophy size={13} />
          <span>₹1,00,000+ Total Grants & Licenses</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRIZE_TIERS.map((tier) => (
          <div
            key={tier.place}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 transition-all duration-300 ${
              tier.isPrimary
                ? "border-2 border-flame bg-gradient-to-b from-white/[0.08] via-flame/[0.05] to-ink shadow-[0_0_35px_rgba(255,122,26,0.25)]"
                : "border border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
            }`}
          >
            {tier.isPrimary && (
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-flame via-flame-hot to-flame" />
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.04] flex items-center justify-center text-flame group-hover:scale-110 transition-transform">
                  <Trophy size={20} />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-ash/80">
                  {tier.badge}
                </span>
              </div>

              <h3 className="font-display text-lg font-bold text-bone">
                {tier.place}
              </h3>

              <div className="mt-3 font-display text-3xl font-extrabold text-flame">
                {tier.amount}
              </div>

              <ul className="mt-5 space-y-2 border-t border-white/[0.06] pt-4">
                {tier.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2 font-sans text-xs text-ash/90">
                    <Check size={13} className="text-flame shrink-0 mt-0.5" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.04] font-mono text-[10px] text-ash/60">
              Certificate + Swag Pack Included
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
