# JODC — landing page

Landing page for **JODC**, the open source development club of JIIT-128.

Built with **React 18 + TypeScript + Vite + Tailwind CSS v4 + Framer Motion** — a stack
most people on campus already know, so contributing here is a first pull request, not a
research project.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | Types only, no build |

## Where things live

```
src/
  data/site.ts        ← all copy, links and lists (edit this first)
  components/         ← one file per section + shared bits
  components/ui/      ← shadcn-style primitives; drop-in components land here
  hooks/              ← reduced-motion and pointer-type media queries
  lib/                ← framework-free helpers (e.g. backdrop texture generator)
  index.css           ← design tokens, keyframes, base styles
```

`@/` is aliased to `src/` (vite + tsconfig), so `@/components/ui/x` and
`@/lib/x` work exactly as they do in a shadcn project. Keep third-party or
generated components in `components/ui/` and our own sections one level up —
that split is what lets a component be re-pulled or upgraded later without
anyone having to guess which files are ours.

**Changing text, links or activities does not require touching a component** —
everything readable is in `src/data/site.ts`. The GitHub and email links in there are
placeholders marked with a `TODO`; point them at the club's real accounts.

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
  ships as an image asset. The upstream component's ~250KB base64 default photo
  and its CDN-hosted noise texture are both replaced by that generator.
- The shader only runs for a fine pointer, with motion allowed, on a real GPU.
  Touch, `prefers-reduced-motion`, software renderers (SwiftShader/llvmpipe), and
  any machine that misses the frame budget over the first 90 frames get the same
  artwork rendered sharp and static instead.
- It renders at 0.7x device pixel ratio (`resolutionScale`). The image is blurred;
  nobody can see the difference, and it is roughly half the fragment work.

## The written line

`components/ScrollStroke.tsx` is the act-break after the hero: one flowing line starts
at the end of "The rest follow.", writes **Open Source** in Ephesis (OFL) as you
scroll, and runs on into the flame block above the wordmark.

The letters are the font's real outlines, not a drawn imitation. Each glyph is revealed
through an SVG mask in which a fat stroke travels along the glyph's outer contour from
its entry point, so the letter appears the way a pen would write it. `data/stroke-word.ts`
is generated — outlines, entry/exit points, and a per-glyph `outbound` fraction (how far
along the contour the letter is fully covered, measured by rasterising it). To change
the word, re-run the generator scripts kept alongside this project's scratch tooling
(`outline.cjs` then `outbound.cjs`) with a different string; don't hand-edit the data.

Both ends of the line are anchored to real text and rebuilt on resize, so it holds on
every viewport.

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

Good first issues: replace the placeholder stats in `src/data/site.ts` with real numbers,
add a team/alumni section, wire the events list to a real source.
