import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

type Props = {
  /** Two-digit section number, printed in the margin. */
  index: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
};

/**
 * Editorial section head: number and heading on the left, standfirst pulled to
 * the right and set on the same baseline, closed by a hairline.
 */
export function SectionHeading({ index, eyebrow, title, lead }: Props) {
  return (
    <div className="border-b border-white/10 pb-6">
      <Reveal>
        <div className="flex items-baseline gap-4">
          <span className="kicker text-flame">{index}</span>
          <span className="kicker">{eyebrow}</span>
        </div>
      </Reveal>

      <div className="mt-4 grid gap-x-12 gap-y-4 md:grid-cols-[1.35fr_1fr] md:items-end">
        {/* Mask wipe: the title rises out from behind its own baseline. */}
        <motion.h2
          initial={{ clipPath: "inset(0% 0% 100% 0%)", y: 28 }}
          whileInView={{ clipPath: "inset(0% 0% -15% 0%)", y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-none md:max-w-[18ch] text-balance text-[clamp(1.95rem,5.2vw,4.1rem)]"
        >
          {title}
        </motion.h2>

        {lead && (
          <Reveal delay={0.1}>
            <p className="max-w-md text-pretty text-[0.95rem] leading-relaxed text-ash md:pb-2">
              {lead}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
