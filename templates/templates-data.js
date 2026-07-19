/* Generated from the Website Factory catalog dataset
   (Website Project/docs/budget-website-catalog-data.json) by gen-data.py.
   Do not hand-edit; re-run the generator instead (python3 gen-data.py,
   from any directory -- the output path is absolute). Tier 1 shown as
   Rs 8,000 per the site ladder (dataset says Rs 10,000; flagged).
   linkable:true for tiers 1-3, all 34 trades, deployed 2026-07-19 to
   website-project-liart.vercel.app; glimpses are real screenshots of
   those same local builds pre-deploy. */
var LEDGER = [
 {
  "n": 1,
  "slug": "01-gym-fitness",
  "name": "Gym & Fitness Centre",
  "blurb": "Free-trial funnel, batch timings, certified-trainer badges, transformation gallery.",
  "accent": "#F97316",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a single-location gym owner who just needs to stop losing walk-ins to a competitor with pricing and timings actually on the internet, this gets the essentials in front of a phone-scrolling prospect in one clean scroll, with a WhatsApp trial button that does the selling for you.",
    "bullets": [
     "Hero section with gym name, tagline, one hero photo of the real facility, and a single clear CTA (\"Book a Free Trial\" via WhatsApp click-to-chat)",
     "Membership pricing teaser: up to 3 plans shown as simple cards (e.g. Monthly / Quarterly / Annual) with real prices, no hidden \"contact for pricing\"",
     "Facility highlights strip: 4-6 icon+text callouts (e.g. \"Free Weights\", \"Cardio Zone\", \"Steam & Sauna\", \"AC\", \"Parking\", \"WiFi\")",
     "Class/batch timing snapshot: a simple table showing morning batch and evening batch hours (not a full weekly schedule, just the two windows)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a gym that's outgrown a single page, enough room to lay out every plan, every batch, and every trainer clearly, so a prospect can self-qualify before they even call, while still keeping it simple to browse on a phone.",
    "bullets": [
     "Expands to 2-3 pages: Home, Membership & Classes, Contact/Location (still scroll-first, not deeply nested navigation)",
     "Full membership pricing page: all plans (not capped at 3), what's included per plan, any add-ons (personal training sessions, diet consultation) priced separately",
     "Full weekly class/batch schedule as a real table (day x time x class name), covering both morning and evening batches, not just a summary",
     "Trainer strip expanded to 3-5 trainers: photo, name, certification badge, one-line specialisation each (still not full individual bios)"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a gym serious about converting browsers into walk-ins, real trainer credibility, real transformation proof with an interactive slider, and a live schedule widget that removes every excuse a prospect has not to show up for their free trial.",
    "bullets": [
     "5-8 pages: Home, About, Trainers, Classes & Schedule, Transformations, Membership & Pricing, Gallery/Facilities, Contact",
     "Working class-schedule widget: an actual interactive weekly timetable component (filterable by class type or by morning/evening) built from structured data, not a static image, easy for the owner to hand over updated timings for future edits",
     "Trainer directory with real profile cards: each trainer gets an individual card/section with photo, name, certification(s) displayed as verified badges, years of experience, specialisation tags (e.g. \"Strength Training\", \"Weight Loss\", \"Yoga\"), and a short bio, clickable to expand for a fuller bio on the same page or a modal",
     "Before/after transformation gallery with a real working slider: drag-to-reveal before/after image comparison (touch-friendly for mobile) for each featured member transformation, paired with a short quote from that member in their own words"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a growing gym or small chain ready to run bookings, trials, and even sign-ups online instead of through phone calls and a register, this is the tier where the website starts doing real day-to-day work for the business, not just marketing it.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "Member login portal stub: a basic authenticated area where members can log in to view their own membership status, plan expiry date, and attendance history (scoped initially as a working stub the gym can expand into a full member dashboard later)",
     "Online class booking with a real calendar: members or prospects can pick a class/batch slot from a live calendar view and reserve a spot, with capacity limits per slot (e.g. \"6 of 12 spots left for 7 AM Zumba\")",
     "Payment/membership-signup flow stub: a working checkout flow (Razorpage/Razorpay or similar India-first gateway) where a prospect can select a plan and pay online to start membership, wired end-to-end even if only one plan is enabled at launch"
    ]
   }
  ]
 },
 {
  "n": 2,
  "slug": "02-salon-beauty-parlour",
  "name": "Salon & Beauty Parlour",
  "blurb": "Bridal packages, before/after gallery, WhatsApp booking, hygiene trust signals.",
  "accent": "#DB2777",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "One clean page that puts your price list, your work, and a WhatsApp button in front of every phone that finds you on Google, enough to stop losing bookings to salons that simply look more put-together online.",
    "bullets": [
     "One scrolling page: Hero with salon name, tagline, and hero photo of the actual salon interior",
     "Static service menu section listing hair, skin, nail, and mehendi categories with starting prices",
     "A dedicated \"Bridal & Party\" block naming the package tiers and starting price (not a full booking flow, just information + enquiry)",
     "Photo gallery of 8-12 real salon/work photos (grid layout, no lightbox needed)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "Enough structure to separate 'quick trim' customers from 'planning my wedding' customers, with a real price list and a bridal page that does the convincing before they ever call you.",
    "bullets": [
     "Everything in Tier 1, restructured across 2-3 pages: Home, Services & Pricing, Bridal/Gallery (Contact folded into footer or a short dedicated section)",
     "Full itemised service menu page organised by category (hair / skin / bridal / mehendi / nails) with all prices, not just starting-from figures",
     "Expanded bridal & party package page with 2-3 tiers laid out side by side (e.g. Basic / Premium / Royal) showing exact inclusions per tier",
     "Larger photo gallery (20+ images) organised into simple categories: Salon Interior, Hair Work, Bridal Looks, Nail Art"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "A real booking flow, a real before-after slider, and a bridal package builder that quotes a price before the bride even messages you, this is the tier that makes your site do the sales conversation, not just the introduction.",
    "bullets": [
     "Full multi-page site: Home, Services & Pricing, Hair, Skin, Bridal & Party, Nails/Mehendi, Gallery, About/Team, Contact (5-8 pages depending on how categories split)",
     "Real appointment-booking widget: client picks a service category, then a specific service, then a stylist (or \"any available\"), then sees real date/time slots and submits a request, captures name, phone, and sends a structured booking enquiry to the salon's WhatsApp/email/inbox (does not require a paid SaaS booking backend; built as a form-driven flow with slot logic, not a stub button)",
     "Before/after gallery slider: an actual drag-to-reveal image comparison widget for hair colour, skin, and transformation work, not just two photos side by side",
     "Bridal package builder: an interactive selector where a bride picks her package tier (Basic/Premium/Royal) and add-ons (extra trial, family makeup, saree draping, touch-up kit) and sees a running estimated total before submitting an enquiry"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "This is the tier where your regulars stop calling to ask 'when was my last facial' because they can just log in and see it, and where a bride can pay a token amount to lock her date the moment she decides on you, before she keeps shopping around.",
    "bullets": [
     "Everything in Tier 3, rebuilt as a fast, app-like Next.js experience",
     "Client login with booking history: returning customers sign in (phone/OTP or email) and see their past appointments, past bridal packages booked, and can rebook a previous service in one tap",
     "Loyalty points stub: points accrue per visit/spend and display on the client's account page, redeemable against a future service (starts as a visible ledger; full redemption logic scoped with the client)",
     "Online payment for advance booking: bridal trial deposits or appointment-holding fees collected via Razorpay/UPI at time of booking, reducing no-show risk the way industry data shows deposits do"
    ]
   }
  ]
 },
 {
  "n": 3,
  "slug": "03-car-rental-self-drive",
  "name": "Car Rental / Self-Drive",
  "blurb": "Fleet tariffs, KYC & deposit terms, outstation and wedding packages.",
  "accent": "#1E293B",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "Get your fleet, rates, and booking number in front of every customer searching for a self-drive car near them, live in days, at the price of two days' rental income.",
    "bullets": [
     "Hero section with tagline, hero image of the actual fleet (not stock), and a prominent \"Check Availability\" CTA button",
     "Fleet showcase as a static grid: 4-8 car cards, each with photo, name, transmission type, seats, and starting per-day price",
     "Self-drive vs. chauffeur-driven toggle shown as two simple labeled sections (no calculator, just listing what's available for each)",
     "\"How it works\" 4-step strip: Book -> Verify KYC -> Get delivered/pick up -> Drive"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "Split self-drive from chauffeur-driven, put your wedding and outstation packages on their own page, and make your KYC/deposit terms impossible to miss, this is the site that turns a phone-call-only shop into one customers book from directly.",
    "bullets": [
     "Everything from Tier 1, restructured across 2-3 pages: Home, Fleet & Tariffs, Contact/Book",
     "Dedicated Fleet & Tariffs page: each car gets its own card with per-day AND per-km rate, deposit amount specific to that vehicle, and a self-drive/chauffeur-driven price shown side by side",
     "Dedicated Outstation & Wedding Packages section/page: named packages (e.g. \"Weekend Getaway,\" \"Wedding Convoy\") with inclusions, per-km/per-day rate, and driver-bata note for chauffeur-driven outstation trips",
     "KYC & Deposit Terms laid out as a clear checklist with icons (documents needed, deposit amount, refund timeline in days, what deductions can be made), no more hiding this in paragraph text"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "Your customers estimate their own trip cost, pick real dates on a calendar, and check if you deliver to their pin code, before they ever pick up the phone. This is the tier where the website does the sales conversation for you.",
    "bullets": [
     "5-8 pages: Home, Fleet (with real filter), Tariffs & Calculator, Self-Drive, Chauffeur-Driven, Outstation & Wedding Packages, Doorstep Delivery, Contact/Book",
     "Working fleet filter: real client-side filter on the Fleet page by transmission (manual/auto), fuel type, seating capacity, and price range, narrows the actual car-card grid live, no page reload",
     "Real tariff calculator: customer picks a car, enters pickup date + return date (or duration) and expected km, and the page computes an estimated total (base rate x days + per-km overage beyond free-km allowance + deposit shown separately) using the client's actual rate table, not a static price list",
     "Booking enquiry with date-range picker: an actual calendar-based date-range picker (not two text fields) for pickup/return, feeding directly into the tariff calculator and the enquiry submission"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "This isn't a brochure anymore, it's the booking system. Real-time availability, KYC upload, and a dashboard that replaces your notebook and WhatsApp Business as the way you actually run the fleet.",
    "bullets": [
     "Full Next.js application with all Tier 3 pages/features rebuilt as a real app (not static pages), scoped and priced per the client's exact fleet size and workflow",
     "Real-time availability calendar per vehicle: a calendar view showing which dates each car is already booked, so customers only pick genuinely free dates, backed by a real database, not a static list",
     "Online KYC upload + advance-payment stub: customers upload driving licence and ID proof directly through the booking flow (stored securely), with an advance-payment step wired to a payment gateway (Razorpay/Stripe stub, activated when the client is ready to go live with real transactions)",
     "Customer login with booking history: returning customers log in (email/phone OTP) to see their past and upcoming bookings, saved documents (so they don't re-upload KYC every time), and deposit-refund status per booking"
    ]
   }
  ]
 },
 {
  "n": 4,
  "slug": "04-cafe",
  "name": "Cafe",
  "blurb": "Priced menu, ambience story, Zomato/Swiggy hand-off, event nights.",
  "accent": "#78350F",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a cafe owner tired of customers calling to ask \"what do you even have and how much\", this puts the real menu, real prices, and a real feel for the space in front of a phone-scrolling passerby in one clean scroll, with Zomato/Swiggy buttons doing the ordering handoff for you.",
    "bullets": [
     "Hero section with cafe name, tagline, one strong ambience photo (interior or signature corner), and a single clear CTA (\"View Menu\" scrolling to the menu section)",
     "Menu section with real categories (up to 4-5, e.g. Coffee, Breakfast, Sandwiches, Desserts) and real prices listed as text, not a photographed menu card",
     "\"Order Online\" button pair: direct deep-links to the cafe's existing Zomato and Swiggy listing pages (opens the aggregator app/site, no in-house ordering built)",
     "Ambience photo strip: 4-6 real interior/exterior photos telling a mini visual story of the space (seating, counter, a signature detail)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a cafe that's outgrown a single page, room to lay out the full menu with every dietary tag, a real ambience gallery, and an actual booking enquiry form, so a customer can decide to visit (or book a birthday table) without ever picking up the phone.",
    "bullets": [
     "Expands to 2-3 pages: Home, Menu, Contact/Location (still scroll-first, not deeply nested navigation)",
     "Full menu page: every category (not capped at 5), every item with price, dietary tags (Veg/Egg/Vegan, gluten-free) shown per item, bestseller/chef's-pick flags",
     "Ambience photo story expanded into a proper gallery (10-15 images) organized loosely by area (seating, outdoor, counter, decor details) rather than one flat strip",
     "Instagram section upgraded to a refreshable grid the client can request updates to more easily (still not a live API-connected widget)"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a cafe that runs real events and takes real group bookings, a live Instagram wall, a working events calendar with one-tap WhatsApp RSVP, and a proper party-enquiry form that turns \"message us\" into a qualified lead the owner can act on immediately.",
    "bullets": [
     "5-8 pages: Home, Menu, Ambience/Gallery, Events, Private Bookings, About, Contact",
     "Real filterable menu: an actual interactive component, filter by category (Coffee/Breakfast/Mains/Desserts) and by dietary tag (Veg/Vegan/Gluten-Free/Bestseller), built from structured data the owner can hand over updates to, not a static list",
     "Live Instagram wall: a genuinely API-connected feed widget (e.g. via an embed service) pulling the cafe's actual recent posts automatically, so the site stays visually current without manual updates",
     "Working events calendar with WhatsApp RSVP: a real calendar/list view of upcoming open-mic nights, live sets, quiz nights, and special evenings, each with a \"RSVP on WhatsApp\" button that opens a pre-filled message naming the specific event and date"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a cafe ready to take pre-orders, table bookings, and loyalty tracking online instead of over the phone and a paper diary, this is the tier where the website starts running the daily front-of-house work, not just showing it off.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "Online pre-order for pickup: a real working flow where a customer browses the filterable menu, adds items to a cart, selects a pickup time slot, and pays online (Razorpay or similar India-first gateway), wired end-to-end even if launched with a limited item set",
     "Loyalty punch-card stub: a basic authenticated area where a customer's phone number/email tracks visits or pre-orders toward a reward (e.g. \"6th coffee free\"), scoped initially as a working stub the cafe can expand into a full loyalty program later",
     "Table reservation with real time slots: a live calendar/slot picker for table bookings (not just party enquiries) showing actual availability and capacity per slot (e.g. \"2 of 6 tables left for 7 PM Saturday\"), confirmed automatically rather than manually"
    ]
   }
  ]
 },
 {
  "n": 5,
  "slug": "05-restaurant-family-restaurant-bar",
  "name": "Restaurant & Family Bar",
  "blurb": "Full menu, banquet-hall booking, catering add-on, FSSAI trust.",
  "accent": "#DC2626",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "Your full menu, hours, location, and today's festival special, live on one clean mobile-first page, with the veg/non-veg marks Indian diners actually look for, for the price of a large catering order.",
    "bullets": [
     "Single-scroll homepage: hero with restaurant name, cuisine tagline, and one strong dish photo",
     "Static full menu section (veg/non-veg marked with the FSSAI green-square/brown-square icons) organized by category, starters, mains, bar, desserts, no filtering, just clean scannable HTML lists",
     "Photo gallery strip (8-12 images: dishes + interior), no lightbox, simple grid",
     "\"About us\" short block (2-3 lines, story/cuisine focus)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "Three focused pages that turn browsers into bookings, a real menu page, an event-enquiry form for your banquet hall, and a WhatsApp button on every screen, so guests reach you the way they actually want to.",
    "bullets": [
     "Everything in Tier 1, restructured across 2-3 pages: Home, Menu, Contact (About folded into Home)",
     "Dedicated Menu page with veg/non-veg icons plus a simple \"Bar & Drinks\" sub-section separated visually from the food menu",
     "Simple banquet/party enquiry block on Home or Contact: hall photo, stated capacity (e.g. \"seats up to 60\"), and a \"Enquire for your event\" contact form (name, phone, date, guest count) that emails the owner, no live availability, just enquiry capture",
     "Basic catering mention: a short section describing bulk-order/catering availability with a \"Call to discuss\" CTA"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "A real reservation flow, a banquet form that tells guests which hall fits their party size, a menu they can actually filter by veg and spice level, and a catering page that captures orders, this is the tier where the website starts doing the work your host used to do on the phone.",
    "bullets": [
     "5-8 pages: Home, Full Menu, Banquet & Events, Table Reservation, Catering, Gallery, About, Contact",
     "Real filterable menu: live filter/search across the full menu by veg / non-veg / egg, spice level (mild/medium/spicy tags), and category (starters/mains/bar/dessert), built with actual client-side filtering (JS), not a static list",
     "Banquet-hall booking enquiry form with capacity logic: guests select event type (birthday/anniversary/corporate/other), enter guest count, and the form shows which hall(s) fit that count (e.g. \"Hall A, up to 40\" vs \"Hall B, up to 100\") before submission, then routes to owner via email/WhatsApp API",
     "Table reservation widget: working date/time/party-size picker that submits a structured reservation request (not just a contact form) with instant on-screen confirmation message and an auto-notification to the owner (email or WhatsApp Business API), no live seat-availability sync (that requires a POS integration, Tier 4 territory), but a genuinely functional booking-request flow"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "This is the tier where your website stops being a brochure and starts running the front-of-house, real-time table slots, a banquet quote-builder that does the math for you, catering orders captured online, and one dashboard to update it all without calling a developer.",
    "bullets": [
     "Full Next.js app with server-rendered pages for SEO plus app-like interactivity for logged-in flows",
     "Online table reservation with real-time slot availability: integrates with a lightweight backend (Supabase/Postgres) tracking actual table/slot capacity per time window, so guests see genuinely free slots (not just an enquiry form) and receive automatic confirmation/reminder via email or WhatsApp; no-show and cancellation handling built in",
     "Banquet event quote-builder: multi-step flow, event type, guest count, date, decor/AV add-ons, catering-with-hall bundle toggle, that calculates an indicative quote live and submits a structured lead (with quote breakdown attached) to the owner, replacing manual back-and-forth on phone",
     "Catering order stub: structured online order flow for catering packages (package selection, quantity, delivery date/address, special instructions) that generates an order summary and routes to the kitchen/owner, architected to plug into a payment gateway (Razorpay/PayU) in a later phase, without requiring a rebuild"
    ]
   }
  ]
 },
 {
  "n": 6,
  "slug": "06-jeweller",
  "name": "Jeweller",
  "blurb": "BIS hallmark trust, daily gold rate, old-gold exchange, custom orders.",
  "accent": "#1C1917",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a single-showroom jeweller who needs the essentials, a real gold rate, the BIS badge, and a WhatsApp button, in front of a nervous gold buyer before they ever walk in, in one clean scroll.",
    "bullets": [
     "Hero section with store name, tagline, one hero photo of the real storefront or a signature piece, and a single clear CTA (\"Enquire on WhatsApp\")",
     "Collections teaser strip: 4 category cards (Gold, Diamond, Silver, Mangalsutra) each with one real photo and a one-line description, links to WhatsApp enquiry, not a full catalog",
     "Today's gold rate display: a simple static/manually-updatable block showing 22K/24K rate per gram, labelled with the date, so the owner can hand-edit it each morning (no live API at this tier)",
     "BIS hallmark trust badge: a dedicated callout with the BIS logo/mark and a one-line explanation (\"All our gold jewellery is BIS hallmarked, purity you can verify\")"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a jeweller ready to show the full breadth of their collections and lay out every trust signal, hallmark, GST, exchange process, clearly enough that a customer arrives already convinced, not still deciding.",
    "bullets": [
     "Expands to 2-3 pages: Home, Collections, Contact/Visit Us (still scroll-first, not deeply nested navigation)",
     "Full Collections page: gold, diamond, silver, mangalsutra, and bridal/wedding sets each get their own section with 8-12 real photos per category and short descriptive text (weight range, typical price band per category if the owner is comfortable sharing)",
     "Gold-rate block upgraded to a clearly dated daily-update panel (still manually entered) covering 22K, 18K, and silver rate per gram, with a \"last updated\" timestamp so customers trust it's current",
     "BIS hallmark section expanded into a short trust page/module: what hallmarking means, the HUID system, and a photo of the store's actual BIS certificate/registration"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a jeweller who wants the website doing real work, a live rate calculator that answers \"what will this cost me\" instantly, a filterable catalog, and real appointment booking, so a customer walks in already knowing the price, the purity, and their appointment slot.",
    "bullets": [
     "5-8 pages: Home, About/Our Story, Collections, Gold Rate & Exchange, Custom Orders, Book a Visit, Testimonials, Contact",
     "Working live gold-rate calculator: a real interactive tool where a customer enters approximate weight (grams) and selects a category (22K gold, 18K gold, silver), and the tool calculates an estimated price using the day's displayed rate plus a configurable making-charge percentage, the owner updates the base rate each morning through a simple editable field, and the calculator does the multiplication instantly (rate × weight + making charges = estimate)",
     "Filterable collections catalog: real filtering by category (gold/diamond/silver/mangalsutra/bridal), by occasion (daily wear, wedding, festive), and by price band, built from structured data so the owner can hand over new pieces for the developer to add without a redesign",
     "Store-visit appointment booking: an actual booking widget where a customer picks a preferred date/time slot for a store visit or private bridal consultation, with a form capturing name, phone, and purpose of visit (e.g. \"bridal set consultation,\" \"old-gold exchange,\" \"custom order discussion\"), confirmation sent to the owner's email/WhatsApp"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a growing jewellery brand ready to run exchange estimates, custom orders, and appointment booking as real day-to-day tools instead of phone calls and a notebook, this is the tier where the website starts doing the trust-building and the operational work that used to only happen at the counter.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "Old-gold exchange value estimator (transactional-grade): an upgraded calculator where a customer enters approximate weight, purity/karat (with a simple guide to help them estimate), and the tool computes an estimated exchange value against the live rate, clearly labelled as an estimate subject to in-store verification, feeding directly into a \"book an exchange visit\" CTA",
     "Custom-order request portal with design upload: a real form where customers upload reference images or sketches (JPG/PNG/PDF), specify metal, budget range, and occasion, and track their request status (submitted → quoted → approved → in production → ready), replacing the Tier 3 text-only enquiry form with an actual file-upload and status pipeline",
     "Customer login with order history: a basic authenticated area where a returning customer can log in to see past purchases, past exchange transactions, and custom-order status, scoped initially as a working stub the jeweller can expand into a full loyalty/CRM system later"
    ]
   }
  ]
 },
 {
  "n": 7,
  "slug": "07-yoga-classes-studio",
  "name": "Yoga Classes / Studio",
  "blurb": "Batch schedule, certified-instructor bios, free trial class.",
  "accent": "#EC4899",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "Your entire studio, styles, schedule, instructor credentials, and a one-tap trial-class booking, on one calm, professional page that looks like a ₹50,000 site, live in a week.",
    "bullets": [
     "One-page scrolling site: Hero (studio name, tagline, first-class-free CTA) → Class Styles (icon + 1-line description per style: Hatha, Power, Prenatal, Kids, etc.) → Weekly Schedule (static table, day/time/style/instructor) → Instructor snapshot (photo, name, certification line, e.g. \"RYT-200, Yoga Alliance\") → Testimonials (3-4 quotes, real names) → Location + Contact (embedded Google Map, address, click-to-call, click-to-WhatsApp)",
     "Sticky \"Book a Trial Class\" button in header/footer that opens WhatsApp with a pre-filled message",
     "Mobile-responsive, single palette applied per the design system above (soft pink/lavender, Lora/Raleway pairing)",
     "Basic on-page SEO (title, meta description, studio name + area keywords)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "A proper multi-page studio site, full pricing, every instructor's credentials laid out, and testimonials that build trust before a student ever walks in the door.",
    "bullets": [
     "Everything in Tier 1, restructured across 2-3 pages: Home (hero, styles overview, top testimonials, trial CTA) → Schedule & Pricing (full weekly timetable by style/instructor/batch, drop-in/monthly/pack pricing table) → About & Instructors (full bios per instructor with certification body, registration number, years teaching, specialization, individual photos)",
     "Expanded class-style section: separate description blocks for Hatha, Power/Vinyasa, Prenatal, Kids, and any others, each stating who it's suitable for",
     "Dedicated Testimonials section with 6-8 quotes, filterable/groupable by class type if enough content exists",
     "Google Maps embed + \"Get Directions\" link, business hours"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "Students filter your real weekly schedule, pick a class and instructor, and land in WhatsApp with the booking already typed out, this is the tier where the site actually does the work of a receptionist.",
    "bullets": [
     "5-8 pages: Home, Class Styles (detail page per style with duration/level/what-to-bring), interactive Schedule & Class Picker, Instructor Directory, Corporate Yoga, Home Sessions, Testimonials, Contact",
     "Real working weekly-schedule/class-picker widget: student filters by day, class style, and/or instructor; picking a class slot auto-generates a formatted WhatsApp message (\"Hi, I'd like to book: Power Yoga, Tue 7:00 AM, with Instructor [Name]\") and opens WhatsApp Web/app with it pre-filled, no backend, no database, but a genuinely functional booking-intent tool, not a static table",
     "Instructor directory with individual profile cards: photo, full bio, certification body + registration number displayed as a verified badge (e.g. \"Yoga Alliance RYT-500\"), specializations, and a \"Book with [Instructor]\" button that pre-fills the WhatsApp message with that instructor's name",
     "Trial-class signup flow: a short 2-step form (name + phone + preferred class/time, no health history or long fields) that submits to the studio's WhatsApp/email, explicitly designed to avoid the multi-field drop-off that kills trial conversions"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "This is the studio-management platform your bigger competitors charge students a booking-app fee to use, except it's your own site, your own brand, and your students never leave WhatsApp to book, pay, or track their class-pack balance.",
    "bullets": [
     "Next.js application with all Tier 3 pages/features rebuilt as a proper app (fast routing, image optimization, SSR for SEO on class-style and instructor pages)",
     "Student login (email/phone + OTP or password) with a personal dashboard showing upcoming booked classes and class-pack balance (e.g. \"6 of 12 classes remaining, expires 15 Sept\")",
     "Online class-pack/membership purchase stub: student selects a pack (4/8/12 classes or monthly unlimited) and pricing tier; wired to a payment gateway (Razorpay/Stripe) as a real checkout flow, with successful payment crediting the pack balance in the student's dashboard",
     "Class booking against pack balance: logged-in student books a specific schedule slot, balance decrements automatically, confirmation sent via WhatsApp/email; waitlist handling if a batch is full"
    ]
   }
  ]
 },
 {
  "n": 8,
  "slug": "08-diagnostic-centre-pathology-lab",
  "name": "Diagnostic Centre / Lab",
  "blurb": "Searchable test catalog, NABL trust, home sample collection.",
  "accent": "#0891B2",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a single-branch lab that needs its NABL badge, its pathologist's credentials, and its turnaround-time promise doing the trust-building in one clean scroll, with WhatsApp handling every booking.",
    "bullets": [
     "Hero section with lab name, tagline, one real photo of the facility/reception, and a single clear CTA (\"Book a Test on WhatsApp\")",
     "NABL accreditation badge front and center, accreditation number and a one-line explanation (\"NABL-accredited, every report independently verified for accuracy\")",
     "Popular tests strip: 6-8 most-requested tests (CBC, Lipid Profile, Thyroid Profile, Blood Sugar, Liver Function, Kidney Function) listed with price, no search/filter",
     "Health checkup packages teaser: 2-3 packages shown as simple cards (name, price, test count) linking to WhatsApp for the full list, not an interactive comparison"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a lab ready to lay out its full test menu, its package pricing, and every credential and TAT promise clearly enough that a patient arrives already decided on which package to book.",
    "bullets": [
     "Expands to 2-3 pages: Home, Tests & Packages, Contact/Visit Us (still scroll-first, not deeply nested navigation)",
     "Full test list page: tests organized by department (Biochemistry, Hematology, Microbiology, Radiology) with price and turnaround time per test, browsable but not yet searchable",
     "Health checkup packages expanded: each package gets its own section listing every parameter/biomarker included, fasting requirement, sample type, and price, enough detail that a patient can compare Basic vs. Comprehensive vs. Executive without calling",
     "NABL accreditation section expanded into a dedicated trust module: what NABL accreditation means, scope of accreditation, and a photo of the actual certificate"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a lab that wants the website doing real work, a searchable catalog that answers \"do you test for X and how much,\" a package comparison that closes the upsell, and a real home-collection booking with an actual time slot, so a patient books online instead of calling to ask basic questions.",
    "bullets": [
     "5-8 pages: Home, About/Credentials, Test Catalog, Health Packages, Home Collection, Book a Test, Testimonials, Contact",
     "Real searchable/filterable test catalog: a working search bar plus department filters (Biochemistry, Hematology, Microbiology, Radiology, Serology) and price-range filter, built from structured data so the lab can hand over new tests for the developer to add without a redesign, patients type \"thyroid\" or \"vitamin D\" and get an instant filtered result with price and TAT",
     "Health-package comparison table: an actual side-by-side comparison tool where a patient selects 2-3 packages (e.g. Basic ₹799, Comprehensive ₹2,499, Executive ₹4,999) and sees every included parameter lined up row-by-row, with differences highlighted, so the value gap between tiers is visually obvious",
     "Home-collection booking form with address + time-slot: a real form capturing full address (with locality/pin-code validation against the service area), preferred date, a genuine time-slot picker (e.g. early-morning fasting slots vs. afternoon slots), test/package selection, and contact details, submission sends a confirmation to both patient and lab, replacing the Tier 2 WhatsApp-only request"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a diagnostic centre ready to run report delivery, payment, and booking as real digital operations instead of phone calls and WhatsApp forwards, this is the tier where the website replaces the front-desk paperwork and becomes the patient's actual account with the lab.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "Patient login with report-download portal: a secure authenticated area where a patient logs in (phone/OTP or email) to view and download their own PDF reports as soon as they're ready, replacing WhatsApp/email as the primary delivery method and giving the patient a permanent, searchable history of every past test",
     "Online payment for test booking: integrated payment gateway (UPI/card) at the point of booking a test or health package, so a patient can pay upfront when scheduling home collection or a centre visit, with automatic invoice/receipt generation",
     "Appointment reminders: automated SMS/WhatsApp reminders sent ahead of a scheduled home collection or centre visit, plus a notification when a report becomes ready for download in the portal"
    ]
   }
  ]
 },
 {
  "n": 9,
  "slug": "09-tailor-bespoke-tailoring",
  "name": "Tailor / Bespoke Tailoring",
  "blurb": "Since-YYYY heritage, portfolio gallery, measurement-appointment booking.",
  "accent": "#2563EB",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a tailor who needs their real craftsmanship on the internet instead of nowhere, one clean scroll that puts finished-garment photos, real fabric names, and a WhatsApp booking button in front of a customer before they walk into the shop down the road instead.",
    "bullets": [
     "Hero section with shop name, \"since YYYY\" heritage line, one hero photo of a real finished garment (not a stock suit model), and a single clear CTA (\"Book a Measurement Visit\" via WhatsApp click-to-chat)",
     "Services strip: 4-6 icon+text callouts naming the actual services offered (Bespoke Suits, Sherwanis, Blouses, Alterations)",
     "Fabric options teaser: a simple text/logo strip naming 2-4 fabric sources or brands the shop stocks (e.g. \"Raymond · Siyaram's · Italian Wool\"), not a full swatch picker, just enough to signal real sourcing",
     "Portfolio strip: 6-8 real garment photos (finished suits/sherwanis/blouses), no stock photography, laid out as a simple grid"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a tailor whose reputation has outgrown a single page, room to lay out every garment category, every fabric tier, and the family story behind the shop, so a customer arrives at the fitting already sold instead of still deciding.",
    "bullets": [
     "Expands to 2-3 pages: Home, Services & Fabrics, Contact/Location (still scroll-first, not deeply nested navigation)",
     "Full services page: every garment category (suits, sherwanis, blouses, alterations, plus any specialities) with a description and starting price for each, so a customer can self-qualify on budget before enquiring",
     "Fabric options page: real fabric list organized by tier (e.g. \"Signature,\" \"Premium,\" \"Heritage Silk\") with mill/brand names and indicative price-per-metre or price-per-garment, plus a note on whether customers can bring their own fabric",
     "Portfolio gallery expanded to 15-20 real garment photos, grouped loosely by category (Suits / Sherwanis / Blouses / Alterations)"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a tailor serious about converting browsers into commissions, a real fabric picker, a portfolio a bride or groom can actually filter to their garment, and a measurement-booking form that captures a real time slot instead of a vague \"we'll call you.\"",
    "bullets": [
     "5-8 pages: Home, Heritage/About, Services, Fabrics, Portfolio, Measurement & Booking, Testimonials, Contact",
     "Real fabric-swatch gallery/picker: an actual interactive component showing fabric swatches (image + mill/brand name + price tier) that a customer can browse and filter by fabric type (wool, cotton, silk, linen) or by garment suitability (suiting, sherwani, blouse), built from structured data so the owner can hand over new stock photos for easy updates, not a static image dump",
     "Portfolio filterable by garment type: a real filter/tab component (Suits / Sherwanis / Blouses / Alterations / Bridal) over the full photo gallery, so a customer planning a wedding can jump straight to sherwani work instead of scrolling past unrelated garments",
     "Measurement-appointment booking with date/time: a working booking form with an actual date and time-slot picker (not just a text field asking \"preferred date\"), confirming the slot and sending the request to the shop's WhatsApp/email, so double-bookings don't happen on the shop's end"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a tailoring house ready to run bookings, fabric selection, and order status online instead of through phone calls and a paper order book, this is the tier where the website starts doing real day-to-day work for the shop, not just showing off the craft.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "Order-tracking portal: a working stage-tracker per commission, Measurement Taken → Cutting → Stitching → Fitting → Ready for Delivery, so a customer can check their sherwani's status online instead of calling the shop, scoped initially as a real end-to-end stub the shop can expand",
     "Online advance-payment stub: a working checkout flow (Razorpay or similar India-first gateway) where a customer pays an advance/booking fee online to confirm a commission, wired end-to-end even if only used for a subset of services at launch",
     "Customer login with order history: a basic authenticated area where a returning customer can log in to see past commissions, saved measurements (so a repeat customer doesn't have to be re-measured for a simple shirt), and current order status"
    ]
   }
  ]
 },
 {
  "n": 10,
  "slug": "10-clothing-boutique",
  "name": "Clothing Boutique",
  "blurb": "Lookbook, custom stitching, live Instagram feed, WhatsApp ordering.",
  "accent": "#18181B",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a boutique owner selling entirely through Instagram DMs right now, this gives every visitor from your bio link a real, fast-loading shop window with sizing, prices, and a WhatsApp order button, so a sale doesn't depend on you replying in the next ten minutes.",
    "bullets": [
     "Hero section with boutique name, tagline, one styled hero photo from the actual collection, and a single clear CTA (\"Order on WhatsApp\")",
     "Featured collection strip: 6-8 product photos in a simple grid (not a full catalog), each with name and price",
     "New Arrivals badge/section: highlights 3-4 latest pieces so repeat visitors see what's changed",
     "One-line custom stitching mention with a WhatsApp CTA (\"Want it custom-fit? Message us your measurements\"), no full form or process page"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a boutique that's outgrown a single scroll, enough room to properly separate everyday stock from the festive drop, walk a customer through how custom stitching actually works, and let her request a fitting slot without a single back-and-forth DM.",
    "bullets": [
     "Expands to 2-3 pages: Home, Collections (or Shop), Contact/Fittings (still scroll-first, not deeply nested navigation)",
     "Full collections page: all current pieces organized by collection name (not capped at 8), each with photo, name, price, and fabric/material line",
     "Dedicated New Arrivals section on its own scroll block, distinct from the general catalog, so returning customers can jump straight to what's new",
     "Festive collection callout: a visually distinct section (different background treatment) for the current or upcoming festive drop, separate from everyday stock"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a boutique ready to convert Instagram browsing into real, trackable orders, a real filterable lookbook, a WhatsApp button on every single item, a live Instagram feed that keeps the site looking fresh, and a fitting-appointment calendar that fills your measurement slots without a single phone call.",
    "bullets": [
     "5-8 pages: Home, Collections/Lookbook, New Arrivals, Custom Stitching, Festive Collection, Fittings & Appointments, About, Contact",
     "Real filterable lookbook: an actual interactive collection browser filterable by occasion (festive, casual, wedding, office), fabric (cotton, silk, chiffon, chanderi), and color, built from structured product data, not a static grid, so the owner can hand over new items with tags and have them slot into the right filters automatically",
     "Per-item WhatsApp ordering flow: every product card has its own \"Order this on WhatsApp\" button that pre-fills a WhatsApp message with the item name, size, and a link back to its photo, removing the \"which one do you mean?\" back-and-forth entirely",
     "Live Instagram feed embed: an actual auto-syncing feed widget pulling the boutique's real recent posts directly onto the homepage and/or a dedicated \"Follow Along\" section, so the site always looks current without manual updates"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a boutique ready to run its custom-stitching orders, festive pre-launches, and restock alerts through the website instead of a WhatsApp inbox full of screenshots, this is the tier where the site starts doing the measurement-taking, the payment-collecting, and the catalog-updating for you.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "Wishlist / save-for-later with login: customers can create a lightweight account (phone/email OTP) to save pieces across visits and get notified when a saved item or size is restocked",
     "Custom-stitching order form with measurement upload: a structured multi-step form where a customer enters measurements directly or uploads a photo of a filled-in measurement sheet, selects fabric and garment type, and submits a complete stitching order that reaches the owner as a structured record (not a loose WhatsApp message)",
     "Online advance-payment stub: a working checkout flow (Razorpay or similar India-first gateway) for collecting an advance/booking payment on custom-stitched or festive pre-order pieces, wired end-to-end even if only one payment type is enabled at launch"
    ]
   }
  ]
 },
 {
  "n": 11,
  "slug": "11-medical-clinic-gp-specialist",
  "name": "Medical Clinic (GP / Specialist)",
  "blurb": "Doctor credentials, OPD timings, appointment booking.",
  "accent": "#0891B2",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a solo GP or specialist who needs a credible online presence fast, the doctor's qualifications, registration number, real OPD timings, and a WhatsApp button that turns a late-night symptom search into a booked appointment, all in one clean scroll.",
    "bullets": [
     "Hero section with clinic name, specialty, one hero photo of the real clinic/doctor, and a single clear CTA (\"Book Appointment\" via WhatsApp click-to-chat or \"Call Now\")",
     "Doctor profile block: photo, name, qualification (MBBS/MD/etc.), NMC/state registration number, specialisation, even for a single-doctor clinic, this block is non-negotiable",
     "OPD timings displayed as a simple table (days x hours), not a vague statement",
     "Services/treatments list: 6-10 items in plain patient language with a short one-line description each"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a clinic that's outgrown a single page, room to lay out every qualification, every service, and every insurance tie-up clearly, so an anxious patient can verify credibility and pick up the phone before they even walk in.",
    "bullets": [
     "Expands to 2-3 pages: Home, Doctor & Services, Contact/Location (still scroll-first, not deeply nested navigation)",
     "Doctor profile page: full qualifications, registration number, medical school, years of experience, specialisation, and a short bio in the doctor's own words (or written on their behalf)",
     "Full services/treatments page: every service listed with a proper description, not just a name, organised by category if the clinic offers several (e.g. General Consultation, Diagnostics, Minor Procedures)",
     "OPD timings expanded to show any variation (e.g. separate morning/evening slots, days off, holiday schedule notice)"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a clinic serious about converting searchers into booked patients, a real slot-by-slot booking widget, verified doctor credentials a skeptical patient can check in one click, and a searchable insurance list that answers the \"will my policy work here\" question before they ever call.",
    "bullets": [
     "5-8 pages: Home, About the Clinic, Doctors, Services & Treatments, Insurance/TPA, Patient Education, Testimonials, Contact",
     "Real appointment-booking widget: a working booking flow where a patient picks a doctor (if multiple), sees actual available time slots pulled from a structured schedule, selects a slot, and submits their details, sends a confirmation email/WhatsApp to both patient and clinic, and blocks out booked slots so double-booking doesn't happen",
     "Doctor directory with verified-credential cards: each doctor gets an individual profile with photo, full qualifications, NMC/state registration number displayed as a verified badge (with a link explaining how patients can check it on the National Medical Register), specialisation tags, years of experience, and OPD days/hours specific to that doctor",
     "Insurance/TPA lookup: a searchable or filterable list of empanelled insurers and TPAs (type or select an insurer name, see instantly whether cashless is available at this clinic) rather than a static logo wall"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a growing clinic or small multi-doctor practice ready to move beyond phone-and-WhatsApp booking, this is the tier where the website starts running real day-to-day clinic operations: patients booking and tracking their own visits, refill requests routed properly, and staff updating schedules themselves instead of calling the developer every time a doctor's hours change.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "Patient login portal with appointment history: a basic authenticated area where returning patients log in to see past and upcoming appointments, download visit summaries if the clinic provides them, and rebook with a doctor they've seen before",
     "Online prescription-refill request: a working form inside the patient portal where a patient requests a refill for an existing prescription, routed to the clinic/doctor for approval rather than being an automatic dispense (kept compliant, this is a request queue, not e-prescribing)",
     "Telemedicine-enquiry stub: a video-consultation enquiry flow where a patient selects a doctor and preferred time for an online consult; wired end-to-end to at least request/confirm the slot, with the actual video-call integration (e.g. Jitsi/Zoom/Google Meet link) scoped based on the clinic's chosen platform"
    ]
   }
  ]
 },
 {
  "n": 12,
  "slug": "12-real-estate-agency-broker",
  "name": "Real Estate Agency / Broker",
  "blurb": "RERA trust, property listings, per-listing enquiry forms.",
  "accent": "#0F766E",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a solo broker or small agency that just needs a credible, RERA-visible online presence with a handful of hot listings up front, enough to stop losing leads to a WhatsApp-only competitor, with an enquiry button that does the qualifying for you.",
    "bullets": [
     "Hero section with agency name, tagline, one strong hero photo (real property or skyline of the primary operating area), and a single clear CTA (\"Enquire Now\" via WhatsApp click-to-chat)",
     "Featured properties strip: 4-6 property cards (photo, price, configuration, locality, buy/rent tag), a curated highlight, not the full inventory",
     "Areas served callout: a simple list or map pin strip of the localities the agency specializes in (e.g. \"Andheri West, Powai, Goregaon\")",
     "RERA registration number displayed in the footer on every section (non-negotiable trust element)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For an agency that's outgrown a single page of listings, room to show the whole inventory grouped by buy/rent/commercial, real area expertise instead of vague locality name-drops, and a contact path that pre-qualifies budget and locality before the phone even rings.",
    "bullets": [
     "Expands to 2-3 pages: Home, Properties (scrollable listing showcase), Contact (still scroll-first, not deeply nested navigation)",
     "Properties page shows the full current inventory as cards (not capped at 6), grouped by Buy / Rent / Commercial tabs, basic client-side sort (price low-to-high, newest first) but not full filtering",
     "Each property card expands (accordion or lightbox) to show a small photo gallery, full details (area, floor, furnishing, possession status), and price, without needing a separate URL per listing",
     "RERA number shown per project/listing where applicable, in addition to the agency's own RERA number in the footer"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For an agency serious about converting silent browsers into calls, a real filterable listing grid buyers can actually search, per-listing enquiry forms that tell you exactly which property a lead wants, RERA numbers displayed and verifiable on every listing, and area pages that prove local expertise no national portal can fake.",
    "bullets": [
     "5-8 pages: Home, Properties (Buy), Properties (Rent), Commercial, Areas We Serve, About/Team, Testimonials, Contact",
     "Working filterable property-listing grid: a real filter component built from structured data, filter by transaction type (buy/rent/commercial), configuration (1BHK-4BHK+), price range (slider or min/max), locality, and furnishing status, with results updating live (no page reload), not a static image or PDF list",
     "Individual listing pages: every property gets its own page/URL with a full photo gallery, floor plan image if available, amenities checklist, possession status, and the project-level RERA number displayed prominently",
     "Per-listing enquiry form: each individual listing page has its own \"Enquire about this property\" form (name, phone, message) that tags the enquiry with the specific listing so the agent knows exactly which property the lead wants, not one generic contact form for the whole site"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a multi-agent agency or broker ready to run inventory management, landlord onboarding, and buyer self-service online instead of through a phone and a notebook, this is the tier where the website starts doing the sourcing and shortlisting work for you, not just showcasing listings.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "Saved-search and favorites with login: buyers/renters can create an account, save filter criteria (e.g. \"2BHK, Powai, under ₹1.2Cr\"), shortlist properties as favorites, and optionally get notified when a matching listing goes live",
     "Landlord/seller property-submission portal: a working form-based flow where a landlord or seller can submit a new property directly (address, photos upload, price/rent, documents, contact details) which lands in a review queue for the agency to approve and publish, removing the \"call the agent to list your flat\" bottleneck",
     "EMI calculator: an interactive home-loan EMI calculator embedded on listing pages (loan amount, interest rate, tenure inputs) so a buyer can gauge affordability without leaving the site, a feature every major portal (99acres, Housing.com) has and a broker site without it looks a generation behind"
    ]
   }
  ]
 },
 {
  "n": 13,
  "slug": "13-ca-firm-accounting-services",
  "name": "CA Firm / Accounting Services",
  "blurb": "Service menu, ICAI credibility, compliance-calendar resource.",
  "accent": "#F59E0B",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a solo practitioner or small firm that needs a factual, ICAI-compliant online presence so a prospect searching \"CA near me\" finds real services and a real membership number instead of nothing at all, clean, credible, and built to stay within the Institute's advertising rules from day one.",
    "bullets": [
     "Hero section: firm name, one-line factual descriptor (\"Chartered Accountants, GST, Income Tax & Audit Services\"), partner name + ICAI membership number, single CTA (\"Request a Consultation\" via WhatsApp click-to-chat)",
     "Services strip: 6-8 icon+text service blocks (GST Return Filing, ITR Filing, Statutory Audit, Company Registration, TDS Compliance, Bookkeeping), specific service names, not vague categories",
     "Partner/proprietor block: photo, name, ICAI membership number, qualification, years in practice",
     "Compliance-calendar snapshot: current month's 3-4 nearest due dates (e.g. GSTR-3B, TDS payment, advance tax) shown as a simple static list, refreshed by the developer each month at this tier"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a firm with more than one partner or a service list too broad for a single scroll, enough structure to lay out every service, every specialisation, and every credential clearly, so a prospect can self-qualify before the first call, without straying into anything ICAI would flag as advertising.",
    "bullets": [
     "Expands to 2-3 pages: Home, Services, Contact (still scroll-first, not deeply nested navigation)",
     "Full services page: every service broken into its own block with a factual one-paragraph description (e.g. what a GST audit engagement covers, which ROC forms are handled, which ITR categories are filed) instead of a single icon strip",
     "Expanded partner section: if more than one partner, each gets a card (photo, ICAI membership number, qualification, specialisation area, years in practice)",
     "Industries-served block: 4-6 sectors the firm has real experience in (e.g. manufacturing SMEs, e-commerce sellers, startups, NRIs), stated factually"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a firm ready to be the useful resource in its space, not just a listing, a real compliance calendar prospects bookmark and return to every month, checklist PDFs that cut first-call friction, and a proper booking flow, all built to stay squarely inside ICAI's pull-model rules.",
    "bullets": [
     "5-8 pages: Home, About/Partners, Services, Industries Served, Compliance Calendar, Resources (checklists), Contact",
     "Working compliance-calendar tool: a real interactive calendar/table pulling from a structured due-date dataset (GSTR-1, GSTR-3B, TDS payment and return dates, advance-tax instalments, ITR deadlines, ROC filings), filterable by category (GST/TDS/Income Tax/ROC), with the current month highlighted and an option to add a date to the visitor's own calendar (.ics download or Google Calendar link), so it functions as genuine utility rather than a static image",
     "Downloadable checklist PDFs: real, firm-branded PDF checklists for the 3-5 most requested services (e.g. \"Documents Required for GST Registration,\" \"ITR Filing Checklist for Salaried Individuals,\" \"Company Incorporation Document List\"), gated behind a simple name+email/phone capture or freely downloadable, firm's choice",
     "Consultation-booking widget: a real scheduling component (e.g. Calendly-style embed or a custom form with date/time slots) letting a prospect pick a slot for an introductory call, with a confirmation message, replacing the \"message us and wait\" pattern from Tiers 1-2"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a growing firm ready to run client document collection and service requests through a real portal instead of scattered WhatsApp threads and email attachments, this is the tier where the website starts doing the firm's actual day-to-day client-servicing work, not just describing it, while every page still reads as the factual, ICAI-compliant practice site it has to be.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "Client login with document-upload portal: an authenticated client area (similar in spirit to Karbon/Suralink-style portals used by larger firms) where an existing client can log in, upload documents requested for a filing (e.g. bank statements, invoices, Form 16), and see the status of what's been submitted, scoped initially as a working portal for one or two document-request workflows (e.g. GST return docs, ITR docs), expandable later",
     "Service-request ticketing stub: clients can raise a request (e.g. \"need a TDS certificate,\" \"GST notice reply needed\") from their portal, which creates a trackable ticket the firm can mark as received/in-progress/completed, removing dependency on scattered email/WhatsApp threads for routine requests",
     "Invoice/payment history view: a simple authenticated page showing a client their past invoices/fee notes and payment status (view-only at this stage; online payment collection is a separately scoped add-on)"
    ]
   }
  ]
 },
 {
  "n": 14,
  "slug": "14-furniture-gallery-shop",
  "name": "Furniture Gallery / Shop",
  "blurb": "Room-wise gallery, custom orders, showroom-visit booking.",
  "accent": "#18181B",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a furniture shop tired of \"what do you have and how much\" phone calls, this puts your best pieces, real prices, real materials, and your delivery/EMI terms in front of a phone-scrolling visitor in one clean scroll, with a direct WhatsApp line for custom-order questions.",
    "bullets": [
     "Hero section with shop name, tagline, and one strong lifestyle photo of a signature piece in a real room setting, with a single clear CTA (\"View Our Collection\" scrolling to the product section)",
     "Product showcase section: 8-12 featured pieces across categories (sofas, beds, dining, storage) each with one photo, name, price, and 2-3 key specs (material, dimensions), a curated highlight reel, not the full catalog",
     "Material story block: a short section on the wood/material the shop uses, with 2-3 close-up finish photos, framed as \"why our furniture lasts\" rather than a generic \"quality guaranteed\" line",
     "Customization callout: a text section stating what can be customized (fabric, finish, size) with a \"Ask about custom orders\" WhatsApp button"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a shop that's outgrown a single page, the full catalog laid out by room with real dimensions and finishes, a proper material story that justifies the price, and an actual showroom-visit request form instead of relying on someone remembering to call.",
    "bullets": [
     "Expands to 2-3 pages: Home, Collection (full catalog), Contact/Showroom",
     "Full catalog page organized by room (Living Room, Bedroom, Dining, Office) with category sub-groupings, each product carrying 3-4 photos (studio, lifestyle, dimensional view) instead of one",
     "Expanded specification display per product: full dimension table (height/width/depth/seat height), wood type, available finishes, in-stock vs. made-to-order lead time, shown as a scannable table, not a paragraph",
     "Dedicated customization section: which product lines are customizable, what's adjustable per line (fabric, finish, size), with sample fabric/finish swatch photos where available"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a shop that gets real custom-order and bulk enquiries every week, a real filterable gallery by room and material, a custom-order form that captures exact dimensions instead of a vague message, a bookable showroom-visit calendar, and a separate trade-enquiry path that treats a designer sourcing 20 chairs differently from someone buying one.",
    "bullets": [
     "5-8 pages: Home, Collection, Custom Orders, Trade/Bulk Enquiries, Craftsmanship/Material Story, Showroom Visit, About, Contact",
     "Real filterable product gallery: an actual interactive component filtering the catalog by room (Living Room/Bedroom/Dining/Office), category (Sofa/Bed/Table/Storage), material (Teak/Sheesham/Mango Wood/Engineered), and price band, built from structured product data the owner can hand over updates to, not a static list",
     "Custom-order request form with real dimension inputs: a structured form where a customer picks a base product or \"custom piece,\" then enters desired dimensions (height/width/depth), selects from available wood/finish/fabric options, and submits a specific, actionable custom-order lead instead of a vague enquiry",
     "Showroom-visit booking with real time slots: a calendar/slot picker showing actual available visit windows (not just a request form the owner has to manually confirm), with a WhatsApp/email confirmation sent automatically"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a furniture shop ready to run its custom-order pipeline, trade accounts, and delivery tracking online instead of on WhatsApp threads and a paper order book, this is the tier where the website starts running the daily business, not just showing off the catalog.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "EMI calculator: a real interactive calculator on each product page where a customer inputs down payment and tenure (3/6/12/24 months) against the shop's actual financing partner terms and sees the exact monthly installment, rather than a single pre-set example figure",
     "Bulk/interior-designer trade-account portal: an authenticated area where approved designers and bulk buyers log in to see trade pricing (distinct from retail price), place a multi-item project order, and track it as a single project rather than separate individual enquiries, modeled on the \"to-the-trade\" programs run by larger furniture brands, scaled to a local shop's volume",
     "Order-tracking (ordered → in production → delivered): a real status tracker tied to each custom or in-stock order, showing the customer (and the trade-account holder) exactly which stage their piece is at, with automated WhatsApp/SMS notifications on each status change"
    ]
   }
  ]
 },
 {
  "n": 15,
  "slug": "15-sweet-shop-mithai-farsan",
  "name": "Sweet Shop / Mithai & Farsan",
  "blurb": "Per-kg pricing, FSSAI trust, festival gifting boxes.",
  "accent": "#78350F",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a neighbourhood mithai shop that just needs to stop losing festival-season customers to the shop down the road with a working website, this puts the FSSAI number, the freshness promise, and a WhatsApp order button in front of a phone-scrolling customer in one clean scroll.",
    "bullets": [
     "Hero section with shop name, tagline (e.g. \"Fresh Mithai Since 1978\"), one hero photo of the actual display counter or signature sweet, and a single clear CTA (\"Order on WhatsApp\")",
     "Product range teaser: 4-6 category cards (Milk Sweets, Dry-Fruit Sweets, Farsan & Namkeen, Festival Specials) each with 2-3 example items and starting per-kg price, not the full catalogue",
     "FSSAI licence number displayed in the footer or a trust strip near the top",
     "Freshness line callout: \"Made fresh daily, no preservatives\" or equivalent, phrased from what the client actually confirms"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a sweet shop that's outgrown a single page, room to lay out the full price list, the festival specials with real cutoff dates, and the bulk-order policy clearly, so a customer can plan their whole order before they even message you.",
    "bullets": [
     "Expands to 2-3 pages: Home, Full Menu/Price List, Contact/Location (still scroll-first, not deeply nested navigation)",
     "Full product catalogue page: every category (milk-based, dry-fruit, Bengali, farsan/namkeen, sugar-free) with per-kg or per-piece pricing for the complete everyday range, not just teasers",
     "Dedicated Festival Specials section with a pre-order cutoff date callout (e.g. \"Diwali orders close 3 days before\") and seasonal-only items clearly flagged",
     "Gift box page: standard gift box sizes and prices, what's typically included, note that corporate/logo customisation is available on enquiry"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a sweet shop serious about converting browsers into orders, a real per-kg catalogue with one-tap WhatsApp ordering per item, a gift-box builder that removes the back-and-forth on festival orders, and a structured bulk-order form that captures everything a wedding client needs to give you in one go.",
    "bullets": [
     "5-8 pages: Home, About/Heritage, Full Price Catalogue, Festival Specials, Gift Boxes, Bulk & Wedding Orders, Gallery, Contact",
     "Real interactive per-kg price catalogue with WhatsApp ordering per item: a filterable/searchable product grid (by category, milk sweets, dry-fruit, farsan, sugar-free) where every item shows a photo, name, per-kg price, and its own \"Order on WhatsApp\" button that pre-fills the item name and a quantity field into the WhatsApp message, not a static price list, an actual working add-to-order flow",
     "Festival gift-box builder: a real interactive tool where the customer picks a box size (0.5kg / 1kg / 2kg), selects which sweets go in it from a checklist (with a running weight/price total), and submits the finished combination via WhatsApp or a form, replacing \"describe what you want in a message\" with a structured selector",
     "Bulk/wedding-order enquiry form with quantity and date fields: a dedicated form capturing sweet selection, total quantity in kg, event date, delivery vs. pickup, and any customisation notes (e.g. wedding monogram on the box), which sends directly to the owner's email/WhatsApp with a confirmation message back to the customer"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "For a growing sweet shop or small chain ready to take real orders and advance payments online instead of managing everything through phone calls during the busiest week of the year, this is the tier where the website starts running festival season for you, not just marketing it.",
    "bullets": [
     "Built on Next.js for app-like speed and interactivity, not a static multi-page site",
     "Online order + advance payment for bulk/wedding orders: a working checkout flow (Razorpay or similar India-first gateway) where a wedding or corporate client can finalise their gift-box selection or bulk quantity and pay an advance deposit online, wired end-to-end even if the full balance is still collected on delivery",
     "Order-status tracking: a simple order lookup (by phone number or order ID) where a customer can check whether their festival or bulk order is \"confirmed,\" \"in preparation,\" or \"ready for pickup/out for delivery\", removing the \"is my Diwali order ready\" phone calls",
     "Subscription gift-box stub: a working stub for a recurring gifting plan (e.g. a monthly festival/occasion box sent to a corporate client's list of contacts), scoped initially as a functioning signup + one processed cycle that the owner can expand into a full recurring product later"
    ]
   }
  ]
 },
 {
  "n": 16,
  "slug": "16-catering-services",
  "name": "Catering Services",
  "blurb": "Per-plate pricing tiers, past-event gallery, tasting appointment.",
  "accent": "#DB2777",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "Your full menu, real event photos, and a one-tap WhatsApp enquiry button, everything a bride's family checks before they even call you, live in one clean page.",
    "bullets": [
     "One-page scrolling site: Hero (business name, tagline, hero photo of a real plated spread), About, Menu Highlights, Gallery strip, Contact",
     "Menu Highlights section listing 8-12 signature dishes with a veg/non-veg/Jain tag (colored dot icon, e.g. green=veg, brown=non-veg, small \"J\"=Jain) per item, no live calculator, just a clear static list",
     "Static per-plate starting price shown as \"Starting from ₹XXX/plate\" for one flagship package, so visitors aren't left guessing",
     "Photo gallery of 8-12 real past-event images in a simple grid (client must supply photos; no stock images)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "Separate pages for weddings, corporate events, and birthdays mean every visitor lands on content built for their event, with a dedicated 'Book a Tasting' button that turns browsers into confirmed appointments.",
    "bullets": [
     "Everything in Tier 1, restructured across 2-3 pages: Home, Menu (full categorized menu: starters/mains/breads/rice/desserts/beverages, each tagged veg/non-veg/Jain), and Gallery-or-Events (whichever the client prioritizes)",
     "Event-type sections on the homepage, separate cards/blocks for Wedding, Corporate, and Birthday/Personal catering, each with its own short description and photo, so visitors self-identify faster",
     "Per-plate pricing table showing 2-3 package tiers (e.g. Silver/Gold/Platinum) with what's included in each (service staff, crockery, live counters), still static, not interactive",
     "Expanded gallery (20+ images) grouped visually by event type using section headers (not yet filterable/clickable tabs)"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "A visitor can slide their guest count to 250, tick 'Jain only,' see an instant cost estimate, then book a real tasting slot on a live calendar, before they've ever picked up the phone.",
    "bullets": [
     "5-8 pages: Home, Wedding Catering, Corporate Catering, Birthday/Personal Events, Full Menu, Gallery, About/Team, Contact",
     "Real interactive package builder: visitor selects guest count (slider or input), cuisine style, and veg/non-veg/Jain split (e.g. % veg vs non-veg, Jain-only toggle) → tool calculates and displays an estimated total cost and per-plate rate live on screen, pulling from the client's actual price-per-plate-per-tier data (not a stub, genuinely computes from stored pricing rules)",
     "Tasting-appointment booking: a real date/time picker showing available slots (synced to a simple availability calendar the caterer maintains), visitor picks a slot and submits event details; confirmation shown on-screen plus email/WhatsApp notification to the caterer",
     "Filterable past-events gallery: tab/filter controls (Wedding / Corporate / Birthday / All) that actually filter the displayed images client-side, plus lightbox view for full-size photos"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "From first quote to final payment, a bride can build her package, book her tasting, pay her advance, and track every deadline in one login, while you manage every incoming event from a single dashboard instead of a notebook and forty WhatsApp chats.",
    "bullets": [
     "Full Next.js application with all Tier 3 features rebuilt as a fast, app-like experience (client-side routing, no full page reloads between Menu/Gallery/Booking)",
     "Online quote-request with advance-payment stub: after the package builder produces an estimate, visitor can submit a formal quote request that generates a reference number and a payment-link placeholder for the 50% advance (wired for Razorpay/Stripe integration when the caterer is ready to accept card/UPI payments online, built as a real checkout flow, held behind a \"pay advance\" step, not a decorative button)",
     "Event-timeline planner tool: for a selected event date, an interactive timeline showing key milestones the caterer needs from the client (menu finalization deadline, guest-count lock-in date, tasting date, final payment date, setup time on event day), auto-calculated backward from the event date so a bride booking in July for a December wedding sees exactly what's due when",
     "Customer login with booking history: account creation (email/phone + OTP) so a repeat corporate client (e.g. a company booking monthly office lunches) can log in, see past orders, past menus chosen, and re-order or modify a standing booking"
    ]
   }
  ]
 },
 {
  "n": 17,
  "slug": "17-tours-travels-vehicle-hire",
  "name": "Tours & Travels / Vehicle Hire",
  "blurb": "Fleet & tariff tables, popular routes, booking enquiry.",
  "accent": "#6366F1",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "One page that puts your fleet, your rates, and your top pilgrimage routes in front of every customer who searches you on their phone, no more reading out fares over the call.",
    "bullets": [
     "Single-page scrolling site: Hero (fleet tagline + primary route, e.g. \"Mumbai to Shirdi, Nashik, Mahabaleshwar, AC Cars & Tempo Travellers\"), About, Fleet gallery (photo grid: sedan/SUV/tempo traveller with seating capacity labelled), static Local & Outstation tariff table (plain HTML table, per-km rates for 3-4 vehicle types), Popular Routes list (named routes with approximate one-way fare, no calculator), Wedding/Corporate mention as a text section, Testimonials (3-5 static quotes), Driver info blurb (verified drivers, experience), Contact section with click-to-call and click-to-WhatsApp buttons, Google Maps embed for office/garage location",
     "Mobile-responsive, fast-loading, WhatsApp floating button",
     "Basic on-page SEO (title, meta description, one H1) targeting \"[City] tours and travels\" and top route keyword"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "Separate pages for your fleet, your routes, and your wedding/corporate business, so a bride's family, a corporate HR manager, and a Shirdi pilgrim each land on the page that speaks to them, not one page trying to be everything.",
    "bullets": [
     "Everything in Tier 1, restructured across 2-3 pages: Home (hero, fleet teaser, top routes teaser, testimonials, CTA), Fleet & Tariff (full fleet with per-vehicle photo cards, local + outstation tariff tables broken out by vehicle, driver-with-car inclusions listed per vehicle: fuel, driver allowance, toll policy stated), Routes & Packages page (each popular route, Mumbai-Shirdi, Mumbai-Nashik, Mumbai-Mahabaleshwar, Mumbai-Lonavala, gets its own card with distance, duration, one-way and round-trip indicative fare, and a \"best for\" note e.g. \"day darshan trip\" vs \"2-day circuit\")",
     "Dedicated Wedding & Corporate section with separate imagery and package bullets (baraat cars, guest shuttles, monthly corporate contracts)",
     "WhatsApp-first enquiry button pre-filled with route/vehicle text so the customer's message already states what they want",
     "Simple contact form (name, phone, route, travel date, no calendar widget) that emails the owner"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "Your customer picks their route and vehicle and sees a real fare instantly, browses every package you offer with actual prices, and submits a booking enquiry with their exact travel dates, the way MakeMyTrip and Savaari do it, but built around your fleet and your rates.",
    "bullets": [
     "5-8 pages: Home, Fleet (each vehicle a detail page/modal with capacity, AC/non-AC, luggage space, photo gallery), Local & Outstation Tariff, Popular Routes catalog, Wedding Packages, Corporate/Contract Travel, Testimonials/Reviews, Contact",
     "Real working route + vehicle tariff calculator: user selects pickup city, destination (from a dropdown of the 8-12 served routes), trip type (one-way/round-trip), and vehicle type, the page computes and displays an estimated fare live using the client's actual per-km rates, minimum-km/day rule, driver allowance, and night-halt logic (client-side JS, no backend needed, but computes real numbers from real rate data, not a stub)",
     "Popular-routes catalog with per-route pricing: each route (Mumbai-Shirdi, Mumbai-Nashik-Trimbakeshwar, Mumbai-Mahabaleshwar, Mumbai-Lonavala, Mumbai-Pune, Mumbai-Goa, etc.) rendered as a filterable/sortable card grid showing distance, duration, and starting fare per vehicle class, linking into the calculator pre-filled for that route",
     "Booking enquiry form with date-range picker: pickup date + return date (for outstation round trips) or single date (for local/airport), pickup point, vehicle preference, passenger count, submits to owner's email/WhatsApp with all fields, and shows a \"we'll confirm within X hours\" acknowledgment"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "A booking system that runs like an app, customers see real vehicle availability, pay an advance online, and log back in to rebook their usual Shirdi trip in two clicks, while you manage every enquiry, driver assignment, and rate change from one dashboard instead of a notebook and a phone.",
    "bullets": [
     "Full Next.js application, everything in Tier 3, plus:",
     "Real-time vehicle availability calendar: each vehicle in the fleet has a bookable calendar; customers see which dates a specific tempo traveller/car is already committed and which are open, before submitting an enquiry, reduces double-booking friction and back-and-forth confirmation calls",
     "Online advance-payment stub: Razorpay/Stripe-style advance-payment flow (e.g., 20% booking advance) wired to a test/sandbox gateway as a working stub, ready to switch to the client's live merchant account once they're set up",
     "Customer login with trip history: repeat corporate clients or families can log in, see past bookings (route, vehicle, fare paid), re-book a previous trip in one click, and save frequently-used pickup addresses"
    ]
   }
  ]
 },
 {
  "n": 18,
  "slug": "18-general-hospital-policlinic",
  "name": "General Hospital & Polyclinic",
  "blurb": "Department directory, NABH trust, 24×7 emergency banner.",
  "accent": "#0F766E",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "One page that puts your emergency number, your doctors, your NABH status, and your insurance list in front of every worried searcher on their phone, enough to stop losing patients to the hospital down the road that simply looks more credible online.",
    "bullets": [
     "One scrolling page: Hero with hospital name, tagline, and a real photo of the building exterior",
     "Persistent 24x7 emergency banner/strip pinned near the top (emergency number + ambulance number, click-to-call)",
     "Departments/specialities section listing all specialities as a simple icon grid (name + one line each, no individual pages)",
     "\"Our Doctors\" strip showing 4-8 doctor photos with name, qualification, and speciality (no full OPD schedule table yet, just \"OPD timings on request\")"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "Enough structure that a patient can find their department, see the right doctor's OPD days, check if their insurance is on your panel, and see your NABH status, all before they ever pick up the phone.",
    "bullets": [
     "Everything in Tier 1, restructured across 2-3 pages: Home, Departments & Doctors, Contact/Facilities (checkup packages and insurance can live as sections within these or a short third page)",
     "Departments page with each speciality as its own block (description, conditions treated, doctors in that department)",
     "Doctor directory table/list: photo, name, qualification, department, and a basic OPD-days text line per doctor (e.g. \"Mon-Sat, 10am-1pm\"), still static, not filterable",
     "Health checkup packages laid out with full inclusions per package (not just starting price), Basic / Executive / Cardiac / Women's shown side by side"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "A real filterable doctor directory with live OPD schedules, an insurance lookup that answers 'is my policy accepted' instantly, and a booking flow that captures the appointment request before the patient gives up and calls a competitor, this is the tier where your site does the front-desk's job before the phone even rings.",
    "bullets": [
     "Full multi-page site: Home, Departments, Doctors, Health Checkup Packages, Facilities/Tour, Insurance & NABH, Emergency, Contact (5-8 pages depending on how sections split)",
     "Real doctor directory with filters: patients filter by department, day of the week, or name, and see a live-rendered OPD schedule grid per doctor (e.g. select \"Cardiology\" + \"Wednesday\" → see which cardiologists have OPD that day and at what time), built as a working filterable table/grid against real data, not a static list",
     "Appointment-booking widget: patient selects department → doctor (or \"any available\") → sees actual day/slot options → submits name, phone, and preferred slot, which lands as a structured booking request via WhatsApp/email/inbox (form-driven slot logic, not a stub \"contact us\" button)",
     "Insurance/TPA lookup: a searchable list/dropdown where a patient types or selects their insurer and immediately sees whether the hospital is empanelled, cashless vs. reimbursement, and any pre-authorisation contact, not just a static logo wall"
    ]
   },
   {
    "no": 4,
    "price": "₹50,000+",
    "pitch": "This is the tier where a patient can see if a bed is free before they even leave the house, pay a token amount to lock a checkup slot instead of hoping the desk remembers them, and log back in to pull last year's report, the site becomes the front desk, not just the brochure.",
    "bullets": [
     "Everything in Tier 3, rebuilt as a fast, app-like Next.js experience",
     "Patient login with appointment/report history: returning patients sign in (phone/OTP) and see their past appointments, upcoming bookings, and downloadable past checkup/diagnostic reports (starts as a secure document-list view; full EMR integration scoped separately with the client's existing hospital-management system if one exists)",
     "Health-checkup-package online booking + payment stub: patient selects a package, picks a date, and pays an advance/booking amount via Razorpay/UPI to confirm the slot, reducing no-shows the way an upfront deposit does in outpatient bookings generally",
     "Bed-availability display: a live or manually-updated indicator showing general/ICU/private bed availability by department, giving anxious families a real-time answer instead of a phone call during an emergency"
    ]
   }
  ]
 },
 {
  "n": 19,
  "slug": "19-interior-designer",
  "name": "Interior Designer",
  "blurb": "Room-budget estimator, portfolio by style/budget, turnkey vs design-only clarity.",
  "accent": "#3E2A1F",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a studio that needs a credible first impression fast, a warm, styled scroll with one strong hero photo and the model stated plainly is enough for a prospect who already has a referral and just wants to confirm this is a real, working studio before calling.",
    "bullets": [
     "Hero section: studio name, one-line factual positioning (\"Residential & commercial interior design studio, Mumbai\"), one strong styled-room photo as the hero image, single CTA (\"Enquire\" via WhatsApp click-to-chat)",
     "Room-type teaser strip: 4 cards (Living Spaces, Kitchens, Bedrooms, Full-Home Turnkey) with one representative image each, short label only",
     "Trust badges as static blocks: years in practice, projects completed, turnkey-or-design-only model stated in one line",
     "Short photo strip: 4-6 additional real project images beneath the teaser"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a studio ready to answer every \"have you done my kind of space, what's the process, roughly what will this cost\" question without a phone call, a full tagged portfolio plus a plain-English cost and process walkthrough is exactly what turns a browsing prospect into an enquiry.",
    "bullets": [
     "Expands to 2-3 pages: Home, Portfolio, Contact (still scroll-first within each page, not deep nested navigation)",
     "Full portfolio page organised by room type and style, 8-12 real photos per section, each project tagged with approximate area, locality, and budget band",
     "Step-by-step process explainer: consultation, space-planning and 3D design, material/finish selection with client sign-off, execution and site supervision, handover, stated as the studio's actual workflow",
     "Cost-transparency section explaining, in plain language, why quotes vary (material tier, scope, customization) and the studio's change-order policy (written approval before any finish substitution)"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a studio ready to let the website do real pre-qualification work, a budget estimator, a filterable style-and-room portfolio, and a booking flow that turn a browsing visitor into a scheduled site-visit consultation, already knowing their rough number, before the first call.",
    "bullets": [
     "5-8 pages: Home, Portfolio, Process, Services, Pricing, About/Team, Contact",
     "Room-budget estimator (real working tool): visitor selects room type (kitchen, living room, bedroom, bathroom, full-home) and enters approximate area in sq ft, then picks a package tier (Essential/Premium/Luxury); vanilla JS calculates an estimated cost range using a per-sq-ft rate table times a room-type weight (kitchens and bathrooms weighted higher than bedrooms for fixtures/plumbing-adjacent work) times a tier multiplier (Essential x1.0, Premium x1.5, Luxury x2.2), output clearly labeled \"Estimated range only, exact quote confirmed after site visit\"",
     "Filterable project portfolio: client-side JS filters across room type, style (modern/contemporary/traditional/minimalist/industrial), and budget band, with active-filter chips and result count, no page reload",
     "Consultation-booking widget: real date/time-slot picker (vanilla JS, no backend, stores selection and confirms via a WhatsApp-prefilled message or mailto with the chosen slot, property type, and area) letting a prospect request a specific consultation slot instead of open-ended \"message us\""
    ]
   }
  ]
 },
 {
  "n": 20,
  "slug": "20-bakery-cake-shop",
  "name": "Bakery / Cake Shop",
  "blurb": "Custom-cake price estimator, eggless/egg labelling, lead-time-aware order scheduling.",
  "accent": "#7C2D42",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a home baker or small cake shop that needs to stop losing \"do you do custom cakes\" DMs to a competitor, this puts the FSSAI number, clear eggless labelling, and a WhatsApp order button in front of a phone-scrolling customer in one clean scroll.",
    "bullets": [
     "Hero section with bakery name, tagline (e.g. \"Cakes made to match what you imagined\"), one hero photo of a standout real cake, and a single clear CTA (\"Order on WhatsApp\")",
     "Category teaser strip: 4 cards (Birthday Cakes, Custom & Theme Cakes, Cupcakes & Desserts, Eggless Specials) each with one real photo, a one-line description, and a starting per-kg price",
     "FSSAI trust badge: license number displayed in a dedicated strip or footer, with a one-line note that it's verifiable on FoSCoS",
     "Eggless/veg labelling trust block: green-dot/brown-dot iconography with a plain-language line (\"Eggless options clearly marked, made fresh to order\")"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a cake shop ready to show its full range and lay out every trust signal, flavours, pricing, FSSAI, eggless labelling, lead times, clearly enough that a customer arrives at WhatsApp already decided on flavour, size, and date.",
    "bullets": [
     "Expands to 2-3 pages: Home, Full Menu & Portfolio, Contact (still scroll-first, not deeply nested navigation)",
     "Full flavour and pricing page: every flavour (chocolate truffle, red velvet, butterscotch, black forest, vanilla, fresh-fruit) with per-kg pricing, clearly marked egg/eggless availability for each",
     "Portfolio gallery organised by occasion: birthday, anniversary, baby shower, corporate, wedding, theme/character cakes (8-12 real photos)",
     "\"How custom ordering works\" step-by-step module: share a reference photo or idea via WhatsApp, get a quote, confirm with advance payment, collect/receive on the agreed date, explained as a process, not a working tool"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a cake shop serious about converting browsers into booked orders, a real price estimator that answers \"how much will this cost\" instantly, a filterable gallery organised the way customers actually search, and a booking widget that enforces your own lead-time rules, so the customer arrives already knowing the price and holding a confirmed pickup slot.",
    "bullets": [
     "5-8 pages: Home, About/Baker's Story, Menu & Price Estimator, Custom Cake Gallery, How Ordering Works, Book Your Cake, Reviews, Contact",
     "Real custom-cake price estimator: the customer selects weight in kg, a flavour tier (Classic, Premium, Deluxe, each mapped to real flavours), a design-complexity level (plain cream-finish, semi-fondant, full-fondant/3D sculpted), and an egg or eggless toggle; the tool computes an instant estimate using the actual formula (weight in kg × flavor-tier base rate × design-complexity multiplier, with a small eggless differential only where the client's real pricing has one) and ends with an \"Order this on WhatsApp\" button that pre-fills the selections into the message, not a static price list, a real running calculation",
     "Filterable custom-cake gallery: real filtering across the portfolio by occasion (birthday, anniversary, baby shower, corporate, wedding, theme/character), by flavour, and by egg/eggless, built from structured data so the owner can hand over new cake photos for the developer to add without a redesign",
     "Order-scheduling widget with lead-time enforcement: a real booking tool where the customer picks a pickup or delivery date and time slot; the widget enforces the bakery's actual lead-time rules (blocks any date less than 24 hours out for simple cakes, less than 72 hours out if a fondant/detailed design is selected, and flags wedding/tiered orders as needing a direct consultation), captures occasion and any reference-photo note, and ends in a genuine confirmation screen summarising the order before routing it to a WhatsApp prefill"
    ]
   }
  ]
 },
 {
  "n": 21,
  "slug": "21-law-firm",
  "name": "Lawyer / Law Firm",
  "blurb": "BCI-compliant, factual-only site: consultation-fee estimator, practice-area guide, zero testimonials.",
  "accent": "#1C2833",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a solo advocate who needs a factual, Rule-36-compliant presence so a prospect actively searching \"advocate near me\" finds a real enrolment number and real courts of practice instead of nothing, clean and built to stay inside Bar Council rules from day one.",
    "bullets": [
     "Hero section: advocate/firm name, one factual descriptor (\"Advocate, Bombay High Court, Civil, Family & Property Law\"), Bar enrolment number stated plainly, single CTA (WhatsApp click-to-chat)",
     "Practice-area teaser strip: 4 icon+text cards naming specific areas (e.g. Matrimonial & Family Law, Property & Title Disputes, Cheque Bounce/NI Act, Consumer Complaints)",
     "Factual trust block: enrolment number, State Bar Council, years in practice, courts practiced in, law degree/college, presented as static badge/fact cards",
     "One real, professional advocate photo"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For an advocate whose practice areas and credentials are too broad for a single scroll, enough structure to lay out every area of practice and every enrolment fact clearly, so a prospect can self-qualify before the first call without the site ever crossing into advertising.",
    "bullets": [
     "Expands to 2-3 pages: Home, Practice Areas, Contact (still scroll-first, not deeply nested navigation)",
     "Full Practice Areas page: every area gets its own block with a factual paragraph explaining what matters in that area typically involve and what the advocate's role is (e.g. what a cheque-bounce complaint under the NI Act involves, what a title-dispute matter typically requires), informational, never framed as a pitch",
     "Expanded credentials section: full enrolment detail (number, date, State Bar Council of original and current roll), education timeline, Bar Association membership, courts practiced in listed individually",
     "Factual case-type breadth: the general categories of matters handled, stated by type only, never by naming a client or claiming an outcome"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For an advocate ready to be the useful resource a prospect bookmarks before they even call, a real fee estimator, a document checklist that cuts first-call friction, and a proper booking flow, all built to stay squarely inside Rule 36's pull-model rules.",
    "bullets": [
     "5-8 pages: Home, About/Advocate Profile, Practice Areas, Practice-area detail pages, FAQ, Contact",
     "Consultation-cost estimator: a real vanilla-JS tool where a visitor selects matter type (property, matrimonial, cheque-bounce, consumer, commercial) and rough complexity, and receives an estimated consultation-fee range plus a neutral note that final fees depend on case specifics, factual utility, not a sales quote",
     "\"Which practice area do I need\" guided questionnaire: a short branching set of factual questions (e.g. \"Is this a dispute over property title, a family matter, or a financial/commercial issue?\") that routes the visitor to the correct practice-area page, reducing wasted first calls",
     "Document-checklist generator: visitor picks a common matter type (property dispute, matrimonial case, cheque-bounce complaint, consumer complaint) and gets a real, printable/downloadable checklist of documents typically needed to start that matter"
    ]
   }
  ]
 },
 {
  "n": 22,
  "slug": "22-dental-clinic",
  "name": "Dentist / Dental Clinic",
  "blurb": "Treatment-cost estimator, sterilisation trust module, symptom-to-treatment guide.",
  "accent": "#0EA5E9",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a solo dentist who needs a credible page fast, the DCI registration, sterilisation proof, and pain-free technology an anxious patient checks for before they'll book, in one calm scroll that ends at WhatsApp.",
    "bullets": [
     "Hero: clinic name, tagline, one strong photo of the real operatory/reception, single CTA (\"Book on WhatsApp\")",
     "Teaser strip of 4 core services: General Dentistry, Cosmetic/Smile Design, Orthodontics, Pediatric Dentistry, one line each",
     "Dentist credential badge (non-negotiable, even for a solo practice): name, photo, BDS/MDS, DCI registration number, years practicing",
     "Hygiene trust badges displayed statically: \"Autoclave Sterilisation\", \"Single-Use Disposables\", \"DCI Registered\""
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a clinic ready to answer every \"do you treat this, is it clean, roughly what will it cost\" question without a phone call, full sterilisation transparency, real credentials, and honest price bands laid out so a nervous patient arrives already decided.",
    "bullets": [
     "Expands to 2-3 pages: Home, Services, Contact (scroll-first, not deep nav)",
     "Full services page organised by category with real photos and patient-language descriptions for every treatment (not just names)",
     "Sterilisation & Safety as its own dedicated trust module: autoclave cycle explained, single-use disposables photographed, PPE and water-line disinfection routine described, DCI registration displayed alongside",
     "Dentist credentials expanded into a full bio: degree, DCI registration number, dental college, years practicing, continuing-education certifications, IDA membership"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a clinic serious about converting anxious searchers into booked patients, a real cost estimator built on the clinic's actual rates, a symptom guide that tells a patient what they probably need before they call, and a booking flow that reaches a real confirmed slot, this is the tier where the site replaces the front-desk phone call.",
    "bullets": [
     "5-8 pages: Home, About/Dentists, Services (with per-treatment detail pages), Cosmetic Dentistry, Hygiene & Safety, Cost Guide, Reviews, Contact",
     "Treatment-cost estimator (real working calculator): patient selects a procedure type (scaling, filling, root canal, extraction, implant, whitening, braces/aligners) plus a complexity factor (e.g. number of teeth, front vs. back tooth, simple vs. surgical extraction), and the page computes an estimated price range from the clinic's actual rate table, clearly labelled \"estimate only, confirmed after clinical examination\", DCI-safe because it is explicitly non-binding, not a fixed quote or outcome promise",
     "Symptom-to-treatment guide: a short guided questionnaire (pain location, duration, triggers like hot/cold/biting, swelling present or not) that routes to a suggested next step, e.g. \"this pattern often points to a Root Canal consultation\", tagged clearly as informational triage, not a diagnosis, with an explicit \"please confirm with the dentist\" disclaimer at the result",
     "Real appointment-booking widget: patient picks a dentist (if the clinic has more than one), sees actual available date/time slots from a structured schedule, selects one, submits name/phone/concern, and reaches a genuine confirmation state (booking request routed via WhatsApp prefill, slot marked as requested so the same slot isn't shown as open twice in the same session)"
    ]
   }
  ]
 },
 {
  "n": 23,
  "slug": "23-manufacturing-industrial",
  "name": "Manufacturing / Industrial",
  "blurb": "Filterable capability catalog, multi-step RFQ configurator, lead-time estimator.",
  "accent": "#37474F",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a manufacturer that needs a credible first impression fast, a procurement contact scrolls once, sees real certification and facility signals instead of a blank Google listing, and sends an RFQ instead of moving to the next search result.",
    "bullets": [
     "Hero section: company name, one-line capability descriptor (e.g. \"Precision Sheet Metal Fabrication for Automotive & Construction OEMs\"), single strong factory-floor or product photo, one CTA (\"Send RFQ\" via WhatsApp click-to-chat)",
     "Capability teaser strip: ~4 cards (e.g. Fabrication, Machining, Assembly, Packaging) with icon and one-line text, generic enough to apply across the client's actual capability mix",
     "Trust badge strip: ISO certification badge(s) with certificate number, years in business (static figure), GSTIN displayed, small icon row of industries served",
     "Compact \"About\" block: year established, one factual paragraph on what the company makes and for whom"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a manufacturer with a genuine capability breadth to show, full spec detail, an explained quality process, and a structured RFQ page so a buyer can answer every \"do they make X, are they certified, what's their capacity\" question without picking up the phone.",
    "bullets": [
     "Expands to 2-3 pages: Home, Capabilities/Products, Contact-RFQ (still scroll-first within each page, not deep nested navigation)",
     "Full capability/product catalog page: each category gets its own block with materials worked, size/tolerance ranges, finishes, and typical applications described in text, backed by real photos",
     "Certifications module expanded into an explained section: each ISO/BIS/CE certificate shown with its number, scope, and validity, plus a step-by-step description of the quality-control process (incoming inspection, in-process checks, final inspection, MTC/COA issuance)",
     "Industries-served section: 4-6 industry types described with what the company typically supplies to each, no confidential client names"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a manufacturer ready to let the site do real qualification work, a buyer filters to the exact process and material they need, configures a structured RFQ instead of typing a vague message, and gets an honest lead-time estimate before ever picking up the phone.",
    "bullets": [
     "5-8 pages: Home, About/Facility, Capabilities & Products, Industries Served, Quality & Certifications, RFQ Configurator, Contact",
     "Filterable product/capability catalog: a real vanilla-JS filter over a structured dataset (JSON) of the company's capability list, filterable by material (MS/SS/Aluminium/Brass/etc.), process (CNC machining/laser cutting/welding/casting/etc.), industry served, and capacity range, the grid live-updates client-side with no backend",
     "RFQ configurator: a real multi-step form, Step 1 product category, Step 2 material and finish, Step 3 quantity and specifications, Step 4 delivery timeline and contact details, that assembles a structured quote-request summary on a review screen before submission, rather than a single plain contact form",
     "Capacity/lead-time estimator: order quantity plus a product-complexity selector (simple/moderate/complex) run through a stated formula (e.g. base lead time by complexity tier, adjusted by a quantity multiplier) to output an estimated production lead-time range in days or weeks, clearly labeled \"Estimate only, confirmed on RFQ review\""
    ]
   }
  ]
 },
 {
  "n": 24,
  "slug": "24-insurance-agent",
  "name": "Insurance Agent",
  "blurb": "IRDAI-compliant, cover-need calculator, illustrative premium estimator, claim-process guide.",
  "accent": "#0B3D66",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "Full inclusions for this trade are being written up. The ladder matches every other template. Ask us for specifics.",
    "bullets": []
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "Full inclusions for this trade are being written up. The ladder matches every other template. Ask us for specifics.",
    "bullets": []
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "Full inclusions for this trade are being written up. The ladder matches every other template. Ask us for specifics.",
    "bullets": []
   }
  ]
 },
 {
  "n": 25,
  "slug": "25-architect",
  "name": "Architect",
  "blurb": "Design-fee estimator, BMC approval-timeline guide, filterable project portfolio.",
  "accent": "#1C2B24",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a practice that needs a credible first impression fast, a scroll of real registration and a strong building image is enough for a prospect who already has a referral and just needs to confirm this is a real, sanctioned-and-registered architect before calling.",
    "bullets": [
     "Hero section: firm name, one-line factual positioning (\"Architecture practice, residential and commercial design, Mumbai\"), one strong signature building photo/render as the hero image, single CTA (\"Enquire\" via WhatsApp click-to-chat)",
     "Project-type teaser strip: 4 cards (Residential, Commercial, Renovation & Additions, Interiors-Integration Handoff) with one representative image each, no descriptions beyond a short label",
     "Trust badges as static blocks: COA registration number, years in practice, principal's qualification (e.g. \"B.Arch, COA Reg. No. CA/2010/XXXXX\")",
     "Google Maps embed of the office location"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a practice ready to answer every \"have you done X, do you handle approvals, what's the process\" question without a phone call, a full portfolio plus a plain-English walk-through of the BMC sanctioning process, the exact thing that turns a browsing prospect into an enquiry.",
    "bullets": [
     "Expands to 2-3 pages: Home, Portfolio, Contact (still scroll-first within each page, not deep nested navigation)",
     "Full portfolio page organised by project type (Residential / Commercial / Renovation), 8-12 real photos or renders per section, each project tagged with built-up area, location area, and year",
     "Step-by-step sanctioning-process explainer: what BMC/municipal approval actually involves (drawing submission through the AGNI/DPMS portal, Intimation of Disapproval, structural stability certificate, Commencement Certificate, plinth checking, Occupancy Certificate) and how the firm handles each step on the client's behalf, this is the single highest-trust section on the whole site",
     "Structural-engineering coordination explained: how the firm interfaces with structural consultants, whether in-house or partnered, and at what design stage structural input is brought in"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a practice ready to let the website do real pre-qualification work, a fee estimator, a filterable portfolio, and an approval-timeline guide that answer a prospect's hardest questions (what will this cost, how long will approval take) before the first call, with a booking flow that turns that confidence straight into a scheduled consultation.",
    "bullets": [
     "5-8 pages: Home, Portfolio, Process (sanctioning/approvals), Services, About/Team, Fees, Contact",
     "Design-fee estimator (real working tool): visitor inputs built-up area (sq ft), project type (residential/commercial/renovation), and complexity tier (standard/premium/luxury); vanilla JS calculates an estimated design-fee range using a per-sq-ft rate table times a complexity multiplier (e.g. standard x1.0, premium x1.4, luxury x1.8), output clearly labeled \"Estimated range only, final fee confirmed after site visit and brief\"",
     "Filterable project portfolio: client-side JS filters across project type, scale (small/mid/large), and location/suburb, with active-filter chips and result count, no page reload",
     "Approval-timeline step-through guide: visitor selects project type and scale, and the tool walks through the applicable sanctioning stages (IOD, Commencement Certificate, plinth checking, Occupancy Certificate, plus RERA registration step if the scale threshold is crossed) with an estimated cumulative timeline range per stage, based on typical BMC processing times (e.g. 60-120 days straightforward residential, 6-12 months complex/high-rise), clearly labeled as typical-range estimates, not guarantees"
    ]
   }
  ]
 },
 {
  "n": 26,
  "slug": "26-auto-repair-garage",
  "name": "Auto Repair / Garage",
  "blurb": "Service-cost estimator, pickup/drop scheduler, insurance cashless-claim walkthrough.",
  "accent": "#1A1D21",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a garage that needs a credible first impression fast, a scroll showing real bay photos and a plain warranty-and-parts promise is enough to turn a passing referral into a WhatsApp message instead of a call to the dealership.",
    "bullets": [
     "Hero section: garage name, one-line factual positioning (\"Multi-brand car service and repair, Mumbai\"), one strong real photo of a service bay with a car actually being worked on, single CTA (\"Get a Quote\" via WhatsApp click-to-chat)",
     "Services teaser strip: 4 cards (General Service, Denting & Painting, AC & Electrical Repair, Detailing) with one representative image each, short label only, no long descriptions",
     "Trust badges as static blocks: genuine/OEM-equivalent parts sourcing statement, trained-mechanic signal (years of combined experience), warranty on work (e.g. \"6-month service warranty\")",
     "Google Maps embed of the workshop location"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a garage ready to answer every \"do you service my brand, do you use real parts, what will this roughly cost\" question without a phone call, a full services breakdown plus a named parts-and-warranty policy and insurance tie-ups is exactly what turns a browsing car owner into a booking.",
    "bullets": [
     "Expands to 2-3 pages: Home, Services, Contact (still scroll-first within each page, not deep nested navigation)",
     "Full services page with real photos and a short process explanation per service: General Service, Denting & Painting, AC/Electrical Repair, Detailing, Insurance-Claim Assistance",
     "Dedicated parts-sourcing/genuine-parts trust module as its own section: states the exact policy (OEM via authorized distributor vs OEM-equivalent, and how the customer is consulted before either is used), not just a one-line badge",
     "Insurance-network strip: named insurer tie-ups for cashless claims (or \"reimbursement-claim support\" if not formally empanelled), explained in plain language so a customer understands what \"cashless\" actually means at this garage"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a garage ready to let the website do real pre-qualification work, a cost estimator, a bookable pickup-drop slot picker, and an insurance-claim guide answer a customer's hardest questions (what will this cost, can I get free pickup, will my claim be cashless) before the first call, and capture their car details for a future service reminder besides.",
    "bullets": [
     "5-8 pages: Home, Services (with sub-sections), Parts & Warranty Policy, Insurance Claims, Detailing/Before-After Gallery, About/Team, Contact",
     "Service-cost estimator (real working tool): visitor selects car segment (hatchback/sedan/SUV/luxury) and service type (general service/AC repair/denting-painting/detailing), vanilla JS calculates an estimated cost range from a base-rate table times a segment multiplier, output clearly labeled \"Estimated range only, final cost confirmed after inspection\"",
     "Pickup-drop scheduling widget (real working tool): visitor picks a date and available time slot from a vanilla-JS calendar/slot picker (slots defined in a simple JS config, no backend), enters address and car details, and the tool confirms the booking via a WhatsApp-prefilled message or mailto with the chosen slot, turning the free pickup-drop differentiator into an actual bookable feature",
     "Insurance-claim assistance step-through guide (real working tool): an interactive step-by-step walkthrough (accordion or wizard, vanilla JS) covering what to do immediately after an accident, documents needed, and how the cashless-garage-network process works at this specific garage if empanelled, with a distinct branch explaining reimbursement-claim support if not"
    ]
   }
  ]
 },
 {
  "n": 27,
  "slug": "27-business-consultant",
  "name": "Business Consultant",
  "blurb": "Business-health diagnostic, engagement-fee configurator, MSME scheme finder.",
  "accent": "#0B7A55",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For the consultant whose entire pipeline is referrals and BNI introductions, this page is what the referred prospect reads the night before deciding to call, and it answers the only question they have: is this person specific and proven, or another talker.",
    "bullets": [
     "Hero: name, narrow one-line specialisation, one headline outcome metric (\"₹4.2 crore in cost reductions delivered across 14 engagements\"), single CTA (WhatsApp \"Book a discovery call\")",
     "Who-I-work-with strip: industries and company-size band, stated in one blunt sentence",
     "Problems-solved teaser: 4 cards named as problems, not services (\"Margins shrinking as you grow,\" \"Founder is the bottleneck,\" \"Working capital stuck in inventory,\" \"No MIS, decisions on gut feel\")",
     "Method walkthrough: diagnose, recommend, implement, measure as 4 numbered static steps with 2-3 sentences each"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "Everything a prospect needs to self-qualify before the first call: what you fix, how you work, what it costs, and who says so, laid out so the discovery conversation starts at \"when do we begin\" instead of \"so what do you do.\"",
    "bullets": [
     "2-3 pages: Home, Advisory Areas, Contact (scroll-first, shallow nav)",
     "Advisory Areas page: each problem class gets its own long block, covering what a typical engagement involves week by week, what the client team must contribute, what deliverables look like (diagnostic report, SOP set, MIS templates), and which engagement model usually fits",
     "Outcome snapshots expanded to 6-8, filterable-looking but static, grouped by industry; add 2-3 NAMED testimonials with designation and company where permission was collected",
     "Method section deepened: each of the four phases gets its own sub-block with the actual tools used (time-and-motion study, margin waterfall, process mapping) named concretely"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "The prospect arrives at the discovery call pre-qualified by their own hand: they have scored their business, seen the engagement shape and band that fits, and booked a slot, so the consultant sells to a self-diagnosed buyer instead of educating a cold one.",
    "bullets": [
     "5-8 pages: Home, Advisory Areas, Method, Results, Business Health Check, Engagement Planner, Contact",
     "Business-health diagnostic: 12 questions across four areas (finance, operations, sales, people), 3 per area, answered on a 1-4 scale; scored client-side into per-area ratings (Strong / Watch / Weak) with a short written readout per area drawn from a static insight matrix; ends with a \"Discuss your results on a discovery call\" CTA that opens WhatsApp with the four area scores prefilled in the message",
     "Engagement-scope configurator: prospect selects turnover band, primary problem area, and urgency (exploring / this quarter / on fire); JS lookup table returns the suggested engagement type (diagnostic sprint vs project vs retainer), typical duration, an indicative fee band, and what week one looks like; \"Request this scope\" opens WhatsApp with the configuration prefilled",
     "MSME scheme finder: prospect answers Udyam registration status, enterprise category (micro/small/medium), sector, and goal (credit / quality certification / subsidy); client-side rules list the applicable schemes (e.g. ZED with the correct subsidy tier for their category, CGTMSE, PMEGP) each with a one-line \"how I help\" note and a consult CTA; includes the mandatory honesty line that ZED/Udyam registration itself is free of government cost"
    ]
   }
  ]
 },
 {
  "n": 28,
  "slug": "28-building-contractor",
  "name": "Building Contractor",
  "blurb": "Construction-cost estimator, stage-payment schedule calculator, site-visit booking.",
  "accent": "#24303C",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a contractor whose leads all come from referrals, one honest scrolling page with real numbers, named brands, and a stated payment structure is what makes the society secretary who got your name at a meeting message you for a site visit instead of quietly shortlisting someone who looks more established.",
    "bullets": [
     "Hero: firm name, one-line scope statement (\"Civil construction contractors, Mumbai. Residential buildings, redevelopment execution, commercial fit-outs\"), one real project or site photo, single CTA (\"Book a Site Visit\" via WhatsApp)",
     "Work-type teaser strip: 4 cards (New Construction, Society Redevelopment, Commercial Fit-outs, Structural Repairs & Waterproofing) with one image and short label each",
     "Trust-badge strip as static blocks: years in business, projects completed, GST registered, labour-licence/BOCW compliant, defect-liability period offered, safety record",
     "Long-scroll substance (8-10 sections): firm story, how-we-execute walkthrough in plain steps (site visit, estimate, agreement, stage-wise billing, handover), materials-and-quality policy naming cement and steel brands, stage-payment structure stated in one honest paragraph, service-areas list, FAQ (6-8 questions: rates, timelines, who supplies material, what happens if work stops)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a contractor ready to win the shortlist before the first call: a prospect can verify \"they have built my type of project, here is the slab going up in photos, here is exactly how they bill and what brands they pour\" without speaking to anyone, which is precisely the homework a redevelopment committee does at 11pm.",
    "bullets": [
     "2-3 pages: Home, Projects, Contact (each long and scroll-first)",
     "Full project portfolio organised by work type, 8-12 projects, each tagged with suburb, built-up area, floors, year, and role; flagship projects shown as foundation → structure → finishing stage-photo sequences, the single strongest anti-abandonment proof a contractor can publish",
     "Execution-methodology section expanded step by step: mobilization, bar-bending/shuttering cycle, stage-wise quality checks (cube tests, steel certificates, per-stage checklists), stage-wise billing with the firm's actual milestone percentages shown as a static table, handover and defect-liability terms",
     "Materials-and-brands policy as a dedicated section: named cement/steel/waterproofing/wiring brands with grades, and the firm's stance on client-purchased vs contractor-supplied material"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a contractor who wants the website to do the pre-qualification meeting: the prospect arrives at the site visit already knowing the indicative cost band, the exact stage at which every rupee is due, and which of your buildings match their project, so the conversation starts at \"when can you mobilize\" instead of \"can we trust you\".",
    "bullets": [
     "5-8 pages: Home, Projects, Process & Quality, Services, Cost & Payments, About/Team, Contact",
     "Construction-cost estimator (real working tool): visitor selects work type (new construction/redevelopment shell/commercial fit-out/repairs), enters built-up area in sq ft, and picks a specification grade (economy/standard/premium); vanilla JS multiplies against a researched Mumbai rate table (approx ₹1,800-2,500 economy, ₹2,200-3,500 standard, ₹3,500-6,000 premium per sq ft, tuned to the firm's actual rates at build time) and outputs an indicative total cost range plus per-sq-ft band, clearly labeled \"Indicative only, final rate after site visit and drawings\"",
     "Stage-payment schedule explainer (real working tool): visitor enters an estimated project value (or carries it over from the estimator) and the tool renders the firm's milestone table with computed rupee amounts per stage (advance, foundation, plinth, per-slab, masonry, plaster, finishing, retention held and its release trigger), turning the scariest part of hiring a contractor into a transparent printed schedule",
     "Filterable project portfolio: client-side JS filters by work type, scale (under 2,000 / 2,000-10,000 / 10,000+ sq ft), suburb, and status (completed/ongoing), with active-filter chips and result count, no reload"
    ]
   }
  ]
 },
 {
  "n": 29,
  "slug": "29-building-materials-retailer",
  "name": "Building Materials Retailer",
  "blurb": "Tile-quantity estimator, filterable range browser, bulk-quote WhatsApp builder.",
  "accent": "#3B3A33",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For the shop still answering \"do you keep 2x4 vitrified, what rate\" thirty times a day, this puts your brands, your first-quality promise and your delivery areas on one phone screen, so the customer sends a requirement list instead of asking the basics.",
    "bullets": [
     "Hero: wide showroom photograph, shop name, one-line positioning (\"Authorised dealer, first-quality material, site delivery across [area]\"), single CTA to WhatsApp",
     "Category range strip: 4 cards (tiles, sanitaryware and CP fittings, plywood and laminates, hardware) each with a real photo and a two-line range summary",
     "Brand-partner strip: named brand logos (Kajaria, Somany, Jaquar, Century, Greenply style) with \"authorised dealer\" tags only where true",
     "Trust badge row: years in business, GST-registered, first-quality-only pledge, delivery radius, dealer certificates thumbnail"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "Your whole counter conversation, range, brands, honest rate bands, grades explained, delivery terms, is on the site before the customer visits, so the people who walk in are already half-sold and the seconds-scam fear is answered in writing.",
    "bullets": [
     "2-3 pages: Home, Range (full catalog), Contact/Visit",
     "Full category pages, 8-12 real photos each: tiles by size and finish family (600x600, 600x1200, GVT/PGVT, wall series), sanitaryware by range, plywood by grade (MR/BWR/BWP) and thickness, laminates and hardware",
     "Price-band tables per category: per-sqft bands for economy/standard/premium/imported tiles, per-sheet bands by ply grade and thickness, stated honestly with a \"rates vary by quantity and series\" caveat",
     "Buyer education modules written out properly: how to spot first-quality versus seconds (shade codes on cartons, pinholes, edge chipping), what MR versus BWR versus BWP actually means, why the GST bill protects the buyer's warranty"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "The customer arrives with boxes already counted and a structured requirement list already sent; your counter time goes to closing the rate, not doing arithmetic, and the contractor who builds one quote list on your site rarely bothers pricing it at the next shop.",
    "bullets": [
     "5-8 pages: Home, Tiles, Sanitaryware, Ply and Laminates, Price Guide, Contractors, About/Certificates, Contact",
     "Tile quantity estimator: buyer enters room length and width (feet or meters), picks tile size (600x600, 600x1200, 300x600 wall), gets sq ft needed, tiles and boxes required with a 10% wastage factor, and an indicative cost range from the category's price band; result carries a \"Send this to us on WhatsApp\" button with the numbers pre-filled",
     "Filterable range browser: the Tier 2 catalog rebuilt from a structured JS data file, filterable by category, brand, size, finish and price band, with instant client-side results; the owner hands over a simple list to update it",
     "Bulk-quote builder: a multi-line requirement composer (add rows: category, brand, size/grade, quantity, unit), plus name, site area and needed-by date, which assembles one clean structured WhatsApp message; this is the contractor's Monday-morning tool"
    ]
   }
  ]
 },
 {
  "n": 30,
  "slug": "30-printing-press",
  "name": "Printing Press",
  "blurb": "Instant print-quote calculator, artwork-readiness checker, sample gallery.",
  "accent": "#1C1917",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a press whose only web presence is a Justdial listing, one credible scroll with real machine names, a stated proof process and a turnaround promise is enough for an office admin to WhatsApp the requirement instead of forwarding it to the next printer in the group chat.",
    "bullets": [
     "Hero: press name, one-line positioning (\"Offset and digital printing under one roof since 1998, Mumbai\"), one strong press-room or finishing macro photo, single CTA (\"Send Your Print Requirement\" via WhatsApp click-to-chat)",
     "Product teaser strip: 4 cards (Business Stationery, Marketing Collateral, Packaging & Boxes, Signage & Large-Format) with one photo and short label each",
     "Capability badge strip: offset + digital, machine names as trust signals (e.g. \"Heidelberg 4-color offset\"), in-house finishing list (lamination, foiling, die-cutting), and a stated turnaround promise per category",
     "Long-scroll sections (8-10 total): capability walkthrough in plain language (when digital, when offset), quality-control and proof-approval process described step by step, turnaround and delivery policy, industries served icon row, sample-work photo strip, short FAQ (5-6 questions: minimum quantity, file formats, proof policy, delivery area, rush jobs)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a press ready to answer \"what can you print, on what paper, at roughly what price, and how do I send files\" without a phone call, a full catalog with honest price bands and a step-by-step process page turns every forwarded link into a pre-qualified enquiry.",
    "bullets": [
     "Expands to 2-3 pages: Home, Products & Pricing, Contact (scroll-first within each page)",
     "Full product-catalog page by category: each product block gets real sample photos, paper/GSM options, available finishes, minimum quantities, and indicative price bands at standard quantity breaks (e.g. \"1,000 offset visiting cards, 300 GSM, matte lamination: Rs 900 to Rs 2,500 depending on finish\"), stated as ranges the owner approved",
     "The process explained end to end as a numbered module: artwork submission, digital proof, approval, plates/print, finishing, delivery, with the correction-rounds policy stated",
     "Artwork guidance section: accepted formats, CMYK not RGB, 300 DPI, 3mm bleed, text inside safe area, fonts outlined, with a plain-language line on each and a note on paid artwork-fixing service"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For a press that wants buyers arriving pre-sold, the visitor configures their own indicative quote, checks their artwork is print-ready, and sends a fully-specced WhatsApp enquiry, so the counter conversation starts at \"confirm and print\" instead of twenty clarifying questions.",
    "bullets": [
     "5-8 pages: Home, Products & Pricing, Sample Gallery, Instant Quote, Artwork Guide, About/Machinery, Contact",
     "Instant-quote calculator (real working tool): visitor selects product type (visiting cards/letterheads/flyers/brochures/posters), quantity tier, paper GSM option, and finish (none/matte lam/gloss lam/spot UV/foil), and vanilla JS computes an indicative price from a client-approved rate table built on researched Mumbai bands (e.g. digital cards Rs 1-3 per piece at low quantities, offset collapsing per-unit cost at 1,000-plus, brochures roughly Rs 4-15 per unit by run length and stock), output clearly labeled \"Indicative estimate, final quote confirmed after artwork review\", with a \"Send this quote on WhatsApp\" button carrying the configuration and quote reference",
     "Filterable sample gallery (real working tool): client-side JS filtering over a structured JSON of sample jobs by product type, industry, and finish (foil/emboss/die-cut/UV), each sample opening a lightbox with stock, finish and turnaround details",
     "Artwork-readiness checker (real working tool): an interactive checklist wizard (file format, color mode, resolution, bleed, safe area, fonts) where the visitor answers each item and vanilla JS outputs a ready/not-ready verdict with specific fix instructions per failed item and a note on the paid fixing service, ending in a WhatsApp CTA that includes the checklist result"
    ]
   }
  ]
 },
 {
  "n": 31,
  "slug": "31-event-management",
  "name": "Event Management",
  "blurb": "Per-head budget estimator, proposal configurator, date-availability calendar.",
  "accent": "#FFB627",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "An admin head scrolls once, sees 400 events, a 5,000-seat audience record, and your brief-to-show-day process, and messages you for a proposal before comparing anyone else.",
    "bullets": [
     "One long scroll page (8-10+ sections): hero with a real large-audience event photo and one \"Request a Proposal\" CTA, event-type teaser strip (4 cards: corporate conferences, launches and activations, award nights and galas, exhibitions), capability badge row (events delivered, largest audience handled, vendor network size, cities covered), how-we-produce walkthrough (brief, concept, budget lock, vendor mobilization, run-of-show, show-day, wrap report as a static numbered rail), budget-discipline promise section (locked budget sheet, no surprise line items, GST invoice), vendor and AV capability strip, compliance line naming NOCs and PPL/IPRS licensing handling, photo strip of 8-12 real event images, FAQ (6-8 questions: lead time, minimum budget, outstation events, who handles licenses), Google Maps embed, contact block",
     "Floating WhatsApp button plus click-to-call, both visible throughout on mobile",
     "GSTIN and registration line in the footer for procurement credibility",
     "Mobile-responsive, basic on-page SEO (title/meta/LocalBusiness schema)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "A procurement manager can judge your scale-fit, your process discipline, and your compliance handling entirely from the site, so the first call starts at 'send us a proposal' instead of 'tell us about yourselves.'",
    "bullets": [
     "Everything in Tier 1 restructured across Home, Portfolio and Services, Contact",
     "Full portfolio segmented by event format, 8-12 photos per section, each flagship event carrying factual scale details (audience size, venue, scope delivered, client industry)",
     "Production methodology page section explaining each step in depth: brief intake, concept and 3D deck, budget lock, vendor mobilization, run-of-show drafting, rehearsal and show-calling, wrap report with reconciled budget",
     "Services depth blocks: AV and staging, LED and lighting, artist and anchor management, delegate management and registration, branding and fabrication, exhibition stall design"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "A marketing head sets 800 guests and an LED wall, sees ₹28-42 lakh on screen, checks your December dates, and lands in your WhatsApp with a complete structured brief, all before you have spoken a word.",
    "bullets": [
     "5-8 pages: Home, Conferences, Launches and Activations, Award Nights and Galas, Exhibitions, Portfolio, About and Process, Contact",
     "Event-budget estimator (vanilla JS): visitor picks event type, guest count (slider), venue class (5-star hotel, banquet, convention centre, open ground), and add-ons (LED wall, celebrity artist, delegate kits, live streaming); tool computes an indicative budget range from a researched per-head rate structure (e.g. conference ₹2,000-₹4,500/head base by venue class, gala ₹3,500-₹8,000/head, plus flat add-on bands), shown as a low-high range with an 18% GST note and a peak-season (Oct-Dec) advisory, never a false-precision single figure",
     "Filterable portfolio: filter chips by event type, audience band (under 200, 200-500, 500-1,500, 1,500+), and client industry; client-side filtering with lightbox and fact captions",
     "Proposal-request configurator: multi-step flow (event type, tentative date or month, guest count, venue booked or needed, budget band, add-on interests, company and contact details) that assembles a structured proposal request and opens WhatsApp with the brief prefilled via wa.me link, mirrored by a mailto fallback"
    ]
   }
  ]
 },
 {
  "n": 32,
  "slug": "32-wedding-planner",
  "name": "Wedding Planner",
  "blurb": "Line-item wedding budget planner, timeline generator, real-weddings gallery.",
  "accent": "#3D5136",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "A bride's mother scrolls one page, sees real mandaps you actually built, reads exactly how your fees work, and messages you her daughter's wedding date before dinner.",
    "bullets": [
     "One long scroll page, 9-10 sections in this order:",
     "- Hero: full-bleed real Indian wedding photo (mandap or sangeet moment, never white-gown stock), studio name, one-line promise, \"Share your date on WhatsApp\" CTA",
     "- What We Plan teaser strip, 4 cards: full wedding planning, destination weddings, decor and design, day-of coordination",
     "- Trust-badge band: weddings planned, venues and cities worked, vendor partners, years in the business"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "Couples judge style-fit from four real weddings told ceremony by ceremony, and process-trust from your 12-month method, before you have spent a single minute on a call.",
    "bullets": [
     "Everything in Tier 1, restructured across 2-3 pages: Home, Real Weddings, Services and Process (or merged Services+Contact)",
     "Real Weddings portfolio: 3-4 wedding stories, each with couple names/initials, venue, city, guest count and function count, and 8-12 photos grouped by ceremony (haldi, mehendi, sangeet, pheras, reception); one destination and one intimate wedding included if available",
     "Planning-method page: the 12-month arc explained step by step (venue and date lock, core-vendor booking while top teams still have dates, design and decor development, outfits and invites, guest logistics, wedding-week run-sheets and rehearsal), presented as a visual timeline",
     "Services depth sections: decor design and mandap styling, guest hospitality (RSVPs, rooms, transport, hampers), ritual coordination across communities, destination-wedding management"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "A couple arrives at your first call with a realistic ₹28 lakh line-item budget and a dated 12-month plan your own website generated, so the meeting starts at 'yes, how do we begin' instead of 'what will this cost'.",
    "bullets": [
     "5-8 pages: Home, Real Weddings (filterable), Services, Budget Planner, Plan My Timeline, About/Team, Contact",
     "Wedding budget planner (vanilla JS): couple sets guest count (slider), number of functions (2-6), venue class (banquet / 5-star / destination), and decor tier (classic / premium / designer); tool computes an indicative total and a line-item breakup by head (venue and catering ~40%, decor ~20%, photography and film, outfits and makeup, entertainment and music, planner fee at the studio's stated model) using researched Mumbai per-plate bands (₹1,200-3,500) and destination multipliers; renders as a live-updating breakdown with a \"these are honest ranges, not quotes\" note and a WhatsApp CTA that pre-fills the chosen numbers",
     "Planning-timeline generator (vanilla JS): couple enters wedding date and function list; tool back-computes a dated milestone checklist (venue lock, photographer/decor/MUA booking windows given 12-18 month lead times, invite send, outfit trials, guest-list lock, run-sheet week) and offers copy-to-clipboard plus a downloadable .ics generated client-side via Blob",
     "Filterable real-weddings gallery: filter chips by ceremony (haldi/mehendi/sangeet/pheras/reception), venue type (banquet/5-star/destination/home), scale (intimate under 150 / classic / grand), and style; client-side filtering with lightbox viewing"
    ]
   }
  ]
 },
 {
  "n": 33,
  "slug": "33-vaastu-astrology",
  "name": "Vaastu Consultant / Astrologer",
  "blurb": "Private consultation intake, Vaastu pre-audit checklist, muhurat scheduler.",
  "accent": "#232E52",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "For a practitioner whose clients come by word of mouth: the referred prospect scrolls once, sees real education, real lineage, real years, and a stated confidentiality commitment, and messages, instead of finding nothing and wondering if the referral was sound.",
    "bullets": [
     "Hero: practitioner name, discipline line (\"Vedic Astrology and Vaastu Consultation, by appointment\"), dignified portrait or consultation-space photo, single CTA (\"Request a Consultation\" via WhatsApp)",
     "Teaser strip of 4 service cards: Residential Vaastu, Commercial and Office Vaastu, Birth-Chart Consultation, Muhurat Selection; one calm factual line each",
     "Credential badges: education/lineage line, years in practice, consultations count, notable project types (e.g. \"offices, clinics, residential buildings\")",
     "Practitioner's story and training section: where and under whom they studied, stated plainly"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "For a practitioner tired of answering the same three questions on every call: the prospect arrives already knowing exactly what an audit covers, what a reading needs from them, and what it costs, so the first conversation starts at the consultation, not the explanation.",
    "bullets": [
     "2-3 pages: Home, Services, Contact (scroll-first)",
     "Services page with real depth per offering: what a residential Vaastu audit covers room by room (entrance, kitchen, master bedroom, puja room, toilets, orientation); what commercial/office Vaastu examines (entrance, cabin placement, cash/accounts area, seating directions); what a birth-chart reading includes and the exact inputs needed (birth date, time, place, and what happens if birth time is uncertain); muhurat selection and the occasions it serves (griha pravesh, business opening, marriage, naming, vehicle/property purchase)",
     "Consultation process explained step by step: enquiry, details shared privately, analysis by the practitioner personally, written or verbal guidance, follow-up; with the privacy handling of client details restated at the step where details are shared",
     "Remedies philosophy expanded into its own section: practical adjustments (placement, usage, color, elemental balancing) recommended first, structural change only when unavoidable and said so honestly; this is the good-practitioner trust signal, given full weight"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "For an established practitioner ready to receive complete, well-formed requests instead of \"guruji, need to talk\" messages: every tool on this tier turns a vague enquiry into a structured one (birth details complete, floor-plan facts in hand, occasion and date window stated) while keeping every gram of analysis where it belongs, with the practitioner.",
    "bullets": [
     "5-8 pages: Home, About the Practitioner, Vaastu Services, Astrology Services, Consultation Process and Fees, Resources/FAQ, Contact",
     "Consultation-selector questionnaire: the visitor picks their concern (new home purchase, existing home unease, office/shop layout, business naming or opening date, marriage matching, personal chart reading) through 2-3 calm steps, and is routed to the right service page with a tailored prep checklist (\"for this consultation, keep ready: floor plan, facing direction, year of construction\"); pure routing and preparation, no verdicts",
     "Birth-details intake composer: a structured form (birth date, time, time-certainty flag, place, concern area, preferred consultation mode) that composes a complete private WhatsApp message to the practitioner. The spec states this deliberately: the site collects details, it never interprets them. No online predictions, no auto-generated horoscopes; analysis is the practitioner's personal work, and that is presented on the page as a feature, not a limitation",
     "Vaastu pre-audit checklist tool: the visitor answers basic questions about their space (property type, facing direction if known, floor, main-entrance position, rooms of concern) and receives a \"what an audit would examine in your case\" preview, i.e. a personalized scope list, explicitly not verdicts, doshas, or scores; ends in a WhatsApp CTA carrying their answers"
    ]
   }
  ]
 },
 {
  "n": 34,
  "slug": "34-artist-art-studio",
  "name": "Artist / Art Studio",
  "blurb": "Filterable gallery with sold markers, commission configurator, workshop booking.",
  "accent": "#FCFCFA",
  "linkable": true,
  "tiers": [
   {
    "no": 1,
    "price": "₹8,000",
    "pitch": "One page where a collector or corporate buyer scrolls once, sees a coherent body of work with real prices and sold markers, understands exactly how buying and commissioning work, and messages, which is more commerce than most artist websites in Mumbai manage with ten pages.",
    "bullets": [
     "Hero: one signature artwork given real space (60%+ of viewport), artist name and one-line positioning, single red CTA (\"Enquire on WhatsApp\")",
     "Curated works strip: 6-8 pieces, each with plaque caption (title, medium, size, price band) and red sold-dot on 2-3 of them (sold work is the market-validation signal)",
     "Credential band: years practising, exhibitions count with 1-2 named venues, commissions completed, workshops conducted, stated as static figures",
     "Accessible artist statement and a short practice/technique story (what the work is about, in plain language, not artspeak)"
    ]
   },
   {
    "no": 2,
    "price": "₹15,000",
    "pitch": "A buyer, a designer sourcing for a client, or a workshop lead can see the full range, every price band, and the exact commissioning process without a studio visit or an awkward \"how much\" call, and each of the artist's four income lines finally has its own page working for it.",
    "bullets": [
     "2-3 pages: Home, Works, Commissions & Workshops (or Contact), scroll-first within each",
     "Full portfolio organized by series/medium, 8-12 works per section, every work captioned with title, year, medium, dimensions, availability, and price band; series get 2-3 line introductions so the body of work reads as a practice, not a pile",
     "Commissions page with the process stated step by step: brief and reference discussion, advance (stated percentage), concept sketches, approval, creation with progress photos, final sign-off, framing and delivery, with typical timelines by size and the revision policy in writing",
     "Murals/commercial section: site photos of completed walls, surfaces and scale handled, how commercial pricing works (per-sq-ft or day-rate logic stated in words), client types (cafes, offices, hotels, lobbies)"
    ]
   },
   {
    "no": 3,
    "price": "₹25,000",
    "pitch": "The buyer arrives having already shortlisted works by size and budget, or lands in WhatsApp with a fully configured commission brief and its indicative price attached, so the artist's first reply is a closing conversation, not a pricing interrogation.",
    "bullets": [
     "5-8 pages: Home, Works, Commissions, Murals & Corporate, Workshops, About, Contact",
     "Filterable gallery (flagship): all works rendered from a structured JS data file; client-side filters for series, medium, size class (small/medium/large), price band, and availability, with active-filter chips, result count, and a \"recently sold\" toggle; no page reloads; each work opens a detail overlay with full plaque data and an \"Enquire about this work\" button that opens WhatsApp prefilled with the work's title",
     "Commission configurator: visitor picks size (from the artist's real ladder), medium, and complexity (simple/detailed/highly detailed); JS computes an indicative price band and timeline from the artist's actual rate logic (base per-square-inch rate x medium multiplier x complexity multiplier), shows the advance amount at the stated percentage, and composes a structured WhatsApp brief (size, medium, complexity, subject notes, indicative band) so every commission enquiry arrives pre-qualified; output labeled \"Indicative range, confirmed after discussing your brief\"",
     "Workshop booking widget: upcoming sessions from a structured data file (date, format, level, fee, seats left); visitor picks a session and number of seats, gets a summary, and sends a prefilled WhatsApp slot request; sessions past their date auto-hide"
    ]
   }
  ]
 }
];
