import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { TEAM, TEAM_GROUPS, type TeamGroup } from "../../data/team";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { Avatar, GROUP_META, GroupHeader, ease, isOpenSeat, socialsFor } from "./shared";

/** How long each person stays featured before the spotlight moves on. */
const CYCLE_MS = 3500;

/** How far (px) or how fast (px/s) a sideways swipe must go to change person. */
const SWIPE_DISTANCE = 50;
const SWIPE_VELOCITY = 400;

/**
 * One group: a single member featured large, everyone in a filmstrip below.
 * The feature advances on its own while the section is on screen, pausing
 * whenever the visitor hovers or focuses it. Swipe sideways to move through
 * people; once someone swipes or taps, the group stops advancing on its own.
 */
function SpotlightGroup({ group, index }: { group: TeamGroup; index: number }) {
  const members = TEAM[group];
  // Lead with the first real profile rather than an open seat, if there is one.
  const [active, setActive] = useState(() => Math.max(0, members.findIndex((m) => !isOpenSeat(m))));
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  // Touch has no hover to pause on, so taking control by hand stops the auto-advance for good.
  const [takenOver, setTakenOver] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  // Groups can be taller than a phone screen, so a small share in view is enough.
  const inView = useInView(sectionRef, { amount: 0.2 });
  const reduced = usePrefersReducedMotion();
  const cycling = members.length > 1 && inView && !paused && !takenOver && !reduced;

  const go = (next: number, dir: 1 | -1) => {
    setTakenOver(true);
    setDirection(dir);
    setActive((next + members.length) % members.length);
  };

  // Swipe: the portrait follows the finger a little, then the spotlight moves on.
  const swipeX = useMotionValue(0);
  const onPan = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) swipeX.set(info.offset.x * 0.35);
  };
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    animate(swipeX, 0, { type: "spring", stiffness: 420, damping: 36 });
    const { offset, velocity } = info;
    if (members.length < 2 || Math.abs(offset.x) < Math.abs(offset.y)) return;
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) go(active + 1, 1);
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) go(active - 1, -1);
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

  const stripRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const dragged = useRef(false);

  // Track whether the filmstrip can scroll either way, for the arrows and edge fades.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const update = () =>
      setEdges({
        start: strip.scrollLeft <= 2,
        end: strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2,
      });
    update();
    strip.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(strip);
    return () => {
      strip.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  // Keep the featured person's thumbnail in view as the spotlight moves on.
  useEffect(() => {
    const strip = stripRef.current;
    const item = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !item) return;
    const left = item.offsetLeft - strip.offsetLeft - (strip.clientWidth - item.offsetWidth) / 2;
    strip.scrollTo({ left, behavior: reduced ? "auto" : "smooth" });
  }, [active, reduced]);

  // A vertical mouse wheel scrolls the strip sideways until it reaches an end, then the page takes over.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = strip.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      strip.scrollLeft += e.deltaY;
    };
    strip.addEventListener("wheel", onWheel, { passive: false });
    return () => strip.removeEventListener("wheel", onWheel);
  }, []);

  // Click-and-drag with a mouse; touch already scrolls natively.
  const drag = {
    onPointerDown: (e: React.PointerEvent<HTMLUListElement>) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      const strip = e.currentTarget;
      const startX = e.clientX;
      const startLeft = strip.scrollLeft;
      dragged.current = false;
      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        if (Math.abs(dx) > 5) dragged.current = true;
        if (dragged.current) strip.scrollLeft = startLeft - dx;
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    },
    onClickCapture: (e: React.MouseEvent) => {
      if (dragged.current) {
        e.preventDefault();
        e.stopPropagation();
        dragged.current = false;
      }
    },
  };

  const nudge = (dir: 1 | -1) => {
    const strip = stripRef.current;
    strip?.scrollBy({ left: dir * strip.clientWidth * 0.8, behavior: reduced ? "auto" : "smooth" });
  };

  const member = members[active];
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

        {/* pan-y keeps vertical page scrolling native while sideways swipes change person. */}
        <motion.div
          onPan={onPan}
          onPanEnd={onPanEnd}
          style={{ touchAction: "pan-y" }}
          className="mt-10 grid items-center gap-8 sm:mt-16 sm:gap-12 lg:grid-cols-[auto_1fr] lg:gap-24"
        >
          {/* ── Portrait ──────────────────────────────────────────────── */}
          <motion.div style={{ x: swipeX }} className="relative mx-auto select-none lg:mx-0">
            <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-flame/[0.14] blur-[70px]" />

            {/* Frame that traces itself around each new portrait. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="pointer-events-none absolute -inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] overflow-visible sm:-inset-4 sm:h-[calc(100%+2rem)] sm:w-[calc(100%+2rem)]"
            >
              <rect x="0.5" y="0.5" width="99" height="99" rx="12" ry="9" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <motion.rect
                key={`frame-${active}`}
                x="0.5"
                y="0.5"
                width="99"
                height="99"
                rx="12"
                ry="9"
                fill="none"
                stroke="rgba(255,122,26,0.6)"
                strokeWidth="1.25"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
              />
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
          </motion.div>

          {/* ── Details ───────────────────────────────────────────────── */}
          {/* Announce swaps the visitor makes, not the automatic ones every few seconds. */}
          <div {...hold} aria-live={cycling ? "off" : "polite"} className="min-w-0 text-center lg:text-left">
            {/* Everyone's details share one grid cell, so the block is as tall as the
                longest bio and the page never jumps as the spotlight moves. */}
            <div className="grid">
              {members.map((m, i) => {
                const on = i === active;
                const links = socialsFor(m);
                return (
                  <motion.div
                    key={`${m.name}-${i}`}
                    aria-hidden={!on}
                    initial={false}
                    animate={
                      on
                        ? { opacity: 1, y: 0, visibility: "visible" }
                        : { opacity: 0, y: -10, transitionEnd: { visibility: "hidden" } }
                    }
                    transition={{ duration: on ? 0.45 : 0.25, delay: on ? 0.12 : 0, ease }}
                    className="[grid-area:1/1]"
                  >
                    <p className="kicker text-flame">
                      {m.role}
                      {isOpenSeat(m) && <span className="text-ash"> · Seat open</span>}
                    </p>
                    <h3 className="mt-4 text-balance text-[clamp(2.25rem,6.5vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-bone sm:mt-5">
                      {m.name}
                    </h3>
                    <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ash sm:mt-6 sm:text-lg lg:mx-0">
                      {m.bio}
                    </p>

                    {links.length > 0 ? (
                      <ul className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 lg:justify-start">
                        {links.map(({ Icon, href, label }) => (
                          <li key={label}>
                            <a
                              href={href}
                              target="_blank"
                              rel="noreferrer noopener"
                              aria-label={`${m.name} on ${label}`}
                              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-white/[0.04] px-4 text-sm text-bone ring-1 ring-inset ring-white/10 transition-colors hover:bg-flame hover:text-ink hover:ring-flame"
                            >
                              <Icon size={15} aria-hidden="true" />
                              <span className="max-[400px]:sr-only">{label}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      isOpenSeat(m) && (
                        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-ash">Announcement soon</p>
                      )
                    )}
                  </motion.div>
                );
              })}
            </div>

            {members.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10 lg:justify-start">
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
                {/* Only on touch screens, where swiping is the natural way through. */}
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ash/60 [@media(hover:hover)]:hidden">
                  · Swipe
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Filmstrip ───────────────────────────────────────────────── */}
        {members.length > 1 && (
          <div {...hold} className="relative -mx-5 mt-12 border-t border-white/10 sm:mx-0 sm:mt-16">
            <ul
              ref={stripRef}
              {...drag}
              aria-label={`Everyone in ${group}`}
              className="flex cursor-grab snap-x scroll-px-5 overflow-x-auto overscroll-x-contain px-5 pt-4 no-scrollbar active:cursor-grabbing sm:gap-1 sm:snap-none sm:px-0 sm:pt-6"
              style={{
                maskImage: `linear-gradient(90deg, ${edges.start ? "#000" : "transparent"}, #000 3rem, #000 calc(100% - 3rem), ${edges.end ? "#000" : "transparent"})`,
              }}
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
                      className="group relative flex w-[6.5rem] flex-col items-center gap-2.5 px-1.5 pb-4 pt-3 text-center sm:w-36 sm:gap-3 sm:px-2 sm:pb-5"
                    >
                      <span className={`transition-opacity duration-300 ${selected ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                        <Avatar member={m} size="md" dim={!selected} />
                      </span>
                      <span className="w-full min-w-0">
                        <span className={`line-clamp-1 block text-[13px] transition-colors sm:text-sm ${selected ? "text-bone" : "text-ash group-hover:text-bone"}`}>
                          {m.name}
                        </span>
                        <span className="mt-0.5 line-clamp-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-ash/70 sm:text-[10px] sm:tracking-[0.14em]">
                          {m.role}
                        </span>
                      </span>

                      {/* Selection marker glides between thumbnails; the fill shows time to the next swap. */}
                      {selected && (
                        <motion.span
                          layoutId={`spotlight-marker-${group}`}
                          className="absolute inset-x-4 bottom-0 h-0.5 overflow-hidden sm:inset-x-6 rounded-full bg-white/15"
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

            {/* Scroll arrows for pointer users; hidden once there is nothing more that way. */}
            {(["start", "end"] as const).map((side) => {
              const Icon = side === "start" ? ChevronLeft : ChevronRight;
              const hidden = edges[side];
              return (
                <button
                  key={side}
                  type="button"
                  onClick={() => nudge(side === "start" ? -1 : 1)}
                  aria-label={side === "start" ? `Scroll ${group} back` : `Scroll ${group} forward`}
                  tabIndex={hidden ? -1 : 0}
                  className={`absolute top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink/80 text-bone ring-1 ring-inset ring-white/15 backdrop-blur transition-[opacity,background-color] duration-300 hover:bg-flame hover:text-ink sm:flex ${
                    side === "start" ? "-left-2" : "-right-2"
                  } ${hidden ? "pointer-events-none opacity-0" : "opacity-100"}`}
                >
                  <Icon size={18} aria-hidden="true" />
                </button>
              );
            })}
          </div>
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
