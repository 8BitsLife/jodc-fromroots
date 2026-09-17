import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionValue, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { TEAM, TEAM_GROUPS, type TeamGroup } from "../../data/team";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { Avatar, GROUP_META, GroupHeader, ease, isOpenSeat, isPlaceholder, socialsFor } from "./shared";

/** How long each person stays featured before the spotlight moves on. */
const CYCLE_MS = 3500;

/** How far (px) or how fast (px/s) a sideways swipe must go to change person. */
const SWIPE_DISTANCE = 50;
const SWIPE_VELOCITY = 400;

/** Portrait card size, shared by the frame and the stacked photos inside it. */
const CARD = "aspect-[3/4] w-[min(15rem,62vw)] sm:w-80 lg:w-[22rem]";

const iconButton =
  "flex h-11 w-11 items-center justify-center rounded-full text-bone ring-1 ring-inset ring-white/15 transition-[background-color,box-shadow,color] duration-200 hover:bg-white/[0.06] hover:ring-white/30 disabled:pointer-events-none disabled:opacity-30";

/**
 * One group: a single member featured large, everyone in a filmstrip below.
 * The feature advances on its own while the section is on screen, pausing
 * whenever the visitor hovers or focuses it. Swipe, click or use the arrows to
 * move through people; once someone does, the group stops advancing on its own.
 */
