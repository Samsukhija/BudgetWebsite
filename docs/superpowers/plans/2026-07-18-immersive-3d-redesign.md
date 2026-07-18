# Immersive 3D Redesign ("The Build" / Deep Space) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild budgetwebsite.store as an immersive 3D showcase — five-act scroll-story home (three.js + GSAP), Deep Space indigo/electric-gradient palette everywhere, 3D-accented but fully functional sub-pages — per the spec at `docs/superpowers/specs/2026-07-18-immersive-3d-redesign-design.md`. Read that spec FIRST; its §5 carry-forward checklist and §7 definition-of-done are binding.

**Architecture:** Still a no-build static site. One rewritten `styles.css` (same class names, new custom-property names) restyles every page at once. New JS: `js/perf-gate.js` (device tier), `js/motion.js` (GSAP reveals/tilt), `js/scene-home.js` (three.js hero + scroll choreography). Vendored libs in `vendor/` (no CDN dependency at runtime). All copy/data/forms/SEO from the `site-revamp` branch carry over unchanged unless a task says otherwise.

**Tech Stack:** three.js (pinned r160+), GSAP 3 + ScrollTrigger, plain HTML/CSS/JS, Playwright (already in `Website Project/node_modules`) for screenshots/verification, Python http.server for local serving.

**Working rules for every task:** Work from `C:\Users\kasar\Documents\Website Project\budgetwebsite-store` on branch `redesign-3d`. Paste ACTUAL raw command output in reports — never expected output. If a file doesn't match what a step describes, STOP and disclose before improvising. Never `git add` `code.gs`/`admin.html` (gitignored by design).

---

### Task 1: Branch + vendored libraries + device-tier gate

**Files:**
- Create: `vendor/three.module.min.js`, `vendor/gsap.min.js`, `vendor/ScrollTrigger.min.js`, `js/perf-gate.js`

- [ ] **Step 1: Create branch**
```bash
git checkout site-revamp && git checkout -b redesign-3d && git branch --show-current
```
Expected: `redesign-3d`

- [ ] **Step 2: Vendor the libraries (pinned versions)**
```bash
mkdir -p vendor js
curl -sL -o vendor/three.module.min.js https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js
curl -sL -o vendor/gsap.min.js https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js
curl -sL -o vendor/ScrollTrigger.min.js https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js
ls -la vendor/
```
Expected: three files, three.module.min.js ~600-700KB raw (~150KB gzipped), gsap ~70KB, ScrollTrigger ~40KB. If any download is an HTML error page (check with `head -2`), STOP and report.

- [ ] **Step 3: Create `js/perf-gate.js`**
```js
// Device-tier gate. Runs before any scene code. Sets <html data-tier="full|static">.
// "static" = animated CSS gradient only, no WebGL. This IS the intentional mobile/low-end experience.
window.BW_TIER = (function () {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'static';
    if ((navigator.hardwareConcurrency || 0) > 0 && navigator.hardwareConcurrency <= 4) return 'static';
    var c = document.createElement('canvas');
    var gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return 'static';
    return 'full';
  } catch (e) { return 'static'; }
})();
document.documentElement.setAttribute('data-tier', window.BW_TIER);
```

- [ ] **Step 4: Verify + commit**
```bash
node -e "const s=require('fs').readFileSync('js/perf-gate.js','utf8'); new Function(s); console.log('parses OK')"
git add vendor js/perf-gate.js && git commit -m "feat: vendor three.js+GSAP, add device-tier perf gate"
```
Expected: `parses OK`, clean commit.

---

### Task 2: Deep Space `styles.css` rewrite + variable-name sweep

**Files:**
- Modify: `styles.css` (full rewrite, same class names)
- Modify: `index.html`, `portfolio/index.html`, `pricing/index.html`, `blog/index.html`, `blog/why-small-businesses-in-india-need-a-website.html`, `form2.html` (variable-name sweep in inline styles + local `<style>` blocks only)

- [ ] **Step 1: Failing check**
```bash
grep -c "C1522E" styles.css
```
Expected: non-zero (terracotta still present).

- [ ] **Step 2: Rewrite `styles.css`**

Replace the whole file. Keep EVERY existing class name (nav, hero-*, how-*, why-*, portfolio-*, price-*, terms-box, tool-*, badge-soon, quote-*, cta-*, footer, gallery-link, section-*, btn-*, font-toggle-btn, nav-blog-link) so page markup keeps working. New `:root`:

