import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Line = { kind: "cmd" | "out" | "ok"; text: string };

const SCRIPT: Line[] = [
  { kind: "cmd", text: "git clone git@github.com:some-org/real-project.git" },
  { kind: "out", text: "Cloning into 'real-project'... done." },
  { kind: "cmd", text: "git switch -c fix/off-by-one" },
  { kind: "cmd", text: "git commit -m \"fix: stop dropping the last row\"" },
  { kind: "cmd", text: "gh pr create --fill" },
  { kind: "out", text: "https://github.com/some-org/real-project/pull/412" },
  { kind: "ok", text: "Merged. You are now an open source contributor." },
];

const TYPE_MS = 26;
const LINE_PAUSE = 340;

const TONE: Record<Line["kind"], string> = {
  cmd: "text-bone",
  out: "text-ash",
  ok: "text-flame",
};

/** Fake terminal that types the contribution loop, once, when scrolled into view. */
export function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const reduced = usePrefersReducedMotion();

  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (!inView) return;

    if (reduced) {
      setLineIdx(SCRIPT.length);
      setCharIdx(0);
      return;
    }

    if (lineIdx >= SCRIPT.length) return;

    const line = SCRIPT[lineIdx];
    if (charIdx < line.text.length) {
      const t = setTimeout(
        () => setCharIdx((c) => c + 1),
        line.kind === "cmd" ? TYPE_MS : 6,
      );
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setLineIdx((l) => l + 1);
      setCharIdx(0);
    }, LINE_PAUSE);
    return () => clearTimeout(t);
  }, [inView, reduced, lineIdx, charIdx]);

  const done = lineIdx >= SCRIPT.length;
  const visible = SCRIPT.slice(0, lineIdx);
  const typing = done ? null : SCRIPT[lineIdx];

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0e]"
    >
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <span className="font-mono text-[0.7rem] tracking-wide text-ash">
          ~/jodc/first-contribution
        </span>
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-flame/80"
        />
      </div>

      <div
        className="min-h-[260px] space-y-1.5 p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto break-all sm:break-normal"
        aria-label="Example contribution workflow in a terminal"
      >
        {visible.map((line, i) => (
          <p key={i} className={TONE[line.kind]}>
            {line.kind === "cmd" && <span className="mr-2 text-flame">$</span>}
            {line.text}
          </p>
        ))}

        {typing && (
          <p className={TONE[typing.kind]}>
            {typing.kind === "cmd" && <span className="mr-2 text-flame">$</span>}
            {typing.text.slice(0, charIdx)}
            <span className="animate-blink ml-0.5 inline-block h-4 w-[7px] translate-y-[2px] bg-flame" />
          </p>
        )}

        {done && (
          <p className="pt-2 text-ash">
            <span className="mr-2 text-flame">$</span>
            <span className="animate-blink inline-block h-4 w-[7px] translate-y-[2px] bg-flame" />
          </p>
        )}
      </div>
    </div>
  );
}
