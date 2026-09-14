import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, Copy, Check, Users, Trophy } from "lucide-react";
import { HACKATHON_DETAILS } from "../../data/hackathon";
import { Button } from "../Button";

const ease = [0.16, 1, 0.3, 1] as const;

export function RegisterModal() {
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
      // Hand focus back to the button that opened the dialog.
      trigger?.focus();
    };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(HACKATHON_DETAILS.registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Floating register pill, bottom-right. */}
      <aside aria-label="Hackathon registration" className="fixed bottom-5 right-4 z-50 print:hidden sm:bottom-6 sm:right-6">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="glass group relative flex min-h-12 items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-medium text-bone transition-transform duration-300 active:scale-[0.98]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-flame" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-flame" />
          </span>
          Register Team
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame text-ink transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45">
            <ArrowUpRight size={16} strokeWidth={2.25} aria-hidden="true" />
          </span>
        </button>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-modal-title"
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
              className="glass relative w-full max-w-lg overflow-hidden rounded-[1.75rem] p-6 sm:p-8"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-flame/20 blur-[80px]"
              />

              <button
                ref={closeRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-ash transition-colors hover:bg-white/[0.08] hover:text-bone"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <p className="kicker relative flex items-center gap-2 text-flame">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-flame" />
                {HACKATHON_DETAILS.name} · Team Registration
              </p>

              <h2 id="register-modal-title" className="relative mt-4 text-[2rem] leading-tight tracking-tight text-bone sm:text-[2.4rem]">
                Register your <span className="accent">squad.</span>
              </h2>

              <p className="relative mt-3 text-pretty text-sm leading-relaxed text-ash">
                Fill out your team details, track preference, and GitHub handles through the official registration form. Shortlisted teams will be invited to the on-campus hackathon at JIIT-128.
              </p>

              <dl className="matrix relative mt-6 grid grid-cols-2 overflow-hidden rounded-2xl">
                {[
                  { label: "Team Size", value: HACKATHON_DETAILS.teamSize, Icon: Users },
                  { label: "Prize Pool", value: HACKATHON_DETAILS.prizePool, Icon: Trophy },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="bg-ink/90 p-4">
                    <dt className="kicker flex items-center gap-1.5">
                      <Icon size={13} aria-hidden="true" className="text-flame" />
                      {label}
                    </dt>
                    <dd className="mt-2 font-medium tracking-tight text-bone">{value}</dd>
                  </div>
                ))}
              </dl>

              <div className="relative mt-4 flex items-center gap-2 rounded-2xl bg-black/30 p-1.5 pl-4 ring-1 ring-inset ring-white/10">
                <span className="min-w-0 flex-1 select-all truncate font-mono text-xs text-bone/80">
                  {HACKATHON_DETAILS.registrationUrl}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl bg-white/[0.06] px-3 font-mono text-[11px] text-bone transition-colors hover:bg-white/[0.12]"
                >
                  {copied ? (
                    <>
                      <Check size={13} aria-hidden="true" className="text-flame" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} aria-hidden="true" />
                      Copy link
                    </>
                  )}
                </button>
              </div>

              <div className="relative mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="min-h-12 rounded-full px-5 text-sm text-ash transition-colors hover:text-bone"
                >
                  Back
                </button>
                <Button href={HACKATHON_DETAILS.registrationUrl} external className="justify-between">
                  Open Application Form
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
