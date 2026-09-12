import type { ReactNode } from "react";
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
    <div className="border-b border-white/10 pb-10">
      <Reveal>
        <div className="flex items-baseline gap-4">
          <span className="kicker text-flame">{index}</span>
          <span className="kicker">{eyebrow}</span>
        </div>
      </Reveal>

      <div className="mt-7 grid gap-x-12 gap-y-6 md:grid-cols-[1.35fr_1fr] md:items-end">
        <Reveal delay={0.05}>
          <h2 className="max-w-[16ch] text-balance text-[clamp(2.1rem,5.4vw,4.1rem)]">
            {title}
          </h2>
        </Reveal>

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
