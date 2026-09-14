import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { PAST_EVENTS, UPCOMING_EVENTS, type ClubEvent } from "../data/site";
import { SectionHeading } from "./SectionHeading";

type View = "upcoming" | "past";

const PAST_YEARS = Object.keys(PAST_EVENTS);
const ease = [0.16, 1, 0.3, 1] as const;

function EventCell({ event, index, past }: { event: ClubEvent; index: number; past: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease }}
      className="group relative flex min-h-[18rem] flex-col bg-ink p-6 transition-colors duration-300 hover:bg-ink-soft sm:p-8"
    >
      {/* Fills left-to-right on hover, the same tell the What we do cells use. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-flame transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
      />

      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-ash">{String(index + 1).padStart(2, "0")}</span>
        <span
          className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${
            past ? "border-white/10 text-ash" : "border-flame/40 text-flame"
          }`}
        >
          {past ? "Past" : "Upcoming"}
        </span>
      </div>

      <h3 className="mt-10 text-[1.6rem] font-medium tracking-tight text-bone transition-colors duration-300 group-hover:text-flame sm:text-[1.85rem]">
        {event.title}
      </h3>
      <p className="mt-3 max-w-sm text-pretty text-[0.95rem] leading-relaxed text-ash">
        {event.body}
      </p>

      <dl className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-8 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ash">
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Date</dt>
          <CalendarDays size={13} aria-hidden="true" className="text-flame" />
          <dd>{event.date}</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <dt className="sr-only">Place</dt>
          <MapPin size={13} aria-hidden="true" className="text-flame" />
          <dd>{event.place}</dd>
        </div>
      </dl>
    </motion.article>
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
      className="inline-flex max-w-full overflow-x-auto rounded-full border border-white/10 bg-white/[0.02] p-1 no-scrollbar"
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
                className="absolute inset-0 -z-0 rounded-full bg-flame"
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

  return (
    <section
      id="events"
      className="relative scroll-mt-24 border-t border-white/5 pane px-5 py-24 sm:px-8 sm:py-32"
    >
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

        <div className="mt-10 flex flex-wrap items-center gap-3">
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

          {view === "past" && (
            <Segmented
              id="events-year"
              label="Academic year"
              value={year}
              onChange={setYear}
              options={PAST_YEARS.map((y) => ({ value: y, label: y }))}
            />
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`${view}-${year}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            // Columns follow the count so a short year never leaves empty hairline cells.
            className={`matrix mt-8 grid overflow-hidden rounded-2xl ${
              events.length >= 3 ? "lg:grid-cols-3" : events.length === 2 ? "md:grid-cols-2" : ""
            }`}
          >
            {events.map((event, i) => (
              <EventCell
                key={`${event.title}-${event.date}`}
                event={event}
                index={i}
                past={view === "past"}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
