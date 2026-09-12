import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { PROGRAMS } from "../data/site";
import { SectionHeading } from "./SectionHeading";

export function Programs() {
  return (
    <section
      id="programs"
      className="relative scroll-mt-24 border-t border-white/5 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          index="03"
          eyebrow="Programs"
          title={
            <>
              Selection happens in the{" "}
              <span className="accent">contribution period</span>
            </>
          }
          lead="Not in the application form. The people who get in have been active in the project for months. We start early, together."
        />

        <ul className="mt-2">
          {PROGRAMS.map((program, i) => (
            <motion.li
              key={program.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-white/10"
            >
              <a
                href={program.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group grid gap-3 py-9 md:grid-cols-[1.15fr_1.45fr] md:gap-12"
              >
                <div>
                  <h3 className="flex items-baseline gap-3 text-[1.6rem] font-medium tracking-tight text-bone transition-colors duration-300 group-hover:text-flame sm:text-[2rem]">
                    {program.name}
                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.5}
                      aria-hidden="true"
                      className="translate-y-[-2px] text-ash transition-all duration-300 group-hover:translate-x-1 group-hover:text-flame"
                    />
                  </h3>
                  <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash">
                    {program.org} · {program.window}
                  </p>
                </div>

                <p className="max-w-xl text-pretty text-[0.95rem] leading-relaxed text-ash">
                  {program.body}
                </p>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
