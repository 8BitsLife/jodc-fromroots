import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TEAM, TEAM_GROUPS, type TeamGroup } from "../../data/team";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { Avatar, GROUP_META, GroupHeader, ease, isPlaceholder, socialsFor } from "./shared";

/** How long each person stays featured before the spotlight moves on. */
const CYCLE_MS = 7000;

/**
 * One group: a single member featured large, everyone in a filmstrip below.
 * The feature advances on its own while the section is on screen, pausing
 * whenever the visitor hovers or focuses it, so reading is never interrupted.
 */
function SpotlightGroup({ group, index }: { group: TeamGroup; index: number }) {
  const members = TEAM[group];
  // Lead with the first real profile rather than an open seat, if there is one.
  const [active, setActive] = useState(() => Math.max(0, members.findIndex((m) => !isPlaceholder(m))));
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.45 });
  const reduced = usePrefersReducedMotion();
  const cycling = members.length > 1 && inView && !paused && !reduced;

  const go = (next: number, dir: 1 | -1) => {
    setDirection(dir);
    setActive((next + members.length) % members.length);
  };

  useEffect(() => {
    if (!cycling) return;
    const timer = window.setTimeout(() => {
      setDirection(1);
      setActive((a) => (a + 1) % members.length);
    }, CYCLE_MS);
    return () => window.clearTimeout(timer);
  }, [cycling, active, members.length]);

  // Hovering or focusing the parts people read and click holds the spotlight still.
  const hold = {
    onPointerEnter: () => setPaused(true),
    onPointerLeave: () => setPaused(false),
  };

  const member = members[active];
  const socials = socialsFor(member);
  const counter = `${String(active + 1).padStart(2, "0")} / ${String(members.length).padStart(2, "0")}`;

  return (
    <section
      ref={sectionRef}
      id={GROUP_META[group].id}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false);
      }}
      className="relative scroll-mt-24 overflow-x-clip px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="relative mx-auto max-w-7xl">
        <GroupHeader group={group} index={index} />

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[auto_1fr] lg:gap-24">
          {/* ── Portrait ──────────────────────────────────────────────── */}
          <div className="relative mx-auto lg:mx-0">
            <div aria-hidden="true" className="absolute inset-[10%] rounded-full bg-flame/[0.14] blur-[70px]" />

            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="pointer-events-none absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)]"
            >
              <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="0.35" />
              <motion.circle
                key={`ring-${active}`}
                cx="50"
                cy="50"
                r="49"
                fill="none"
                stroke="rgba(255,122,26,0.6)"
                strokeWidth="0.4"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
              />
              <motion.g
                style={{ transformBox: "view-box", transformOrigin: "50px 50px" }}
                animate={reduced ? undefined : { rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="50" cy="1" r="1.1" fill="var(--color-flame)" />
              </motion.g>
            </svg>

            <div className="relative">
              <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                <motion.div
                  key={`portrait-${active}`}
                  custom={direction}
                  initial={{ opacity: 0, scale: 0.9, x: direction * 40 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.94, x: direction * -40 }}
                  transition={{ duration: 0.6, ease }}
                >
                  <Avatar member={member} size="xl" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ── Details ───────────────────────────────────────────────── */}
          {/* Announce swaps the visitor makes, not the automatic ones every few seconds. */}
          <div {...hold} aria-live={cycling ? "off" : "polite"} className="min-w-0 text-center lg:text-left">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`copy-${active}`}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease }}
              >
                <p className="kicker text-flame">
                  {member.role}
                  {isPlaceholder(member) && <span className="text-ash"> · Seat open</span>}
                </p>
                <h3 className="mt-5 text-balance text-[clamp(2.75rem,6.5vw,5.5rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-bone">
                  {member.name}
                </h3>
                <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-ash lg:mx-0">
                  {member.bio}
                </p>

                {socials.length > 0 ? (
                  <ul className="mt-8 flex flex-wrap justify-center gap-2 lg:justify-start">
                    {socials.map(({ Icon, href, label }) => (
                      <li key={label}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer noopener"
                          aria-label={`${member.name} on ${label}`}
                          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white/[0.04] px-4 text-sm text-bone ring-1 ring-inset ring-white/10 transition-colors hover:bg-flame hover:text-ink hover:ring-flame"
                        >
                          <Icon size={15} aria-hidden="true" />
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  isPlaceholder(member) && (
                    <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-ash">
                      Announcement soon
                    </p>
                  )
                )}
              </motion.div>
            </AnimatePresence>

            {members.length > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3 lg:justify-start">
                <button
                  type="button"
                  onClick={() => go(active - 1, -1)}
                  aria-label={`Previous in ${group}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-bone ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/[0.06] hover:ring-white/30"
                >
                  <ArrowLeft size={17} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => go(active + 1, 1)}
                  aria-label={`Next in ${group}`}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-bone ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/[0.06] hover:ring-white/30"
                >
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
                <span className="ml-2 font-mono text-xs tabular-nums text-ash">{counter}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Filmstrip ───────────────────────────────────────────────── */}
        {members.length > 1 && (
          <ul
            {...hold}
            aria-label={`Everyone in ${group}`}
            className="-mx-5 mt-16 flex snap-x gap-1 overflow-x-auto border-t border-white/10 px-5 pt-6 no-scrollbar sm:mx-0 sm:px-0"
          >
            {members.map((m, i) => {
              const selected = i === active;
              return (
                <li key={`${m.name}-${i}`} className="shrink-0 snap-start">
                  <button
                    type="button"
                    onClick={() => go(i, i >= active ? 1 : -1)}
                    aria-pressed={selected}
                    aria-label={`Feature ${m.name}, ${m.role}`}
                    className="group relative flex w-36 flex-col items-center gap-3 px-2 pb-5 pt-3 text-center"
                  >
                    <span className={`transition-opacity duration-300 ${selected ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                      <Avatar member={m} size="md" dim={!selected} />
                    </span>
                    <span className="min-w-0">
                      <span className={`line-clamp-1 block text-sm transition-colors ${selected ? "text-bone" : "text-ash group-hover:text-bone"}`}>
                        {m.name}
                      </span>
                      <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-ash/70">{m.role}</span>
                    </span>

                    {/* Selection marker glides between thumbnails; the fill shows time to the next swap. */}
                    {selected && (
                      <motion.span
                        layoutId={`spotlight-marker-${group}`}
                        className="absolute inset-x-6 bottom-0 h-0.5 overflow-hidden rounded-full bg-white/15"
                        transition={{ type: "spring", stiffness: 380, damping: 34 }}
                      >
                        <motion.span
                          key={`${active}-${cycling}`}
                          className="block h-full origin-left bg-flame"
                          initial={{ scaleX: cycling ? 0 : 1 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: cycling ? CYCLE_MS / 1000 : 0, ease: "linear" }}
                        />
                      </motion.span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}

/** The team page body: one spotlight per group. */
export function SpotlightLayout() {
  return (
    <>
      {TEAM_GROUPS.map((g, gi) => (
        <SpotlightGroup key={g} group={g} index={gi} />
      ))}
    </>
  );
}
