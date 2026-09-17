import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { ACTIVITIES } from "../data/site";
import { SectionHeading } from "./SectionHeading";

/**
 * The programme, set as a hairline matrix rather than floating cards: one
 * light background bleeding through 1px gaps, cells that fill on hover.
 */
export function WhatWeDo() {
  const [copiedCmd, setCopiedCmd] = useState(false);

  const handleCopyCmd = () => {
    navigator.clipboard.writeText("git checkout -b fix/that-bug");
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 1800);
  };

  return (
    <section
      id="what-we-do"
      className="relative scroll-mt-24 border-t border-white/5 px-5 py-8 sm:px-8 sm:py-12"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="01"
          eyebrow="What we run"
          title={
            <>
              Five ways in, and all of them{" "}
              <span className="accent">end in a pull request</span>
            </>
          }
          lead="Sessions are practical. You leave with something committed, or with a clear idea of what to commit next week."
        />

        <div className="matrix mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {ACTIVITIES.map((item, i) => {
            const Icon = item.icon;
            const feature = Boolean(item.accent);

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className={`group relative flex flex-col bg-ink p-6 sm:p-9 transition-all duration-300 hover:bg-ink-soft active:bg-ink-soft/90 touch-manipulation ${item.span}`}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-flame transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />

                <header className="flex items-start justify-between gap-6">
                  <span className="font-mono text-xs text-ash">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    size={feature ? 22 : 18}
                    strokeWidth={1.5}
                    aria-hidden="true"
                    className="shrink-0 text-ash transition-colors duration-300 group-hover:text-flame"
                  />
                </header>

                <h3
                  className={`mt-8 sm:mt-10 font-medium tracking-tight text-bone transition-colors group-hover:text-white ${
                    feature
                      ? "text-[clamp(1.75rem,3.4vw,2.9rem)]"
                      : "text-lg sm:text-[1.35rem]"
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`mt-2.5 sm:mt-3 text-pretty leading-relaxed text-ash text-sm ${
                    feature ? "max-w-sm sm:text-base" : ""
                  }`}
                >
                  {item.body}
                </p>

                {feature && (
                  <div className="mt-auto pt-8 sm:pt-10">
                    <button
                      type="button"
                      onClick={handleCopyCmd}
                      title="Click to copy command"
                      className="group/btn inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-ash hover:border-flame/40 hover:bg-flame/10 hover:text-bone transition-all cursor-pointer touch-manipulation active:scale-95"
                    >
                      <span className="text-flame font-bold">$</span>
                      <span>git checkout -b fix/that-bug</span>
                      <span className="animate-blink inline-block h-3.5 w-[5px] translate-y-[1px] bg-flame" />
                      <span className="ml-1 text-[10px] text-ash/60 group-hover/btn:text-flame flex items-center gap-1">
                        {copiedCmd ? (
                          <>
                            <Check size={11} className="text-flame font-bold" />
                            <span className="text-flame">Copied</span>
                          </>
                        ) : (
                          <Copy size={11} />
                        )}
                      </span>
                    </button>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