```css
:root {
  --bg-deep: #0A0A1A;
  --bg-raised: #12122A;
  --glass: rgba(255,255,255,0.06);
  --glass-border: rgba(255,255,255,0.12);
  --grad-a: #7C3AED;
  --grad-b: #3B82F6;
  --grad-c: #EC4899;
  --accent: #8B5CF6;          /* solid fallback where a single color is needed */
  --accent-deep: #6D28D9;
  --accent-dim: rgba(139,92,246,0.14);
  --text-hi: #F8FAFC;
  --text-mid: #B4B8C5;
  --text-dim: #8A8FA3;        /* checked: 4.6:1 on --bg-deep */
  --border: rgba(255,255,255,0.10);
  --font-scale: 1;
}
```

Systematic translation of the old theme (apply to every rule in the current file):
- `background: var(--cream)` → `var(--bg-deep)`; `--cream-alt`/`--card` → `var(--bg-raised)` (cards additionally get `background: var(--glass); backdrop-filter: blur(16px); border: 1px solid var(--glass-border);`)
- text `--ink` → `--text-hi`, `--ink-soft` → `--text-mid`, `--muted` → `--text-dim`
- every `--terracotta*` accent → `--accent*`; CTA buttons (`.btn-primary`, `.nav-cta`, `.btn-quote`, `.cta-contact`, featured `.price-cta`) get `background: linear-gradient(120deg, var(--grad-a), var(--grad-b), var(--grad-c)); background-size: 200% 200%; color: #fff;` with hover shifting `background-position` (transition 0.4s) and a soft glow `box-shadow: 0 0 24px rgba(124,58,237,0.35)`
- `.section-title .accent` and `.hero-headline .accent`: gradient text — `background: linear-gradient(120deg,var(--grad-a),var(--grad-b),var(--grad-c)); -webkit-background-clip: text; background-clip: text; color: transparent;`
- `--indigo`/`--indigo-dim` (badge-soon) → `color: var(--grad-b); background: rgba(59,130,246,0.12);`
- form inputs: `background: var(--bg-raised); border: 1px solid var(--border); color: var(--text-hi);` focus border `var(--accent)` + `box-shadow: 0 0 0 3px var(--accent-dim)`
- keep all layout/spacing/responsive/media-query rules byte-identical; keep Fraunces/Inter font stack rules unchanged

Append these NEW blocks at the end:

```css
/* ── DEEP SPACE ADDITIONS ── */
.grad-bg {
  position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(60% 50% at 20% 10%, rgba(124,58,237,0.20), transparent 60%),
    radial-gradient(50% 40% at 80% 20%, rgba(59,130,246,0.16), transparent 60%),
    radial-gradient(50% 50% at 60% 90%, rgba(236,72,153,0.12), transparent 60%),
    var(--bg-deep);
}
[data-tier="full"] .grad-bg { animation: hueDrift 30s linear infinite; }
@keyframes hueDrift { 0%,100% { filter: hue-rotate(0deg); } 50% { filter: hue-rotate(24deg); } }
@media (prefers-reduced-motion: reduce) { .grad-bg { animation: none !important; } }

#scene-canvas { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
[data-tier="static"] #scene-canvas { display: none; }
.act { position: relative; z-index: 1; }

.reveal { opacity: 0; transform: translateY(28px); }
[data-tier="static"] .reveal, .no-js .reveal { opacity: 1; transform: none; }

.tilt-card { transform-style: preserve-3d; will-change: transform; transition: transform 0.15s ease-out; }

/* Act 3 device-wall (CSS 3D — keeps cards clickable/accessible) */
.device-wall { perspective: 1200px; display: flex; gap: 28px; overflow-x: auto; padding: 24px 8px 40px; scroll-snap-type: x mandatory; }
.device-wall .portfolio-card { flex: 0 0 320px; scroll-snap-align: center; transform: rotateY(-14deg); transition: transform 0.35s; }
.device-wall .portfolio-card:hover { transform: rotateY(0deg) translateZ(30px); }
@media (max-width: 600px) { .device-wall .portfolio-card { flex-basis: 260px; } }
```

