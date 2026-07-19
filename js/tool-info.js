/* Adds a "What this is for / How to use it / What it saves you" panel to
   every tool page. One script, loaded by all 24 tools; it detects the tool
   from the URL, injects its own styles (so it works no matter which
   stylesheets the page already loads), and drops the panel in right under
   the page intro. Deliberately written with no em dashes anywhere. */
(function () {
  'use strict';

  var INFO = {
    'gst-invoice': {
      purpose: 'Make proper GST invoices for your customers without an accountant for routine billing.',
      how: ['Fill in your business details once (they save on this device).', 'Add the customer and your line items.', 'The tax splits into CGST plus SGST, or IGST, automatically by state.', 'Click Print to save a clean PDF or print it.'],
      saves: 'Saves the ₹500 to ₹1,500 a month a billing app or accountant charges just for routine invoices.'
    },
    'quotation-builder': {
      purpose: 'Turn a customer conversation into a professional, tax-inclusive quotation in a minute.',
      how: ['Set your business details once.', 'Add the customer and the items you are quoting.', 'Set a "valid until" date and a status (Draft, Sent, Accepted).', 'Print or save the quote as a PDF and send it.'],
      saves: 'Saves 2 to 3 hours a week rewriting quotes from scratch, and quotes that look sharp win more work.'
    },
    'expense-tracker': {
      purpose: 'See exactly where your money goes every month instead of guessing.',
      how: ['Add each expense with a date, category and amount.', 'Use the month and category filters to slice the data.', 'Read the running totals and the category bar chart.', 'Export a CSV any time for your accountant.'],
      saves: 'Replaces a ₹200 to ₹500 a month expense app, and spotting one leaking cost usually saves far more.'
    },
    'salary-slip': {
      purpose: 'Give your staff proper monthly salary slips without a spreadsheet template.',
      how: ['Add each employee once to the roster.', 'Pick a month and enter earnings and deductions.', 'Net pay and amount in words are worked out for you.', 'Print the slip, and look up any past month later.'],
      saves: 'Saves the ₹50 to ₹150 per slip a payroll service or accountant charges.'
    },
    'lead-tracker': {
      purpose: 'Keep every enquiry in one place instead of scattered across WhatsApp and memory.',
      how: ['Add a lead with its source and a follow-up date.', 'Change the status right from the table as it moves.', 'Overdue follow-ups get flagged so nothing slips.', 'Export the list as a CSV whenever you want.'],
      saves: 'One dropped lead can be ₹5,000 or more of lost work. Catching even a few a year pays for itself many times over.'
    },
    'follow-up-reminder': {
      purpose: 'Never lose a warm lead to a forgotten follow-up.',
      how: ['Add a reminder with the contact and a due date.', 'The tool sorts them so the most urgent are on top.', 'Overdue ones turn red so you cannot miss them.', 'Mark done, or snooze a day, in one click.'],
      saves: 'A single recovered deal is worth thousands. This makes sure no follow-up is ever forgotten.'
    },
    'crm-contacts': {
      purpose: 'Keep every customer and every conversation you have had in one place.',
      how: ['Add a contact with phone, company, tags and notes.', 'Open any contact to see and edit their full history.', 'Log every call, meeting or message under that contact.', 'Search across everyone instantly by name, tag or company.'],
      saves: 'Replaces a ₹800 to ₹2,500 a month CRM subscription, with your data staying on your own device.'
    },
    'crm-pipeline': {
      purpose: 'See every deal and where it stands on one simple board.',
      how: ['Add a deal, picking a customer from your CRM contacts.', 'Drag the card across stages as the deal moves.', 'On a phone, use the stage dropdown instead of dragging.', 'The board totals your open pipeline value for you.'],
      saves: 'Replaces the paid pipeline features of a ₹1,000 a month or more sales CRM.'
    },
    'appointment-scheduler': {
      purpose: 'Book appointments and catch time clashes before they happen.',
      how: ['Add an appointment with a date, time and duration.', 'If it overlaps an existing one, you get a clear warning.', 'View any day\'s schedule and update statuses inline.', 'Keep an eye on the next few confirmed bookings.'],
      saves: 'Replaces ₹500 to ₹1,500 a month booking software, and one prevented double-booking saves you a customer.'
    },
    'staff-attendance': {
      purpose: 'Mark staff attendance on a simple month grid, with the percentages worked out for you.',
      how: ['Add your team to the roster once.', 'Click a day cell to cycle Present, Absent, Half-day, Leave.', 'The monthly summary and attendance percent update live.', 'Export the month as a CSV for payroll.'],
      saves: 'Replaces a ₹1,000 a month or more attendance app, and accurate marking stops you overpaying on salaries.'
    },
    'inventory-tracker': {
      purpose: 'Know your stock at a glance and get warned before anything runs out.',
      how: ['Add each item with its quantity and reorder level.', 'Adjust stock with a reason every time it moves.', 'Low-stock items get flagged automatically.', 'See total inventory value and a full movement history.'],
      saves: 'One avoided stockout or dead-stock pile is worth thousands, and it replaces a ₹500 to ₹2,000 a month inventory app.'
    },
    'vendor-tracker': {
      purpose: 'Keep every supplier in one place and always know what you owe them.',
      how: ['Add a vendor with contact, terms and outstanding amount.', 'Sort by who you owe the most.', 'Search across suppliers by name or category.', 'Export the full list as a CSV.'],
      saves: 'Avoids late fees and accidental double payments, which usually cost far more than any app would.'
    },
    'document-storage': {
      purpose: 'Keep every important business document in one place and find it in one search.',
      how: ['Upload files and tag them with a category.', 'Search by name or tag to find anything fast.', 'Preview images and download any file when needed.', 'Everything stays on this device, so keep a backup too.'],
      saves: 'Free instead of a paid cloud storage plan for your day-to-day business papers.'
    },
    'renewal-reminder': {
      purpose: 'See every renewal and recurring payment before it goes overdue.',
      how: ['Add a renewal with its amount and how often it repeats.', 'The list sorts by what is due soonest.', 'Due-soon and overdue items are colour coded.', 'Hit "Mark Paid" and the next date is set for you.'],
      saves: 'One missed insurance, licence or domain renewal can cost thousands in penalties or a lapse. This stops that.'
    },
    'business-card': {
      purpose: 'Hand out a digital business card that people can save in one tap, without printing anything.',
      how: ['Fill in your details and add a photo or logo.', 'A styled card and a QR code build as you type.', 'Share the QR for people to scan and save you.', 'Or download a .vcf that drops straight into a phone.'],
      saves: 'Skips ₹1,000 to ₹3,000 on printed cards, and you can update your details any time for free.'
    },
    'business-card-scanner': {
      purpose: 'Snap a photo of a business card and save the contact instantly, no typing.',
      how: ['Add your free AI key once in the settings bar.', 'Upload or photograph the card and click Scan.', 'Check the details it pulled out and fix anything.', 'Save the contact and download a .vcf for your phone.'],
      saves: 'Saves the couple of minutes of typing every card takes, which adds up fast after a networking meeting.'
    },
    'cold-message-writer': {
      purpose: 'Write cold outreach that reads personal, not like a template.',
      how: ['Add your free AI key once in the settings bar.', 'Describe your offer, who you are messaging, and the goal.', 'Pick the channel and tone, then Generate.', 'Copy the version you like best, or regenerate for more.'],
      saves: 'Replaces the ₹5,000 to ₹15,000 a month a freelancer charges for outreach copy.'
    },
    'whatsapp-broadcast-writer': {
      purpose: 'Write WhatsApp broadcasts your customers actually read and act on.',
      how: ['Add your free AI key once in the settings bar.', 'Say what the broadcast is about and who it is for.', 'Choose whether to include emoji and a call to action.', 'Generate, then copy the version you prefer.'],
      saves: 'Replaces paying an agency ₹5,000 or more a month for promotional messaging.'
    },
    'instagram-caption-generator': {
      purpose: 'Get on-brand Instagram captions and hashtags on demand.',
      how: ['Add your free AI key once in the settings bar.', 'Describe the post and pick the vibe.', 'Choose hashtags and emoji on or off.', 'Generate three options and copy your favourite.'],
      saves: 'Replaces a ₹8,000 to ₹20,000 a month social media manager for caption writing.'
    },
    'review-reply-generator': {
      purpose: 'Reply to every Google review, good or bad, professionally and fast.',
      how: ['Add your free AI key once in the settings bar.', 'Paste the review and pick its star rating.', 'Choose a tone (it suggests one for low ratings).', 'Generate two replies and copy the better fit.'],
      saves: 'Protects your online reputation, which drives real customers, for the cost of a fraction of a rupee per reply.'
    },
    'festival-offer-generator': {
      purpose: 'Write festival promo messages that are ready before the day arrives.',
      how: ['Add your free AI key once in the settings bar.', 'Pick the festival and describe your offer.', 'Choose the channel and whether to use emoji.', 'Generate three options and copy the one you like.'],
      saves: 'Replaces paying a copywriter for every festival campaign through the year.'
    },
    'blog-post-writer': {
      purpose: 'Keep your blog active for SEO without writing every post yourself.',
      how: ['Add your free AI key once in the settings bar.', 'Give a topic, your industry, and a target keyword.', 'Pick a length and tone, then Generate.', 'Watch it write, then copy the finished post.'],
      saves: 'Replaces the ₹1,500 to ₹5,000 a freelance writer charges per blog post.'
    },
    'about-us-writer': {
      purpose: 'Turn your business story into website copy that actually reads well.',
      how: ['Add your free AI key once in the settings bar.', 'Say what you do and what makes you different.', 'Pick a tone that fits your brand.', 'Generate the section and copy it onto your site.'],
      saves: 'Replaces paying a copywriter ₹2,000 or more for an About page.'
    },
    'gmb-post-writer': {
      purpose: 'Keep your Google Business profile active with posts written for you.',
      how: ['Add your free AI key once in the settings bar.', 'Pick the post type and say what it is about.', 'Choose a call to action and emoji on or off.', 'Generate two options and copy the better one.'],
      saves: 'Active Google posts bring in local customers, for a fraction of a rupee per post instead of an agency retainer.'
    }
  };

  function slugFromPath() {
    var parts = location.pathname.replace(/\/+$/, '').split('/');
    return parts[parts.length - 1] || '';
  }

  var info = INFO[slugFromPath()];
  if (!info) return; // not a known tool page, do nothing

  // Inject styles once (self-contained so it works on any tool page).
  if (!document.getElementById('tool-info-styles')) {
    var css =
      '.tool-info{max-width:1200px;margin:0 auto 24px;padding:0 48px;}' +
      '.tool-info-card{background:var(--glass);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);' +
        'border:1px solid var(--glass-border);border-radius:14px;padding:22px 24px;' +
        'display:grid;grid-template-columns:1fr 1.4fr 1fr;gap:24px;}' +
      '.tool-info-col-label svg{width:14px;height:14px;flex-shrink:0;}' +
      '.tool-info-col-label{font-size:calc(11px * var(--font-scale));font-weight:700;letter-spacing:0.5px;' +
        'text-transform:uppercase;color:var(--accent-text);margin-bottom:8px;display:flex;align-items:center;gap:7px;}' +
      '.tool-info-col p{font-size:calc(13.5px * var(--font-scale));color:var(--text-mid);line-height:1.6;margin:0;}' +
      '.tool-info-col ol{margin:0;padding-left:18px;}' +
      '.tool-info-col li{font-size:calc(13px * var(--font-scale));color:var(--text-mid);line-height:1.55;margin-bottom:5px;}' +
      '.tool-info-saves p{color:var(--text-hi);}' +
      '.tool-info-saves .tool-info-col-label{color:#4ADE80;}' +
      '@media (max-width:820px){.tool-info{padding:0 20px;}.tool-info-card{grid-template-columns:1fr;gap:18px;}}';
    var st = document.createElement('style');
    st.id = 'tool-info-styles';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function esc(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  var steps = info.how.map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
  var wrap = document.createElement('div');
  wrap.className = 'tool-info';
  wrap.innerHTML =
    '<div class="tool-info-card">' +
      '<div class="tool-info-col">' +
        '<div class="tool-info-col-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.2"/><circle cx="12" cy="12" r="1.4"/></svg> What it is for</div>' +
        '<p>' + esc(info.purpose) + '</p>' +
      '</div>' +
      '<div class="tool-info-col">' +
        '<div class="tool-info-col-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3.5 6 1.5 1.5L8 4.5"/><path d="m3.5 12.5 1.5 1.5L8 11"/><path d="m3.5 19 1.5 1.5L8 17.5"/><path d="M11.5 6H21M11.5 12.5H21M11.5 19H21"/></svg> How to use it</div>' +
        '<ol>' + steps + '</ol>' +
      '</div>' +
      '<div class="tool-info-col tool-info-saves">' +
        '<div class="tool-info-col-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="M8.5 6v5M6.5 7.5h4"/><path d="M14.5 9.7a5.5 5.5 0 1 1-4.8 9.1"/></svg> What it saves you</div>' +
        '<p>' + esc(info.saves) + '</p>' +
      '</div>' +
    '</div>';

  // Place it right after the page intro (.section-sub), else after the title,
  // else after the nav.
  var anchor = document.querySelector('.section-sub') ||
               document.querySelector('.section-title') ||
               document.querySelector('nav');
  if (anchor && anchor.parentNode) {
    // if the anchor sits inside a <section>/<header>, insert after that block
    var host = anchor.closest('header, section') || anchor;
    host.parentNode.insertBefore(wrap, host.nextSibling);
  } else {
    document.body.insertBefore(wrap, document.body.firstChild);
  }
})();
