# Budget Website Site Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild budgetwebsite.store as a multi-page site (home / portfolio / pricing) on a new "Warm Trustworthy Local Studio" visual system, killing the discontinued 30-day-challenge branding and the `.in`/`.store` domain confusion.

**Architecture:** Static HTML/CSS/JS, no build step (unchanged from current site). One shared `styles.css` for all chrome/components. One shared `portfolio-data.js` for the growing list of real client sites. `/portfolio` and `/pricing` become real directories (`portfolio/index.html`, `pricing/index.html`) so they're clean, shareable URLs consistent with the existing `/blog/` pattern.

**Tech Stack:** Plain HTML5, CSS custom properties, vanilla JS, Google Fonts (Fraunces + Inter), Google Apps Script backend (`code.gs`) via `fetch(..., {mode:'no-cors'})`, Python's `http.server` for local verification.

**Spec:** `docs/superpowers/specs/2026-07-17-budgetwebsite-site-revamp-design.md`

---

## Scope Check

This plan covers items A (cleanup/domain), B (portfolio page), C (pricing page), D (gallery link) as one cohesive site — they share a single design system and cannot be verified independently of each other without risking visual drift between pages. Items E (15 AI tools) and F (call-brief automation) are explicitly out of scope per the spec and will get their own plans later.

## Verification approach

This is a static marketing site with no existing test framework. "Tests" in this plan are:
- **Content assertions** via `grep` (banned strings must not appear; required strings must appear).
- **Route/status checks** via a local static server (`python -m http.server`) + `curl -o /dev/null -s -w "%{http_code}"`.
- **Manual/browser verification** for visual and interactive correctness (final task).

All shell commands below assume `bash` from the repo root: `Website Project/budgetwebsite-store/`.

---

### Task 1: Shared design system (`styles.css`)

**Files:**
- Create: `styles.css`

- [ ] **Step 1: Write the failing check**

```bash
test -f styles.css && echo "EXISTS" || echo "MISSING"
```
Expected: `MISSING`

- [ ] **Step 2: Create `styles.css`**

