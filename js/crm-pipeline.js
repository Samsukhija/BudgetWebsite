(function () {
  'use strict';

  var TS = window.ToolsShared;
  var OWN_KEY = 'bw_tools_crm_pipeline_v1';
  var CONTACTS_KEY = 'bw_tools_crm_contacts_v1'; // owned by CRM Contacts tool — READ ONLY here

  var STAGES = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];

  var els = {};
  [
    'stat-pipeline-value', 'stat-deal-count', 'stat-won-month',
    'btn-new-deal', 'kanban-empty', 'kanban-board',
    'deal-modal-overlay', 'deal-modal-title',
    'f-title', 'contact-picker-wrap', 'f-contact', 'contact-hint',
    'f-name-fallback-wrap', 'f-contact-name-freetext',
    'f-value', 'f-expected-close', 'f-stage', 'f-notes',
    'btn-delete-deal', 'btn-cancel-deal', 'btn-save-deal'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var editingId = null; // id of deal currently open in the modal, null = creating new

  // ── data access ──
  function loadDeals() { return TS.loadJSON(OWN_KEY, []); }
  function saveDeals(deals) { TS.saveJSON(OWN_KEY, deals); }
  function loadContacts() {
    var c = TS.loadJSON(CONTACTS_KEY, []);
    return Array.isArray(c) ? c : [];
  }
  function contactLabel(c) {
    var name = (c.name || 'Unnamed contact').trim() || 'Unnamed contact';
    return c.company ? name + ' — ' + c.company : name;
  }

  // ── stats ──
  function renderStats(deals) {
    var pipelineValue = 0;
    deals.forEach(function (d) {
      if (d.stage !== 'Lost') pipelineValue += Number(d.value) || 0;
    });

    var now = new Date();
    var curYear = now.getFullYear(), curMonth = now.getMonth();
    var wonThisMonth = 0;
    deals.forEach(function (d) {
      if (d.stage !== 'Won' || !d.wonAt) return;
      var parts = String(d.wonAt).split('-');
      if (parts.length < 2) return;
      var y = parseInt(parts[0], 10), m = parseInt(parts[1], 10) - 1;
      if (y === curYear && m === curMonth) wonThisMonth += Number(d.value) || 0;
    });

    els['stat-pipeline-value'].textContent = TS.formatMoneyWhole(pipelineValue);
    els['stat-deal-count'].textContent = String(deals.length);
    els['stat-won-month'].textContent = TS.formatMoneyWhole(wonThisMonth);
  }

  // ── board rendering ──
  function renderBoard(deals) {
    var board = els['kanban-board'];
    board.innerHTML = '';
    els['kanban-empty'].style.display = deals.length === 0 ? '' : 'none';
    board.style.display = deals.length === 0 ? 'none' : '';

    STAGES.forEach(function (stage) {
      var stageDeals = deals.filter(function (d) { return d.stage === stage; });
      var sum = stageDeals.reduce(function (a, d) { return a + (Number(d.value) || 0); }, 0);

      var col = document.createElement('div');
      col.className = 'tool-kanban-col';
      col.dataset.stage = stage;

      var title = document.createElement('div');
      title.className = 'tool-kanban-col-title';
      title.innerHTML = '<span>' + TS.escapeHtml(stage) + '</span>' +
        '<span class="tool-kanban-col-sum">' + stageDeals.length + ' · ' + TS.formatMoneyWhole(sum) + '</span>';
      col.appendChild(title);

      if (stageDeals.length === 0) {
        var emptyNote = document.createElement('div');
        emptyNote.className = 'tool-empty';
        emptyNote.style.padding = '16px 4px';
        emptyNote.style.fontSize = 'calc(11.5px * var(--font-scale))';
        emptyNote.textContent = 'No deals here.';
        col.appendChild(emptyNote);
      } else {
        stageDeals.forEach(function (deal) { col.appendChild(buildCard(deal)); });
      }

      wireColumnDrop(col);
      board.appendChild(col);
    });
  }

  function buildCard(deal) {
    var card = document.createElement('div');
    card.className = 'tool-kanban-card';
    card.draggable = true;
    card.dataset.id = deal.id;

    var titleEl = document.createElement('div');
    titleEl.className = 'tool-kanban-card-title';
    titleEl.textContent = deal.title || '(untitled deal)';
    card.appendChild(titleEl);

    var contactEl = document.createElement('div');
    contactEl.className = 'tool-kanban-card-meta';
    contactEl.textContent = deal.contactName || 'No contact';
    card.appendChild(contactEl);

    var valueEl = document.createElement('div');
    valueEl.className = 'tool-kanban-card-value';
    valueEl.textContent = TS.formatMoney(Number(deal.value) || 0);
    card.appendChild(valueEl);

    if (deal.expectedClose) {
      var closeEl = document.createElement('div');
      closeEl.className = 'tool-kanban-card-meta';
      closeEl.textContent = 'Close: ' + TS.formatDateDisplay(deal.expectedClose);
      card.appendChild(closeEl);
    }

    var select = document.createElement('select');
    select.className = 'tool-kanban-card-select';
    STAGES.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s; opt.textContent = 'Move to: ' + s;
      if (s === deal.stage) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('click', function (e) { e.stopPropagation(); });
    select.addEventListener('change', function (e) {
      e.stopPropagation();
      moveDealToStage(deal.id, select.value);
    });
    card.appendChild(select);

    card.addEventListener('click', function () { openEditModal(deal.id); });

    card.addEventListener('dragstart', function (e) {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', deal.id);
      e.dataTransfer.effectAllowed = 'move';
    });
    card.addEventListener('dragend', function () {
      card.classList.remove('dragging');
    });

    return card;
  }

  function wireColumnDrop(col) {
    col.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', function () {
      col.classList.remove('drag-over');
    });
    col.addEventListener('drop', function (e) {
      e.preventDefault();
      col.classList.remove('drag-over');
      var id = e.dataTransfer.getData('text/plain');
      if (id) moveDealToStage(id, col.dataset.stage);
    });
  }

  function moveDealToStage(id, newStage) {
    var deals = loadDeals();
    var deal = deals.find(function (d) { return d.id === id; });
    if (!deal || deal.stage === newStage) return;
    if (newStage === 'Won' && deal.stage !== 'Won') {
      deal.wonAt = TS.todayISO();
    }
    deal.stage = newStage;
    saveDeals(deals);
    refresh();
  }

  function refresh() {
    var deals = loadDeals();
    renderStats(deals);
    renderBoard(deals);
  }

  // ── contact picker ──
  function setupContactPicker(selectedContactId, freetextValue) {
    var contacts = loadContacts();
    var select = els['f-contact'];
    select.innerHTML = '';

    if (contacts.length === 0) {
      els['contact-picker-wrap'].querySelector('label').style.display = 'none';
      els['contact-hint'].style.display = '';
      els['contact-hint'].textContent = 'No contacts yet — add one in the CRM Contacts tool first.';
      els['f-name-fallback-wrap'].style.display = '';
      els['f-contact-name-freetext'].disabled = false;
      els['f-contact-name-freetext'].value = freetextValue || '';
      return;
    }

    els['contact-picker-wrap'].querySelector('label').style.display = '';
    els['contact-hint'].style.display = 'none';
    els['f-name-fallback-wrap'].style.display = '';

    var opt0 = document.createElement('option');
    opt0.value = '';
    opt0.textContent = '— Type a name instead —';
    select.appendChild(opt0);
    contacts.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = contactLabel(c);
      select.appendChild(opt);
    });

    var matched = selectedContactId && contacts.some(function (c) { return c.id === selectedContactId; });
    select.value = matched ? selectedContactId : '';

    function syncFreetextState() {
      var picked = select.value !== '';
      els['f-contact-name-freetext'].disabled = picked;
      if (picked) {
        els['f-contact-name-freetext'].value = '';
        els['f-contact-name-freetext'].placeholder = 'Using selected contact';
      } else {
        els['f-contact-name-freetext'].placeholder = 'Contact / company name';
      }
    }
    select.onchange = syncFreetextState;
    els['f-contact-name-freetext'].value = matched ? '' : (freetextValue || '');
    syncFreetextState();
  }

  // ── modal ──
  function openNewModal() {
    editingId = null;
    els['deal-modal-title'].textContent = 'New Deal';
    els['btn-delete-deal'].style.display = 'none';
    els['f-title'].value = '';
    els['f-value'].value = '';
    els['f-expected-close'].value = '';
    els['f-stage'].value = 'New';
    els['f-notes'].value = '';
    setupContactPicker(null, '');
    showModal();
  }

  function openEditModal(id) {
    var deals = loadDeals();
    var deal = deals.find(function (d) { return d.id === id; });
    if (!deal) return;
    editingId = id;
    els['deal-modal-title'].textContent = 'Edit Deal';
    els['btn-delete-deal'].style.display = '';
    els['f-title'].value = deal.title || '';
    els['f-value'].value = deal.value != null ? deal.value : '';
    els['f-expected-close'].value = deal.expectedClose || '';
    els['f-stage'].value = deal.stage || 'New';
    els['f-notes'].value = deal.notes || '';
    setupContactPicker(deal.contactId, deal.contactName || '');
    showModal();
  }

  function showModal() { els['deal-modal-overlay'].classList.add('open'); }
  function hideModal() { els['deal-modal-overlay'].classList.remove('open'); editingId = null; }

  function saveModal() {
    var title = els['f-title'].value.trim();
    if (!title) { alert('Please enter a deal title.'); els['f-title'].focus(); return; }

    var value = parseFloat(els['f-value'].value);
    if (isNaN(value) || value < 0) value = 0;

    var contacts = loadContacts();
    // The select only holds a meaningful value when contacts exist (otherwise it's empty/hidden).
    var contactId = contacts.length === 0 ? '' : (els['f-contact'].value || '');

    var contactName = '';
    if (contactId) {
      var c = contacts.find(function (x) { return x.id === contactId; });
      contactName = c ? contactLabel(c) : els['f-contact-name-freetext'].value.trim();
    } else {
      contactName = els['f-contact-name-freetext'].value.trim();
    }
    if (!contactId && !contactName) contactName = '(no contact)';

    var stage = els['f-stage'].value;
    if (STAGES.indexOf(stage) === -1) stage = 'New';

    var deals = loadDeals();

    if (editingId) {
      var deal = deals.find(function (d) { return d.id === editingId; });
      if (!deal) { hideModal(); return; }
      if (stage === 'Won' && deal.stage !== 'Won') deal.wonAt = TS.todayISO();
      deal.title = title;
      deal.contactId = contactId || null;
      deal.contactName = contactName;
      deal.value = value;
      deal.stage = stage;
      deal.expectedClose = els['f-expected-close'].value || '';
      deal.notes = els['f-notes'].value.trim();
    } else {
      var newDeal = {
        id: TS.uid(),
        title: title,
        contactId: contactId || null,
        contactName: contactName,
        value: value,
        stage: stage,
        expectedClose: els['f-expected-close'].value || '',
        notes: els['f-notes'].value.trim()
      };
      if (stage === 'Won') newDeal.wonAt = TS.todayISO();
      deals.push(newDeal);
    }

    saveDeals(deals);
    hideModal();
    refresh();
  }

  function deleteModal() {
    if (!editingId) return;
    if (!confirm('Delete this deal? This cannot be undone.')) return;
    var deals = loadDeals().filter(function (d) { return d.id !== editingId; });
    saveDeals(deals);
    hideModal();
    refresh();
  }

  // ── wire up ──
  els['btn-new-deal'].addEventListener('click', openNewModal);
  els['btn-cancel-deal'].addEventListener('click', hideModal);
  els['btn-save-deal'].addEventListener('click', saveModal);
  els['btn-delete-deal'].addEventListener('click', deleteModal);
  els['deal-modal-overlay'].addEventListener('click', function (e) {
    if (e.target === els['deal-modal-overlay']) hideModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && els['deal-modal-overlay'].classList.contains('open')) hideModal();
  });

  refresh();
})();
