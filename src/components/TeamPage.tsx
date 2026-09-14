import { createElement, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Github, Globe, Instagram, Linkedin, GraduationCap, Code2, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LINKS } from "../data/site";
import type { Route } from "../hooks/useRoute";
import { Footer } from "./Footer";

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

const MEMBERS: Record<"Mentors" | "Team Leads" | "Core Team", TeamMember[]> = {
  Mentors: [
    {
      name: "JODC Mentor",
      role: "Mentor",
      bio: "Guidance, code reviews, architecture discussions and the occasional push to ship what you started.",
      image: "/team/jodc-placeholder.png",
    },
    {
      name: "JODC Mentor",
      role: "Mentor",
      bio: "Helping contributors turn questions into practical open-source contributions.",
      image: "/team/jodc-placeholder.png",
    },
    {
      name: "JODC Mentor",
      role: "Mentor",
      bio: "Sharing engineering experience and helping students navigate real repositories.",
      image: "/team/jodc-placeholder.png",
    },
  ],
  "Team Leads": [
    {
      name: "Vaibhav Katariya",
      role: "Tech Lead",
      bio: "Trust me, I'm a software engineer ^_^",
      image: "/team/jodc-placeholder.png",
      instagram: "https://www.instagram.com/acevaibhav/",
      linkedin: "https://www.linkedin.com/in/vaibhav-katariya/",
      github: "https://github.com/VaibhavKatariya",
      portfolio: "#",
    },
    {
      name: "JODC Team Lead",
      role: "Team Lead",
      bio: "Leading people, projects and the small decisions that keep open-source work moving.",
      image: "/team/jodc-placeholder.png",
    },
    {
      name: "JODC Team Lead",
      role: "Team Lead",
      bio: "Building a culture where contributors can learn by shipping together.",
      image: "/team/jodc-placeholder.png",
    },
    {
      name: "JODC Team Lead",
      role: "Team Lead",
      bio: "Coordinating initiatives and turning good ideas into things people can use.",
      image: "/team/jodc-placeholder.png",
    },
    {
      name: "JODC Team Lead",
      role: "Team Lead",
      bio: "Keeping the team curious, collaborative and close to the code.",
      image: "/team/jodc-placeholder.png",
    },
  ],
  "Core Team": [
    {
      name: "JODC Core Member",
      role: "Core Team",
      bio: "Helping run the community, events and systems behind the club.",
      image: "/team/jodc-placeholder.png",
    },
    {
      name: "JODC Core Member",
      role: "Core Team",
      bio: "Making sessions, collaborations and contributor experiences better every week.",
      image: "/team/jodc-placeholder.png",
    },
    {
      name: "JODC Core Member",
      role: "Core Team",
      bio: "Building the details that make the community feel like a place to belong.",
      image: "/team/jodc-placeholder.png",
    },
    {
      name: "JODC Core Member",
      role: "Core Team",
      bio: "Contributing to the systems, content and culture that keep JODC moving.",
      image: "/team/jodc-placeholder.png",
    },
  ],
};

const GROUPS = ["Mentors", "Team Leads", "Core Team"] as const;

type Group = (typeof GROUPS)[number];

interface TeamPageProps {
  onNavigate?: (route: Route, sectionId?: string) => void;
}

