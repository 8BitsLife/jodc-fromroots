import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { RotateCw, Copy, Check, Terminal as TerminalIcon } from "lucide-react";
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

const TYPE_MS = 24;
const LINE_PAUSE = 300;

const TONE: Record<Line["kind"], string> = {
  cmd: "text-bone",
  out: "text-ash/90",
  ok: "text-flame font-medium",
};

/** Interactive simulated terminal that types the contribution loop and allows copying & replaying */
export function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = usePrefersReducedMotion();

  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Typing engine
  useEffect(() => {
    if (!inView || !isRunning) return;

    if (reduced) {
      setLineIdx(SCRIPT.length);
      setCharIdx(0);
      return;
    }

    if (lineIdx >= SCRIPT.length) {
      setIsRunning(false);
      return;
    }

    const line = SCRIPT[lineIdx];
    if (charIdx < line.text.length) {
      const t = setTimeout(
        () => setCharIdx((c) => c + 1),
        line.kind === "cmd" ? TYPE_MS : 8,
      );
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      setLineIdx((l) => l + 1);
      setCharIdx(0);
    }, LINE_PAUSE);
    return () => clearTimeout(t);
  }, [inView, isRunning, reduced, lineIdx, charIdx]);

  const handleReplay = () => {
    setLineIdx(0);
    setCharIdx(0);
    setIsRunning(true);
  };

  const handleCopyLine = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const handleCopyAll = () => {
    const commandsOnly = SCRIPT.filter((l) => l.kind === "cmd")
      .map((l) => l.text)
      .join("\n");
    navigator.clipboard.writeText(commandsOnly);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const done = lineIdx >= SCRIPT.length;
  const visible = SCRIPT.slice(0, lineIdx);
  const typing = done ? null : SCRIPT[lineIdx];

  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090d] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(255,122,26,0.06)]"
    >
      {/* Top Hairline Ambient Gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame/50 to-transparent" />

      {/* Terminal Titlebar with Interactive Controls */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 sm:px-4 sm:py-3">
        <div className="flex items-center gap-2">
          {/* Mac-style Window Action Buttons */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-white/10">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/80 hover:bg-[#ff5f56] transition-colors cursor-pointer" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/80 hover:bg-[#ffbd2e] transition-colors cursor-pointer" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/80 hover:bg-[#27c93f] transition-colors cursor-pointer" />
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] sm:text-xs text-ash/80">
            <TerminalIcon size={12} className="text-flame" />
            <span className="truncate max-w-[140px] xs:max-w-[190px] sm:max-w-none">~/jodc/first-contribution</span>
          </div>
        </div>

        {/* Interactive Action Controls: Replay and Copy */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleReplay}
            title="Replay terminal animation"
            className="flex h-7 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-[10px] sm:text-[11px] font-mono text-ash hover:border-flame/40 hover:bg-flame/10 hover:text-bone transition-all cursor-pointer active:scale-95 touch-manipulation"
          >
            <RotateCw size={11} className={isRunning ? "animate-spin text-flame" : ""} />
            <span className="hidden xs:inline">{isRunning ? "Running" : "Replay"}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyAll}
            title="Copy all commands"
            className="flex h-7 items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 text-[10px] sm:text-[11px] font-mono text-ash hover:border-flame/40 hover:bg-flame/10 hover:text-bone transition-all cursor-pointer active:scale-95 touch-manipulation"
          >
            {copiedAll ? (
              <>
                <Check size={11} className="text-flame font-bold" />
                <span className="text-flame font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span className="hidden xs:inline">Copy PR commands</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div
        className="min-h-[250px] sm:min-h-[270px] space-y-2 p-4 sm:p-5 font-mono text-[11px] xs:text-xs sm:text-sm leading-relaxed overflow-x-auto break-all xs:break-normal select-text touch-pan-y"
        aria-label="Interactive contribution workflow terminal"
      >
        {visible.map((line, i) => {
          const isCmd = line.kind === "cmd";
          const isJustCopied = copiedIdx === i;

          return (
            <div
              key={i}
              onClick={() => isCmd && handleCopyLine(line.text, i)}
              className={`group/line relative flex items-start gap-2 rounded px-1 -mx-1 transition-colors ${
                isCmd ? "cursor-pointer hover:bg-white/[0.04]" : ""
              }`}
              title={isCmd ? "Click to copy command" : undefined}
            >
              {isCmd && (
                <span className="shrink-0 select-none text-flame font-bold">$</span>
              )}
              <span className={`flex-1 ${TONE[line.kind]}`}>{line.text}</span>

              {isCmd && (
                <span className="shrink-0 opacity-0 group-hover/line:opacity-100 transition-opacity text-[10px] font-mono text-ash/70 flex items-center gap-1 pt-0.5">
                  {isJustCopied ? (
                    <span className="text-flame font-semibold">Copied</span>
                  ) : (
                    <Copy size={10} />
                  )}
                </span>
              )}
            </div>
          );
        })}

        {typing && (
          <div className="flex items-start gap-2 px-1 -mx-1">
            {typing.kind === "cmd" && (
              <span className="shrink-0 select-none text-flame font-bold">$</span>
            )}
            <span className={TONE[typing.kind]}>
              {typing.text.slice(0, charIdx)}
              <span className="animate-blink ml-0.5 inline-block h-3.5 sm:h-4 w-[6px] sm:w-[7px] translate-y-[2px] bg-flame" />
            </span>
          </div>
        )}

        {done && (
          <div className="pt-2 text-ash flex items-center gap-2 px-1 -mx-1">
            <span className="select-none text-flame font-bold">$</span>
            <span className="text-ash/50 text-[11px]">Ready for next pull request</span>
            <span className="animate-blink inline-block h-3.5 sm:h-4 w-[6px] sm:w-[7px] translate-y-[2px] bg-flame" />
          </div>
        )}
      </div>

      {/* Helper Footer strip */}
      <div className="border-t border-white/[0.05] bg-white/[0.01] px-4 py-2 flex items-center justify-between text-[10px] font-mono text-ash/60">
        <span className="truncate">Tip: Click any command line to copy it directly</span>
        <span className="shrink-0 text-flame/80">bash</span>
      </div>
    </div>
  );
}
