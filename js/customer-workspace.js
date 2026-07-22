/* /app/customer/ — the Customer Pack workspace. Unifies what the five free
   CRM/lead/reminder tools each keep as their own disconnected list (crm-contacts,
   crm-pipeline, lead-tracker, follow-up-reminder, renewal-reminder) into ONE
   customer record: contact + pipeline stage + follow-up date + renewal date,
   all on the same object. Adds a "Due Today" view across both date fields at
   once, which no single free tool can show. Local-first: no backend yet, same
   localStorage pattern as the rest of the site. Own storage key
   (bw_pack_customers_v1) — deliberately does NOT read/write the free tools'
   separate keys, this is a new unified record, not a merge of the old ones. */
(function () {
  'use strict';

  var TS = window.ToolsShared;

  // ── entitlement gate ──
  var user = window.BWAuth ? BWAuth.currentUser() : null;
  if (!user) { location.href = '/app/'; return; }
  if (!BWEntitlement.has(user.email, 'customer')) { location.href = '/app/'; return; }

  var CUST_KEY = 'bw_pack_customers_v1';
  var STAGES = ['New', 'Contacted', 'Quoted', 'Won', 'Lost'];
  var STAGE_BADGE = {
    New: 'tool-badge-neutral', Contacted: 'tool-badge-accent', Quoted: 'tool-badge-warn',
    Won: 'tool-badge-good', Lost: 'tool-badge-bad'
  };

  var els = {};
  [
    'cust-stats', 'cs-search', 'btn-new-cust', 'cs-table-body', 'cs-empty',
    'cs-list-view', 'cs-form-view', 'cf-title',
    'cf-name', 'cf-phone', 'cf-company', 'cf-source', 'cf-stage', 'cf-value',
    'cf-followup', 'cf-renewal', 'cf-notes', 'cf-save', 'cf-cancel', 'cf-delete',
    'pipeline-board', 'pipeline-empty',
    'due-followups-body', 'due-followups-empty', 'due-renewals-body', 'due-renewals-empty',
    'hdr-biz'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var editingId = null; // id of customer currently open in the form, null = creating new

  // ── data access ──
  function loadCustomers() { return TS.loadJSON(CUST_KEY, []); }
  function saveCustomers(list) { TS.saveJSON(CUST_KEY, list); }
  function findCustomer(id) {
    return loadCustomers().filter(function (c) { return c.id === id; })[0] || null;
  }

  function addDaysISO(iso, days) {
    var base = iso ? new Date(iso + 'T00:00:00') : new Date();
    if (isNaN(base.getTime())) base = new Date();
    base.setDate(base.getDate() + days);
    return base.getFullYear() + '-' + String(base.getMonth() + 1).padStart(2, '0') + '-' + String(base.getDate()).padStart(2, '0');
  }

  // ═══════════════════ tabs ═══════════════════
  document.querySelectorAll('.billing-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.billing-tab').forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.getElementById('tab-customers').hidden = btn.dataset.tab !== 'customers';
      document.getElementById('tab-pipeline').hidden = btn.dataset.tab !== 'pipeline';
      document.getElementById('tab-due').hidden = btn.dataset.tab !== 'due';
      if (btn.dataset.tab === 'pipeline') renderPipeline();
      if (btn.dataset.tab === 'due') renderDueToday();
    });
  });

  function showCustView(which) {
    els['cs-list-view'].hidden = which !== 'list';
    els['cs-form-view'].hidden = which !== 'form';
  }

  // ═══════════════════ ALL CUSTOMERS ═══════════════════
  function matchesSearch(c, q) {
    if (!q) return true;
    q = q.toLowerCase();
    return [c.name, c.phone, c.company].join(' ').toLowerCase().indexOf(q) !== -1;
  }

  function renderCustomerTable() {
    var all = loadCustomers();
    var q = els['cs-search'].value.trim();
    var filtered = all.filter(function (c) { return matchesSearch(c, q); });

    els['cs-table-body'].innerHTML = filtered.map(function (c) {
      return '<tr data-id="' + c.id + '">' +
        '<td>' + TS.escapeHtml(c.name || '(no name)') + '</td>' +
        '<td>' + TS.escapeHtml(c.phone || '-') + '</td>' +
        '<td>' + TS.escapeHtml(c.company || '-') + '</td>' +
        '<td><span class="tool-badge ' + (STAGE_BADGE[c.stage] || 'tool-badge-neutral') + '">' + TS.escapeHtml(c.stage || 'New') + '</span></td>' +
        '<td>' + (c.followUpDate ? TS.escapeHtml(TS.formatDateDisplay(c.followUpDate)) : '-') + '</td>' +
        '<td>' + (c.renewalDate ? TS.escapeHtml(TS.formatDateDisplay(c.renewalDate)) : '-') + '</td>' +
        '<td><button type="button" class="btn-ghost btn-sm cs-edit-btn" data-id="' + c.id + '">View / Edit</button></td>' +
        '</tr>';
    }).join('');

    if (all.length === 0) {
      els['cs-empty'].hidden = false;
      els['cs-empty'].textContent = 'No customers yet. Click "+ New Customer" to add your first one.';
    } else if (filtered.length === 0) {
      els['cs-empty'].hidden = false;
      els['cs-empty'].textContent = 'No customers match "' + q + '".';
    } else {
      els['cs-empty'].hidden = true;
    }

    els['cs-table-body'].querySelectorAll('.cs-edit-btn').forEach(function (b) {
      b.addEventListener('click', function () { openEditCustomerForm(b.dataset.id); });
    });

    renderStats();
  }

  function openNewCustomerForm() {
    editingId = null;
    els['cf-title'].textContent = 'New Customer';
    els['cf-delete'].hidden = true;
    els['cf-name'].value = '';
    els['cf-phone'].value = '';
    els['cf-company'].value = '';
    els['cf-source'].value = 'Referral';
    els['cf-stage'].value = 'New';
    els['cf-value'].value = '';
    els['cf-followup'].value = '';
    els['cf-renewal'].value = '';
    els['cf-notes'].value = '';
    showCustView('form');
    els['cf-name'].focus();
  }

  function openEditCustomerForm(id) {
    var c = findCustomer(id);
    if (!c) return;
    editingId = id;
    els['cf-title'].textContent = 'Edit Customer';
    els['cf-delete'].hidden = false;
    els['cf-name'].value = c.name || '';
    els['cf-phone'].value = c.phone || '';
    els['cf-company'].value = c.company || '';
    els['cf-source'].value = c.source || 'Referral';
    els['cf-stage'].value = c.stage || 'New';
    els['cf-value'].value = c.value != null ? c.value : '';
    els['cf-followup'].value = c.followUpDate || '';
    els['cf-renewal'].value = c.renewalDate || '';
    els['cf-notes'].value = c.notes || '';
    showCustView('form');
  }

  function saveCustomerFromForm() {
    var name = els['cf-name'].value.trim();
    if (!name) { alert('Please enter a name.'); els['cf-name'].focus(); return; }
    var value = parseFloat(els['cf-value'].value);
    if (isNaN(value) || value < 0) value = 0;
    var stage = els['cf-stage'].value;
    if (STAGES.indexOf(stage) === -1) stage = 'New';

    var all = loadCustomers();

    if (editingId) {
      var c = all.filter(function (x) { return x.id === editingId; })[0];
      if (!c) { showCustView('list'); return; }
      c.name = name;
      c.phone = els['cf-phone'].value.trim();
      c.company = els['cf-company'].value.trim();
      c.source = els['cf-source'].value;
      c.stage = stage;
      c.value = value;
      c.followUpDate = els['cf-followup'].value || '';
      c.renewalDate = els['cf-renewal'].value || '';
      c.notes = els['cf-notes'].value.trim();
    } else {
      all.push({
        id: TS.uid(),
        name: name,
        phone: els['cf-phone'].value.trim(),
        company: els['cf-company'].value.trim(),
        source: els['cf-source'].value,
        stage: stage,
        value: value,
        followUpDate: els['cf-followup'].value || '',
        renewalDate: els['cf-renewal'].value || '',
        notes: els['cf-notes'].value.trim(),
        createdAt: Date.now()
      });
    }

    saveCustomers(all);
    showCustView('list');
    renderCustomerTable();
  }

  function deleteCustomer() {
    if (!editingId) return;
    var c = findCustomer(editingId);
    if (!c) return;
    if (!confirm('Delete "' + (c.name || 'this customer') + '"? This cannot be undone.')) return;
    var all = loadCustomers().filter(function (x) { return x.id !== editingId; });
    saveCustomers(all);
    editingId = null;
    showCustView('list');
    renderCustomerTable();
  }

  els['btn-new-cust'].addEventListener('click', openNewCustomerForm);
  els['cf-save'].addEventListener('click', saveCustomerFromForm);
  els['cf-cancel'].addEventListener('click', function () { showCustView('list'); });
  els['cf-delete'].addEventListener('click', deleteCustomer);
  els['cs-search'].addEventListener('input', renderCustomerTable);

  // ═══════════════════ PIPELINE (kanban, same drag pattern as tools/crm-pipeline) ═══════════════════
  function renderPipeline() {
    var customers = loadCustomers();
    var board = els['pipeline-board'];
    board.innerHTML = '';
    els['pipeline-empty'].hidden = customers.length !== 0;
    board.style.display = customers.length === 0 ? 'none' : '';

    STAGES.forEach(function (stage) {
      var stageCustomers = customers.filter(function (c) { return c.stage === stage; });
      var sum = stageCustomers.reduce(function (a, c) { return a + (Number(c.value) || 0); }, 0);

      var col = document.createElement('div');
      col.className = 'tool-kanban-col';
      col.dataset.stage = stage;

      var title = document.createElement('div');
      title.className = 'tool-kanban-col-title';
      title.innerHTML = '<span>' + TS.escapeHtml(stage) + '</span>' +
        '<span class="tool-kanban-col-sum">' + stageCustomers.length + ' · ' + TS.formatMoneyWhole(sum) + '</span>';
      col.appendChild(title);

      if (stageCustomers.length === 0) {
        var emptyNote = document.createElement('div');
        emptyNote.className = 'tool-empty';
        emptyNote.style.padding = '16px 4px';
        emptyNote.style.fontSize = 'calc(11.5px * var(--font-scale))';
        emptyNote.textContent = 'No customers here.';
        col.appendChild(emptyNote);
      } else {
        stageCustomers.forEach(function (c) { col.appendChild(buildCard(c)); });
      }

      wireColumnDrop(col);
      board.appendChild(col);
    });
  }

  function buildCard(c) {
    var card = document.createElement('div');
    card.className = 'tool-kanban-card';
    card.draggable = true;
    card.dataset.id = c.id;

    var titleEl = document.createElement('div');
    titleEl.className = 'tool-kanban-card-title';
    titleEl.textContent = c.name || '(unnamed customer)';
    card.appendChild(titleEl);

    var metaEl = document.createElement('div');
    metaEl.className = 'tool-kanban-card-meta';
    metaEl.textContent = c.company || c.phone || 'No details';
    card.appendChild(metaEl);

    var valueEl = document.createElement('div');
    valueEl.className = 'tool-kanban-card-value';
    valueEl.textContent = TS.formatMoney(Number(c.value) || 0);
    card.appendChild(valueEl);

    if (c.followUpDate) {
      var followEl = document.createElement('div');
      followEl.className = 'tool-kanban-card-meta';
      followEl.textContent = 'Follow-up: ' + TS.formatDateDisplay(c.followUpDate);
      card.appendChild(followEl);
    }

    var select = document.createElement('select');
    select.className = 'tool-kanban-card-select';
    STAGES.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s; opt.textContent = 'Move to: ' + s;
      if (s === c.stage) opt.selected = true;
      select.appendChild(opt);
    });
    select.addEventListener('click', function (e) { e.stopPropagation(); });
    select.addEventListener('change', function (e) {
      e.stopPropagation();
      moveCustomerToStage(c.id, select.value);
    });
    card.appendChild(select);

    card.addEventListener('click', function () {
      document.querySelector('.billing-tab[data-tab="customers"]').click();
      openEditCustomerForm(c.id);
    });

    card.addEventListener('dragstart', function (e) {
      card.classList.add('dragging');
      e.dataTransfer.setData('text/plain', c.id);
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
      if (id) moveCustomerToStage(id, col.dataset.stage);
    });
  }

  function moveCustomerToStage(id, newStage) {
    var all = loadCustomers();
    var c = all.filter(function (x) { return x.id === id; })[0];
    if (!c || c.stage === newStage || STAGES.indexOf(newStage) === -1) return;
    c.stage = newStage;
    saveCustomers(all);
    renderPipeline();
    renderCustomerTable();
  }

  // ═══════════════════ DUE TODAY ═══════════════════
  function waLink(name, body) {
    return 'https://wa.me/?text=' + encodeURIComponent(body);
  }

  function renderDueRow(c, dateField, kind) {
    var due = c[dateField];
    var overdue = due < TS.todayISO();
    var tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + TS.escapeHtml(c.name || '(no name)') + '</td>' +
      '<td>' + TS.escapeHtml(c.phone || '-') + '</td>' +
      '<td' + (overdue ? ' class="due-overdue"' : '') + '>' + TS.escapeHtml(TS.formatDateDisplay(due)) + (overdue ? ' · overdue' : '') + '</td>' +
      '<td></td>';
    var actionsTd = tr.lastElementChild;
    var wrap = document.createElement('div');
    wrap.className = 'due-actions';

    var waBtn = document.createElement('button');
    waBtn.type = 'button';
    waBtn.className = 'btn-primary btn-sm';
    waBtn.textContent = 'WhatsApp them';
    var msg = kind === 'renewal'
      ? 'Hi ' + (c.name || 'there') + ', just a reminder that your renewal is due. Let us know if you would like to continue and we will take it from here.'
      : 'Hi ' + (c.name || 'there') + ', following up as promised. Let us know if you have any questions.';
    waBtn.addEventListener('click', function () {
      window.open(waLink(c.name, msg), '_blank', 'noopener');
    });
    wrap.appendChild(waBtn);

    var snoozeBtn = document.createElement('button');
    snoozeBtn.type = 'button';
    snoozeBtn.className = 'btn-ghost btn-sm';
    snoozeBtn.textContent = 'Snooze 7 days';
    snoozeBtn.addEventListener('click', function () {
      var all = loadCustomers();
      var rec = all.filter(function (x) { return x.id === c.id; })[0];
      if (!rec) return;
      rec[dateField] = addDaysISO(rec[dateField], 7);
      saveCustomers(all);
      renderDueToday();
      renderCustomerTable();
    });
    wrap.appendChild(snoozeBtn);

    actionsTd.appendChild(wrap);
    return tr;
  }

  function renderDueToday() {
    var all = loadCustomers();
    var today = TS.todayISO();

    var followUps = all.filter(function (c) { return c.followUpDate && c.followUpDate <= today; })
      .sort(function (a, b) { return a.followUpDate < b.followUpDate ? -1 : (a.followUpDate > b.followUpDate ? 1 : 0); });
    var renewals = all.filter(function (c) { return c.renewalDate && c.renewalDate <= today; })
      .sort(function (a, b) { return a.renewalDate < b.renewalDate ? -1 : (a.renewalDate > b.renewalDate ? 1 : 0); });

    els['due-followups-body'].innerHTML = '';
    followUps.forEach(function (c) { els['due-followups-body'].appendChild(renderDueRow(c, 'followUpDate', 'followup')); });
    els['due-followups-empty'].hidden = followUps.length > 0;

    els['due-renewals-body'].innerHTML = '';
    renewals.forEach(function (c) { els['due-renewals-body'].appendChild(renderDueRow(c, 'renewalDate', 'renewal')); });
    els['due-renewals-empty'].hidden = renewals.length > 0;

    renderStats();
  }

  // ═══════════════════ stats + header ═══════════════════
  function renderStats() {
    var all = loadCustomers();
    var today = TS.todayISO();
    var inPipeline = all.filter(function (c) { return c.stage !== 'Won' && c.stage !== 'Lost'; }).length;
    var followUpsDue = all.filter(function (c) { return c.followUpDate && c.followUpDate <= today; }).length;
    var renewalsDue = all.filter(function (c) { return c.renewalDate && c.renewalDate <= today; }).length;

    els['cust-stats'].innerHTML =
      '<div class="tool-stat-card"><div class="tool-stat-label">Total Customers</div><div class="tool-stat-value">' + all.length + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">In Pipeline</div><div class="tool-stat-value">' + inPipeline + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Follow-ups Due Today</div><div class="tool-stat-value">' + followUpsDue + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Renewals Due Today</div><div class="tool-stat-value">' + renewalsDue + '</div></div>';
  }

  els['hdr-biz'].textContent = user.name + ' · ' + user.email;

  renderCustomerTable();
  renderStats();
})();
