import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X, Github, Instagram, Linkedin, ArrowUpRight, ChevronDown } from "lucide-react";
import { LogoMark } from "./LogoMark";
import { LINKS, NAV, SITE } from "../data/site";
import type { Route } from "../hooks/useRoute";

interface NavProps {
  currentRoute?: Route;
  onNavigate?: (route: Route, sectionId?: string) => void;
}

/** Sections of the home page that get their own entry under "Home". */
const HOME_SECTIONS = NAV.filter((item) => !["Hackathon", "Join"].includes(item.label));

/** Top-level destinations that are pages of their own. */
const PAGES: { route: Exclude<Route, "home">; label: string; live?: boolean }[] = [
  { route: "team", label: "Team" },
  { route: "hackathon", label: "Hackathon" },
  { route: "repo-of-the-week", label: "Repo of the Week", live: true },
];

/** Scroll distance after which the bar lifts into the floating glass capsule. */
const COMPACT_AT = 40;

const ease = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", stiffness: 420, damping: 34 } as const;
const pill = "absolute inset-0 -z-10 rounded-full bg-white/[0.09] ring-1 ring-inset ring-white/10";

export function Nav({ currentRoute = "home", onNavigate }: NavProps) {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [active, setActive] = useState("");
  const shellRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > COMPACT_AT);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which home section sits in the middle of the viewport.
  useEffect(() => {
    if (currentRoute !== "home") {
      setActive("");
      return;
    }

    const sections = HOME_SECTIONS.map((item) => document.querySelector(item.href)).filter(
      (el): el is Element => Boolean(el),
    );

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    sections.forEach((s) => io.observe(s));
    // Above the first tracked section (hero, ticker) nothing is active.
    const onTop = () => window.scrollY < window.innerHeight * 0.6 && setActive("");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onTop);
    };
  }, [currentRoute]);

  // Lock the page behind the mobile sheet, and let Escape close menus.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setHomeOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Specular sheen follows the pointer across the glass.
  const onShellMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = shellRef.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--sheen", "1");
  };
  const onShellLeave = () => shellRef.current?.style.setProperty("--sheen", "0");

  const closeMenus = () => {
    setOpen(false);
    setHomeOpen(false);
  };

  const goToPage = (route: Route) => {
    closeMenus();
    onNavigate?.(route);
  };

  const goToSection = (href: string) => {
    closeMenus();
    const id = href.replace("#", "");
    if (currentRoute !== "home") {
      onNavigate?.("home", id);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    closeMenus();
    if (currentRoute === "home") window.scrollTo({ top: 0, behavior: "smooth" });
    else onNavigate?.("home");
  };

  const activeLabel = HOME_SECTIONS.find((item) => item.href === active)?.label;
  // The mobile sheet hangs off the capsule, so it always uses the glass look.
  const floating = compact || open;

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-flame focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <header className="pointer-events-none fixed inset-x-0 top-0 z-[80] px-3 sm:px-5">
        <div
          ref={shellRef}
          onPointerMove={onShellMove}
          onPointerLeave={onShellLeave}
          data-floating={floating}
          className="nav-shell glass pointer-events-auto relative mx-auto"
        >
          <nav
            aria-label="Primary"
            // Three columns with equal outer tracks keep the links on the true centre line,
            // however wide the logo and the buttons on either side are.
            className={`grid grid-cols-[1fr_auto] items-center gap-3 transition-[height,padding] duration-500 lg:grid-cols-[1fr_auto_1fr] ease-[cubic-bezier(0.16,1,0.3,1)] ${
              floating ? "h-14 pl-3 pr-2 sm:pl-4" : "h-[72px] px-2 sm:px-3"
            }`}
          >
            <a
              href="/"
              onClick={goHome}
              className="group flex min-h-[44px] w-fit shrink-0 items-center gap-2.5 rounded-full text-bone"
              aria-label={`${SITE.name} home`}
            >
              <span
                className={`block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[20deg] ${
                  floating ? "scale-[0.85]" : ""
                }`}
              >
                <LogoMark size={34} />
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                JODC<span className="text-flame">.</span>
              </span>
            </a>

            {/* At the top of the page the links sit on their own faint track; once the
                bar lifts into the glass capsule the track dissolves into it. */}
            <ul
              className={`hidden items-center gap-0.5 rounded-full p-1 transition-[background-color,box-shadow] duration-500 lg:flex ${
                floating ? "bg-transparent shadow-none" : "bg-white/[0.03] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] backdrop-blur-md"
              }`}
            >
              {/* Home and its sections. Opens on hover and keyboard focus; the
                  padded wrapper bridges the gap so it doesn't close mid-travel. */}
              <li
                className="relative"
                onMouseEnter={() => setHomeOpen(true)}
                onMouseLeave={() => setHomeOpen(false)}
                onFocus={() => setHomeOpen(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) setHomeOpen(false);
                }}
              >
                <a
                  href="/"
                  onClick={goHome}
                  aria-haspopup="true"
                  aria-expanded={homeOpen}
                  className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                    currentRoute === "home" ? "font-medium text-bone" : "text-ash hover:text-bone"
                  }`}
                >
                  {currentRoute === "home" && (
                    <motion.span layoutId="nav-pill" className={pill} transition={spring} />
                  )}
                  Home
                  {/* Breadcrumb: where you are on the page, once you've scrolled into it. */}
                  <AnimatePresence initial={false}>
                    {floating && activeLabel && (
                      <motion.span
                        key={activeLabel}
                        initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -6, filter: "blur(4px)", position: "absolute" }}
                        transition={{ duration: 0.3, ease }}
                        className="flex items-center gap-1.5 font-normal text-flame"
                      >
                        <span aria-hidden="true" className="text-white/25">/</span>
                        {activeLabel}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <ChevronDown
                    size={14}
                    aria-hidden="true"
                    className={`text-ash transition-transform duration-300 ${homeOpen ? "rotate-180" : ""}`}
                  />
                </a>

                <AnimatePresence>
                  {homeOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.22, ease }}
                      className="absolute left-0 top-full origin-top-left pt-3"
                    >
                      <ul className="glass glass-nested relative w-60 rounded-[1.4rem] p-1.5">
                        {HOME_SECTIONS.map((item, i) => {
                          const isActive = currentRoute === "home" && active === item.href;
                          return (
                            <li key={item.href}>
                              <a
                                href={item.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  goToSection(item.href);
                                }}
                                aria-current={isActive ? "true" : undefined}
                                className={`group/item flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm transition-colors ${
                                  isActive
                                    ? "bg-white/[0.08] text-bone"
                                    : "text-ash hover:bg-white/[0.06] hover:text-bone"
                                }`}
                              >
                                <span
                                  className={`font-mono text-[10px] ${isActive ? "text-flame" : "text-white/30"}`}
                                >
                                  {String(i).padStart(2, "0")}
                                </span>
                                <span className="flex-1">{item.label}</span>
                                <ArrowUpRight
                                  size={13}
                                  aria-hidden="true"
                                  className={`transition-all duration-300 ${
                                    isActive
                                      ? "text-flame"
                                      : "-translate-x-1 opacity-0 group-hover/item:translate-x-0 group-hover/item:opacity-100"
                                  }`}
                                />
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              {PAGES.map(({ route, label, live }) => {
                const isActive = currentRoute === route;
                return (
                  <li key={route}>
                    <a
                      href={`/${route}`}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(route);
                      }}
                      aria-current={isActive ? "page" : undefined}
                      className={`relative flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                        isActive ? "font-medium text-bone" : "text-ash hover:text-bone"
                      }`}
                    >
                      {isActive && <motion.span layoutId="nav-pill" className={pill} transition={spring} />}
                      {label}
                      {live && (
                        <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame" />
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex shrink-0 items-center justify-end gap-1.5">
              <a
                href={LINKS.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="JODC on GitHub"
                className="hidden h-10 w-10 items-center justify-center rounded-full text-ash transition-colors hover:bg-white/[0.08] hover:text-bone sm:flex"
              >
                <Github size={18} aria-hidden="true" />
              </a>
              <a
                href="#join"
                onClick={(e) => {
                  e.preventDefault();
                  goToSection("#join");
                }}
                className={`group hidden items-center gap-1.5 rounded-full bg-flame text-sm font-semibold text-ink shadow-[0_6px_24px_-8px_rgba(255,122,26,0.9),inset_0_1px_0_rgba(255,255,255,0.35)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-flame-hot sm:inline-flex ${
                  floating ? "h-10 px-4" : "h-11 px-5"
                }`}
              >
                Join the club
                <ArrowUpRight
                  size={15}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="relative flex h-11 w-11 items-center justify-center rounded-full text-bone transition-colors hover:bg-white/[0.08] lg:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={open ? "close" : "open"}
                    initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                    transition={{ duration: 0.18 }}
                  >
                    {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
                  </motion.span>
                </AnimatePresence>
              </button>
            </div>
          </nav>

          {/* Reading progress, riding the bottom rim of the capsule. */}
          <motion.span
            aria-hidden="true"
            style={{ scaleX: progress }}
            className={`pointer-events-none absolute inset-x-6 bottom-0 h-px origin-left bg-gradient-to-r from-transparent via-flame to-flame-hot transition-opacity duration-500 ${
              compact && !open ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              tabIndex={-1}
              onClick={closeMenus}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[78] bg-ink/60 backdrop-blur-sm lg:hidden"
            />

            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.3, ease }}
              className="glass fixed inset-x-3 top-[4.75rem] z-[79] max-h-[calc(100dvh-6rem)] origin-top overflow-y-auto rounded-[1.75rem] p-3 sm:inset-x-5 lg:hidden"
            >
              <ul className="flex flex-col">
                <li>
                  <button
                    type="button"
                    onClick={() => setHomeOpen((v) => !v)}
                    aria-expanded={homeOpen}
                    aria-controls="mobile-home-sections"
                    className={`flex min-h-[52px] w-full items-center justify-between rounded-2xl px-4 font-display text-xl font-semibold transition-colors hover:bg-white/[0.05] ${
                      currentRoute === "home" ? "text-flame" : "text-bone"
                    }`}
                  >
                    Home
                    <ChevronDown
                      size={20}
                      aria-hidden="true"
                      className={`text-ash transition-transform duration-300 ${homeOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {homeOpen && (
                      <motion.ul
                        id="mobile-home-sections"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease }}
                        className="overflow-hidden"
                      >
                        {HOME_SECTIONS.map((item, i) => {
                          const isActive = currentRoute === "home" && active === item.href;
                          return (
                            <li key={item.href}>
                              <a
                                href={item.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  goToSection(item.href);
                                }}
                                className={`flex min-h-[44px] items-center gap-3 rounded-xl pl-6 pr-4 text-sm transition-colors hover:bg-white/[0.05] ${
                                  isActive ? "text-flame" : "text-ash hover:text-bone"
                                }`}
                              >
                                <span className="font-mono text-[10px] text-white/30">
                                  {String(i).padStart(2, "0")}
                                </span>
                                {item.label}
                              </a>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </li>

                {PAGES.map(({ route, label, live }, i) => (
                  <motion.li
                    key={route}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.04, ease }}
                  >
                    <a
                      href={`/${route}`}
                      onClick={(e) => {
                        e.preventDefault();
                        goToPage(route);
                      }}
                      aria-current={currentRoute === route ? "page" : undefined}
                      className={`flex min-h-[52px] items-center justify-between rounded-2xl px-4 font-display text-xl font-semibold transition-colors hover:bg-white/[0.05] ${
                        currentRoute === route ? "text-flame" : "text-bone"
                      }`}
                    >
                      {label}
                      {live && (
                        <span className="rounded-full bg-flame/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-flame ring-1 ring-inset ring-flame/40">
                          Spotlight
                        </span>
                      )}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-3 border-t border-white/10 pt-3">
                <a
                  href="#join"
                  onClick={(e) => {
                    e.preventDefault();
                    goToSection("#join");
                  }}
                  className="flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-flame font-semibold text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-colors hover:bg-flame-hot"
                >
                  Join the club
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>

                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    { href: LINKS.github, label: "GitHub", Icon: Github },
                    { href: LINKS.instagram, label: "Instagram", Icon: Instagram },
                    { href: LINKS.linkedin, label: "LinkedIn", Icon: Linkedin },
                  ].map(({ href, label, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`JODC on ${label}`}
                      className="flex min-h-[44px] items-center justify-center rounded-2xl bg-white/[0.05] text-ash transition-colors hover:bg-white/[0.1] hover:text-bone"
                    >
                      <Icon size={17} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
