import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Copy, Check, Users, Trophy } from "lucide-react";
import { HACKATHON_DETAILS } from "../../data/hackathon";

export function RegisterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(HACKATHON_DETAILS.registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Bottom-Right Action Button */}
      <aside
        aria-label="Hackathon Registration Button"
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 print:hidden"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full border border-flame/50 bg-ink/90 px-4 py-2.5 text-bone shadow-[0_0_25px_rgba(255,122,26,0.25)] backdrop-blur-xl transition-all duration-300 hover:border-flame hover:scale-105 active:scale-95 hover:shadow-[0_0_35px_rgba(255,122,26,0.45)] cursor-pointer touch-manipulation min-h-[44px]"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          title="Register your team"
        >
          <span className="font-mono text-xs font-semibold text-bone">
            Register Team
          </span>
          <ArrowUpRight size={14} className="text-flame transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </aside>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-modal-title"
          >
            {/* Frosted Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-ink/80 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-ink-soft/95 p-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 rounded-full p-2 text-ash hover:bg-white/5 hover:text-bone transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {/* Tag & Heading */}
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-flame animate-pulse" />
                <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-flame">
                  {HACKATHON_DETAILS.name} &bull; Team Registration
                </span>
              </div>

              <h2
                id="register-modal-title"
                className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-bone"
              >
                Register Your <span className="accent text-flame">Squad.</span>
              </h2>

              <p className="mt-2 text-xs sm:text-sm text-ash leading-relaxed">
                Fill out your team details, track preference, and GitHub handles through the official registration form. Shortlisted teams will be invited to the on-campus hackathon at JIIT-128.
              </p>

              {/* Quick Info Grid */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-left">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="flex items-center gap-1.5 text-flame text-xs font-mono font-semibold">
                    <Users size={14} />
                    <span>Team Size</span>
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-bone">
                    {HACKATHON_DETAILS.teamSize}
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/5 bg-opacity-20 p-3">
                  <div className="flex items-center gap-1.5 text-flame text-xs font-mono font-semibold">
                    <Trophy size={14} />
                    <span>Prize Pool</span>
                  </div>
                  <div className="mt-1 font-display text-sm font-bold text-bone">
                    {HACKATHON_DETAILS.prizePool}
                  </div>
                </div>
              </div>

              {/* Form URL direct copy */}
              <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-[11px] text-ash">
                    Official Application Link:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 font-mono text-[11px] text-flame hover:underline cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-flame" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs text-bone/90 truncate select-all bg-black/40 rounded-lg px-2.5 py-1.5 border border-white/5">
                  {HACKATHON_DETAILS.registrationUrl}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <a
                  href={HACKATHON_DETAILS.registrationUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="w-full inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-flame px-5 py-3 text-sm font-semibold text-ink shadow-[0_0_20px_rgba(255,122,26,0.35)] transition-all hover:bg-flame-hot hover:scale-[1.02] active:scale-95 touch-manipulation cursor-pointer"
                >
                  <span>Open Application Form</span>
                  <ArrowUpRight size={16} />
                </a>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:w-auto inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/10 px-4 py-2.5 text-xs font-mono text-ash hover:border-white/20 hover:text-bone transition-all cursor-pointer"
                >
                  Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