/** Fisher–Yates shuffle into a new array. */
function shuffled<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function SpotlightGroup({ group, index }: { group: TeamGroup; index: number }) {
  // A fresh order on every page load, so nobody is always first; stable while the page is open.
  const [members] = useState(() => shuffled(TEAM[group]));
  // Lead with the first real profile rather than an open seat, if there is one.
  const [active, setActive] = useState(() => Math.max(0, members.findIndex((m) => !isOpenSeat(m))));
  const [direction, setDirection] = useState<1 | -1>(1);
  const [paused, setPaused] = useState(false);
  const [takenOver, setTakenOver] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  // Groups can be taller than a phone screen, so a small share in view is enough.
  const inView = useInView(sectionRef, { amount: 0.2 });
  const nearView = useInView(sectionRef, { once: true, margin: "600px 0px" });
  const reduced = usePrefersReducedMotion();
  const cycling = members.length > 1 && inView && !paused && !takenOver && !reduced;

  const go = (next: number, dir: 1 | -1) => {
    setTakenOver(true);
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

  // Fetch and decode every full photo before the group scrolls in, so swaps never wait on the network.
  useEffect(() => {
    if (!nearView) return;
    for (const m of members) {
      if (isPlaceholder(m)) continue;
      const img = new Image();
      img.src = m.photo ?? m.image;
      img.decode?.().catch(() => undefined);
    }
  }, [nearView, members]);

  // Hovering the parts people read and click holds the spotlight still.
  const hold = {
    onPointerEnter: (e: ReactPointerEvent) => e.pointerType === "mouse" && setPaused(true),
    onPointerLeave: (e: ReactPointerEvent) => e.pointerType === "mouse" && setPaused(false),
  };

  // Swipe: the portrait follows the finger a little, then the spotlight moves on.
  const swipeX = useMotionValue(0);
  const onPan = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > Math.abs(info.offset.y)) swipeX.set(info.offset.x * 0.3);
  };
  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    animate(swipeX, 0, { type: "spring", stiffness: 420, damping: 38 });
    const { offset, velocity } = info;
    if (members.length < 2 || Math.abs(offset.x) < Math.abs(offset.y)) return;
    if (offset.x < -SWIPE_DISTANCE || velocity.x < -SWIPE_VELOCITY) go(active + 1, 1);
    else if (offset.x > SWIPE_DISTANCE || velocity.x > SWIPE_VELOCITY) go(active - 1, -1);
  };

  // ── Filmstrip scrolling ────────────────────────────────────────────────
  const stripRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const dragged = useRef(false);

  // Only re-render when an end is reached or left, not on every scroll event.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const start = strip.scrollLeft <= 2;
      const end = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - 2;
      setEdges((prev) => (prev.start === start && prev.end === end ? prev : { start, end }));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    strip.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(onScroll);
    observer.observe(strip);
    return () => {
      cancelAnimationFrame(frame);
      strip.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  // Keep the featured thumbnail in view, moving the strip only when it has drifted out.
  useEffect(() => {
    const strip = stripRef.current;
    const item = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !item) return;
    const left = item.offsetLeft;
    const right = left + item.offsetWidth;
    if (left >= strip.scrollLeft && right <= strip.scrollLeft + strip.clientWidth) return;
    strip.scrollTo({ left: left - (strip.clientWidth - item.offsetWidth) / 2, behavior: reduced ? "auto" : "smooth" });
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
    onPointerDown: (e: ReactPointerEvent<HTMLUListElement>) => {
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
    onClickCapture: (e: ReactMouseEvent) => {
      if (!dragged.current) return;
      e.preventDefault();
      e.stopPropagation();
      dragged.current = false;
    },
  };

  const nudge = (dir: 1 | -1) => {
    const strip = stripRef.current;
    strip?.scrollBy({ left: dir * strip.clientWidth * 0.75, behavior: reduced ? "auto" : "smooth" });
  };

  const member = members[active];
  const pad = (n: number) => String(n).padStart(2, "0");

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
          className="mt-10 grid gap-8 sm:mt-16 sm:gap-12 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-stretch lg:gap-20"
        >
          {/* ── Portrait ──────────────────────────────────────────────── */}
          <motion.div style={{ x: swipeX }} className="relative mx-auto select-none lg:mx-0">
            {/* Static glow: a plain gradient, no blur filter to repaint while things move. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-16 bg-[radial-gradient(closest-side,rgba(255,122,26,0.16),transparent)]"
            />

            <div className={`relative ${CARD} overflow-hidden rounded-[1.5rem] bg-ink-soft ring-1 ring-white/10 sm:rounded-[2rem]`}>
              {/* Crossfade in place: every photo sits in the same box, so nothing is re-measured. */}
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  variants={{
                    enter: (d: 1 | -1) => ({ opacity: 0, scale: 1.04, x: d * 24 }),
                    center: { opacity: 1, scale: 1, x: 0 },
                    exit: (d: 1 | -1) => ({ opacity: 0, scale: 1, x: d * -24 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease }}
                  className="absolute inset-0 will-change-[transform,opacity]"
                >
                  <Avatar member={member} size="xl" />
                </motion.div>
              </AnimatePresence>

              {/* Counter on the card itself, over a soft shade. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-ink/70 to-transparent px-5 pb-4 pt-12">
                <span className="font-mono text-[11px] tabular-nums tracking-[0.12em] text-bone/90">
                  {pad(active + 1)} <span className="text-bone/40">/ {pad(members.length)}</span>
                </span>
                {cycling && (
                  <span aria-hidden="true" className="h-0.5 w-14 overflow-hidden rounded-full bg-white/20">
                    <motion.span
                      key={active}
                      className="block h-full origin-left bg-flame"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: CYCLE_MS / 1000, ease: "linear" }}
                    />
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* ── Details ───────────────────────────────────────────────── */}
          {/* Announce swaps the visitor makes, not the automatic ones every few seconds. */}
          <div
            {...hold}
            aria-live={cycling ? "off" : "polite"}
            className="flex min-w-0 flex-col text-center lg:border-t lg:border-white/10 lg:pt-8 lg:text-left"
          >
            {/* Everyone's details share one grid cell, so the block is as tall as the
                longest bio and nothing below it moves as the spotlight changes. */}
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
                        : { opacity: 0, y: -8, transitionEnd: { visibility: "hidden" } }
                    }
                    transition={{ duration: on ? 0.4 : 0.2, delay: on ? 0.1 : 0, ease }}
                    className="[grid-area:1/1]"
                  >
                    <p className="kicker text-flame">
                      {m.role}
                      {isOpenSeat(m) && <span className="text-ash"> · Seat open</span>}
                    </p>
                    <h3 className="mt-4 text-balance text-[clamp(2.25rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-bone sm:mt-5">
                      {m.name}
                    </h3>
                    <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-ash sm:mt-5 sm:text-lg lg:mx-0">
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
                              tabIndex={on ? undefined : -1}
                              aria-label={`${m.name} on ${label}`}
                              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full bg-white/[0.04] px-4 text-sm text-bone ring-1 ring-inset ring-white/10 transition-[background-color,color,box-shadow] duration-200 hover:bg-flame hover:text-ink hover:ring-flame"
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

            {/* Controls sit on the card's bottom edge on desktop, so both columns end together. */}
            {members.length > 1 && (
              <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10 lg:mt-auto lg:justify-start lg:pt-10">
                <button type="button" onClick={() => go(active - 1, -1)} aria-label={`Previous in ${group}`} className={iconButton}>
                  <ArrowLeft size={17} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => go(active + 1, 1)} aria-label={`Next in ${group}`} className={iconButton}>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
                <span className="ml-2 hidden font-mono text-[11px] uppercase tracking-[0.16em] text-ash lg:inline">
                  {takenOver || reduced ? "Browse at your pace" : cycling ? "Auto · hover to pause" : "Paused"}
                </span>
                {/* Only on touch screens, where swiping is the natural way through. */}
                <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ash/60 [@media(hover:hover)]:hidden">
                  Swipe
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Filmstrip ───────────────────────────────────────────────── */}
        {members.length > 1 && (
          <div {...hold} className="mt-12 border-t border-white/10 sm:mt-20">
            <div className="flex items-center justify-between pt-5">
              <p className="kicker">
                Everyone <span className="text-ash/60">· {pad(members.length)}</span>
              </p>
              <div className="hidden items-center gap-2 sm:flex">
                <button type="button" onClick={() => nudge(-1)} disabled={edges.start} aria-label={`Scroll ${group} back`} className={iconButton}>
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => nudge(1)} disabled={edges.end} aria-label={`Scroll ${group} forward`} className={iconButton}>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>

            <ul
              ref={stripRef}
              {...drag}
              aria-label={`Everyone in ${group}`}
              className="-mx-5 mt-4 flex cursor-grab snap-x scroll-px-5 overflow-x-auto overscroll-x-contain px-5 no-scrollbar active:cursor-grabbing sm:mx-0 sm:snap-none sm:px-0"
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
                      className="group relative flex w-[6.5rem] flex-col items-center gap-2.5 rounded-2xl px-1.5 pb-4 pt-3 text-center transition-colors duration-200 hover:bg-white/[0.03] sm:w-[8.5rem] sm:gap-3 sm:px-2"
                    >
                      <span className={`rounded-full transition-[opacity,box-shadow] duration-300 ${selected ? "opacity-100 shadow-[0_0_0_2px_var(--color-ink),0_0_0_3.5px_var(--color-flame)]" : "opacity-55 group-hover:opacity-100"}`}>
                        <Avatar member={m} size="md" />
                      </span>
                      <span className="w-full min-w-0">
                        <span className={`line-clamp-1 block text-[13px] transition-colors duration-200 sm:text-sm ${selected ? "text-bone" : "text-ash group-hover:text-bone"}`}>
                          {m.name}
                        </span>
                        <span className="mt-0.5 line-clamp-1 block font-mono text-[9px] uppercase tracking-[0.12em] text-ash/70 sm:text-[10px] sm:tracking-[0.14em]">
                          {m.role}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
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
