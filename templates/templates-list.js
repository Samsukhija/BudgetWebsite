/* Renders the 34-template grid from LEDGER (templates-data.js, generated
   from the Website Factory catalog dataset by gen-data.py).
   Each card: tier-1 glimpse thumbnail, icon, per-trade accent, name, blurb,
   then a tier accordion built from the trade's ACTUAL built tiers (18 trades
   have four, 16 have three; no greyed-out rows). Every tier 1-3 panel shows
   a real screenshot of the local build. Nothing links out yet: the new
   generation is not publicly deployed, so panels say "Demo link coming
   soon" with a WhatsApp fallback. When hosting is decided, set DEMO_BASE
   and flip `linkable` in templates-data.js and the demo links + clickable
   glimpses come back on their existing code path. */
(function () {
  var DEMO_BASE = '';   // set when the new builds are deployed
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
  var CATS = {
    1: 'Wellness & Fitness', 2: 'Wellness & Fitness', 7: 'Wellness & Fitness',
    4: 'Food & Hospitality', 5: 'Food & Hospitality', 15: 'Food & Hospitality', 16: 'Food & Hospitality', 20: 'Food & Hospitality',
    8: 'Healthcare', 11: 'Healthcare', 18: 'Healthcare', 22: 'Healthcare',
    6: 'Retail & Boutique', 9: 'Retail & Boutique', 10: 'Retail & Boutique', 14: 'Retail & Boutique',
    3: 'Auto & Travel', 17: 'Auto & Travel', 26: 'Auto & Travel',
    19: 'Construction & Home', 25: 'Construction & Home', 28: 'Construction & Home', 29: 'Construction & Home',
    12: 'Professional', 13: 'Professional', 21: 'Professional', 24: 'Professional', 27: 'Professional',
    23: 'Industrial', 30: 'Industrial',
    31: 'Creative & Events', 32: 'Creative & Events', 33: 'Creative & Events', 34: 'Creative & Events'
  };

  function tradeIcon(slug) {
    var key = slug.replace(/^\d+-/, '');
    var name = TRADE_ICONS[key];
    return (window.BW_ICONS && name && BW_ICONS[name]) || '';
  }

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function waLink(text) {
    return 'https://wa.me/' + WA_NUM + '?text=' + encodeURIComponent(text);
  }

  function glimpseHTML(t, tierNo) {
    var src = 'glimpses/' + t.slug + '-tier-' + tierNo + '.jpg';
    var img = '<img data-src="' + src + '" alt="Tier ' + tierNo + ' preview for ' + esc(t.name) + '" width="640" height="400">';
    if (t.linkable && DEMO_BASE) {
      var url = DEMO_BASE + '/' + t.slug + '/tier-' + tierNo + '/';
      return '<a class="tpl-glimpse" href="' + url + '" target="_blank" rel="noopener" aria-label="Open the Tier ' + tierNo + ' live demo">' +
        img + '<span class="tpl-glimpse-open">Open live demo</span></a>';
    }
    return '<div class="tpl-glimpse">' + img + '</div>';
  }

  function tierPanelHTML(t, tier) {
    var html = '';
    if (tier.no <= 3) {
      html += glimpseHTML(t, tier.no);
    } else {
      html += '<div class="tpl-glimpse-ph"><span>Full app tier</span>Built as a real application (logins, bookings, payments) and always tailored on a call, so there is no one generic demo.</div>';
    }
    html += '<p class="tpl-acc-pitch">' + esc(tier.pitch) + '</p>';
    if (tier.bullets.length) {
      html += '<ul class="tpl-acc-bullets">' + tier.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul>';
    }
    if (t.linkable && DEMO_BASE && tier.no <= 3) {
      var url = DEMO_BASE + '/' + t.slug + '/tier-' + tier.no + '/';
      html += '<div class="tpl-acc-actions"><a class="tpl-chip" href="' + url + '" target="_blank" rel="noopener">Open Tier ' + tier.no + ' demo →</a></div>';
    } else if (tier.no === 4) {
      html += '<div class="tpl-acc-actions"><a class="tpl-chip tpl-chip-wa" href="' + waLink('Hi, I want to discuss a Tier 4 build for my ' + t.name + ' business.') + '" target="_blank" rel="noopener">Discuss on WhatsApp</a></div>';
    } else {
      html += '<div class="tpl-acc-actions"><span class="tpl-chip tpl-chip-soon">Demo link coming soon</span>' +
        '<a class="tpl-chip tpl-chip-wa" href="' + waLink('Hi, I want to see the ' + t.name + ' Tier ' + tier.no + ' website demo from budgetwebsite.store.') + '" target="_blank" rel="noopener">See it on WhatsApp</a></div>';
    }
    return html;
  }

  function cardHTML(t) {
    var rows = t.tiers.map(function (tier) {
      return '<div class="tpl-acc-item">' +
        '<button type="button" class="tpl-acc-head" aria-expanded="false">' +
          '<span class="tpl-acc-tier">Tier ' + tier.no + '</span>' +
          '<span class="tpl-acc-price">' + esc(tier.price) + '</span>' +
          '<span class="tpl-acc-chev" aria-hidden="true">▾</span>' +
        '</button>' +
        '<div class="tpl-acc-panel" hidden>' + tierPanelHTML(t, tier) + '</div>' +
      '</div>';
    }).join('');
    var searchText = (t.name + ' ' + t.blurb + ' ' + (CATS[t.n] || '')).toLowerCase();
    return '<div class="tpl-card" data-name="' + esc(searchText) + '" data-cat="' + esc(CATS[t.n] || '') + '" style="--tacc:' + esc(t.accent) + ';">' +
      '<div class="tpl-card-thumb">' +
        '<img src="glimpses/' + t.slug + '-tier-1.jpg" alt="' + esc(t.name) + ' template preview" loading="lazy" width="640" height="400">' +
      '</div>' +
      '<div class="tpl-card-head">' +
        '<span class="tpl-card-icon icon-chip">' + tradeIcon(t.slug) + '</span>' +
        '<span class="tpl-card-num"><i class="tpl-card-dot"></i>' + pad2(t.n) + '</span>' +
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
      ? LEDGER.length + ' business types, built and ready, ₹8,000 to ₹50,000+'
      : visible + ' of ' + LEDGER.length + ' business types';
  }
  updateCount(LEDGER.length);

  /* category chips + search, combined */
  var activeCat = 'All';
  var search = document.getElementById('tpl-search');
  var chipWrap = document.getElementById('tpl-chips');

  var catOrder = ['All'];
  LEDGER.forEach(function (t) {
    var c = CATS[t.n];
    if (c && catOrder.indexOf(c) === -1) catOrder.push(c);
  });
  chipWrap.innerHTML = catOrder.map(function (c) {
    return '<button type="button" class="tpl-fchip' + (c === 'All' ? ' active' : '') + '" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
  }).join('');

  function applyFilter() {
    var q = search.value.trim().toLowerCase();
    var visible = 0;
    Array.prototype.forEach.call(grid.querySelectorAll('.tpl-card'), function (card) {
      var okCat = activeCat === 'All' || card.getAttribute('data-cat') === activeCat;
      var okQ = !q || card.getAttribute('data-name').indexOf(q) !== -1;
      var hit = okCat && okQ;
      card.style.display = hit ? '' : 'none';
      if (hit) visible++;
    });
    updateCount(visible);
  }

  chipWrap.addEventListener('click', function (e) {
    var chip = e.target.closest('.tpl-fchip');
    if (!chip) return;
    activeCat = chip.getAttribute('data-cat');
    Array.prototype.forEach.call(chipWrap.querySelectorAll('.tpl-fchip'), function (c) {
      c.classList.toggle('active', c === chip);
    });
    applyFilter();
  });
  search.addEventListener('input', applyFilter);
})();
