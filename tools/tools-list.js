/* The public tools directory. One source of truth for every tool card.
   ai:true tools use the visitor's own OpenRouter key (BYOK), flagged so
   people know before they click. Rendered synchronously (before motion.js
   loads) so the .tilt-card hover binding picks the cards up. */
(function () {
  var GROUPS = [
    {
      label: 'Finance & Billing',
      desc: 'Get paid, track what you spend, pay your team.',
      tools: [
        { slug: 'gst-invoice', icon: 'receipt', name: 'GST Invoice Generator', blurb: 'GST-compliant invoices with auto CGST/SGST/IGST and amount-in-words.' },
        { slug: 'quotation-builder', icon: 'fileText', name: 'Quotation Builder', blurb: 'Turn a conversation into a professional quote in under a minute.' },
        { slug: 'expense-tracker', icon: 'wallet', name: 'Expense Tracker', blurb: 'Log daily spends and see where the money actually goes.' },
        { slug: 'salary-slip', icon: 'banknote', name: 'Salary Slip Generator', blurb: 'Monthly salary slips for staff, no spreadsheet template needed.' }
      ]
    },
    {
      label: 'Sales & CRM',
      desc: 'Never let a lead go cold.',
      tools: [
        { slug: 'lead-tracker', icon: 'target', name: 'Lead Tracker', blurb: 'Every enquiry in one place instead of scattered across WhatsApp.' },
        { slug: 'follow-up-reminder', icon: 'bellRing', name: 'Follow-Up Reminder', blurb: 'Timely nudges so a warm lead never goes cold.' },
        { slug: 'crm-contacts', icon: 'users', name: 'CRM Contacts', blurb: 'Every customer and every conversation, in one place.' },
        { slug: 'crm-pipeline', icon: 'kanban', name: 'CRM Deal Pipeline', blurb: 'Drag deals across stages on a simple kanban board.' }
      ]
    },
    {
      label: 'Operations',
      desc: 'Keep the back office under control.',
      tools: [
        { slug: 'appointment-scheduler', icon: 'calendar', name: 'Appointment Scheduler', blurb: 'Book appointments and catch time clashes before they happen.' },
        { slug: 'staff-attendance', icon: 'calendarCheck', name: 'Staff Attendance', blurb: 'Mark attendance on a month grid; %s work themselves out.' },
        { slug: 'inventory-tracker', icon: 'package', name: 'Inventory Tracker', blurb: 'Know your stock and get warned before it runs out.' },
        { slug: 'vendor-tracker', icon: 'truck', name: 'Vendor Tracker', blurb: 'Every supplier and exactly what you owe them.' },
        { slug: 'document-storage', icon: 'folder', name: 'Document Storage', blurb: 'Keep every paper and find it in one search.' },
        { slug: 'renewal-reminder', icon: 'repeat', name: 'Renewal Reminder', blurb: 'See every renewal and payment before it goes overdue.' }
      ]
    },
    {
      label: 'Marketing & Messaging',
      desc: 'Write it faster. AI-powered.',
      tools: [
        { slug: 'cold-message-writer', icon: 'mail', name: 'Cold Message Writer', ai: true, blurb: 'Outreach that reads personal, not like a template.' },
        { slug: 'whatsapp-broadcast-writer', icon: 'messageCircle', name: 'WhatsApp Broadcast Writer', ai: true, blurb: 'Broadcast-ready promos the way your customers actually read.' },
        { slug: 'instagram-caption-generator', icon: 'camera', name: 'Instagram Caption Generator', ai: true, blurb: 'On-brand captions and hashtags on demand.' },
        { slug: 'review-reply-generator', icon: 'star', name: 'Review Reply Generator', ai: true, blurb: 'Professional replies to every Google review, good or bad.' },
        { slug: 'festival-offer-generator', icon: 'sparkles', name: 'Festival Offer Generator', ai: true, blurb: 'Diwali, Holi, Eid promos written and ready before the day.' },
        { slug: 'gmb-post-writer', icon: 'mapPin', name: 'Google Business Post Writer', ai: true, blurb: 'Keep your Google profile active with posts written for you.' }
      ]
    },
    {
      label: 'Website Content',
      desc: 'Words for your site. AI-powered.',
      tools: [
        { slug: 'blog-post-writer', icon: 'penLine', name: 'Blog Post Writer', ai: true, blurb: 'Keep your blog active for SEO without writing every post.' },
        { slug: 'about-us-writer', icon: 'bookOpen', name: 'About Us Writer', ai: true, blurb: 'Turn your business story into copy that actually reads well.' }
      ]
    },
    {
      label: 'Utilities',
      desc: 'Handy extras.',
      tools: [
        { slug: 'business-card', icon: 'idCard', name: 'Digital Business Card', blurb: 'A shareable vCard + QR code, hand out a card without printing one.' },
        { slug: 'business-card-scanner', icon: 'scanLine', name: 'Business Card Scanner', ai: true, blurb: 'Snap a card and save the contact instantly.' }
      ]
    }
  ];

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }

  var total = GROUPS.reduce(function (n, g) { return n + g.tools.length; }, 0);

  var html = GROUPS.map(function (g) {
    var cards = g.tools.map(function (t) {
      return '<a class="tool-tile tilt-card" href="/tools/' + t.slug + '/" data-name="' + esc((t.name + ' ' + t.blurb).toLowerCase()) + '">' +
        '<div class="tool-tile-icon icon-chip">' + ((window.BW_ICONS && BW_ICONS[t.icon]) || '') + '</div>' +
        (t.ai ? '<span class="tool-tile-ai" title="Uses your own AI key">AI</span>' : '') +
        '<div class="tool-tile-name">' + esc(t.name) + '</div>' +
        '<div class="tool-tile-blurb">' + esc(t.blurb) + '</div>' +
        '<div class="tool-tile-open">Open →</div>' +
      '</a>';
    }).join('');
    // No scroll-reveal / data-stagger here on purpose: a tools directory is
    // meant to be scanned top-to-bottom instantly, so every tile stays
    // visible from load instead of waiting for a scroll trigger.
    return '<section class="tool-group" data-label="' + esc(g.label) + '">' +
      '<div class="tool-group-head">' +
        '<h2>' + esc(g.label) + '</h2>' +
        '<p>' + esc(g.desc) + '</p>' +
      '</div>' +
      '<div class="tool-tiles">' + cards + '</div>' +
    '</section>';
  }).join('');

  var mount = document.getElementById('tools-directory');
  if (mount) mount.innerHTML = html;

  // AI-note strip: explain BYOK once, near the AI groups.
  var aiNote = document.createElement('p');
  aiNote.className = 'tools-ai-note';
  aiNote.innerHTML = '<strong>AI</strong> tools run on your own free OpenRouter key (added inside the tool, stored only on your device). Everything else needs nothing at all.';
  if (mount) mount.appendChild(aiNote);

  /* search + group filter */
  var searchEl = document.getElementById('tools-search');
  var chipsEl = document.getElementById('tools-chips');
  if (searchEl && chipsEl && mount) {
    var labels = ['All'].concat(GROUPS.map(function (g) { return g.label; }));
    var activeLabel = 'All';
    chipsEl.innerHTML = labels.map(function (l) {
      return '<button type="button" class="tools-fchip' + (l === 'All' ? ' active' : '') + '" data-label="' + esc(l) + '">' + esc(l) + '</button>';
    }).join('');

    var applyFilter = function () {
      var q = searchEl.value.trim().toLowerCase();
      Array.prototype.forEach.call(mount.querySelectorAll('.tool-group'), function (sec) {
        var okLabel = activeLabel === 'All' || sec.getAttribute('data-label') === activeLabel;
        var anyTile = false;
        Array.prototype.forEach.call(sec.querySelectorAll('.tool-tile'), function (tile) {
          var hit = okLabel && (!q || tile.getAttribute('data-name').indexOf(q) !== -1);
          tile.style.display = hit ? '' : 'none';
          if (hit) anyTile = true;
        });
        sec.style.display = anyTile ? '' : 'none';
      });
    };

    chipsEl.addEventListener('click', function (e) {
      var chip = e.target.closest('.tools-fchip');
      if (!chip) return;
      activeLabel = chip.getAttribute('data-label');
      Array.prototype.forEach.call(chipsEl.querySelectorAll('.tools-fchip'), function (c) {
        c.classList.toggle('active', c === chip);
      });
      applyFilter();
    });
    searchEl.addEventListener('input', applyFilter);
  }
})();
