(function () {
  'use strict';

  var TS = window.ToolsShared;
  var STORAGE_KEY = 'bw_tools_leads_v1';
  var STATUSES = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];

  var els = {};
  [
    'lt-stats', 'lt-name', 'lt-phone', 'lt-source', 'lt-next', 'lt-notes', 'lt-add-btn',
    'lt-filter-status', 'lt-search', 'lt-export-btn', 'lt-tbody', 'lt-table', 'lt-empty'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var leads = TS.loadJSON(STORAGE_KEY, []);

  function save() {
    TS.saveJSON(STORAGE_KEY, leads);
  }

  function getFiltered() {
    var statusFilter = els['lt-filter-status'].value;
    var q = els['lt-search'].value.trim().toLowerCase();
    return leads.filter(function (l) {
      if (statusFilter && l.status !== statusFilter) return false;
      if (!q) return true;
      var haystack = ((l.name || '') + ' ' + (l.phone || '') + ' ' + (l.notes || '')).toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
  }

  function isOverdue(lead) {
    if (!lead.nextFollowUp) return false;
    if (lead.status === 'Won' || lead.status === 'Lost') return false;
    return lead.nextFollowUp < TS.todayISO();
  }

  function renderStats() {
    var counts = { New: 0, Contacted: 0, Quoted: 0, Won: 0, Lost: 0 };
    leads.forEach(function (l) {
      if (counts[l.status] != null) counts[l.status]++;
    });
    els['lt-stats'].innerHTML = STATUSES.map(function (s) {
      return '<div class="tool-stat-card">' +
        '<div class="tool-stat-label">' + s + '</div>' +
        '<div class="tool-stat-value">' + counts[s] + '</div>' +
        '</div>';
    }).join('');
  }

  function renderTable() {
    var filtered = getFiltered();

    if (leads.length === 0) {
      els['lt-table'].style.display = 'none';
      els['lt-empty'].style.display = '';
      els['lt-empty'].textContent = 'No leads yet, add your first inquiry above.';
      return;
    }
    if (filtered.length === 0) {
      els['lt-table'].style.display = 'none';
      els['lt-empty'].style.display = '';
      els['lt-empty'].textContent = 'No leads match your filter/search.';
      return;
    }
    els['lt-table'].style.display = '';
    els['lt-empty'].style.display = 'none';

    els['lt-tbody'].innerHTML = filtered.map(function (l) {
      var overdue = isOverdue(l);
      var nextDisplay = l.nextFollowUp ? TS.formatDateDisplay(l.nextFollowUp) : '-';
      var statusOptions = STATUSES.map(function (s) {
        return '<option value="' + s + '"' + (s === l.status ? ' selected' : '') + '>' + s + '</option>';
      }).join('');

      return '<tr data-id="' + l.id + '">' +
        '<td>' + TS.escapeHtml(l.name || '-') + '</td>' +
        '<td class="lt-phone-cell">' + TS.escapeHtml(l.phone || '-') + '</td>' +
        '<td>' + TS.escapeHtml(l.source || '-') + '</td>' +
        '<td><select class="lt-status-select lt-status-' + l.status + '" data-action="status">' + statusOptions + '</select></td>' +
        '<td class="' + (overdue ? 'lt-overdue' : '') + '">' + nextDisplay + (overdue ? ' ⚠' : '') + '</td>' +
        '<td class="lt-notes-cell" title="' + TS.escapeHtml(l.notes || '') + '">' + TS.escapeHtml(l.notes || '-') + '</td>' +
        '<td><button type="button" class="btn-danger btn-sm" data-action="delete">Delete</button></td>' +
        '</tr>';
    }).join('');
  }

  function renderAll() {
    renderStats();
    renderTable();
  }

  function addLead() {
    var name = els['lt-name'].value.trim();
    var phone = els['lt-phone'].value.trim();
    if (!name && !phone) {
      alert('Enter at least a name or phone number for the lead.');
      return;
    }
    var lead = {
      id: TS.uid(),
      name: name,
      phone: phone,
      source: els['lt-source'].value,
      status: 'New',
      nextFollowUp: els['lt-next'].value || '',
      notes: els['lt-notes'].value.trim(),
      createdAt: new Date().toISOString()
    };
    leads.unshift(lead);
    save();

    els['lt-name'].value = '';
    els['lt-phone'].value = '';
    els['lt-source'].value = 'Referral';
    els['lt-next'].value = '';
    els['lt-notes'].value = '';
    els['lt-name'].focus();

    renderAll();
  }

  function exportCSV() {
    var rows = getFiltered().map(function (l) {
      return {
        name: l.name || '',
        phone: l.phone || '',
        source: l.source || '',
        status: l.status || '',
        nextFollowUp: l.nextFollowUp || '',
        notes: l.notes || '',
        createdAt: l.createdAt || ''
      };
    });
    var headers = [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'source', label: 'Source' },
      { key: 'status', label: 'Status' },
      { key: 'nextFollowUp', label: 'Next Follow-up' },
      { key: 'notes', label: 'Notes' },
      { key: 'createdAt', label: 'Created At' }
    ];
    TS.downloadCSV('leads-' + TS.todayISO() + '.csv', headers, rows);
  }

  els['lt-tbody'].addEventListener('change', function (e) {
    var select = e.target.closest('select[data-action="status"]');
    if (!select) return;
    var tr = select.closest('tr');
    var id = tr.getAttribute('data-id');
    var lead = leads.find(function (l) { return l.id === id; });
    if (!lead) return;
    lead.status = select.value;
    save();
    renderAll();
  });

  els['lt-tbody'].addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-action="delete"]');
    if (!btn) return;
    var tr = btn.closest('tr');
    var id = tr.getAttribute('data-id');
    var lead = leads.find(function (l) { return l.id === id; });
    if (!lead) return;
    if (!confirm('Delete lead "' + (lead.name || lead.phone || 'this entry') + '"? This cannot be undone.')) return;
    leads = leads.filter(function (l) { return l.id !== id; });
    save();
    renderAll();
  });

  els['lt-add-btn'].addEventListener('click', addLead);
  els['lt-filter-status'].addEventListener('change', renderTable);
  els['lt-search'].addEventListener('input', renderTable);
  els['lt-export-btn'].addEventListener('click', exportCSV);

  renderAll();
})();
