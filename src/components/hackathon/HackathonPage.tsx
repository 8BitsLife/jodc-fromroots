import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  Code2,
  Trophy,
  Plus,
  Lightbulb,
  Rocket,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  DoorOpen,
  Lock,
  Zap,
  Compass,
  GitPullRequest,
  Brain,
  Globe,
  Wallet,
  HeartPulse,
  Leaf,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "../Reveal";
import { Footer } from "../Footer";
import { Button } from "../Button";
import { SectionHeading } from "../SectionHeading";
import { RegisterModal } from "./RegisterModal";
import { HACKATHON_DETAILS, HACKATHON_FAQS } from "../../data/hackathon";
import type { Route } from "../../hooks/useRoute";

interface HackathonPageProps {
  onBackToHome: () => void;
  onNavigate?: (route: Route, sectionId?: string) => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

const tracks: { number: string; title: string; icon: LucideIcon; tags: string[]; body: string }[] = [
  {
    number: "01",
    title: "Artificial intelligence & machine learning",
    icon: Brain,
    tags: ["#Agents", "#Inference", "#NeuralNets"],
    body: "Autonomous agentic workflows, local edge inference models, predictive algorithms, and high-impact machine learning tooling.",
  },
  {
    number: "02",
    title: "Web & app development",
    icon: Globe,
    tags: ["#NextGen", "#Realtime", "#Distributed"],
    body: "Next-gen web applications, developer platforms, real-time collaboration engines, and scalable distributed architectures.",
  },
  {
    number: "03",
    title: "Fintech & open payments",
    icon: Wallet,
    tags: ["#Protocols", "#MicroPayments", "#Ledgers"],
    body: "Decentralized protocols, automated micro-payment pipes, fraud detection heuristics, and programmable ledger infrastructure.",
  },
  {
    number: "04",
    title: "Healthcare & bio-tech",
    icon: HeartPulse,
    tags: ["#Diagnostics", "#BioData", "#CareFlow"],
    body: "Patient analytics, telemetry diagnostic systems, medical sensor networks, and hospital triage workflow optimization.",
  },
  {
    number: "05",
    title: "Sustainability & smart campus",
    icon: Leaf,
    tags: ["#CleanGrid", "#IoTSensors", "#CarbonZero"],
    body: "Energy grid monitoring, environmental IoT sensor mesh, carbon tracking telemetry, and smart campus efficiency systems.",
  },
  {
    number: "06",
    title: "Open innovation",
    icon: Layers,
    tags: ["#Wildcard", "#NoLimits", "#Moonshots"],
    body: "Unconstrained breakthroughs. If your vision tackles a painful bottleneck outside these tracks, build and demo it here.",
  },
];

const timeline: { number: string; phase: string; title: string; date: string; icon: LucideIcon; body: string }[] = [
  {
    number: "01",
    phase: "Registration Kickoff",
    title: "Registrations open",
    date: "TBA",
    icon: DoorOpen,
    body: "Team registrations officially commence on the developer portal. Claim your squad handle.",
  },
  {
    number: "02",
    phase: "Roster Lock",
    title: "Registrations close",
    date: "TBA",
    icon: Lock,
    body: "Final deadline to lock in your squad roster, repository links, and initial project scope.",
  },
  {
    number: "03",
    phase: "Screening",
    title: "Team shortlisting",
    date: "TBA",
    icon: CheckCircle2,
    body: "Technical evaluations complete. Shortlisted squads receive their developer check-in badges.",
  },
  {
    number: "04",
    phase: "The Sprint",
    title: "Hackathon kickoff",
    date: "TBA",
    icon: Zap,
    body: "Opening ceremony, sponsor challenge briefs drop, and 36 hours of live building begins.",
  },
  {
    number: "05",
    phase: "Pairing",
    title: "Mentoring & checkpoints",
    date: "TBA",
    icon: Compass,
    body: "1-on-1 architecture reviews, code debugging clinics, and pairing with seasoned industry mentors.",
  },
  {
    number: "06",
    phase: "Code Freeze",
    title: "Final code freeze",
    date: "TBA",
    icon: GitPullRequest,
    body: "Pull requests locked, project repositories submitted, and deployment URLs audited.",
  },
  {
    number: "07",
    phase: "Demo Day",
    title: "Grand finale & awards",
    date: "TBA",
    icon: Trophy,
    body: "Live mainstage demonstrations, jury interrogation, and winner announcements.",
  },
];

const phases: { number: string; title: string; tag: string; icon: LucideIcon; body: string }[] = [
  {
    number: "01",
    title: "Imagine",
    tag: "Ideation",
    icon: Lightbulb,
    body: "Start with a problem worth solving. Brainstorm bold solutions, define system boundaries, and pitch novel approaches with zero gatekeeping.",
  },
  {
    number: "02",
    title: "Create",
    tag: "Build Sprint",
    icon: Code2,
    body: "Prototype, experiment, and collaborate. Write clean code, push upstream commits, and pair with experienced industry mentors in real-time.",
  },
  {
    number: "03",
    title: "Impact",
    tag: "Demo Day",
    icon: Rocket,
    body: "Showcase a solution built to matter. Deploy to live staging, demo to seasoned judges, and launch your project into the open source ecosystem.",
  },
];

const prizes = [
  {
    rank: 1,
    place: "1st place",
    tier: "Gold Tier Champion",
    amount: "₹ TBA",
    perks: "Grand Cash Prize + Sponsor Bounties + Hardware Perks + Winner Trophy + Certificate",
  },
  {
    rank: 2,
    place: "2nd place",
    tier: "Silver Tier Runner-Up",
    amount: "₹ TBA",
    perks: "Cash Prize + Sponsor Bounties + Exclusive Swag + Runner-up Trophy + Certificate",
  },
  {
    rank: 3,
    place: "3rd place",
    tier: "Bronze Tier Finalist",
    amount: "₹ TBA",
    perks: "Cash Prize + Goodies + Certificate of Excellence + Mentorship Access",
  },
];

/** Medal dots: brushed gold, silver and bronze, kept small so the type leads. */
const MEDALS = [
  "bg-[radial-gradient(circle_at_35%_30%,#ffe7a8,#d9a441_60%,#9a6b1c)] shadow-[0_0_14px_rgba(217,164,65,0.45)]",
  "bg-[radial-gradient(circle_at_35%_30%,#ffffff,#b9bec6_60%,#6f757e)]",
  "bg-[radial-gradient(circle_at_35%_30%,#f3c3a0,#b8703f_60%,#6e3d1d)]",
];

const specs: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Date", value: "TBA • Date Coming Soon", icon: Calendar },
  { label: "Venue", value: "JIIT-128 Campus & Online", icon: MapPin },
  { label: "Team size", value: "2 – 4 Builders", icon: Users },
  { label: "Registration", value: "Opening Soon (TBA)", icon: Code2 },
];

