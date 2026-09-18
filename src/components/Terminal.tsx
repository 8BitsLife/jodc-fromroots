import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Copy, LoaderCircle, RotateCw, Terminal as TerminalIcon } from "lucide-react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type Kind =
  | "cmd" // typed at the prompt, click to copy
  | "out" // plain output
  | "dim" // quiet output
  | "ok" // success line, in flame
  | "add" // diff: added
  | "del" // diff: removed
  | "check" // CI check: spinner while it "runs", tick once done
  | "note"; // a reviewer's comment

type Line = { kind: Kind; text: string; by?: string };

export type Session = {
  id: string;
  label: string;
  path: string;
  tip: string;
  lines: Line[];
};

/** One tab per stage of a first contribution, from finding the club to a track record. */
export const SESSIONS: Session[] = [
  {
    id: "show-up",
    label: "show-up",
    path: "~",
    tip: "No setup needed for this one. Just come.",
    lines: [
      { kind: "cmd", text: "curl -s jodc.dev/next" },
      { kind: "out", text: "Next up   Dev-sprint · weekly during term" },
      { kind: "out", text: "Where     JIIT-128, Noida · and online" },
      { kind: "out", text: "Bring     a laptop and questions" },
      { kind: "dim", text: "Prerequisites: curiosity. First-years welcome." },
      { kind: "cmd", text: "echo \"see you there\" >> ~/plans.txt" },
      { kind: "ok", text: "Saved. That's the hardest step done." },
    ],
  },
  {
    id: "find",
    label: "find-issue",
    path: "~/jodc",
    tip: "Look for a label like good first issue, then say you're on it.",
    lines: [
      { kind: "cmd", text: "gh issue list -R some-org/real-project -l \"good first issue\"" },
      { kind: "out", text: "#408  Table drops the last row on export     bug" },
      { kind: "out", text: "#401  Add a --quiet flag to the CLI          enhancement" },
      { kind: "out", text: "#377  Typo in the contributing guide          docs" },
      { kind: "cmd", text: "gh issue comment 408 -b \"Hi! I'd like to take this one.\"" },
      { kind: "note", by: "maintainer", text: "All yours. The export lives in src/table.ts, shout if you get stuck." },
      { kind: "ok", text: "Assigned to you. Issue #408 is yours." },
    ],
  },
  {
    id: "pr",
    label: "open-pr",
    path: "~/jodc/real-project",
    tip: "Small, focused changes get reviewed fastest.",
    lines: [
      { kind: "cmd", text: "gh repo fork some-org/real-project --clone" },
      { kind: "dim", text: "✓ Created fork you/real-project · cloned into ./real-project" },
      { kind: "cmd", text: "git switch -c fix/last-row" },
      { kind: "cmd", text: "git diff" },
      { kind: "dim", text: "@@ src/table.ts @@ export function rows(data) {" },
      { kind: "del", text: "-  for (let i = 0; i < data.length - 1; i++) {" },
      { kind: "add", text: "+  for (let i = 0; i < data.length; i++) {" },
      { kind: "cmd", text: "git commit -am \"fix: stop dropping the last row\"" },
      { kind: "cmd", text: "gh pr create --fill" },
      { kind: "ok", text: "https://github.com/some-org/real-project/pull/412" },
    ],
  },
  {
    id: "further",
    label: "go-further",
    path: "~/jodc",
    tip: "A record of merged work speaks louder than any résumé line.",
    lines: [
      { kind: "cmd", text: "gh search prs --author @me --merged --json repository -q length" },
      { kind: "out", text: "27" },
      { kind: "cmd", text: "git shortlog -sn --author=\"you\" | head -3" },
      { kind: "out", text: "   14  some-org/real-project" },
      { kind: "out", text: "    9  another-org/cli-tool" },
      { kind: "out", text: "    4  docs-org/handbook" },
      { kind: "dim", text: "Applications open for GSoC and Outreachy." },
      { kind: "ok", text: "Track record: ready. Go apply." },
    ],
  },
];

const TYPE_MS = 22;
const OUT_MS = 6;
const LINE_PAUSE = 260;
const CHECK_MS = 700;
/** How long a finished tab stays up before the tour moves to the next one. */
const TOUR_HOLD_MS = 2400;

const TONE: Record<Kind, string> = {
  cmd: "text-bone",
  out: "text-bone/75",
  dim: "text-ash/80",
  ok: "text-flame font-medium",
  add: "text-emerald-400/90",
  del: "text-rose-400/90",
  check: "text-bone/85",
  note: "text-bone/85",
};

