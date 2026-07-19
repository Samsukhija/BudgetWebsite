(function () {
  'use strict';

  var TS = window.ToolsShared;
  var STORE_KEY = 'bw_tools_vendors_v1';

  var els = {};
  [
    'f-id', 'f-name', 'f-contact-person', 'f-phone', 'f-email', 'f-address',
    'f-category', 'f-terms', 'f-outstanding', 'f-notes',
    'form-title', 'btn-save', 'btn-cancel',
    'f-search', 'f-sort', 'btn-export',
    'vendor-rows', 'vendor-empty', 'vendor-table',
    'stat-count', 'stat-outstanding'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var vendors = TS.loadJSON(STORE_KEY, []);
  var editingId = null;

  function save() {
    TS.saveJSON(STORE_KEY, vendors);
  }

  function clearForm() {
    editingId = null;
    els['f-id'].value = '';
    els['f-name'].value = '';
    els['f-contact-person'].value = '';
    els['f-phone'].value = '';
    els['f-email'].value = '';
    els['f-address'].value = '';
    els['f-category'].value = '';
    els['f-terms'].value = '';
    els['f-outstanding'].value = '0';
    els['f-notes'].value = '';
    els['form-title'].textContent = '+ Add Vendor';
    els['btn-save'].textContent = '+ Add Vendor';
    els['btn-cancel'].style.display = 'none';
  }

  function startEdit(id) {
    var v = vendors.find(function (x) { return x.id === id; });
    if (!v) return;
    editingId = id;
    els['f-id'].value = v.id;
    els['f-name'].value = v.name || '';
    els['f-contact-person'].value = v.contactPerson || '';
    els['f-phone'].value = v.phone || '';
    els['f-email'].value = v.email || '';
    els['f-address'].value = v.address || '';
    els['f-category'].value = v.category || '';
    els['f-terms'].value = v.paymentTerms || '';
    els['f-outstanding'].value = v.outstanding != null ? v.outstanding : 0;
    els['f-notes'].value = v.notes || '';
    els['form-title'].textContent = 'Edit Vendor';
    els['btn-save'].textContent = 'Save Changes';
    els['btn-cancel'].style.display = '';
    els['f-name'].scrollIntoView({ behavior: 'smooth', block: 'center' });
    els['f-name'].focus();
  }

  function onSave() {
    var name = els['f-name'].value.trim();
    if (!name) {
      alert('Vendor name is required.');
      els['f-name'].focus();
      return;
    }
    var outstanding = parseFloat(els['f-outstanding'].value);
    if (isNaN(outstanding)) outstanding = 0;

    var record = {
      id: editingId || TS.uid(),
      name: name,
      contactPerson: els['f-contact-person'].value.trim(),
      phone: els['f-phone'].value.trim(),
      email: els['f-email'].value.trim(),
      address: els['f-address'].value.trim(),
      category: els['f-category'].value.trim(),
      paymentTerms: els['f-terms'].value.trim(),
      outstanding: outstanding,
      notes: els['f-notes'].value.trim()
    };

    if (editingId) {
      var idx = vendors.findIndex(function (x) { return x.id === editingId; });
      if (idx !== -1) vendors[idx] = record;
    } else {
      vendors.push(record);
    }

    save();
    clearForm();
    render();
  }

  function onDelete(id) {
    var v = vendors.find(function (x) { return x.id === id; });
    if (!v) return;
    if (!confirm('Delete vendor "' + v.name + '"? This cannot be undone.')) return;
    vendors = vendors.filter(function (x) { return x.id !== id; });
    save();
    if (editingId === id) clearForm();
    render();
  }

  function getFilteredSorted() {
    var q = els['f-search'].value.trim().toLowerCase();
    var sort = els['f-sort'].value;

    var list = vendors.slice();
    if (q) {
      list = list.filter(function (v) {
        return (v.name || '').toLowerCase().indexOf(q) !== -1 ||
          (v.contactPerson || '').toLowerCase().indexOf(q) !== -1 ||
          (v.category || '').toLowerCase().indexOf(q) !== -1;
      });
    }

    if (sort === 'outstanding') {
      list.sort(function (a, b) { return (b.outstanding || 0) - (a.outstanding || 0); });
    } else {
      list.sort(function (a, b) { return (a.name || '').localeCompare(b.name || ''); });
    }

    return list;
  }

  function renderStats() {
    var totalOutstanding = vendors.reduce(function (sum, v) { return sum + (v.outstanding || 0); }, 0);
    els['stat-count'].textContent = String(vendors.length);
    els['stat-outstanding'].textContent = TS.formatMoney(totalOutstanding);
  }

  function renderTable() {
    var list = getFilteredSorted();
    var tbody = els['vendor-rows'];
    tbody.innerHTML = '';

    if (vendors.length === 0) {
      els['vendor-table'].style.display = 'none';
      els['vendor-empty'].style.display = '';
      els['vendor-empty'].textContent = 'No vendors yet. Add your first one above.';
      return;
    }
    if (list.length === 0) {
      els['vendor-table'].style.display = 'none';
      els['vendor-empty'].style.display = '';
      els['vendor-empty'].textContent = 'No vendors match your search.';
      return;
    }
    els['vendor-table'].style.display = '';
    els['vendor-empty'].style.display = 'none';

    list.forEach(function (v) {
      var tr = document.createElement('tr');
      var outstandingBadge = (v.outstanding || 0) > 0
        ? '<span class="tool-badge tool-badge-warn">' + TS.escapeHtml(TS.formatMoney(v.outstanding)) + '</span>'
        : TS.escapeHtml(TS.formatMoney(v.outstanding || 0));

      tr.innerHTML =
        '<td class="vt-cell-truncate" title="' + TS.escapeHtml(v.name) + '">' + TS.escapeHtml(v.name || '-') + '</td>' +
        '<td class="vt-cell-truncate" title="' + TS.escapeHtml(v.contactPerson || '') + '">' + TS.escapeHtml(v.contactPerson || '-') + '</td>' +
        '<td>' + TS.escapeHtml(v.phone || '-') + '</td>' +
        '<td class="vt-cell-truncate" title="' + TS.escapeHtml(v.category || '') + '">' + TS.escapeHtml(v.category || '-') + '</td>' +
        '<td>' + TS.escapeHtml(v.paymentTerms || '-') + '</td>' +
        '<td>' + outstandingBadge + '</td>' +
        '<td><div class="vt-row-actions">' +
          '<button type="button" class="btn-ghost btn-sm" data-action="edit" data-id="' + v.id + '">Edit</button>' +
          '<button type="button" class="btn-danger" data-action="delete" data-id="' + v.id + '">Delete</button>' +
        '</div></td>';
      tbody.appendChild(tr);
    });
  }

  function render() {
    renderStats();
    renderTable();
  }

  function onExport() {
    if (vendors.length === 0) {
      alert('No vendors to export yet.');
      return;
    }
    var headers = [
      { key: 'name', label: 'Name' },
      { key: 'contactPerson', label: 'Contact Person' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'address', label: 'Address' },
      { key: 'category', label: 'Category' },
      { key: 'paymentTerms', label: 'Payment Terms' },
      { key: 'outstanding', label: 'Outstanding' },
      { key: 'notes', label: 'Notes' }
    ];
    var list = getFilteredSorted();
    TS.downloadCSV('vendors.csv', headers, list);
  }

  els['btn-save'].addEventListener('click', onSave);
  els['btn-cancel'].addEventListener('click', clearForm);
  els['f-search'].addEventListener('input', renderTable);
  els['f-sort'].addEventListener('change', renderTable);
  els['btn-export'].addEventListener('click', onExport);
  els['vendor-rows'].addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-action]');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var action = btn.getAttribute('data-action');
    if (action === 'edit') startEdit(id);
    else if (action === 'delete') onDelete(id);
  });

  render();
})();
