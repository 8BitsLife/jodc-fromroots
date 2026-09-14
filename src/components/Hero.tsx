import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Flame, ArrowUpRight } from "lucide-react";
import { HeroBackdrop } from "./HeroBackdrop";
import { MagneticButton } from "./MagneticButton";
import { SITE } from "../data/site";

const HEADLINE = ["Build", "in", "the", "open."];

const rise: Variants = {
  hidden: { y: "115%" },
  visible: (i: number) => ({
    y: 0,
    transition: {
      duration: 0.85,
      delay: 0.15 + i * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Content drifts up and dissolves as the next section arrives.
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="noise relative flex min-h-dvh items-center overflow-hidden pt-[68px]"
    >
      <HeroBackdrop />

      <motion.div
        style={{ y, opacity }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-16 pb-28 text-center sm:px-8 sm:py-16 sm:pb-32"
      >


        <h1
          aria-label="Build in the open."
          className="mt-6 sm:mt-7 text-center text-[clamp(2.35rem,8.6vw,7.5rem)] font-semibold leading-[0.96] tracking-[-0.045em]"
        >
          {HEADLINE.map((word, i) => (
            <span
              key={word}
              className="inline-block overflow-hidden align-baseline mr-[0.22em] last:mr-0"
            >
              <motion.span
                custom={i}
                variants={rise}
                initial="hidden"
                animate="visible"
                className={`inline-block ${word === "open." ? "accent" : "text-bone"}`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-xl text-pretty text-center text-base leading-relaxed text-ash sm:mt-7 sm:text-lg"
        >
          {SITE.tagline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex w-full flex-wrap items-center justify-center gap-3 sm:mt-9 sm:gap-4"
        >
          <MagneticButton href="#contribute">
            Start contributing
            <ArrowUpRight size={16} aria-hidden="true" />
          </MagneticButton>

          <MagneticButton href="#what-we-do" variant="ghost">
            <Flame size={16} aria-hidden="true" />
            See what we do
          </MagneticButton>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.9 }}
          className="mt-12 grid w-full max-w-4xl grid-cols-1 border-y border-white/10 sm:mt-16 sm:grid-cols-3"
        >
          {[
            ["Contribute", "to live upstream projects"],
            ["Collaborate", "with people who review your code"],
            ["Mentor", "and get mentored, one-to-one"],
          ].map(([term, desc], i) => (
            <div
              key={term}
              className={`group/item px-0 py-5 sm:px-6 sm:py-6 ${
                i > 0 ? "border-t border-white/10 sm:border-t-0 sm:border-l" : ""
              } border-white/10`}
            >
              <dt className="kicker text-flame transition-colors group-hover/item:text-flame-hot">{term}</dt>
              <dd className="mt-1.5 max-w-xs text-xs leading-relaxed text-ash sm:text-sm">{desc}</dd>
            </div>
          ))}
        </motion.dl>

        {/* The scroll cue sits below the Collaborate card, outside the stats box. */}
        <motion.div
          aria-hidden="true"
          className="hero-scroll-cue-static mt-5 flex items-center justify-center gap-2 sm:mt-6"
          animate={{ opacity: [0.58, 1, 0.58] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex h-9 w-6 items-start justify-center rounded-full border border-white/20 bg-black/20 p-1.5 backdrop-blur-md">
            <motion.span
              animate={{ y: [0, 10, 0], opacity: [1, 0.25, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="h-2.5 w-1 rounded-full bg-flame shadow-[0_0_12px_rgba(255,122,26,.95)]"
            />
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ash">Scroll Down</span>
        </motion.div>
      </motion.div>

    </section>
  );
}
