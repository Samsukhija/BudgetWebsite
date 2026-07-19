(function () {
  'use strict';

  // ── India states/UTs, used only to decide CGST+SGST (same state) vs IGST (different state) ──
  var STATES = [
    'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh',
    'Chhattisgarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Goa','Gujarat','Haryana',
    'Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Ladakh',
    'Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
    'Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
    'Uttar Pradesh','Uttarakhand','West Bengal'
  ];
  var GST_RATES = [0, 5, 12, 18, 28];

  var SELLER_KEY = 'bw_gst_seller_v1';
  var DRAFT_KEY = 'bw_gst_draft_v1';
  var COUNTER_KEY = 'bw_gst_counter_v1';

  var els = {};
  ['f-seller-name','f-seller-gstin','f-seller-addr','f-seller-state','f-seller-contact',
   'f-buyer-name','f-buyer-gstin','f-buyer-addr','f-buyer-state',
   'f-inv-no','f-inv-date','f-bank','f-notes','inv-items','btn-add-item','btn-print','btn-new','inv-savenote'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  function populateStateSelect(select) {
    STATES.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      select.appendChild(opt);
    });
  }
  populateStateSelect(els['f-seller-state']);
  populateStateSelect(els['f-buyer-state']);

  // ── amount in words, Indian numbering (lakh/crore) ──
  var ONES = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
    'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  var TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];

  function twoDigitsToWords(n) {
    if (n === 0) return '';
    if (n < 20) return ONES[n];
    var t = Math.floor(n / 10), o = n % 10;
    return TENS[t] + (o ? ' ' + ONES[o] : '');
  }
  function threeDigitsToWords(n) {
    var h = Math.floor(n / 100), rest = n % 100;
    var parts = [];
    if (h) parts.push(ONES[h] + ' Hundred');
    if (rest) parts.push(twoDigitsToWords(rest));
    return parts.join(' ');
  }
  function numberToWords(num) {
    num = Math.round(num);
    if (num === 0) return 'Zero';
    var crore = Math.floor(num / 10000000); num %= 10000000;
    var lakh = Math.floor(num / 100000); num %= 100000;
    var thousand = Math.floor(num / 1000); num %= 1000;
    var hundred = num;
    var parts = [];
    if (crore) parts.push(threeDigitsToWords(crore) + ' Crore');
    if (lakh) parts.push(twoDigitsToWords(lakh < 100 ? lakh : 0) + (lakh >= 100 ? threeDigitsToWords(lakh) : '') + ' Lakh');
    if (thousand) parts.push((thousand < 100 ? twoDigitsToWords(thousand) : threeDigitsToWords(thousand)) + ' Thousand');
    if (hundred) parts.push(threeDigitsToWords(hundred));
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }
  function amountInWords(n) {
    var rupees = Math.floor(n);
    var paise = Math.round((n - rupees) * 100);
    var words = numberToWords(rupees) + ' Rupees';
    if (paise) words += ' and ' + numberToWords(paise) + ' Paise';
    return words + ' Only';
  }

  function formatMoney(n) {
    if (isNaN(n)) n = 0;
    return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // ── line items ──
  var itemIdSeq = 0;
  function addItemRow(data) {
    data = data || {};
    var id = 'item-' + (itemIdSeq++);
    var row = document.createElement('div');
    row.className = 'inv-item-row';
    row.dataset.id = id;
    row.innerHTML =
      '<input type="text" class="it-desc" placeholder="Item / service description" value="' + (data.desc || '') + '">' +
      '<button type="button" class="inv-item-remove" title="Remove item">✕</button>' +
      '<div class="it-fields">' +
        '<input type="text" class="it-hsn" placeholder="HSN/SAC" value="' + (data.hsn || '') + '">' +
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
    row.querySelector('.inv-item-remove').addEventListener('click', function () {
      row.remove();
      scheduleUpdate();
    });
    els['inv-items'].appendChild(row);
    return row;
  }

  function getItems() {
    return Array.from(els['inv-items'].querySelectorAll('.inv-item-row')).map(function (row) {
      var qty = parseFloat(row.querySelector('.it-qty').value) || 0;
      var rate = parseFloat(row.querySelector('.it-rate').value) || 0;
      var gst = parseFloat(row.querySelector('.it-gst').value) || 0;
      return {
        desc: row.querySelector('.it-desc').value.trim(),
        hsn: row.querySelector('.it-hsn').value.trim(),
        qty: qty, rate: rate, gst: gst,
        taxable: qty * rate
      };
    });
  }

  // ── invoice numbering ──
  function nextInvoiceNumber() {
    var n = parseInt(localStorage.getItem(COUNTER_KEY) || '0', 10) + 1;
    localStorage.setItem(COUNTER_KEY, String(n));
    return 'INV-' + String(n).padStart(4, '0');
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function formatDateDisplay(iso) {
    if (!iso) return '-';
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return parts[2] + ' ' + MONTHS[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
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
    document.getElementById('p-buyer-addr').textContent = [els['f-buyer-addr'].value, buyerState].filter(Boolean).join(', ') || 'Billing address';
    document.getElementById('p-buyer-gstin').textContent = 'GSTIN: ' + (els['f-buyer-gstin'].value || 'Unregistered');

    document.getElementById('p-inv-no').textContent = els['f-inv-no'].value || '-';
    document.getElementById('p-inv-date').textContent = formatDateDisplay(els['f-inv-date'].value);

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
        '<td class="inv-col-desc">' + escapeHtml(it.desc || '-') + '</td>' +
        '<td>' + escapeHtml(it.hsn || '-') + '</td>' +
        '<td>' + it.qty + '</td>' +
        '<td>' + formatMoney(it.rate) + '</td>' +
        '<td>' + formatMoney(it.taxable) + '</td>' +
        '<td>' + it.gst + '%</td>' +
        '<td>' + formatMoney(tax1) + '</td>' +
        (sameState ? '<td>' + formatMoney(tax2) + '</td>' : '') +
        '<td>' + formatMoney(lineTotal) + '</td>';
      tbody.appendChild(tr);
    });

    var grandTotal = subTotal + tax1Total + tax2Total;
    document.getElementById('p-sub-total').textContent = formatMoney(subTotal);
    document.getElementById('p-tax-total-1').textContent = formatMoney(tax1Total);
    document.getElementById('p-tax-total-2').textContent = formatMoney(tax2Total);
    document.getElementById('p-grand-total').textContent = formatMoney(grandTotal);
    document.getElementById('p-words').textContent = amountInWords(grandTotal);

    var bank = els['f-bank'].value.trim(), notes = els['f-notes'].value.trim();
    document.getElementById('p-bank').textContent = bank;
    document.getElementById('p-bank-label').style.display = bank ? '' : 'none';
    document.getElementById('p-notes').textContent = notes;
    document.getElementById('p-notes-label').style.display = notes ? '' : 'none';
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
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
    localStorage.setItem(SELLER_KEY, JSON.stringify(seller));

    var draft = {
      buyerName: els['f-buyer-name'].value, buyerGstin: els['f-buyer-gstin'].value,
      buyerAddr: els['f-buyer-addr'].value, buyerState: els['f-buyer-state'].value,
      invNo: els['f-inv-no'].value, invDate: els['f-inv-date'].value,
      bank: els['f-bank'].value, notes: els['f-notes'].value,
      items: getItems()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));

    els['inv-savenote'].textContent = 'Draft saved on this device-' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  function loadSeller() {
    try {
      var s = JSON.parse(localStorage.getItem(SELLER_KEY) || 'null');
      if (!s) return;
      els['f-seller-name'].value = s.name || '';
      els['f-seller-gstin'].value = s.gstin || '';
      els['f-seller-addr'].value = s.addr || '';
      els['f-seller-state'].value = s.state || '';
      els['f-seller-contact'].value = s.contact || '';
    } catch (e) {}
  }

  function loadDraft() {
    try {
      var d = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (!d) return false;
      els['f-buyer-name'].value = d.buyerName || '';
      els['f-buyer-gstin'].value = d.buyerGstin || '';
      els['f-buyer-addr'].value = d.buyerAddr || '';
      els['f-buyer-state'].value = d.buyerState || '';
      els['f-inv-no'].value = d.invNo || '';
      els['f-inv-date'].value = d.invDate || todayISO();
      els['f-bank'].value = d.bank || '';
      els['f-notes'].value = d.notes || '';
      (d.items && d.items.length ? d.items : [{}]).forEach(addItemRow);
      return true;
    } catch (e) { return false; }
  }

  function resetForNewInvoice() {
    els['f-buyer-name'].value = '';
    els['f-buyer-gstin'].value = '';
    els['f-buyer-addr'].value = '';
    els['f-buyer-state'].value = '';
    els['f-inv-no'].value = nextInvoiceNumber();
    els['f-inv-date'].value = todayISO();
    els['f-bank'].value = els['f-bank'].value; // bank details carry over, they're the seller's
    els['f-notes'].value = '';
    els['inv-items'].innerHTML = '';
    addItemRow({});
    scheduleUpdate();
  }

  // ── wire up ──
  document.querySelectorAll('.inv-panel input, .inv-panel textarea, .inv-panel select').forEach(function (el) {
    el.addEventListener('input', scheduleUpdate);
  });
  els['btn-add-item'].addEventListener('click', function () { addItemRow({}); scheduleUpdate(); });
  els['btn-print'].addEventListener('click', function () { window.print(); });
  els['btn-new'].addEventListener('click', function () {
    if (confirm('Start a new invoice? Your business details stay saved, but the current buyer/items will be cleared.')) {
      resetForNewInvoice();
    }
  });

  loadSeller();
  var hadDraft = loadDraft();
  if (!hadDraft) {
    els['f-inv-no'].value = nextInvoiceNumber();
    els['f-inv-date'].value = todayISO();
    addItemRow({});
  }
  update();
})();
