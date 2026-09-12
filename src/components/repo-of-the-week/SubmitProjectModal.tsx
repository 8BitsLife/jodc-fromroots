import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowUpRight,
  X,
  Copy,
  Check,
} from "lucide-react";
import { SUBMISSION_DETAILS } from "../../data/repoOfTheWeek";

export function SubmitProjectModal() {
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
    navigator.clipboard.writeText(SUBMISSION_DETAILS.formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating Bottom-Right Pill Button */}
      <aside
        aria-label="Submit project button"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 print:hidden"
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 rounded-full border border-flame/50 bg-ink/90 px-4 py-2.5 text-bone shadow-[0_0_25px_rgba(255,122,26,0.22)] backdrop-blur-xl transition-all duration-300 hover:border-flame hover:scale-105 hover:shadow-[0_0_35px_rgba(255,122,26,0.45)] cursor-pointer touch-manipulation min-h-[44px]"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          title="Submit your repo"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-flame/15 text-flame group-hover:bg-flame group-hover:text-ink transition-colors">
            <Plus
              size={13}
              className="transition-transform duration-200 group-hover:rotate-90"
            />
          </span>

          <span className="font-mono text-xs font-semibold text-bone">
            Submit Repo
          </span>
        </button>
      </aside>

      {/* On-Brand High-Aesthetic Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-modal-title"
          >
            {/* Frosted Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-ink/85 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-[430px] max-h-[90dvh] overflow-y-auto no-scrollbar rounded-3xl border border-white/[0.1] bg-gradient-to-b from-[#14141a] via-[#0d0d12] to-[#08080a] p-5 sm:p-7 shadow-[0_25px_65px_rgba(0,0,0,0.85),0_0_40px_rgba(255,122,26,0.18)] backdrop-blur-2xl"
            >
              {/* On-Brand Signal Flame Top Hairline */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-flame via-flame-hot/70 to-transparent" />

              {/* Ambient Flame Radial Glows */}
              <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-36 w-64 rounded-full bg-flame/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-36 w-36 rounded-full bg-flame/10 blur-3xl" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 top-4 sm:right-5 sm:top-5 flex h-9 w-9 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-ash hover:border-white/20 hover:bg-white/10 hover:text-bone transition-all cursor-pointer touch-manipulation"
                aria-label="Close dialog"
              >
                <X size={15} />
              </button>

              {/* Title & Description */}
              <h3
                id="submit-modal-title"
                className="font-display text-2xl font-bold tracking-tight text-bone"
              >
                Submit for Repo of the <span className="text-flame">Week.</span>
              </h3>

              <p className="mt-2 text-sm text-ash/85 leading-relaxed font-sans">
                Built an open-source tool, library, or experiment? Submit your repository to be reviewed and spotlighted to the developer community.
              </p>

              {/* Direct Form Link Bar with 1-Click Copy */}
              <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2 pl-3.5 backdrop-blur-sm transition-all hover:border-flame/30">
                <div className="flex items-center gap-2 min-w-0 font-mono text-xs text-ash/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse shrink-0" />
                  <span className="truncate">forms.gle/qP7pM4C6w5oA9K148</span>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="shrink-0 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-mono text-ash hover:border-flame/40 hover:text-bone hover:bg-flame/10 transition-all cursor-pointer active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-flame font-bold" />
                      <span className="text-flame font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Primary Call to Action Button */}
              <div className="mt-3">
                <a
                  href={SUBMISSION_DETAILS.formUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-flame to-flame-hot px-5 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-ink shadow-[0_4px_22px_rgba(255,122,26,0.35)] transition-all duration-200 hover:shadow-[0_4px_30px_rgba(255,122,26,0.55)] hover:scale-[1.01] active:scale-[0.98]"
                >
                  <span>Open Google Form</span>
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>

              {/* Footer Status Row */}
              <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-ash/60">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse" />
                  <span>Submissions reviewed weekly</span>
                </span>
                <span>~2 min to submit</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
