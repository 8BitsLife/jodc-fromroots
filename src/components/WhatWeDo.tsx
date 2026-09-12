import { motion } from "framer-motion";
import { ACTIVITIES } from "../data/site";
import { SectionHeading } from "./SectionHeading";

/**
 * The programme, set as a hairline matrix rather than floating cards: one
 * light background bleeding through 1px gaps, cells that fill on hover.
 */
export function WhatWeDo() {
  return (
    <section
      id="what-we-do"
      className="relative scroll-mt-24 border-t border-white/5 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="01"
          eyebrow="What we run"
          title={
            <>
              Six ways in, and all of them{" "}
              <span className="accent">end in a pull request</span>
            </>
          }
          lead="Sessions are practical. You leave with something committed, or with a clear idea of what to commit next week."
        />

        <div className="matrix mt-px grid grid-cols-1 md:grid-cols-4">
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
                className={`group relative flex flex-col bg-ink p-7 transition-colors duration-300 hover:bg-ink-soft sm:p-9 ${item.span}`}
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
                  className={`mt-10 font-medium tracking-tight text-bone ${
                    feature
                      ? "text-[clamp(1.9rem,3.4vw,2.9rem)]"
                      : "text-[1.35rem]"
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`mt-3 text-pretty leading-relaxed text-ash ${
                    feature ? "max-w-sm text-base" : "text-sm"
                  }`}
                >
                  {item.body}
                </p>

                {feature && (
                  <p className="mt-auto pt-10 font-mono text-xs text-ash">
                    <span className="text-flame">$</span> git checkout -b
                    fix/that-bug
                    <span className="animate-blink ml-1 inline-block h-3.5 w-[6px] translate-y-[2px] bg-flame" />
                  </p>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
