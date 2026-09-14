import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { PAST_EVENTS, UPCOMING_EVENTS, type ClubEvent } from "../data/site";
import { SectionHeading } from "./SectionHeading";

type View = "upcoming" | "past";
type Status = "wrapped" | "now" | "next" | "later" | "archive";

const PAST_YEARS = Object.keys(PAST_EVENTS);
const ease = [0.16, 1, 0.3, 1] as const;

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** "Sep 2026" → a comparable month index; anything else (e.g. "2025–26") → null. */
function monthIndex(date: string): number | null {
  const m = date.trim().toLowerCase().match(/^([a-z]{3})[a-z]*\s+(\d{4})$/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[1]);
  return month < 0 ? null : Number(m[2]) * 12 + month;
}

/** Date block text: month over year when there is a month, otherwise the range as given. */
function dateParts(date: string): [string, string] {
  const m = date.trim().match(/^([A-Za-z]{3})[A-Za-z]*\s+(\d{4})$/);
  return m ? [m[1].toUpperCase(), m[2]] : [date, ""];
}

const STATUS_LABEL: Record<Status, string> = {
  wrapped: "Wrapped",
  now: "This month",
  next: "Next up",
  later: "Coming up",
  archive: "Archive",
};

/**
 * Status is worked out from today's date rather than written into the data,
 * so an "upcoming" event quietly becomes "Wrapped" once its month has passed.
 */
function useStatuses(events: ClubEvent[], view: View): Status[] {
  return useMemo(() => {
    if (view === "past") return events.map(() => "archive");
    const now = new Date();
    const today = now.getFullYear() * 12 + now.getMonth();
    let nextTaken = false;
    return events.map((event) => {
      const idx = monthIndex(event.date);
      if (idx === null) return "later";
      if (idx < today) return "wrapped";
      if (idx === today) {
        nextTaken = true;
        return "now";
      }
      if (!nextTaken) {
        nextTaken = true;
        return "next";
      }
      return "later";
    });
  }, [events, view]);
}

function EventRow({ event, index, status }: { event: ClubEvent; index: number; status: Status }) {
  const [month, year] = dateParts(event.date);
  const live = status === "now" || status === "next";
  const faded = status === "wrapped" || status === "archive";

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
      className="group relative grid grid-cols-[4.5rem_1fr] gap-x-5 border-b border-white/10 py-8 sm:grid-cols-[6.5rem_1fr] sm:gap-x-8 md:grid-cols-[7.5rem_minmax(0,1fr)_14rem] md:items-center md:py-10"
    >
      {/* Hover tell, same as the matrix cells elsewhere on the page. */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 -top-px h-px origin-left bg-flame transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          live ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        }`}
      />

      {/* Date block */}
      <div className={`leading-none ${faded ? "opacity-60" : ""}`}>
        <p
          className={`font-display font-semibold tracking-[-0.04em] ${
            year ? "text-[2.25rem] sm:text-[3rem]" : "text-xl sm:text-2xl"
          } ${live ? "text-flame" : "text-bone"}`}
        >
          {month}
        </p>
        {year && <p className="mt-1.5 font-mono text-xs tracking-[0.12em] text-ash">{year}</p>}
      </div>

      {/* What */}
      <div className="min-w-0">
        <h3
          className={`text-[1.6rem] font-medium leading-tight tracking-tight transition-colors duration-300 group-hover:text-flame sm:text-[2rem] ${
            faded ? "text-bone/70" : "text-bone"
          }`}
        >
          {event.title}
        </h3>
        <p className="mt-2.5 max-w-xl text-pretty text-[0.95rem] leading-relaxed text-ash">{event.body}</p>
      </div>

      {/* Where + status */}
      <div className="col-start-2 mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 md:col-start-auto md:mt-0 md:flex-col md:items-end md:gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] ring-1 ring-inset ${
            live ? "bg-flame/10 text-flame ring-flame/40" : "text-ash ring-white/10"
          }`}
        >
          {live && (
            <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
              <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-flame" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-flame" />
            </span>
          )}
          {STATUS_LABEL[status]}
        </span>
        <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-ash">
          <MapPin size={12} aria-hidden="true" className="text-flame/80" />
          {event.place}
        </span>
      </div>
    </motion.li>
  );
}

/** Segmented control: a sliding pill under the selected option. */
function Segmented<T extends string>({
  id,
  label,
  options,
  value,
  onChange,
}: {
  id: string;
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex max-w-full overflow-x-auto rounded-full bg-white/[0.02] p-1 ring-1 ring-inset ring-white/10 no-scrollbar"
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={`relative min-h-10 whitespace-nowrap rounded-full px-5 font-mono text-[0.7rem] uppercase tracking-[0.18em] transition-colors duration-300 ${
              selected ? "text-ink" : "text-ash hover:text-bone"
            }`}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-pill`}
                className="absolute inset-0 rounded-full bg-flame"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function Events() {
  const [view, setView] = useState<View>("upcoming");
  const [year, setYear] = useState(PAST_YEARS[0]);

  const events = view === "upcoming" ? UPCOMING_EVENTS : (PAST_EVENTS[year] ?? []);
  const statuses = useStatuses(events, view);

  return (
    <section id="events" className="relative scroll-mt-24 pane px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="03"
          eyebrow="Events"
          title={
            <>
              Show up. <span className="accent">Build together.</span>
            </>
          }
          lead="Sessions, workshops and community meetups designed around doing the work — not just talking about it."
        />

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              id="events-view"
              label="Event timeline"
              value={view}
              onChange={setView}
              options={[
                { value: "upcoming", label: "Upcoming" },
                { value: "past", label: "Past" },
              ]}
            />

            <AnimatePresence initial={false}>
              {view === "past" && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25, ease }}
                >
                  <Segmented
                    id="events-year"
                    label="Academic year"
                    value={year}
                    onChange={setYear}
                    options={PAST_YEARS.map((y) => ({ value: y, label: y }))}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="font-mono text-[11px] text-ash">
            {events.length} {events.length === 1 ? "event" : "events"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.ol
            key={`${view}-${year}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-8 border-t border-white/10"
          >
            {events.map((event, i) => (
              <EventRow key={`${event.title}-${event.date}`} event={event} index={i} status={statuses[i]} />
            ))}
          </motion.ol>
        </AnimatePresence>
      </div>
    </section>
  );
}
