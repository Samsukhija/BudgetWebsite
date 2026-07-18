---
title: "budgetwebsite.store — Immersive 3D Redesign ('The Build')"
status: approved-direction, ready for implementation planning
date: 2026-07-18
owner: Lekhraj (decision-maker); implementation by a later Claude Opus/Sonnet session
depends_on: site-revamp branch content (multi-page structure, pricing data, portfolio-data.js, code.gs forms)
supersedes: the visual system (§4) of 2026-07-17-budgetwebsite-site-revamp-design.md — content/structure decisions there still stand
---

# Immersive 3D Redesign — Design Spec

## 0. Why this exists (context for the implementing session)

The 2026-07-17 revamp (branch `site-revamp`, commits `5c7af00`..`6be6f1c`) rebuilt budgetwebsite.store as a clean but deliberately static multi-page site (cream/terracotta, "Warm Trustworthy Local Studio"). Lekhraj reviewed it and rejected the aesthetic as bland/basic for THIS site specifically: **this is the agency's own showcase** — its job is to make a BNI Mumbai member think "if they can build this, imagine what they'll build for me." Showing off is the pitch. The site must demonstrate capability through immersive 3D and motion.

Key decisions already made by Lekhraj (do NOT re-litigate):
1. **Full immersive 3D** (not a single 3D hero moment, not motion-only).
2. **Scope:** flagship immersive single-scroll HOME + 3D-accented but fully usable `/portfolio/` and `/pricing/` sub-pages (forms and cards must stay functional; Samar shares /pricing/ as a direct link).
3. **Hero shows capabilities, NOT the live sites.** Portfolio proof (the real client sites) appears further down the landing page. The earlier concept of floating portfolio screenshots in the hero was explicitly rejected.
4. **Palette: "Deep-space indigo + electric gradient"** (option 1 of 3). The cream/terracotta palette is rejected entirely — kill it everywhere, including sub-pages, favicon/logo, and OG assets.
5. All CONTENT from the revamp stays: pricing tiers ₹15k/30k/50k/75k+ with the re-scoped feature lists, 7-entry portfolio, 15 AI tools "Coming Soon" grid, terms/AMC copy, quote + brief forms posting to the same Apps Script backend, catalogue link to https://website-project-liart.vercel.app, .store domain, sitemap/robots.

## 1. Visual system — "Deep Space"

Design language reference points: Linear, Stripe, Vercel marketing pages. Modern, premium, alive.

**Color tokens** (replace the entire `:root` palette in `styles.css`):
- `--bg-deep: #0A0A1A` (near-black indigo, page ground)
- `--bg-raised: #12122A` (panels/cards)
- `--glass: rgba(255,255,255,0.06)` with `backdrop-filter: blur(16px)` and 1px `rgba(255,255,255,0.12)` border (glassmorphism surfaces)
- Electric gradient (the brand accent, used as light + as text gradient):
  `--grad-a: #7C3AED` (violet) → `--grad-b: #3B82F6` (blue) → `--grad-c: #EC4899` (magenta)
- `--text-hi: #F8FAFC`, `--text-mid: #B4B8C5`, `--text-dim: #6E7280`
- Success/positive accents: use gradient stops, not green.
- WCAG: body text must hit 4.5:1 on `--bg-deep` (the tokens above do; verify any new derived shades).

**Type:** keep Fraunces (display serif) — it contrasts beautifully against tech-dark and stays ownable vs. the Inter-only crowd; body stays Inter. Display headlines get the electric gradient via `background-clip: text` sparingly (hero H1 + section titles only).

**Motion language:** slow cinematic camera drift, springy scroll-triggered reveals (GSAP ScrollTrigger), magnetic hover on CTAs, gradient hue slowly cycling (~30s loop) so the page feels alive at rest. Respect `prefers-reduced-motion`: static gradient, no camera motion, instant reveals.

**Brand assets:** regenerate favicon-16/32, logo-192/512, logo-instagram-dp, logo.svg — same "b" monogram concept but on an indigo tile with the electric gradient (either gradient-filled "b" on `--bg-deep`, or white "b" on a gradient tile — implementer picks whichever reads better at 16px and shows both for approval).

## 2. Tech stack

- **three.js** for WebGL scenes (import via CDN ESM or vendored file — site stays no-build-step static; do NOT introduce a bundler/framework for this).
- **GSAP + ScrollTrigger** for scroll choreography and DOM animation (CDN).
- Optional: the `hyperframes` skill's patterns for scroll-scene structure if useful, but no hard dependency.
- Keep pages as plain HTML files; 3D/motion code in new shared JS files (`scene-home.js`, `motion.js`), palette in rewritten `styles.css`. `portfolio-data.js` and the Apps Script contract are unchanged.

