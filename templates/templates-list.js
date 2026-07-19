/* The 34 business templates, each with 3 tiers.
   Categories 01-18 are live on the demo catalogue, so their tier chips link
   straight to real demo sites. Categories 19-34 are built but not deployed
   to the public catalogue yet, so they get a WhatsApp "see a demo" CTA
   instead of a dead link. Flip live:true (and keep the same slug pattern)
   once those go up. No em dashes in any copy. */
(function () {
  var DEMO_BASE = 'https://website-project-liart.vercel.app';
  var WA = 'https://wa.me/918976587269?text=';

  var TEMPLATES = [
    { n: 1, slug: 'gym-fitness', icon: '🏋️', name: 'Gym & Fitness', live: true },
    { n: 2, slug: 'salon-beauty-parlour', icon: '💇', name: 'Salon & Beauty Parlour', live: true },
    { n: 3, slug: 'car-rental-self-drive', icon: '🚗', name: 'Car Rental & Self-Drive', live: true },
    { n: 4, slug: 'cafe', icon: '☕', name: 'Cafe', live: true },
    { n: 5, slug: 'restaurant-family-restaurant-bar', icon: '🍽️', name: 'Restaurant & Bar', live: true },
    { n: 6, slug: 'jeweller', icon: '💎', name: 'Jeweller', live: true },
    { n: 7, slug: 'yoga-classes-studio', icon: '🧘', name: 'Yoga Studio', live: true },
    { n: 8, slug: 'diagnostic-centre-pathology-lab', icon: '🔬', name: 'Diagnostic Centre & Path Lab', live: true },
    { n: 9, slug: 'tailor-bespoke-tailoring', icon: '✂️', name: 'Tailor & Bespoke Tailoring', live: true },
    { n: 10, slug: 'clothing-boutique', icon: '👗', name: 'Clothing Boutique', live: true },
    { n: 11, slug: 'medical-clinic-gp-specialist', icon: '🩺', name: 'Medical Clinic', live: true },
    { n: 12, slug: 'real-estate-agency-broker', icon: '🏢', name: 'Real Estate Agency', live: true },
    { n: 13, slug: 'ca-firm-accounting-services', icon: '📊', name: 'CA & Accounting Firm', live: true },
    { n: 14, slug: 'furniture-gallery-shop', icon: '🪑', name: 'Furniture Gallery', live: true },
    { n: 15, slug: 'sweet-shop-mithai-farsan', icon: '🍬', name: 'Sweet Shop, Mithai & Farsan', live: true },
    { n: 16, slug: 'catering-services', icon: '🍱', name: 'Catering Services', live: true },
    { n: 17, slug: 'tours-travels-vehicle-hire', icon: '✈️', name: 'Tours & Travels', live: true },
    { n: 18, slug: 'general-hospital-policlinic', icon: '🏥', name: 'Hospital & Polyclinic', live: true },
    { n: 19, slug: 'interior-designer', icon: '🛋️', name: 'Interior Designer', live: false },
    { n: 20, slug: 'bakery-cake-shop', icon: '🎂', name: 'Bakery & Cake Shop', live: false },
    { n: 21, slug: 'law-firm', icon: '⚖️', name: 'Law Firm', live: false },
    { n: 22, slug: 'dental-clinic', icon: '🦷', name: 'Dental Clinic', live: false },
    { n: 23, slug: 'manufacturing-industrial', icon: '🏭', name: 'Manufacturing & Industrial', live: false },
    { n: 24, slug: 'insurance-agent', icon: '🛡️', name: 'Insurance Agent', live: false },
    { n: 25, slug: 'architect', icon: '📐', name: 'Architect', live: false },
    { n: 26, slug: 'auto-repair-garage', icon: '🔧', name: 'Auto Repair Garage', live: false },
    { n: 27, slug: 'business-consultant', icon: '💼', name: 'Business Consultant', live: false },
    { n: 28, slug: 'building-contractor', icon: '🏗️', name: 'Building Contractor', live: false },
    { n: 29, slug: 'building-materials-retailer', icon: '🧱', name: 'Building Materials Retailer', live: false },
    { n: 30, slug: 'printing-press', icon: '🖨️', name: 'Printing Press', live: false },
    { n: 31, slug: 'event-management', icon: '🎪', name: 'Event Management', live: false },
    { n: 32, slug: 'wedding-planner', icon: '💍', name: 'Wedding Planner', live: false },
    { n: 33, slug: 'vaastu-astrology', icon: '🔮', name: 'Vaastu & Astrology', live: false },
    { n: 34, slug: 'artist-art-studio', icon: '🎨', name: 'Artist & Art Studio', live: false },
  ];

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function cardHTML(t) {
    var tiers;
    if (t.live) {
      tiers = [1, 2, 3].map(function (k) {
        var url = DEMO_BASE + '/' + pad2(t.n) + '-' + t.slug + '/tier-' + k + '/';
        return '<a class="tpl-chip" href="' + url + '" target="_blank" rel="noopener">Tier ' + k + ' demo</a>';
      }).join('');
    } else {
      var msg = encodeURIComponent('Hi, I want to see the ' + t.name + ' website templates from budgetwebsite.store.');
      tiers = '<a class="tpl-chip tpl-chip-wa" href="https://wa.me/918976587269?text=' + msg + '" target="_blank" rel="noopener">See a demo on WhatsApp</a>';
    }
    return '<div class="tpl-card tilt-card" data-name="' + esc(t.name.toLowerCase()) + '">' +
      '<div class="tpl-card-head">' +
        '<span class="tpl-card-icon">' + t.icon + '</span>' +
        '<span class="tpl-card-num">' + pad2(t.n) + '</span>' +
      '</div>' +
      '<div class="tpl-card-name">' + esc(t.name) + '</div>' +
      '<div class="tpl-card-tiers">' + tiers + '</div>' +
    '</div>';
  }

  var grid = document.getElementById('tpl-grid');
  var count = document.getElementById('tpl-count');
  grid.innerHTML = TEMPLATES.map(cardHTML).join('');

  function updateCount(visible) {
    count.textContent = visible === TEMPLATES.length
      ? TEMPLATES.length + ' business types, 3 tiers each'
      : visible + ' of ' + TEMPLATES.length + ' business types';
  }
  updateCount(TEMPLATES.length);

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
