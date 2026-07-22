/* Shared add-on services catalog: source of truth for both the public
   /pricing/ page and the internal Proposal tool. Change a price here and
   it updates everywhere it's shown. */
window.BW_SERVICES = {

  tiers: [
    { key: 'starter',  name: 'Starter',  price: 8000,  note: '' },
    { key: 'standard', name: 'Standard', price: 15000, note: '' },
    { key: 'premium',  name: 'Premium',  price: 25000, note: '' },
    { key: 'custom',   name: 'Custom',   price: 50000, note: 'scoped, enter final price', editablePrice: true }
  ],

  oneTime: [
    { key: 'branding', name: 'Branding Kit', price: 4000,
      desc: 'Logo variations, business card, Instagram DP, letterhead template' },
    { key: 'domain-ssl', name: 'Domain + SSL', price: 1200,
      desc: 'Domain registration/transfer, DNS setup, SSL certificate (renews yearly, see Hosting Renewal)' },
    { key: 'legal', name: 'Legal Pages', price: 1500,
      desc: 'Privacy Policy, Terms & Conditions, Refund Policy, tailored to your business' },
    { key: 'analytics', name: 'Analytics Setup', price: 2000,
      desc: 'Google Analytics (GA4) + Meta Pixel + goal tracking' },
    { key: 'email', name: 'Business Email', price: 1500,
      desc: 'you@yourbusiness.com on your own domain, DNS configured' },
    { key: 'seo', name: 'SEO Foundation', price: 6000,
      desc: 'On-page SEO, schema markup, Google Business Profile setup, Search Console + sitemap submission' },
    { key: 'payment', name: 'Payment Gateway', price: 4000,
      desc: 'Razorpay checkout wired into your site to accept payments online',
      note: 'For online stores and booking sites that need to collect payment' }
  ],

  recurring: [
    { key: 'amc', name: 'AMC (Annual Maintenance)', price: 6000, cadence: 'year',
      desc: 'Uptime checks, minor content updates, priority support' },
    { key: 'seo-retainer', name: 'SEO Retainer', price: 4000, cadence: 'month',
      desc: 'Ongoing content, keyword tracking and ranking reports' },
    { key: 'hosting', name: 'Hosting Renewal', price: 2500, cadence: 'year',
      desc: 'We keep your site live, monitored and backed up, no registrar emails landing in your inbox' },
    { key: 'email-renewal', name: 'Email Renewal', price: 1200, cadence: 'year',
      desc: 'Keeps your business email account active' }
  ]

};
