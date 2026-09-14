import { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowDown, GitPullRequest, GraduationCap, Users, type LucideIcon } from "lucide-react";
import { HeroBackdrop } from "./HeroBackdrop";
import { Button } from "./Button";
import { RotatingWord } from "./RotatingWord";
import { SITE } from "../data/site";

const HEADLINE = ["Build", "in", "the", "open."];
/** The verb in the headline cycles; the promise ("in the open") never does. */
const VERBS = ["Build", "Code", "Learn", "Ship"] as const;

/**
 * A single hand-drawn swash under "open.", written left to right once the
 * headline has landed — the same pen as the stroke further down the page.
 */
function DrawnUnderline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 24"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-[0.06em] left-[-2%] h-[0.22em] w-[104%] overflow-visible"
    >
      <motion.path
        d="M4 16 C 60 6, 130 4, 190 9 S 270 18, 296 8"
        fill="none"
        stroke="var(--color-flame)"
        strokeWidth="5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { delay: 1.05, duration: 0.9, ease: [0.65, 0, 0.35, 1] },
          opacity: { delay: 1.05, duration: 0.01 },
        }}
        style={{ filter: "drop-shadow(0 0 6px rgba(255,122,26,0.55))" }}
      />
    </svg>
  );
}

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

const PILLARS: { term: string; desc: string; icon: LucideIcon }[] = [
  { term: "Contribute", desc: "to live upstream projects", icon: GitPullRequest },
  { term: "Collaborate", desc: "with people who review your code", icon: Users },
  { term: "Mentor", desc: "and get mentored, one-to-one", icon: GraduationCap },
];

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
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pt-16 pb-20 sm:px-8 sm:pb-28"
      >
        <h1
          aria-label="Build in the open."
          className="text-[clamp(2.35rem,8.6vw,7.5rem)] font-semibold leading-[0.96] tracking-[-0.045em]"
        >
          {HEADLINE.map((word, i) => {
            const isAccent = word === "open.";
            return (
              <span key={word} className="relative mr-[0.22em] inline-block align-baseline last:mr-0">
                {/* Clip box for the rise-in; the underline sits outside it. */}
                <span className="inline-block overflow-hidden pb-[0.08em] align-baseline">
                  <motion.span
                    custom={i}
                    variants={rise}
                    initial="hidden"
                    animate="visible"
                    className={`inline-block ${isAccent ? "accent" : "text-bone"}`}
                  >
                    {i === 0 ? <RotatingWord words={VERBS} /> : word}
                  </motion.span>
                </span>

                {isAccent && <DrawnUnderline />}
              </span>
            );
          })}
        </h1>

        <p className="mt-6 sm:mt-7 max-w-xl text-pretty text-base leading-relaxed text-ash sm:text-lg">
          {SITE.tagline.split(" ").map((w, i) => (
            <motion.span
              key={`${w}-${i}`}
              className="inline-block"
              initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.6 + i * 0.045, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {w}
              {" "}
            </motion.span>
          ))}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.68, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10"
        >
          <Button href="#contribute">Start contributing</Button>
          <Button href="#what-we-do" variant="ghost" icon={ArrowDown} travel="down">
            See what we do
          </Button>
        </motion.div>

        {/* Three pillars in a single ruled row; they stack on narrow screens. */}
        <motion.dl
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid max-w-4xl grid-cols-1 border-y border-white/10 sm:mt-16 sm:grid-cols-3"
        >
          {PILLARS.map(({ term, desc, icon: Icon }, i) => (
            <div
              key={term}
              className={`group/pillar flex items-start gap-4 py-5 sm:px-6 sm:py-6 ${
                i === 0 ? "sm:pl-0" : "border-t border-white/10 sm:border-l sm:border-t-0"
              }`}
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-flame ring-1 ring-inset ring-white/10 transition-colors duration-300 group-hover/pillar:bg-flame/10 group-hover/pillar:ring-flame/40"
              >
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <dt className="text-[0.95rem] font-medium tracking-tight text-bone">{term}</dt>
                <dd className="mt-0.5 text-sm leading-snug text-ash">{desc}</dd>
              </div>
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
