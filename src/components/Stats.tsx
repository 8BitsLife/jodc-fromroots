import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { STATS } from "../data/site";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

const DURATION = 1400;

function Counter({ to, suffix }: { to: number; suffix: string }) {
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
  }, [inView, reduced, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section
      aria-label="The club in numbers"
      className="border-t border-white/5 px-5 py-16 sm:px-8"
    >
      <dl className="matrix mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <div key={stat.label} className="bg-ink px-6 py-10 sm:px-8">
            <dt className="kicker">{String(i + 1).padStart(2, "0")}</dt>
            <dd className="mt-6">
              <span className="block text-[clamp(2.6rem,6vw,4.2rem)] font-semibold leading-none tracking-[-0.05em] text-bone">
                <Counter to={stat.value} suffix={stat.suffix} />
              </span>
              <span className="mt-4 block max-w-[15rem] text-sm leading-relaxed text-ash">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