```css
/* ─────────────────────────────────────────────
   BUDGET WEBSITE — SHARED DESIGN SYSTEM
   "Warm Trustworthy Local Studio"
   One theme. No dark/light toggle.
───────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --cream: #FAF5EE;
  --cream-alt: #F3EAD9;
  --card: #FFFFFF;
  --ink: #2A241E;
  --ink-soft: #5B5145;
  --muted: #8A7F70;
  --border: rgba(42,36,30,0.12);
  --terracotta: #C1522E;
  --terracotta-deep: #9C3F22;
  --terracotta-dim: rgba(193,82,46,0.10);
  --indigo: #3B4A6B;
  --indigo-dim: rgba(59,74,107,0.10);
  --font-scale: 1;
}

html { scroll-behavior: smooth; }

body {
  background: var(--cream);
  color: var(--ink);
  font-family: 'Inter', sans-serif;
  font-size: calc(16px * var(--font-scale));
  overflow-x: hidden;
}

a { color: inherit; }

/* ── NAV ── */
nav {
  position: sticky; top: 0; left: 0; right: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 48px;
  background: rgba(250,245,238,0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-logo {
  font-family: 'Fraunces', serif;
  font-weight: 700; font-size: 22px; letter-spacing: -0.2px; color: var(--ink);
  flex-shrink: 0; text-decoration: none;
}
.nav-logo span { color: var(--terracotta); }
.nav-tools { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.nav-cta {
  background: var(--terracotta); color: #fff;
  font-weight: 700; font-size: 13px; letter-spacing: 0.5px;
  padding: 10px 22px; border-radius: 4px; text-decoration: none;
  transition: all 0.25s; flex-shrink: 0; white-space: nowrap;
}
.nav-cta:hover { background: var(--terracotta-deep); }
.font-toggle-btn {
  background: transparent; color: var(--ink);
  border: 1px solid var(--border); border-radius: 6px;
  width: 46px; height: 34px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 13px;
  transition: border-color 0.2s, background 0.2s; flex-shrink: 0;
}
.font-toggle-btn:hover { border-color: var(--terracotta); background: var(--terracotta-dim); }
.nav-blog-link {
  color: var(--ink); font-size: 14px; font-weight: 600;
  text-decoration: none; padding: 8px 4px; flex-shrink: 0;
  transition: color 0.2s;
}
.nav-blog-link:hover { color: var(--terracotta); }

/* ── BUTTONS ── */
.btn-primary {
  background: var(--terracotta); color: #fff;
  font-weight: 700; font-size: calc(14px * var(--font-scale)); letter-spacing: 0.5px;
  padding: 14px 32px; border-radius: 4px; text-decoration: none;
  transition: all 0.25s; display: inline-block; border: none; cursor: pointer;
  font-family: 'Inter', sans-serif;
}
.btn-primary:hover { background: var(--terracotta-deep); transform: translateY(-1px); }
.btn-ghost {
  background: transparent; color: var(--ink);
  font-weight: 600; font-size: calc(14px * var(--font-scale));
  padding: 14px 32px; border-radius: 4px; text-decoration: none;
  border: 1px solid var(--border); transition: border-color 0.2s, color 0.2s;
  display: inline-block;
}
.btn-ghost:hover { border-color: var(--terracotta); color: var(--terracotta); }

/* ── HERO ── */
.hero {
  min-height: 80vh;
  display: flex; flex-direction: column; justify-content: center;
  padding: 100px 48px 80px;
}
.hero-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 60px; align-items: center;
  max-width: 1200px; margin: 0 auto; width: 100%;
}
.hero-eyebrow { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
.hero-eyebrow span { display: inline-block; width: 36px; height: 2px; background: var(--terracotta); }
.hero-eyebrow p {
  font-size: calc(12px * var(--font-scale)); font-weight: 600; letter-spacing: 2px;
  text-transform: uppercase; color: var(--terracotta);
}
.hero-headline {
  font-family: 'Fraunces', serif;
  font-weight: 700; font-size: clamp(32px, 5.5vw, 56px);
  line-height: 1.2; letter-spacing: -0.3px;
  color: var(--ink); margin-bottom: 24px;
}
.hero-headline .accent { color: var(--terracotta); }
.hero-sub {
  font-size: calc(18px * var(--font-scale)); color: var(--ink-soft); line-height: 1.6;
  max-width: 480px; margin-bottom: 40px; font-weight: 400;
}
.hero-sub strong { color: var(--ink); font-weight: 600; }
.hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
.hero-photo {
  border-radius: 14px; overflow: hidden; border: 1px solid var(--border);
  box-shadow: 0 20px 50px rgba(42,36,30,0.12);
}
.hero-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* ── SECTIONS ── */
section { padding: 90px 48px; max-width: 1200px; margin: 0 auto; }
.section-label {
  font-size: calc(11px * var(--font-scale)); font-weight: 600; letter-spacing: 3px;
  text-transform: uppercase; color: var(--terracotta); margin-bottom: 16px;
  display: flex; align-items: center; gap: 10px;
}
.section-label::before { content: ''; width: 24px; height: 2px; background: var(--terracotta); }
.section-title {
  font-family: 'Fraunces', serif;
  font-weight: 700; font-size: clamp(30px, 5vw, 52px);
  line-height: 1.15; color: var(--ink);
  letter-spacing: -0.3px; margin-bottom: 20px;
}
.section-title .accent { color: var(--terracotta); }
.section-sub { font-size: calc(17px * var(--font-scale)); color: var(--ink-soft); line-height: 1.7; max-width: 560px; }

/* ── HOW IT WORKS ── */
.how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; }
.how-card {
  background: var(--card); border: 1px solid var(--border); border-radius: 12px;
  padding: 36px 30px; transition: transform 0.25s, box-shadow 0.25s;
}
.how-card:hover { transform: translateY(-4px); box-shadow: 0 16px 32px rgba(42,36,30,0.08); }
.how-icon { font-size: calc(26px * var(--font-scale)); margin-bottom: 18px; }
.how-title {
  font-family: 'Fraunces', serif;
  font-weight: 700; font-size: calc(21px * var(--font-scale));
  color: var(--ink); margin-bottom: 10px;
}
.how-desc { font-size: calc(14px * var(--font-scale)); color: var(--ink-soft); line-height: 1.7; }

/* ── WHY US ── */
.why-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; }
.why-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 12px; padding: 32px 28px;
  transition: border-color 0.25s, transform 0.25s;
}
.why-card:hover { border-color: var(--terracotta); transform: translateY(-4px); }
.why-icon {
  font-size: calc(24px * var(--font-scale)); margin-bottom: 18px; width: 48px; height: 48px;
  background: var(--terracotta-dim); border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.why-title {
  font-family: 'Fraunces', serif;
  font-weight: 700; font-size: calc(20px * var(--font-scale));
  color: var(--ink); margin-bottom: 10px;
}
.why-desc { font-size: calc(14px * var(--font-scale)); color: var(--ink-soft); line-height: 1.7; }

/* ── PORTFOLIO ── */
.portfolio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; }
.portfolio-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden;
  transition: all 0.25s; text-decoration: none; display: block; color: var(--ink);
}
.portfolio-card:hover { border-color: var(--terracotta); transform: translateY(-4px); box-shadow: 0 16px 32px rgba(42,36,30,0.10); }
.portfolio-thumb { height: 200px; background: var(--cream-alt); overflow: hidden; }
.portfolio-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
.portfolio-info { padding: 18px 22px 22px; }
.portfolio-name { font-family: 'Fraunces', serif; font-size: calc(17px * var(--font-scale)); font-weight: 700; margin-bottom: 4px; }
.portfolio-cat { font-size: calc(12.5px * var(--font-scale)); color: var(--muted); }

/* ── PRICING ── */
.pricing-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-top: 60px; }
.price-card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 14px; padding: 32px 26px;
  transition: border-color 0.25s, transform 0.25s;
  display: flex; flex-direction: column;
}
.price-card:hover { border-color: var(--terracotta); transform: translateY(-4px); }
.price-card.featured { border-color: var(--terracotta); background: linear-gradient(160deg, var(--terracotta-dim), var(--card) 60%); position: relative; }
.price-card.featured::before {
  content: 'Most Popular'; position: absolute; top: -12px; left: 26px;
  background: var(--terracotta); color: #fff;
  font-size: calc(10px * var(--font-scale)); font-weight: 700; letter-spacing: 1px;
  text-transform: uppercase; padding: 4px 12px; border-radius: 20px;
}
.price-tier { font-family: 'Inter', sans-serif; font-weight: 700; font-size: calc(13px * var(--font-scale)); letter-spacing: 1px; text-transform: uppercase; color: var(--muted); margin-bottom: 10px; }
.price-amt { font-family: 'Fraunces', serif; font-weight: 700; font-size: calc(36px * var(--font-scale)); color: var(--ink); line-height: 1; margin-bottom: 4px; }
.price-amt span { font-size: calc(15px * var(--font-scale)); color: var(--muted); font-weight: 500; font-family: 'Inter', sans-serif; }
.price-delivery { font-size: calc(12px * var(--font-scale)); color: var(--terracotta); font-weight: 600; margin-bottom: 22px; }
.price-list { list-style: none; flex-grow: 1; margin-bottom: 24px; }
.price-list li { font-size: calc(13.5px * var(--font-scale)); color: var(--ink-soft); line-height: 1.8; padding-left: 20px; position: relative; }
.price-list li::before { content: '✓'; position: absolute; left: 0; color: var(--terracotta); font-weight: 700; }
.price-cta {
  display: block; text-align: center; text-decoration: none;
  background: transparent; color: var(--ink); border: 1px solid var(--border);
  font-weight: 700; font-size: calc(13px * var(--font-scale)); padding: 12px; border-radius: 6px; transition: all 0.2s;
}
.price-card.featured .price-cta { background: var(--terracotta); color: #fff; border-color: var(--terracotta); }
.price-cta:hover { border-color: var(--terracotta); color: var(--terracotta); }
.price-card.featured .price-cta:hover { background: var(--terracotta-deep); color: #fff; }
.price-card.custom { align-items: center; text-align: center; justify-content: center; border: 1px dashed var(--terracotta); }

/* ── TERMS / AMC ── */
.terms-box { margin-top: 50px; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 32px 36px; }
.terms-box h3 { font-family: 'Fraunces', serif; font-weight: 700; font-size: calc(17px * var(--font-scale)); color: var(--ink); margin-bottom: 14px; }
.terms-box ul { list-style: none; margin-bottom: 22px; }
.terms-box ul:last-child { margin-bottom: 0; }
.terms-box li { font-size: calc(13.5px * var(--font-scale)); color: var(--ink-soft); line-height: 1.8; padding-left: 18px; position: relative; margin-bottom: 6px; }
.terms-box li::before { content: '—'; position: absolute; left: 0; color: var(--terracotta); }
.terms-box li strong { color: var(--ink); font-weight: 600; }

/* ── TOOLS (Coming Soon) ── */
.tools-section { margin-top: 50px; }
.tool-group { margin-bottom: 36px; }
.tool-group-title { font-size: calc(12px * var(--font-scale)); font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--indigo); margin-bottom: 16px; }
.tool-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.tool-card { background: var(--card); border: 1px solid var(--border); border-radius: 10px; padding: 20px 22px; }
.tool-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 8px; }
.tool-name { font-family: 'Fraunces', serif; font-weight: 700; font-size: calc(15px * var(--font-scale)); color: var(--ink); }
.tool-price { font-size: calc(12px * var(--font-scale)); color: var(--muted); font-weight: 600; white-space: nowrap; }
.tool-desc { font-size: calc(13px * var(--font-scale)); color: var(--ink-soft); line-height: 1.6; }
.badge-soon {
  display: inline-block; background: var(--indigo-dim); color: var(--indigo);
  font-size: calc(10px * var(--font-scale)); font-weight: 700; letter-spacing: 0.5px;
  text-transform: uppercase; padding: 3px 8px; border-radius: 4px; margin-top: 10px;
}

/* ── QUOTE FORM ── */
.quote-form-wrap { max-width: 640px; margin: 50px auto 0; background: var(--card); border: 1px solid var(--border); border-radius: 14px; padding: 36px; }
.quote-form-wrap h3 { font-family: 'Fraunces', serif; font-weight: 700; font-size: calc(21px * var(--font-scale)); color: var(--ink); margin-bottom: 8px; }
.quote-form-wrap p { font-size: calc(13.5px * var(--font-scale)); color: var(--ink-soft); margin-bottom: 24px; }
.quote-form { display: flex; flex-direction: column; gap: 14px; }
.quote-form input, .quote-form textarea {
  background: var(--cream); border: 1px solid var(--border);
  color: var(--ink); border-radius: 6px; padding: 14px 18px;
  font-size: calc(14px * var(--font-scale)); font-family: 'Inter', sans-serif;
  outline: none; transition: border-color 0.2s; width: 100%; resize: vertical;
}
.quote-form input:focus, .quote-form textarea:focus { border-color: var(--terracotta); }
.quote-form input::placeholder, .quote-form textarea::placeholder { color: var(--muted); }
.btn-quote {
  background: var(--terracotta); color: #fff;
  font-weight: 800; font-size: calc(14px * var(--font-scale)); letter-spacing: 0.5px;
  padding: 14px 32px; border-radius: 6px; border: none;
  cursor: pointer; transition: background 0.25s; width: 100%; font-family: 'Inter', sans-serif;
}
.btn-quote:hover { background: var(--terracotta-deep); }
.quote-success {
  display: none; text-align: center; padding: 20px;
  background: var(--terracotta-dim); border: 1px solid var(--terracotta);
  border-radius: 10px; color: var(--ink); font-size: calc(14px * var(--font-scale));
}

/* ── CTA BAND ── */
.cta-band { background: var(--cream-alt); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 80px 48px; text-align: center; }
.cta-band .big-text {
  font-family: 'Fraunces', serif;
  font-weight: 700; font-size: clamp(28px, 6vw, 64px);
  color: var(--ink); line-height: 1.15; letter-spacing: -0.4px; margin-bottom: 24px;
}
.cta-band .big-text span { color: var(--terracotta); }
.cta-band p { font-size: calc(17px * var(--font-scale)); color: var(--ink-soft); margin-bottom: 36px; }
.cta-contact {
  display: inline-flex; align-items: center; gap: 12px;
  background: var(--terracotta); color: #fff;
  font-weight: 800; font-size: calc(16px * var(--font-scale)); letter-spacing: 0.5px;
  padding: 18px 40px; border-radius: 4px; text-decoration: none; transition: all 0.25s;
}
.cta-contact:hover { background: var(--terracotta-deep); transform: translateY(-2px); }

/* ── FOOTER ── */
footer {
  padding: 32px 48px; display: flex; align-items: center; justify-content: space-between;
  border-top: 1px solid var(--border); flex-wrap: wrap; gap: 12px;
}
footer p { font-size: calc(13px * var(--font-scale)); color: var(--muted); }
footer a { color: var(--muted); }
.footer-logo { font-family: 'Fraunces', serif; font-weight: 700; font-size: calc(18px * var(--font-scale)); color: var(--ink); }
.footer-logo span { color: var(--terracotta); }
.gallery-link { text-decoration: underline; }
.gallery-link:hover { color: var(--terracotta); }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  nav { padding: 16px 24px; }
  .nav-tools { gap: 6px; }
  .nav-cta { padding: 10px 14px; font-size: 11px; }
  .hero { padding: 90px 24px 60px; }
  .hero-grid { grid-template-columns: 1fr; }
  section { padding: 60px 24px; }
  .how-grid, .why-grid { grid-template-columns: 1fr; }
  .pricing-grid { grid-template-columns: 1fr 1fr; }
  .portfolio-grid { grid-template-columns: 1fr 1fr; }
  .tool-grid { grid-template-columns: 1fr; }
  footer { flex-direction: column; text-align: center; }
}
@media (max-width: 600px) {
  .pricing-grid { grid-template-columns: 1fr; }
  .portfolio-grid { grid-template-columns: 1fr; }
  .quote-form-wrap, .terms-box { padding: 26px 22px; }
  .cta-band { padding: 60px 24px; }
}
@media (max-width: 420px) {
  nav { padding: 14px 16px; }
  .nav-logo { font-size: 17px; }
  .nav-cta { padding: 9px 11px; font-size: 10px; }
  .font-toggle-btn { width: 40px; height: 30px; }
  .nav-blog-link { display: none; }
}
```