- [ ] **Step 3: Variable-name sweep across HTML (inline styles + local style blocks)**
```bash
python3 - <<'EOF'
import re
files = ['index.html','portfolio/index.html','pricing/index.html','blog/index.html',
         'blog/why-small-businesses-in-india-need-a-website.html','form2.html']
m = {'--terracotta-deep':'--accent-deep','--terracotta-dim':'--accent-dim','--terracotta':'--accent',
     '--cream-alt':'--bg-raised','--cream':'--bg-deep','--card':'--bg-raised',
     '--ink-soft':'--text-mid','--ink-faint':'--text-dim','--ink':'--text-hi','--muted':'--text-dim'}
for f in files:
    s = open(f, encoding='utf-8').read()
    for old, new in m.items(): s = s.replace(old, new)
    open(f, 'w', encoding='utf-8').write(s)
    print('swept', f)
EOF
```
(Ordering in `m` matters: longer names first so `--terracotta-deep` is replaced before `--terracotta`, `--ink-soft` before `--ink`.)

- [ ] **Step 4: Verify**
```bash
grep -rn "C1522E\|FAF5EE\|F3EAD9\|9C3F22\|8DC63F\|--terracotta\|--cream\|--ink" styles.css index.html portfolio/index.html pricing/index.html blog/ form2.html || echo "CLEAN"
grep -c "grad-a" styles.css
```
Expected: `CLEAN`, then ≥1. Also serve locally and eyeball every route renders dark with readable text:
```bash
python -m http.server 4821 &>/dev/null & sleep 1
for r in / /portfolio/ /pricing/ /blog/ /form2.html; do curl -o /dev/null -s -w "$r %{http_code}\n" http://localhost:4821$r; done
```
Expected: all 200. Screenshot spot-check `/pricing/` with Playwright (dark cards, readable).

- [ ] **Step 5: Commit**
```bash
git add styles.css index.html portfolio/index.html pricing/index.html blog/ form2.html
git commit -m "feat: Deep Space palette — rewrite styles.css, sweep var names site-wide"
```

---

### Task 3: `js/motion.js` — reveals, tilt, reduced-motion

**Files:**
- Create: `js/motion.js`
- Modify: all 6 HTML pages (add script tags; add `.reveal` classes per Task 4/7)

- [ ] **Step 1: Create `js/motion.js`**
```js
// Shared motion utilities. Requires gsap + ScrollTrigger already loaded (classic scripts).
(function () {
  if (window.BW_TIER === 'static' || typeof gsap === 'undefined') {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.style.opacity = 1; el.style.transform = 'none';
    });
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Scroll reveals: any .reveal element animates in when 80% into view.
  gsap.utils.toArray('.reveal').forEach(function (el) {
    gsap.fromTo(el, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true }
    });
  });

  // Stagger groups: container with [data-stagger] animates its children.
  gsap.utils.toArray('[data-stagger]').forEach(function (group) {
    gsap.fromTo(group.children, { opacity: 0, y: 24 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08,
      scrollTrigger: { trigger: group, start: 'top 78%', once: true }
    });
  });

  // Tilt-on-hover: any .tilt-card
  document.querySelectorAll('.tilt-card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      var rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
      var ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
      card.style.transform = 'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  });
})();
```

- [ ] **Step 2: Wire scripts into every page** — before `</body>` (adjust `../` for sub-dirs), order matters:
```html
<script src="js/perf-gate.js"></script>
<script src="vendor/gsap.min.js"></script>
<script src="vendor/ScrollTrigger.min.js"></script>
<script src="js/motion.js"></script>
```
On blog pages and form2.html include ONLY perf-gate + gsap + ScrollTrigger + motion (no scene). Move perf-gate to `<head>` (it must set data-tier before first paint): `<script src="js/perf-gate.js"></script>` as the last head element on all 6 pages.

- [ ] **Step 3: Verify + commit**
```bash
node -e "const s=require('fs').readFileSync('js/motion.js','utf8'); new Function(s); console.log('parses OK')"
grep -l "perf-gate.js" index.html portfolio/index.html pricing/index.html blog/index.html blog/why-small-businesses-in-india-need-a-website.html form2.html
git add js/motion.js index.html portfolio/index.html pricing/index.html blog/ form2.html
git commit -m "feat: shared motion system (reveals, stagger, tilt) wired into all pages"
```
Expected: parses OK; all 6 files listed.

---

### Task 4: Home page — five-act DOM restructure + static fallback

**Files:**
- Modify: `index.html` (restructure body; head/meta/JSON-LD unchanged except adding `<div class="grad-bg"></div>` + `<canvas id="scene-canvas"></canvas>` as first body children)

