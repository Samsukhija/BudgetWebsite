/* /app/billing/ — the Billing Pack workspace: a ledger of invoices and
   quotations (unlike the free single-draft tools, this keeps every record),
   paid/unpaid tracking, and one-tap quote-to-invoice. Local-first: no backend
   yet, same localStorage pattern as the rest of the site. Reuses the seller
   profile the free GST Invoice / Quotation Builder tools already save
   (bw_gst_seller_v1), so a returning user's business details carry over. */
(function () {
  'use strict';

  var TS = window.ToolsShared;

  // ── entitlement gate ──
  var user = window.BWAuth ? BWAuth.currentUser() : null;
  if (!user) { location.href = '/app/'; return; }
  if (!BWEntitlement.has(user.email, 'billing')) { location.href = '/app/'; return; }

  var SELLER_KEY = 'bw_gst_seller_v1';
  var INV_KEY = 'bw_billing_invoices_v1';
  var QUOTE_KEY = 'bw_billing_quotes_v1';
  var INV_COUNTER = 'bw_billing_inv_counter_v1';
  var QUOTE_COUNTER = 'bw_billing_quote_counter_v1';
  var GST_RATES = [0, 5, 12, 18, 28];
  var QUOTE_STATUSES = ['Draft', 'Sent', 'Accepted', 'Rejected', 'Expired'];
  var STATUS_BADGE = {
    Draft: 'tool-badge-neutral', Sent: 'tool-badge-accent', Accepted: 'tool-badge-good',
    Rejected: 'tool-badge-bad', Expired: 'tool-badge-warn',
    paid: 'tool-badge-good', unpaid: 'tool-badge-warn'
  };

  function nextNumber(counterKey, prefix) {
    var n = parseInt(localStorage.getItem(counterKey) || '0', 10) + 1;
    localStorage.setItem(counterKey, String(n));
    return prefix + '-' + String(n).padStart(4, '0');
  }

  function loadSeller() { return TS.loadJSON(SELLER_KEY, {}); }
  function saveSeller(s) { TS.saveJSON(SELLER_KEY, s); }

  function computeTotals(items, sameState) {
    var subTotal = 0, tax1Total = 0, tax2Total = 0;
    items.forEach(function (it) {
      var taxAmt = it.taxable * (it.gst / 100);
      tax1Total += sameState ? taxAmt / 2 : taxAmt;
      tax2Total += sameState ? taxAmt / 2 : 0;
      subTotal += it.taxable;
    });
    return { subTotal: subTotal, tax1Total: tax1Total, tax2Total: tax2Total, grandTotal: subTotal + tax1Total + tax2Total };
  }

  // ═══════════════════ item-row mini component (shared by both forms) ═══════════════════
  function addItemRow(container, data) {
    data = data || {};
    var row = document.createElement('div');
    row.className = 'billing-item-row';
    row.innerHTML =
      '<input type="text" class="bi-desc" placeholder="Item / service" value="' + TS.escapeHtml(data.desc || '') + '">' +
      '<input type="text" class="bi-hsn" placeholder="HSN/SAC" value="' + TS.escapeHtml(data.hsn || '') + '">' +
      '<input type="number" class="bi-qty" min="0" step="1" value="' + (data.qty != null ? data.qty : 1) + '">' +
      '<input type="number" class="bi-rate" min="0" step="0.01" value="' + (data.rate != null ? data.rate : '') + '">' +
      '<select class="bi-gst"></select>' +
      '<button type="button" class="billing-item-remove" title="Remove">✕</button>';
    var sel = row.querySelector('.bi-gst');
    GST_RATES.forEach(function (r) {
      var opt = document.createElement('option');
      opt.value = r; opt.textContent = r + '%';
      if (data.gst === r) opt.selected = true;
      sel.appendChild(opt);
    });
    if (data.gst == null) sel.value = 18;
    row.querySelector('.billing-item-remove').addEventListener('click', function () { row.remove(); });
    container.appendChild(row);
  }
  function getItems(container) {
    return Array.from(container.querySelectorAll('.billing-item-row')).map(function (row) {
      var qty = parseFloat(row.querySelector('.bi-qty').value) || 0;
      var rate = parseFloat(row.querySelector('.bi-rate').value) || 0;
      var gst = parseFloat(row.querySelector('.bi-gst').value) || 0;
      return { desc: row.querySelector('.bi-desc').value.trim(), hsn: row.querySelector('.bi-hsn').value.trim(), qty: qty, rate: rate, gst: gst, taxable: qty * rate };
    });
  }

  // ═══════════════════ printable sheet renderers ═══════════════════
  function itemsTableRows(items, sameState, taxLabel1, taxLabel2) {
    return items.map(function (it) {
      var taxAmt = it.taxable * (it.gst / 100);
      var tax1 = sameState ? taxAmt / 2 : taxAmt;
      var tax2 = sameState ? taxAmt / 2 : 0;
      return '<tr><td class="inv-col-desc">' + TS.escapeHtml(it.desc || '-') + '</td><td>' + TS.escapeHtml(it.hsn || '-') + '</td><td>' + it.qty + '</td>' +
        '<td>' + TS.formatMoney(it.rate) + '</td><td>' + TS.formatMoney(it.taxable) + '</td><td>' + it.gst + '%</td>' +
        '<td>' + TS.formatMoney(tax1) + '</td>' + (sameState ? '<td>' + TS.formatMoney(tax2) + '</td>' : '') +
        '<td>' + TS.formatMoney(it.taxable + taxAmt) + '</td></tr>';
    }).join('');
  }

  function renderInvoiceSheet(rec) {
    var t = computeTotals(rec.items, rec.sameState);
    var taxLabel1 = rec.sameState ? 'CGST' : 'IGST';
    return (
      '<div class="inv-head"><div>' +
        '<div class="inv-seller-name">' + TS.escapeHtml(rec.seller.name || 'Your Business Name') + '</div>' +
        '<div class="inv-seller-meta">' + TS.escapeHtml([rec.seller.addr, rec.seller.state].filter(Boolean).join(', ')) + '</div>' +
        '<div class="inv-seller-meta">GSTIN: ' + TS.escapeHtml(rec.seller.gstin || '-') + '</div></div>' +
        '<div class="inv-head-right"><div class="inv-doctitle">TAX INVOICE</div>' +
        '<div class="inv-meta"><span>Invoice No.</span><strong>' + TS.escapeHtml(rec.number) + '</strong></div>' +
        '<div class="inv-meta"><span>Date</span><strong>' + TS.formatDateDisplay(rec.date) + '</strong></div></div></div>' +
      '<div class="inv-billto"><div class="inv-panel-title" style="margin-bottom:6px;">Bill To</div>' +
        '<div class="inv-buyer-name">' + TS.escapeHtml(rec.buyer.name || 'Customer') + '</div>' +
        '<div class="inv-seller-meta">' + TS.escapeHtml([rec.buyer.addr, rec.buyer.state].filter(Boolean).join(', ')) + '</div>' +
        '<div class="inv-seller-meta">GSTIN: ' + TS.escapeHtml(rec.buyer.gstin || 'Unregistered') + '</div></div>' +
      '<table class="inv-table"><thead><tr><th class="inv-col-desc">Description</th><th>HSN/SAC</th><th>Qty</th><th>Rate</th><th>Taxable</th><th>GST%</th><th>' + taxLabel1 + '</th>' +
        (rec.sameState ? '<th>SGST</th>' : '') + '<th>Total</th></tr></thead><tbody>' + itemsTableRows(rec.items, rec.sameState) + '</tbody></table>' +
      '<div class="inv-totals">' +
        '<div class="inv-totals-row"><span>Taxable Total</span><strong>' + TS.formatMoney(t.subTotal) + '</strong></div>' +
        '<div class="inv-totals-row"><span>' + taxLabel1 + '</span><strong>' + TS.formatMoney(t.tax1Total) + '</strong></div>' +
        (rec.sameState ? '<div class="inv-totals-row"><span>SGST</span><strong>' + TS.formatMoney(t.tax2Total) + '</strong></div>' : '') +
        '<div class="inv-totals-row inv-grand"><span>Grand Total</span><strong>' + TS.formatMoney(t.grandTotal) + '</strong></div></div>' +
      '<div class="inv-words">Amount in Words: ' + TS.amountInWords(t.grandTotal) + '</div>' +
      (rec.notes ? '<div class="inv-foot"><div><div class="inv-foot-label">Notes</div><div class="inv-seller-meta">' + TS.escapeHtml(rec.notes) + '</div></div></div>' : '')
    );
  }

  function renderQuoteSheet(rec) {
    var t = computeTotals(rec.items, rec.sameState);
    var taxLabel1 = rec.sameState ? 'CGST' : 'IGST';
    return (
      '<div class="inv-head"><div>' +
        '<div class="inv-seller-name">' + TS.escapeHtml(rec.seller.name || 'Your Business Name') + '</div>' +
        '<div class="inv-seller-meta">' + TS.escapeHtml([rec.seller.addr, rec.seller.state].filter(Boolean).join(', ')) + '</div>' +
        '<div class="inv-seller-meta">GSTIN: ' + TS.escapeHtml(rec.seller.gstin || '-') + '</div></div>' +
        '<div class="inv-head-right"><div class="inv-doctitle">QUOTATION</div>' +
        '<div class="inv-meta"><span>No.</span><strong>' + TS.escapeHtml(rec.number) + '</strong></div>' +
        '<div class="inv-meta"><span>Date</span><strong>' + TS.formatDateDisplay(rec.date) + '</strong></div>' +
        '<div class="inv-meta"><span>Valid Until</span><strong>' + TS.formatDateDisplay(rec.validUntil) + '</strong></div>' +
        '<div style="margin-top:8px;"><span class="tool-badge ' + (STATUS_BADGE[rec.status] || 'tool-badge-neutral') + '">' + rec.status + '</span></div></div></div>' +
      '<div class="inv-billto"><div class="inv-panel-title" style="margin-bottom:6px;">For</div>' +
        '<div class="inv-buyer-name">' + TS.escapeHtml(rec.buyer.name || 'Customer') + '</div>' +
        '<div class="inv-seller-meta">' + TS.escapeHtml([rec.buyer.addr, rec.buyer.state].filter(Boolean).join(', ')) + '</div>' +
        '<div class="inv-seller-meta">GSTIN: ' + TS.escapeHtml(rec.buyer.gstin || 'Unregistered') + '</div></div>' +
      '<table class="inv-table"><thead><tr><th class="inv-col-desc">Description</th><th>HSN/SAC</th><th>Qty</th><th>Rate</th><th>Taxable</th><th>GST%</th><th>' + taxLabel1 + '</th>' +
        (rec.sameState ? '<th>SGST</th>' : '') + '<th>Total</th></tr></thead><tbody>' + itemsTableRows(rec.items, rec.sameState) + '</tbody></table>' +
      '<div class="inv-totals">' +
        '<div class="inv-totals-row"><span>Taxable Total</span><strong>' + TS.formatMoney(t.subTotal) + '</strong></div>' +
        '<div class="inv-totals-row"><span>' + taxLabel1 + '</span><strong>' + TS.formatMoney(t.tax1Total) + '</strong></div>' +
        (rec.sameState ? '<div class="inv-totals-row"><span>SGST</span><strong>' + TS.formatMoney(t.tax2Total) + '</strong></div>' : '') +
        '<div class="inv-totals-row inv-grand"><span>Grand Total</span><strong>' + TS.formatMoney(t.grandTotal) + '</strong></div></div>' +
      '<div class="inv-words">Amount in Words: ' + TS.amountInWords(t.grandTotal) + '</div>' +
      (rec.notes ? '<div class="inv-foot"><div><div class="inv-foot-label">Notes</div><div class="inv-seller-meta">' + TS.escapeHtml(rec.notes) + '</div></div></div>' : '')
    );
  }

  // ═══════════════════ tabs ═══════════════════
  document.querySelectorAll('.billing-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.billing-tab').forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.getElementById('tab-invoices').hidden = btn.dataset.tab !== 'invoices';
      document.getElementById('tab-quotes').hidden = btn.dataset.tab !== 'quotes';
    });
  });

  function showInvView(which) {
    document.getElementById('inv-list-view').hidden = which !== 'list';
    document.getElementById('inv-form-view').hidden = which !== 'form';
    document.getElementById('inv-detail-view').hidden = which !== 'detail';
  }
  function showQuoteView(which) {
    document.getElementById('quote-list-view').hidden = which !== 'list';
    document.getElementById('quote-form-view').hidden = which !== 'form';
    document.getElementById('quote-detail-view').hidden = which !== 'detail';
  }

  // ═══════════════════ INVOICES ═══════════════════
  function listInvoices() { return TS.loadJSON(INV_KEY, []); }
  function saveInvoices(arr) { TS.saveJSON(INV_KEY, arr); }

  function renderInvoiceList() {
    var invs = listInvoices().slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
    var body = document.getElementById('inv-table-body');
    body.innerHTML = invs.map(function (rec) {
      var t = computeTotals(rec.items, rec.sameState);
      return '<tr data-id="' + rec.id + '"><td>' + TS.escapeHtml(rec.number) + '</td><td>' + TS.formatDateDisplay(rec.date) + '</td>' +
        '<td>' + TS.escapeHtml(rec.buyer.name || '-') + '</td><td>' + TS.formatMoney(t.grandTotal) + '</td>' +
        '<td><span class="tool-badge ' + STATUS_BADGE[rec.status] + '">' + (rec.status === 'paid' ? 'Paid' : 'Unpaid') + '</span></td>' +
        '<td><button type="button" class="btn-ghost btn-sm inv-view-btn" data-id="' + rec.id + '">View</button></td></tr>';
    }).join('');
    document.getElementById('inv-empty').hidden = invs.length > 0;
    body.querySelectorAll('.inv-view-btn').forEach(function (b) { b.addEventListener('click', function () { openInvoiceDetail(b.dataset.id); }); });
    renderStats();
  }

  function openNewInvoiceForm(prefill) {
    var s = loadSeller();
    document.getElementById('ifm-seller-name').value = s.name || '';
    document.getElementById('ifm-seller-gstin').value = s.gstin || '';
    document.getElementById('ifm-seller-addr').value = s.addr || '';
    var stateSel = document.getElementById('ifm-seller-state');
    stateSel.innerHTML = ''; TS.populateStateSelect(stateSel, 'Select state');
    stateSel.value = s.state || '';

    var buyerStateSel = document.getElementById('ifm-buyer-state');
    buyerStateSel.innerHTML = ''; TS.populateStateSelect(buyerStateSel, 'Select state');

    document.getElementById('ifm-buyer-name').value = (prefill && prefill.buyer.name) || '';
    document.getElementById('ifm-buyer-gstin').value = (prefill && prefill.buyer.gstin) || '';
    document.getElementById('ifm-buyer-addr').value = (prefill && prefill.buyer.addr) || '';
    buyerStateSel.value = (prefill && prefill.buyer.state) || '';
    document.getElementById('ifm-inv-no').value = nextNumber(INV_COUNTER, 'INV');
    document.getElementById('ifm-inv-date').value = TS.todayISO();
    document.getElementById('ifm-notes').value = '';

    var itemsEl = document.getElementById('ifm-items');
    itemsEl.innerHTML = '';
    var items = (prefill && prefill.items && prefill.items.length) ? prefill.items : [{}];
    items.forEach(function (it) { addItemRow(itemsEl, it); });

    showInvView('form');
  }

  function saveInvoiceFromForm() {
    var seller = {
      name: document.getElementById('ifm-seller-name').value.trim(),
      gstin: document.getElementById('ifm-seller-gstin').value.trim(),
      addr: document.getElementById('ifm-seller-addr').value.trim(),
      state: document.getElementById('ifm-seller-state').value
    };
    saveSeller(seller);
    var buyerState = document.getElementById('ifm-buyer-state').value;
    var sameState = seller.state && buyerState ? seller.state === buyerState : true;
    var rec = {
      id: TS.uid(), number: document.getElementById('ifm-inv-no').value.trim() || nextNumber(INV_COUNTER, 'INV'),
      date: document.getElementById('ifm-inv-date').value || TS.todayISO(),
      seller: seller,
      buyer: {
        name: document.getElementById('ifm-buyer-name').value.trim(), gstin: document.getElementById('ifm-buyer-gstin').value.trim(),
        addr: document.getElementById('ifm-buyer-addr').value.trim(), state: buyerState
      },
      items: getItems(document.getElementById('ifm-items')),
      sameState: sameState, notes: document.getElementById('ifm-notes').value.trim(),
      status: 'unpaid', createdAt: Date.now()
    };
    var all = listInvoices();
    all.push(rec);
    saveInvoices(all);
    renderInvoiceList();
    openInvoiceDetail(rec.id);
  }

  function openInvoiceDetail(id) {
    var rec = listInvoices().filter(function (r) { return r.id === id; })[0];
    if (!rec) { showInvView('list'); return; }
    document.getElementById('ivd-sheet').innerHTML = renderInvoiceSheet(rec);
    var toggleBtn = document.getElementById('ivd-toggle-status');
    toggleBtn.textContent = rec.status === 'paid' ? 'Mark as Unpaid' : 'Mark as Paid';
    toggleBtn.onclick = function () {
      var all = listInvoices();
      var r = all.filter(function (x) { return x.id === id; })[0];
      r.status = r.status === 'paid' ? 'unpaid' : 'paid';
      saveInvoices(all);
      openInvoiceDetail(id);
      renderInvoiceList();
    };
    document.getElementById('ivd-wa').onclick = function () {
      var t = computeTotals(rec.items, rec.sameState);
      var lines = ['Invoice ' + rec.number, 'From: ' + rec.seller.name, 'To: ' + rec.buyer.name, 'Total: ' + TS.formatMoney(t.grandTotal), TS.amountInWords(t.grandTotal), '', 'Thank you for your business.'];
      window.open('https://wa.me/?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    };
    showInvView('detail');
  }

  document.getElementById('btn-new-inv').addEventListener('click', function () { openNewInvoiceForm(); });
  document.getElementById('ifm-add-item').addEventListener('click', function () { addItemRow(document.getElementById('ifm-items'), {}); });
  document.getElementById('ifm-save').addEventListener('click', saveInvoiceFromForm);
  document.getElementById('ifm-cancel').addEventListener('click', function () { showInvView('list'); });
  document.getElementById('ivd-back').addEventListener('click', function () { showInvView('list'); });
  document.getElementById('ivd-print').addEventListener('click', function () { window.print(); });

  // ═══════════════════ QUOTATIONS ═══════════════════
  function listQuotes() { return TS.loadJSON(QUOTE_KEY, []); }
  function saveQuotes(arr) { TS.saveJSON(QUOTE_KEY, arr); }

  function renderQuoteList() {
    var qs = listQuotes().slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
    var body = document.getElementById('quote-table-body');
    body.innerHTML = qs.map(function (rec) {
      var t = computeTotals(rec.items, rec.sameState);
      return '<tr data-id="' + rec.id + '"><td>' + TS.escapeHtml(rec.number) + '</td><td>' + TS.formatDateDisplay(rec.date) + '</td>' +
        '<td>' + TS.escapeHtml(rec.buyer.name || '-') + '</td><td>' + TS.formatMoney(t.grandTotal) + '</td>' +
        '<td><span class="tool-badge ' + (STATUS_BADGE[rec.status] || 'tool-badge-neutral') + '">' + rec.status + '</span></td>' +
        '<td><button type="button" class="btn-ghost btn-sm quote-view-btn" data-id="' + rec.id + '">View</button></td></tr>';
    }).join('');
    document.getElementById('quote-empty').hidden = qs.length > 0;
    body.querySelectorAll('.quote-view-btn').forEach(function (b) { b.addEventListener('click', function () { openQuoteDetail(b.dataset.id); }); });
    renderStats();
  }

  function addDaysISO(iso, days) {
    var base = iso ? new Date(iso + 'T00:00:00') : new Date();
    if (isNaN(base.getTime())) base = new Date();
    base.setDate(base.getDate() + days);
    return base.getFullYear() + '-' + String(base.getMonth() + 1).padStart(2, '0') + '-' + String(base.getDate()).padStart(2, '0');
  }

  function openNewQuoteForm(prefill) {
    var s = loadSeller();
    document.getElementById('qfm-seller-name').value = s.name || '';
    document.getElementById('qfm-seller-gstin').value = s.gstin || '';
    document.getElementById('qfm-seller-addr').value = s.addr || '';
    var stateSel = document.getElementById('qfm-seller-state');
    stateSel.innerHTML = ''; TS.populateStateSelect(stateSel, 'Select state');
    stateSel.value = s.state || '';

    var buyerStateSel = document.getElementById('qfm-buyer-state');
    buyerStateSel.innerHTML = ''; TS.populateStateSelect(buyerStateSel, 'Select state');

    document.getElementById('qfm-buyer-name').value = (prefill && prefill.buyer.name) || '';
    document.getElementById('qfm-buyer-gstin').value = (prefill && prefill.buyer.gstin) || '';
    document.getElementById('qfm-buyer-addr').value = (prefill && prefill.buyer.addr) || '';
    buyerStateSel.value = (prefill && prefill.buyer.state) || '';
    document.getElementById('qfm-quote-no').value = nextNumber(QUOTE_COUNTER, 'QUO');
    document.getElementById('qfm-quote-date').value = TS.todayISO();
    document.getElementById('qfm-valid-until').value = addDaysISO(TS.todayISO(), 15);
    document.getElementById('qfm-status').value = 'Draft';
    document.getElementById('qfm-notes').value = '';

    var itemsEl = document.getElementById('qfm-items');
    itemsEl.innerHTML = '';
    var items = (prefill && prefill.items && prefill.items.length) ? prefill.items : [{}];
    items.forEach(function (it) { addItemRow(itemsEl, it); });

    showQuoteView('form');
  }

  function saveQuoteFromForm() {
    var seller = {
      name: document.getElementById('qfm-seller-name').value.trim(),
      gstin: document.getElementById('qfm-seller-gstin').value.trim(),
      addr: document.getElementById('qfm-seller-addr').value.trim(),
      state: document.getElementById('qfm-seller-state').value
    };
    saveSeller(seller);
    var buyerState = document.getElementById('qfm-buyer-state').value;
    var sameState = seller.state && buyerState ? seller.state === buyerState : true;
    var rec = {
      id: TS.uid(), number: document.getElementById('qfm-quote-no').value.trim() || nextNumber(QUOTE_COUNTER, 'QUO'),
      date: document.getElementById('qfm-quote-date').value || TS.todayISO(),
      validUntil: document.getElementById('qfm-valid-until').value,
      seller: seller,
      buyer: {
        name: document.getElementById('qfm-buyer-name').value.trim(), gstin: document.getElementById('qfm-buyer-gstin').value.trim(),
        addr: document.getElementById('qfm-buyer-addr').value.trim(), state: buyerState
      },
      items: getItems(document.getElementById('qfm-items')),
      sameState: sameState, notes: document.getElementById('qfm-notes').value.trim(),
      status: document.getElementById('qfm-status').value || 'Draft', createdAt: Date.now()
    };
    var all = listQuotes();
    all.push(rec);
    saveQuotes(all);
    renderQuoteList();
    openQuoteDetail(rec.id);
  }

  function openQuoteDetail(id) {
    var rec = listQuotes().filter(function (r) { return r.id === id; })[0];
    if (!rec) { showQuoteView('list'); return; }
    document.getElementById('qvd-sheet').innerHTML = renderQuoteSheet(rec);
    var statusSel = document.getElementById('qvd-status');
    statusSel.value = rec.status;
    var makeInvBtn = document.getElementById('qvd-make-invoice');
    makeInvBtn.hidden = rec.status !== 'Accepted';
    statusSel.onchange = function () {
      var all = listQuotes();
      var r = all.filter(function (x) { return x.id === id; })[0];
      r.status = statusSel.value;
      saveQuotes(all);
      openQuoteDetail(id);
      renderQuoteList();
    };
    makeInvBtn.onclick = function () {
      document.querySelector('.billing-tab[data-tab="invoices"]').click();
      openNewInvoiceForm(rec);
    };
    document.getElementById('qvd-wa').onclick = function () {
      var t = computeTotals(rec.items, rec.sameState);
      var lines = ['Quotation ' + rec.number, 'From: ' + rec.seller.name, 'To: ' + rec.buyer.name, 'Total: ' + TS.formatMoney(t.grandTotal), 'Valid until: ' + TS.formatDateDisplay(rec.validUntil), '', 'This is an estimate. Reply to confirm and we will proceed.'];
      window.open('https://wa.me/?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    };
    showQuoteView('detail');
  }

  document.getElementById('btn-new-quote').addEventListener('click', function () { openNewQuoteForm(); });
  document.getElementById('qfm-add-item').addEventListener('click', function () { addItemRow(document.getElementById('qfm-items'), {}); });
  document.getElementById('qfm-save').addEventListener('click', saveQuoteFromForm);
  document.getElementById('qfm-cancel').addEventListener('click', function () { showQuoteView('list'); });
  document.getElementById('qvd-back').addEventListener('click', function () { showQuoteView('list'); });
  document.getElementById('qvd-print').addEventListener('click', function () { window.print(); });

  // ═══════════════════ stats + header ═══════════════════
  function renderStats() {
    var invs = listInvoices();
    var unpaid = 0, paid = 0;
    invs.forEach(function (r) {
      var t = computeTotals(r.items, r.sameState);
      if (r.status === 'paid') paid += t.grandTotal; else unpaid += t.grandTotal;
    });
    var openQuotes = listQuotes().filter(function (q) { return q.status === 'Draft' || q.status === 'Sent'; }).length;
    document.getElementById('billing-stats').innerHTML =
      '<div class="tool-stat-card"><div class="tool-stat-label">Invoices</div><div class="tool-stat-value">' + invs.length + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Unpaid</div><div class="tool-stat-value">' + TS.formatMoneyWhole(unpaid) + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Paid</div><div class="tool-stat-value">' + TS.formatMoneyWhole(paid) + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Open Quotations</div><div class="tool-stat-value">' + openQuotes + '</div></div>';
  }

  document.getElementById('hdr-biz').textContent = (loadSeller().name || user.name) + ' · ' + user.email;

  renderInvoiceList();
  renderQuoteList();
})();