- [ ] **Step 3: Verify**

```bash
grep -c "8DC63F" styles.css; grep -c "C1522E" styles.css; grep -c "theme-toggle" styles.css
```
Expected: `0`, `1` or more, `0` — no old green hex, new terracotta present, no dark/light toggle references.

- [ ] **Step 4: Commit**

```bash
git add styles.css
git commit -m "feat: add shared warm-studio design system (styles.css)"
```

---

### Task 2: Shared portfolio data (`portfolio-data.js`)

**Files:**
- Create: `portfolio-data.js`

- [ ] **Step 1: Write the failing check**

```bash
test -f portfolio-data.js && echo "EXISTS" || echo "MISSING"
```
Expected: `MISSING`

- [ ] **Step 2: Create `portfolio-data.js`**

```js
// Real client work, newest first.
// To add a new site: add a new object to the TOP of this array. Do not reorder existing entries.
const PORTFOLIO_ENTRIES = [
  {
    name: 'Budget Website',
    category: 'This Very Site',
    url: 'https://www.budgetwebsite.store',
    image: 'portfolio-img/budgetwebsite-laptop.png',
  },
  {
    name: 'Bhagyashree Car Rentals',
    category: 'Car Rental Service',
    url: 'https://bhagyashree-car-rentals.vercel.app/',
    image: 'portfolio-img/bhagyashree-car.jpg',
  },
  {
    name: 'Coco Palms',
    category: 'Resort / Hospitality · Nashik',
    url: 'https://cocopalmsnashik.in',
    image: 'portfolio-img/coco-palms.jpeg',
  },
  {
    name: 'G7 Gaming',
    category: 'Gaming Parlour · Andheri West',
    url: 'https://g7gaming.co.in',
    image: 'portfolio-img/g7-gaming.jpg',
  },
];

function renderPortfolioCards(entries) {
  return entries.map(e => `
    <a href="${e.url}" target="_blank" rel="noopener" class="portfolio-card">
      <div class="portfolio-thumb">
        <img src="${e.image}" alt="${e.name}" loading="lazy">
      </div>
      <div class="portfolio-info">
        <div class="portfolio-name">${e.name}</div>
        <div class="portfolio-cat">${e.category}</div>
      </div>
    </a>
  `).join('');
}
```

- [ ] **Step 3: Verify**

```bash
node -e "
const fs = require('fs');
const code = fs.readFileSync('portfolio-data.js', 'utf8');
const fn = new Function(code + '; return { PORTFOLIO_ENTRIES, renderPortfolioCards };');
const { PORTFOLIO_ENTRIES, renderPortfolioCards } = fn();
console.log('count:', PORTFOLIO_ENTRIES.length);
console.log('first:', PORTFOLIO_ENTRIES[0].name);
console.log('html-sample:', renderPortfolioCards(PORTFOLIO_ENTRIES.slice(0,1)).includes('Budget Website'));
"
```
Expected: `count: 4`, `first: Budget Website`, `html-sample: true`

> **Plan correction (post-Task-2-review):** the original verify command used `eval(fs.readFileSync(...))`, which does not work — `const`/`let` declared inside a direct `eval()` call never leak into the calling scope in JavaScript (unlike `var`), so `PORTFOLIO_ENTRIES` would be undefined afterward and the command would throw `ReferenceError`, not print the expected output. The corrected command above wraps the file's code and a `return` statement in the *same* `new Function(...)` body, so the `const` declarations and the return live in one shared function scope. Independently re-run against the committed `portfolio-data.js` and confirmed it produces exactly `count: 4`, `first: Budget Website`, `html-sample: true`.

- [ ] **Step 4: Commit**

```bash
git add portfolio-data.js
git commit -m "feat: add shared portfolio data source (newest-first, 4 confirmed real builds)"
```

---

### Task 3: Rebuild `index.html` (home)

**Files:**
- Modify: `index.html` (full rewrite)

- [ ] **Step 1: Write the failing check**

```bash
grep -c "budgetwebsite.in" index.html; grep -c "30 Days" index.html; grep -c "waitlist" index.html
```
Expected: non-zero counts for all three (confirms old content still present before the rewrite)

