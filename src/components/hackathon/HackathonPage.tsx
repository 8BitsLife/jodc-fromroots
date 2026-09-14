import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Trophy,
  Clock,
  HelpCircle,
  ChevronDown,
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
} from "lucide-react";
import { Reveal } from "../Reveal";
import { Footer } from "../Footer";
import { RegisterModal } from "./RegisterModal";
import { HACKATHON_DETAILS, HACKATHON_FAQS } from "../../data/hackathon";
import type { Route } from "../../hooks/useRoute";

interface HackathonPageProps {
  onBackToHome: () => void;
  onNavigate?: (route: Route, sectionId?: string) => void;
}

const tracks = [
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

const timeline = [
  {
    number: "01",
    phase: "Phase 01 // Registration Kickoff",
    title: "Registrations open",
    date: "TBA",
    icon: DoorOpen,
    body: "Team registrations officially commence on the developer portal. Claim your squad handle.",
  },
  {
    number: "02",
    phase: "Phase 02 // Roster Lock",
    title: "Registrations close",
    date: "TBA",
    icon: Lock,
    body: "Final deadline to lock in your squad roster, repository links, and initial project scope.",
  },
  {
    number: "03",
    phase: "Phase 03 // Screening",
    title: "Team shortlisting",
    date: "TBA",
    icon: CheckCircle2,
    body: "Technical evaluations complete. Shortlisted squads receive their developer check-in badges.",
  },
  {
    number: "04",
    phase: "Phase 04 // The Sprint",
    title: "Hackathon kickoff",
    date: "TBA",
    icon: Zap,
    body: "Opening ceremony, sponsor challenge briefs drop, and 36 hours of live building begins.",
  },
  {
    number: "05",
    phase: "Phase 05 // Pairing",
    title: "Mentoring & checkpoints",
    date: "TBA",
    icon: Compass,
    body: "1-on-1 architecture reviews, code debugging clinics, and pairing with seasoned industry mentors.",
  },
  {
    number: "06",
    phase: "Phase 06 // Code Freeze",
    title: "Final code freeze",
    date: "TBA",
    icon: GitPullRequest,
    body: "Pull requests locked, project repositories submitted, and deployment URLs audited.",
  },
  {
    number: "07",
    phase: "Phase 07 // Demo Day",
    title: "Grand finale & awards",
    date: "TBA",
    icon: Trophy,
    body: "Live mainstage demonstrations, jury interrogation, and winner announcements.",
  },
];

const prizes = [
  {
    place: "1st place",
    tier: "Gold Tier Champion",
    amount: "₹ TBA",
    perks: "Grand Cash Prize + Sponsor Bounties + Hardware Perks + Winner Trophy + Certificate",
    accent: "from-amber-400/20 to-flame/10 border-flame/50 shadow-[0_0_35px_rgba(255,122,26,0.22)]",
  },
  {
    place: "2nd place",
    tier: "Silver Tier Runner-Up",
    amount: "₹ TBA",
    perks: "Cash Prize + Sponsor Bounties + Exclusive Swag + Runner-up Trophy + Certificate",
    accent: "from-white/[0.08] to-white/[0.02] border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.06)]",
  },
  {
    place: "3rd place",
    tier: "Bronze Tier Finalist",
    amount: "₹ TBA",
    perks: "Cash Prize + Goodies + Certificate of Excellence + Mentorship Access",
    accent: "from-amber-700/15 to-transparent border-amber-600/30",
  },
];

const specs = [
  { label: "Date", value: "TBA • Date Coming Soon", icon: Calendar },
  { label: "Venue", value: "JIIT-128 Campus & Online", icon: MapPin },
  { label: "Team size", value: "2 – 4 Builders", icon: Users },
  { label: "Registration", value: "Opening Soon (TBA)", icon: Code2 },
];

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-8 max-w-3xl">
      <div className="flex items-center gap-2 text-flame mb-3">
        <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse" />
        <span className="kicker text-flame">{eyebrow}</span>
      </div>
      <h2 className="text-balance text-[clamp(2.2rem,5.5vw,4.5rem)] font-semibold leading-[0.96] text-bone tracking-tight">
        {title}
      </h2>
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="noise relative min-h-screen w-full max-w-full overflow-x-hidden bg-transparent text-bone pt-[68px]"
    >
      {/* Dynamic Background Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-14rem] top-16 h-[38rem] w-[38rem] rounded-full bg-flame/[0.12] blur-[170px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-12rem] top-[40%] h-[32rem] w-[32rem] rounded-full bg-flame/[0.06] blur-[160px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-8rem] bottom-[20%] h-[30rem] w-[30rem] rounded-full bg-flame/[0.05] blur-[150px]"
      />

      <main id="main" className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-16">
        {/* Navigation Bar Top */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBackToHome}
            className="group inline-flex min-h-[42px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 font-mono text-xs text-ash backdrop-blur-sm transition-all hover:border-flame/50 hover:text-bone cursor-pointer touch-manipulation"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Back to Home</span>
          </button>

          <a
            href={HACKATHON_DETAILS.registrationUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full border border-flame/40 bg-flame/10 px-4 py-2 font-mono text-xs font-semibold text-flame transition-all hover:bg-flame hover:text-ink cursor-pointer shadow-[0_0_15px_rgba(255,122,26,0.2)]"
          >
            <span>Register Squad</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Flagship Hackathon Header */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-flame/30 bg-flame/10 px-3.5 py-1 text-xs font-mono text-flame">
              <Code2 size={15} aria-hidden="true" />
              <span className="uppercase tracking-widest font-semibold">Flagship Hackathon</span>
            </div>

          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="mt-6 max-w-5xl text-balance text-[clamp(3.5rem,11vw,9rem)] font-bold leading-[0.84] text-bone tracking-tight">
            Hackathon<span className="text-flame">.</span>
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <p className="max-w-3xl text-pretty font-display text-3xl leading-tight text-bone sm:text-5xl">
              <span className="bg-gradient-to-r from-flame via-flame-hot to-amber-300 bg-clip-text text-transparent font-semibold">
                Build
              </span>{" "}
              Innovate{" "}
              <span className="bg-gradient-to-r from-flame via-flame-hot to-amber-300 bg-clip-text text-transparent font-semibold">
                Impact
              </span>
            </p>
            <p className="text-base leading-relaxed text-ash">
              36 hours of non-stop engineering where developers, designers, and innovators come together to transform ideas into impactful open-source technology solutions.
            </p>
          </div>
        </Reveal>

        {/* Fast Specs Matrix */}
        <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {specs.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="group relative overflow-hidden bg-ink p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-flame/[0.09] hover:shadow-[0_14px_34px_rgba(255,122,26,0.16)]"
            >
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-flame transition-transform duration-500 group-hover:scale-x-100" />
              <div className="flex items-center justify-between text-ash group-hover:text-flame transition-colors">
                <span className="kicker group-hover:text-flame-hot">{label}</span>
                <Icon size={16} />
              </div>
              <p className="mt-3 font-display text-lg font-semibold text-bone transition-transform duration-300 group-hover:translate-x-1">
                {value}
              </p>
              <span className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-flame/0 blur-2xl transition-all duration-500 group-hover:bg-flame/25" />
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------- */}
        {/* "About the hackathon" Box (Ultra Aesthetic Think. Build. Innovate.) */}
        {/* ------------------------------------------------------------- */}
        <div className="relative mt-24 sm:mt-32 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-ink to-white/[0.02] p-7 sm:p-12 lg:p-16 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
          {/* Ambient Glows */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-flame/20 bg-flame/[0.08] blur-xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-1/4 h-px w-2/3 bg-gradient-to-r from-transparent via-flame to-transparent"
          />

          <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <div className="flex items-center gap-2 text-flame mb-3">
                <span className="h-2 w-2 rounded-full bg-flame animate-ping" />
                <span className="kicker text-flame">Core philosophy</span>
              </div>

              <h2 className="mt-4 max-w-xl font-display text-[clamp(3.2rem,7.5vw,6.5rem)] font-bold leading-[0.88] text-bone tracking-tight">
                <span className="block hover:translate-x-1.5 transition-transform duration-300">
                  Think.
                </span>
                <span className="bg-gradient-to-r from-flame via-flame-hot to-amber-300 bg-clip-text text-transparent block hover:translate-x-1.5 transition-transform duration-300">
                  Build.
                </span>
                <span className="block hover:translate-x-1.5 transition-transform duration-300 italic font-serif text-white/95">
                  Innovate.
                </span>
              </h2>

              <p className="mt-8 max-w-md text-base leading-relaxed text-ash">
                {HACKATHON_DETAILS.name} brings creators, developers, and problem-solvers together to turn ambitious ideas into open, scalable solutions for real-world challenges.
              </p>

              {/* Tech Badges */}
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-ash hover:border-flame/40 transition-colors">
                  36h Non-stop Sprint
                </span>
                <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-ash hover:border-flame/40 transition-colors">
                  Hybrid Access
                </span>
                <span className="px-3 py-1 rounded-full border border-flame/30 bg-flame/10 text-xs font-mono text-flame font-medium">
                  100% Open Source
                </span>
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute bottom-8 -left-4 top-8 w-px bg-gradient-to-b from-flame/10 via-flame to-flame/10"
              />
              <div className="space-y-4">
                {[
                  {
                    number: "01",
                    title: "Imagine",
                    tag: "Phase 01 • Ideation",
                    icon: Lightbulb,
                    body: "Start with a problem worth solving. Brainstorm bold solutions, define system boundaries, and pitch novel approaches with zero gatekeeping.",
                  },
                  {
                    number: "02",
                    title: "Create",
                    tag: "Phase 02 • Build Sprint",
                    icon: Code2,
                    body: "Prototype, experiment, and collaborate. Write clean code, push upstream commits, and pair with experienced industry mentors in real-time.",
                  },
                  {
                    number: "03",
                    title: "Impact",
                    tag: "Phase 03 • Demo Day",
                    icon: Rocket,
                    body: "Showcase a solution built to matter. Deploy to live staging, demo to seasoned judges, and launch your project into the open source ecosystem.",
                  },
                ].map(({ number, title, tag, icon: Icon, body }) => (
                  <div
                    key={number}
                    className="group relative flex gap-5 rounded-2xl border border-white/10 bg-ink/80 p-5 sm:p-6 transition-all duration-300 hover:translate-x-2 hover:border-flame/60 hover:bg-flame/[0.07] hover:shadow-[0_10px_30px_rgba(255,122,26,0.12)]"
                  >
                    <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-flame/40 bg-ink font-mono text-xs font-bold text-flame transition-all duration-300 group-hover:bg-flame group-hover:text-ink group-hover:scale-105 shadow-sm">
                      {number}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-xl font-bold text-bone transition-colors group-hover:text-flame-hot flex items-center gap-2">
                          <span>{title}</span>
                          <Icon size={16} className="text-flame/70 group-hover:text-flame transition-colors" />
                        </h3>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-ash/70 group-hover:text-flame/90 transition-colors">
                          {tag}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-ash">{body}</p>
                    </div>

                    <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-flame transition-all duration-500 group-hover:w-full rounded-b-2xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* ------------------------------------------------------------- */}
        {/* Tracks Section ("will be released soon") */}
        {/* ------------------------------------------------------------- */}
        <div id="tracks-section" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionTitle
            eyebrow="Hackathon tracks"
            title="Pick a problem worth solving."
          />

          {/* Notice Pill: Will be released soon */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-flame/40 bg-flame/10 px-4 py-1.5 font-mono text-xs text-flame mb-8 shadow-[0_0_20px_rgba(255,122,26,0.15)]">
            <Clock size={14} className="animate-spin" style={{ animationDuration: "9s" }} />
            <span className="font-semibold uppercase tracking-wider">
              Track details & problem statements will be released soon
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map(({ number, title, body, icon: Icon, tags }) => (
              <div
                key={title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-ink-soft/90 to-white/[0.015] p-7 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-2 hover:border-flame/60 hover:bg-flame/[0.05] hover:shadow-[0_24px_50px_rgba(255,122,26,0.18)]"
              >
                {/* Background glow bloom on hover */}
                <div className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-flame/0 blur-2xl transition-all duration-500 group-hover:bg-flame/20" />

                {/* Top Row: Icon tile + Release Soon Badge */}
                <div>
                  <div className="flex items-center justify-between gap-3 mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-flame/30 bg-flame/10 text-flame shadow-[0_0_15px_rgba(255,122,26,0.15)] group-hover:scale-110 group-hover:bg-flame group-hover:text-ink transition-all duration-300">
                        <Icon size={20} />
                      </div>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-ash/60 font-medium">
                        Track // {number}
                      </span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full border border-flame/40 bg-flame/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-flame font-semibold shadow-sm">
                      <Clock size={11} className="animate-spin" style={{ animationDuration: "8s" }} />
                      <span>Releasing Soon</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-bold capitalize text-bone transition-colors group-hover:text-flame-hot tracking-tight">
                    {title}
                  </h3>

                  {/* Body */}
                  <p className="mt-3 text-sm leading-relaxed text-ash">{body}</p>

                  {/* Domain Tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 font-mono text-[10px] text-ash/80 group-hover:border-flame/30 group-hover:text-bone transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action / Status */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-ash/60 group-hover:text-flame transition-colors">
                  <span className="text-[11px]">Problem Statements</span>
                  <div className="flex items-center gap-1 font-semibold text-flame">
                    <span>TBA</span>
                    <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>

                {/* Top animated glowing hairline */}
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-flame to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Event Timeline Section ("TBA" with High-Tech Aesthetic Cards) */}
        {/* ------------------------------------------------------------- */}
        <div id="timeline-section" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionTitle
            eyebrow="Event timeline"
            title="From first idea to grand finale."
          />

          {/* Status Pill: Schedule TBA */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-flame/40 bg-flame/10 px-4 py-1.5 font-mono text-xs text-flame mb-8 shadow-[0_0_20px_rgba(255,122,26,0.15)]">
            <Clock size={14} className="text-flame" />
            <span className="font-semibold uppercase tracking-wider">
              Exact schedule & session timings will be announced (TBA)
            </span>
          </div>

          <div className="relative mt-8">
            {/* Center Timeline Spine */}
            <div
              aria-hidden="true"
              className="absolute bottom-6 left-[15px] top-6 w-px bg-gradient-to-b from-flame/10 via-flame to-flame/10 lg:left-1/2 lg:-translate-x-1/2"
            />

            <div className="space-y-8 lg:space-y-0">
              {timeline.map(({ number, phase, title, date, body, icon: Icon }, index) => {
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={title}
                    className={`relative pl-12 lg:flex lg:min-h-[160px] lg:pl-0 ${
                      isLeft ? "lg:justify-end" : "lg:justify-start"
                    }`}
                  >
                    {/* Glowing Node on Center Line */}
                    <div
                      aria-hidden="true"
                      className="absolute left-[7px] top-8 z-10 flex h-[17px] w-[17px] items-center justify-center rounded-full border border-flame bg-ink shadow-[0_0_0_6px_rgba(255,122,26,0.1),0_0_26px_rgba(255,122,26,0.65)] lg:left-1/2 lg:-translate-x-1/2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse" />
                    </div>

                    {/* Timeline Card */}
                    <div
                      className={`group relative w-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.05] via-ink-soft/90 to-white/[0.015] p-6 sm:p-7 backdrop-blur-2xl transition-all duration-300 hover:border-flame/60 hover:bg-flame/[0.06] hover:shadow-[0_20px_45px_rgba(255,122,26,0.18)] hover:-translate-y-1 lg:w-[calc(50%-3.5rem)] ${
                        index === timeline.length - 1
                          ? "border-flame/40 bg-flame/[0.08]"
                          : ""
                      }`}
                    >
                      {/* Ambient corner light bloom */}
                      <div className="pointer-events-none absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-flame/0 blur-2xl transition-all duration-500 group-hover:bg-flame/20" />

                      {/* Header row: Number badge + Icon + TBA Status Pill */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-flame/40 bg-flame/15 font-mono text-xs font-bold text-flame shadow-[0_0_12px_rgba(255,122,26,0.2)]">
                            {number}
                          </span>
                          <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-ash/80 group-hover:text-flame group-hover:border-flame/30 transition-colors">
                            <Icon size={15} />
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-full border border-flame/40 bg-flame/15 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-flame font-semibold shadow-sm">
                          <span className="h-1.5 w-1.5 rounded-full bg-flame animate-pulse" />
                          <span>DATE {date}</span>
                        </div>
                      </div>

                      {/* Phase sub-kicker */}
                      <span className="mt-4 block font-mono text-[10px] uppercase tracking-widest text-ash/60 group-hover:text-flame/80 transition-colors">
                        {phase}
                      </span>

                      {/* Title */}
                      <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold capitalize leading-snug text-bone transition-colors group-hover:text-flame-hot">
                        {title}
                      </h3>

                      {/* Description */}
                      <p className="mt-3 text-sm leading-relaxed text-ash">{body}</p>

                      {/* Bottom status bar */}
                      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-[11px] text-ash/60">
                        <span className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-flame" />
                          <span>Milestone {number} of 07</span>
                        </span>
                        <span className="text-bone/80 group-hover:text-flame transition-colors font-medium">
                          Scheduled • Open
                        </span>
                      </div>

                      {/* Bottom glowing line on hover */}
                      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-flame to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-3xl" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Prizes Section ("TBA" with Premium Aesthetic) */}
        {/* ------------------------------------------------------------- */}
        <div id="prizes-section" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionTitle eyebrow="Prizes" title="Make the work count." />

          {/* Status Pill: Prizes TBA */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-flame/40 bg-flame/10 px-4 py-1.5 font-mono text-xs text-flame mb-8 shadow-[0_0_20px_rgba(255,122,26,0.15)]">
            <Trophy size={14} className="text-flame" />
            <span className="font-semibold uppercase tracking-wider">
              Prize pool amounts & sponsor bounties will be announced soon (TBA)
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {prizes.map(({ place, tier, amount, perks, accent }) => (
              <div
                key={place}
                className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-b ${accent} p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(255,122,26,0.18)]`}
              >
                <div className="flex items-center justify-between">
                  <Trophy
                    size={26}
                    className="text-flame transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125"
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ash/80 rounded-full border border-white/10 px-2.5 py-0.5">
                    {tier}
                  </span>
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold capitalize text-bone transition-colors group-hover:text-flame-hot">
                  {place}
                </h3>

                <div className="mt-3 flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold text-flame transition-transform duration-300 group-hover:translate-x-1">
                    {amount}
                  </p>
                  <span className="font-mono text-xs text-ash/60">(TBA)</span>
                </div>

                <p className="mt-3 text-sm text-ash leading-relaxed">{perks}</p>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between font-mono text-xs text-ash/70">
                  <span>Recognition</span>
                  <span className="text-bone font-medium">JODC Hall of Fame</span>
                </div>

                <span className="absolute bottom-0 left-0 h-1 w-0 bg-flame transition-all duration-500 group-hover:w-full rounded-b-3xl" />
              </div>
            ))}
          </div>

          {/* All Participants Perk Bar */}
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-flame shrink-0" />
              <span className="text-sm text-bone font-medium">
                For All Qualified Participants: Official Digital Badges + Cloud Credits + Exclusive JODC Builder Swag
              </span>
            </div>
            <span className="shrink-0 font-mono text-xs text-flame font-semibold border border-flame/30 bg-flame/10 px-3 py-1 rounded-full">
              Guaranteed Swag
            </span>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* FAQ Section (Accordion with Rich Details) */}
        {/* ------------------------------------------------------------- */}
        <div id="faq-section" className="mt-24 sm:mt-32 scroll-mt-24">
          <SectionTitle
            eyebrow="Questions & Answers"
            title="Frequently asked questions."
          />

          <div className="space-y-3 max-w-4xl">
            {HACKATHON_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? "border-flame/40 bg-white/[0.035] shadow-[0_0_20px_rgba(255,122,26,0.08)]"
                      : "border-white/[0.08] bg-white/[0.015] hover:border-white/20"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-5 text-left cursor-pointer touch-manipulation gap-4"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-base sm:text-lg font-semibold text-bone flex items-center gap-3">
                      <HelpCircle
                        size={17}
                        className={isOpen ? "text-flame" : "text-ash/60"}
                      />
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={18}
                      className={`text-ash transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180 text-flame" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-6 pt-1 text-sm text-ash leading-relaxed border-t border-white/[0.04]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* Registration CTA Bottom Banner */}
        {/* ------------------------------------------------------------- */}
        <div className="relative mt-24 sm:mt-32 overflow-hidden rounded-3xl border border-flame/40 bg-gradient-to-br from-white/[0.05] via-flame/[0.05] to-ink p-8 sm:p-14 text-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 h-40 w-96 rounded-full bg-flame/20 blur-3xl"
          />
          <span className="kicker text-flame block mb-3">Ready to build?</span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-bone">
            Assemble Your Squad<span className="text-flame">.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-ash max-w-lg mx-auto leading-relaxed">
            36 hours of relentless engineering at JIIT-128. Turn ambitious technical ideas into working software alongside the best builders on campus.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href={HACKATHON_DETAILS.registrationUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-flame px-8 py-3 text-sm font-semibold text-ink shadow-[0_0_30px_rgba(255,122,26,0.35)] transition-all hover:bg-flame-hot hover:scale-[1.02] active:scale-95 cursor-pointer touch-manipulation"
            >
              <span>Submit Team Registration</span>
              <ArrowUpRight size={16} />
            </a>

            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-mono text-ash hover:border-flame/50 hover:text-bone transition-all cursor-pointer touch-manipulation"
            >
              <ArrowLeft size={14} />
              <span>Back to Club Home</span>
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Modal */}
      <RegisterModal />

      {/* Global Footer with Moving Sign */}
      <Footer onNavigate={onNavigate} />
    </motion.div>
  );
}