export function TeamPage({ onNavigate }: TeamPageProps) {
  const [group, setGroup] = useState<Group>("Team Leads");
  const [activeIndex, setActiveIndex] = useState(0);

  const members = MEMBERS[group];
  const groupIcons = {
    Mentors: GraduationCap,
    "Team Leads": Code2,
    "Core Team": Users,
  } as const;
  const active = members[activeIndex % members.length];

  const visibleMembers = useMemo(() => {
    if (members.length <= 5) return members;
    return Array.from({ length: 5 }, (_, i) => members[(activeIndex - 2 + i + members.length) % members.length]);
  }, [activeIndex, members]);

  const selectGroup = (next: Group) => {
    setGroup(next);
    setActiveIndex(0);
  };

  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + members.length) % members.length);
  };

  return (
    <main id="team" className="relative min-h-screen overflow-hidden pt-[86px]">
      <div className="team-page-bg pointer-events-none absolute inset-0" aria-hidden="true" />

      <section className="relative px-5 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-12">
        <div className="mx-auto max-w-[1200px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="team-feature relative overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.035] p-6 backdrop-blur-xl sm:p-10 lg:p-14"
          >
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-flame/10 blur-[100px]" />
            <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-orange-300/[0.05] blur-[100px]" />

            <div className="relative grid items-center gap-10 lg:grid-cols-[360px_1fr] lg:gap-16">
              <motion.div
                layout
                className="mx-auto w-full max-w-[330px]"
              >
                <div className="team-portrait-ring relative aspect-square rounded-full p-[4px]">
                  <div className="relative h-full w-full overflow-hidden rounded-full border border-white/20 bg-ink">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={active.image}
                        src={active.image}
                        alt={active.name}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.45 }}
                        className="h-full w-full object-cover"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />
                  </div>
                </div>
              </motion.div>

              <div className="min-w-0">
                <span className="inline-flex rounded-full border border-flame/30 bg-flame/10 px-4 py-1.5 font-mono text-xs text-flame">
                  {active.role}
                </span>
                <h1 className="mt-5 text-[clamp(2.6rem,6vw,5.2rem)] font-semibold leading-[0.95] tracking-[-0.055em] text-bone">
                  Hi, my name is
                  <span className="mt-2 block team-name-gradient">{active.name}</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-ash sm:text-lg">
                  {active.bio}
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {([
                    { Icon: Instagram, href: active.instagram, label: "Instagram" },
                    { Icon: Linkedin, href: active.linkedin, label: "LinkedIn" },
                    { Icon: Github, href: active.github, label: "GitHub" },
                    { Icon: Globe, href: active.portfolio, label: "Portfolio" },
                  ] as Array<{ Icon: LucideIcon; href?: string; label: string }>).map(({ Icon, href, label }) => {
                    if (!href || href === "#") return null;
                    return (
                      <a key={label} href={href} target="_blank" rel="noreferrer noopener" aria-label={`${active.name} on ${label}`} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 text-sm text-ash transition-all hover:border-flame/40 hover:bg-flame/10 hover:text-bone">
                        {createElement(Icon, { size: 17 })}
                        <span>{label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr] lg:gap-16">
            <div>
              <div className="kicker flex items-center gap-3 text-flame">
                <span className="h-2.5 w-2.5 rounded-full bg-flame shadow-[0_0_18px_rgba(255,122,26,0.7)]" />
                Our team
              </div>
              <h2 className="mt-5 text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
                Meet the <span className="accent">Team.</span>
              </h2>
              <p className="mt-6 max-w-sm text-sm leading-7 text-ash sm:text-base">
                Builders, mentors and problem-solvers working together to make open source easier to enter and harder to leave.
              </p>
            </div>

            <div className="min-w-0">
              <div className="team-tabs border-b border-white/10">
                {GROUPS.map((item) => {
                  const Icon = groupIcons[item];
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => selectGroup(item)}
                      className={`team-tab ${group === item ? "team-tab-active" : ""}`}
                    >
                      <span className="team-tab-icon"><Icon size={15} /></span>
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative mt-10 overflow-hidden rounded-[26px] border border-white/10 bg-black/10 py-10 sm:py-14">
                <div className="team-step-line" aria-hidden="true">
                  <span className="team-step-dot" />
                  <span className="team-step-dot" />
                  <span className="team-step-dot" />
                </div>

                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Previous team member"
                  className="team-arrow left-4 sm:left-7"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="team-rail relative flex items-center justify-center gap-5 px-16 sm:gap-8 sm:px-24">
                  {visibleMembers.map((member, index) => {
                    const isCenter = member === active;
                    return (
                      <button
                        type="button"
                        key={`${member.name}-${index}-${member.image}`}
                        onClick={() => {
                          const centerOffset = index - Math.floor(visibleMembers.length / 2);
                          const actual = (activeIndex + centerOffset + members.length) % members.length;
                          setActiveIndex(actual);
                        }}
                        className={`team-avatar shrink-0 ${isCenter ? "team-avatar-active" : ""}`}
                        aria-label={`View ${member.name}`}
                      >
                        <img src={member.image} alt="" />
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Next team member"
                  className="team-arrow right-4 sm:right-7"
                >
                  <ArrowRight size={20} />
                </button>

                <div className="mt-9 flex justify-center gap-2">
                  {members.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Go to team member ${index + 1}`}
                      className={`h-2.5 rounded-full border transition-all ${
                        index === activeIndex
                          ? "w-7 border-flame bg-flame shadow-[0_0_14px_rgba(255,122,26,0.55)]"
                          : "w-2.5 border-white/30 bg-transparent hover:border-flame/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-5 py-12 sm:px-8 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="kicker text-flame">JODC</div>
            <p className="mt-2 text-sm text-ash">Building. Learning. Growing.</p>
          </div>
          <a
            href={LINKS.github}
            target="_blank"
            rel="noreferrer noopener"
            className="font-mono text-xs text-ash transition-colors hover:text-flame"
          >
            github.com/JIITODC ↗
          </a>
        </div>
      </section>
      <Footer onNavigate={onNavigate} />
    </main>
  );
}