/** One quiet status line in place of a loud banner: a live dot and a sentence. */
function Status({ children }: { children: string }) {
  return (
    <p className="mt-8 flex items-start gap-3 font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.16em] text-ash">
      <span aria-hidden="true" className="relative mt-1 flex h-2 w-2 shrink-0">
        <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-flame" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-flame" />
      </span>
      {children}
    </p>
  );
}

/**
 * Hero dial: 36 hour ticks around a thin ring that draws itself once, and a
 * single dot drifting slowly round it. Deliberately quiet — no glow, low
 * contrast — so it sits beside the headline instead of competing with it.
 */
function HoursDial() {
  const ticks = Array.from({ length: 36 }, (_, i) => i);
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[24rem]">
      <div aria-hidden="true" className="absolute inset-[22%] rounded-full bg-flame/[0.06] blur-[70px]" />

      <svg viewBox="0 0 200 200" className="relative h-full w-full" aria-hidden="true">
        {ticks.map((i) => (
          <line
            key={i}
            x1="100"
            y1={i % 6 === 0 ? 9 : 12}
            x2="100"
            y2="15"
            stroke={i % 6 === 0 ? "rgba(245,245,244,0.32)" : "rgba(245,245,244,0.12)"}
            strokeWidth="1"
            strokeLinecap="round"
            transform={`rotate(${i * 10} 100 100)`}
          />
        ))}

        <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <motion.circle
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke="rgba(255,122,26,0.55)"
          strokeWidth="1.25"
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.4, ease: [0.65, 0, 0.35, 1] }}
        />

        {/* One slow orbit a minute: enough to feel alive, not enough to watch. */}
        <motion.g
          // Rotate about the dial's centre, not the dot's own bounding box.
          style={{ transformBox: "view-box", transformOrigin: "100px 100px" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="100" cy="18" r="2.25" fill="var(--color-flame)" />
        </motion.g>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-[clamp(4rem,7.5vw,5.75rem)] font-medium leading-none tracking-[-0.05em] text-bone/90">
          36
        </span>
        <span className="kicker mt-3 text-ash/80">Hours · Non-stop</span>
      </div>
    </div>
  );
}

