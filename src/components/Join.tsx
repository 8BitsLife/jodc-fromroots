import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Instagram, Mail } from "lucide-react";
import { LINKS } from "../data/site";
import { LogoMark } from "./LogoMark";
import { MagneticButton } from "./MagneticButton";
import { Reveal } from "./Reveal";

export function Join() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.05, 0.85]);

  return (
    <section
      id="join"
      ref={ref}
      className="noise relative scroll-mt-24 overflow-hidden border-t border-white/5 px-5 py-32 sm:px-8 sm:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-flame/15 blur-[150px]"
      />

      <motion.div
        aria-hidden="true"
        style={{ rotate, scale }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.08]"
      >
        <LogoMark size={540} className="text-bone" />
      </motion.div>

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal>
          <span className="kicker text-flame">Open invitation</span>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="mt-6 text-balance text-[clamp(2.2rem,6.4vw,4.6rem)] font-semibold leading-[1] text-bone">
            Your first commit is <span className="accent">one conversation</span> away.
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-ash sm:text-lg">
            Message us on Instagram, come to the next session, or just show up with a
            repository you already broke. No application form, no screening round.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <MagneticButton href={LINKS.instagram} external>
              <Instagram size={16} aria-hidden="true" />
              Message us on Instagram
            </MagneticButton>
            <MagneticButton href={LINKS.github} variant="ghost" external>
              <Github size={16} aria-hidden="true" />
              Browse our GitHub
            </MagneticButton>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <a
            href={LINKS.email}
            className="mt-8 inline-flex min-h-[44px] items-center gap-2 font-mono text-sm text-ash underline-offset-4 transition-colors hover:text-flame hover:underline"
          >
            <Mail size={15} aria-hidden="true" />
            or write to the club
          </a>
        </Reveal>
      </div>
    </section>
  );
}
