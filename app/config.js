/* Browser-safe config for the /app/ account surface.
   Right now there is NO backend — login, entitlement and "payment" are all
   local and interim. When the real backend goes in, the extra keys (Supabase
   URL + anon key, Razorpay key id) get added here and the interim bits below
   are removed. Nothing in this file is a secret. */
window.BW_APP = {
  // The business WhatsApp, used for "activate the pack" until real payment is wired.
  WHATSAPP: '918976587269',

  // INTERIM manual activation. After a customer pays (UPI / in person), Samar
  // sends them the ACTIVATED PACK'S OWN code below and they type it in to
  // unlock just that pack. Each pack has its own code on purpose - a leaked
  // or guessed code for one pack should not unlock the other six. Change any
  // of them whenever you like. This whole scheme disappears the day
  // Razorpay + a real server-side entitlement check replace it.

  PACKS: {
    billing: {
      name: 'Billing Pack',
      priceLabel: '₹5,000 / year',
      tagline: 'Professional GST invoices and quotations, with a running ledger of everything you bill.',
      workspaceUrl: '/app/billing/',
      activationCode: 'BILLING-2026',
      features: [
        'Unlimited GST invoices — CGST/SGST or IGST worked out for you, amount in words',
        'Quotations that turn into an invoice in one tap',
        'A running ledger of everything you have billed, on every device',
        'Mark invoices paid or unpaid and see what is still pending',
        'Your business details filled in once, used on every document'
      ]
    },
    money: {
      name: 'Money & Staff-Salary Pack',
      priceLabel: '₹5,000 / year',
      tagline: 'Attendance feeds straight into salary, expenses roll up into one monthly total.',
      workspaceUrl: '/app/money/',
      activationCode: 'MONEY-2026',
      features: [
        'One staff roster shared by attendance and salary, no retyping names',
        'Mark attendance, salary slips calculate themselves from present days',
        'Expense ledger with categories and a running monthly total',
        'Printable, WhatsApp-shareable salary slips',
        'Dashboard: this month\'s payroll and expenses at a glance'
      ]
    },
    customer: {
      name: 'Customer Pack',
      priceLabel: '₹6,000 / year',
      tagline: 'One customer record instead of five disconnected free tools, with a "due today" view.',
      workspaceUrl: '/app/customer/',
      activationCode: 'CUSTOMER-2026',
      features: [
        'Contacts, pipeline stage, follow-ups and renewal dates on ONE customer record',
        'Kanban pipeline board, drag a customer as the deal moves',
        '"Due today" dashboard, every follow-up and renewal that needs you now',
        'Never duplicate a customer across five separate free tools again',
        'WhatsApp a customer straight from their record'
      ]
    },
    bookings: {
      name: 'Bookings Pack',
      priceLabel: '₹3,000 / year',
      tagline: 'Every appointment tracked end to end, with one-tap WhatsApp reminders.',
      workspaceUrl: '/app/bookings/',
      activationCode: 'BOOKINGS-2026',
      features: [
        'A running ledger of every appointment, not just today\'s',
        'Status tracking: Upcoming, Completed, No-show, Cancelled',
        'One-tap WhatsApp reminder to the customer before their slot',
        'Day view so you can see what is coming up at a glance'
      ]
    },
    stock: {
      name: 'Stock & Suppliers Pack',
      priceLabel: '₹4,000 / year',
      tagline: 'Low stock links straight to the supplier who sells it, one tap to reorder.',
      workspaceUrl: '/app/stock/',
      activationCode: 'STOCK-2026',
      features: [
        'Inventory linked to its preferred vendor, not two disconnected lists',
        'Low-stock flags, and a one-tap WhatsApp reorder to that vendor',
        'Vendor directory with what they supply and contact details',
        'Stock value and low-stock count at a glance'
      ]
    },
    marketing: {
      name: 'Marketing Writing Pack',
      priceLabel: '₹4,000 / year',
      tagline: 'All 8 AI writers on one screen, with a saved history instead of one-off, throwaway drafts.',
      workspaceUrl: '/app/marketing/',
      activationCode: 'MARKETING-2026',
      features: [
        'WhatsApp, Instagram, GMB, reviews, cold messages, festival offers, blog, about-us, in one place',
        'Every generation saved to a content library, copy or resend anytime',
        'Your business profile and tone filled in once, used everywhere',
        'Uses your own free OpenRouter key, same as the free tools'
      ]
    },
    cards: {
      name: 'Cards & Documents Pack',
      priceLabel: '₹3,000 / year',
      tagline: 'Your digital business card, scanned contacts and documents, in one identity workspace.',
      workspaceUrl: '/app/cards/',
      activationCode: 'CARDS-2026',
      features: [
        'Design and share your digital business card',
        'Scan a paper card straight into a saved contact',
        'A categorised document vault for the papers you need on hand',
        'Everything in one place instead of three separate free tools'
      ]
    }
  }
};
