import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Code2,
  Github,
  Globe,
  GraduationCap,
  Instagram,
  Linkedin,
  Users,
  type LucideIcon,
} from "lucide-react";
import { TEAM, TEAM_GROUPS, type TeamGroup } from "../data/team";
import type { Route } from "../hooks/useRoute";
import { Footer } from "./Footer";

const GROUP_ICONS: Record<TeamGroup, LucideIcon> = {
  Mentors: GraduationCap,
  "Team Leads": Code2,
  "Core Team": Users,
};

const ease = [0.16, 1, 0.3, 1] as const;

interface TeamPageProps {
  onNavigate?: (route: Route, sectionId?: string) => void;
}

export function TeamPage({ onNavigate }: TeamPageProps) {
  const [group, setGroup] = useState<TeamGroup>("Team Leads");
  const [activeIndex, setActiveIndex] = useState(0);

  const members = TEAM[group];
  const active = members[activeIndex];

  // An odd-sized window centred on the active member: up to two either side.
  const reach = Math.min(2, Math.floor((members.length - 1) / 2));
  const rail = Array.from({ length: reach * 2 + 1 }, (_, i) => {
    const offset = i - reach;
    const index = (activeIndex + offset + members.length) % members.length;
    return { index, offset, member: members[index] };
  });

  const selectGroup = (next: TeamGroup) => {
    setGroup(next);
    setActiveIndex(0);
  };

  const move = (direction: 1 | -1) =>
    setActiveIndex((current) => (current + direction + members.length) % members.length);

  const socials = [
    { Icon: Instagram, href: active.instagram, label: "Instagram" },
    { Icon: Linkedin, href: active.linkedin, label: "LinkedIn" },
    { Icon: Github, href: active.github, label: "GitHub" },
    { Icon: Globe, href: active.portfolio, label: "Portfolio" },
  ].filter((s) => s.href && s.href !== "#");

  return (
    <>
      <main id="main" className="noise relative min-h-screen overflow-hidden pt-[68px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[min(900px,120vw)] -translate-x-1/2 rounded-full bg-flame/[0.08] blur-[160px]"
        />

        {/* Featured member */}
        <section aria-live="polite" className="relative px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-baseline gap-4">
              <span className="kicker text-flame">{group}</span>
              <span className="kicker">
                {String(activeIndex + 1).padStart(2, "0")} / {String(members.length).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-20">
              <div className="relative mx-auto aspect-square w-full max-w-[300px]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,var(--color-flame-deep),var(--color-flame-hot),rgba(255,255,255,0.12),var(--color-flame-deep))] p-[3px] shadow-[0_0_60px_rgba(255,122,26,0.18)]"
                />
                <div className="absolute inset-[3px] overflow-hidden rounded-full bg-ink-soft">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={`${group}-${activeIndex}`}
                      src={active.image}
                      alt={active.name}
                      width={300}
                      height={300}
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease }}
                      className="h-full w-full object-cover"
                    />
                  </AnimatePresence>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${group}-${activeIndex}`}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease }}
                  className="min-w-0 text-center lg:text-left"
                >
                  <span className="inline-flex rounded-full border border-flame/30 bg-flame/10 px-3.5 py-1 font-mono text-xs text-flame">
                    {active.role}
                  </span>
                  <h1 className="mt-6 text-balance text-[clamp(2.4rem,6vw,5rem)] leading-[0.98] tracking-[-0.045em] text-bone">
                    Hi, my name is <span className="accent block">{active.name}</span>
                  </h1>
                  <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-ash sm:text-lg lg:mx-0">
                    {active.bio}
                  </p>

                  {socials.length > 0 && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                      {socials.map(({ Icon, href, label }) => (
                        <a
                          key={label}
                          href={href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${active.name} on ${label}`}
                          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 text-sm text-ash transition-colors hover:border-flame/40 hover:bg-flame/10 hover:text-bone"
                        >
                          <Icon size={16} aria-hidden="true" />
                          {label}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Roster */}
        <section className="relative border-t border-white/5 pane px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="kicker text-flame">01</span>
                <span className="kicker">Our team</span>
              </div>
              <h2 className="mt-7 text-[clamp(2.2rem,5vw,4rem)]">
                Meet the <span className="accent">team.</span>
              </h2>
              <p className="mt-6 max-w-sm text-pretty text-[0.95rem] leading-relaxed text-ash">
                Builders, mentors and problem-solvers working together to make open source easier to
                enter and harder to leave.
              </p>
            </div>

            <div className="min-w-0">
              <div role="tablist" aria-label="Team groups" className="flex overflow-x-auto border-b border-white/10 no-scrollbar">
                {TEAM_GROUPS.map((item) => {
                  const Icon = GROUP_ICONS[item];
                  const selected = group === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => selectGroup(item)}
                      className={`relative flex min-h-14 flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap px-4 font-display text-sm font-semibold transition-colors sm:text-base ${
                        selected ? "text-bone" : "text-ash hover:text-bone"
                      }`}
                    >
                      <Icon size={16} aria-hidden="true" className={selected ? "text-flame" : ""} />
                      {item}
                      {selected && (
                        <motion.span
                          layoutId="team-tab"
                          className="absolute inset-x-0 -bottom-px h-0.5 bg-flame"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="matrix mt-10 overflow-hidden rounded-2xl">
                <div className="relative bg-ink px-4 py-10 sm:py-12">
                  <div className="flex items-center justify-between gap-2 sm:gap-4">
                    <button
                      type="button"
                      onClick={() => move(-1)}
                      aria-label="Previous team member"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-bone transition-colors hover:border-flame/50 hover:text-flame"
                    >
                      <ArrowLeft size={18} aria-hidden="true" />
                    </button>

                    <div className="flex min-w-0 flex-1 items-center justify-center gap-3 sm:gap-6">
                      {rail.map(({ index, offset, member }) => {
                        const isCenter = offset === 0;
                        return (
                          <button
                            key={`${group}-${offset}`}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`View ${member.name}`}
                            aria-current={isCenter ? "true" : undefined}
                            className={`shrink-0 overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              Math.abs(offset) === 2 ? "hidden sm:block" : ""
                            } ${
                              isCenter
                                ? "h-24 w-24 opacity-100 ring-2 ring-flame ring-offset-4 ring-offset-ink sm:h-32 sm:w-32"
                                : "h-14 w-14 opacity-40 grayscale hover:opacity-75 hover:grayscale-0 sm:h-20 sm:w-20"
                            }`}
                          >
                            <img src={member.image} alt="" width={128} height={128} className="h-full w-full object-cover" />
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => move(1)}
                      aria-label="Next team member"
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 text-bone transition-colors hover:border-flame/50 hover:text-flame"
                    >
                      <ArrowRight size={18} aria-hidden="true" />
                    </button>
                  </div>

                  <div className="mt-9 flex justify-center gap-1">
                    {members.map((member, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveIndex(index)}
                        aria-label={`Go to ${member.name}, ${index + 1} of ${members.length}`}
                        className="group flex h-6 items-center px-1"
                      >
                        <span
                          className={`block h-1.5 rounded-full transition-all duration-300 ${
                            index === activeIndex ? "w-6 bg-flame" : "w-1.5 bg-white/25 group-hover:bg-flame/60"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </>
  );
}
