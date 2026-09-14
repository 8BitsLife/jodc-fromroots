import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Github, ArrowUpRight, ChevronDown } from "lucide-react";
import { LogoMark } from "./LogoMark";
import { LINKS, NAV, SITE } from "../data/site";
import type { Route } from "../hooks/useRoute";

interface NavProps {
  currentRoute?: Route;
  onNavigate?: (route: Route, sectionId?: string) => void;
}

export function Nav({ currentRoute = "home", onNavigate }: NavProps) {
  const [open, setOpen] = useState(false);
  const [homeOpen, setHomeOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (currentRoute !== "home") return;

    const sections = NAV
      .filter((item) => item.href.startsWith("#"))
      .map((item) => document.querySelector(item.href))
      .filter((el): el is Element => Boolean(el));

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(`#${visible[visible.length - 1].target.id}`);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 },
    );

    sections.forEach((section) => io.observe(section));
    return () => io.disconnect();
  }, [currentRoute]);

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

  const handleNavClick = (href: string) => {
    setOpen(false);
    setHomeOpen(false);

    if (href === "#hackathon") {
      onNavigate?.("hackathon");
      return;
    }

    if (currentRoute !== "home") {
      onNavigate?.("home", href.replace("#", ""));
      return;
    }

    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    setHomeOpen(false);
    if (currentRoute === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onNavigate?.("home");
    }
  };

  const homeSections = NAV.filter((item) =>
    ["About", "What we do", "Contribute", "Events", "Programs"].includes(item.label),
  );


  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-flame focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink">
        Skip to content
      </a>

      <header className={`site-nav-shell ${scrolled || currentRoute !== "home" ? "is-scrolled" : ""} fixed inset-x-0 top-0 z-[80] border-b border-white/10`}>
        <nav aria-label="Primary" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-8">
          <a href="#top" onClick={handleLogoClick} className="group flex min-h-[44px] items-center gap-3 text-bone" aria-label={`${SITE.name} home`}>
            <LogoMark size={34} />
            <span className="font-display text-lg font-bold tracking-tight">JODC<span className="text-flame">.</span></span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            <li className="relative" onMouseEnter={() => setHomeOpen(true)} onMouseLeave={() => setHomeOpen(false)}>
              <button
                type="button"
                onClick={() => {
                  if (currentRoute !== "home") onNavigate?.("home");
                  else window.scrollTo({ top: 0, behavior: "smooth" });
                  setHomeOpen((v) => !v);
                }}
                className={`relative flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-4 py-2 text-sm ${currentRoute === "home" ? "font-medium text-bone" : "text-ash hover:text-bone"}`}
                aria-expanded={homeOpen}
              >
                {currentRoute === "home" && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/10" />}
                <span>Home</span><ChevronDown size={14} className={`transition-transform ${homeOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {homeOpen && (
                  <motion.div initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.16 }} className="absolute left-1/2 top-full mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-2xl border border-white/15 bg-ink/45 p-2 shadow-2xl backdrop-blur-2xl">
                    {homeSections.map((item) => {
                      const isActive = currentRoute === "home" && active === item.href;
                      return (
                        <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }} className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm ${isActive ? "bg-white/[0.10] text-flame" : "text-ash hover:bg-white/[0.07] hover:text-bone"}`}>
                          <span>{item.label}</span>{isActive && <span className="h-1.5 w-1.5 rounded-full bg-flame" />}
                        </a>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            <li>
              <button type="button" onClick={() => onNavigate?.("team")} className={`relative cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm ${currentRoute === "team" ? "font-medium text-bone" : "text-ash hover:text-bone"}`}>
                {currentRoute === "team" && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/10" />}
                Team
              </button>
            </li>

            <li>
              <a href="#hackathon" onClick={(e) => { e.preventDefault(); handleNavClick("#hackathon"); }} className={`relative cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm ${currentRoute === "hackathon" ? "font-medium text-bone" : "text-ash hover:text-bone"}`}>
                {currentRoute === "hackathon" && <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/10" />}
                Hackathon
              </a>
            </li>

            <li>
              <button type="button" onClick={() => onNavigate?.("repo-of-the-week")} className={`relative flex cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-all ${currentRoute === "repo-of-the-week" ? "border border-flame/40 bg-flame/15 font-medium text-flame" : "border border-transparent text-ash hover:bg-white/5 hover:text-bone"}`}>
                <span>Repo of the Week</span>
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flame opacity-75" /><span className="relative inline-flex h-2 w-2 rounded-full bg-flame" /></span>
              </button>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <a href={LINKS.github} target="_blank" rel="noreferrer noopener" aria-label="JODC on GitHub" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-ash transition-all hover:border-flame/40 hover:bg-flame/10 hover:text-flame">
              <Github size={18} aria-hidden="true" />
            </a>
            <button type="button" onClick={() => handleNavClick("#join")} className="hidden min-h-11 items-center gap-1.5 rounded-full border border-flame/55 bg-flame/10 px-5 text-sm font-medium text-flame transition-all hover:bg-flame hover:text-ink sm:flex">
              Join <ArrowUpRight size={15} />
            </button>
            <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"} className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-bone transition-colors hover:border-flame/30 hover:bg-white/[0.06] lg:hidden">
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} className="fixed inset-0 z-[79] overflow-y-auto bg-ink/82 backdrop-blur-2xl lg:hidden">
            <ul className="mx-auto flex min-h-full max-w-xl flex-col justify-center gap-1 px-6 py-24 sm:px-8">
              <li>
                <button type="button" onClick={() => { setHomeOpen((v) => !v); }} className="flex w-full items-center justify-between border-b border-white/10 py-4 font-display text-2xl font-semibold text-bone">
                  <span>Home</span><ChevronDown size={22} className={homeOpen ? "rotate-180" : ""} />
                </button>
                <AnimatePresence>
                  {homeOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-4">
                      {homeSections.map((item) => (
                        <a key={item.href} href={item.href} onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }} className="block border-b border-white/5 py-3 font-mono text-sm text-ash hover:text-flame">{item.label}</a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
              <li><button type="button" onClick={() => onNavigate?.("team")} className="w-full border-b border-white/10 py-4 text-left font-display text-2xl font-semibold text-bone">Team</button></li>
              <li><button type="button" onClick={() => onNavigate?.("hackathon")} className="w-full border-b border-white/10 py-4 text-left font-display text-2xl font-semibold text-bone">Hackathon</button></li>
              <li><button type="button" onClick={() => onNavigate?.("repo-of-the-week")} className="w-full border-b border-white/10 py-4 text-left font-display text-2xl font-semibold text-bone">Repo of the Week</button></li>
              <li><button type="button" onClick={() => handleNavClick("#join")} className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-flame/50 bg-flame/10 font-display text-lg font-semibold text-flame">Join <ArrowUpRight size={18} /></button></li>
              <li><a href={LINKS.github} target="_blank" rel="noreferrer noopener" className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] font-mono text-sm text-ash"><Github size={17} /> GitHub</a></li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
