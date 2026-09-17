import { useState, useEffect, useRef, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Check, Send, Loader2, CheckCircle2, Github, Globe, User, Mail, AtSign, GraduationCap } from "lucide-react";
import { SUBMISSION_DETAILS } from "../../data/repoOfTheWeek";
import { submitProject } from "../../services/repoService";

const ease = [0.16, 1, 0.3, 1] as const;

const CATEGORIES = [
  "AI & Autonomous Agents",
  "DevTools & IDEs",
  "Web & Fullstack",
  "Systems & Cloud Infra",
  "Cybersecurity",
  "Mobile & Cross-Platform",
  "Open Source Library / Package",
  "Other",
] as const;

export function SubmitProjectModal() {
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [githubUrl, setGithubUrl] = useState("");
  const [repoName, setRepoName] = useState("");
  const [tagline, setTagline] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [demoUrl, setDemoUrl] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [submitterHandle, setSubmitterHandle] = useState("");
  const [campusYear, setCampusYear] = useState("");
  const [pitch, setPitch] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  // Auto-detect project name from GitHub URL
  const handleUrlChange = (url: string) => {
    setGithubUrl(url);
    if (!repoName) {
      try {
        const match = url.match(/github\.com\/[^/]+\/([^/]+)/);
        if (match && match[1]) {
          const cleanName = match[1].replace(/\.git$/, "");
          setRepoName(cleanName);
        }
      } catch {
        /* ignore parsing errors */
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUrl = githubUrl.trim();
    if (!trimmedUrl.toLowerCase().includes("github.com/")) {
      setErrorMessage("Please enter a valid GitHub repository URL (e.g. https://github.com/owner/project).");
      return;
    }

    if (!repoName.trim() || !submitterName.trim() || !submitterEmail.trim()) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const res = await submitProject({
      githubUrl: trimmedUrl,
      repoName: repoName.trim(),
      tagline: tagline.trim() || undefined,
      category,
      demoUrl: demoUrl.trim() || undefined,
      submitterName: submitterName.trim(),
      submitterEmail: submitterEmail.trim(),
      submitterHandle: submitterHandle.trim() || undefined,
      campusYear: campusYear.trim() || undefined,
      pitch: pitch.trim() || undefined,
    });

    setIsSubmitting(false);

    if (res.success) {
      setIsSubmitted(true);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setGithubUrl("");
    setRepoName("");
    setTagline("");
    setCategory(CATEGORIES[0]);
    setDemoUrl("");
    setSubmitterName("");
    setSubmitterEmail("");
    setSubmitterHandle("");
    setCampusYear("");
    setPitch("");
    setErrorMessage(null);
  };

  return (
    <>
      <aside aria-label="Submit a repository" className="fixed bottom-5 right-4 z-50 print:hidden sm:bottom-6 sm:right-6">
        <button
          ref={triggerRef}
          type="button"
          onClick={() => {
            setIsOpen(true);
            setErrorMessage(null);
          }}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          className="glass group relative flex min-h-12 items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 text-sm font-medium text-bone transition-transform duration-300 active:scale-[0.98]"
        >
          Submit a repo
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-flame text-ink">
            <Plus size={16} strokeWidth={2.25} aria-hidden="true" className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90" />
          </span>
        </button>
      </aside>

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-ink/70 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease }}
              className="glass relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] p-6 no-scrollbar sm:p-8"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-flame/20 blur-[80px]" />

              <button
                ref={closeRef}
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full text-ash transition-colors hover:bg-white/[0.08] hover:text-bone"
              >
                <X size={18} aria-hidden="true" />
              </button>

              <p className="kicker relative text-flame">Repo of the Week · Submissions</p>
              <h2 id="submit-modal-title" className="relative mt-2 pr-10 text-[1.85rem] leading-tight tracking-tight text-bone sm:text-[2.2rem]">
                Submit your <span className="accent">repository.</span>
              </h2>

              {isSubmitted ? (
                <div className="relative mt-8 space-y-6 text-center py-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-flame/15 text-flame ring-1 ring-flame/30">
                    <CheckCircle2 size={36} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-bone">Submission Received!</h3>
                    <p className="mx-auto max-w-md text-xs leading-relaxed text-ash">
                      Your repository has been saved directly to the JODC database. The review board reviews submissions weekly and spotlights the top project every Sunday.
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-xs font-mono text-bone hover:bg-white/[0.12] transition-colors"
                    >
                      Submit another project
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-xl bg-flame px-6 py-2.5 text-xs font-semibold text-ink hover:brightness-110 transition-transform active:scale-[0.98]"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="relative mt-2 text-pretty text-xs leading-relaxed text-ash">
                    Built an open-source tool, library, or application? Enter the repository details below. All submissions go directly into the JODC review database.
                  </p>

                  {/* Highlights checklist */}
                  <div className="relative mt-4 flex flex-wrap gap-2 text-[11px] text-bone/75">
                    {SUBMISSION_DETAILS.guidelines.slice(0, 3).map((g) => (
                      <span key={g} className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.03] px-2.5 py-1 ring-1 ring-white/5">
                        <Check size={12} className="text-flame" />
                        {g.split(".")[0]}
                      </span>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="relative mt-6 space-y-6">
                    {errorMessage && (
                      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs leading-relaxed text-red-200">
                        {errorMessage}
                      </div>
                    )}

                    {/* Section 1: Repo Details */}
                    <div className="space-y-3.5">
                      <div className="flex items-center gap-2 border-b border-white/[0.07] pb-1.5">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-flame font-semibold">
                          1. Repository Details
                        </span>
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-ash mb-1">
                          GitHub Repository URL <span className="text-flame">*</span>
                        </label>
                        <div className="relative">
                          <Github size={15} className="absolute left-3.5 top-3 text-ash/60" />
                          <input
                            type="url"
                            required
                            placeholder="https://github.com/username/project"
                            value={githubUrl}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            className="w-full rounded-xl bg-black/40 pl-10 pr-4 py-2.5 font-mono text-xs text-bone placeholder-ash/50 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-flame"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-wider text-ash mb-1">
                            Project Name <span className="text-flame">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. OmniRoute"
                            value={repoName}
                            onChange={(e) => setRepoName(e.target.value)}
                            className="w-full rounded-xl bg-black/40 px-4 py-2.5 text-xs text-bone placeholder-ash/50 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-flame"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-wider text-ash mb-1">
                            Category / Domain
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full rounded-xl bg-black/40 px-3 py-2.5 text-xs text-bone ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-flame"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c} className="bg-ink text-bone">
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-wider text-ash mb-1">
                            Short 1-line Tagline
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Free MIT AI gateway saving 15-95% tokens"
                            value={tagline}
                            onChange={(e) => setTagline(e.target.value)}
                            className="w-full rounded-xl bg-black/40 px-4 py-2.5 text-xs text-bone placeholder-ash/50 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-flame"
                          />
                        </div>

                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-wider text-ash mb-1">
                            Live Demo / Docs URL (optional)
                          </label>
                          <div className="relative">
                            <Globe size={14} className="absolute left-3.5 top-3 text-ash/60" />
                            <input
                              type="url"
                              placeholder="https://myproject.dev"
                              value={demoUrl}
                              onChange={(e) => setDemoUrl(e.target.value)}
                              className="w-full rounded-xl bg-black/40 pl-9 pr-4 py-2.5 text-xs text-bone placeholder-ash/50 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-flame"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Submitter / Builder Details */}
                    <div className="space-y-3.5 pt-2">
                      <div className="flex items-center gap-2 border-b border-white/[0.07] pb-1.5">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-flame font-semibold">
                          2. Builder & Contact Details
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-wider text-ash mb-1">
                            Your Full Name <span className="text-flame">*</span>
                          </label>
                          <div className="relative">
                            <User size={14} className="absolute left-3.5 top-3 text-ash/60" />
                            <input
                              type="text"
                              required
                              placeholder="Vardaan Saxena"
                              value={submitterName}
                              onChange={(e) => setSubmitterName(e.target.value)}
                              className="w-full rounded-xl bg-black/40 pl-9 pr-4 py-2.5 text-xs text-bone placeholder-ash/50 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-flame"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-wider text-ash mb-1">
                            Email Address <span className="text-flame">*</span>
                          </label>
                          <div className="relative">
                            <Mail size={14} className="absolute left-3.5 top-3 text-ash/60" />
                            <input
                              type="email"
                              required
                              placeholder="student@jiit.ac.in"
                              value={submitterEmail}
                              onChange={(e) => setSubmitterEmail(e.target.value)}
                              className="w-full rounded-xl bg-black/40 pl-9 pr-4 py-2.5 text-xs text-bone placeholder-ash/50 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-flame"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-wider text-ash mb-1">
                            GitHub Handle
                          </label>
                          <div className="relative">
                            <AtSign size={14} className="absolute left-3.5 top-3 text-ash/60" />
                            <input
                              type="text"
                              placeholder="simplyvardaan"
                              value={submitterHandle}
                              onChange={(e) => setSubmitterHandle(e.target.value)}
                              className="w-full rounded-xl bg-black/40 pl-9 pr-4 py-2.5 text-xs text-bone placeholder-ash/50 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-flame"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-mono text-[11px] uppercase tracking-wider text-ash mb-1">
                            Campus / College & Year
                          </label>
                          <div className="relative">
                            <GraduationCap size={14} className="absolute left-3.5 top-3 text-ash/60" />
                            <input
                              type="text"
                              placeholder="JIIT-128, 3rd Year"
                              value={campusYear}
                              onChange={(e) => setCampusYear(e.target.value)}
                              className="w-full rounded-xl bg-black/40 pl-9 pr-4 py-2.5 text-xs text-bone placeholder-ash/50 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-flame"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: Pitch */}
                    <div className="space-y-3.5 pt-2">
                      <div className="flex items-center gap-2 border-b border-white/[0.07] pb-1.5">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-flame font-semibold">
                          3. Brief Pitch
                        </span>
                      </div>

                      <div>
                        <label className="block font-mono text-[11px] uppercase tracking-wider text-ash mb-1">
                          Why Should This Project Be Spotlighted?
                        </label>
                        <textarea
                          rows={3}
                          placeholder="What inspired you to build it? What problem does it solve? What makes it exciting for developers?"
                          value={pitch}
                          onChange={(e) => setPitch(e.target.value)}
                          className="w-full rounded-xl bg-black/40 px-4 py-2.5 text-xs text-bone placeholder-ash/50 ring-1 ring-white/10 transition-all focus:outline-none focus:ring-2 focus:ring-flame resize-none"
                        />
                      </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex min-h-11 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-flame px-7 text-xs font-semibold text-ink transition-transform duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send size={13} />
                            Submit Repository
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