function LineView({ line, text, running, copied, onCopy }: {
  line: Line;
  text: string;
  running: boolean;
  copied: boolean;
  onCopy?: () => void;
}) {
  if (line.kind === "note") {
    return (
      <div className="my-1 rounded-lg border-l-2 border-flame/60 bg-white/[0.03] px-3 py-2">
        <p className="text-[10px] uppercase tracking-[0.16em] text-flame/80">@{line.by} commented</p>
        <p className={`mt-1 ${TONE.note}`}>{text}</p>
      </div>
    );
  }

  if (line.kind === "check") {
    return (
      <div className="flex items-center gap-2">
        {running ? (
          <LoaderCircle size={13} className="shrink-0 animate-spin text-ash" aria-hidden="true" />
        ) : (
          <Check size={13} className="shrink-0 text-emerald-400" aria-hidden="true" />
        )}
        <span className={TONE.check}>{text}</span>
        {!running && <span className="text-ash/60">passed</span>}
      </div>
    );
  }

  const isCmd = line.kind === "cmd";
  return (
    <div
      onClick={onCopy}
      className={`group/line -mx-1.5 flex items-start gap-2 rounded px-1.5 ${isCmd && onCopy ? "cursor-pointer hover:bg-white/[0.04]" : ""}`}
      title={isCmd && onCopy ? "Click to copy" : undefined}
    >
      {isCmd && <span className="shrink-0 select-none font-bold text-flame">$</span>}
      <span className={`min-w-0 flex-1 whitespace-pre-wrap break-words ${TONE[line.kind]}`}>
        {text}
        {running && <span className="animate-blink ml-0.5 inline-block h-3.5 w-[7px] translate-y-[2px] bg-flame sm:h-4" />}
      </span>
      {isCmd && onCopy && (
        <span className="shrink-0 pt-0.5 text-[10px] text-ash/70 opacity-0 transition-opacity group-hover/line:opacity-100">
          {copied ? <span className="font-semibold text-flame">Copied</span> : <Copy size={10} aria-hidden="true" />}
        </span>
      )}
    </div>
  );
}

/**
 * A terminal with a tab per stage of a first contribution. Each tab types out
 * its session; when one finishes, the tour moves on to the next, until the
 * visitor picks a tab themselves. Commands can be copied line by line or all
 * at once, and the arrow keys move between tabs.
 */