/**
 * One milestone. Its node and connector watch their own position against a
 * line 60% down the viewport: as the page's progress fill reaches the node it
 * lights up, and it dims again if you scroll back above it.
 */
function TimelineItem({ item, index, last }: { item: (typeof timeline)[number]; index: number; last: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.62", "start 0.5"] });
  const lit = useSpring(scrollYProgress, { stiffness: 220, damping: 30 });
  const nodeBg = useTransform(lit, [0, 1], ["rgba(8,8,10,1)", "rgba(255,122,26,1)"]);
  const nodeText = useTransform(lit, [0, 1], ["rgba(255,122,26,1)", "rgba(8,8,10,1)"]);
  const nodeGlow = useTransform(lit, [0, 1], ["0 0 0 0 rgba(255,122,26,0)", "0 0 0 6px rgba(255,122,26,0.12), 0 0 28px rgba(255,122,26,0.55)"]);
  const connector = useTransform(lit, [0, 1], [0, 1]);
  const cardRing = useTransform(lit, [0, 1], ["rgba(255,255,255,0.08)", "rgba(255,122,26,0.28)"]);
  const cardShadow = useTransform(cardRing, (c) => `inset 0 0 0 1px ${c}`);

  const left = index % 2 === 0;
  const { number, phase, title, date, body, icon: Icon } = item;

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[2.5rem_1fr] gap-x-5 pb-10 last:pb-0 lg:grid-cols-[1fr_5rem_1fr] lg:gap-x-0 lg:pb-4"
    >
      {/* Node on the spine */}
      <div className="relative col-start-1 row-start-1 flex justify-center pt-6 lg:col-start-2">
        <motion.span
          style={{ backgroundColor: nodeBg, color: nodeText, boxShadow: nodeGlow }}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full font-mono text-[11px] ring-1 ring-inset ring-flame/50"
        >
          {number}
        </motion.span>

        {/* Connector toward the card, lighting with the node. */}
        <motion.span
          aria-hidden="true"
          style={{ scaleX: connector }}
          className={`absolute top-[2.75rem] hidden h-px w-[calc(50%-1.25rem)] bg-flame lg:block ${
            left ? "right-1/2 mr-5 origin-right" : "left-1/2 ml-5 origin-left"
          }`}
        />
      </div>

      <motion.article
        initial={{ opacity: 0, x: left ? -28 : 28 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        style={{ boxShadow: cardShadow }}
        className={`group relative col-start-2 row-start-1 overflow-hidden rounded-2xl p-6 transition-colors duration-300 sm:p-7 ${
          left ? "lg:col-start-1 lg:mr-2" : "lg:col-start-3 lg:ml-2"
        } ${last ? "bg-flame/[0.05] hover:bg-flame/[0.08]" : "bg-white/[0.02] hover:bg-white/[0.04]"}`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="kicker flex items-center gap-2">
            <Icon size={13} aria-hidden="true" className="text-flame" />
            Phase {number} · {phase}
          </p>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-bone ring-1 ring-inset ring-white/10">
            <Calendar size={11} aria-hidden="true" className="text-flame" />
            {date}
          </span>
        </div>

        <h3 className="mt-4 text-[1.5rem] font-medium tracking-tight text-bone transition-colors duration-300 group-hover:text-flame sm:text-[1.75rem]">
          {title}
        </h3>
        <p className="mt-2.5 text-pretty text-sm leading-relaxed text-ash">{body}</p>

        <p className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4 font-mono text-[11px] text-ash">
          <span>
            Milestone {number} of {String(timeline.length).padStart(2, "0")}
          </span>
          <span className="text-bone/80">{last ? "Finale" : "Scheduled"}</span>
        </p>
      </motion.article>
    </li>
  );
}

/**
 * Alternating milestones around a central spine. A flame fill grows down the
 * spine with scroll, a glowing tip rides its leading edge, and each node lights
 * as the fill passes it. On small screens the spine moves to the left edge.
 */
function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });
  const tipTop = useTransform(fill, (v) => `${v * 100}%`);
  const tipOpacity = useTransform(fill, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <div className="relative mt-12">
      {/* Spine: faint track, flame fill and glowing tip. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 left-5 top-6 w-px -translate-x-1/2 lg:left-1/2"
      >
        <span className="absolute inset-0 bg-white/10" />
        <motion.span
          style={{ scaleY: fill }}
          className="absolute inset-0 origin-top bg-gradient-to-b from-flame-deep via-flame to-flame-hot"
        />
        <motion.span
          style={{ top: tipTop, opacity: tipOpacity }}
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff3e6] shadow-[0_0_0_4px_rgba(255,122,26,0.25),0_0_24px_6px_rgba(255,122,26,0.7)]"
        />
      </div>

      <ol ref={ref} className="relative">
        {timeline.map((item, i) => (
          <TimelineItem key={item.title} item={item} index={i} last={i === timeline.length - 1} />
        ))}
      </ol>
    </div>
  );
}
export function HackathonPage({ onBackToHome, onNavigate }: HackathonPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = `${HACKATHON_DETAILS.name} Hackathon — JODC`;
    return () => {
      document.title = "JODC — JIIT-128 Open Source Development Club";
    };
  }, []);

  const goHome = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onBackToHome();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="relative min-h-screen w-full max-w-full overflow-x-clip pt-[68px] text-bone"
    >
      <main id="main">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="noise relative overflow-hidden px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-40 top-10 h-[36rem] w-[36rem] rounded-full bg-flame/[0.1] blur-[170px]"
          />

          <div className="relative mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center justify-between gap-4">
              <a
                href="/"
                onClick={goHome}
                className="group inline-flex min-h-11 items-center gap-2 font-mono text-xs text-ash transition-colors hover:text-bone"
              >
                <ArrowLeft size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1" />
                <span>JODC</span>
                <span aria-hidden="true" className="text-white/20">/</span>
                <span className="text-bone">Hackathon</span>
              </a>

              <span className="glass relative hidden items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-bone sm:inline-flex">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-flame" />
                {HACKATHON_DETAILS.name}
              </span>
            </nav>

            <div className="mt-12 grid items-center gap-14 lg:mt-16 lg:grid-cols-[1.25fr_0.75fr] lg:gap-10">
              <div>
                <Reveal>
                  <div className="flex items-baseline gap-4">
                    <span className="kicker text-flame">Flagship</span>
                    <span className="kicker">Hackathon · Open source</span>
                  </div>
                </Reveal>

                <h1 className="mt-6 overflow-hidden text-[clamp(3.6rem,12vw,9.5rem)] font-semibold leading-[0.86] tracking-[-0.055em] text-bone">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.1, ease }}
                  >
                    Hackathon<span className="text-flame">.</span>
                  </motion.span>
                </h1>

                <Reveal delay={0.15}>
                  <p className="mt-8 text-[clamp(1.6rem,3.6vw,2.6rem)] font-medium leading-tight tracking-tight text-bone">
                    Build. <span className="accent">Innovate.</span> Impact.
                  </p>
                </Reveal>

                <Reveal delay={0.2}>
                  <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-ash sm:text-lg">
                    36 hours of non-stop engineering where developers, designers, and innovators come together to transform ideas into impactful open-source technology solutions.
                  </p>
                </Reveal>

                <Reveal delay={0.25}>
                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <Button href={HACKATHON_DETAILS.registrationUrl} external>
                      Register Squad
                    </Button>
                    <Button href="#tracks-section" variant="ghost" icon={ArrowDown} travel="down">
                      Explore tracks
                    </Button>
                  </div>
                </Reveal>
              </div>

              <Reveal delay={0.1} className="hidden lg:block">
                <HoursDial />
              </Reveal>
            </div>

            {/* Fast specs: one ruled row, stacking on small screens. */}
            <Reveal delay={0.3}>
              <dl className="matrix mt-16 grid overflow-hidden rounded-2xl sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
                {specs.map(({ label, value, icon: Icon }) => (
                  <div
                    key={label}
                    className="group flex items-center gap-4 bg-ink px-5 py-5 transition-colors duration-300 hover:bg-ink-soft sm:px-6 sm:py-6"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] text-flame ring-1 ring-inset ring-white/10 transition-colors duration-300 group-hover:bg-flame/10 group-hover:ring-flame/40"
                    >
                      <Icon size={17} strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <dt className="kicker">{label}</dt>
                      <dd className="mt-1 text-[0.95rem] font-medium tracking-tight text-bone">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* ── Core philosophy ──────────────────────────────────────────── */}
        <section className="pane relative border-t border-white/5 px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span className="kicker text-flame">01</span>
                  <span className="kicker">Core philosophy</span>
                </div>
              </Reveal>

              <motion.h2
                initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 28 }}
                whileInView={{ clipPath: "inset(0% 0% -15% 0%)", y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease }}
                className="mt-7 text-[clamp(3rem,7vw,6rem)] leading-[0.9] tracking-[-0.05em]"
              >
                Think.
                <br />
                <span className="accent">Build.</span>
                <br />
                Innovate.
              </motion.h2>

              <Reveal delay={0.1}>
                <p className="mt-8 max-w-md text-pretty text-base leading-relaxed text-ash">
                  {HACKATHON_DETAILS.name} brings creators, developers, and problem-solvers together to turn ambitious ideas into open, scalable solutions for real-world challenges.
                </p>
              </Reveal>

              <Reveal delay={0.15}>
                <ul className="mt-8 flex flex-wrap gap-2 font-mono text-xs">
                  {["36h Non-stop Sprint", "Hybrid Access"].map((badge) => (
                    <li key={badge} className="rounded-full bg-white/[0.04] px-3 py-1.5 text-ash ring-1 ring-inset ring-white/10">
                      {badge}
                    </li>
                  ))}
                  <li className="rounded-full bg-flame/10 px-3 py-1.5 text-flame ring-1 ring-inset ring-flame/35">
                    100% Open Source
                  </li>
                </ul>
              </Reveal>
            </div>

            {/* Phases: a vertical stepper, the rail running through each node. */}
            <ol className="relative">
              <span
                aria-hidden="true"
                className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-gradient-to-b from-flame/60 via-white/10 to-white/0"
              />
              {phases.map(({ number, title, tag, icon: Icon, body }, i) => (
                <motion.li
                  key={number}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                  className="group relative flex gap-6 pb-12 last:pb-0"
                >
                  <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-xs text-flame ring-1 ring-inset ring-flame/40 transition-colors duration-300 group-hover:bg-flame group-hover:text-ink">
                    {number}
                  </span>
                  <div className="min-w-0 pt-1.5">
                    <p className="kicker flex items-center gap-2">
                      <Icon size={13} aria-hidden="true" className="text-flame" />
                      Phase {number} · {tag}
                    </p>
                    <h3 className="mt-3 text-[clamp(1.75rem,3vw,2.4rem)] font-medium tracking-tight text-bone transition-colors duration-300 group-hover:text-flame">
                      {title}
                    </h3>
                    <p className="mt-3 max-w-lg text-pretty text-[0.95rem] leading-relaxed text-ash">{body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Tracks ───────────────────────────────────────────────────── */}
        <section id="tracks-section" className="relative scroll-mt-24 border-t border-white/5 px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              index="02"
              eyebrow="Hackathon tracks"
              title={
                <>
                  Pick a problem <span className="accent">worth solving.</span>
                </>
              }
              lead="Six open domains. Choose the one that keeps you up at night and build the thing that fixes it."
            />

            <Status>Track details & problem statements will be released soon</Status>

            <div className="matrix mt-8 grid overflow-hidden rounded-2xl sm:grid-cols-2 lg:grid-cols-3">
              {tracks.map(({ number, title, body, icon: Icon, tags }, i) => (
                <motion.article
                  key={title}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="group relative flex flex-col bg-ink p-7 transition-colors duration-300 hover:bg-ink-soft sm:p-8"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-flame transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />

                  <header className="flex items-start justify-between gap-4">
                    <span className="font-mono text-xs text-ash">{number}</span>
                    <Icon
                      size={20}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="text-ash transition-colors duration-300 group-hover:text-flame"
                    />
                  </header>

                  <h3 className="mt-10 text-[1.4rem] font-medium leading-snug tracking-tight text-bone first-letter:uppercase">
                    {title}
                  </h3>
                  <p className="mt-3 text-pretty text-sm leading-relaxed text-ash">{body}</p>

                  <ul className="mt-6 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md bg-white/[0.04] px-2 py-1 font-mono text-[10px] text-ash transition-colors duration-300 group-hover:text-bone"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-8">
                    <footer className="flex items-center justify-between border-t border-white/[0.06] pt-5 font-mono text-[11px] text-ash">
                      <span>Problem statements</span>
                      <span className="flex items-center gap-1.5 text-flame">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-flame" />
                        TBA
                      </span>
                    </footer>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Timeline ─────────────────────────────────────────────────── */}
        <section id="timeline-section" className="pane relative scroll-mt-24 border-t border-white/5 px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              index="03"
              eyebrow="Event timeline"
              title={
                <>
                  From first idea to <span className="accent">grand finale.</span>
                </>
              }
              lead="Seven milestones, one sprint. Every date lands here the moment it is locked."
            />

            <Status>Exact schedule & session timings will be announced (TBA)</Status>

            <Timeline />
          </div>
        </section>

        {/* ── Prizes ───────────────────────────────────────────────────── */}
        <section id="prizes-section" className="relative scroll-mt-24 border-t border-white/5 px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              index="04"
              eyebrow="Prizes"
              title={
                <>
                  Make the <span className="accent">work count.</span>
                </>
              }
              lead="A podium for the best three, and something to take home for everyone who ships."
            />

            <Status>Prize pool amounts & sponsor bounties will be announced soon (TBA)</Status>

            {/* Results board: one ruled row per place, set like a race sheet. */}
            <ol className="mt-12 border-t border-white/15">
              {prizes.map(({ rank, place, tier, amount, perks }, i) => {
                const champion = rank === 1;
                const ordinal = place.split(" ")[0];
                return (
                  <motion.li
                    key={place}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease }}
                    className={`group relative grid gap-x-10 gap-y-5 border-b border-white/10 md:grid-cols-[minmax(9rem,0.7fr)_1.6fr_auto] md:items-center ${
                      champion ? "py-10 sm:py-12" : "py-8 sm:py-9"
                    }`}
                  >
                    {/* Hover tell: a flame hairline drawn along the row's top edge. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-flame transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                    />

                    <div className="flex items-center gap-4">
                      <span aria-hidden="true" className={`h-3 w-3 shrink-0 rounded-full ${MEDALS[i]}`} />
                      <span
                        className={`font-serif italic leading-none tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 ${
                          champion ? "text-[clamp(4rem,8vw,6.5rem)] text-flame" : "text-[clamp(3rem,6vw,4.75rem)] text-bone"
                        }`}
                      >
                        {ordinal}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className={`kicker ${champion ? "text-flame" : ""}`}>{tier}</p>
                      <p className={`mt-3 text-pretty leading-relaxed ${champion ? "text-lg text-bone" : "text-base text-bone/80"}`}>
                        {perks.split(" + ").map((perk, n, all) => (
                          <span key={perk}>
                            {perk}
                            {n < all.length - 1 && (
                              <span aria-hidden="true" className="mx-2 text-flame/70">
                                ·
                              </span>
                            )}
                          </span>
                        ))}
                      </p>
                      <p className="mt-3 font-mono text-[11px] text-ash">Recognition — JODC Hall of Fame</p>
                    </div>

                    <p className="flex items-baseline gap-2 md:flex-col md:items-end md:gap-1">
                      <span
                        className={`font-semibold tracking-[-0.03em] text-bone ${
                          champion ? "text-[2.75rem] sm:text-[3.25rem]" : "text-[2rem] sm:text-[2.4rem]"
                        }`}
                      >
                        {amount}
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ash">(TBA)</span>
                    </p>
                  </motion.li>
                );
              })}

              <motion.li
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: 0.24, ease }}
                className="grid gap-x-10 gap-y-3 py-7 md:grid-cols-[minmax(9rem,0.7fr)_1.6fr_auto] md:items-center"
              >
                  <span className="flex items-center gap-4">
                    <CheckCircle2 size={14} aria-hidden="true" className="shrink-0 text-flame" />
                    <span className="font-serif text-[2rem] italic leading-none text-ash">All</span>
                  </span>
                  <p className="text-pretty text-sm leading-relaxed text-ash">
                    <span className="text-bone">For All Qualified Participants:</span> Official Digital Badges + Cloud Credits + Exclusive JODC Builder Swag
                  </p>
                  <span className="kicker text-flame md:text-right">Guaranteed Swag</span>
              </motion.li>
            </ol>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section id="faq-section" className="pane relative scroll-mt-24 border-t border-white/5 px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Reveal>
                <div className="flex items-baseline gap-4">
                  <span className="kicker text-flame">05</span>
                  <span className="kicker">Questions & Answers</span>
                </div>
              </Reveal>
              <motion.h2
                initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 28 }}
                whileInView={{ clipPath: "inset(0% 0% -15% 0%)", y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease }}
                className="mt-7 text-balance text-[clamp(2.2rem,5vw,4rem)]"
              >
                Frequently asked <span className="accent">questions.</span>
              </motion.h2>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-sm text-pretty text-[0.95rem] leading-relaxed text-ash">
                  Still unsure about something? Ask us on Instagram and we'll add it here.
                </p>
              </Reveal>
            </div>

            <ul className="border-t border-white/10">
              {HACKATHON_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                const panelId = `faq-panel-${idx}`;
                return (
                  <li key={faq.question} className="border-b border-white/10">
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group flex w-full items-center gap-5 py-6 text-left"
                    >
                      <span className={`font-mono text-xs transition-colors ${isOpen ? "text-flame" : "text-ash"}`}>
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`flex-1 text-lg font-medium tracking-tight transition-colors sm:text-xl ${
                          isOpen ? "text-bone" : "text-bone/85 group-hover:text-bone"
                        }`}
                      >
                        {faq.question}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset transition-all duration-300 ${
                          isOpen
                            ? "rotate-45 bg-flame text-ink ring-flame"
                            : "text-ash ring-white/15 group-hover:text-bone group-hover:ring-white/30"
                        }`}
                      >
                        <Plus size={16} />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-2xl pb-7 pl-9 pr-14 text-pretty text-[0.95rem] leading-relaxed text-ash">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* ── Closing call to action ───────────────────────────────────── */}
        <section className="relative overflow-hidden border-t border-white/5 px-5 py-28 sm:px-8 sm:py-40">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-56 left-1/2 h-[460px] w-[min(1100px,130vw)] -translate-x-1/2 rounded-full bg-flame/[0.12] blur-[170px]"
          />

          <div className="relative mx-auto flex max-w-4xl flex-col items-center text-center">
            <Reveal>
              <span className="kicker text-flame">Ready to build?</span>
            </Reveal>
            <motion.h2
              initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 28 }}
              whileInView={{ clipPath: "inset(0% 0% -15% 0%)", y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease }}
              className="mt-7 text-balance text-[clamp(2.6rem,8vw,6rem)] leading-[0.95] tracking-[-0.045em]"
            >
              Assemble your <span className="accent">squad.</span>
            </motion.h2>
            <Reveal delay={0.1}>
              <p className="mt-7 max-w-lg text-pretty text-base leading-relaxed text-ash sm:text-lg">
                36 hours of relentless engineering at JIIT-128. Turn ambitious technical ideas into working software alongside the best builders on campus.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button href={HACKATHON_DETAILS.registrationUrl} external>
                  Submit Team Registration
                </Button>
                <Button href="/" onClick={goHome} variant="ghost" icon={ArrowLeft} travel="left">
                  Back to Club Home
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <RegisterModal />

      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
