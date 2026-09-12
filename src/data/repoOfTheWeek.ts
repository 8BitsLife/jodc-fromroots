export interface RepoLanguage {
  name: string;
  percent: number;
  color: string;
}

export interface CreatorOtherProject {
  name: string;
  stars: number;
  description: string;
  language: string;
  link: string;
}

export interface BuilderDetails {
  name: string;
  handle: string;
  role: string;
  campus: string;
  avatarText: string;
  bio: string;
  quote: string;
  status: string;
  github: string;
  twitter: string;
  linkedin: string;
  portfolio: string;
  badges: string[];
  metrics: {
    commits: string;
    totalStars: string;
    mergedPRs: string;
    activeYears: string;
  };
  skills: string[];
  otherProjects: CreatorOtherProject[];
}

export interface LeaderboardRepo {
  id: string;
  rank: number;
  name: string;
  fullName: string;
  tagline: string;
  description: string;
  highlights: string[];
  stars: number;
  forks: number;
  openIssues: number;
  license: string;
  version: string;
  week: string;
  dateRange: string;
  growth: string;
  languages: RepoLanguage[];
  tags: string[];
  githubUrl: string;
  demoUrl: string;
  curatorReview: string;
  curatorAuthor: string;
  builder: BuilderDetails;
}

export interface SponsorItem {
  name: string;
  tier: string;
  category: string;
  url: string;
}

export const SPONSORS: SponsorItem[] = [
  { name: "GitHub Education", tier: "Core Partner", category: "Developer Tools", url: "https://education.github.com" },
  { name: "JetBrains", tier: "IDE Sponsor", category: "Developer Ecosystem", url: "https://www.jetbrains.com" },
  { name: "DigitalOcean", tier: "Cloud Partner", category: "Infrastructure", url: "https://www.digitalocean.com" },
  { name: "Vercel", tier: "Deploy Partner", category: "Frontend Cloud", url: "https://vercel.com" },
  { name: "Supabase", tier: "Database Sponsor", category: "Backend Infrastructure", url: "https://supabase.com" },
  { name: "Postman", tier: "API Partner", category: "Developer Tooling", url: "https://www.postman.com" },
  { name: "Cloudflare", tier: "Edge Partner", category: "Network & Security", url: "https://www.cloudflare.com" },
  { name: "Red Hat", tier: "Open Source Ally", category: "Enterprise Linux", url: "https://www.redhat.com" },
  { name: "Docker", tier: "Container Partner", category: "DevOps", url: "https://www.docker.com" },
  { name: "AWS Community", tier: "Ecosystem Partner", category: "Cloud Computing", url: "https://aws.amazon.com" },
];

