import { Instagram } from "lucide-react";
import { LINKS } from "../data/site";
import { Button } from "./Button";
import { Reveal } from "./Reveal";

/**
 * Closing statement. One message, one action — every channel is already
 * listed in the footer directly underneath, so this doesn't repeat them.
 */
export function Join() {
  return (
    <section
      id="join"
      className="relative scroll-mt-24 overflow-hidden px-5 py-10 sm:px-8 sm:py-14"
    >
      {/* Hairline seam with the section above, fading out at both ends. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.09] to-transparent"
      />

      {/* Warmth rising from the bottom edge into the footer. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 left-1/2 h-[460px] w-[min(1100px,130vw)] -translate-x-1/2 rounded-full bg-flame/[0.12] blur-[170px]"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
        <Reveal>
          <div className="flex items-baseline gap-4">
            <span className="kicker text-flame">05</span>
            <span className="kicker">Open invitation</span>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-8 text-balance text-[clamp(2.6rem,8vw,6.75rem)] leading-[0.95] tracking-[-0.045em]">
            Your first commit is{" "}
            <span className="accent">one conversation</span> away.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-ash sm:text-lg">
            Message us, come to the next session, or just turn up with a
            repository you already broke.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-col items-center gap-6">
            <Button href={LINKS.instagram} icon={Instagram} external>
              Say hi on Instagram
            </Button>

            <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ash">
              <span>No application form</span>
              <span aria-hidden="true" className="text-flame">·</span>
              <span>No screening round</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
