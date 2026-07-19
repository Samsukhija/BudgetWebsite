/* Renders the 34-template grid from LEDGER (templates-data.js).
   Each card: icon, name, blurb, then a four-row TIER ACCORDION. Every tier
   opens on its own (siblings in the card close) and shows a visual glimpse
   of that tier's demo, the ledger pitch, the inclusions, and the demo link.
   Glimpses are real screenshots of the live demos, stored in ./glimpses/
   for the 18 deployed trades (tiers 1-3). Non-deployed trades and Tier 4
   show a styled placeholder until their links exist: when Lekhraj supplies
   the new demo URLs, flip `deployed` in templates-data.js (or extend
   DEMO_BASE handling) and the glimpses + links light up. Images load only
   when a tier is first opened (data-src swap), so the grid stays fast. */
(function () {
  var DEMO_BASE = 'https://website-project-liart.vercel.app';
  var WA_NUM = '918976587269';

  var TRADE_ICONS = {
    'gym-fitness': 'dumbbell', 'salon-beauty-parlour': 'scissors', 'car-rental-self-drive': 'car',
    'cafe': 'coffee', 'restaurant-family-restaurant-bar': 'utensils', 'jeweller': 'gem',
    'yoga-classes-studio': 'flower', 'diagnostic-centre-pathology-lab': 'microscope',
    'tailor-bespoke-tailoring': 'ruler', 'clothing-boutique': 'shirt',
    'medical-clinic-gp-specialist': 'stethoscope', 'real-estate-agency-broker': 'building',
    'ca-firm-accounting-services': 'calculator', 'furniture-gallery-shop': 'armchair',
    'sweet-shop-mithai-farsan': 'cookie', 'catering-services': 'chefHat',
    'tours-travels-vehicle-hire': 'plane', 'general-hospital-policlinic': 'hospitalCross',
    'interior-designer': 'armchair', 'bakery-cake-shop': 'cake', 'law-firm': 'scale',
    'dental-clinic': 'tooth', 'manufacturing-industrial': 'factory', 'insurance-agent': 'shield',
    'architect': 'compass', 'auto-repair-garage': 'wrench', 'business-consultant': 'briefcase',
    'building-contractor': 'hammer', 'building-materials-retailer': 'layers',
    'printing-press': 'printer', 'event-management': 'sparkles', 'wedding-planner': 'heart',
    'vaastu-astrology': 'moonStar', 'artist-art-studio': 'palette'
  };
  function tradeIcon(slug) {
    var key = slug.replace(/^\d+-/, '');
    var name = TRADE_ICONS[key];
    return (window.BW_ICONS && name && BW_ICONS[name]) || '';
  }

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  var PRICES = ['₹8,000', '₹15,000', '₹25,000', '₹50,000+'];

  function waLink(text) {
    return 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(text);
  }

  /* One tier panel's inner content. */
  function tierPanelHTML(t, tierNo, tierData) {
    var demoUrl = DEMO_BASE + '/' + t.slug + '/tier-' + tierNo + '/';
    var glimpseSrc = 'glimpses/' + t.slug + '-tier-' + tierNo + '.jpg';
    var hasDemo = t.deployed && tierNo <= 3;
    var html = '';

    // Glimpse: real screenshot for live demos, placeholder otherwise.
    if (hasDemo) {
      html += '<a class="tpl-glimpse" href="' + demoUrl + '" target="_blank" rel="noopener" aria-label="Open the Tier ' + tierNo + ' live demo">' +
        '<img data-src="' + glimpseSrc + '" alt="Tier ' + tierNo + ' demo preview for ' + esc(t.name) + '" width="640" height="400">' +
        '<span class="tpl-glimpse-open">Open live demo</span>' +
      '</a>';
    } else if (tierNo === 4) {
      html += '<div class="tpl-glimpse-ph"><span>Custom build</span>Scoped around your exact workflow on a call, so there is no generic demo for this tier.</div>';
    } else {
      html += '<div class="tpl-glimpse-ph"><span>Preview on its way</span>This demo is built and being put online. The link lands here soon.</div>';
    }

    // Ledger pitch + bullets (when this trade has tier detail).
    if (tierData) {
      html += '<p class="tpl-acc-pitch">' + esc(tierData.pitch) + '</p>';
      html += '<ul class="tpl-acc-bullets">' + tierData.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>';
    } else {
      html += '<p class="tpl-acc-pitch">Full inclusions for this trade are being written up. The ladder matches every other template. Ask us for specifics.</p>';
    }

    // Action row.
    if (hasDemo) {
      html += '<div class="tpl-acc-actions"><a class="tpl-chip" href="' + demoUrl + '" target="_blank" rel="noopener">Open Tier ' + tierNo + ' demo →</a></div>';
    } else if (tierNo === 4) {
      html += '<div class="tpl-acc-actions"><a class="tpl-chip tpl-chip-wa" href="' + waLink('Hi, I want to discuss a Tier 4 custom build for my ' + t.name + ' business.') + '" target="_blank" rel="noopener">Discuss on WhatsApp</a></div>';
    } else {
      html += '<div class="tpl-acc-actions"><span class="tpl-chip tpl-chip-soon">Demo link coming soon</span>' +
        '<a class="tpl-chip tpl-chip-wa" href="' + waLink('Hi, I want to see the ' + t.name + ' Tier ' + tierNo + ' website demo from budgetwebsite.store.') + '" target="_blank" rel="noopener">See it on WhatsApp</a></div>';
    }
    return html;
  }

  function cardHTML(t) {
    var rows = '';
    for (var k = 1; k <= 4; k++) {
      var tierData = t.tiers.length ? t.tiers[k - 1] : null;
      rows +=
        '<div class="tpl-acc-item">' +
          '<button type="button" class="tpl-acc-head" aria-expanded="false">' +
            '<span class="tpl-acc-tier">Tier ' + k + '</span>' +
            '<span class="tpl-acc-price">' + (tierData ? esc(tierData.price) : PRICES[k - 1]) + '</span>' +
            '<span class="tpl-acc-chev" aria-hidden="true">▾</span>' +
          '</button>' +
          '<div class="tpl-acc-panel" hidden>' + tierPanelHTML(t, k, tierData) + '</div>' +
        '</div>';
    }
    var searchText = (t.name + ' ' + t.blurb).toLowerCase();
    return '<div class="tpl-card" data-name="' + esc(searchText) + '">' +
      '<div class="tpl-card-head">' +
        '<span class="tpl-card-icon icon-chip">' + tradeIcon(t.slug) + '</span>' +
        '<span class="tpl-card-num">' + pad2(t.n) + '</span>' +
      '</div>' +
      '<div class="tpl-card-name">' + esc(t.name) + '</div>' +
      '<p class="tpl-card-blurb">' + esc(t.blurb) + '</p>' +
      '<div class="tpl-accordion">' + rows + '</div>' +
    '</div>';
  }

  var grid = document.getElementById('tpl-grid');
  var count = document.getElementById('tpl-count');
  grid.innerHTML = LEDGER.map(cardHTML).join('');

  /* Accordion: one open tier per card; lazy-load the glimpse on first open. */
  grid.addEventListener('click', function (e) {
    var head = e.target.closest('.tpl-acc-head');
    if (!head) return;
    var item = head.parentElement;
    var panel = item.querySelector('.tpl-acc-panel');
    var willOpen = panel.hidden;

    // close siblings within this card
    var card = head.closest('.tpl-card');
    Array.prototype.forEach.call(card.querySelectorAll('.tpl-acc-item'), function (it) {
      it.querySelector('.tpl-acc-panel').hidden = true;
      it.classList.remove('open');
      it.querySelector('.tpl-acc-head').setAttribute('aria-expanded', 'false');
    });

    if (willOpen) {
      panel.hidden = false;
      item.classList.add('open');
      head.setAttribute('aria-expanded', 'true');
      var img = panel.querySelector('img[data-src]');
      if (img) { img.src = img.getAttribute('data-src'); img.removeAttribute('data-src'); }
    }
  });

  function updateCount(visible) {
    count.textContent = visible === LEDGER.length
      ? LEDGER.length + ' business types, 4 tiers each, ₹8,000 to ₹50,000+'
      : visible + ' of ' + LEDGER.length + ' business types';
  }
  updateCount(LEDGER.length);

  var search = document.getElementById('tpl-search');
  search.addEventListener('input', function () {
    var q = search.value.trim().toLowerCase();
    var visible = 0;
    Array.prototype.forEach.call(grid.querySelectorAll('.tpl-card'), function (card) {
      var hit = !q || card.getAttribute('data-name').indexOf(q) !== -1;
      card.style.display = hit ? '' : 'none';
      if (hit) visible++;
    });
    updateCount(visible);
  });
})();
