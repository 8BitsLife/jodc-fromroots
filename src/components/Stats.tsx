import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { STATS } from "../data/site";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const DURATION = 1400;

function Counter({ to, suffix, trigger }: { to: number; suffix: string; trigger?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setValue(to);
      return;
    }

    setValue(0);
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setValue(Math.round(to * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, to, trigger]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export function Stats() {
  const [triggers, setTriggers] = useState<Record<number, number>>({});

  const handleCardClick = (idx: number) => {
    setTriggers((prev) => ({ ...prev, [idx]: (prev[idx] || 0) + 1 }));
  };

  return (
    <section
      aria-label="The club in numbers"
      className="border-t border-white/5 px-4 py-14 sm:px-8 sm:py-16"
    >
      <dl className="matrix mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            onClick={() => handleCardClick(i)}
            title="Click to re-count"
            className="group/stat relative bg-ink px-4 py-8 sm:px-8 sm:py-10 transition-colors duration-300 hover:bg-ink-soft cursor-pointer touch-manipulation select-none"
          >
            {/* Top Hairline accent on hover */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-flame transition-transform duration-300 group-hover/stat:scale-x-100"
            />

            <div className="flex items-center justify-between">
              <dt className="kicker group-hover/stat:text-flame transition-colors">
                {String(i + 1).padStart(2, "0")}
              </dt>
              <span className="h-1.5 w-1.5 rounded-full bg-white/10 group-hover/stat:bg-flame transition-colors" />
            </div>

            <dd className="mt-5 sm:mt-6">
              <span className="block text-[clamp(2.35rem,5.8vw,4.2rem)] font-semibold leading-none tracking-[-0.05em] text-bone group-hover/stat:text-white transition-colors">
                <Counter to={stat.value} suffix={stat.suffix} trigger={triggers[i]} />
              </span>
              <span className="mt-3 sm:mt-4 block max-w-[15rem] text-xs sm:text-sm leading-relaxed text-ash group-hover/stat:text-bone/85 transition-colors">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