- [ ] **Step 2: Replace `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Budget Website | Affordable Website Design for Small Businesses in India</title>
<meta name="description" content="Get a professional, custom website for your small business in India — built and delivered in a single day, starting at ₹8,000. Affordable website design with no agency timelines or overpricing.">
<meta name="keywords" content="budget website design India, affordable website for small business, small business website India, cheap website design India, one day website design, website designer for local business, low cost website India">
<link rel="canonical" href="https://www.budgetwebsite.store/">
<meta property="og:title" content="Budget Website | Affordable Website Design for Small Businesses in India">
<meta property="og:description" content="Professional, custom websites for small businesses in India — built and delivered in a single day, starting at ₹8,000.">
<meta property="og:image" content="https://www.budgetwebsite.store/logo-512.png">
<meta property="og:url" content="https://www.budgetwebsite.store">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Budget Website | Affordable Website Design for Small Businesses in India">
<meta name="twitter:description" content="Professional, custom websites for small businesses in India — built and delivered in a single day, starting at ₹8,000.">
<meta name="twitter:image" content="https://www.budgetwebsite.store/logo-512.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16.png">
<link rel="apple-touch-icon" sizes="192x192" href="logo-192.png">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Budget Website",
  "description": "Affordable, professionally built websites for small businesses across India, delivered in a single day.",
  "url": "https://www.budgetwebsite.store",
  "priceRange": "₹8,000 - ₹50,000+",
  "areaServed": "IN",
  "makesOffer": [
    { "@type": "Offer", "name": "Starter Website", "price": "8000", "priceCurrency": "INR" },
    { "@type": "Offer", "name": "Standard Website", "price": "15000", "priceCurrency": "INR" },
    { "@type": "Offer", "name": "Premium Website", "price": "25000", "priceCurrency": "INR" },
    { "@type": "Offer", "name": "Custom Website", "price": "50000", "priceCurrency": "INR" }
  ]
}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<nav>
  <a href="/" class="nav-logo">budget<span>website</span>.store</a>
  <div class="nav-tools">
    <a href="/blog/" class="nav-blog-link">Blog</a>
    <button class="font-toggle-btn" id="font-toggle-btn" onclick="cycleFontSize()" title="Change text size">A+</button>
    <a href="#contact" class="nav-cta">Get Your Website →</a>
  </div>
</nav>

<div class="hero">
  <div class="hero-grid">
    <div>
      <div class="hero-eyebrow"><span></span><p>Real Websites · Real Fast</p></div>
      <h1 class="hero-headline">Websites that look expensive.<br><span class="accent">Priced fair.</span></h1>
      <p class="hero-sub">One local business. One full website. Built and live — <strong>in a single day.</strong> No agency timelines, no agency pricing.</p>
      <div class="hero-actions">
        <a href="#contact" class="btn-primary">Get Your Website →</a>
        <a href="#how" class="btn-ghost">See How It Works</a>
      </div>
    </div>
    <div class="hero-photo">
      <img src="portfolio-img/budgetwebsite-laptop.png" alt="A real budget website build shown on a laptop">
    </div>
  </div>
</div>

<section id="how">
  <div class="section-label">The Process</div>
  <h2 class="section-title">How It <span class="accent">Works</span></h2>
  <p class="section-sub">No long timelines. No agency pricing. No waiting weeks for a draft.</p>
  <div class="how-grid">
    <div class="how-card">
      <div class="how-icon">📞</div>
      <div class="how-title">You Reach Out</div>
      <div class="how-desc">A 10-minute call is all it takes. Tell us what your business does, what you need, and what you can spend. We'll take it from there.</div>
    </div>
    <div class="how-card">
      <div class="how-icon">⚡</div>
      <div class="how-title">We Build In One Day</div>
      <div class="how-desc">Design, development, content, hosting — done in a single session. You watch it happen, live.</div>
    </div>
    <div class="how-card">
      <div class="how-icon">🚀</div>
      <div class="how-title">Your Business Goes Live</div>
      <div class="how-desc">By end of day, your website is live. Fast, mobile-ready, and built to be found. Free hosting. No recurring fees.</div>
    </div>
  </div>
</section>

<section id="why" style="padding-top:0;">
  <div class="section-label">Why Us</div>
  <h2 class="section-title">Small Studio.<br><span class="accent">Zero Bloat.</span></h2>
  <p class="section-sub">No agency overhead. No account managers. No 6-week timelines. Just a finished website, fast.</p>
  <div class="why-grid">
    <div class="why-card">
      <div class="why-icon">⚡</div>
      <div class="why-title">Built In A Day</div>
      <div class="why-desc">What normally takes weeks, we finish in a single session — because we've stripped every unnecessary step out of the process.</div>
    </div>
    <div class="why-card">
      <div class="why-icon">💸</div>
      <div class="why-title">Fair, Transparent Pricing</div>
      <div class="why-desc">No hidden fees, no surprise invoices. You know the price before we start, and it works around your budget.</div>
    </div>
    <div class="why-card">
      <div class="why-icon">🎯</div>
      <div class="why-title">Real Portfolio, Real Proof</div>
      <div class="why-desc">Every site below is live, real, and built by us. Not templates, not mockups — actual businesses running on what we built.</div>
    </div>
  </div>
</section>

<section id="work" style="padding-top:0;">
  <div class="section-label">The Work</div>
  <h2 class="section-title">Recent <span class="accent">Builds</span></h2>
  <p class="section-sub">Each one a real local business. <a href="/portfolio/" style="color:var(--terracotta);font-weight:600;">See all our work →</a></p>
  <div class="portfolio-grid" id="portfolio-teaser"></div>
</section>

<section id="pricing" style="padding-top:0;">
  <div class="section-label">Pricing</div>
  <h2 class="section-title">Simple Plans.<br><span class="accent">No Surprises.</span></h2>
  <p class="section-sub">Four tiers, transparent terms. <a href="/pricing/" style="color:var(--terracotta);font-weight:600;">See full pricing & terms →</a></p>
  <div class="pricing-grid">
    <div class="price-card">
      <div class="price-tier">Starter</div>
      <div class="price-amt">₹8,000</div>
      <div class="price-delivery">Delivered in 1–2 days</div>
      <ul class="price-list"><li>1-page static website</li><li>Mobile responsive</li><li>Google Maps embed</li><li>Contact form / WhatsApp button</li></ul>
      <a href="/pricing/" class="price-cta">See Details</a>
    </div>
    <div class="price-card featured">
      <div class="price-tier">Standard</div>
      <div class="price-amt">₹15,000</div>
      <div class="price-delivery">Delivered in 2–3 days</div>
      <ul class="price-list"><li>Everything in Starter</li><li>2–3 sections</li><li>Custom domain setup</li><li>Basic SEO tags</li></ul>
      <a href="/pricing/" class="price-cta">See Details</a>
    </div>
    <div class="price-card">
      <div class="price-tier">Premium</div>
      <div class="price-amt">₹25,000</div>
      <div class="price-delivery">Delivered in 3–5 days</div>
      <ul class="price-list"><li>Everything in Standard</li><li>4–5 sections</li><li>Booking / inquiry form</li><li>Analytics setup</li></ul>
      <a href="/pricing/" class="price-cta">See Details</a>
    </div>
    <div class="price-card custom">
      <div class="price-tier">Custom</div>
      <div class="price-amt">₹50,000<span>+</span></div>
      <div class="price-delivery">Scoped to your project</div>
      <ul class="price-list"><li>E-commerce & payments</li><li>WhatsApp-cart menus</li><li>Serious backend work</li></ul>
      <a href="/pricing/" class="price-cta">See Details</a>
    </div>
  </div>
</section>

<div class="cta-band" id="contact">
  <p class="section-label" style="justify-content:center;margin-bottom:20px;">Get Started</p>
  <div class="big-text">Is Your Business<br><span>Next?</span></div>
  <p>10 minutes on a call. That's all we need to get started.<br>Price works around your budget.</p>
  <a href="https://wa.me/918976587269?text=Hi%2C%20I%20want%20my%20business%20website%20done%20through%20budgetwebsite.store." class="cta-contact" id="wa-link">💬 &nbsp; Message on WhatsApp</a>
</div>

<footer>
  <div class="footer-logo">budget<span>website</span>.store</div>
  <p><a href="/blog/" class="gallery-link">Blog</a> · <a href="/portfolio/" class="gallery-link">Portfolio</a> · <a href="https://TODO-CONFIRM-GALLERY-URL.example" target="_blank" rel="noopener" class="gallery-link">See What's Possible</a> · © 2026 · Built in a day, just like yours will be.</p>
</footer>

<script src="portfolio-data.js"></script>
<script>
  const FONT_STEPS = [1, 1.1, 1.2, 1.3, 1.4];
  function applyFontScale(scale) { document.documentElement.style.setProperty('--font-scale', scale); }
  function cycleFontSize() {
    let idx = parseInt(localStorage.getItem('bw-font-step')) || 0;
    idx = (idx + 1) % FONT_STEPS.length;
    applyFontScale(FONT_STEPS[idx]);
    localStorage.setItem('bw-font-step', idx);
  }
  applyFontScale(FONT_STEPS[parseInt(localStorage.getItem('bw-font-step')) || 0]);

  document.getElementById('portfolio-teaser').innerHTML = renderPortfolioCards(PORTFOLIO_ENTRIES.slice(0, 3));
</script>

</body>
</html>
```

- [ ] **Step 3: Verify**

```bash
grep -c "budgetwebsite.in" index.html; grep -c "30 Days" index.html; grep -c "waitlist" index.html; grep -c "8,000" index.html
```
Expected: `0`, `0`, `0`, `1` or more

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "refactor: rebuild home page — kill 30-day branding, .store domain, portfolio/pricing teasers"
```

---

### Task 4: Build `/portfolio` page

**Files:**
- Create: `portfolio/index.html`

- [ ] **Step 1: Write the failing check**

```bash
test -f portfolio/index.html && echo "EXISTS" || echo "MISSING"
```
Expected: `MISSING`

- [ ] **Step 2: Create `portfolio/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Our Work | Budget Website</title>
<meta name="description" content="Real websites built for real small businesses across India — every one live, every one built by us.">
<link rel="canonical" href="https://www.budgetwebsite.store/portfolio/">
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
</head>
<body>

<nav>
  <a href="/" class="nav-logo">budget<span>website</span>.store</a>
  <div class="nav-tools">
    <a href="/blog/" class="nav-blog-link">Blog</a>
    <button class="font-toggle-btn" id="font-toggle-btn" onclick="cycleFontSize()" title="Change text size">A+</button>
    <a href="/#contact" class="nav-cta">Get Your Website →</a>
  </div>
</nav>

<section style="padding-top:60px;">
  <div class="section-label">The Work</div>
  <h2 class="section-title">Websites We've <span class="accent">Built</span></h2>
  <p class="section-sub">Each one a real local business, live today. Newest first.</p>
  <div class="portfolio-grid" id="portfolio-full"></div>
</section>

<div class="cta-band" id="contact">
  <div class="big-text">Is Your Business<br><span>Next?</span></div>
  <p>10 minutes on a call. That's all we need to get started.</p>
  <a href="https://wa.me/918976587269?text=Hi%2C%20I%20want%20my%20business%20website%20done%20through%20budgetwebsite.store." class="cta-contact">💬 &nbsp; Message on WhatsApp</a>
</div>

<footer>
  <div class="footer-logo">budget<span>website</span>.store</div>
  <p><a href="/blog/" class="gallery-link">Blog</a> · <a href="https://TODO-CONFIRM-GALLERY-URL.example" target="_blank" rel="noopener" class="gallery-link">See What's Possible</a> · © 2026 · Built in a day, just like yours will be.</p>
</footer>

<script src="../portfolio-data.js"></script>
<script>
  const FONT_STEPS = [1, 1.1, 1.2, 1.3, 1.4];
  function applyFontScale(scale) { document.documentElement.style.setProperty('--font-scale', scale); }
  function cycleFontSize() {
    let idx = parseInt(localStorage.getItem('bw-font-step')) || 0;
    idx = (idx + 1) % FONT_STEPS.length;
    applyFontScale(FONT_STEPS[idx]);
    localStorage.setItem('bw-font-step', idx);
  }
  applyFontScale(FONT_STEPS[parseInt(localStorage.getItem('bw-font-step')) || 0]);

  document.getElementById('portfolio-full').innerHTML = renderPortfolioCards(PORTFOLIO_ENTRIES);
</script>

</body>
</html>
```

- [ ] **Step 3: Verify**

```bash
python -m http.server 8099 &>/dev/null &
SERVER_PID=$!
sleep 1
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:8099/portfolio/
grep -c "budgetwebsite.in" portfolio/index.html
kill $SERVER_PID
```
Expected: `200`, then `0`

- [ ] **Step 4: Commit**

```bash
git add portfolio/index.html
git commit -m "feat: add /portfolio page — full real-work list, newest first"
```

---

### Task 5: Build `/pricing` page

**Files:**
- Create: `pricing/index.html`

- [ ] **Step 1: Write the failing check**

```bash
test -f pricing/index.html && echo "EXISTS" || echo "MISSING"
```
Expected: `MISSING`

- [ ] **Step 2: Create `pricing/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pricing | Budget Website</title>
<meta name="description" content="Transparent pricing for small business websites in India — ₹8,000 to ₹50,000+, no hidden fees.">
<link rel="canonical" href="https://www.budgetwebsite.store/pricing/">
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
</head>
<body>

