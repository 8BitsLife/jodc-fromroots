import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Zap, Shield, HeartPulse, Leaf, Terminal, CheckCircle2 } from "lucide-react";
import { HACKATHON_TRACKS } from "../../data/hackathon";

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu size={20} className="text-flame" />,
  Zap: <Zap size={20} className="text-flame" />,
  Shield: <Shield size={20} className="text-flame" />,
  HeartPulse: <HeartPulse size={20} className="text-flame" />,
  Leaf: <Leaf size={20} className="text-flame" />,
  Terminal: <Terminal size={20} className="text-flame" />,
};

export function HackathonTracks() {
  const [activeTrackId, setActiveTrackId] = useState<string>(HACKATHON_TRACKS[0].id);

  const activeTrack =
    HACKATHON_TRACKS.find((t) => t.id === activeTrackId) || HACKATHON_TRACKS[0];

  return (
    <section id="tracks-section" className="w-full max-w-full overflow-hidden mt-20 pt-12 border-t border-white/[0.08]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-flame font-semibold block mb-1">
            Challenge Domains
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-bone">
            Hackathon Tracks<span className="text-flame">.</span>
          </h2>
        </div>
        <span className="font-mono text-xs text-ash/60">
          6 Dedicated Tracks &bull; Pick One for Your Project
        </span>
      </div>

      {/* Track Selector Tabs (Swipeable on Mobile) */}
      <div className="w-full flex gap-2 overflow-x-auto pb-3 no-scrollbar scroll-smooth touch-pan-x [-webkit-overflow-scrolling:touch]">
        {HACKATHON_TRACKS.map((track) => {
          const isSelected = track.id === activeTrackId;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setActiveTrackId(track.id)}
              className={`shrink-0 flex items-center gap-2 rounded-2xl px-4 py-2.5 border transition-all touch-manipulation cursor-pointer active:scale-95 ${
                isSelected
                  ? "border-flame bg-flame/15 text-bone shadow-[0_0_20px_rgba(255,122,26,0.25)]"
                  : "border-white/10 bg-white/[0.03] text-ash hover:border-white/20 hover:text-bone"
              }`}
            >
              <span>{ICON_MAP[track.icon]}</span>
              <span className={`font-display text-xs sm:text-sm font-semibold whitespace-nowrap ${
                isSelected ? "text-flame font-bold" : "text-bone"
              }`}>
                {track.shortTitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Track Highlight Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTrack.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="w-full mt-4 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-8 md:p-10 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-flame/10 blur-[90px]" />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full border border-flame/30 bg-flame/10 px-3 py-1 font-mono text-[11px] font-semibold text-flame">
              {activeTrack.tag}
            </span>
          </div>

          <h3 className="font-display text-xl sm:text-3xl font-bold text-bone">
            {activeTrack.title}
          </h3>

          <p className="mt-2 text-base sm:text-lg text-bone/90 font-medium leading-relaxed max-w-3xl">
            {activeTrack.tagline}
          </p>

          <p className="mt-3 text-xs sm:text-sm text-ash leading-relaxed max-w-2xl">
            {activeTrack.description}
          </p>

          {/* Problem Challenge Prompts */}
          <div className="mt-6 pt-6 border-t border-white/[0.06]">
            <span className="font-mono text-[11px] uppercase tracking-wider text-flame font-semibold block mb-3">
              Sample Problem Statements & Challenges:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeTrack.challenges.map((challenge, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 flex gap-3 hover:border-flame/30 transition-colors"
                >
                  <CheckCircle2 size={16} className="text-flame shrink-0 mt-0.5" />
                  <p className="font-sans text-xs text-ash/90 leading-relaxed">
                    {challenge}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Tech Stack */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-ash/60 mr-2">Suggested Tools:</span>
            {activeTrack.suggestedStack.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-bone/80"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
