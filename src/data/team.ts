/**
 * The team roster, from the JODC site data form. Add yourself here — drop a
 * square face crop in public/team/ and a 3:4 photo in public/team/full/.
 * Leave a social link out and its button is hidden. A group with nobody in it
 * is left off the page.
 */

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  /** Square, face-centred crop for the small thumbnails. */
  image: string;
  /** Full 3:4 photo for the featured card; falls back to `image`. */
  photo?: string;
  /** Custom CSS object-position for the thumbnail avatar. */
  imagePosition?: string;
  /** Custom CSS object-position for the featured photo card. */
  photoPosition?: string;
  instagram?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
  portfolio?: string;
};

const GROUP_ORDER = ["Mentors", "Team Leads", "Core Team"] as const;
export type TeamGroup = (typeof GROUP_ORDER)[number];

const PLACEHOLDER = "/team/jodc-placeholder.png";

export const TEAM: Record<TeamGroup, TeamMember[]> = {
  Mentors: [],
  "Team Leads": [
    {
      name: "Surya Pratap Singh",
      role: "AI/ML Lead",
      bio: "Spending more time on the things you find more difficult is how an average mind becomes a great mind.",
      image: "/team/surya-pratap-singh.jpg",
      photo: "/team/full/surya-pratap-singh.jpg",
      github: "https://github.com/spsi-gh",
      linkedin: "https://www.linkedin.com/in/suryayy/",
      discord: "https://discord.com/users/901776578386726943",
    },
    {
      name: "Ujwal Parashar",
      role: "Cloud & DevOps Lead",
      bio: "Shipping code smoothly, scaling cloud infrastructure, and fostering open-source culture.",
      image: "/team/ujwal-parashar.jpg",
      photo: "/team/full/ujwal-parashar.jpg",
      github: "https://github.com/ujwal262006",
      linkedin: "https://www.linkedin.com/in/ujwal-parashar-3195a735a/",
      instagram: "https://www.instagram.com/ujwalparashar_jansewak/",
    },
    {
      name: "Namya Jain",
      role: "Creative Lead",
      bio: "Just a girl making imagination a little prettier 🤍🎀",
      image: "/team/namya-jain.jpg",
      photo: "/team/full/namya-jain.jpg",
      github: "https://github.com/namyjain06",
      linkedin: "https://www.linkedin.com/in/namya-jain29/",
      instagram: "https://www.instagram.com/namyaa.29/",
      discord: "https://discord.com/users/991724684536184852",
    },
    {
      name: "Shourya Singh",
      role: "Representatives Lead",
      bio: "Professional GitHub account stalker.",
      image: "/team/shourya-singh.jpg",
      photo: "/team/full/shourya-singh.jpg",
      github: "https://github.com/Shourya523",
      linkedin: "https://www.linkedin.com/in/shourya-singh-297297358/",
      instagram: "https://www.instagram.com/shour.ya_124/",
    },
  ],
  "Core Team": [
    {
      name: "Vardaan Saxena",
      role: "Core Team",
      bio: "I always build something that I keep wishing someone would make for me.",
      image: "/team/vardaan-saxena.jpg",
      photo: "/team/full/vardaan-saxena.jpg",
      imagePosition: "object-[center_35%]",
      photoPosition: "object-[center_20%]",
      github: "https://github.com/simplyvardaan",
      linkedin: "https://www.linkedin.com/in/vardaan-saxena-b4b4a4365/",
      portfolio: "https://vardaansaxena.tech/",
    },
    {
      name: "Avni Porwal",
      role: "Core Team",
      bio: "Chaos, but cute.",
      image: "/team/avni-porwal.jpg",
      photo: "/team/full/avni-porwal.jpg",
      github: "https://github.com/avniporwal8929-create",
      linkedin: "https://www.linkedin.com/in/avni-porwal-1974a5379",
    },
    {
      name: "Hardik Bhagtani",
      role: "Core Team",
      bio: "Stay hungry, stay foolish.",
      image: "/team/hardik-bhagtani.jpg",
      photo: "/team/full/hardik-bhagtani.jpg",
      github: "https://github.com/hardik2007",
      linkedin: "https://www.linkedin.com/in/hardik-bhagtani-17a6b4201/",
      instagram: "https://www.instagram.com/hardik.bhagtani.07/",
    },
    {
      name: "Pradyumna Verma",
      role: "Core Team",
      bio: "Have a nice day.",
      image: "/team/pradyumna-verma.jpg",
      photo: "/team/full/pradyumna-verma.jpg",
      github: "https://github.com/SniperScript",
      linkedin: "https://www.linkedin.com/in/pradyumna-verma-99ab35270",
      instagram: "https://www.instagram.com/v.pradyumna/",
      discord: "https://discord.com/users/1410537440560545815",
    },
    {
      name: "Atharv Parihar",
      role: "Core Team",
      bio: "Nerdy enough.",
      image: "/team/atharv-parihar.jpg",
      photo: "/team/full/atharv-parihar.jpg",
      github: "https://github.com/Atharvparihar11",
      linkedin: "https://www.linkedin.com/in/atharv-parihar-003964374",
      instagram: "https://www.instagram.com/real__atharv/",
    },
    {
      name: "Tanush Mishra",
      role: "Core Team",
      bio: "Turning emotions off, for better efficiency.",
      image: PLACEHOLDER,
      github: "https://github.com/tanushmishra",
      linkedin: "https://www.linkedin.com/in/tanush-mishra-b808462a9/",
      instagram: "https://www.instagram.com/realtanush/",
      discord: "https://discord.com/users/742217476514775111",
    },
    {
      name: "Shreya Sharma",
      role: "Core Team",
      bio: "Make it happen.",
      image: "/team/shreya-sharma.jpg",
      photo: "/team/full/shreya-sharma.jpg",
      github: "https://github.com/shreyasharma577",
      linkedin: "https://www.linkedin.com/in/shreya-sharma-0176293a5/",
      instagram: "https://www.instagram.com/shreya._.sharma/",
    },
    {
      name: "Niharika Chauhan",
      role: "Core Team",
      bio: "Curious by choice, confused by default.",
      image: "/team/niharika-chauhan.jpg",
      photo: "/team/full/niharika-chauhan.jpg",
      github: "https://github.com/niha72019",
      linkedin: "https://www.linkedin.com/in/niharika-chauhan-68574b33a/",
      instagram: "https://www.instagram.com/nix_72019/",
    },
    {
      name: "Avni Singhal",
      role: "Core Team",
      bio: "Fueled by coffee and curiosity.",
      image: "/team/avni-singhal.jpg",
      photo: "/team/full/avni-singhal.jpg",
      github: "https://github.com/avnisinghal0206-arch",
      linkedin: "https://www.linkedin.com/in/avni-singhal-aaa714389",
    },
    {
      name: "Kavya Pandey",
      role: "Core Team",
      bio: "I like cats.",
      image: "/team/kavya-pandey.jpg",
      photo: "/team/full/kavya-pandey.jpg",
      github: "https://github.com/Kavoyaa",
      linkedin: "https://www.linkedin.com/in/kav-pandey",
      instagram: "https://www.instagram.com/_kavya.pandey/",
    },
    {
      name: "Urvi Mullick",
      role: "Core Team",
      bio: "Driven by curiosity, defined by growth.",
      image: "/team/urvi-mullick.jpg",
      photo: "/team/full/urvi-mullick.jpg",
      github: "https://github.com/Urvi1408",
      linkedin: "https://www.linkedin.com/in/urvi-mullick-375064375",
      instagram: "https://www.instagram.com/urvimullick/",
    },
    {
      name: "Raghav Sharma",
      role: "Core Team",
      bio: "With great power comes great responsibility; with ambition comes discipline, and with discipline comes greatness.",
      image: "/team/raghav-sharma.jpg",
      photo: "/team/full/raghav-sharma.jpg",
      github: "https://github.com/RAGHAV4056",
      linkedin: "https://www.linkedin.com/in/raghav-sharma-9a2729358",
      instagram: "https://www.instagram.com/raghavsharma732/",
      discord: "https://discord.com/users/1281620651102179403",
    },
    {
      name: "Tulika Agarwal",
      role: "Core Team",
      bio: "Always learning. Always evolving.",
      image: "/team/tulika-agarwal.jpg",
      photo: "/team/full/tulika-agarwal.jpg",
      github: "https://github.com/Tulika-gif",
      linkedin: "https://www.linkedin.com/in/tulika-agarwal-b90b9b3a6/",
    },
    {
      name: "Paarth Sachdeva",
      role: "Core Team",
      bio: "Not defined by where he stands, but by how relentlessly he moves forward.",
      image: "/team/paarth-sachdeva.jpg",
      photo: "/team/full/paarth-sachdeva.jpg",
      github: "https://github.com/paarthsachdeva2",
      linkedin: "https://www.linkedin.com/in/paarth-sachdeva-5933232b1",
      instagram: "https://www.instagram.com/paarthsachdeva_.30/",
    },
    {
      name: "Gajanan Ji Sarvesh",
      role: "Core Team",
      bio: "Why So Serious?",
      image: "/team/gajanan-ji-sarvesh.jpg",
      photo: "/team/full/gajanan-ji-sarvesh.jpg",
      github: "https://github.com/8BitsLife",
      linkedin: "https://www.linkedin.com/in/gajanan-ji-sarvesh-9883203a1/",
      discord: "https://discord.com/users/1448322525074297014",
    },
  ],
};

/** Groups shown on the page, in order — empty ones are skipped. */
export const TEAM_GROUPS = GROUP_ORDER.filter((g) => TEAM[g].length > 0);