<nav>
  <a href="/" class="nav-logo">budget<span>website</span>.store</a>
  <div class="nav-tools">
    <a href="/blog/" class="nav-blog-link">Blog</a>
    <button class="font-toggle-btn" id="font-toggle-btn" onclick="cycleFontSize()" title="Change text size">A+</button>
    <a href="/#contact" class="nav-cta">Get Your Website →</a>
  </div>
</nav>

<section style="padding-top:60px;">
  <div class="section-label">Pricing</div>
  <h1 class="section-title">Simple Plans.<br><span class="accent">No Surprises.</span></h1>
  <p class="section-sub">Pick a plan below, or tell us what you need and we'll quote it.</p>

  <div class="pricing-grid">
    <div class="price-card">
      <div class="price-tier">Starter</div>
      <div class="price-amt">₹8,000</div>
      <div class="price-delivery">Delivered in 1–2 days</div>
      <ul class="price-list">
        <li>1-page static website</li>
        <li>Mobile responsive</li>
        <li>Google Maps embed</li>
        <li>Contact form / WhatsApp button</li>
        <li>Free hosting</li>
      </ul>
      <a href="#contact-quote" class="price-cta">Choose Starter</a>
    </div>
    <div class="price-card featured">
      <div class="price-tier">Standard</div>
      <div class="price-amt">₹15,000</div>
      <div class="price-delivery">Delivered in 2–3 days</div>
      <ul class="price-list">
        <li>Everything in Starter</li>
        <li>2–3 sections (About, Services, Gallery)</li>
        <li>Custom domain setup <span style="opacity:0.6;">(domain cost extra)</span></li>
        <li>Basic SEO tags</li>
        <li>Photo gallery</li>
      </ul>
      <a href="#contact-quote" class="price-cta">Choose Standard</a>
    </div>
    <div class="price-card">
      <div class="price-tier">Premium</div>
      <div class="price-amt">₹25,000</div>
      <div class="price-delivery">Delivered in 3–5 days</div>
      <ul class="price-list">
        <li>Everything in Standard</li>
        <li>4–5 sections</li>
        <li>Booking / inquiry form</li>
        <li>Google Analytics setup</li>
        <li>1 month of minor edits included</li>
      </ul>
      <a href="#contact-quote" class="price-cta">Choose Premium</a>
    </div>
    <div class="price-card custom">
      <div class="price-tier">Custom</div>
      <div class="price-amt">₹50,000<span>+</span></div>
      <div class="price-delivery">Scoped to your project</div>
      <ul class="price-list">
        <li>Full e-commerce & payment gateway</li>
        <li>WhatsApp-cart digital menus</li>
        <li>Any serious backend infrastructure</li>
      </ul>
      <a href="#contact-quote" class="price-cta">Get a Custom Quote</a>
    </div>
  </div>
  <p style="text-align:center;margin-top:18px;font-size:calc(14px * var(--font-scale));color:var(--ink-soft);max-width:640px;margin-left:auto;margin-right:auto;">
    <strong style="color:var(--ink);">Custom isn't capped at heavy builds.</strong> A lighter custom job — like a restaurant digital menu with a WhatsApp-cart checkout and no payment processing — also falls under Custom, priced at the lower end of the ₹50,000+ range based on actual scope.
  </p>

  <div class="terms-box">
    <h3>Terms & What Happens After Delivery</h3>
    <ul>
      <li>Once full payment is received, the job is considered complete. Any changes requested after that are <strong>₹500 per session</strong>.</li>
      <li>Sessions are scheduled within a week of request, and confirmed within 24 hours of the request being made.</li>
    </ul>
    <h3>Annual Maintenance (AMC)</h3>
    <ul>
      <li>AMC plans start at <strong>₹6,000/year</strong> — covers ongoing hosting checks, minor updates, and priority support.</li>
      <li>AMC packages (Basic / Standard / Priority tiers) are being finalized — reach out and we'll confirm what fits your site.</li>
    </ul>
  </div>

  <div class="tools-section">
    <div class="section-label" style="margin-bottom:8px;">Add-Ons</div>
    <h2 class="section-title" style="font-size:clamp(24px,4vw,36px);">AI Tools <span class="accent">— ₹5,000 each</span></h2>
    <p class="section-sub" style="margin-bottom:30px;">Coming soon — digitize the repetitive daily tasks eating your time. Reach out to be first in line.</p>

    <div class="tool-group">
      <div class="tool-group-title">Finance & Ops Essentials</div>
      <div class="tool-grid">
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">GST Invoice Generator</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Create GST-compliant invoices in seconds — no accountant needed for routine billing.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Quotation / Estimate Builder</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Turn a customer conversation into a professional quote in under a minute.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Expense Tracker</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Log daily expenses on your phone — see where your money actually goes.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Salary Slip Generator</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Generate monthly salary slips for your staff without a spreadsheet template.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
      </div>
    </div>

    <div class="tool-group">
      <div class="tool-group-title">Sales & Lead Tools</div>
      <div class="tool-grid">
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Lead Tracker</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Keep every inquiry in one place instead of scattered across WhatsApp chats.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Follow-Up Reminder Tool</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Never let a warm lead go cold — automatic nudges to follow up on time.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Cold Message Writer</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">AI-drafted outreach messages that don't read like a template.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
      </div>
    </div>

    <div class="tool-group">
      <div class="tool-group-title">Marketing Tools</div>
      <div class="tool-grid">
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">WhatsApp Broadcast Writer</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Write broadcast-ready WhatsApp promos the way your customers actually shop.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Instagram Caption Generator</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Never stare at a blank caption box again — on-brand captions on demand.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Google Review Reply Generator</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Respond to every Google review — good or bad — professionally and fast.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Festival Offer Message Generator</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Diwali, Holi, Eid — festival promos written and ready before the day arrives.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
      </div>
    </div>

    <div class="tool-group">
      <div class="tool-group-title">Standout / Novel</div>
      <div class="tool-grid">
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Business Card Scanner + Contact Saver</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Snap a photo of a business card at a networking event, save the contact instantly.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
      </div>
    </div>

    <div class="tool-group">
      <div class="tool-group-title">Website & Content</div>
      <div class="tool-grid">
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Blog Post Writer</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Keep your blog active for SEO without writing every post yourself.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">About Us Page Writer</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Turn your business story into copy that actually reads well.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
        <div class="tool-card">
          <div class="tool-card-head"><div class="tool-name">Google My Business Post Writer</div><div class="tool-price">₹5,000</div></div>
          <div class="tool-desc">Keep your GMB profile active with regular posts, written for you.</div>
          <div class="badge-soon">Coming Soon</div>
        </div>
      </div>
    </div>

    <p style="font-size:calc(13px * var(--font-scale));color:var(--muted);margin-top:8px;">Plus <strong style="color:var(--ink);">SEO</strong> as a paid add-on line item — ask on your call.</p>
  </div>

  <div class="quote-form-wrap" id="contact-quote">
    <h3>Tell Us What You Need</h3>
    <p>Fill this in and we'll get back to you with a custom quote and timeline.</p>
    <div class="quote-form" id="quote-form">
      <input type="text" id="q-name" placeholder="Your name" autocomplete="off">
      <input type="tel" id="q-phone" placeholder="WhatsApp number (10 digits)" autocomplete="off">
      <input type="text" id="q-biz" placeholder="Business name" autocomplete="off">
      <textarea id="q-req" rows="4" placeholder="Tell us what you need — e.g. an online store, a booking system, a multi-page site with a blog, etc."></textarea>
      <button class="btn-quote" onclick="submitQuote()">Send Requirement →</button>
    </div>
    <div class="quote-success" id="quote-success">🎯 Got it! We'll review your requirement and get back to you on WhatsApp with a quote.</div>
  </div>
</section>

<footer>
  <div class="footer-logo">budget<span>website</span>.store</div>
  <p><a href="/blog/" class="gallery-link">Blog</a> · <a href="https://TODO-CONFIRM-GALLERY-URL.example" target="_blank" rel="noopener" class="gallery-link">See What's Possible</a> · © 2026 · Built in a day, just like yours will be.</p>
</footer>

<script>
  const FONT_STEPS = [1, 1.1, 1.2, 1.3, 1.4];
  function applyFontScale(scale) { document.documentElement.style.setProperty('--font-scale', scale); }
  function cycleFontSize() {
    let idx = parseInt(localStorage.getItem('bw-font-step')) || 0;
    idx = (idx + 1) % FONT_STEPS.length;
    applyFontScale(FONT_STEPS[idx]);
    localStorage.setItem('bw-font-step', idx);
  }
  applyFontScale(FONT_STEPS[parseInt(localStorage.getItem('bw-font-step')) || 0]);

  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyg6fS7_wR7UZthPhyyZ6_BQNcFObAp5ln_Ge2DmFbrtnKqi3q_3YF80FlijlOOWw_K/exec';

  async function submitQuote() {
    const name  = document.getElementById('q-name').value.trim();
    const phone = document.getElementById('q-phone').value.trim();
    const biz   = document.getElementById('q-biz').value.trim();
    const req   = document.getElementById('q-req').value.trim();

    if (!name || !phone || !req) {
      alert('Please fill in your name, WhatsApp number, and requirement.');
      return;
    }

    const btn = document.querySelector('.btn-quote');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: 'quote', name, phone, biz, req })
      });
      document.getElementById('quote-form').style.display = 'none';
      document.getElementById('quote-success').style.display = 'block';
    } catch (e) {
      btn.textContent = 'Send Requirement →';
      btn.disabled = false;
      alert('Something went wrong. Try again or WhatsApp us directly.');
    }
  }
