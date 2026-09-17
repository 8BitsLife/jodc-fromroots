import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SITE } from "../data/site";
import { Reveal } from "./Reveal";

/** A single word that brightens as the paragraph scrolls through the viewport. */
function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className="inline-block">
        {children}
      </motion.span>{" "}
    </>
  );
}

export function About() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.32"],
  });

  const words = SITE.intro.split(" ");

  return (
    <section id="about" className="relative scroll-mt-24 px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="kicker text-flame">00</span>
            <span className="kicker">Who we are</span>
          </div>
        </Reveal>

        <p
          ref={ref}
          className="mt-6 font-display text-[clamp(1.45rem,3.8vw,2.75rem)] font-medium leading-[1.25] tracking-[-0.035em] text-bone"
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={`${word}-${i}`} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}
