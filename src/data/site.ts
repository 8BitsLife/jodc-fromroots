import type { LucideIcon } from "lucide-react";
import {
  Mic,
  Wrench,
  Users,
  GitPullRequest,
  Handshake,
} from "lucide-react";

/**
 * Everything a contributor might want to edit lives here.
 * Touch this file to update copy — the components read from it.
 */

export const SITE = {
  name: "JODC",
  longName: "JIIT-128 Open Source Development Club",
  campus: "JIIT — Sector 128, Noida",
  tagline: "Open source is a culture. We are building it on campus.",
  intro:
    "JODC is an initiative by the students of JIIT-128 to promote open source culture. The hub is all about contributing to and collaborating on projects, networking, learning together and guiding students.",
  mission:
    "We encourage students to volunteer for open source projects and organisations, and to take part in initiatives like Google Summer of Code and Outreachy — to become better developers, and for the betterment of open source itself.",
} as const;

export const LINKS = {
  instagram: "https://www.instagram.com/jodc128/",
  github: "https://github.com/JIITODC",
  linkedin: "https://www.linkedin.com/company/jodc/",
  discord: "#join",
  email: "mailto:jodc@jiit.ac.in",
} as const;

export type NavItem = { label: string; href: string };

export const NAV: NavItem[] = [
  { label: "About", href: "#about" },
  { label: "What we do", href: "#what-we-do" },
  { label: "Contribute", href: "#contribute" },
  { label: "Events", href: "#events" },
  { label: "Programs", href: "#programs" },
  { label: "Hackathon", href: "#hackathon" },
  { label: "Join", href: "#join" },
];

export type Activity = {
  title: string;
  body: string;
  icon: LucideIcon;
  /** Tailwind grid span classes — drives the bento rhythm. */
  span: string;
  accent?: boolean;
};

export const ACTIVITIES: Activity[] = [
  {
    title: "Dev-sprints",
    body: "Three hours, one room, everyone shipping. You pick an issue, pair up with someone who already knows the codebase, and open the pull request before we pack up.",
    icon: GitPullRequest,
    span: "md:col-span-2 md:row-span-2",
    accent: true,
  },
  {
    title: "Talks",
    body: "Maintainers, alumni and seniors on what actually happens inside a repository other people depend on.",
    icon: Mic,
    span: "md:col-span-2",
  },
  {
    title: "Workshops",
    body: "Git internals, reading a codebase you did not write, tests, review etiquette. Laptops stay open the whole time.",
    icon: Wrench,
    span: "md:col-span-2",
  },
  {
    title: "One-to-one sessions",
    body: "A senior sits down with you and your terminal, and stays there until the first contribution is in.",
    icon: Users,
    span: "md:col-span-2",
  },
  {
    title: "Networking",
    body: "Contributors, mentors and past GSoC participants across campus who answer when you message them.",
    icon: Handshake,
    span: "md:col-span-2",
  },
];

export type Step = {
  index: string;
  title: string;
  body: string;
};

export const CONTRIBUTE_STEPS: Step[] = [
  {
    index: "01",
    title: "Show up",
    body: "Come to a talk or a dev-sprint. There is no prerequisite beyond curiosity, and first-years are welcome.",
  },
  {
    index: "02",
    title: "Pick an issue",
    body: "We help you find a good-first-issue in a project that is actually alive and reviews patches.",
  },
  {
    index: "03",
    title: "Open the PR",
    body: "Branch, commit, push, get reviewed, do it again. This unglamorous loop is the thing that turns you into a developer.",
  },
  {
    index: "04",
    title: "Go further",
    body: "Keep contributing, become a regular, then apply to GSoC or Outreachy with a real track record.",
  },
];

export type Program = {
  name: string;
  org: string;
  window: string;
  body: string;
  href: string;
};

export const PROGRAMS: Program[] = [
  {
    name: "Google Summer of Code",
    org: "Google Open Source",
    window: "Proposals open early each year",
    body: "A global program pairing contributors with open source organisations for a funded coding project. We run proposal reviews, org shortlisting and mock evaluations.",
    href: "https://summerofcode.withgoogle.com/",
  },
  {
    name: "Outreachy",
    org: "Software Freedom Conservancy",
    window: "Two cohorts every year",
    body: "Paid internships in open source for people subject to systemic bias in tech. We help with the contribution period, which is where most applications are won or lost.",
    href: "https://www.outreachy.org/",
  },
  {
    name: "Hacktoberfest & campus sprints",
    org: "Community-run",
    window: "October, and whenever we feel like it",
    body: "A low-stakes way in. Good for a first merged pull request, and for finding the people you will keep building with.",
    href: "https://hacktoberfest.com/",
  },
];

export type ClubEvent = {
  title: string;
  /** Short, human date — shown in mono caps. */
  date: string;
  place: string;
  body: string;
};

export const UPCOMING_EVENTS: ClubEvent[] = [
  {
    title: "Orientation",
    date: "Aug 2026",
    place: "JIIT · Sector 128",
    body: "An introduction to JODC, open source, the community and your first contribution path.",
  },
  {
    title: "Roadmap",
    date: "Sep 2026",
    place: "Workshop Hall",
    body: "A practical session covering web development, DSA, GitHub workflows and internship-ready projects.",
  },
  {
    title: "Git & GitHub",
    date: "Oct 2026",
    place: "JIIT · Open Lab",
    body: "Hands-on Git, pull requests, code review and a guided first contribution sprint.",
  },
];

/** Past events, keyed by academic year, newest first. */
export const PAST_EVENTS: Record<string, ClubEvent[]> = {
  "2025–26": [
    {
      title: "Orientation",
      date: "2025–26",
      place: "JIIT · Sector 128",
      body: "A first look at the club, our open-source community and the paths students can take with JODC.",
    },
  ],
  "2024–25": [
    {
      title: "Roadmap",
      date: "2024–25",
      place: "JIIT · Workshop Hall",
      body: "A practical roadmap through development, competitive programming, DSA and internship preparation.",
    },
  ],
  "2023–24": [
    {
      title: "Git & GitHub",
      date: "2023–24",
      place: "JIIT · Open Lab",
      body: "A hands-on introduction to Git, GitHub workflows and the habits behind a good first contribution.",
    },
  ],
};

export const TICKER = [
  "git commit -m \"first contribution\"",
  "open source",
  "code review",
  "good first issue",
  "pair programming",
  "GSoC",
  "dev-sprint",
  "Outreachy",
  "upstream",
  "merge conflicts (survivable)",
  "JIIT-128",
] as const;