</script>

</body>
</html>
```

- [ ] **Step 3: Verify**

```bash
python -m http.server 8099 &>/dev/null &
SERVER_PID=$!
sleep 1
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:8099/pricing/
grep -c "budgetwebsite.in" pricing/index.html
grep -c "₹8,000" pricing/index.html
grep -c "Coming Soon" pricing/index.html
kill $SERVER_PID
```
Expected: `200`, `0`, `1` or more, `15` (one per tool card)

- [ ] **Step 4: Commit**

```bash
git add pricing/index.html
git commit -m "feat: add /pricing page — tiers, terms, AMC, 15 tools coming-soon, quote form"
```

---

### Task 6: Trim `code.gs` — remove waitlist backend

**Files:**
- Modify: `code.gs` (this file is `.gitignore`'d in this repo, same as `admin.html` — it is a **local-only working file**, never committed to git. Do not `git add` it. If it does not exist yet on disk in this working directory, copy it from `../budgetwebsite_handoff for lekhraj/code.gs` first — that copy has the original untrimmed content — and say so explicitly in your report; that is expected, not an anomaly to hide.)

- [ ] **Step 1: Write the failing check**

```bash
test -f code.gs && grep -c "FORM 1: WAITLIST" code.gs || echo "code.gs not found on disk — copy it from ../budgetwebsite_handoff for lekhraj/code.gs first, then re-run this check"
```
Expected: `1` (file exists on disk with the original waitlist content, not yet removed). If you see the "not found" message, copy the file as instructed above, then re-run this exact command before proceeding to Step 2.

- [ ] **Step 2: Replace `code.gs`**

```javascript
// ─────────────────────────────────────────────────────────────
//  BUDGET WEBSITE BACKEND — Google Apps Script
//  Handles: custom quote requests, website briefs.
//  Deploy as Web App: Execute as "Me", Access "Anyone".
// ─────────────────────────────────────────────────────────────

