import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Copy, Check } from "lucide-react";
import { SUBMISSION_DETAILS } from "../../data/repoOfTheWeek";
import { Button } from "../Button";

const ease = [0.16, 1, 0.3, 1] as const;

export function SubmitProjectModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SUBMISSION_DETAILS.formUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the link is still selectable */
    }
  };

  return (
    <>
      <aside aria-label="Submit a repository" className="fixed bottom-5 right-4 z-50 print:hidden sm:bottom-6 sm:right-6">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="glass group relative flex min-h-12 items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-medium text-bone transition-transform duration-300 active:scale-[0.98]"
        >
          Submit a repo
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame text-ink">
            <Plus size={16} strokeWidth={2.25} aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90" />
          </span>
        </button>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-ink/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease }}
              className="glass relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] p-6 no-scrollbar sm:p-8"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-flame/20 blur-[80px]" />

              <button
                ref={closeRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-ash transition-colors hover:bg-white/[0.08] hover:text-bone"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <p className="kicker relative text-flame">Repo of the Week · Submissions</p>
              <h2 id="submit-modal-title" className="relative mt-4 pr-10 text-[2rem] leading-tight tracking-tight text-bone sm:text-[2.4rem]">
                Built something <span className="accent">open?</span>
              </h2>
              <p className="relative mt-3 text-pretty text-sm leading-relaxed text-ash">
                Submit your repository to be reviewed and spotlighted to the JODC developer community.
              </p>

              {SUBMISSION_DETAILS.guidelines.length > 0 && (
                <div className="relative mt-6">
                  <p className="kicker">What we look for</p>
                  <ul className="mt-3 space-y-2">
                    {SUBMISSION_DETAILS.guidelines.map((g) => (
                      <li key={g} className="flex gap-3 text-sm leading-relaxed text-bone/85">
                        <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-flame" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="relative mt-6 flex items-center gap-2 rounded-2xl bg-black/30 p-1.5 pl-4 ring-1 ring-inset ring-white/10">
                <span className="min-w-0 flex-1 select-all truncate font-mono text-xs text-bone/80">
                  {SUBMISSION_DETAILS.formUrl.replace(/^https?:\/\//, "")}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-white/[0.06] px-3 font-mono text-[11px] text-bone transition-colors hover:bg-white/[0.12]"
                >
                  {copied ? <Check size={13} aria-hidden="true" className="text-flame" /> : <Copy size={13} aria-hidden="true" />}
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>

              <div className="relative mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-mono text-[11px] text-ash">Reviewed weekly · ~2 min to fill</p>
                <Button href={SUBMISSION_DETAILS.formUrl} external className="justify-between">
                  Open the form
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
