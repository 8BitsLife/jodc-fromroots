import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Flame, ArrowUpRight, Instagram, Sparkles } from "lucide-react";
import { HeroBackdrop } from "./HeroBackdrop";
import { MagneticButton } from "./MagneticButton";
import { LINKS, SITE } from "../data/site";

const HEADLINE = ["Build", "in", "the", "open."];

const rise: Variants = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: { delay: 0.15 + i * 0.09, duration: 0.95, ease: [0.16, 1, 0.3, 1] },
  }),
};

interface HeroProps {
  onExploreRepo?: () => void;
}

export function Hero({ onExploreRepo }: HeroProps) {
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
        className="relative z-10 mx-auto w-full max-w-7xl px-5 py-16 sm:px-8"
      >
        <div className="flex flex-wrap items-center gap-3">
          <motion.a
            href={LINKS.instagram}
            target="_blank"
            rel="noreferrer noopener"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-2 pl-3 pr-4 text-xs text-ash backdrop-blur-sm transition-colors hover:border-flame/50 hover:text-bone"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-flame" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-flame" />
            </span>
            Student-run at {SITE.campus}
            <Instagram size={13} aria-hidden="true" />
          </motion.a>

          {onExploreRepo && (
            <motion.button
              type="button"
              onClick={onExploreRepo}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-flame/40 bg-flame/10 py-2 pl-3 pr-4 text-xs font-mono text-flame backdrop-blur-sm transition-all hover:bg-flame hover:text-ink hover:border-flame group"
            >
              <Flame size={13} className="text-flame group-hover:text-ink transition-colors" />
              <span>
                Repo of the Week: <strong className="font-mono text-bone group-hover:text-ink transition-colors">ghost-cache</strong>
              </span>
              <ArrowUpRight size={13} />
            </motion.button>
          )}
        </div>

        <h1
          aria-label="Build in the open."
          className="mt-7 text-[clamp(2.9rem,10.5vw,8rem)] font-semibold leading-[0.94] tracking-[-0.045em]"
        >
          {HEADLINE.map((word, i) => (
            <span
              key={word}
              aria-hidden="true"
              className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom"
            >
              <motion.span
                custom={i}
                variants={rise}
                initial="hidden"
                animate="show"
                className={`inline-block ${i === 3 ? "accent" : "text-bone"}`}
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
          className="mt-7 max-w-lg text-pretty text-[1.02rem] leading-relaxed text-ash"
        >
          {SITE.name} is the open source hub of JIIT-128. Talks, workshops,
          dev-sprints and one-to-one sessions that take you from{" "}
          <span className="font-mono text-[0.92em] text-bone">git clone</span> to a
          merged pull request.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-9 flex flex-wrap items-center gap-3"
        >
          <MagneticButton href="#contribute">
            Start contributing
            <ArrowUpRight size={16} aria-hidden="true" />
          </MagneticButton>
          <MagneticButton href="#what-we-do" variant="ghost">
            <Sparkles size={16} aria-hidden="true" />
            See what we do
          </MagneticButton>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.9 }}
          className="mt-16 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-8 sm:grid-cols-3"
        >
          {[
            ["Contribute", "to live upstream projects"],
            ["Collaborate", "with people who review your code"],
            ["Mentor", "and get mentored, one-to-one"],
          ].map(([term, desc]) => (
            <div key={term}>
              <dt className="kicker text-flame">{term}</dt>
              <dd className="mt-1 text-sm text-ash">{desc}</dd>
            </div>
          ))}
        </motion.dl>
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
      >
        <div className="flex h-11 w-7 items-start justify-center rounded-full border border-white/15 p-1.5">
          <motion.span
            animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-flame"
          />
        </div>
      </motion.div>
    </section>
  );
}
