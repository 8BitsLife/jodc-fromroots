/**
 * The team roster. Add yourself here — drop a square photo in public/team/
 * and point `image` at it. Leave a social link out and its button is hidden.
 */

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
};

export const TEAM_GROUPS = ["Mentors", "Team Leads", "Core Team"] as const;
export type TeamGroup = (typeof TEAM_GROUPS)[number];

const PLACEHOLDER = "/team/jodc-placeholder.png";

export const TEAM: Record<TeamGroup, TeamMember[]> = {
  Mentors: [
    {
      name: "JODC Mentor",
      role: "Mentor",
      bio: "Guidance, code reviews, architecture discussions and the occasional push to ship what you started.",
      image: PLACEHOLDER,
    },
    {
      name: "JODC Mentor",
      role: "Mentor",
      bio: "Helping contributors turn questions into practical open-source contributions.",
      image: PLACEHOLDER,
    },
    {
      name: "JODC Mentor",
      role: "Mentor",
      bio: "Sharing engineering experience and helping students navigate real repositories.",
      image: PLACEHOLDER,
    },
  ],
  "Team Leads": [
    {
      name: "Vaibhav Katariya",
      role: "Tech Lead",
      bio: "Trust me, I'm a software engineer ^_^",
      image: "/team/vaibhav.jpg",
      instagram: "https://www.instagram.com/acevaibhav/",
      linkedin: "https://www.linkedin.com/in/vaibhav-katariya/",
      github: "https://github.com/VaibhavKatariya",
    },
    {
      name: "JODC Team Lead",
      role: "Team Lead",
      bio: "Leading people, projects and the small decisions that keep open-source work moving.",
      image: PLACEHOLDER,
    },
    {
      name: "JODC Team Lead",
      role: "Team Lead",
      bio: "Building a culture where contributors can learn by shipping together.",
      image: PLACEHOLDER,
    },
    {
      name: "JODC Team Lead",
      role: "Team Lead",
      bio: "Coordinating initiatives and turning good ideas into things people can use.",
      image: PLACEHOLDER,
    },
    {
      name: "JODC Team Lead",
      role: "Team Lead",
      bio: "Keeping the team curious, collaborative and close to the code.",
      image: PLACEHOLDER,
    },
  ],
  "Core Team": [
    {
      name: "JODC Core Member",
      role: "Core Team",
      bio: "Helping run the community, events and systems behind the club.",
      image: PLACEHOLDER,
    },
    {
      name: "JODC Core Member",
      role: "Core Team",
      bio: "Making sessions, collaborations and contributor experiences better every week.",
      image: PLACEHOLDER,
    },
    {
      name: "JODC Core Member",
      role: "Core Team",
      bio: "Building the details that make the community feel like a place to belong.",
      image: PLACEHOLDER,
    },
    {
      name: "JODC Core Member",
      role: "Core Team",
      bio: "Contributing to the systems, content and culture that keep JODC moving.",
      image: PLACEHOLDER,
    },
  ],
};
