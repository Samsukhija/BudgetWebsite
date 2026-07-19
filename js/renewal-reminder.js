(function () {
  'use strict';

  var TS = window.ToolsShared;
  var STORAGE_KEY = 'bw_tools_renewals_v1';

  var els = {};
  ['f-name', 'f-amount', 'f-category', 'f-frequency', 'f-customdays-wrap', 'f-customdays',
   'f-nextdue', 'f-notes', 'btn-add', 'renewals-tbody', 'renewals-empty', 'stats-row'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  // ── date helpers (all dates are plain YYYY-MM-DD strings, no timezone math) ──
  function parseISODate(iso) {
    var p = iso.split('-');
    return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
  }
  function formatISODate(d) {
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function addMonthsISO(iso, n) {
    var d = parseISODate(iso);
    var nd = new Date(d.getFullYear(), d.getMonth() + n, d.getDate());
    return formatISODate(nd);
  }
  function addYearsISO(iso, n) {
    var d = parseISODate(iso);
    var nd = new Date(d.getFullYear() + n, d.getMonth(), d.getDate());
    return formatISODate(nd);
  }
  function addDaysISO(iso, n) {
    var d = parseISODate(iso);
    var nd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    return formatISODate(nd);
  }
  // whole days between two ISO dates: isoA - isoB (positive = A is later)
  function diffDays(isoA, isoB) {
    var a = parseISODate(isoA), b = parseISODate(isoB);
    return Math.round((a.getTime() - b.getTime()) / 86400000);
  }

  function frequencyLabel(r) {
    if (r.frequency === 'monthly') return 'Every month';
    if (r.frequency === 'quarterly') return 'Every quarter';
    if (r.frequency === 'yearly') return 'Every year';
    if (r.frequency === 'custom') return 'Every ' + (r.customDays || 0) + ' days';
    return '';
  }

  function advanceNextDue(r) {
    if (r.frequency === 'monthly') return addMonthsISO(r.nextDue, 1);
    if (r.frequency === 'quarterly') return addMonthsISO(r.nextDue, 3);
    if (r.frequency === 'yearly') return addYearsISO(r.nextDue, 1);
    if (r.frequency === 'custom') return addDaysISO(r.nextDue, parseInt(r.customDays, 10) || 0);
    return r.nextDue;
  }

  function dueBadge(nextDue, today) {
    var d = diffDays(nextDue, today);
    if (d < 0) return { cls: 'tool-badge-bad', text: TS.formatDateDisplay(nextDue) + ' · overdue' };
    if (d <= 7) return { cls: 'tool-badge-warn', text: TS.formatDateDisplay(nextDue) };
    return { cls: 'tool-badge-neutral', text: TS.formatDateDisplay(nextDue) };
  }

  // ── storage ──
  function loadRenewals() { return TS.loadJSON(STORAGE_KEY, []); }
  function saveRenewals(list) { TS.saveJSON(STORAGE_KEY, list); }

  // ── stats ──
  function renderStats(list) {
    var today = TS.todayISO();
    var overdueCount = 0, dueWithin7Count = 0, dueWithin30Sum = 0;
    list.forEach(function (r) {
      var d = diffDays(r.nextDue, today);
      if (d < 0) overdueCount++;
      if (d >= 0 && d <= 7) dueWithin7Count++;
      // "due within 30 days" is a cash-outlook figure: it includes anything already
      // overdue (still owed, still due) plus anything coming due in the next 30 days.
      if (d <= 30) dueWithin30Sum += (parseFloat(r.amount) || 0);
    });
    els['stats-row'].innerHTML =
      '<div class="tool-stat-card"><div class="tool-stat-label">Overdue</div><div class="tool-stat-value">' + overdueCount + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Due within 7 days</div><div class="tool-stat-value">' + dueWithin7Count + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Due within 30 days</div><div class="tool-stat-value">' + TS.formatMoney(dueWithin30Sum) + '</div></div>';
  }

  // ── table ──
  function renderTable(list) {
    var today = TS.todayISO();
    var sorted = list.slice().sort(function (a, b) { return a.nextDue < b.nextDue ? -1 : (a.nextDue > b.nextDue ? 1 : 0); });

    els['renewals-tbody'].innerHTML = '';
    els['renewals-empty'].style.display = sorted.length ? 'none' : '';

    sorted.forEach(function (r) {
      var badge = dueBadge(r.nextDue, today);
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + TS.escapeHtml(r.name || '-') + '</td>' +
        '<td>' + (r.category ? '<span class="tool-badge tool-badge-accent">' + TS.escapeHtml(r.category) + '</span>' : '-') + '</td>' +
        '<td>' + TS.formatMoney(parseFloat(r.amount) || 0) + '</td>' +
        '<td>' + TS.escapeHtml(frequencyLabel(r)) + '</td>' +
        '<td><span class="tool-badge ' + badge.cls + '">' + badge.text + '</span></td>' +
        '<td>' + (r.notes ? TS.escapeHtml(r.notes) : '-') + '</td>' +
        '<td style="white-space:nowrap;">' +
          '<button type="button" class="btn-sm btn-primary" data-action="paid" data-id="' + r.id + '">Mark Paid</button> ' +
          '<button type="button" class="btn-danger" data-action="delete" data-id="' + r.id + '">Delete</button>' +
        '</td>';
      els['renewals-tbody'].appendChild(tr);
    });
  }

  function render() {
    var list = loadRenewals();
    renderStats(list);
    renderTable(list);
  }

  // ── form ──
  function toggleCustomDaysField() {
    els['f-customdays-wrap'].style.display = els['f-frequency'].value === 'custom' ? '' : 'none';
  }
  els['f-frequency'].addEventListener('change', toggleCustomDaysField);
  toggleCustomDaysField();
  els['f-nextdue'].value = TS.todayISO();

  function resetForm() {
    els['f-name'].value = '';
    els['f-amount'].value = '';
    els['f-category'].value = '';
    els['f-frequency'].value = 'yearly';
    els['f-customdays'].value = '';
    els['f-nextdue'].value = TS.todayISO();
    els['f-notes'].value = '';
    toggleCustomDaysField();
  }

  els['btn-add'].addEventListener('click', function () {
    var name = els['f-name'].value.trim();
    var nextDue = els['f-nextdue'].value;
    var frequency = els['f-frequency'].value;
    var customDays = parseInt(els['f-customdays'].value, 10) || 0;

    if (!name) { alert('Please enter a name for this renewal.'); els['f-name'].focus(); return; }
    if (!nextDue) { alert('Please set the next due date.'); els['f-nextdue'].focus(); return; }
    if (frequency === 'custom' && customDays <= 0) { alert('Please enter how many days between renewals.'); els['f-customdays'].focus(); return; }

    var list = loadRenewals();
    list.push({
      id: TS.uid(),
      name: name,
      amount: parseFloat(els['f-amount'].value) || 0,
      frequency: frequency,
      customDays: frequency === 'custom' ? customDays : null,
      nextDue: nextDue,
      category: els['f-category'].value.trim(),
      notes: els['f-notes'].value.trim()
    });
    saveRenewals(list);
    resetForm();
    render();
  });

  els['renewals-tbody'].addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-action]');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var action = btn.getAttribute('data-action');
    var list = loadRenewals();
    var idx = list.findIndex(function (r) { return r.id === id; });
    if (idx === -1) return;

    if (action === 'paid') {
      list[idx].nextDue = advanceNextDue(list[idx]);
      saveRenewals(list);
      render();
    } else if (action === 'delete') {
      if (confirm('Delete "' + list[idx].name + '"? This cannot be undone.')) {
        list.splice(idx, 1);
        saveRenewals(list);
        render();
      }
    }
  });

  render();
})();
