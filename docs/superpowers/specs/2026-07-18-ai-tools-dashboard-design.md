---
title: "AI Tools Dashboard — Design"
status: approved
date: 2026-07-18
owner: Lekhraj (build), Samar (sales/BNI relationships)
---

# AI Tools Dashboard — Design

## 1. Context

`budgetwebsite.store`'s pricing page already lists 15 tools as "Coming Soon" (₹5,000 each) — GST Invoice Generator, Quotation Builder, Expense Tracker, Salary Slip Generator, Lead Tracker, Follow-Up Reminder, Cold Message Writer, WhatsApp Broadcast Writer, Instagram Caption Generator, Google Review Reply Generator, Festival Offer Message Generator, Business Card Scanner, Blog Post Writer, About Us Page Writer, Google My Business Post Writer. This spec covers the actual product build behind that "Coming Soon" state (deferred item E from the [site-revamp plan](../plans/2026-07-17-site-revamp.md)).

**Market sizing.** A BNI Mumbai member-directory analysis (see `wiki/analyses/bni-mumbai-378-categories-2026-07-18.csv`, full 378-row dataset) puts the addressable market at 6,847 members across 27 sectors and 378 specific business categories. 60% (4,078 members) functionally need a website today (bad/expired/no site). 646 prospects sit across the 18 categories with a website template already built — zero new template work needed to pitch them. 143 additional categories with 10+ members each have no template yet, led by Manufacturing (Other) 228, Retail (Other) 118, Mutual Funds 116, Dentist 114, Finance & Insurance (Other) 113. This dataset is the target customer base for the tools dashboard, not just Samar's individual leads — most of the 378 categories need generic back-office/CRM tools regardless of sector; a handful need category-specific content tools.

## 2. Positioning

Sold as a productivity SaaS to small/medium BNI-network businesses — "decrease daily overload, increase productivity" is the pitch. AI is an implementation detail for a subset of tools, not the headline; most of the catalog is plain CRUD software.

## 3. Tool catalog — 26 tools across 4 groups

**Original 15** (unchanged from the pricing page):
- Finance & Ops (4): GST Invoice Generator, Quotation/Estimate Builder, Expense Tracker, Salary Slip Generator
- Sales & Lead (3): Lead Tracker, Follow-Up Reminder Tool, Cold Message Writer
- Marketing (4): WhatsApp Broadcast Writer, Instagram Caption Generator, Google Review Reply Generator, Festival Offer Message Generator
- Standout (1): Business Card Scanner + Contact Saver
- Website & Content (3): Blog Post Writer, About Us Page Writer, Google My Business Post Writer

**New: CRM Suite** (4, separate purchasable module, does not replace Lead Tracker): Contact/Customer database, Deal/Pipeline tracker (New → Contacted → Quoted → Won/Lost), Interaction history & notes per contact. (Follow-Up Reminder Tool from the original 15 pairs with this suite but stays counted there.)

**New: Admin/Ops Suite** (7): Appointment/Booking Scheduler, Staff Attendance Tracker, Inventory/Stock Tracker, Vendor/Supplier Tracker, Document Storage, Recurring Payment/Renewal Reminder, Digital Business Card / vCard generator.

**AI-need split** (carries over from the original 15's analysis, applies to the new tools too): GST Invoice Generator, Quotation Builder, Expense Tracker, Salary Slip Generator, Lead Tracker, Follow-Up Reminder, and the entire CRM Suite and Admin/Ops Suite are plain form-and-database tools with **no AI/LLM cost**. Only the 8 writing tools (Cold Message, WhatsApp Broadcast, Instagram Caption, Google Review Reply, Festival Offer, Blog Post, About Us, GMB Post) plus Business Card Scanner (vision/OCR) carry inference cost.

## 4. Architecture

- **Backend:** Supabase (Postgres + auth + Row-Level Security) — same stack as NutriCart, Sukhija Estate, and NJ Mart. RLS maps directly onto "which tools has this customer unlocked."
- **Payments:** Razorpay — handles flat-rate self-serve purchases and can register custom-quote invoices for the value-based tier.
- **Delivery:** one shared dashboard shell (single login/account). Purchased tools mount as modules inside it, rather than 26 standalone pages with separate access control.

## 5. Pricing — two lanes

- **Self-serve flat rate**, ₹5,000/tool (already published on the pricing page) — for the bulk of the 6,847-member base: dentists, single-person practices, freelancers, small retailers. No negotiation, no custom scoping.
- **Custom/value-based**, up to 25% of measurable savings delivered to the client — for larger accounts where a tool's impact is big enough to quantify (manufacturing, finance/insurance, real estate). Routed through the existing ₹50,000+ Custom tier already on the pricing page — same bucket, value-based pricing rule instead of an ad-hoc quote. Not a new pricing tier; reuses what's already built.

Both lanes must not run at a loss: pricing needs to stay above the actual cost to run each tool (LLM inference cost where applicable, Supabase/hosting amortized) — this is a constraint on future per-tool cost modeling, not solved in this spec.

## 6. Build sequencing

15 (now 26) tools is too large for one implementation plan. **Phase 1** (the only phase this design commits to building next): the dashboard shell (auth, tool entitlements, payment integration) + **GST Invoice Generator** as the first tool.

GST Invoice Generator is the Phase 1 choice because it is: (a) needed by effectively all 378 BNI categories — the single most universal tool in the catalog, (b) zero AI/inference cost, so it validates the whole shell (auth, entitlement-gating, payment) without any risk of running at a loss on API bills, and (c) simple enough in scope (form + GST-compliant fields + PDF/print output) to ship fast and prove the pattern before the remaining 25 tools get built against it.

Everything past Phase 1 (25 more tools) is backlog, roughly prioritized non-AI tools first (cheap, no inference-cost risk), then the 9 AI-needing tools.

## 7. Out of scope for this spec

- Detailed per-tool specs for tools 2–26 — each gets speced when its turn in the backlog comes, using Phase 1's shell as the established pattern.
- Per-tool cost modeling (LLM API cost estimates, break-even pricing math) — needed before Phase 2+ ships any AI-needing tool, not before Phase 1.
- The `budgetwebsite.store` visual/3D redesign (separate thread, not part of this spec).
- The `TODO-CONFIRM-GALLERY-URL` placeholder and site-revamp branch merge decision — unrelated, tracked separately.
