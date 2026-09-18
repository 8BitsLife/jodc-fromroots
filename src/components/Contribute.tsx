import { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CONTRIBUTE_STEPS } from "../data/site";
import { SectionHeading } from "./SectionHeading";
import { SESSIONS, Terminal } from "./Terminal";

/** Which terminal tab tells each step's story, and which step each tab belongs to. */
const STEP_TAB = [0, 1, 2, 3];
const TAB_STEP = SESSIONS.map((_, t) => {
  let step = 0;
  STEP_TAB.forEach((start, s) => {
    if (t >= start) step = s;
  });
  return step;
});

export function Contribute() {
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.6"],
  });
  // The rail fills as you read down the steps.
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  const [tab, setTab] = useState(0);
  // The terminal tours through its tabs until the visitor picks one.
  const [touring, setTouring] = useState(true);
  const activeStep = TAB_STEP[tab];

  return (
    <section
      id="contribute"
      className="relative scroll-mt-24 overflow-x-clip border-t border-white/5 pane px-5 py-8 sm:px-8 sm:py-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[400px] w-[400px] rounded-full bg-[radial-gradient(closest-side,rgba(255,122,26,0.12),transparent)]"
      />

      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="02"
          eyebrow="The loop"
          title={
            <>
              Four steps from lurking to{" "}
              <span className="accent">merged</span>
            </>
          }
          lead="Nobody is born knowing how to open a pull request. This is the loop we walk every new member through. Pick a step to see it run."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-14">
          <ol ref={trackRef} className="relative space-y-3 pl-10">
            <span
              aria-hidden="true"
              className="absolute left-[13px] top-2 h-[calc(100%-1rem)] w-px bg-white/10"
            />
            <motion.span
              aria-hidden="true"
              style={{ scaleY }}
              className="absolute left-[13px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-flame via-flame to-flame-deep"
            />

            {CONTRIBUTE_STEPS.map((step, i) => {
              const on = i === activeStep;
              return (
                <motion.li
                  key={step.index}
                  initial={{ opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -left-10 top-5 flex h-[26px] w-[26px] items-center justify-center rounded-full border font-mono text-[10px] transition-colors duration-300 ${
                      on ? "border-flame bg-flame text-ink" : "border-flame/30 bg-ink text-flame"
                    }`}
                  >
                    {step.index}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setTouring(false);
                      setTab(STEP_TAB[i]);
                    }}
                    aria-pressed={on}
                    className={`w-full rounded-2xl px-4 py-4 text-left transition-colors duration-300 ${
                      on ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"
                    }`}
                  >
                    <h3
                      className={`text-xl font-medium tracking-tight transition-colors duration-300 sm:text-[1.6rem] ${
                        on ? "text-bone" : "text-bone/70"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-pretty text-[0.95rem] leading-relaxed text-ash">{step.body}</p>
                    <span
                      className={`mt-3 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
                        on ? "text-flame" : "text-ash/60"
                      }`}
                    >
                      {on ? "Running in the terminal" : "Run this step"} →
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ol>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-28"
          >
            <Terminal tab={tab} onTabChange={setTab} touring={touring} onStopTour={() => setTouring(false)} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
