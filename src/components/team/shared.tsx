import { motion } from "framer-motion";
import { Code2, Github, Globe, GraduationCap, Instagram, Linkedin, Users, type LucideIcon } from "lucide-react";
import { TEAM, type TeamGroup, type TeamMember } from "../../data/team";
import { LogoMark } from "../LogoMark";
import { Reveal } from "../Reveal";

export const ease = [0.16, 1, 0.3, 1] as const;

export const GROUP_META: Record<TeamGroup, { icon: LucideIcon; id: string; lead: string }> = {
  Mentors: {
    icon: GraduationCap,
    id: "mentors",
    lead: "Engineers who have shipped for years and still make time to review your first pull request.",
  },
  "Team Leads": {
    icon: Code2,
    id: "team-leads",
    lead: "The people steering tech, events and community — and answering messages at odd hours.",
  },
  "Core Team": {
    icon: Users,
    id: "core-team",
    lead: "Running the sessions, the systems and the small details that make JODC feel like a place.",
  },
};

const PLACEHOLDER = "/team/jodc-placeholder.png";
export const isPlaceholder = (m: TeamMember) => m.image === PLACEHOLDER;

export function socialsFor(m: TeamMember) {
  return [
    { Icon: Github, href: m.github, label: "GitHub" },
    { Icon: Linkedin, href: m.linkedin, label: "LinkedIn" },
    { Icon: Instagram, href: m.instagram, label: "Instagram" },
    { Icon: Globe, href: m.portfolio, label: "Portfolio" },
  ].filter((s): s is { Icon: LucideIcon; href: string; label: string } => Boolean(s.href && s.href !== "#"));
}

const AVATAR_BOX = {
  md: "h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]",
  xl: "h-56 w-56 sm:h-72 sm:w-72",
} as const;

/**
 * Round portrait. Real photos are zoomed slightly so any ring baked into the
 * image falls outside the crop; seats not yet filled get the club mark instead
 * of a stock silhouette.
 */
export function Avatar({ member, size, dim = false }: { member: TeamMember; size: keyof typeof AVATAR_BOX; dim?: boolean }) {
  const box = AVATAR_BOX[size];
  if (isPlaceholder(member)) {
    return (
      <span
        className={`${box} flex shrink-0 items-center justify-center rounded-full border border-dashed border-white/20 bg-white/[0.02] text-bone/30 transition-colors duration-300 group-hover:border-flame/50 group-hover:text-bone/50`}
      >
        <LogoMark size={size === "xl" ? 96 : 26} />
      </span>
    );
  }
  return (
    <span className={`${box} relative block shrink-0 overflow-hidden rounded-full ring-1 ring-white/10`}>
      <img
        src={member.image}
        alt=""
        width={288}
        height={288}
        className={`h-full w-full scale-[1.14] object-cover transition-[filter,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          dim ? "grayscale group-hover:grayscale-0" : ""
        }`}
      />
    </span>
  );
}

/** Numbered group heading: kicker with count, two-word title with the accent, and a lead. */
export function GroupHeader({ group, index }: { group: TeamGroup; index: number }) {
  const { icon: Icon, lead } = GROUP_META[group];
  const count = TEAM[group].length;
  const [first, ...rest] = group.split(" ");
  return (
    <div className="grid gap-6 border-b border-white/10 pb-10 md:grid-cols-[1.2fr_1fr] md:items-end">
      <div>
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="kicker text-flame">{String(index + 1).padStart(2, "0")}</span>
            <span className="kicker flex items-center gap-2">
              <Icon size={13} aria-hidden="true" />
              {count} {count === 1 ? "person" : "people"}
            </span>
          </div>
        </Reveal>
        <motion.h2
          initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 28 }}
          whileInView={{ clipPath: "inset(0% 0% -15% 0%)", y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="mt-6 text-[clamp(2.4rem,5.5vw,4.25rem)]"
        >
          {rest.length ? (
            <>
              {first} <span className="accent">{rest.join(" ").toLowerCase()}</span>
            </>
          ) : (
            <span className="accent">{first}</span>
          )}
        </motion.h2>
      </div>
      <Reveal delay={0.1}>
        <p className="max-w-md text-pretty text-[0.95rem] leading-relaxed text-ash md:pb-2">{lead}</p>
      </Reveal>
    </div>
  );
}
