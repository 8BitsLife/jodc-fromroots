import { ArrowUpRight, Code2, Trophy } from "lucide-react";
import { Reveal } from "./Reveal";

const tracks = [
  ["Artificial intelligence & machine learning", "Build intelligent solutions using AI and machine learning."],
  ["Web & app development", "Create innovative and scalable digital experiences."],
  ["Fintech", "Build solutions that redefine financial technology."],
  ["Healthcare", "Use technology to solve meaningful healthcare challenges."],
  ["Sustainability", "Create solutions for a smarter and greener future."],
  ["Open innovation", "Have an idea outside these domains? Build it anyway."],
];

const timeline = [
  ["Registrations open", "[DATE]", "Registrations officially begin."],
  ["Registrations close", "[DATE]", "Last opportunity to register your team."],
  ["Shortlisting", "[DATE]", "Teams and ideas are evaluated."],
  ["Hackathon begins", "[DATE & TIME]", "The building begins."],
  ["Mentoring & workshops", "[DATE & TIME]", "Learn, build, and get guidance from experts."],
  ["Final submission", "[DATE & TIME]", "Submit your completed project."],
  ["Grand finale", "[DATE & TIME]", "Final presentations, judging, and winner announcement."],
];

function DetailGrid({ items }: { items: string[][] }) {
  return (
    <div className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([title, body]) => (
        <div
          key={title}
          className="group relative overflow-hidden bg-ink p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-flame/[0.08] hover:shadow-[0_16px_40px_rgba(255,122,26,0.12)] sm:p-7"
        >
          <span className="absolute left-0 top-0 h-1 w-0 bg-flame transition-all duration-500 group-hover:w-full" />
          <h3 className="font-display text-xl font-semibold capitalize text-bone transition-colors group-hover:text-flame-hot">{title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ash">{body}</p>
          <span className="absolute -bottom-8 -right-8 h-20 w-20 rounded-full bg-flame/0 blur-2xl transition-all duration-500 group-hover:bg-flame/20" />
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <span className="kicker text-flame">{eyebrow}</span>
      <h2 className="mt-4 text-balance text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[0.96] text-bone">
        {title}
      </h2>
    </div>
  );
}

interface HackathonProps {
  onExploreFullPage?: () => void;
}

export function Hackathon({ onExploreFullPage }: HackathonProps) {
  return (
    <section id="hackathon" className="noise relative scroll-mt-24 overflow-hidden border-t border-white/5">
      <div aria-hidden="true" className="pointer-events-none absolute right-[-12rem] top-20 h-[32rem] w-[32rem] rounded-full bg-flame/10 blur-[150px]" />
      <div className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <Reveal>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-flame">
              <Code2 size={18} aria-hidden="true" />
              <span className="kicker text-flame">Flagship hackathon</span>
            </div>

            {onExploreFullPage && (
              <button
                type="button"
                onClick={onExploreFullPage}
                className="inline-flex items-center gap-1.5 rounded-full border border-flame/40 bg-flame/10 px-3.5 py-1.5 font-mono text-xs font-semibold text-flame hover:bg-flame hover:text-ink transition-all cursor-pointer"
              >
                <span>Full Hackathon Portal</span>
                <ArrowUpRight size={13} />
              </button>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-5xl text-balance text-[clamp(3.5rem,11vw,9rem)] font-semibold leading-[0.84] text-bone">
            Hackathon
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <p className="max-w-3xl text-pretty font-display text-3xl leading-tight text-bone sm:text-5xl">
              <span className="accent">Build</span> Innovate <span className="accent">Impact</span>
            </p>
            <p className="text-base leading-relaxed text-ash">
              A 24 hour hackathon where developers, designers, and innovators come together to transform ideas into impactful technology solutions.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {[['Date', '[DATE]'], ['Venue', '[VENUE]'], ['Team size', '[TEAM SIZE]'], ['Registration', '[OPEN / COMING SOON]']].map(([label, value]) => (
            <div
              key={label}
              className="group relative overflow-hidden bg-ink p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-flame/[0.1] hover:shadow-[0_14px_34px_rgba(255,122,26,0.16)]"
            >
              <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-flame transition-transform duration-500 group-hover:scale-x-100" />
              <span className="kicker transition-colors group-hover:text-flame-hot">{label}</span>
              <p className="mt-3 text-bone transition-transform duration-300 group-hover:translate-x-1">{value}</p>
              <span className="absolute -bottom-10 -right-10 h-24 w-24 rounded-full bg-flame/0 blur-2xl transition-all duration-500 group-hover:bg-flame/25" />
            </div>
          ))}
        </div>

        <div className="relative mt-32 overflow-hidden border border-white/10 bg-white/[0.025] p-6 sm:p-10 lg:p-14">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-flame/20 bg-flame/[0.05] blur-sm" />
          <div aria-hidden="true" className="absolute bottom-0 left-1/3 h-px w-1/2 bg-gradient-to-r from-transparent via-flame/50 to-transparent" />

          <div className="relative grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <span className="kicker text-flame">About the hackathon</span>
              <h2 className="mt-5 max-w-xl font-display text-[clamp(2.8rem,6vw,6rem)] font-semibold leading-[0.88] text-bone">
                Think.<br />
                <span className="accent">Build.</span><br />
                Innovate.
              </h2>
              <p className="mt-8 max-w-md text-base leading-relaxed text-ash">
                [HACKATHON NAME] brings creators, developers, and problem-solvers together to turn ambitious ideas into solutions for real-world challenges.
              </p>
            </div>

            <div className="relative">
              <div aria-hidden="true" className="absolute bottom-8 left-5 top-8 w-px bg-gradient-to-b from-flame/10 via-flame to-flame/10" />
              <div className="space-y-3">
                {[
                  ["01", "Imagine", "Start with a problem worth solving."],
                  ["02", "Create", "Prototype, experiment, and learn together."],
                  ["03", "Impact", "Showcase a solution built to matter."],
                ].map(([number, title, body]) => (
                  <div key={number} className="group relative flex gap-5 border border-white/10 bg-ink/80 p-5 transition-all duration-300 hover:translate-x-2 hover:border-flame/50 hover:bg-flame/[0.08] sm:p-6">
                    <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-flame/50 bg-ink font-mono text-xs text-flame transition-all duration-300 group-hover:bg-flame group-hover:text-ink">
                      {number}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold text-bone transition-colors group-hover:text-flame-hot">{title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ash">{body}</p>
                    </div>
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-flame transition-all duration-500 group-hover:w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <SectionTitle eyebrow="Hackathon tracks" title="Pick a problem worth solving." />
          <DetailGrid items={tracks} />
        </div>

        <div className="mt-32">
          <SectionTitle eyebrow="Event timeline" title="From first idea to grand finale." />
          <div className="relative mt-8">
            <div
              aria-hidden="true"
              className="absolute bottom-6 left-[15px] top-6 w-px bg-gradient-to-b from-flame/10 via-flame to-flame/10 lg:left-1/2 lg:-translate-x-1/2"
            />
            <div className="space-y-7 lg:space-y-0">
              {timeline.map(([title, date, body], index) => {
                const isLeft = index % 2 === 0;
                const number = String(index + 1).padStart(2, "0");

                return (
                  <div
                    key={title}
                    className={`relative pl-12 lg:flex lg:min-h-[145px] lg:pl-0 ${
                      isLeft ? "lg:justify-end" : "lg:justify-start"
                    }`}
                  >
                    <div
                      aria-hidden="true"
                      className="absolute left-[7px] top-8 z-10 flex h-[17px] w-[17px] items-center justify-center rounded-full border border-flame bg-ink shadow-[0_0_0_6px_rgba(255,122,26,0.08),0_0_24px_rgba(255,122,26,0.55)] lg:left-1/2 lg:-translate-x-1/2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-flame" />
                    </div>
                    <div
                      className={`group relative w-full overflow-hidden border border-white/10 bg-white/[0.035] p-5 transition-colors duration-300 hover:border-flame/50 hover:bg-flame/[0.06] sm:p-6 lg:w-[calc(50%-3.5rem)] ${
                        index === timeline.length - 1 ? "border-flame/40 bg-flame/[0.08]" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-5">
                        <span className="font-mono text-sm text-flame">{number}</span>
                        <span className="border border-flame/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-flame">
                          {date}
                        </span>
                      </div>
                      <h3 className="mt-5 max-w-xs font-display text-2xl font-semibold capitalize leading-none text-bone sm:text-3xl">
                        {title}
                      </h3>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-ash">{body}</p>
                      <div className="absolute bottom-0 left-0 h-px w-0 bg-flame transition-all duration-500 group-hover:w-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-32 grid gap-12 lg:grid-cols-[0.65fr_1.35fr]">
          <SectionTitle eyebrow="Prizes" title="Make the work count." />
          <div className="grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
            {[['1st place', '₹[AMOUNT]'], ['2nd place', '₹[AMOUNT]'], ['3rd place', '₹[AMOUNT]']].map(([place, amount]) => (
              <div key={place} className="group relative overflow-hidden bg-ink p-6 transition-all duration-300 hover:-translate-y-1 hover:bg-flame/[0.08] hover:shadow-[0_18px_45px_rgba(255,122,26,0.16)] sm:p-7">
                <Trophy size={20} className="text-flame transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125" aria-hidden="true" />
                <h3 className="mt-6 font-display text-xl font-semibold capitalize text-bone transition-colors group-hover:text-flame-hot">{place}</h3>
                <p className="mt-3 text-2xl font-semibold text-flame transition-transform duration-300 group-hover:translate-x-1">{amount}</p>
                <p className="mt-2 text-sm text-ash">Cash Prize + Goodies + Certificate</p>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-flame transition-all duration-500 group-hover:w-full" />
              </div>
            ))}
          </div>
        </div>

       

        <a href="#join" className="mt-20 inline-flex min-h-[44px] items-center gap-2 font-mono text-sm text-ash underline-offset-4 transition-colors hover:text-flame hover:underline">
          Register your team <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}