export const LEADERBOARD_REPOS: LeaderboardRepo[] = [
  {
    id: "ghost-cache",
    rank: 1,
    name: "ghost-cache",
    fullName: "aarav-sharma/ghost-cache",
    tagline: "Ultra-low-latency in-memory cache engine with SIMD acceleration and zero-copy serialization.",
    description:
      "A high-throughput in-memory key-value cache engine written in Rust. Features lock-free MPMC ring buffers, SIMD-accelerated key lookups, and memory-mapped slab allocators. Achieves deterministic sub-50 microsecond retrieval latencies under intensive concurrent workloads.",
    highlights: [
      "Lock-free MPMC ring buffers for zero contention across CPU cores",
      "SIMD 8-way hash matching executing in a single instruction cycle",
      "Zero-copy deserialization directly from memory-mapped slabs",
      "Interactive terminal telemetry dashboard (TUI) and Prometheus metrics",
    ],
    stars: 1248,
    forks: 142,
    openIssues: 6,
    license: "MIT",
    version: "v0.9.4",
    week: "Week 12",
    dateRange: "Sept 8 — Sept 15, 2026",
    growth: "+164 stars this week",
    languages: [
      { name: "Rust", percent: 91.6, color: "#dea584" },
      { name: "TypeScript", percent: 5.4, color: "#3178c6" },
      { name: "Shell", percent: 3.0, color: "#89e051" },
    ],
    tags: ["Systems", "Rust", "Cache", "High-Performance"],
    githubUrl: "https://github.com/aarav-sharma/ghost-cache",
    demoUrl: "https://ghost-cache-demo.vercel.app",
    curatorReview:
      "Aarav has delivered a masterclass in modern systems engineering. Ghost-Cache demonstrates exceptional craftsmanship, complete thread safety, and 94.8% test coverage.",
    curatorAuthor: "JODC Technical Board",
    builder: {
      name: "Aarav Sharma",
      handle: "aarav-sharma",
      role: "Lead Maintainer & 3rd Year CSE",
      campus: "JIIT — Sector 128 (Batch of 2026)",
      avatarText: "AS",
      bio: "Systems hacker focused on distributed runtimes, memory models, and Linux internals. Loves turning memory leaks into clean Rust traits and optimizing latency.",
      quote:
        "I started this project during a JODC weekend dev-sprint after learning how memory alignment affects L1 cache misses. If you are hesitant to ship code, just push that first commit.",
      status: "Building next-gen systems",
      github: "https://github.com/aarav-sharma",
      twitter: "https://x.com/aarav_codes",
      linkedin: "https://linkedin.com/in/aarav-sharma-cs",
      portfolio: "https://aarav.dev",
      badges: ["Featured Contributor", "Rust Specialist", "GSoC 2025 Contributor", "JODC Core Member"],
      metrics: {
        commits: "1,480+",
        totalStars: "2.1k+",
        mergedPRs: "78",
        activeYears: "3+ years",
      },
      skills: ["Rust", "C++20", "Go", "WebAssembly", "eBPF", "Docker", "Linux Internals"],
      otherProjects: [
        {
          name: "packet-tracer-rs",
          stars: 342,
          description: "High-throughput eBPF network packet monitor with real-time TUI visualizer.",
          language: "Rust",
          link: "https://github.com/aarav-sharma/packet-tracer-rs",
        },
        {
          name: "terminal-canvas",
          stars: 198,
          description: "Immediate-mode vector canvas and charting engine for ANSI terminals.",
          language: "TypeScript",
          link: "https://github.com/aarav-sharma/terminal-canvas",
        },
      ],
    },
  },
  {
    id: "whisper-notes",
    rank: 2,
    name: "whisper-notes",
    fullName: "ananya-verma/whisper-notes",
    tagline: "Local-first AI audio meeting transcriber powered by WebAssembly Whisper models.",
    description:
      "A privacy-first desktop and web tool that transcribes, formats, and summarizes lectures and developer discussions entirely inside the client browser using WebAssembly. Requires zero server calls and protects sensitive student discussions.",
    highlights: [
      "100% offline transcription via client-side WebAssembly execution",
      "Automatic speaker diarization and meeting action-item generator",
      "Syncs directly to Obsidian and Markdown vaults via local filesystem API",
      "Battery-efficient quantised neural model weights",
    ],
    stars: 842,
    forks: 94,
    openIssues: 4,
    license: "Apache-2.0",
    version: "v1.2.0",
    week: "Week 11",
    dateRange: "Aug 31 — Sept 7, 2026",
    growth: "+98 stars this week",
    languages: [
      { name: "TypeScript", percent: 74.2, color: "#3178c6" },
      { name: "Rust", percent: 21.0, color: "#dea584" },
      { name: "CSS", percent: 4.8, color: "#563d7c" },
    ],
    tags: ["AI/ML", "WebAssembly", "Local-First", "Productivity"],
    githubUrl: "https://github.com/ananya-verma/whisper-notes",
    demoUrl: "https://whisper-notes.vercel.app",
    curatorReview:
      "Ananya demonstrated how client-side WebAssembly models can replace heavy cloud APIs without sacrificing speed or user privacy.",
    curatorAuthor: "JODC Review Council",
    builder: {
      name: "Ananya Verma",
      handle: "ananya-verma",
      role: "AI & Fullstack Developer (3rd Year CSE)",
      campus: "JIIT — Sector 128 (Batch of 2026)",
      avatarText: "AV",
      bio: "Focuses on on-device machine learning, local-first web architectures, and intuitive developer interfaces.",
      quote:
        "Building local-first tools gives ownership back to users. Open source is the best testing ground for bold technical ideas.",
      status: "Optimizing browser inference",
      github: "https://github.com/ananya-verma",
      twitter: "https://x.com/ananyacodes",
      linkedin: "https://linkedin.com/in/ananya-verma",
      portfolio: "https://ananyaverma.dev",
      badges: ["Featured Contributor", "AI Specialist", "GSoC 2024 Scholar", "Open Source Mentor"],
      metrics: {
        commits: "1,120+",
        totalStars: "1.4k+",
        mergedPRs: "46",
        activeYears: "2+ years",
      },
      skills: ["TypeScript", "Rust", "WebAssembly", "ONNX", "React", "TailwindCSS"],
      otherProjects: [
        {
          name: "audio-wave-wasm",
          stars: 180,
          description: "High-performance real-time audio visualizer library for modern web apps.",
          language: "Rust",
          link: "https://github.com/ananya-verma/audio-wave-wasm",
        },
      ],
    },
  },
  {
    id: "cli-palette",
    rank: 3,
    name: "cli-palette",
    fullName: "rohan-malik/cli-palette",
    tagline: "Interactive terminal color scheme designer with live WCAG contrast auditing.",
    description:
      "A fast, beautiful terminal interface for generating, testing, and exporting color palettes directly into Alacritty, Kitty, WezTerm, and Neovim. Includes automated WCAG contrast ratio calculations and ANSI 256 fallbacks.",
    highlights: [
      "Built with Go and Bubbletea TUI framework for smooth 60fps terminal interactions",
      "Instant configuration export for 18 popular terminal emulators and code editors",
      "Real-time contrast ratio auditing against dark and light shell themes",
      "Zero runtime dependencies — single standalone binary distribution",
    ],
    stars: 614,
    forks: 67,
    openIssues: 3,
    license: "MIT",
    version: "v2.0.1",
    week: "Week 10",
    dateRange: "Aug 24 — Aug 31, 2026",
    growth: "+72 stars this week",
    languages: [
      { name: "Go", percent: 89.2, color: "#00add8" },
      { name: "Shell", percent: 10.8, color: "#89e051" },
    ],
    tags: ["CLI", "Go", "TUI", "Developer-Tool"],
    githubUrl: "https://github.com/rohan-malik/cli-palette",
    demoUrl: "https://github.com/rohan-malik/cli-palette#demo",
    curatorReview:
      "Rohan's CLI proves that terminal user interfaces can look as sleek and accessible as any modern desktop GUI.",
    curatorAuthor: "JODC Dev Council",
    builder: {
      name: "Rohan Malik",
      handle: "rohan-malik",
      role: "Systems & CLI Enthusiast (2nd Year CSE)",
      campus: "JIIT — Sector 128 (Batch of 2027)",
      avatarText: "RM",
      bio: "Enjoys crafting lightweight command-line utilities, exploring Go concurrency, and standardizing accessible developer themes.",
      quote:
        "The command-line is where engineers spend most of their lives. Making it beautiful and ergonomically pleasant improves daily focus.",
      status: "Building terminal tools in Go",
      github: "https://github.com/rohan-malik",
      twitter: "https://x.com/rohan_dev",
      linkedin: "https://linkedin.com/in/rohan-malik-cs",
      portfolio: "https://rohanmalik.me",
      badges: ["Featured Contributor", "Go Builder", "TUI Specialist", "JODC Active Contributor"],
      metrics: {
        commits: "890+",
        totalStars: "950+",
        mergedPRs: "38",
        activeYears: "2 years",
      },
      skills: ["Go", "Bubbletea", "C", "Linux", "Bash", "Neovim Lua"],
      otherProjects: [
        {
          name: "git-summary-tui",
          stars: 210,
          description: "Compact terminal dashboard summarizing branch status and author commits.",
          language: "Go",
          link: "https://github.com/rohan-malik/git-summary-tui",
        },
      ],
    },
  },
  {
    id: "git-pulse",
    rank: 4,
    name: "git-pulse",
    fullName: "devansh-gupta/git-pulse",
    tagline: "Animated terminal Git branch visualizer and developer activity heatmap engine.",
    description:
      "A fast git commit graph analyzer that plots real-time interactive ASCII trees, author velocity statistics, and branch topology directly inside your shell or exports them as crisp vector SVGs.",
    highlights: [
      "Custom graph layout algorithm minimizing edge crossings in large repositories",
      "SVG exporter generating high-resolution commit trees for documentation",
      "Detects abandoned branches and stale pull request branches automatically",
      "Native libgit2 bindings for high-speed indexing across 50,000+ commits",
    ],
    stars: 524,
    forks: 58,
    openIssues: 5,
    license: "GPL-3.0",
    version: "v0.8.2",
    week: "Week 09",
    dateRange: "Aug 17 — Aug 24, 2026",
    growth: "+45 stars this week",
    languages: [
      { name: "Rust", percent: 86.4, color: "#dea584" },
      { name: "Python", percent: 13.6, color: "#3572a5" },
    ],
    tags: ["Git", "Rust", "Analytics", "CLI"],
    githubUrl: "https://github.com/devansh-gupta/git-pulse",
    demoUrl: "https://github.com/devansh-gupta/git-pulse",
    curatorReview:
      "Devansh turned complex git graph data structures into clear and visually compelling command-line charts.",
    curatorAuthor: "JODC Review Team",
    builder: {
      name: "Devansh Gupta",
      handle: "devansh-gupta",
      role: "Backend & Systems Developer (4th Year ECE)",
      campus: "JIIT — Sector 128 (Batch of 2025)",
      avatarText: "DG",
      bio: "Focuses on version control internals, network graph theory, and writing clean Rust utilities for developers.",
      quote:
        "Understanding Git at the graph level makes you a much more confident collaborator in large open source codebases.",
      status: "Final year research & OSS",
      github: "https://github.com/devansh-gupta",
      twitter: "https://x.com/devansh_oss",
      linkedin: "https://linkedin.com/in/devansh-gupta",
      portfolio: "https://devansh.io",
      badges: ["Featured Contributor", "Graph Specialist", "Rust Developer", "Alumni Mentor"],
      metrics: {
        commits: "1,600+",
        totalStars: "1.2k+",
        mergedPRs: "62",
        activeYears: "3.5 years",
      },
      skills: ["Rust", "Git Internals", "C++", "Python", "Data Structures"],
      otherProjects: [
        {
          name: "topo-graph",
          stars: 140,
          description: "Minimal DAG cycle detection and topological sorting library in Rust.",
          language: "Rust",
          link: "https://github.com/devansh-gupta/topo-graph",
        },
      ],
    },
  },
  {
    id: "hyper-flow",
    rank: 5,
    name: "hyper-flow",
    fullName: "kabir-mehta/hyper-flow",
    tagline: "Ultra-fast state machine and event-driven workflow engine with zero external dependencies.",
    description:
      "A lightweight, deterministic state orchestration engine for backend services and distributed task processing. Features sub-millisecond transition execution and automatic retry policies with backoff.",
    highlights: [
      "Zero third-party dependencies for maximum security and minimal attack surface",
      "Deterministic state transitions with structured event replay audit logs",
      "Native TypeScript type inference verifying valid state transitions at compile time",
      "Integrated health metrics and workflow visualization generator",
    ],
    stars: 430,
    forks: 41,
    openIssues: 2,
    license: "MIT",
    version: "v1.0.4",
    week: "Week 08",
    dateRange: "Aug 10 — Aug 17, 2026",
    growth: "+38 stars this week",
    languages: [
      { name: "TypeScript", percent: 96.0, color: "#3178c6" },
      { name: "Shell", percent: 4.0, color: "#89e051" },
    ],
    tags: ["State-Machine", "TypeScript", "Backend", "Event-Driven"],
    githubUrl: "https://github.com/kabir-mehta/hyper-flow",
    demoUrl: "https://hyper-flow.dev",
    curatorReview:
      "Kabir created an elegant developer experience for orchestrating complex business processes with full type safety.",
    curatorAuthor: "JODC Review Team",
    builder: {
      name: "Kabir Mehta",
      handle: "kabir-mehta",
      role: "Backend Engineer (3rd Year CSE)",
      campus: "JIIT — Sector 128 (Batch of 2026)",
      avatarText: "KM",
      bio: "Enjoys designing event-driven systems, backend concurrency patterns, and developer-friendly TypeScript SDKs.",
      quote:
        "Simplicity is the hardest thing to engineer. When code feels effortless to read, months of careful refactoring went into it.",
      status: "Building distributed event models",
      github: "https://github.com/kabir-mehta",
      twitter: "https://x.com/kabirmehta_dev",
      linkedin: "https://linkedin.com/in/kabir-mehta",
      portfolio: "https://kabirmehta.dev",
      badges: ["Featured Contributor", "Type System Enthusiast", "JODC Member"],
      metrics: {
        commits: "780+",
        totalStars: "680+",
        mergedPRs: "29",
        activeYears: "2 years",
      },
      skills: ["TypeScript", "Node.js", "PostgreSQL", "Docker", "Kafka"],
      otherProjects: [
        {
          name: "typed-event-bus",
          stars: 120,
          description: "Strictly typed in-memory pub-sub event emitter for TypeScript.",
          language: "TypeScript",
          link: "https://github.com/kabir-mehta/typed-event-bus",
        },
      ],
    },
  },
  {
    id: "packet-tracer-rs",
    rank: 6,
    name: "packet-tracer-rs",
    fullName: "priyanshu-verma/packet-tracer-rs",
    tagline: "High-throughput eBPF network packet monitor with real-time terminal visualizer.",
    description:
      "A fast kernel-level network packet telemetry engine written in Rust. Captures TCP flow anomalies, packet retransmissions, and DNS response latencies via eBPF probes with zero userspace context-switch overhead.",
    highlights: [
      "Zero-overhead kernel probes powered by Aya Rust eBPF framework",
      "Interactive 60fps Ratatui terminal dashboard showing live throughput heatmaps",
      "Automatic TCP SYN-flood detection and microburst alert dispatching",
      "Exports OpenTelemetry traces directly to Prometheus and Grafana",
    ],
    stars: 378,
    forks: 36,
    openIssues: 3,
    license: "Apache-2.0",
    version: "v0.6.1",
    week: "Week 07",
    dateRange: "Aug 3 — Aug 10, 2026",
    growth: "+41 stars this week",
    languages: [
      { name: "Rust", percent: 88.5, color: "#dea584" },
      { name: "C", percent: 9.2, color: "#555555" },
      { name: "Shell", percent: 2.3, color: "#89e051" },
    ],
    tags: ["eBPF", "Rust", "Networking", "Telemetry"],
    githubUrl: "https://github.com/priyanshu-verma/packet-tracer-rs",
    demoUrl: "https://github.com/priyanshu-verma/packet-tracer-rs#demo",
    curatorReview:
      "Priyanshu pushed Linux kernel tracing boundaries in a student project, combining low-level eBPF safety with an intuitive TUI.",
    curatorAuthor: "JODC Systems SIG",
    builder: {
      name: "Priyanshu Verma",
      handle: "priyanshu-verma",
      role: "Systems & Network Researcher (4th Year CSE)",
      campus: "JIIT — Sector 128 (Batch of 2025)",
      avatarText: "PV",
      bio: "Focuses on Linux kernel internals, eBPF security instrumentation, and high-performance network programming in Rust.",
      quote:
        "The Linux kernel is open source's greatest engineering marvel. Peeking inside with eBPF unlocks an entirely new world.",
      status: "Researching kernel observability",
      github: "https://github.com/priyanshu-verma",
      twitter: "https://x.com/priyanshu_ebpf",
      linkedin: "https://linkedin.com/in/priyanshu-verma-cs",
      portfolio: "https://priyanshu.systems",
      badges: ["Featured Contributor", "Kernel Explorer", "Rust Specialist", "JODC Alumni Mentor"],
      metrics: {
        commits: "1,240+",
        totalStars: "890+",
        mergedPRs: "44",
        activeYears: "3 years",
      },
      skills: ["Rust", "C", "eBPF", "Linux Kernel", "Wireshark", "Prometheus"],
      otherProjects: [
        {
          name: "net-ring-buf",
          stars: 115,
          description: "Lock-free circular buffer allocator for packet capture pipelines.",
          language: "Rust",
          link: "https://github.com/priyanshu-verma/net-ring-buf",
        },
      ],
    },
  },
  {
    id: "terminal-canvas",
    rank: 7,
    name: "terminal-canvas",
    fullName: "tanya-sethi/terminal-canvas",
    tagline: "Immediate-mode 2D vector canvas and charting engine for modern ANSI terminals.",
    description:
      "A fast immediate-mode 2D graphics and charting library for terminal applications. Supports bezier curves, anti-aliased Braille drawing, bar charts, and truecolor gradients directly inside UTF-8 terminal emulators.",
    highlights: [
      "Sub-pixel precision rendering using Braille unicode grid patterns",
      "Declarative chart components for timeseries, sparklines, and histograms",
      "Full 24-bit TrueColor and ANSI 256 color depth support",
      "Built-in 60fps animation loop with automated terminal resize throttling",
    ],
    stars: 312,
    forks: 28,
    openIssues: 1,
    license: "MIT",
    version: "v1.4.0",
    week: "Week 06",
    dateRange: "July 27 — Aug 3, 2026",
    growth: "+29 stars this week",
    languages: [
      { name: "TypeScript", percent: 91.2, color: "#3178c6" },
      { name: "JavaScript", percent: 8.8, color: "#f1e05a" },
    ],
    tags: ["Graphics", "Canvas", "Terminal", "TypeScript"],
    githubUrl: "https://github.com/tanya-sethi/terminal-canvas",
    demoUrl: "https://terminal-canvas.dev",
    curatorReview:
      "Tanya bridged the gap between graphical canvas APIs and terminal unicode matrices with remarkable elegance and performance.",
    curatorAuthor: "JODC Creative SIG",
    builder: {
      name: "Tanya Sethi",
      handle: "tanya-sethi",
      role: "Creative Technologist (3rd Year IT)",
      campus: "JIIT — Sector 128 (Batch of 2026)",
      avatarText: "TS",
      bio: "Passionate about generative art, creative coding in the terminal, and accessible visual representations of developer data.",
      quote:
        "Code can be art, and the terminal is our most personal canvas. Constraints like monospace grids breed real creativity.",
      status: "Exploring generative ASCII shaders",
      github: "https://github.com/tanya-sethi",
      twitter: "https://x.com/tanya_creative",
      linkedin: "https://linkedin.com/in/tanya-sethi",
      portfolio: "https://tanyasethi.art",
      badges: ["Featured Contributor", "Creative Hacker", "Open Source Designer"],
      metrics: {
        commits: "910+",
        totalStars: "740+",
        mergedPRs: "35",
        activeYears: "2.5 years",
      },
      skills: ["TypeScript", "WebGL", "Canvas API", "ANSI", "Node.js", "React"],
      otherProjects: [
        {
          name: "ascii-shader-toy",
          stars: 188,
          description: "Live fragment shader compiler rendering in ASCII text characters.",
          language: "TypeScript",
          link: "https://github.com/tanya-sethi/ascii-shader-toy",
        },
      ],
    },
  },
  {
    id: "micro-raft",
    rank: 8,
    name: "micro-raft",
    fullName: "siddharth-rao/micro-raft",
    tagline: "Minimalist Raft distributed consensus protocol implementation in Go with visual audit replay.",
    description:
      "A pedagogical yet production-grade Raft consensus state machine engine in Go. Features automated leader election, log replication, snapshotting, and an interactive web inspector for stepping through cluster splits and network partitions.",
    highlights: [
      "Clean, RFC-spec Raft implementation with 100% linearizable read guarantees",
      "Includes chaos simulation harness testing arbitrary network drops and jitter",
      "Interactive SVG state visualizer showing leader transitions in real-time",
      "Zero dependencies — uses only Go standard library net and rpc",
    ],
    stars: 295,
    forks: 31,
    openIssues: 2,
    license: "MIT",
    version: "v0.9.0",
    week: "Week 05",
    dateRange: "July 20 — July 27, 2026",
    growth: "+34 stars this week",
    languages: [
      { name: "Go", percent: 94.0, color: "#00add8" },
      { name: "HTML", percent: 6.0, color: "#e34c26" },
    ],
    tags: ["Distributed", "Go", "Consensus", "Raft"],
    githubUrl: "https://github.com/siddharth-rao/micro-raft",
    demoUrl: "https://micro-raft-demo.fly.dev",
    curatorReview:
      "Siddharth made distributed consensus accessible to undergraduate peers by pairing clean Go architecture with visual partition simulation.",
    curatorAuthor: "JODC Distributed Systems Track",
    builder: {
      name: "Siddharth Rao",
      handle: "siddharth-rao",
      role: "Distributed Systems Enthusiast (3rd Year CSE)",
      campus: "JIIT — Sector 128 (Batch of 2026)",
      avatarText: "SR",
      bio: "Passionate about distributed consensus, fault-tolerant replication, and building reliable primitives on top of unreliable networks.",
      quote:
        "Distributed systems teach humility. Always assume the network is lying and servers will crash at the worst possible moment.",
      status: "Building distributed primitives",
      github: "https://github.com/siddharth-rao",
      twitter: "https://x.com/siddharth_dist",
      linkedin: "https://linkedin.com/in/siddharth-rao-dev",
      portfolio: "https://siddharthrao.dev",
      badges: ["Featured Contributor", "Go Builder", "Distributed Systems Track"],
      metrics: {
        commits: "640+",
        totalStars: "520+",
        mergedPRs: "22",
        activeYears: "2 years",
      },
      skills: ["Go", "Distributed Systems", "RPC", "Docker", "Consensus Protocols"],
      otherProjects: [
        {
          name: "chaos-proxy",
          stars: 92,
          description: "TCP proxy injecting latency, packet drops, and jitter for testing.",
          language: "Go",
          link: "https://github.com/siddharth-rao/chaos-proxy",
        },
      ],
    },
  },
  {
    id: "dev-matrix",
    rank: 9,
    name: "dev-matrix",
    fullName: "riya-kapoor/dev-matrix",
    tagline: "Developer productivity workspace orchestrator and terminal session multiplexer.",
    description:
      "A fast CLI workflow orchestrator that launches reproducible local development environments, port forwarders, and log streams from a simple declarative YAML file. Saves developers from opening a dozen terminal tabs every morning.",
    highlights: [
      "Declarative YAML workspace recipes with one-command spin-up and teardown",
      "Automatic Docker service health checking before booting dependent servers",
      "Unified log stream aggregator with regex-based color filters",
      "Cross-platform support for macOS, Linux, and Windows Terminal",
    ],
    stars: 264,
    forks: 22,
    openIssues: 1,
    license: "MIT",
    version: "v1.1.2",
    week: "Week 04",
    dateRange: "July 13 — July 20, 2026",
    growth: "+26 stars this week",
    languages: [
      { name: "Rust", percent: 84.6, color: "#dea584" },
      { name: "YAML", percent: 15.4, color: "#cb171e" },
    ],
    tags: ["DevOps", "CLI", "Rust", "Productivity"],
    githubUrl: "https://github.com/riya-kapoor/dev-matrix",
    demoUrl: "https://github.com/riya-kapoor/dev-matrix",
    curatorReview:
      "Riya solved a universal developer pain point with a lightweight, dependable Rust utility that saves minutes on every local setup.",
    curatorAuthor: "JODC Review Council",
    builder: {
      name: "Riya Kapoor",
      handle: "riya-kapoor",
      role: "Fullstack & DevOps Developer (2nd Year CSE)",
      campus: "JIIT — Sector 128 (Batch of 2027)",
      avatarText: "RK",
      bio: "Focuses on developer experience tooling, container automation, and building utilities that remove friction from everyday dev work.",
      quote:
        "If you do a task more than twice a day, automate it. Good developer tooling compounds everyone's velocity.",
      status: "Automating developer workflows",
      github: "https://github.com/riya-kapoor",
      twitter: "https://x.com/riya_builds",
      linkedin: "https://linkedin.com/in/riya-kapoor-cs",
      portfolio: "https://riyakapoor.dev",
      badges: ["Featured Contributor", "Rust Enthusiast", "DevOps Builder"],
      metrics: {
        commits: "510+",
        totalStars: "410+",
        mergedPRs: "19",
        activeYears: "1.5 years",
      },
      skills: ["Rust", "Docker", "Bash", "GitHub Actions", "TypeScript"],
      otherProjects: [
        {
          name: "env-sync",
          stars: 84,
          description: "Encrypted team environment variable synchronizer with zero leak risk.",
          language: "Rust",
          link: "https://github.com/riya-kapoor/env-sync",
        },
      ],
    },
  },
  {
    id: "flux-db",
    rank: 10,
    name: "flux-db",
    fullName: "arjun-nair/flux-db",
    tagline: "Embedded append-only time-series database engine with bit-packing compression.",
    description:
      "An ultra-fast time-series storage engine written in Go. Uses Gorilla delta-of-delta timestamp compression and XOR floating-point encoding to store 10M telemetry points in under 12MB of RAM.",
    highlights: [
      "Gorilla delta-of-delta compression achieving 12:1 reduction in disk footprint",
      "Memory-mapped WAL (write-ahead log) ensuring zero data loss on abrupt termination",
      "PromQL-compatible minimal query language parser",
      "Single binary zero-dependency embedded database",
    ],
    stars: 248,
    forks: 20,
    openIssues: 1,
    license: "MIT",
    version: "v0.8.0",
    week: "Week 03",
    dateRange: "July 6 — July 13, 2026",
    growth: "+22 stars this week",
    languages: [
      { name: "Go", percent: 91.5, color: "#00add8" },
      { name: "Shell", percent: 8.5, color: "#89e051" },
    ],
    tags: ["Database", "Go", "TimeSeries", "Storage"],
    githubUrl: "https://github.com/arjun-nair/flux-db",
    demoUrl: "https://github.com/arjun-nair/flux-db#benchmarks",
    curatorReview:
      "Arjun implemented compression algorithms from academic papers into a clean, practical Go database library.",
    curatorAuthor: "JODC Systems Track",
    builder: {
      name: "Arjun Nair",
      handle: "arjun-nair",
      role: "Backend & Systems Hacker (3rd Year CSE)",
      campus: "JIIT — Sector 128 (Batch of 2026)",
      avatarText: "AN",
      bio: "Focuses on storage engines, LSM-trees, time-series compression, and high-concurrency Go internals.",
      quote:
        "Compression algorithms are like origami for bytes. Understanding bit manipulation unlocks orders-of-magnitude efficiency.",
      status: "Exploring columnar storage formats",
      github: "https://github.com/arjun-nair",
      twitter: "https://x.com/arjun_nair_dev",
      linkedin: "https://linkedin.com/in/arjun-nair-cs",
      portfolio: "https://arjunnair.dev",
      badges: ["Featured Contributor", "Go Specialist", "Database Track"],
      metrics: {
        commits: "480+",
        totalStars: "360+",
        mergedPRs: "17",
        activeYears: "1.5 years",
      },
      skills: ["Go", "C++", "LSM-Trees", "Bit Manipulation", "Storage Engines"],
      otherProjects: [
        {
          name: "bit-packer",
          stars: 76,
          description: "SIMD bit-packing library for integer arrays in Go.",
          language: "Go",
          link: "https://github.com/arjun-nair/bit-packer",
        },
      ],
    },
  },
  {
    id: "sniff-rs",
    rank: 11,
    name: "sniff-rs",
    fullName: "sanya-malhotra/sniff-rs",
    tagline: "Cross-platform terminal packet sniffer and DNS latency analyzer.",
    description:
      "A lightweight terminal packet inspector with zero C dependencies. Decodes IPv4, IPv6, TCP, UDP, and DNS packets in real time with visual protocol breakdown graphs and PCAP exports.",
    highlights: [
      "Pure Rust packet parsing pipeline with zero libpcap shared library dependency",
      "Interactive Ratatui terminal dashboard showing live DNS resolution latencies",
      "Built-in hex packet viewer with ASCII payload decoding",
      "Cross-platform support across macOS, Linux, and Windows",
    ],
    stars: 215,
    forks: 19,
    openIssues: 1,
    license: "MIT",
    version: "v0.9.1",
    week: "Week 02",
    dateRange: "June 29 — July 6, 2026",
    growth: "+19 stars this week",
    languages: [
      { name: "Rust", percent: 94.8, color: "#dea584" },
      { name: "Shell", percent: 5.2, color: "#89e051" },
    ],
    tags: ["Networking", "Rust", "CLI", "Security"],
    githubUrl: "https://github.com/sanya-malhotra/sniff-rs",
    demoUrl: "https://github.com/sanya-malhotra/sniff-rs",
    curatorReview:
      "Sanya created a sleek alternative to Wireshark for the command line with zero external C dependencies.",
    curatorAuthor: "JODC Security SIG",
    builder: {
      name: "Sanya Malhotra",
      handle: "sanya-malhotra",
      role: "Security & Systems Developer (4th Year CSE)",
      campus: "JIIT — Sector 128 (Batch of 2025)",
      avatarText: "SM",
      bio: "Focuses on network protocol reverse engineering, Rust systems programming, and terminal observability utilities.",
      quote:
        "Every network packet tells a story. Writing tools to inspect raw traffic is the best way to understand the internet.",
      status: "Graduating & building OSS network tools",
      github: "https://github.com/sanya-malhotra",
      twitter: "https://x.com/sanya_sec",
      linkedin: "https://linkedin.com/in/sanya-malhotra",
      portfolio: "https://sanyamalhotra.dev",
      badges: ["Featured Contributor", "Rust Developer", "Network Security"],
      metrics: {
        commits: "620+",
        totalStars: "490+",
        mergedPRs: "25",
        activeYears: "2 years",
      },
      skills: ["Rust", "Network Protocols", "Wireshark", "C", "Linux"],
      otherProjects: [
        {
          name: "dns-probe",
          stars: 68,
          description: "DNS propagation and latency benchmark tool for CLI.",
          language: "Rust",
          link: "https://github.com/sanya-malhotra/dns-probe",
        },
      ],
    },
  },
  {
    id: "algo-viz",
    rank: 12,
    name: "algo-viz",
    fullName: "kunal-singhania/algo-viz",
    tagline: "Interactive 3D graph algorithms and memory hierarchy visualizer.",
    description:
      "An interactive pedagogical WebGL playground for visualizing Dijkstra, A*, CPU cache line invalidations, and tree rebalancing with step-by-step memory inspection in the browser.",
    highlights: [
      "Real-time 3D graph animation rendering 10,000 nodes at 60fps with Three.js",
      "Interactive step-by-step memory pointer and stack frame inspector",
      "Custom graph import from Graphviz DOT and JSON formats",
      "Offline-capable PWA with zero telemetry",
    ],
    stars: 192,
    forks: 17,
    openIssues: 0,
    license: "MIT",
    version: "v1.0.0",
    week: "Week 01",
    dateRange: "June 22 — June 29, 2026",
    growth: "+24 stars this week",
    languages: [
      { name: "TypeScript", percent: 86.4, color: "#3178c6" },
      { name: "GLSL", percent: 13.6, color: "#5686a5" },
    ],
    tags: ["Visualization", "WebGL", "Algorithms", "Education"],
    githubUrl: "https://github.com/kunal-singhania/algo-viz",
    demoUrl: "https://algo-viz-jodc.vercel.app",
    curatorReview:
      "Kunal kicked off Week 01 of the JODC spotlight series with a dazzling 3D algorithm visualizer used by hundreds of juniors.",
    curatorAuthor: "JODC Review Council",
    builder: {
      name: "Kunal Singhania",
      handle: "kunal-singhania",
      role: "Creative Developer (3rd Year IT)",
      campus: "JIIT — Sector 128 (Batch of 2026)",
      avatarText: "KS",
      bio: "Passionate about computer science education, interactive 3D graphics with WebGL, and developer visualizers.",
      quote:
        "When concepts can be seen and manipulated in 3D, learning complex algorithms becomes intuitive and joyful.",
      status: "Building educational graphics tools",
      github: "https://github.com/kunal-singhania",
      twitter: "https://x.com/kunal_codes",
      linkedin: "https://linkedin.com/in/kunal-singhania",
      portfolio: "https://kunalsinghania.me",
      badges: ["Inaugural Spotlight", "Creative Developer", "JODC Core Member"],
      metrics: {
        commits: "540+",
        totalStars: "310+",
        mergedPRs: "21",
        activeYears: "2 years",
      },
      skills: ["TypeScript", "Three.js", "WebGL", "React", "GLSL"],
      otherProjects: [
        {
          name: "shader-matrix",
          stars: 58,
          description: "Interactive browser matrix math visualizer in WebGL.",
          language: "TypeScript",
          link: "https://github.com/kunal-singhania/shader-matrix",
        },
      ],
    },
  },
];

export const SUBMISSION_DETAILS = {
  formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfaN2yTdH5qX6q5zY1VUkLhmwc7fRpOjF8Ph_CuGY8dSkd5Tw/viewform?usp=dialog",
  guidelines: [
    "Public repository hosted on GitHub, GitLab, or Codeberg.",
    "Clear and informative README explaining the project, problem solved, and setup instructions.",
    "Standard open-source license (MIT, Apache-2.0, BSD, GPL, MPL).",
    "Built or maintained by students or active community builders.",
    "Working code or prototype ready for community review.",
  ],
  perks: [
    "Featured at the top of JODC community platforms and campus developer network",
    "Spotlighted across club announcements, Discord, and social channels",
    "Gain stars, code reviews, and potential contributors from peers and seniors",
    "Permanent listing in the JODC Campus Leaderboard and Hall of Fame",
  ],
};