const SHEET_ID   = '1pP_aOYntmXLzOHDUes53puytNQrnv03C5O7H0-1YkhE';
const NOTIFY_EMAIL = 'budgetwebsitein@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.openById(SHEET_ID);

    // ── WEBSITE BRIEF ──
    if (data.form === 'brief') {
      let briefs = ss.getSheetByName('Briefs');
      if (!briefs) {
        briefs = ss.insertSheet('Briefs');
        briefs.appendRow(['Timestamp', 'Name / WA', 'Business', 'What they do', 'Services', 'Logo', 'Photos', 'Photos link', 'Testimonial', 'Domain', 'Customer', 'Inspiration']);
      }
      briefs.appendRow([
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        data.name       || '',
        data.biz        || '',
        data.what       || '',
        data.services   || '',
        data.logo       || '',
        data.photos     || '',
        data.photosLink || '',
        data.review     || '',
        data.domain     || '',
        data.customer   || '',
        data.inspo      || ''
      ]);

      try {
        MailApp.sendEmail({
          to: NOTIFY_EMAIL,
          subject: `📋 New website brief — ${data.biz || 'Unknown'}`,
          body: [
            `New website brief submitted.`,
            ``,
            `Name / WA    : ${data.name       || '—'}`,
            `Business     : ${data.biz        || '—'}`,
            `What they do : ${data.what       || '—'}`,
            `Services     : ${data.services   || '—'}`,
            `Logo         : ${data.logo       || '—'}`,
            `Photos       : ${data.photos     || '—'} ${data.photosLink || ''}`,
            `Testimonial  : ${data.review     || '—'}`,
            `Domain       : ${data.domain     || '—'}`,
            `Customer     : ${data.customer   || '—'}`,
            `Inspiration  : ${data.inspo      || '—'}`,
            ``,
            `Check the Briefs tab in your Google Sheet.`
          ].join('\n')
        });
      } catch (_) {}

      return json({ success: true });
    }

    // ── CUSTOM QUOTE REQUEST ──
    if (data.form === 'quote') {
      let quotes = ss.getSheetByName('Quotes');
      if (!quotes) {
        quotes = ss.insertSheet('Quotes');
        quotes.appendRow(['Timestamp', 'Name', 'WhatsApp', 'Business', 'Requirement']);
      }
      quotes.appendRow([
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        data.name || '',
        data.phone || '',
        data.biz  || '',
        data.req  || ''
      ]);

      try {
        MailApp.sendEmail({
          to: NOTIFY_EMAIL,
          subject: `💬 New custom quote request — ${data.biz || data.name || 'Unknown'}`,
          body: [
            `New custom quote request submitted.`,
            ``,
            `Name       : ${data.name  || '—'}`,
            `WhatsApp   : ${data.phone || '—'}`,
            `Business   : ${data.biz   || '—'}`,
            `Requirement: ${data.req   || '—'}`,
            ``,
            `Check the Quotes tab in your Google Sheet.`
          ].join('\n')
        });
      } catch (_) {}

      return json({ success: true });
    }

    return json({ success: false, error: 'Unknown form type' });
  } catch (err) {
    return json({ success: false, error: err.message });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

- [ ] **Step 3: Verify**

```bash
grep -c "FORM 1: WAITLIST" code.gs; grep -c "doGet" code.gs; grep -c "form === 'quote'" code.gs; grep -c "form === 'brief'" code.gs
```
Expected: `0`, `0`, `1`, `1`

- [ ] **Step 4: Do NOT commit `code.gs` to git**

`code.gs` is `.gitignore`'d by design (same treatment as `admin.html`) — there is nothing to `git add` or `git commit` for this file. Confirm it stays untracked:

```bash
git status --short --ignored | grep code.gs
```
Expected: `!! code.gs` (ignored, not staged, not committed). If `git status --short` (without `--ignored`) shows `code.gs` at all, something added it against `.gitignore` — run `git rm --cached code.gs` to fix it, do not commit.

> **For the human running this plan:** `code.gs` lives in Google Apps Script, not this git repo — after this task, paste the updated file into the Apps Script editor and redeploy the web app manually. This local, untracked file is the source-of-truth copy to paste from.
>
> **Plan correction (post-Task-6-review):** the original version of this task incorrectly assumed `code.gs` was already a tracked file in this repo with the old waitlist content present, and told the implementer to `git add` + commit it. Neither was true — `.gitignore` has excluded `code.gs` (alongside `admin.html`) since this repo's first commit. Steps 1 and 4 above are corrected to reflect that: copy the reference content in from the handoff folder if it's missing (openly, not silently), edit it in place, and never commit it.

---

### Task 7: Re-skin `blog/index.html`, `blog/why-small-businesses-in-india-need-a-website.html`, `form2.html`

**Files:**
- Modify: `blog/index.html`
- Modify: `blog/why-small-businesses-in-india-need-a-website.html`
- Modify: `form2.html`

- [ ] **Step 1: Write the failing check**

```bash
grep -l "budgetwebsite.in" blog/index.html blog/why-small-businesses-in-india-need-a-website.html form2.html
```
Expected: all three files listed

- [ ] **Step 2: Replace `blog/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog | Budget Website — Website Tips for Small Businesses in India</title>
<meta name="description" content="Practical advice on websites, digital presence, and growing your small business online in India. From the team at Budget Website.">
<meta name="keywords" content="small business website tips India, affordable website design blog, budget website India, website advice for local business">
<link rel="canonical" href="https://www.budgetwebsite.store/blog/">
<meta property="og:title" content="Blog | Budget Website">
<meta property="og:description" content="Practical advice on websites and growing your small business online in India.">
<meta property="og:image" content="https://www.budgetwebsite.store/logo-512.png">
<meta property="og:url" content="https://www.budgetwebsite.store/blog/">
<meta property="og:type" content="website">
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
</head>
<body>

<nav>
  <a href="/" class="nav-logo">budget<span>website</span>.store</a>
  <a href="/#contact" class="nav-cta">Get Your Website →</a>
</nav>

<section style="padding-top:40px;max-width:900px;">
  <div class="section-label">The Blog</div>
  <h1 class="section-title">Website & Growth Tips<br>for Small Businesses in India</h1>
  <p class="section-sub" style="margin-bottom:50px;">Practical, no-fluff advice on getting your business online — written for shop owners, not developers.</p>

  <div style="display:flex;flex-direction:column;gap:20px;">
    <a href="why-small-businesses-in-india-need-a-website.html" class="portfolio-card" style="padding:28px 30px;">
      <div class="section-label" style="margin-bottom:10px;">Latest</div>
      <div class="portfolio-name" style="font-size:22px;margin-bottom:8px;">Why Every Small Business in India Needs a Website (And Why It Doesn't Have to Cost a Fortune)</div>
      <div class="portfolio-cat" style="font-size:14.5px;line-height:1.7;">India runs on small businesses — yet most of them still don't have a website. Here's why that's costing them customers, and how a budget website changes the game.</div>
    </a>
  </div>
</section>

<footer>
  <div class="footer-logo">budget<span>website</span>.store</div>
  <p>© 2026 · Built in a day, just like yours will be.</p>
</footer>

</body>
</html>
```

- [ ] **Step 3: Replace `blog/why-small-businesses-in-india-need-a-website.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Why Every Small Business in India Needs a Website | Budget Website</title>
<meta name="description" content="India has over 60 million small businesses, and most still don't have a website. Here's why an affordable website matters more than ever — and how a budget website design can help any local business compete online.">
<meta name="keywords" content="why small business needs a website, small business website India, affordable website design India, budget website for local business, importance of website for small business">
<link rel="canonical" href="https://www.budgetwebsite.store/blog/why-small-businesses-in-india-need-a-website.html">
<meta property="og:title" content="Why Every Small Business in India Needs a Website">
<meta property="og:description" content="India runs on small businesses — yet most of them still don't have a website. Here's why that's costing them customers.">
<meta property="og:image" content="https://www.budgetwebsite.store/logo-512.png">
<meta property="og:url" content="https://www.budgetwebsite.store/blog/why-small-businesses-in-india-need-a-website.html">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="../favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="../favicon-16.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../styles.css">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Why Every Small Business in India Needs a Website (And Why It Doesn't Have to Cost a Fortune)",
  "description": "India has over 60 million small businesses, and most still don't have a website. Here's why an affordable website matters more than ever.",
  "author": { "@type": "Organization", "name": "Budget Website" },
  "publisher": { "@type": "Organization", "name": "Budget Website", "logo": { "@type": "ImageObject", "url": "https://www.budgetwebsite.store/logo-512.png" } },
  "datePublished": "2026-07-05",
  "mainEntityOfPage": "https://www.budgetwebsite.store/blog/why-small-businesses-in-india-need-a-website.html"
}
</script>
<style>
  article { max-width: 720px; margin: 0 auto; padding: 60px 24px 40px; }
  .back-link { display: inline-block; font-size: 13px; color: var(--terracotta); text-decoration: none; margin-bottom: 24px; }
  .back-link:hover { text-decoration: underline; }
  .post-date { font-size: 12px; color: var(--terracotta); font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 16px; }
  article h1 {
    font-family: 'Fraunces', serif; font-weight: 700; font-size: clamp(28px, 6vw, 42px);
    color: var(--ink); letter-spacing: -0.3px; line-height: 1.2; margin-bottom: 28px;
  }
  article h2 {
    font-family: 'Fraunces', serif; font-weight: 700; font-size: clamp(20px, 4vw, 26px);
    color: var(--ink); letter-spacing: -0.2px; margin: 40px 0 16px;
  }
  article p { font-size: 16px; line-height: 1.8; color: var(--ink-soft); margin-bottom: 18px; }
  article p.lead { font-size: 18px; color: var(--ink-soft); line-height: 1.7; }
  article strong { color: var(--ink); font-weight: 600; }
  article ul { margin: 0 0 18px 20px; }
  article li { font-size: 16px; line-height: 1.8; color: var(--ink-soft); margin-bottom: 8px; }
  a.inline-link { color: var(--terracotta); text-decoration: underline; }
  .cta-box {
    background: var(--card); border: 1px solid var(--terracotta); border-radius: 12px;
    padding: 32px; margin: 40px 0; text-align: center;
  }
  .cta-box p { color: var(--ink-soft); margin-bottom: 16px; }
  .cta-btn {
    display: inline-block; background: var(--terracotta); color: #fff;
    font-weight: 800; font-size: 14px; padding: 14px 30px; border-radius: 6px; text-decoration: none;
  }
  @media (max-width: 600px) { article { padding: 40px 20px 20px; } }
</style>
</head>
<body>

<nav>
  <a href="/" class="nav-logo">budget<span>website</span>.store</a>
  <a href="/#contact" class="nav-cta">Get Your Website →</a>
</nav>

<article>
  <a href="index.html" class="back-link">← Back to Blog</a>
  <div class="post-date">Published July 5, 2026</div>
  <h1>Why Every Small Business in India Needs a Website (And Why It Doesn't Have to Cost a Fortune)</h1>

  <p class="lead">India has over 60 million small businesses — kirana stores, salons, gyms, tailors, tiffin services, car rentals, event planners, and thousands of other local shops that keep every neighbourhood running. And yet, the vast majority of them still don't have a website.</p>

  <p>Not because they don't need one. Because for years, getting a website meant one of two things: paying an agency ₹50,000–₹1,00,000 and waiting three weeks for a result you might not even like, or not having one at all. Most small business owners chose the second option — not out of choice, but because the first one never made sense for a shop doing a few lakhs a month in revenue.</p>

  <p>That gap is exactly why a huge number of local businesses in India are invisible online, even when they're thriving offline.</p>

  <h2>Your Customers Are Already Searching Online</h2>
  <p>Whether it's someone searching "salon near me," a bride-to-be looking up car rental services for her wedding, or a parent comparing gyms in the neighbourhood — the very first stop today is Google or Instagram, not word of mouth. If your business doesn't show up with a clean, credible website, you've already lost that customer to whoever does show up — even if your service is better.</p>

  <p>A website isn't a luxury add-on anymore. It's the modern equivalent of a shop signboard — except this one works 24 hours a day, reaches people well outside your immediate area, and does a lot of the convincing for you before a customer even walks in or calls.</p>

  <h2>"Looking Professional" Is Not About Being Big</h2>
  <p>One of the biggest myths small business owners believe is that a website is only for "big" companies. In reality, the opposite is often more true — a clean, professional website is what lets a small, local business look every bit as credible as a much larger competitor.</p>

  <p>Think about it from the customer's side: when they see a business with a real website — clear services, real photos, a way to contact you instantly — they trust it more, even if it's a two-person operation. <strong>A good website doesn't just represent your business. It elevates it.</strong></p>

  <h2>Why Cost Has Been the Real Barrier</h2>
  <p>Traditional web design in India has been priced for corporates, not corner shops. Agencies quote based on hourly rates, long discovery calls, and multiple rounds of revisions — all of which adds up fast, even for a simple 4-5 page site.</p>

  <p>That pricing model was never built with India's actual small business landscape in mind — where most owners are running tight margins and simply need something that works, looks good, and doesn't take a month to go live.</p>

  <h2>The Budget Website Approach</h2>
  <p>This is exactly the gap <a href="/" class="inline-link">Budget Website</a> was built to close. Instead of long timelines and agency-style pricing, we build real, professional websites for small businesses — <strong>delivered in a single day</strong>, starting at just ₹8,000.</p>

  <ul>
    <li>No long back-and-forth — just a short call to understand your business</li>
    <li>Built and live within a day, not weeks</li>
    <li>Mobile-friendly, fast, and built to actually bring in customers</li>
    <li>Pricing that scales with what you actually need — not a flat "agency rate"</li>
  </ul>

  <p>Whether you run a salon, a gym, a car rental service, a tiffin business, or any other local operation — a website is one of the highest-leverage investments you can make in your business, and it no longer has to cost what it used to.</p>

  <div class="cta-box">
    <p><strong>Ready to get your business online?</strong> See real pricing and real websites we've built for other local businesses.</p>
    <a href="/pricing/" class="cta-btn">See Pricing →</a>
  </div>

  <p>India's small businesses built this economy. It's time they showed up online the way they deserve to.</p>
</article>

<footer>
  <div class="footer-logo">budget<span>website</span>.store</div>
  <p>© 2026 · Built in a day, just like yours will be.</p>
</footer>

</body>
</html>
```

- [ ] **Step 4: Edit `form2.html`**

Read the file first (it's 325 lines — the field markup, IDs, and `submitBrief()` script stay exactly as-is). Apply these exact substitutions only:
- `<title>Website Brief — budgetwebsite.in</title>` → `<title>Website Brief — budgetwebsite.store</title>`
- Delete the entire inline `<style>...</style>` block (lines 13–152 of the original file) and replace it with:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
  <style>
    .top-bar { background: var(--cream-alt); border-bottom: 1px solid var(--border); padding: 16px 24px; display: flex; align-items: center; gap: 12px; }
    .top-bar p { font-size: 13px; color: var(--muted); }
    .logo { font-family: 'Fraunces', serif; font-weight: 700; font-size: 20px; color: var(--ink); }
    .logo span { color: var(--terracotta); }
    .wrapper { max-width: 680px; margin: 0 auto; padding: 48px 24px 80px; }
    .hero-label { font-size: 11px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: var(--terracotta); margin-bottom: 12px; }
    .hero-title {
      font-family: 'Fraunces', serif; font-weight: 700; font-size: clamp(30px, 6vw, 42px);
      line-height: 1.2; color: var(--ink); letter-spacing: -0.3px; margin-bottom: 16px;
    }
    .hero-title span { color: var(--terracotta); }
    .field { display: flex; flex-direction: column; gap: 8px; margin-bottom: 28px; }
    .field-num { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--terracotta); }
    .field label { font-size: 16px; font-weight: 600; color: var(--ink); line-height: 1.4; }
    .field .hint { font-size: 13px; color: var(--muted); margin-top: -4px; }
    .field input, .field select, .field textarea {
      background: var(--card); border: 1px solid var(--border); color: var(--ink); border-radius: 8px;
      padding: 14px 18px; font-size: 15px; font-family: 'Inter', sans-serif; outline: none; width: 100%; resize: vertical;
    }
    .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--terracotta); }
    .optional-tag { display: inline-block; background: var(--cream-alt); color: var(--muted); font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; padding: 3px 8px; border-radius: 3px; margin-left: 8px; }
    .divider { border: none; border-top: 1px solid var(--border); margin: 4px 0 28px; }
    .btn-submit {
      background: var(--terracotta); color: #fff; font-weight: 800; font-size: 16px; letter-spacing: 0.5px;
      padding: 18px 40px; border-radius: 8px; border: none; cursor: pointer; width: 100%; font-family: 'Inter', sans-serif;
    }
    .btn-submit:hover { background: var(--terracotta-deep); }
    .submit-note { font-size: 12px; color: var(--muted); text-align: center; margin-top: 12px; }
    .success-box { display: none; background: var(--terracotta-dim); border: 1px solid var(--terracotta); border-radius: 12px; padding: 48px 32px; text-align: center; }
    .success-box .check { font-size: 48px; margin-bottom: 16px; }
    .success-box h2 { font-family: 'Fraunces', serif; font-weight: 700; font-size: clamp(26px, 5vw, 34px); color: var(--ink); margin-bottom: 12px; }
    .success-box p { font-size: 15px; color: var(--ink-soft); line-height: 1.7; }
  </style>
  ```
- Replace the top-bar logo `<div class="logo">budget<span>website</span>.in</div>` → `<div class="logo">budget<span>website</span>.store</div>` (keep the `<p>Website Brief · Step 2 of 2</p>` next to it unchanged)
- Leave every `<div class="field">` block, every input/select/textarea `id`, the `.success-box` markup, and the entire `<script>...submitBrief()...</script>` block byte-for-byte unchanged, **with exactly ONE exception**: the `SCRIPT_URL` line's trailing comment currently reads `// same Apps Script URL as index.html` — this is stale, since Task 3 removed `SCRIPT_URL` from `index.html` entirely (it now only lives in `pricing/index.html` and here). Update that one comment to `// same Apps Script URL as pricing/index.html`. Nothing else in the script block changes.