Rebuild the body as five `<section class="act" id="act-N">` blocks. Content mapping (copy carries over verbatim from current file unless noted):

1. `#act-hero` — existing hero copy block (eyebrow/H1/sub/2 CTAs) centered over the canvas; REMOVE the `.hero-photo` laptop image entirely (spec: no site screenshots in hero). Add `<div class="scroll-hint" aria-hidden="true">↓</div>`.
2. `#act-capabilities` — NEW section replacing the "Why Us" trio, `<div class="why-grid" data-stagger>` with FOUR `.why-card.tilt-card` glass cards:
   - **E-commerce & Payments** — "Full online stores with payment gateways, carts, and order management — built to sell from day one."
   - **Booking & Lead Systems** — "Appointment booking, enquiry funnels, and WhatsApp-first lead capture that turn visitors into customers."
   - **AI-Powered Tools** — "GST invoicing, review replies, content writers — business tools that remove daily busywork." (links `/pricing/#tools` — add `id="tools"` to the tools-section div in pricing/index.html)
   - **One-Day Delivery** — "Design, build, content, and hosting in a single session. You watch it happen live."
   Keep the existing "How It Works" 3-card strip below it (add `data-stagger`).
3. `#act-proof` — "Recent Builds": replace `.portfolio-grid` teaser with `<div class="device-wall" id="portfolio-teaser"></div>` rendering ALL 7 entries (`renderPortfolioCards(PORTFOLIO_ENTRIES)` — full list now, it scrolls horizontally). Keep "See all our work →".
4. `#act-pricing` — existing 4-tier teaser cards, each gains `tilt-card` class, grid gets `data-stagger`.
5. `#act-contact` — existing CTA band + footer, unchanged copy.

Every section keeps its `h1/h2` hierarchy (one `h1`, in the hero). Add `class="reveal"` to each section's heading block.

- [ ] **Step 1: Failing check** — `grep -c "hero-photo" index.html` → currently ≥1.
- [ ] **Step 2: Apply the restructure** (surgical edits, not a from-scratch rewrite — preserve head, JSON-LD, footer, font-toggle + portfolio-data script blocks).
- [ ] **Step 3: Verify**
```bash
grep -c "hero-photo" index.html; grep -c "act-hero\|act-capabilities\|act-proof\|act-pricing\|act-contact" index.html; grep -c "<h1" index.html
```
Expected: `0`, `5`, `1`. Serve + Playwright-screenshot desktop and 375px; confirm all five acts present, no horizontal body overflow, cards render as glass on dark.
- [ ] **Step 4: Commit** — `git add index.html pricing/index.html && git commit -m "feat: five-act home structure, capabilities hero section, device-wall proof"`

---

### Task 5: `js/scene-home.js` — three.js hero + scroll choreography

**Files:**
- Create: `js/scene-home.js`
- Modify: `index.html` (add `<script type="module" src="js/scene-home.js"></script>` last)

