import { HACKATHON_TIMELINE } from "../../data/hackathon";
import { Clock, Calendar } from "lucide-react";

export function HackathonTimeline() {
  return (
    <section id="timeline-section" className="w-full max-w-full overflow-hidden mt-20 pt-12 border-t border-white/[0.08]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-flame font-semibold block mb-1">
            Event Schedule
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-bone">
            Hackathon Timeline<span className="text-flame">.</span>
          </h2>
        </div>
        <span className="font-mono text-xs text-ash/60">
          From First Commit to Grand Finale
        </span>
      </div>

      <div className="relative mt-6">
        {/* Vertical center track line on desktop, left line on mobile */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-4 top-6 w-px bg-gradient-to-b from-flame/10 via-flame/40 to-flame/10 lg:left-1/2 lg:-translate-x-1/2"
        />

        <div className="space-y-6 lg:space-y-8">
          {HACKATHON_TIMELINE.map((event, index) => {
            const isLeft = index % 2 === 0;
            const isActive = event.status === "active";

            return (
              <div
                key={event.phase}
                className={`relative pl-10 lg:flex lg:min-h-[120px] lg:pl-0 ${
                  isLeft ? "lg:justify-end" : "lg:justify-start"
                }`}
              >
                {/* Timeline node icon */}
                <div
                  aria-hidden="true"
                  className={`absolute left-[9px] top-6 z-10 flex h-[15px] w-[15px] items-center justify-center rounded-full border lg:left-1/2 lg:-translate-x-1/2 ${
                    isActive
                      ? "border-flame bg-flame shadow-[0_0_0_6px_rgba(255,122,26,0.2),0_0_20px_rgba(255,122,26,0.7)]"
                      : "border-white/20 bg-ink"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-ink animate-ping" : "bg-white/40"}`} />
                </div>

                {/* Timeline Card */}
                <div
                  className={`group relative w-full overflow-hidden rounded-2xl border transition-all duration-300 p-5 sm:p-6 lg:w-[calc(50%-2.5rem)] ${
                    isActive
                      ? "border-flame/50 bg-flame/[0.06] shadow-[0_0_25px_rgba(255,122,26,0.15)]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-flame">
                      Phase {event.phase}
                    </span>

                    <div className="flex items-center gap-3 font-mono text-[11px] text-ash/70">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={11} className="text-flame" />
                        {event.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} className="text-flame" />
                        {event.time}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-display text-lg sm:text-xl font-bold text-bone">
                    {event.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-ash leading-relaxed">
                    {event.description}
                  </p>

                  {event.highlight && (
                    <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-flame/30 bg-flame/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-flame">
                      <span className="h-1 w-1 rounded-full bg-flame animate-pulse" />
                      {event.highlight}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
