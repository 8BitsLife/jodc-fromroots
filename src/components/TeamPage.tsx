import { useEffect, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { TEAM, TEAM_GROUPS } from "../data/team";
import { LINKS } from "../data/site";
import type { Route } from "../hooks/useRoute";
import { Button } from "./Button";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";
import { SpotlightLayout } from "./team/SpotlightLayout";
import { GROUP_META, ease } from "./team/shared";

interface TeamPageProps {
  onNavigate?: (route: Route, sectionId?: string) => void;
}

export function TeamPage({ onNavigate }: TeamPageProps) {
  useEffect(() => {
    document.title = "Team — JODC";
    return () => {
      document.title = "JODC — JIIT-128 Open Source Development Club";
    };
  }, []);

  const toJoin = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!onNavigate) return;
    e.preventDefault();
    onNavigate("home", "join");
  };

  const total = TEAM_GROUPS.reduce((n, g) => n + TEAM[g].length, 0);

  return (
    <>
      <main id="main" className="relative min-h-screen pt-[68px]">
        {/* ── Header ──────────────────────────────────────────────────── */}
        {/* No clip, texture or glow of its own: the page atmosphere carries
            straight through, so the header never ends at a visible edge. */}
        <section className="relative px-5 pb-8 pt-14 sm:px-8 sm:pb-10 sm:pt-20">
          <div className="relative mx-auto max-w-7xl">
            <Reveal>
              <div className="flex items-baseline gap-4">
                <span className="kicker text-flame">Team</span>
                <span className="kicker">{total} people · {TEAM_GROUPS.length} circles</span>
              </div>
            </Reveal>

            <h1 className="mt-7 max-w-5xl text-[clamp(3rem,9vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.05em] text-bone">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.1, ease }}>
                  The people who
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span className="block" initial={{ y: "105%" }} animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.2, ease }}>
                  keep it <span className="accent">open.</span>
                </motion.span>
              </span>
            </h1>

            <div className="mt-10 grid gap-10 border-t border-white/10 pt-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <Reveal delay={0.1}>
                <p className="max-w-xl text-pretty text-base leading-relaxed text-ash sm:text-lg">
                  Builders, mentors and problem-solvers working together to make open source easier to enter and harder to leave.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <nav aria-label="Team groups" className="flex flex-wrap gap-2">
                  {TEAM_GROUPS.map((g) => {
                    const { icon: Icon, id } = GROUP_META[g];
                    return (
                      <a
                        key={g}
                        href={`#${id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }}
                        className="group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-white/[0.03] py-1.5 pl-3 pr-4 text-sm text-bone ring-1 ring-inset ring-white/10 transition-colors hover:bg-white/[0.06] hover:ring-white/25"
                      >
                        <Icon size={15} aria-hidden="true" className="text-flame" />
                        {g}
                        <span className="font-mono text-[11px] text-ash">{String(TEAM[g].length).padStart(2, "0")}</span>
                      </a>
                    );
                  })}
                </nav>
              </Reveal>
            </div>
          </div>
        </section>

        <SpotlightLayout />

        {/* ── Join ────────────────────────────────────────────────────── */}
        <section className="relative overflow-x-clip px-5 py-28 sm:px-8 sm:py-36">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-56 left-1/2 h-[420px] w-[min(1000px,130vw)] -translate-x-1/2 rounded-full bg-flame/[0.1] blur-[170px]"
          />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <Reveal>
              <span className="kicker text-flame">Open seats</span>
            </Reveal>
            <motion.h2
              initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 28 }}
              whileInView={{ clipPath: "inset(0% 0% -15% 0%)", y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease }}
              className="mt-7 text-balance text-[clamp(2.4rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.045em]"
            >
              Want your name <span className="accent">on this page?</span>
            </motion.h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-ash sm:text-lg">
                Every name here started as someone who showed up to a session. Come build with us.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button href="/#join" onClick={toJoin}>
                  Join the club
                </Button>
                <Button href={LINKS.github} variant="ghost" icon={Github} external>
                  Contribute on GitHub
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