Scene requirements (implementer has creative latitude on exact compositions, but these are binding):
- Only runs when `window.BW_TIER === 'full'`; otherwise exits immediately (fallback = `.grad-bg` alone, already styled).
- **Act 1 composition:** 24–40 thin translucent slabs (BoxGeometry ~1.6×1×0.04, `MeshStandardMaterial` with `transparent:true, opacity:0.16–0.3, roughness:0.2, metalness:0.6`) + 600–1000 particle `Points`, lit by 3 colored `PointLight`s using `--grad-a/b/c` hexes. Slow camera dolly (z eases 9→7 over 12s loop) + pointer parallax (±0.4 rad lerped). Fog `new THREE.Fog(0x0A0A1A, 8, 18)`.
- **Scroll choreography (GSAP ScrollTrigger scrub across the five acts):** slabs drift apart + camera pulls back through `#act-capabilities`; particles fade by `#act-proof` (canvas is `pointer-events:none` and visually recedes — DOM device-wall takes over); by `#act-contact` all slab opacity → 0.04 and a single gradient glow concentrates behind the CTA (a large soft `Sprite` or radial-gradient plane scaled up).
- Renderer: `antialias:false`, `setPixelRatio(Math.min(devicePixelRatio, 2))`, `setClearColor(0x000000, 0)`. Pause rendering (cancel RAF) when `document.hidden` or when hero+acts are fully out of viewport (IntersectionObserver on `body > .act` union — simplest: observe `#act-contact`'s end sentinel; resume on re-entry).
- Import three from `./vendor/three.module.min.js` via module script; GSAP is already global.

- [ ] **Step 1: Write the scene** (~200-300 lines, structured: `init()`, `buildSlabs()`, `buildParticles()`, `buildLights()`, `bindScroll()`, `bindPointer()`, `tick()`).
- [ ] **Step 2: Syntax check** — `node --input-type=module -e "$(cat js/scene-home.js | sed 's|./vendor/three.module.min.js|three|')"` is NOT runnable without three; instead: `node -e "require('fs').readFileSync('js/scene-home.js','utf8'); console.log('read OK')"` plus Playwright console-error check below.
- [ ] **Step 3: Live verify (the real test)**
```bash
# serve, then:
node - <<'EOF'
const { chromium } = require('C:/Users/kasar/Documents/Website Project/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e))); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  await p.goto('http://localhost:4821/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  const tier = await p.evaluate(() => document.documentElement.dataset.tier);
  const fps = await p.evaluate(() => new Promise(res => { let n=0; const t0=performance.now();
    (function f(){ n++; performance.now()-t0<2000 ? requestAnimationFrame(f) : res(n/2); })(); }));
  console.log('tier:', tier, '| fps:', fps, '| console errors:', errs.length ? errs : 'none');
  await p.screenshot({ path: '/tmp/hero-3d.png' });
  // scroll through all acts, screenshot each
  for (const id of ['act-capabilities','act-proof','act-pricing','act-contact']) {
    await p.evaluate(i => document.getElementById(i).scrollIntoView({behavior:'instant'}), id);
    await p.waitForTimeout(900);
    await p.screenshot({ path: '/tmp/' + id + '.png' });
  }
  await b.close();
})();
EOF
```
Expected: tier `full`, fps ≥ 45, zero console errors, 5 screenshots showing the acts. READ the screenshots (don't just check they exist). If headless GL reports tier `static`, note it and verify `full` manually via the Browser pane instead.
- [ ] **Step 4: Reduced-motion fallback verify** — relaunch with `chromium.launch()` + `p.emulateMedia({ reducedMotion: 'reduce' })`, assert tier `static`, screenshot: gradient background, all content visible, no canvas.
- [ ] **Step 5: Commit** — `git add js/scene-home.js index.html && git commit -m "feat: three.js hero scene + five-act scroll choreography"`

---

### Task 6: Sub-page 3D accents

**Files:**
- Modify: `portfolio/index.html` — wrap the grid: give `#portfolio-full`'s container the `device-wall` class on desktop only if it stays usable; otherwise add `tilt-card` to each card via one line in the render call site: after `innerHTML = renderPortfolioCards(...)`, run `document.querySelectorAll('#portfolio-full .portfolio-card').forEach(c => c.classList.add('tilt-card'))`. Grid gets `data-stagger`.
- Modify: `pricing/index.html` — each `.price-card` gets `tilt-card`; `.pricing-grid` and each `.tool-grid` get `data-stagger`. The quote form gets NOTHING (binding: zero motion/3D on the form itself).
- Blog + form2: no changes beyond what Tasks 2–3 already applied.

- [ ] **Step 1: Apply** the class/attribute additions.
- [ ] **Step 2: Verify** — serve; Playwright: `/portfolio/` cards clickable (click first card → expect popup/navigation to live site — use `page.waitForEvent('popup')`), `/pricing/` quote form fill + `submitQuote()` success-state still swaps (same test as revamp Task 9), both pages screenshot clean at 375px.
- [ ] **Step 3: Commit** — `git add portfolio/index.html pricing/index.html && git commit -m "feat: 3D accents on sub-pages, forms untouched"`

---

### Task 7: Brand assets — indigo/gradient logo set + rich OG card

**Files:**
- Modify (regenerate): `favicon-16.png`, `favicon-32.png`, `logo-192.png`, `logo-512.png`, `logo-instagram-dp.png`, `logo.svg`
- Create: `og-card.png` (1200×630)
- Modify: og:image/twitter:image meta in `index.html`, `portfolio/index.html`, `pricing/index.html`, `blog/index.html`, blog post

- [ ] **Step 1: Regenerate logo set** — adapt the Playwright tile-generator used on 2026-07-18 (session history: terracotta version): tile `background: linear-gradient(135deg,#7C3AED,#3B82F6 55%,#EC4899)`, white Fraunces-900 "b", radius 22%. Same filenames. At 16px verify the "b" still reads (screenshot-zoom check); if muddy, use solid `#12122A` tile with gradient "b" instead — pick whichever reads better and note the choice.
- [ ] **Step 2: `logo.svg`** — same composition as chosen PNG direction, using an SVG `<linearGradient>`.
- [ ] **Step 3: Rich OG card** — Playwright 1200×630 page: `--bg-deep` ground, `.grad-bg`-style radial glows, gradient "b" tile top-left, Fraunces headline "Websites that look expensive. Priced fair." + "budgetwebsite.store · Built in a day" in `--text-mid`. Save `og-card.png`.
- [ ] **Step 4: Point all `og:image`/`twitter:image` at `https://www.budgetwebsite.store/og-card.png`** (5 files; keep `logo-512.png` only in the JSON-LD publisher logo of the blog post).
- [ ] **Step 5: Verify + commit**
```bash
python3 -c "from PIL import Image; [print(f, Image.open(f).size) for f in ['favicon-16.png','favicon-32.png','logo-192.png','logo-512.png','og-card.png']]" 2>/dev/null || ls -la favicon-16.png favicon-32.png logo-192.png logo-512.png og-card.png
grep -rc "og-card.png" index.html portfolio/index.html pricing/index.html blog/index.html blog/why-small-businesses-in-india-need-a-website.html
git add favicon-16.png favicon-32.png logo-192.png logo-512.png logo-instagram-dp.png logo.svg og-card.png index.html portfolio/ pricing/ blog/
git commit -m "feat: Deep Space brand assets + rich OG share card"
```
Expected: correct dimensions; each of the 5 files ≥1 og-card reference. READ logo-512.png and og-card.png to confirm they look right.

---

### Task 8: Full verification sweep + thumbnail re-shoot

**Files:** verification only, plus regenerate `portfolio-img/budgetwebsite-laptop.png`

- [ ] **Step 1: Banned-string sweep**
```bash
grep -rn "budgetwebsite\.in\|30 [Dd]ays\?\|waitlist\|Live Queue\|8DC63F\|C1522E\|FAF5EE\|F3EAD9\|TODO-CONFIRM" --include="*.html" --include="*.css" --include="*.js" --include="*.svg" --include="*.xml" --include="*.txt" . --exclude-dir=vendor --exclude-dir=docs || echo "CLEAN"
```
Expected: `CLEAN` (vendor + docs excluded; docs legitimately mention old palettes historically).
- [ ] **Step 2: Route + payload budget check**
```bash
for r in / /portfolio/ /pricing/ /blog/ /blog/why-small-businesses-in-india-need-a-website.html /form2.html /styles.css /js/scene-home.js /sitemap.xml /robots.txt /og-card.png; do curl -o /dev/null -s -w "$r %{http_code}\n" http://localhost:4821$r; done
gzip -c vendor/three.module.min.js vendor/gsap.min.js vendor/ScrollTrigger.min.js js/*.js | wc -c
```
Expected: all 200; gzipped JS total < 600000 bytes.
- [ ] **Step 3: Full Playwright pass** — desktop full-page screenshots of all 5 routes; 375px screenshots of home + pricing; reduced-motion home; fps sample ≥45 desktop; zero console errors on all routes; quote-form success-swap test. READ every screenshot.
- [ ] **Step 4: Re-shoot `portfolio-img/budgetwebsite-laptop.png`** from the NEW dark home (same clip approach as the terracotta re-shoot, hero visible with 3D canvas or gradient fallback — either is honest).
- [ ] **Step 5: Commit + final state**
```bash
git add portfolio-img/budgetwebsite-laptop.png && git commit -m "chore: re-shoot Budget Website thumbnail from Deep Space design"
git log --oneline site-revamp..redesign-3d && git status
```
Expected: clean tree. Report ends with: branch `redesign-3d` complete, NOT merged — merge/deploy is Lekhraj's explicit call (two pending business items: Samar pricing sign-off, and this redesign supersedes the cream design he may not have seen).

---

## Deferred / explicitly NOT in this plan
- Merging `site-revamp` or `redesign-3d` to `main`, and any deploy.
- AI tools dashboard (own spec/plan), catalogue re-pricing, call-brief automation.
- Blog content redesign beyond palette (posts stay text-first).
