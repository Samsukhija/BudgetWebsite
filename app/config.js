/* Browser-safe config for the /app/ account surface.
   Right now there is NO backend — login, entitlement and "payment" are all
   local and interim. When the real backend goes in, the extra keys (Supabase
   URL + anon key, Razorpay key id) get added here and the interim bits below
   are removed. Nothing in this file is a secret. */
window.BW_APP = {
  // The business WhatsApp, used for "activate the pack" until real payment is wired.
  WHATSAPP: '918976587269',

  // INTERIM manual activation. After a customer pays (UPI / in person), Samar
  // sends them this code and they type it in to unlock the pack. Change it
  // whenever you like. It disappears the day Razorpay + a real entitlement
  // check replace it.
  ACTIVATION_CODE: 'BILLING-2026',

  PACKS: {
    billing: {
      name: 'Billing Pack',
      priceLabel: '₹5,000 / year',
      tagline: 'Professional GST invoices and quotations, with a running ledger of everything you bill.',
      features: [
        'Unlimited GST invoices — CGST/SGST or IGST worked out for you, amount in words',
        'Quotations that turn into an invoice in one tap',
        'A running ledger of everything you have billed, on every device',
        'Mark invoices paid or unpaid and see what is still pending',
        'Your business details filled in once, used on every document'
      ]
    }
  }
};
