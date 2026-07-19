(function () {
  'use strict';

  var TS = window.ToolsShared;
  var GST_RATES = [0, 5, 12, 18, 28];
  var STATUSES = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];
  var STATUS_BADGE_CLASS = {
    Draft: 'tool-badge-neutral',
    Sent: 'tool-badge-accent',
    Accepted: 'tool-badge-good',
    Rejected: 'tool-badge-bad',
    Expired: 'tool-badge-warn'
  };

  // Reuses the same seller key as the GST Invoice tool, one business profile across tools.
  var SELLER_KEY = 'bw_gst_seller_v1';
  var DRAFT_KEY = 'bw_quote_draft_v1';
  var COUNTER_KEY = 'bw_quote_counter_v1';

  var els = {};
  ['f-seller-name', 'f-seller-gstin', 'f-seller-addr', 'f-seller-state', 'f-seller-contact',
   'f-buyer-name', 'f-buyer-gstin', 'f-buyer-addr', 'f-buyer-state',
   'f-quote-no', 'f-quote-date', 'f-valid-until', 'f-status',
   'f-notes', 'qb-items', 'btn-add-item', 'btn-print', 'btn-new', 'qb-savenote'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  TS.populateStateSelect(els['f-seller-state']);
  TS.populateStateSelect(els['f-buyer-state']);

  // ── date helpers ──
  function addDaysISO(iso, days) {
    var base = iso ? new Date(iso + 'T00:00:00') : new Date();
    if (isNaN(base.getTime())) base = new Date();
    base.setDate(base.getDate() + days);
    return base.getFullYear() + '-' + String(base.getMonth() + 1).padStart(2, '0') + '-' + String(base.getDate()).padStart(2, '0');
  }

  // ── line items ──
  var itemIdSeq = 0;
  function addItemRow(data) {
    data = data || {};
    var id = 'item-' + (itemIdSeq++);
    var row = document.createElement('div');
    row.className = 'qb-item-row';
    row.dataset.id = id;
    row.innerHTML =
      '<input type="text" class="it-desc" placeholder="Item / service description" value="' + TS.escapeHtml(data.desc || '') + '">' +
      '<button type="button" class="qb-item-remove" title="Remove item">✕</button>' +
      '<div class="it-fields">' +
        '<input type="number" class="it-qty" placeholder="Qty" min="0" step="1" value="' + (data.qty != null ? data.qty : 1) + '">' +
        '<input type="number" class="it-rate" placeholder="Rate ₹" min="0" step="0.01" value="' + (data.rate != null ? data.rate : '') + '">' +
        '<select class="it-gst"></select>' +
      '</div>';
    var gstSelect = row.querySelector('.it-gst');
    GST_RATES.forEach(function (r) {
      var opt = document.createElement('option');
      opt.value = r; opt.textContent = r + '%';
      if (data.gst === r) opt.selected = true;
      gstSelect.appendChild(opt);
    });
    if (data.gst == null) gstSelect.value = 18;

    row.querySelectorAll('input, select').forEach(function (el) {
      el.addEventListener('input', scheduleUpdate);
    });
    row.querySelector('.qb-item-remove').addEventListener('click', function () {
      row.remove();
      scheduleUpdate();
    });
    els['qb-items'].appendChild(row);
    return row;
  }

  function getItems() {
    return Array.from(els['qb-items'].querySelectorAll('.qb-item-row')).map(function (row) {
      var qty = parseFloat(row.querySelector('.it-qty').value) || 0;
      var rate = parseFloat(row.querySelector('.it-rate').value) || 0;
      var gst = parseFloat(row.querySelector('.it-gst').value) || 0;
      return {
        desc: row.querySelector('.it-desc').value.trim(),
        qty: qty, rate: rate, gst: gst,
        taxable: qty * rate
      };
    });
  }

  // ── quotation numbering ──
  function nextQuoteNumber() {
    var n = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10) + 1;
    localStorage.setItem(COUNTER_KEY, String(n));
    return 'QUO-' + String(n).padStart(4, '0');
  }

  // ── render preview + totals ──
  function update() {
    var sellerState = els['f-seller-state'].value;
    var buyerState = els['f-buyer-state'].value;
    var sameState = sellerState && buyerState ? sellerState === buyerState : true;

    document.getElementById('p-seller-name').textContent = els['f-seller-name'].value || 'Your Business Name';
    document.getElementById('p-seller-addr').textContent = [els['f-seller-addr'].value, sellerState].filter(Boolean).join(', ') || 'Address line';
    document.getElementById('p-seller-gstin').textContent = 'GSTIN: ' + (els['f-seller-gstin'].value || '-');
    document.getElementById('p-seller-contact').textContent = els['f-seller-contact'].value || '';
    document.getElementById('p-sign-name').textContent = els['f-seller-name'].value || 'Your Business Name';

    document.getElementById('p-buyer-name').textContent = els['f-buyer-name'].value || 'Customer Name';
    document.getElementById('p-buyer-addr').textContent = [els['f-buyer-addr'].value, buyerState].filter(Boolean).join(', ') || 'Customer address';
    document.getElementById('p-buyer-gstin').textContent = 'GSTIN: ' + (els['f-buyer-gstin'].value || 'Unregistered');

    document.getElementById('p-quote-no').textContent = els['f-quote-no'].value || '-';
    document.getElementById('p-quote-date').textContent = TS.formatDateDisplay(els['f-quote-date'].value);
    document.getElementById('p-valid-until').textContent = TS.formatDateDisplay(els['f-valid-until'].value);
    document.getElementById('p-valid-note').textContent = TS.formatDateDisplay(els['f-valid-until'].value);

    var status = els['f-status'].value || 'Draft';
    var badge = document.getElementById('p-status-badge');
    badge.textContent = status;
    badge.className = 'tool-badge ' + (STATUS_BADGE_CLASS[status] || 'tool-badge-neutral');

    var taxCol1 = document.getElementById('p-tax-col-1');
    var taxCol2 = document.getElementById('p-tax-col-2');
    taxCol1.textContent = sameState ? 'CGST' : 'IGST';
    taxCol2.textContent = sameState ? 'SGST' : '';
    taxCol2.style.display = sameState ? '' : 'none';
    document.getElementById('p-tax-total-1-label').textContent = sameState ? 'CGST' : 'IGST';
    document.getElementById('p-tax-total-2-row').style.display = sameState ? '' : 'none';

    var items = getItems();
    var tbody = document.getElementById('p-items');
    tbody.innerHTML = '';
    var subTotal = 0, tax1Total = 0, tax2Total = 0;

    items.forEach(function (it) {
      var taxAmt = it.taxable * (it.gst / 100);
      var tax1 = sameState ? taxAmt / 2 : taxAmt;
      var tax2 = sameState ? taxAmt / 2 : 0;
      var lineTotal = it.taxable + taxAmt;
      subTotal += it.taxable; tax1Total += tax1; tax2Total += tax2;

      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td class="qb-col-desc">' + TS.escapeHtml(it.desc || '-') + '</td>' +
        '<td>' + it.qty + '</td>' +
        '<td>' + TS.formatMoney(it.rate) + '</td>' +
        '<td>' + TS.formatMoney(it.taxable) + '</td>' +
        '<td>' + it.gst + '%</td>' +
        '<td>' + TS.formatMoney(tax1) + '</td>' +
        (sameState ? '<td>' + TS.formatMoney(tax2) + '</td>' : '') +
        '<td>' + TS.formatMoney(lineTotal) + '</td>';
      tbody.appendChild(tr);
    });

    var grandTotal = subTotal + tax1Total + tax2Total;
    document.getElementById('p-sub-total').textContent = TS.formatMoney(subTotal);
    document.getElementById('p-tax-total-1').textContent = TS.formatMoney(tax1Total);
    document.getElementById('p-tax-total-2').textContent = TS.formatMoney(tax2Total);
    document.getElementById('p-grand-total').textContent = TS.formatMoney(grandTotal);
    document.getElementById('p-words').textContent = TS.amountInWords(grandTotal);

    var notes = els['f-notes'].value.trim();
    document.getElementById('p-notes').textContent = notes;
    document.getElementById('p-notes-label').style.display = notes ? '' : 'none';
  }

  // ── persistence ──
  var saveTimer = null;
  function scheduleUpdate() {
    update();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 400);
  }

  function save() {
    var seller = {
      name: els['f-seller-name'].value, gstin: els['f-seller-gstin'].value,
      addr: els['f-seller-addr'].value, state: els['f-seller-state'].value,
      contact: els['f-seller-contact'].value
    };
    TS.saveJSON(SELLER_KEY, seller);

    var draft = {
      buyerName: els['f-buyer-name'].value, buyerGstin: els['f-buyer-gstin'].value,
      buyerAddr: els['f-buyer-addr'].value, buyerState: els['f-buyer-state'].value,
      quoteNo: els['f-quote-no'].value, quoteDate: els['f-quote-date'].value,
      validUntil: els['f-valid-until'].value, status: els['f-status'].value,
      notes: els['f-notes'].value,
      items: getItems()
    };
    TS.saveJSON(DRAFT_KEY, draft);

    els['qb-savenote'].textContent = 'Draft saved on this device-' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  function loadSeller() {
    var s = TS.loadJSON(SELLER_KEY, null);
    if (!s) return;
    els['f-seller-name'].value = s.name || '';
    els['f-seller-gstin'].value = s.gstin || '';
    els['f-seller-addr'].value = s.addr || '';
    els['f-seller-state'].value = s.state || '';
    els['f-seller-contact'].value = s.contact || '';
  }

  function loadDraft() {
    var d = TS.loadJSON(DRAFT_KEY, null);
    if (!d) return false;
    els['f-buyer-name'].value = d.buyerName || '';
    els['f-buyer-gstin'].value = d.buyerGstin || '';
    els['f-buyer-addr'].value = d.buyerAddr || '';
    els['f-buyer-state'].value = d.buyerState || '';
    els['f-quote-no'].value = d.quoteNo || '';
    els['f-quote-date'].value = d.quoteDate || TS.todayISO();
    els['f-valid-until'].value = d.validUntil || addDaysISO(els['f-quote-date'].value, 15);
    els['f-status'].value = STATUSES.indexOf(d.status) !== -1 ? d.status : 'Draft';
    els['f-notes'].value = d.notes || '';
    (d.items && d.items.length ? d.items : [{}]).forEach(addItemRow);
    return true;
  }

  function resetForNewQuotation() {
    els['f-buyer-name'].value = '';
    els['f-buyer-gstin'].value = '';
    els['f-buyer-addr'].value = '';
    els['f-buyer-state'].value = '';
    els['f-quote-no'].value = nextQuoteNumber();
    els['f-quote-date'].value = TS.todayISO();
    els['f-valid-until'].value = addDaysISO(els['f-quote-date'].value, 15);
    els['f-status'].value = 'Draft';
    els['f-notes'].value = '';
    els['qb-items'].innerHTML = '';
    addItemRow({});
    scheduleUpdate();
  }

  // ── wire up ──
  document.querySelectorAll('.tool-panel input, .tool-panel textarea, .tool-panel select').forEach(function (el) {
    el.addEventListener('input', scheduleUpdate);
  });
  els['f-quote-date'].addEventListener('change', function () {
    // Keep "Valid Until" 15 days ahead of the quote date unless the user has already
    // customised it away from that default, cheap heuristic: only auto-shift if it's
    // currently exactly 15 days after the (old) quote date is impossible to know here,
    // so we only auto-fill when Valid Until is empty.
    if (!els['f-valid-until'].value) {
      els['f-valid-until'].value = addDaysISO(els['f-quote-date'].value, 15);
      scheduleUpdate();
    }
  });
  els['btn-add-item'].addEventListener('click', function () { addItemRow({}); scheduleUpdate(); });
  els['btn-print'].addEventListener('click', function () { window.print(); });
  var btnWa = document.getElementById('btn-wa');
  if (btnWa) {
    btnWa.addEventListener('click', function () {
      function t(id) { var e = document.getElementById(id); return e ? e.textContent.trim() : ''; }
      var lines = [
        'Quotation ' + t('p-quote-no'),
        'From: ' + t('p-seller-name'),
        'To: ' + t('p-buyer-name'),
        'Total: ' + t('p-grand-total'),
        'Valid until: ' + t('p-valid-until'),
        '',
        'This is an estimate. Reply to confirm and we will proceed.'
      ];
      window.open('https://wa.me/?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    });
  }
  els['btn-new'].addEventListener('click', function () {
    if (confirm('Start a new quotation? Your business details stay saved, but the current customer/items will be cleared.')) {
      resetForNewQuotation();
    }
  });

  loadSeller();
  var hadDraft = loadDraft();
  if (!hadDraft) {
    els['f-quote-no'].value = nextQuoteNumber();
    els['f-quote-date'].value = TS.todayISO();
    els['f-valid-until'].value = addDaysISO(els['f-quote-date'].value, 15);
    addItemRow({});
  }
  update();
})();
