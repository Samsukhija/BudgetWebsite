(function () {
  'use strict';

  // ── shared schema, DO NOT change this key or shape. The CRM Pipeline tool
  // reads this exact localStorage key and object shape to look up contacts. ──
  var STORAGE_KEY = 'bw_tools_crm_contacts_v1';

  var TS = window.ToolsShared;

  var INTERACTION_TYPES = ['Call', 'Meeting', 'Email', 'WhatsApp', 'Note'];
  var TYPE_BADGE_CLASS = {
    Call: 'tool-badge-accent',
    Meeting: 'tool-badge-warn',
    Email: 'tool-badge-good',
    WhatsApp: 'tool-badge-good',
    Note: 'tool-badge-neutral'
  };

  var els = {};
  [
    'search', 'btn-export', 'btn-add-toggle',
    'add-panel', 'new-name', 'new-company', 'new-phone', 'new-email', 'new-tags', 'new-address', 'new-notes',
    'btn-save-new', 'btn-cancel-new',
    'contact-count', 'contacts-tbody', 'contacts-empty',
    'detail-panel', 'btn-close-detail',
    'd-name', 'd-company', 'd-phone', 'd-email', 'd-tags', 'd-address', 'd-notes',
    'btn-save-detail', 'detail-save-note', 'btn-delete-contact',
    'int-date', 'int-type', 'int-note', 'btn-add-interaction',
    'interactions-list', 'interactions-empty'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var contacts = TS.loadJSON(STORAGE_KEY, []);
  var selectedId = null;

  function persist() {
    TS.saveJSON(STORAGE_KEY, contacts);
  }

  function findContact(id) {
    for (var i = 0; i < contacts.length; i++) {
      if (contacts[i].id === id) return contacts[i];
    }
    return null;
  }

  function parseTags(raw) {
    return raw.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
  }

  // ── list rendering ──
  function matchesSearch(c, q) {
    if (!q) return true;
    q = q.toLowerCase();
    var haystack = [c.name, c.phone, c.company].concat(c.tags || []).join(' ').toLowerCase();
    return haystack.indexOf(q) !== -1;
  }

  function renderList() {
    var q = els['search'].value.trim();
    var filtered = contacts.filter(function (c) { return matchesSearch(c, q); });

    els['contact-count'].textContent = String(contacts.length);
    els['contacts-tbody'].innerHTML = '';

    if (contacts.length === 0) {
      els['contacts-empty'].style.display = '';
      els['contacts-empty'].textContent = 'No contacts yet. Click "+ Add Contact" to create your first one.';
      return;
    }
    if (filtered.length === 0) {
      els['contacts-empty'].style.display = '';
      els['contacts-empty'].textContent = 'No contacts match "' + q + '".';
      return;
    }
    els['contacts-empty'].style.display = 'none';

    filtered.forEach(function (c) {
      var tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', function () { openDetail(c.id); });
      var tagsHtml = (c.tags || []).map(function (t) {
        return '<span class="tool-badge tool-badge-neutral">' + TS.escapeHtml(t) + '</span>';
      }).join(' ');

      var tdName = document.createElement('td');
      var nameBtn = document.createElement('button');
      nameBtn.type = 'button';
      nameBtn.className = 'crm-contact-link';
      nameBtn.textContent = c.name || '(no name)';
      nameBtn.addEventListener('click', function () { openDetail(c.id); });
      tdName.appendChild(nameBtn);

      tr.appendChild(tdName);
      tr.innerHTML +=
        '<td>' + TS.escapeHtml(c.company || '-') + '</td>' +
        '<td>' + TS.escapeHtml(c.phone || '-') + '</td>' +
        '<td><div class="crm-tag-pills">' + (tagsHtml || '-') + '</div></td>' +
        '<td></td>';

      var tdView = tr.lastElementChild;
      var viewBtn = document.createElement('button');
      viewBtn.type = 'button';
      viewBtn.className = 'btn-ghost btn-sm';
      viewBtn.textContent = 'View';
      viewBtn.addEventListener('click', function () { openDetail(c.id); });
      tdView.appendChild(viewBtn);

      els['contacts-tbody'].appendChild(tr);
    });
  }

  // ── add contact ──
  function clearNewForm() {
    ['new-name', 'new-company', 'new-phone', 'new-email', 'new-tags', 'new-address', 'new-notes'].forEach(function (id) {
      els[id].value = '';
    });
  }

  els['btn-add-toggle'].addEventListener('click', function () {
    var showing = els['add-panel'].style.display !== 'none';
    if (showing) {
      els['add-panel'].style.display = 'none';
    } else {
      closeDetail();
      els['add-panel'].style.display = '';
      els['new-name'].focus();
    }
  });
  els['btn-cancel-new'].addEventListener('click', function () {
    clearNewForm();
    els['add-panel'].style.display = 'none';
  });
  els['btn-save-new'].addEventListener('click', function () {
    var name = els['new-name'].value.trim();
    if (!name) {
      alert('Name is required.');
      els['new-name'].focus();
      return;
    }
    var contact = {
      id: TS.uid(),
      name: name,
      phone: els['new-phone'].value.trim(),
      email: els['new-email'].value.trim(),
      company: els['new-company'].value.trim(),
      tags: parseTags(els['new-tags'].value),
      address: els['new-address'].value.trim(),
      notes: els['new-notes'].value.trim(),
      interactions: []
    };
    contacts.push(contact);
    persist();
    clearNewForm();
    els['add-panel'].style.display = 'none';
    renderList();
  });

  // ── search ──
  els['search'].addEventListener('input', renderList);

  // ── detail panel ──
  function openDetail(id) {
    var c = findContact(id);
    if (!c) return;
    selectedId = id;
    els['add-panel'].style.display = 'none';

    els['d-name'].value = c.name || '';
    els['d-company'].value = c.company || '';
    els['d-phone'].value = c.phone || '';
    els['d-email'].value = c.email || '';
    els['d-tags'].value = (c.tags || []).join(', ');
    els['d-address'].value = c.address || '';
    els['d-notes'].value = c.notes || '';
    els['detail-save-note'].textContent = '';
    els['int-date'].value = TS.todayISO();
    els['int-type'].value = 'Call';
    els['int-note'].value = '';

    els['detail-panel'].style.display = '';
    renderInteractions();
    els['detail-panel'].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function closeDetail() {
    selectedId = null;
    els['detail-panel'].style.display = 'none';
  }
  els['btn-close-detail'].addEventListener('click', closeDetail);

  function saveDetailFields() {
    var c = findContact(selectedId);
    if (!c) return;
    var name = els['d-name'].value.trim();
    if (!name) {
      els['detail-save-note'].textContent = 'Name is required, not saved.';
      return;
    }
    c.name = name;
    c.company = els['d-company'].value.trim();
    c.phone = els['d-phone'].value.trim();
    c.email = els['d-email'].value.trim();
    c.tags = parseTags(els['d-tags'].value);
    c.address = els['d-address'].value.trim();
    c.notes = els['d-notes'].value.trim();
    persist();
    renderList();
    els['detail-save-note'].textContent = 'Saved-' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  ['d-name', 'd-company', 'd-phone', 'd-email', 'd-tags', 'd-address', 'd-notes'].forEach(function (id) {
    els[id].addEventListener('blur', saveDetailFields);
  });
  els['btn-save-detail'].addEventListener('click', saveDetailFields);

  els['btn-delete-contact'].addEventListener('click', function () {
    var c = findContact(selectedId);
    if (!c) return;
    if (!confirm('Delete "' + c.name + '"? This cannot be undone.')) return;
    // Note: any CRM Pipeline deals referencing this contact keep a denormalized
    // contactName snapshot on the deal itself, so deleting a contact here does
    // not break existing pipeline records.
    contacts = contacts.filter(function (x) { return x.id !== c.id; });
    persist();
    closeDetail();
    renderList();
  });

  // ── interactions ──
  function renderInteractions() {
    var c = findContact(selectedId);
    if (!c) return;
    var list = (c.interactions || []).slice().sort(function (a, b) {
      // newest first: by date, then by id (id is time-prefixed via TS.uid()) as a tiebreaker
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.id < b.id ? 1 : -1;
    });

    els['interactions-list'].innerHTML = '';
    if (list.length === 0) {
      els['interactions-empty'].style.display = '';
      els['interactions-list'].style.display = 'none';
      return;
    }
    els['interactions-empty'].style.display = 'none';
    els['interactions-list'].style.display = '';

    list.forEach(function (it) {
      var row = document.createElement('div');
      row.className = 'crm-interaction-item';

      var dateEl = document.createElement('div');
      dateEl.className = 'crm-interaction-date';
      dateEl.textContent = TS.formatDateDisplay(it.date);

      var badgeEl = document.createElement('span');
      badgeEl.className = 'tool-badge ' + (TYPE_BADGE_CLASS[it.type] || 'tool-badge-neutral');
      badgeEl.textContent = it.type;

      var noteEl = document.createElement('div');
      noteEl.className = 'crm-interaction-note';
      noteEl.textContent = it.note || '';

      var removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'crm-interaction-remove';
      removeBtn.title = 'Remove this interaction';
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', function () {
        var cc = findContact(selectedId);
        if (!cc) return;
        cc.interactions = (cc.interactions || []).filter(function (x) { return x.id !== it.id; });
        persist();
        renderInteractions();
      });

      row.appendChild(dateEl);
      row.appendChild(badgeEl);
      row.appendChild(noteEl);
      row.appendChild(removeBtn);
      els['interactions-list'].appendChild(row);
    });
  }

  els['btn-add-interaction'].addEventListener('click', function () {
    var c = findContact(selectedId);
    if (!c) return;
    var date = els['int-date'].value || TS.todayISO();
    var type = els['int-type'].value;
    if (INTERACTION_TYPES.indexOf(type) === -1) type = 'Note';
    var note = els['int-note'].value.trim();
    if (!note) {
      alert('Add a note describing this interaction.');
      els['int-note'].focus();
      return;
    }
    c.interactions = c.interactions || [];
    c.interactions.push({ id: TS.uid(), date: date, type: type, note: note });
    persist();
    els['int-note'].value = '';
    renderInteractions();
  });

  // ── export ──
  els['btn-export'].addEventListener('click', function () {
    if (contacts.length === 0) {
      alert('No contacts to export yet.');
      return;
    }
    // Flattened CSV, intentionally excludes interactions (they're a nested
    // history list, not a flat field; view a contact to see them).
    var headers = [
      { key: 'name', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'company', label: 'Company' },
      { key: 'tags', label: 'Tags' },
      { key: 'address', label: 'Address' },
      { key: 'notes', label: 'Notes' }
    ];
    var rows = contacts.map(function (c) {
      return {
        name: c.name, phone: c.phone, email: c.email, company: c.company,
        tags: (c.tags || []).join('; '), address: c.address, notes: c.notes
      };
    });
    TS.downloadCSV('crm-contacts-' + TS.todayISO() + '.csv', headers, rows);
  });

  renderList();
})();
