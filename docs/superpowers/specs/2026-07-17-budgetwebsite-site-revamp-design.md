---
title: "budgetwebsite.store — Site Revamp Design"
status: approved
date: 2026-07-17
owner: Lekhraj (build), Samar (brief/sales)
source_brief: "Lekhraj_Website_Brief.pdf, shared by Samar — not tracked in this repo. Local copy: Website Project/budgetwebsite_handoff for lekhraj/Lekhraj_Website_Brief.pdf"
---

# Budget Website — Site Revamp Design

## 1. Context

Samar compiled an internal brief (`Lekhraj_Website_Brief.pdf`) listing 6 changes for `budgetwebsite.store`. Nothing on the live site currently reflects it — the site is still running the discontinued "30 days, 30 websites" challenge branding, old pricing (₹5k/8k/12k/15k), and a hardcoded `.in` domain identity despite being live at `.store`.

The brief's 6 items decompose into 5 loosely-coupled pieces of work. This spec covers the first slice only:

| # | Piece | In this spec? |
|---|---|---|
| A | Kill 30-day branding, fix domain/meta | Yes |
| B | New portfolio page | Yes |
| C | New pricing page | Yes |
| D | Link the existing 18×4 mockup gallery, low-key | Yes |
| E | The 15 AI tools (real product build) | **No** — separate spec later |
| F | Sales-call-brief automation (process, not site) | **No** — separate track, not a website task |

## 2. Decisions locked in during brainstorming

- **Canonical domain:** `budgetwebsite.store`. Every `.in` reference (canonical URL, OG tags, JSON-LD, sitemap.xml, robots.txt, nav logo text, footer text) gets swept to `.store`.
- **Pricing tiers:** ₹8,000 / ₹15,000 / ₹25,000 / Custom (₹50,000+) — per Samar's brief. This is authoritative over the ₹10,000 entry tier currently used in the in-flight 18×4 MiniMax catalog rebuild (see §8, parallel action item).
- **Site structure:** multi-page. `/portfolio` and `/pricing` become real routes (not anchor sections) so Samar can share a clean direct pricing link, per the brief's explicit ask.
- **Waitlist / "Live Queue" section:** removed entirely. It's built on the same 30-slot scarcity mechanic the brief discontinues; replaced with a direct CTA into the existing WhatsApp/contact flow.
- **Portfolio scope:** every site Lekhraj has delivered that has a live domain name, not only the ones sold through Samar's call pipeline. Final list to be confirmed by Lekhraj before ship (see §7).
- **Portfolio vs. mockup gallery:** kept **separate**, per Samar's original design — `/portfolio` is real work, prominent, newest-first. The 18×4 mockup catalog stays a quiet footer link ("See What's Possible"), not merged into the main portfolio, not a primary CTA. This was raised explicitly as a point of tension during brainstorming and resolved in favor of Samar's original placement guidance.
- **15 AI tools on the pricing page:** listed as **"Coming Soon"** — full name/description/₹5,000 price shown so Samar can start pitching them, no live purchase flow.
- **Gallery link timing:** goes live now against the in-progress catalog rebuild; content fills in as the rebuild progresses rather than waiting for all 18 categories to finish.
- **Visual direction:** "Warm Trustworthy Local Studio" (see §4) — chosen over "Premium Minimal Boutique" and "Bold India-Vibrant" alternatives as lowest-risk, best fit for the audience (small Indian business owners / BNI-networking types) and most consistent with the "real proof, real photos" portfolio story.

## 3. Site architecture

Stays static HTML/CSS/JS — no framework, no build step — consistent with the current implementation and Vercel static hosting.

```
/                    Home: hero, how-it-works, why-us, 3-item portfolio teaser
                     (links to /portfolio), 4-tier pricing teaser (links to /pricing),
                     contact CTA. No day-counter. No waitlist section.
/portfolio           Full real-work list, newest first.
/pricing             Tiers, terms & conditions, AMC, 15-tools "Coming Soon", quote form.
/blog/               Unchanged content, re-skinned to match new visual system.
/form2.html          Brief intake form — unchanged functionality, re-skinned.
(footer link)        → external: existing 18×4 mockup gallery deployment (not in this repo).
```

## 4. Visual system — "Warm Trustworthy Local Studio"

Replaces the current dark-background / lime-green (`#8DC63F`) / glowing-orb "AI-SaaS" aesthetic, which was flagged as generic, audience-mismatched, and needing a palette change.

- **Background:** warm off-white/cream (`~#FAF5EE`), not stark white, not black.
- **Text:** dark charcoal (`~#2A241E`), not pure black.
- **Primary accent:** deep terracotta (`~#C1522E`) — replaces green for CTAs, links, highlights.
- **Secondary accent:** muted deep indigo, used sparingly for badges/contrast.
- **Typography:** a confident display face (serif/slab-serif leaning) for headlines instead of the current geometric tech-sans; a clean readable sans for body copy. Signals "craft studio," not "SaaS dashboard."
- **Imagery:** real photography of the actual portfolio businesses replaces the gradient-orb / glow decoration — front and center on home and portfolio cards.
- **Motion:** minimal — simple hover states only. Drop the shimmer/glow box-shadow animations; they read as "AI product," not "local studio."

