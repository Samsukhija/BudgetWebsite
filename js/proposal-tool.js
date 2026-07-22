/* Internal Proposal Builder — /internal/proposal/. Pick a tier, tick add-ons,
   it totals everything and renders a branded, printable, WhatsApp-shareable
   quotation. Prices come from services-data.js (single source of truth,
   shared with the public /pricing/ page). Not linked anywhere public. */
(function () {
  'use strict';

  var DRAFT_KEY = 'bw_proposal_draft_v1';
  var COUNTER_KEY = 'bw_proposal_counter_v1';

  var state = {
    tier: 'standard',
    tierCustomPrice: 0,
    onetime: {},   // key -> { checked, price }
    recurring: {}  // key -> { checked, price }
  };

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function money(n) { n = isNaN(n) ? 0 : n; return '₹' + Math.round(n).toLocaleString('en-IN'); }
  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function plusDaysISO(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function formatDateDisplay(iso) {
    if (!iso) return '-';
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return parts[2] + ' ' + MONTHS[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
  }
  function nextProposalNumber() {
    var n = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10) + 1;
    localStorage.setItem(COUNTER_KEY, String(n));
    return 'PROP-' + String(n).padStart(4, '0');
  }

  var els = {};
  ['f-client-name','f-biz-name','f-client-phone','f-valid-until','f-tier-custom-price',
   'f-tier-note','f-notes','btn-print','btn-wa','btn-new'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  // ── tier picker ──
  function renderTierPicker() {
    var wrap = document.getElementById('tier-picker');
    wrap.innerHTML = BW_SERVICES.tiers.map(function (t) {
      return '<div class="tier-opt' + (state.tier === t.key ? ' active' : '') + '" data-tier="' + t.key + '">' +
        '<div class="tier-opt-name">' + esc(t.name) + '</div>' +
        '<div class="tier-opt-price">' + (t.editablePrice ? money(state.tierCustomPrice || t.price) + '+' : money(t.price)) + '</div>' +
      '</div>';
    }).join('');
    wrap.querySelectorAll('.tier-opt').forEach(function (el) {
      el.addEventListener('click', function () {
        state.tier = el.dataset.tier;
        var t = BW_SERVICES.tiers.filter(function (x) { return x.key === state.tier; })[0];
        document.getElementById('row-custom-price').hidden = !t.editablePrice;
        renderTierPicker();
        update();
      });
    });
  }

  // ── add-on checklists ──
  function renderChecklist(containerId, items, bucket) {
    var el = document.getElementById(containerId);
    el.innerHTML = items.map(function (item) {
      var s = bucket[item.key] || { checked: false, price: item.price };
      bucket[item.key] = s;
      var suffix = item.cadence ? (' / ' + (item.cadence === 'month' ? 'mo' : 'yr')) : '';
      return '<div class="svc-row" data-key="' + item.key + '">' +
        '<input type="checkbox" class="svc-check"' + (s.checked ? ' checked' : '') + '>' +
        '<div><div class="svc-name">' + esc(item.name) + '</div>' +
        '<div class="svc-desc">' + esc(item.desc) + (item.note ? ' <em>(' + esc(item.note) + ')</em>' : '') + '</div></div>' +
        '<input type="number" class="svc-price-input" min="0" step="100" value="' + s.price + '">' +
      '</div>';
    }).join('');

    el.querySelectorAll('.svc-row').forEach(function (row) {
      var key = row.dataset.key;
      var check = row.querySelector('.svc-check');
      var priceInput = row.querySelector('.svc-price-input');
      check.addEventListener('change', function () { bucket[key].checked = check.checked; update(); save(); });
      priceInput.addEventListener('input', function () { bucket[key].price = parseFloat(priceInput.value) || 0; update(); save(); });
    });
  }

  // ── preview + totals ──
  function update() {
    document.getElementById('p-client-name').textContent = els['f-client-name'].value || 'Client Name';
    document.getElementById('p-biz-name').textContent = els['f-biz-name'].value || '';
    document.getElementById('p-client-phone').textContent = els['f-client-phone'].value || '';
    document.getElementById('p-date').textContent = formatDateDisplay(todayISO());
    document.getElementById('p-valid').textContent = formatDateDisplay(els['f-valid-until'].value);

    var t = BW_SERVICES.tiers.filter(function (x) { return x.key === state.tier; })[0];
    var tierPrice = t.editablePrice ? (parseFloat(els['f-tier-custom-price'].value) || 0) : t.price;
    var tierLabel = t.name + ' Website' + (els['f-tier-note'].value.trim() ? ' — ' + els['f-tier-note'].value.trim() : '');
    document.getElementById('p-tier-row').innerHTML =
      '<tr><td class="inv-col-desc">' + esc(tierLabel) + '</td><td>' + money(tierPrice) + '</td></tr>';

    var onetimeTotal = tierPrice;
    var onetimeRows = '';
    BW_SERVICES.oneTime.forEach(function (item) {
      var s = state.onetime[item.key];
      if (s && s.checked) {
        onetimeTotal += s.price;
        onetimeRows += '<tr><td class="inv-col-desc">' + esc(item.name) + '</td><td>' + money(s.price) + '</td></tr>';
      }
    });
    document.getElementById('p-onetime-rows').innerHTML = onetimeRows;
    document.getElementById('p-onetime-block').style.display = onetimeRows ? '' : 'none';
    document.getElementById('p-onetime-total').textContent = money(onetimeTotal);

    var recurringRows = '';
    BW_SERVICES.recurring.forEach(function (item) {
      var s = state.recurring[item.key];
      if (s && s.checked) {
        recurringRows += '<tr><td class="inv-col-desc">' + esc(item.name) + '</td><td>' + money(s.price) + ' / ' + (item.cadence === 'month' ? 'mo' : 'yr') + '</td></tr>';
      }
    });
    document.getElementById('p-recurring-rows').innerHTML = recurringRows;
    document.getElementById('p-recurring-block').style.display = recurringRows ? '' : 'none';

    var notes = els['f-notes'].value.trim();
    document.getElementById('p-notes').textContent = notes;
    document.getElementById('p-notes-block').style.display = notes ? '' : 'none';
  }

  // ── persistence ──
  var saveTimer = null;
  function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(save, 400); }
  function save() {
    var draft = {
      propNo: document.getElementById('p-prop-no').textContent,
      clientName: els['f-client-name'].value, bizName: els['f-biz-name'].value,
      clientPhone: els['f-client-phone'].value, validUntil: els['f-valid-until'].value,
      tier: state.tier, tierCustomPrice: parseFloat(els['f-tier-custom-price'].value) || 0,
      tierNote: els['f-tier-note'].value, notes: els['f-notes'].value,
      onetime: state.onetime, recurring: state.recurring
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    document.getElementById('prop-savenote').textContent = 'Draft saved on this device-' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }
  function loadDraft() {
    try {
      var d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (!d) return false;
      document.getElementById('p-prop-no').textContent = d.propNo || nextProposalNumber();
      els['f-client-name'].value = d.clientName || '';
      els['f-biz-name'].value = d.bizName || '';
      els['f-client-phone'].value = d.clientPhone || '';
      els['f-valid-until'].value = d.validUntil || plusDaysISO(7);
      els['f-tier-custom-price'].value = d.tierCustomPrice || '';
      els['f-tier-note'].value = d.tierNote || '';
      els['f-notes'].value = d.notes || '';
      state.tier = d.tier || 'standard';
      state.onetime = d.onetime || {};
      state.recurring = d.recurring || {};
      return true;
    } catch (e) { return false; }
  }

  function resetForNew() {
    document.getElementById('p-prop-no').textContent = nextProposalNumber();
    els['f-client-name'].value = '';
    els['f-biz-name'].value = '';
    els['f-client-phone'].value = '';
    els['f-valid-until'].value = plusDaysISO(7);
    els['f-tier-custom-price'].value = '';
    els['f-tier-note'].value = '';
    els['f-notes'].value = '';
    state.tier = 'standard';
    state.onetime = {};
    state.recurring = {};
    var t = BW_SERVICES.tiers.filter(function (x) { return x.key === state.tier; })[0];
    document.getElementById('row-custom-price').hidden = !t.editablePrice;
    renderTierPicker();
    renderChecklist('onetime-list', BW_SERVICES.oneTime, state.onetime);
    renderChecklist('recurring-list', BW_SERVICES.recurring, state.recurring);
    update();
    save();
  }

  // ── build a plain-text summary for WhatsApp ──
  function buildSummary() {
    var t = BW_SERVICES.tiers.filter(function (x) { return x.key === state.tier; })[0];
    var tierPrice = t.editablePrice ? (parseFloat(els['f-tier-custom-price'].value) || 0) : t.price;
    var lines = [
      'Proposal ' + document.getElementById('p-prop-no').textContent + ' — budgetwebsite.store',
      'For: ' + (els['f-biz-name'].value || els['f-client-name'].value || 'you'),
      '',
      t.name + ' Website: ' + money(tierPrice)
    ];
    var onetimeTotal = tierPrice;
    BW_SERVICES.oneTime.forEach(function (item) {
      var s = state.onetime[item.key];
      if (s && s.checked) { lines.push(item.name + ': ' + money(s.price)); onetimeTotal += s.price; }
    });
    lines.push('One-time Total: ' + money(onetimeTotal));
    var recurLines = [];
    BW_SERVICES.recurring.forEach(function (item) {
      var s = state.recurring[item.key];
      if (s && s.checked) recurLines.push(item.name + ': ' + money(s.price) + ' / ' + (item.cadence === 'month' ? 'mo' : 'yr'));
    });
    if (recurLines.length) { lines.push(''); lines.push('Ongoing (optional):'); lines = lines.concat(recurLines); }
    lines.push('');
    lines.push('Valid until ' + formatDateDisplay(els['f-valid-until'].value) + '. Reply YES to confirm and we\'ll send your payment link.');
    return lines.join('\n');
  }

  // ── wire up ──
  document.querySelectorAll('.invoice-form input, .invoice-form textarea').forEach(function (el) {
    el.addEventListener('input', function () { update(); scheduleSave(); });
  });
  els['btn-print'].addEventListener('click', function () { window.print(); });
  els['btn-new'].addEventListener('click', function () {
    if (confirm('Start a new proposal? This clears the current client, add-ons and notes.')) resetForNew();
  });
  els['btn-wa'].addEventListener('click', function () {
    var phone = (els['f-client-phone'].value || '').replace(/\D/g, '');
    var target = phone.length === 10 ? '91' + phone : '';
    window.open('https://wa.me/' + target + '?text=' + encodeURIComponent(buildSummary()), '_blank', 'noopener');
  });

  renderTierPicker();
  renderChecklist('onetime-list', BW_SERVICES.oneTime, state.onetime);
  renderChecklist('recurring-list', BW_SERVICES.recurring, state.recurring);
  var t0 = BW_SERVICES.tiers.filter(function (x) { return x.key === state.tier; })[0];
  document.getElementById('row-custom-price').hidden = !t0.editablePrice;

  var hadDraft = loadDraft();
  if (!hadDraft) {
    document.getElementById('p-prop-no').textContent = nextProposalNumber();
    els['f-valid-until'].value = plusDaysISO(7);
  }
  renderTierPicker();
  renderChecklist('onetime-list', BW_SERVICES.oneTime, state.onetime);
  renderChecklist('recurring-list', BW_SERVICES.recurring, state.recurring);
  update();
})();