export function Terminal({
  tab,
  onTabChange,
  touring,
  onStopTour,
}: {
  tab: number;
  onTabChange: (tab: number) => void;
  /** Whether finished tabs hand over to the next one on their own. */
  touring: boolean;
  onStopTour: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useInView(ref, { margin: "-80px" });
  const reduced = usePrefersReducedMotion();

  const session = SESSIONS[tab];
  const [seen, setSeen] = useState<Set<number>>(() => new Set());
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  // Typing position, tagged with the tab it belongs to. On a tab switch the old
  // position is ignored: an unseen tab starts from the top, a seen one shows in full.
  const [pos, setPos] = useState({ tab, line: 0, char: 0 });
  const fresh = pos.tab === tab;
  const lineIdx = fresh ? pos.line : seen.has(tab) || reduced ? session.lines.length : 0;
  const charIdx = fresh ? pos.char : 0;
  const done = lineIdx >= session.lines.length;

  // Typing engine: commands type out, output streams, checks spin before they pass.
  useEffect(() => {
    if (!inView || done) return;
    if (reduced) {
      setPos({ tab, line: session.lines.length, char: 0 });
      return;
    }
    const line = session.lines[lineIdx];
    const text = line.kind === "check" ? "" : line.text;
    if (charIdx < text.length) {
      const t = setTimeout(
        () => setPos({ tab, line: lineIdx, char: charIdx + 1 }),
        line.kind === "cmd" ? TYPE_MS : OUT_MS,
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(
      () => setPos({ tab, line: lineIdx + 1, char: 0 }),
      line.kind === "check" ? CHECK_MS : LINE_PAUSE,
    );
    return () => clearTimeout(t);
  }, [inView, done, reduced, session, tab, lineIdx, charIdx]);

  // Remember finished tabs, and keep the tour going while nobody has taken over.
  useEffect(() => {
    if (!done) return;
    setSeen((s) => (s.has(tab) ? s : new Set(s).add(tab)));
    if (!touring || !inView || reduced || tab === SESSIONS.length - 1) return;
    const t = setTimeout(() => onTabChange(tab + 1), TOUR_HOLD_MS);
    return () => clearTimeout(t);
  }, [done, touring, inView, reduced, tab, onTabChange]);

  // Follow the output as it grows.
  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lineIdx, tab]);

  const pick = (i: number) => {
    onStopTour();
    onTabChange(i);
  };

  const replay = () => {
    onStopTour();
    setPos({ tab, line: 0, char: 0 });
  };

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (tab + dir + SESSIONS.length) % SESSIONS.length;
    pick(next);
    tabRefs.current[next]?.focus();
  };

  const copy = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1600);
  };

  const copyAll = () => {
    navigator.clipboard?.writeText(session.lines.filter((l) => l.kind === "cmd").map((l) => l.text).join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1800);
  };

  const shown = session.lines.slice(0, Math.min(lineIdx + 1, session.lines.length));

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#09090d] shadow-[0_24px_60px_rgba(0,0,0,0.8)]"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-flame/50 to-transparent" />

      {/* Title bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/80" />
          </div>
          <span className="flex min-w-0 items-center gap-1.5 font-mono text-[11px] text-ash/80 sm:text-xs">
            <TerminalIcon size={12} className="shrink-0 text-flame" aria-hidden="true" />
            <span className="truncate">{session.path}</span>
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={replay}
            className="flex h-7 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 font-mono text-[10px] text-ash transition-colors hover:border-flame/40 hover:bg-flame/10 hover:text-bone sm:text-[11px]"
          >
            <RotateCw size={11} aria-hidden="true" className={!done && inView ? "animate-spin text-flame" : ""} />
            <span className="hidden xs:inline">{done ? "Replay" : "Running"}</span>
          </button>
          <button
            type="button"
            onClick={copyAll}
            className="flex h-7 items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-2 font-mono text-[10px] text-ash transition-colors hover:border-flame/40 hover:bg-flame/10 hover:text-bone sm:text-[11px]"
          >
            {copiedAll ? <Check size={11} className="text-flame" aria-hidden="true" /> : <Copy size={11} aria-hidden="true" />}
            <span className={`hidden xs:inline ${copiedAll ? "text-flame" : ""}`}>{copiedAll ? "Copied" : "Copy commands"}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Contribution steps"
        onKeyDown={onTabKey}
        className="flex overflow-x-auto border-b border-white/[0.06] bg-black/20 no-scrollbar"
      >
        {SESSIONS.map((s, i) => {
          const selected = i === tab;
          const finished = seen.has(i) || (selected && done);
          return (
            <button
              key={s.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`term-tab-${s.id}`}
              aria-selected={selected}
              aria-controls="term-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => pick(i)}
              className={`relative flex min-w-max flex-1 items-center justify-center gap-2 px-3.5 py-2.5 font-mono text-[11px] transition-colors sm:px-4 sm:text-xs ${
                selected ? "text-bone" : "text-ash/70 hover:text-bone"
              }`}
            >
              <span className={`text-[10px] ${selected ? "text-flame" : "text-ash/50"}`}>{i + 1}</span>
              {s.label}
              <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  selected && !done ? "animate-pulse bg-flame" : finished ? "bg-emerald-400/70" : "bg-white/15"
                }`}
              />
              {selected && (
                <motion.span
                  layoutId="terminal-tab"
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-flame"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Screen: a fixed height, so switching tabs never moves the page. */}
      <div
        ref={screenRef}
        id="term-panel"
        role="tabpanel"
        aria-labelledby={`term-tab-${session.id}`}
        className="h-[20rem] space-y-2 overflow-y-auto scroll-smooth p-4 font-mono text-[11px] leading-relaxed no-scrollbar xs:text-xs sm:h-[23rem] sm:p-5 sm:text-[13px]"
      >
        {shown.map((line, i) => {
          const current = i === lineIdx;
          const text = current ? line.text.slice(0, charIdx) : line.text;
          return (
            <LineView
              key={`${session.id}-${i}`}
              line={line}
              text={line.kind === "check" ? line.text : text}
              running={current}
              copied={copiedIdx === i}
              onCopy={line.kind === "cmd" && !current ? () => copy(line.text, i) : undefined}
            />
          );
        })}

        {done && (
          <div className="flex items-center gap-2 pt-1">
            <span className="select-none font-bold text-flame">$</span>
            <span className="animate-blink inline-block h-3.5 w-[7px] translate-y-[1px] bg-flame sm:h-4" />
          </div>
        )}
      </div>

      {/* Footer: what this tab is about, and where you are in the tour. */}
      <div className="flex items-center justify-between gap-4 border-t border-white/[0.05] bg-white/[0.01] px-4 py-2.5 font-mono text-[10px] text-ash/70 sm:text-[11px]">
        <span className="min-w-0 truncate">{session.tip}</span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="hidden text-ash/50 sm:inline">← → to switch</span>
          <span className="tabular-nums text-flame/80">
            {tab + 1}/{SESSIONS.length}
          </span>
        </span>
      </div>
    </div>
  );
}
