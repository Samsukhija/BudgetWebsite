/* Renders the 34-template grid from LEDGER (templates-data.js).
   Each card: icon, name, blurb, tier price chips, demo links (verified live
   for 01-18, WhatsApp CTA otherwise), and an expandable panel with the full
   tier-by-tier pitch and inclusions from the Trade Ledger. */
(function () {
  var DEMO_BASE = 'https://website-project-liart.vercel.app';
  var WA_NUM = '918976587269';

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function demoRow(t) {
    if (t.deployed) {
      // Tier 4 is custom-scoped, so no generic public demo exists for it.
      return [1, 2, 3].map(function (k) {
        var url = DEMO_BASE + '/' + t.slug + '/tier-' + k + '/';
        return '<a class="tpl-chip" href="' + url + '" target="_blank" rel="noopener">Tier ' + k + ' demo</a>';
      }).join('');
    }
    var msg = encodeURIComponent('Hi, I want to see the ' + t.name + ' website templates from budgetwebsite.store.');
    return '<a class="tpl-chip tpl-chip-wa" href="https://wa.me/' + WA_NUM + '?text=' + msg + '" target="_blank" rel="noopener">See a demo on WhatsApp</a>';
  }

  function tierPanel(t) {
    if (!t.tiers.length) {
      return '<p class="tpl-detail-note">Full tier details for this trade are being written up. The ladder is the same: ' +
        '₹8,000 basic, ₹15,000 standard, ₹25,000 full build, ₹50,000+ custom app. Ask us on WhatsApp for specifics.</p>';
    }
    return t.tiers.map(function (tier) {
      var bullets = tier.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
      return '<div class="tpl-tier-detail">' +
        '<div class="tpl-tier-detail-head">' +
          '<span class="tpl-tier-detail-label">' + esc(tier.label) + '</span>' +
          '<span class="tpl-tier-detail-price">' + esc(tier.price) + '</span>' +
        '</div>' +
        '<p class="tpl-tier-detail-pitch">' + esc(tier.pitch) + '</p>' +
        '<ul class="tpl-tier-detail-bullets">' + bullets + '</ul>' +
      '</div>';
    }).join('');
  }

  function cardHTML(t) {
    var prices = t.tiers.length
      ? t.tiers.map(function (tier) { return '<span class="tpl-price-chip">' + esc(tier.price) + '</span>'; }).join('')
      : '<span class="tpl-price-chip">₹8,000</span><span class="tpl-price-chip">₹15,000</span><span class="tpl-price-chip">₹25,000</span><span class="tpl-price-chip">₹50,000+</span>';
    var searchText = (t.name + ' ' + t.blurb).toLowerCase();
    return '<div class="tpl-card" data-name="' + esc(searchText) + '">' +
      '<div class="tpl-card-head">' +
        '<span class="tpl-card-icon">' + t.icon + '</span>' +
        '<span class="tpl-card-num">' + pad2(t.n) + '</span>' +
      '</div>' +
      '<div class="tpl-card-name">' + esc(t.name) + '</div>' +
      '<p class="tpl-card-blurb">' + esc(t.blurb) + '</p>' +
      '<div class="tpl-price-row">' + prices + '</div>' +
      '<div class="tpl-card-tiers">' + demoRow(t) + '</div>' +
      '<button type="button" class="tpl-expand-btn">What each tier includes <span class="tpl-expand-chev">▾</span></button>' +
      '<div class="tpl-detail" hidden>' + tierPanel(t) + '</div>' +
    '</div>';
  }

  var grid = document.getElementById('tpl-grid');
  var count = document.getElementById('tpl-count');
  grid.innerHTML = LEDGER.map(cardHTML).join('');

  // expand/collapse
  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.tpl-expand-btn');
    if (!btn) return;
    var card = btn.closest('.tpl-card');
    var detail = card.querySelector('.tpl-detail');
    var open = !detail.hidden;
    detail.hidden = open;
    card.classList.toggle('open', !open);
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
