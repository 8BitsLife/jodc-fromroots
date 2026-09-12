export interface HackathonTrack {
  id: string;
  title: string;
  shortTitle: string;
  tag: string;
  icon: string;
  tagline: string;
  description: string;
  challenges: string[];
  suggestedStack: string[];
}

export interface TimelineEvent {
  phase: string;
  title: string;
  date: string;
  time: string;
  status: "completed" | "active" | "upcoming";
  description: string;
  highlight?: string;
}

export interface PrizeTier {
  place: string;
  badge: string;
  amount: string;
  perks: string[];
  isPrimary?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const HACKATHON_DETAILS = {
  name: "ROOTS '26",
  edition: "Annual Campus Flagship",
  tagline: "Think. Build. Ship.",
  subtext:
    "36 hours of relentless engineering at JIIT-128. Turn ambitious technical ideas into working software alongside the best builders on campus.",
  date: "October 17 – 18, 2026",
  duration: "36 Hours Live",
  venue: "JIIT-128 Campus, Innovation Hub & Audi",
  teamSize: "2 – 4 Builders",
  prizePool: "₹1,00,000+",
  status: "REGISTRATIONS OPEN",
  registrationUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfaN2yTdH5qX6q5zY1VUkLhmwc7fRpOjF8Ph_CuGY8dSkd5Tw/viewform?usp=dialog",
  guideUrl: "https://github.com/8BitsLife/jodc-fromroots",
};

export const HACKATHON_TRACKS: HackathonTrack[] = [
  {
    id: "ai-systems",
    title: "AI & Agentic Systems",
    shortTitle: "AI / Agents",
    tag: "#AI-Systems",
    icon: "Cpu",
    tagline: "Next-generation intelligence and autonomous agentic workflows.",
    description:
      "Push beyond basic prompt wrappers. Build multi-agent orchestration engines, local SLM inference tools, real-time multimodal agents, or domain-adapted retrieval pipelines.",
    challenges: [
      "Autonomous tool-calling agents for complex engineering pipelines",
      "Low-latency on-device speech/vision models for edge hardware",
      "Vector search optimizations and hybrid reranking mechanisms",
    ],
    suggestedStack: ["Python", "Rust", "Ollama", "LangChain/LangGraph", "FastAPI"],
  },
  {
    id: "high-perf",
    title: "High-Performance Systems & Web Engines",
    shortTitle: "Systems & Web",
    tag: "#Systems",
    icon: "Zap",
    tagline: "Extreme throughput, low-latency protocols, and native performance.",
    description:
      "Design systems where microseconds count: custom memory allocators, lock-free ring buffers, WebAssembly compilation targets, or high-concurrency event loops.",
    challenges: [
      "In-memory caching engines with SIMD-accelerated key lookups",
      "Custom binary communication protocols over WebTransport/QUIC",
      "Real-time state synchronization engines for collaborative apps",
    ],
    suggestedStack: ["Rust", "Go", "C++", "WebAssembly", "Tokio"],
  },
  {
    id: "fintech-security",
    title: "Fintech, Security & Decentralized Tools",
    shortTitle: "Fintech & Sec",
    tag: "#Fintech",
    icon: "Shield",
    tagline: "Cryptographic verification, fraud telemetry, and transparent ledgers.",
    description:
      "Build resilient financial infrastructure, privacy-preserving zero-knowledge proofs, real-time transaction monitoring, or open automated auditing frameworks.",
    challenges: [
      "High-throughput ledger reconciliation with zero-knowledge proofs",
      "Anomaly detection and latency profiling in micro-payment rails",
      "Decentralized identity verification with tamper-proof signatures",
    ],
    suggestedStack: ["TypeScript", "Solidity/Rust", "zk-SNARKs", "PostgreSQL", "Docker"],
  },
  {
    id: "healthtech",
    title: "HealthTech & Assistive Technologies",
    shortTitle: "HealthTech",
    tag: "#Health",
    icon: "HeartPulse",
    tagline: "Technology that enhances accessibility, diagnostics, and well-being.",
    description:
      "Bridge clinical technology and patient accessibility. Build telemetry dashboards, assistive interfaces for disabled users, or edge sensor networks.",
    challenges: [
      "Real-time computer vision for non-intrusive accessibility assistance",
      "Secure federated medical data analytics preserving patient privacy",
      "Emergency alert and medical triage routing systems for campuses",
    ],
    suggestedStack: ["React", "Python", "TensorFlow Lite", "WebRTC", "Tailwind CSS"],
  },
  {
    id: "sustainability",
    title: "Smart Infra & Sustainable Engineering",
    shortTitle: "Smart Infra",
    tag: "#GreenTech",
    icon: "Leaf",
    tagline: "Data-driven climate monitoring, grid efficiency, and smart cities.",
    description:
      "Solve resource conservation through code: energy grid simulation, compute carbon footprint profiling, campus sensor grids, or automated logistics optimization.",
    challenges: [
      "Real-time compute energy efficiency profiler for developer servers",
      "Intelligent transit routing and ride-pooling algorithms for students",
      "IoT sensor mesh for campus environmental monitoring and anomaly detection",
    ],
    suggestedStack: ["Go", "MQTT", "TimescaleDB", "Leaflet/MapLibre", "Node.js"],
  },
  {
    id: "open-innovation",
    title: "Open Innovation & Developer Tools",
    shortTitle: "DevTools",
    tag: "#OpenSource",
    icon: "Terminal",
    tagline: "Radical developer utilities, campus apps, and wild open-source ideas.",
    description:
      "Got an insane idea that breaks convention? Build developer CLI tools, browser execution sandboxes, student community platforms, or developer workflow extensions.",
    challenges: [
      "Interactive code review bots with AST analysis and security linting",
      "Lightweight terminal dashboards for monitoring local containers",
      "Peer-to-peer file sharing and dev-environment syncing on local Wi-Fi",
    ],
    suggestedStack: ["Any language", "Tauri/Electron", "Vite", "Open Source APIs"],
  },
];

export const HACKATHON_TIMELINE: TimelineEvent[] = [
  {
    phase: "01",
    title: "Registrations & Track Announcement",
    date: "Sept 15, 2026",
    time: "10:00 AM",
    status: "active",
    description: "Team registrations open on campus. Problem track themes and mentors revealed.",
    highlight: "Registrations Live",
  },
  {
    phase: "02",
    title: "Idea Submission & Shortlisting",
    date: "Oct 10, 2026",
    time: "11:59 PM",
    status: "upcoming",
    description: "Submit your team proposal and selected track challenge for mentor screening.",
  },
  {
    phase: "03",
    title: "Kickoff & 36h Hacking Begins",
    date: "Oct 17, 2026",
    time: "09:00 AM",
    status: "upcoming",
    description: "Opening keynote, badge check-in, desk allocation, and hacking begins officially.",
    highlight: "T = 0 Hacking Starts",
  },
  {
    phase: "04",
    title: "Midnight Mentor Sprint & Demos",
    date: "Oct 17, 2026",
    time: "11:30 PM",
    status: "upcoming",
    description: "One-on-one architecture review with industry mentors and alumni engineers.",
  },
  {
    phase: "05",
    title: "Code Freeze & Final Commits",
    date: "Oct 18, 2026",
    time: "06:00 PM",
    status: "upcoming",
    description: "GitHub repositories locked for commit evaluation and automated CI checks.",
  },
  {
    phase: "06",
    title: "Live Stage Pitching & Grand Finale",
    date: "Oct 18, 2026",
    time: "08:00 PM",
    status: "upcoming",
    description: "Top 10 teams present live demos on the main auditorium stage. Winners announced.",
    highlight: "Podium & Awards",
  },
];

export const PRIZE_TIERS: PrizeTier[] = [
  {
    place: "1st Place Champion",
    badge: "Gold Trophy",
    amount: "₹50,000",
    isPrimary: true,
    perks: [
      "Direct Cash Prize credited to team",
      "$2,000 Cloud & GPU credits",
      "JODC Incubator Fellowship fast-track",
      "Exclusive Champion Mechanical Keyboards",
      "Official Winner Plaque & Certificates",
    ],
  },
  {
    place: "2nd Place Runner Up",
    badge: "Silver Trophy",
    amount: "₹30,000",
    perks: [
      "Direct Cash Prize credited to team",
      "$1,000 Cloud credits per member",
      "JetBrains All Products 1-Year Licenses",
      "Premium Hardware Dev Kits",
      "Winner Certificate & Swag Kits",
    ],
  },
  {
    place: "3rd Place Podium",
    badge: "Bronze Trophy",
    amount: "₹15,000",
    perks: [
      "Direct Cash Prize credited to team",
      "$500 Cloud credits per member",
      "Pro domain vouchers for 2 years",
      "JODC Merch Hoodies & Goodie Pack",
      "Official Certificate of Excellence",
    ],
  },
  {
    place: "Best Freshers Squad",
    badge: "Rising Stars",
    amount: "₹10,000",
    perks: [
      "Exclusively for 1st/2nd year teams",
      "1-on-1 mentorship for GSoC & Outreachy",
      "Sponsored developer peripheral bundle",
      "Special Recognition Certificate",
    ],
  },
];

export const JUDGING_RUBRIC = [
  {
    title: "Technical Depth & Craft",
    weight: "30%",
    description: "System architecture, code elegance, test coverage, and tackling non-trivial engineering problems.",
  },
  {
    title: "Originality & Innovation",
    weight: "25%",
    description: "Uniqueness of approach. Avoiding boilerplate templates and building genuine creative solutions.",
  },
  {
    title: "Real-World Practicality",
    weight: "25%",
    description: "Viability of the solution. Can it actually be deployed and solve problems for real end-users?",
  },
  {
    title: "Live Working Prototype",
    weight: "20%",
    description: "A stable, deployed demonstration on stage without simulated mocks or slide-only promises.",
  },
];

export const HACKATHON_FAQS: FAQItem[] = [
  {
    question: "Who is eligible to participate?",
    answer:
      "All undergraduate and postgraduate students enrolled in college are eligible. Inter-college teams and multidisciplinary squads (e.g. developers + designers) are actively encouraged.",
  },
  {
    question: "What is the team size requirement?",
    answer:
      "Teams can consist of 2 to 4 members. Solo participation is not permitted to encourage collaborative building and peer pair programming.",
  },
  {
    question: "Is there any registration fee?",
    answer:
      "Zero fee. ROOTS is completely free of charge. Food, snacks, energy drinks, high-speed campus Wi-Fi, and workstations are provided for all shortlisted hackathon participants.",
  },
  {
    question: "Can we use pre-existing projects or libraries?",
    answer:
      "You may use open-source libraries, APIs, and frameworks. However, the core project, architecture, and code must be authored during the 36-hour hackathon window. Commits are audited via GitHub history.",
  },
  {
    question: "What should we bring to the venue?",
    answer:
      "Laptops, chargers, extension cords, valid student ID cards, and any hardware/microcontrollers required for your project. Comfortable sleeping gear if you plan to stay overnight.",
  },
  {
    question: "How does project evaluation work?",
    answer:
      "All projects must be pushed to a public GitHub repository before the code freeze. Top teams will present a 4-minute live working demonstration followed by a 2-minute Q&A with the judging panel.",
  },
];
