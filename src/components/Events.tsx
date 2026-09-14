import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, MapPin, Clock3 } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

type EventItem = {
  title: string;
  date: string;
  place: string;
  body: string;
  tone: string;
  mark: string;
  year?: string;
};

const UPCOMING_EVENTS: EventItem[] = [
  {
    title: "Orientation",
    date: "AUG 2026",
    place: "JIIT · Sector 128",
    body: "An introduction to JODC, open source, the community and your first contribution path.",
    tone: "from-orange-500/30 via-amber-300/10 to-transparent",
    mark: "01",
  },
  {
    title: "Roadmap",
    date: "SEP 2026",
    place: "Workshop Hall",
    body: "A practical session covering web development, DSA, GitHub workflows and internship-ready projects.",
    tone: "from-cyan-400/20 via-blue-400/10 to-transparent",
    mark: "02",
  },
  {
    title: "Git & GitHub",
    date: "OCT 2026",
    place: "JIIT · Open Lab",
    body: "Hands-on Git, pull requests, code review and a guided first contribution sprint.",
    tone: "from-violet-500/25 via-fuchsia-400/10 to-transparent",
    mark: "03",
  },
];

const PAST_EVENTS: EventItem[] = [
  {
    title: "Orientation",
    date: "2025–2026",
    place: "JIIT · Sector 128",
    body: "A first look at the club, our open-source community and the paths students can take with JODC.",
    tone: "from-orange-500/25 via-amber-300/10 to-transparent",
    mark: "01",
    year: "2025–2026",
  },
  {
    title: "Roadmap",
    date: "2024–2025",
    place: "JIIT · Workshop Hall",
    body: "A practical roadmap through development, competitive programming, DSA and internship preparation.",
    tone: "from-cyan-400/20 via-blue-400/10 to-transparent",
    mark: "02",
    year: "2024–2025",
  },
  {
    title: "Git & GitHub",
    date: "2023–2024",
    place: "JIIT · Open Lab",
    body: "A hands-on introduction to Git, GitHub workflows and the habits behind a good first contribution.",
    tone: "from-violet-500/25 via-fuchsia-400/10 to-transparent",
    mark: "03",
    year: "2023–2024",
  },
];

const PAST_YEARS = ["2025–2026", "2024–2025", "2023–2024"];

function EventCard({ event, index, past = false }: { event: EventItem; index: number; past?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.07 }}
      className="group overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.025] backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className={`relative aspect-[16/9] overflow-hidden bg-gradient-to-br ${event.tone}`}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[size:38px_38px]" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10 bg-black/10 blur-[1px] transition-transform duration-700 group-hover:scale-125" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-white/15 bg-black/20 backdrop-blur-md">
            <span className="font-mono text-2xl text-white/80">{event.mark}</span>
            <span className="absolute inset-2 rounded-full border border-flame/25 animate-pulse" />
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/75 backdrop-blur-md">
          {past ? "Past" : "Upcoming"}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-[1.45rem] font-semibold tracking-tight text-bone transition-colors group-hover:text-flame">
            {event.title}
          </h3>
          <ArrowUpRight size={18} className="shrink-0 text-ash transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-flame" />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ash">{event.body}</p>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.13em] text-ash">
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={12} /> {event.date}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin size={12} /> {event.place}</span>
        </div>
      </div>
    </motion.article>
  );
}

export function Events() {
  const [view, setView] = useState<"upcoming" | "past">("upcoming");
  const [pastYear, setPastYear] = useState(PAST_YEARS[0]);

  const visiblePast = PAST_EVENTS.filter((event) => event.year === pastYear);

  return (
    <section
      id="events"
      className="relative scroll-mt-24 overflow-hidden border-t border-white/5 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
        <div className="absolute left-[8%] top-1/4 h-72 w-72 rounded-full bg-flame/[0.06] blur-[120px]" />
        <div className="absolute right-[8%] bottom-1/4 h-72 w-72 rounded-full bg-orange-200/[0.035] blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          index="03"
          eyebrow="Events"
          title={<>Show up. <span className="accent">Build together.</span></>}
          lead="Sessions, workshops and community meetups designed around doing the work — not just talking about it."
        />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.025] p-1 backdrop-blur-xl" role="tablist" aria-label="Event timeline">
            {([
              ["upcoming", "Upcoming"],
              ["past", "Past"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={view === key}
                onClick={() => setView(key)}
                className={`relative rounded-full px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition-all duration-300 ${view === key ? "bg-flame text-ink shadow-[0_0_28px_rgba(255,122,26,.18)]" : "text-ash hover:text-bone"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {view === "past" && (
            <div className="flex items-center gap-2 text-xs text-ash">
              <Clock3 size={14} className="text-flame" />
              <span className="hidden sm:inline">Archive</span>
            </div>
          )}
        </div>

        {view === "past" && (
          <div className="mt-6 flex justify-center">
            <div className="inline-flex max-w-full overflow-x-auto rounded-full border border-white/10 bg-ink/55 p-1 backdrop-blur-xl no-scrollbar">
              {PAST_YEARS.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setPastYear(year)}
                  className={`whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 sm:px-6 ${pastYear === year ? "bg-white/[0.08] text-bone shadow-[inset_0_-2px_0_var(--color-flame)]" : "text-ash hover:text-bone"}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}

        <motion.div
          key={`${view}-${pastYear}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 grid gap-5 lg:grid-cols-3"
        >
          {(view === "upcoming" ? UPCOMING_EVENTS : visiblePast).map((event, i) => (
            <EventCard key={`${event.title}-${event.date}`} event={event} index={i} past={view === "past"} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