**Performance budget & fallback (hard requirements):**
- Total JS (three.js + GSAP + scenes) < 600KB gzipped; textures/models < 1.5MB total; target 60fps desktop, 30fps+ mid-range Android.
- Device-tier gate at load: if `navigator.hardwareConcurrency <= 4`, no WebGL context, WebGL context-creation failure, or `prefers-reduced-motion` → serve the **static fallback**: same layout/copy with the animated CSS gradient background only (no three.js). The fallback IS the mobile-data-friendly version; it must look intentional, not broken.
- Lazy-init each 3D scene via IntersectionObserver; destroy/pause scenes when off-screen (`visibilitychange` + observer exit).
- All text is real DOM (SEO/a11y) — never baked into canvas.

## 3. Home page — "The Build" (single immersive scroll)

Replaces current index.html content-structure 1:1 (same copy blocks unless noted) with five acts:

**Act 1 — Hero (capabilities, no portfolio screenshots).** Full-viewport three.js scene: an abstract "website being assembled" — glowing wireframe panels, floating UI primitives (nav bars, buttons, cards as glass slabs), particles and gradient light volumes, slowly converging as if a site is constructing itself. Mouse/gyro parallax. Copy overlay (DOM): eyebrow "REAL WEBSITES · REAL FAST", H1 "Websites that look expensive. Priced fair." (gradient text), sub + two CTAs (unchanged copy). Scroll indicator.

**Act 2 — Capabilities ("What we build").** NEW section replacing the flat "Why Us" trio: as the user scrolls, the hero's floating primitives snap into 4 capability panels — E-commerce & Payments / Booking & Lead Systems / AI-Powered Tools / One-Day Delivery — each a glass card with a micro-animation inside (e.g. a tiny cart pulse, a calendar flip). Copy for the 3 existing "why" points folds into these cards; keep "How It Works" 3-step strip below as a horizontal scroll-pinned sequence.

**Act 3 — Proof (portfolio, moved DOWN per Lekhraj).** "Recent Builds" — the 7 real sites from `portfolio-data.js` rendered as a 3D device-wall (tilted glass screens in perspective, draggable/scrollable carousel, click-through to live sites). Uses existing screenshots as textures. "See all our work →" links to /portfolio/.

**Act 4 — Pricing teaser.** The 4 tier cards rise/stagger in as lit glass cards (same data/copy as current teaser incl. re-scoped features). Link to /pricing/.

**Act 5 — Contact.** Convergence moment: scene particles collapse into the WhatsApp CTA button glow. Footer unchanged in content (Blog · Portfolio · See What's Possible · ©) restyled to palette.

## 4. Sub-pages — 3D-accented, fully functional

`/portfolio/`: dark palette restyle + the device-wall treatment for the 7 cards (or a lighter tilt-on-hover 3D card effect if the wall is too heavy for a second page); everything clickable; h1 stays.
`/pricing/`: dark palette restyle; tier cards get glass + gradient-edge lighting and tilt-on-hover; 15-tool grid gets staggered reveal + "Coming Soon" badges restyled; **quote form stays plain, high-contrast, zero 3D interference**; terms/AMC restyled only.
`/blog/` + post + `form2.html`: palette restyle only (no 3D) — keep them fast and readable; form2 field markup/IDs/script untouched.

## 5. What must NOT regress (carry-forward checklist for the implementer)

- No `budgetwebsite.in`, no 30-day/waitlist copy, no `#8DC63F`/green, and now also **no `#C1522E`/terracotta/`#FAF5EE` cream** anywhere in final source (grep-sweep gate).
- Sitemap/robots/canonicals/OG-Twitter meta on all 5 routes; JSON-LD offers stay ₹15k/30k/50k/75k+; refresh `og:image` to a new dark-palette share card (this time make it a proper rich card, not just the logo tile).
- Both forms post the same payloads (`form: 'quote'` / `'brief'`) to the existing SCRIPT_URL; verify success-state swap still works.
- Font-size accessibility toggle (A+) preserved on all pages; heading hierarchy (one h1/page) preserved; keyboard focus states on the dark palette.
- The "Budget Website" portfolio thumbnail must be re-shot AFTER the redesign ships (it currently shows the cream design; a dark-site screenshot keeps the portfolio honest).
- Local verification per the revamp plan's Task 9 pattern: grep sweeps + route 200s + Playwright screenshots at desktop and 375px, PLUS: fallback-mode screenshot (force `prefers-reduced-motion`), and a scroll-through screencap of the home acts.

## 6. Out of scope

- The AI tools dashboard build (separate spec: 2026-07-18-ai-tools-dashboard-design.md).
- Any change to the 18×4 catalogue site itself (separate deploy; already linked).
- Re-pricing discussions (₹15k/30k/50k/75k+ is settled on-site; Samar sign-off is a business task, not this build).
- Deployment — build lands on a branch off `site-revamp`; merge/deploy remains Lekhraj's explicit call.

## 7. Definition of "done" for the implementing session

A reviewer opening the local site cold should: (1) see a hero that demonstrates capability through motion within 2s on desktop, (2) scroll through five distinct acts without jank, (3) reach every function (forms, links, catalogue, WhatsApp) without fighting the 3D, (4) get a clean, intentional static experience on a low-end/reduced-motion device, and (5) find zero traces of the cream/terracotta or older palettes. Screenshots/screencap proof required, not just code review.