## 5. Page-by-page content plan

**Home (`/`)**
- Hero: keep the "built in a day, priced fair" positioning; drop "30 days" framing from all copy.
- How It Works / Why Us: keep structure, re-skin only.
- Portfolio teaser: 3 newest real builds, "See all work →" to `/portfolio`.
- Pricing teaser: 4 tier cards (condensed), "See full pricing & terms →" to `/pricing`.
- Contact CTA band: unchanged mechanically (WhatsApp deep link), re-skinned.
- Footer: add low-key "See What's Possible" link to the mockup gallery.

**`/portfolio`**
- Newest-first list of every real, live-domain site Lekhraj has delivered (see §7 for the list-confirmation step).
- No empty "Could Be Yours" placeholder slots — those belonged to the day-counter gimmick and are dropped along with it.
- Each card: real screenshot/photo, business name, category, link out to the live site.

**`/pricing`**
- Four tier cards: Starter ₹8,000 / Standard ₹15,000 / Premium ₹25,000 / Custom ₹50,000+.
- Custom tier copy explicitly spans from lighter custom builds (e.g. WhatsApp-cart restaurant menus) up through heavy e-commerce/payment-gateway work — not capped at lightweight-only, per Samar's correction.
- Terms & Conditions block, verbatim per brief: *"Once full payment is received, the job is considered complete. Any changes requested after that are ₹500 per session. Sessions are scheduled within a week of request, and confirmed within 24 hours of the request being made."*
- AMC section: carried forward from current site (₹6,000/year, tiers "being finalized") unless Samar has since finalized numbers.
- Add-ons section: SEO as paid line item; 15 AI tools listed "Coming Soon" at ₹5,000 each, grouped as in the brief (Finance & Ops Essentials / Sales & Lead Tools / Marketing Tools / Standout-Novel / Website & Content).
- Custom quote form: same fields/flow as current site.

## 6. Backend / forms

`code.gs` (Google Apps Script) currently handles three form types: waitlist, quote, brief.

- **Waitlist branch:** removed, since the waitlist section is gone.
- **Quote branch:** unchanged, but needs to work correctly now that the form lives on `/pricing` rather than a homepage anchor.
- **Brief branch (`form2.html`):** unchanged.
- `admin.html` (waitlist admin dashboard) is a local-only file, not present in this repo. Since the waitlist feature is being removed, this file becomes dead weight — flagging for removal, not fixing. (Aside: it currently hardcodes its admin password as a plain client-side JS string, visible via view-source — moot once removed, but noting it since it exists today in the handoff folder.)

## 7. Content gaps — need confirmation before ship

- **Real portfolio list:** Lekhraj to confirm/correct the final list of sites-with-live-domains before it ships; some candidates (e.g. other client or personal-venture sites) weren't sold through Samar's pipeline and need a sanity pass on inclusion.
- **AMC numbers:** carrying forward "₹6,000/year, tiers being finalized" as-is unless Samar has finalized actual tier pricing since the brief was written.
- **Mockup gallery deployment URL:** confirm the current live URL for the 18×4 catalog before wiring the footer link.

## 8. Parallel action item (not blocking this spec)

The 18-category × 4-tier MiniMax catalog rebuild currently in progress uses a ₹10,000 entry tier; this spec's pricing (§2) fixes the entry tier at ₹8,000 per Samar's brief. The catalog rebuild needs its tier-1 pricing corrected to ₹8,000 to stay consistent with the pricing page this spec ships. Tracked separately — does not block A/B/C/D.

## 9. Testing plan

- All internal links (`/`, `/portfolio`, `/pricing`, `/blog/`, footer gallery link) resolve with no 404s.
- Both forms (quote on `/pricing`, brief on `/form2.html`) submit successfully to the trimmed `code.gs` and land in the correct Google Sheet tab.
- No remaining `.in` references anywhere in source (meta tags, JSON-LD, sitemap, robots.txt, visible copy).
- No remaining "30 day(s)" / "30 website(s)" / day-counter copy anywhere in source.
- Mobile responsive check on `/`, `/portfolio`, `/pricing` at common breakpoints (small phone, tablet, desktop) — the current site has prior small-phone nav-compaction work that should carry forward.
- Light visual QA against the new palette (contrast, readability) in both the hero and pricing-tier cards.

## 10. Out of scope (this spec)

- The 15 AI tools themselves (item E) — separate spec, real product build.
- Sales-call-brief Claude-assisted automation (item F) — process/workflow track, not a website feature.
- Any change to the 18×4 mockup catalog's own design/content beyond the entry-tier price correction noted in §8.