> **Plan correction (post-Task-7-review):** the replacement style block above originally omitted `.logo`, `.logo span`, `.hero-label`, and `.hero-title` — classes the untouched HTML body still uses (`<div class="logo">`, `<div class="hero-label">`, `<h1 class="hero-title">`) but that neither this local style block nor `styles.css` defined, leaving those three elements rendering in unstyled generic Inter with no branding. Caught by spec-compliance review, verified via live computed-style inspection, and added above (Fraunces serif + terracotta accents, translated from the original page's `.logo`/`.hero-title`/`.hero-label` rules). `.hero-sub` was unaffected — it happens to already exist as a shared class in `styles.css`.

- [ ] **Step 5: Verify**

```bash
grep -rl "budgetwebsite.in" blog/index.html blog/why-small-businesses-in-india-need-a-website.html form2.html
echo "exit code: $?"
```
Expected: no output, `exit code: 1` (grep found nothing)

- [ ] **Step 6: Commit**

```bash
git add blog/index.html blog/why-small-businesses-in-india-need-a-website.html form2.html
git commit -m "refactor: re-skin blog + brief-intake form to shared design system, .store domain"
```

---

### Task 8: Update `sitemap.xml` and `robots.txt`

**Files:**
- Modify: `sitemap.xml`
- Modify: `robots.txt`

- [ ] **Step 1: Write the failing check**

```bash
grep -c "budgetwebsite.in" sitemap.xml robots.txt
```
Expected: non-zero for both

- [ ] **Step 2: Replace `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.budgetwebsite.store/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.budgetwebsite.store/portfolio/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.budgetwebsite.store/pricing/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.budgetwebsite.store/blog/</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.budgetwebsite.store/blog/why-small-businesses-in-india-need-a-website.html</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Replace `robots.txt`**

```
User-agent: *
Allow: /
Disallow: /form2.html

Sitemap: https://www.budgetwebsite.store/sitemap.xml
```

- [ ] **Step 4: Verify**

```bash
grep -c "budgetwebsite.in" sitemap.xml robots.txt
grep -c "portfolio" sitemap.xml
grep -c "pricing" sitemap.xml
```
Expected: `0` and `0`, then `1`, `1`

- [ ] **Step 5: Commit**

```bash
git add sitemap.xml robots.txt
git commit -m "chore: update sitemap/robots for .store domain and new /portfolio /pricing routes"
```

---

### Task 9: Full-site verification sweep

**Files:** none (verification only)

- [ ] **Step 1: Grep sweep for banned strings across the whole repo**

```bash
grep -rn "budgetwebsite\.in" --include="*.html" --include="*.xml" --include="*.txt" --include="*.js" . || echo "CLEAN: no .in references"
grep -rn "30 [Dd]ays\?" --include="*.html" . || echo "CLEAN: no 30-day references"
grep -rn "waitlist\|Waitlist\|Live Queue" --include="*.html" --include="*.js" --include="*.gs" . || echo "CLEAN: no waitlist references"
grep -rn "8DC63F" --include="*.html" --include="*.css" . || echo "CLEAN: no old green accent"
grep -rn "TODO-CONFIRM-GALLERY-URL" --include="*.html" . && echo "BLOCKED: gallery URL placeholder still unresolved — confirm real URL before shipping" || echo "CLEAN: gallery URL confirmed"
```
Expected: `CLEAN:` on the first four checks. The fifth check is expected to print `BLOCKED:` until the real gallery catalog URL is confirmed and substituted in — do not ship with this unresolved.

- [ ] **Step 2: Route smoke test**

```bash
python -m http.server 8099 &>/dev/null &
SERVER_PID=$!
sleep 1
for route in "/" "/portfolio/" "/pricing/" "/blog/" "/blog/why-small-businesses-in-india-need-a-website.html" "/form2.html" "/styles.css" "/portfolio-data.js" "/sitemap.xml" "/robots.txt"; do
  code=$(curl -o /dev/null -s -w "%{http_code}" "http://localhost:8099${route}")
  echo "${route} -> ${code}"
done
kill $SERVER_PID
```
Expected: `200` for every route

- [ ] **Step 3: Manual browser verification**

Using the Browser pane tool (`preview_start` with `{url: "http://localhost:8099"}` after starting the local server per Step 2), visually confirm:
- Home page renders in the warm cream/terracotta palette, no dark background, no day-counter, no waitlist section
- `/portfolio` shows all 4 real entries, newest (Budget Website) first, no empty placeholder cards
- `/pricing` shows all 4 tiers with correct amounts (₹8,000 / ₹15,000 / ₹25,000 / ₹50,000+), the Terms block verbatim, AMC section, and all 15 tools grouped with "Coming Soon" badges
- Footer "See What's Possible" link is present on every page
- Resize to mobile width (375px) — nav stays usable, pricing/portfolio grids collapse to single column
- Fill and submit the quote form on `/pricing` — confirm the success message shows (network call itself will fail locally since it's not deployed, but the UI success-state swap should still trigger since the fetch uses `mode: 'no-cors'` and doesn't throw on non-2xx)

- [ ] **Step 4: Final commit**

```bash
git log --oneline -10
git status
```
Expected: clean working tree, 8 feature commits since the initial clone, nothing pending

---

## Deferred (not in this plan)

- **Item E — the 15 AI tools themselves:** pricing page ships them as "Coming Soon" only. Real product build needs its own spec.
- **Item F — sales-call-brief Claude-assisted automation:** process/workflow track, not a website change.
- **Gallery URL:** Task 3's footer link uses a placeholder target (`https://TODO-CONFIRM-GALLERY-URL.example`) — confirm the real live URL for the 18×4 mockup catalog before this ships, and update the `href` in `index.html`, `portfolio/index.html`, and `pricing/index.html` footers accordingly (3 occurrences).
- **Real portfolio list:** `portfolio-data.js` ships with only the 4 confirmed entries. Confirm/add any additional real, live-domain sites before or after ship — the data file is structured so this is a pure data edit, no code changes needed.
- **Parallel action item:** correct the in-flight 18×4 MiniMax catalog's entry tier from ₹10,000 to ₹8,000 to stay consistent with this pricing page (tracked separately, does not block this plan).
