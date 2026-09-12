import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Github, Instagram, ArrowUpRight } from "lucide-react";
import { LogoMark } from "./LogoMark";
import { LINKS, NAV, SITE } from "../data/site";
import type { Route } from "../hooks/useRoute";

interface NavProps {
  currentRoute?: Route;
  onNavigate?: (route: Route, sectionId?: string) => void;
}

export function Nav({ currentRoute = "home", onNavigate }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section is sitting in the middle of the viewport on home page.
  useEffect(() => {
    if (currentRoute !== "home") return;

    const sections = NAV.map((n) => document.querySelector(n.href)).filter(
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
    return () => io.disconnect();
  }, [currentRoute]);

  // Lock the page behind the mobile sheet, and let Escape close it.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleNavClick = (href: string) => {
    setOpen(false);
    if (currentRoute !== "home") {
      const section = href.replace("#", "");
      onNavigate?.("home", section);
    } else if (href.startsWith("#")) {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 120);
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    if (currentRoute === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onNavigate?.("home");
    }
  };

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-flame focus:px-5 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[80] transition-all duration-300 ${
          scrolled
            ? "border-b border-white/5 bg-ink/75 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-5 sm:px-8"
        >
          <a
            href="#top"
            onClick={handleLogoClick}
            className="flex min-h-[44px] items-center gap-3 text-bone group"
            aria-label={`${SITE.name} home`}
          >
            <LogoMark size={34} />
            <span className="font-display text-lg font-bold tracking-tight">
              JODC<span className="text-flame">.</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => {
              const isActive = currentRoute === "home" && active === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors ${
                      isActive ? "text-bone" : "text-ash hover:text-bone"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.07] ring-1 ring-inset ring-white/10"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {item.label}
                  </a>
                </li>
              );
            })}

            {/* Special Repo of the Week Nav Item */}
            <li>
              <button
                type="button"
                onClick={() => onNavigate?.("repo-of-the-week")}
                className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm transition-all ${
                  currentRoute === "repo-of-the-week"
                    ? "bg-flame/15 text-flame border border-flame/40 shadow-[0_0_15px_rgba(255,122,26,0.2)] font-medium"
                    : "text-ash hover:text-bone hover:bg-white/5 border border-transparent"
                }`}
              >
                <span>Repo of the Week</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flame opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-flame" />
                </span>
              </button>
            </li>
          </ul>

          <div className="flex items-center gap-2">
            <a
              href={LINKS.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="JODC on GitHub"
              className="hidden h-11 w-11 items-center justify-center rounded-full text-ash transition-colors hover:bg-white/5 hover:text-bone sm:flex"
            >
              <Github size={18} aria-hidden="true" />
            </a>
            <a
              href="#join"
              onClick={() => handleNavClick("#join")}
              className="hidden rounded-full bg-flame px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-flame-hot lg:inline-flex"
            >
              Join the club
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full text-bone transition-colors hover:bg-white/5 lg:hidden"
            >
              {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[79] bg-ink/95 backdrop-blur-xl lg:hidden overflow-y-auto"
          >
            <ul className="flex min-h-full flex-col justify-center gap-1 px-6 sm:px-8 py-20">
              {/* Highlight link to Repo of the Week on mobile */}
              <motion.li
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.("repo-of-the-week");
                  }}
                  className={`w-full text-left flex items-center justify-between border-b border-flame/30 py-4 font-display text-2xl font-bold transition-colors cursor-pointer touch-manipulation ${
                    currentRoute === "repo-of-the-week" ? "text-flame" : "text-flame hover:text-flame-hot"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>Repo of the Week</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-flame opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-flame" />
                    </span>
                  </span>
                  <span className="rounded-full bg-flame px-2.5 py-0.5 font-mono text-[11px] font-semibold text-ink uppercase">
                    Spotlight
                  </span>
                </button>
              </motion.li>

              {NAV.map((item, i) => {
                const isActive = currentRoute === "home" && active === item.href;
                return (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      className={`flex items-center justify-between border-b border-white/5 py-3.5 font-display text-2xl font-semibold transition-colors touch-manipulation ${
                        isActive ? "text-flame" : "text-bone hover:text-flame"
                      }`}
                    >
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-flame" />
                      )}
                    </a>
                  </motion.li>
                );
              })}

              <motion.li
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="pt-6 flex flex-col gap-4"
              >
                <a
                  href="#join"
                  onClick={() => handleNavClick("#join")}
                  className="flex min-h-[48px] items-center justify-center rounded-full bg-flame px-7 py-3 font-semibold text-ink shadow-[0_0_25px_rgba(255,122,26,0.3)] transition-colors hover:bg-flame-hot touch-manipulation"
                >
                  Join the club
                </a>

                {/* Mobile Drawer Social Links */}
                <div className="flex items-center justify-center gap-3 pt-2">
                  <a
                    href={LINKS.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-mono text-ash hover:border-flame/40 hover:text-bone transition-all touch-manipulation"
                  >
                    <Github size={15} />
                    <span>GitHub</span>
                    <ArrowUpRight size={12} className="opacity-60" />
                  </a>

                  <a
                    href={LINKS.instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex min-h-[44px] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-mono text-ash hover:border-flame/40 hover:text-bone transition-all touch-manipulation"
                  >
                    <Instagram size={15} />
                    <span>Instagram</span>
                    <ArrowUpRight size={12} className="opacity-60" />
                  </a>
                </div>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
