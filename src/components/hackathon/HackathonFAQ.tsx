import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { HACKATHON_FAQS } from "../../data/hackathon";

export function HackathonFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="w-full max-w-full overflow-hidden mt-20 pt-12 border-t border-white/[0.08]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-flame font-semibold block mb-1">
            Questions & Answers
          </span>
          <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-bone">
            Frequently Asked<span className="text-flame">.</span>
          </h2>
        </div>
        <span className="font-mono text-xs text-ash/60">
          Everything You Need to Know Before Hacking
        </span>
      </div>

      <div className="space-y-2.5 max-w-4xl">
        {HACKATHON_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-colors overflow-hidden ${
                isOpen
                  ? "border-flame/40 bg-white/[0.03]"
                  : "border-white/[0.08] bg-white/[0.015] hover:border-white/20"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer touch-manipulation gap-4"
                aria-expanded={isOpen}
              >
                <span className="font-display text-sm sm:text-base font-semibold text-bone flex items-center gap-2.5">
                  <HelpCircle size={15} className={isOpen ? "text-flame" : "text-ash/60"} />
                  {faq.question}
                </span>
                <ChevronDown
                  size={16}
                  className={`text-ash transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 text-flame" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-ash leading-relaxed border-t border-white/[0.04]">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
