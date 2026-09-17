# JODC — landing page

Landing page for **JODC**, the open source development club of JIIT-128.

Built with **React 18 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion + Supabase** — a stack
most people on campus already know, so contributing here is a first pull request, not a
research project.

## Run it

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables (optional for local mock data, required for live DB)
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, and GITHUB_TOKEN

# 3. Start development server
npm run dev
```

Open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Types only, no build |
| `npm run sync:github` | Sync live star counts, forks, issues & languages from GitHub to Supabase |
| `npm run add:repo -- <url>` | Admin CLI tool to fetch GitHub metadata and add a new project |

## Where things live

```
src/
  data/site.ts        ← all copy, links and lists (edit this first)
  data/team.ts        ← club team roster, roles, bios, and portraits
  data/repoOfTheWeek.ts ← fallback spotlight projects and submission guidelines
  components/         ← one file per section + shared bits
  components/repo-of-the-week/ ← Repo of the Week spotlight, leaderboard, and submission modal
  components/ui/      ← shadcn-style primitives; drop-in components land here
  hooks/              ← useRepoOfTheWeek, reduced-motion, and media queries
  services/           ← Supabase data layer (repoService)
  lib/                ← framework-free helpers (supabase client, backdrop generator)
  index.css           ← design tokens, keyframes, base styles
supabase/
  full_setup.sql      ← complete 1-click database schema, RLS policies, and seed data
scripts/
  sync-github.mjs     ← GitHub REST API sync worker
  add-repo.mjs        ← Admin CLI tool to import any GitHub repository into Supabase
```

`@/` is aliased to `src/` (vite + tsconfig), so `@/components/ui/x` and
`@/lib/x` work exactly as they do in a shadcn project. Keep third-party or
generated components in `components/ui/` and our own sections one level up.

## Repo of the Week & Supabase Backend

The **Repo of the Week** feature spotlights trending open-source projects built by campus students and prolific creators:

- **Live Database**: Powered by Supabase PostgreSQL with Row Level Security (RLS). Approved projects and spotlight history are queried in real time with zero-flash fallback to local data when offline.
- **In-App Project Submissions**: Students can submit their GitHub repositories directly through the modal on the site. All submissions land in the `public.submissions` table for review by the JODC council.
- **Automated GitHub Metrics Sync**: `scripts/sync-github.mjs` calls the GitHub REST API using `GITHUB_TOKEN` to update live stars, forks, issues, language breakdown percentages, and latest releases in Supabase.
- **Daily Auto-Sync**: `.github/workflows/sync-repos.yml` automatically executes the sync worker every night at midnight UTC via GitHub Actions.

### Adding a New Project (Admin)

To add a project to the Leaderboard:
```bash
npm run add:repo -- https://github.com/owner/project
```

To feature it as the active Repo of the Week:
```bash
npm run add:repo -- https://github.com/owner/project --spotlight "Week 08" "Sept 21 — Sept 28, 2026"
```

## Design system

Straight from the logo — nothing else was invented:

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#08080a` | Page background |
| `ink-soft` | `#0e0e12` | Raised sections, cards |
| `bone` | `#f5f5f4` | Primary text |
| `ash` | `#8b8b96` | Secondary text |
| `flame` | `#ff7a1a` | The one accent — CTAs, active state, highlights |

Type: **Space Grotesk** for headings, **Inter** for body, **JetBrains Mono** for anything
that looks like a command. Spacing follows a 4/8px rhythm; radii are `rounded-2xl` for
cards and `rounded-full` for controls.

House rules if you are adding UI:

- One accent colour. If everything is orange, nothing is.
- Motion must mean something — entrances, state changes, spatial continuity. No decoration
  for its own sake, and keep micro-interactions in the 150–300ms range.
- Animate `transform` and `opacity` only.
- Touch targets ≥ 44px, visible focus rings, text contrast ≥ 4.5:1.
- Use Lucide icons, never emoji, as UI icons.

## Hero backdrop

The hero runs `components/ui/interactive-blur-reveal` (Hyperiux Vault): a WebGL2
shader that frosts an image and clears it along the cursor trail, refreezing
behind it. `components/HeroBackdrop.tsx` decides whether to run it at all.

- The artwork is generated at runtime in `lib/backdrop-textures.ts` — ink ground,
  flame blooms, grid, commit-graph constellation, club mark — so nothing about it
  ships as an image asset.
- The shader only runs for a fine pointer, with motion allowed, on a real GPU.
  Touch, `prefers-reduced-motion`, software renderers, and any machine that misses
  the frame budget over the first 90 frames get the same artwork rendered sharp and static.
- It renders at 0.7x device pixel ratio (`resolutionScale`).

## The written line

`components/ScrollStroke.tsx` is the act-break after the hero: one flowing line starts
at the end of "The rest follow.", writes **Open Source** in Ephesis (OFL) as you
scroll, and runs on into the flame block above the wordmark.

The letters are the font's real outlines, not a drawn imitation. Each glyph is revealed
through an SVG mask in which a fat stroke travels along the glyph's outer contour from
its entry point, so the letter appears the way a pen would write it.

## Accessibility and motion

- Every animation is gated behind `prefers-reduced-motion`: CSS keyframes are neutralised
  in `index.css`, and Framer Motion is wrapped in `<MotionConfig reducedMotion="user">`.
- The hero backdrop shader never starts for reduced-motion visitors, and when it does run it
  pauses entirely once the hero scrolls off-screen or the tab is hidden.
- Skip link, labelled icon buttons, keyboard-reachable navigation, `aria-current` on the
  active nav item.

## Contributing

1. Branch: `git switch -c feat/your-thing`
2. Keep `npm run build` green (it type-checks first).
3. Open a PR describing what changed and, for visual work, a before/after screenshot.
