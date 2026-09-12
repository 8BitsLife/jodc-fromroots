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
    <section id="about" className="relative scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="kicker text-flame">00</span>
            <span className="kicker">Who we are</span>
          </div>
        </Reveal>

        <p
          ref={ref}
          className="mt-8 font-display text-[clamp(1.45rem,3.8vw,2.75rem)] font-medium leading-[1.25] tracking-[-0.035em] text-bone"
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

        <div className="mt-14 grid gap-10 border-t border-white/5 pt-10 md:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <p className="text-pretty text-base leading-relaxed text-ash sm:text-lg">
              {SITE.mission}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="space-y-4">
              {[
                ["No gatekeeping", "First-years welcome. Bring a laptop and questions."],
                ["Real repositories", "We work upstream, not on throwaway demo projects."],
                ["People over points", "Reviews, pairing and follow-through beat certificates."],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flame"
                  />
                  <div>
                    <h3 className="text-[0.95rem] font-medium tracking-tight text-bone">
                      {title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-ash">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
