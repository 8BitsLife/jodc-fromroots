import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { CONTRIBUTE_STEPS } from "../data/site";
import { SectionHeading } from "./SectionHeading";
import { Terminal } from "./Terminal";

export function Contribute() {
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.8", "end 0.6"],
  });
  // The rail fills as you read down the steps.
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 26 });

  return (
    <section
      id="contribute"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/5 bg-transparent px-5 py-24 sm:px-8 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 h-[400px] w-[400px] rounded-full bg-flame/10 blur-[130px]"
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
          lead="Nobody is born knowing how to open a pull request. This is the loop we walk every new member through."
        />

        <div className="mt-14 grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <ol ref={trackRef} className="relative space-y-10 pl-10">
            <span
              aria-hidden="true"
              className="absolute left-[13px] top-2 h-[calc(100%-1rem)] w-px bg-white/10"
            />
            <motion.span
              aria-hidden="true"
              style={{ scaleY }}
              className="absolute left-[13px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gradient-to-b from-flame via-flame to-flame-deep"
            />

            {CONTRIBUTE_STEPS.map((step, i) => (
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
                  className="absolute -left-10 top-2 flex h-[26px] w-[26px] items-center justify-center rounded-full border border-flame/30 bg-ink font-mono text-[10px] text-flame"
                >
                  {step.index}
                </span>
                <h3 className="text-xl font-medium tracking-tight text-bone sm:text-[1.6rem]">
                  {step.title}
                </h3>
                <p className="mt-2.5 max-w-md text-pretty text-[0.95rem] leading-relaxed text-ash">
                  {step.body}
                </p>
              </motion.li>
            ))}
          </ol>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-28"
          >
            <Terminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
