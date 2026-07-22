/* /app/money/ — the Money & Staff-Salary Pack workspace: ONE shared staff
   roster feeds both attendance marking and salary calculation. The free
   Staff Attendance Tracker and Salary Slip Generator tools are two
   disconnected localStorage stores where you re-type the same name twice;
   here, marking a month's attendance for a staff member auto-computes their
   salary slip ("present days ÷ days in month × base salary") instead of the
   free tool's fully-manual entry, with additions/deductions still editable
   by hand on top. Local-first: no backend yet, same localStorage pattern as
   the rest of the site. */
(function () {
  'use strict';

  var TS = window.ToolsShared;

  // ── entitlement gate ──
  var user = window.BWAuth ? BWAuth.currentUser() : null;
  if (!user) { location.href = '/app/'; return; }
  if (!BWEntitlement.has(user.email, 'money')) { location.href = '/app/'; return; }

  var STAFF_KEY = 'bw_pack_staff_v1';
  var ATTEND_KEY = 'bw_pack_attendance_v1';
  var EXPENSES_KEY = 'bw_pack_expenses_v1';
  var SLIPS_KEY = 'bw_pack_salaryslips_v1';

  var EXP_CATEGORIES = ['Rent', 'Salaries', 'Utilities', 'Raw Materials / Inventory', 'Marketing', 'Transport', 'Equipment', 'Misc'];
  var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MARK_CYCLE = ['', 'P', 'A'];

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }
  function daysInMonth(monthStr) {
    var parts = monthStr.split('-');
    var y = parseInt(parts[0], 10), m = parseInt(parts[1], 10);
    return new Date(y, m, 0).getDate();
  }
  function monthLabel(monthStr) {
    if (!monthStr) return '-';
    var parts = monthStr.split('-');
    var m = parseInt(parts[1], 10);
    return (MONTH_NAMES[m - 1] || '?') + ' ' + parts[0];
  }
  function num(n) { n = parseFloat(n); return isNaN(n) ? 0 : n; }

  // ═══════════════════ data access ═══════════════════
  function loadStaff() { return TS.loadJSON(STAFF_KEY, []); }
  function saveStaffList(a) { TS.saveJSON(STAFF_KEY, a); }
  function findStaff(id) {
    var all = loadStaff();
    for (var i = 0; i < all.length; i++) { if (all[i].id === id) return all[i]; }
    return null;
  }

  function loadAttendance() { return TS.loadJSON(ATTEND_KEY, {}); }
  function saveAttendanceAll(a) { TS.saveJSON(ATTEND_KEY, a); }

  function loadExpenses() { return TS.loadJSON(EXPENSES_KEY, []); }
  function saveExpensesAll(a) { TS.saveJSON(EXPENSES_KEY, a); }

  function loadSlips() { return TS.loadJSON(SLIPS_KEY, []); }
  function saveSlipsAll(a) { TS.saveJSON(SLIPS_KEY, a); }

  // ── attendance helpers (mirrors the free Staff Attendance tool's shape) ──
  function getMark(monthStr, staffId, iso) {
    var att = loadAttendance();
    return (att[monthStr] && att[monthStr][staffId] && att[monthStr][staffId][iso]) || '';
  }
  function setMark(monthStr, staffId, iso, mark) {
    var att = loadAttendance();
    att[monthStr] = att[monthStr] || {};
    att[monthStr][staffId] = att[monthStr][staffId] || {};
    if (mark) att[monthStr][staffId][iso] = mark;
    else delete att[monthStr][staffId][iso];
    saveAttendanceAll(att);
  }
  function presentDaysFor(monthStr, staffId) {
    var att = loadAttendance();
    var byDate = (att[monthStr] && att[monthStr][staffId]) || {};
    var count = 0;
    Object.keys(byDate).forEach(function (iso) { if (byDate[iso] === 'P') count++; });
    return count;
  }

  // ═══════════════════ tabs ═══════════════════
  document.querySelectorAll('.billing-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.billing-tab').forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.getElementById('tab-staff').hidden = btn.dataset.tab !== 'staff';
      document.getElementById('tab-salary').hidden = btn.dataset.tab !== 'salary';
      document.getElementById('tab-expenses').hidden = btn.dataset.tab !== 'expenses';
    });
  });

  // ═══════════════════ STAFF ROSTER ═══════════════════
  var editingStaffId = null;
  var els = {};
  [
    'stf-name', 'stf-role', 'stf-phone', 'stf-base', 'btn-stf-save', 'btn-stf-cancel', 'stf-tbody', 'stf-empty',
    'att-month', 'att-grid', 'att-empty',
    'sfm-staff', 'sfm-month', 'sfm-calc-stats', 'sfm-additions', 'sfm-deductions', 'sfm-netpay', 'sfm-save', 'sfm-cancel',
    'sal-table-body', 'sal-empty', 'btn-new-slip',
    'svd-sheet', 'svd-back', 'svd-print', 'svd-wa',
    'exp-date', 'exp-category', 'exp-note', 'exp-amount', 'btn-add-expense',
    'exp-filter-month', 'exp-month-total', 'exp-count', 'exp-tbody', 'exp-empty',
    'money-stats', 'hdr-biz'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  function clearStaffForm() {
    els['stf-name'].value = '';
    els['stf-role'].value = '';
    els['stf-phone'].value = '';
    els['stf-base'].value = '';
    editingStaffId = null;
    els['btn-stf-save'].textContent = '+ Add Staff';
    els['btn-stf-cancel'].hidden = true;
  }

  function renderStaffTable() {
    var all = loadStaff();
    els['stf-empty'].hidden = all.length > 0;
    els['stf-tbody'].innerHTML = all.map(function (s) {
      return '<tr data-id="' + s.id + '">' +
        '<td>' + TS.escapeHtml(s.name) + '</td>' +
        '<td>' + TS.escapeHtml(s.role || '-') + '</td>' +
        '<td>' + TS.escapeHtml(s.phone || '-') + '</td>' +
        '<td>' + TS.formatMoney(s.baseSalary) + '</td>' +
        '<td><span class="tool-badge ' + (s.active ? 'tool-badge-good' : 'tool-badge-neutral') + '">' + (s.active ? 'Active' : 'Inactive') + '</span></td>' +
        '<td style="white-space:nowrap;">' +
          '<button type="button" class="btn-ghost btn-sm" data-act="toggle" data-id="' + s.id + '">' + (s.active ? 'Deactivate' : 'Activate') + '</button> ' +
          '<button type="button" class="btn-ghost btn-sm" data-act="edit" data-id="' + s.id + '">Edit</button> ' +
          '<button type="button" class="btn-danger" data-act="remove" data-id="' + s.id + '">Remove</button>' +
        '</td></tr>';
    }).join('');

    els['stf-tbody'].querySelectorAll('button[data-act]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        var act = btn.getAttribute('data-act');
        var s = findStaff(id);
        if (!s) return;
        if (act === 'toggle') {
          var all2 = loadStaff();
          all2.forEach(function (x) { if (x.id === id) x.active = !x.active; });
          saveStaffList(all2);
          renderStaffTable(); renderAttendanceGrid(); renderStaffSelect(); renderStats();
        } else if (act === 'edit') {
          editingStaffId = id;
          els['stf-name'].value = s.name;
          els['stf-role'].value = s.role || '';
          els['stf-phone'].value = s.phone || '';
          els['stf-base'].value = s.baseSalary || '';
          els['btn-stf-save'].textContent = 'Update Staff';
          els['btn-stf-cancel'].hidden = false;
          els['stf-name'].focus();
        } else if (act === 'remove') {
          if (!confirm('Remove ' + s.name + '? Their attendance records and any generated salary slips stay in history, but they will no longer appear in the roster.')) return;
          saveStaffList(loadStaff().filter(function (x) { return x.id !== id; }));
          if (editingStaffId === id) clearStaffForm();
          renderStaffTable(); renderAttendanceGrid(); renderStaffSelect(); renderStats();
        }
      });
    });
  }

  els['btn-stf-save'].addEventListener('click', function () {
    var name = els['stf-name'].value.trim();
    if (!name) { els['stf-name'].focus(); return; }
    var data = {
      name: name,
      role: els['stf-role'].value.trim(),
      phone: els['stf-phone'].value.trim(),
      baseSalary: num(els['stf-base'].value)
    };
    var all = loadStaff();
    if (editingStaffId) {
      all.forEach(function (s) {
        if (s.id === editingStaffId) { s.name = data.name; s.role = data.role; s.phone = data.phone; s.baseSalary = data.baseSalary; }
      });
    } else {
      data.id = TS.uid();
      data.active = true;
      all.push(data);
    }
    saveStaffList(all);
    clearStaffForm();
    renderStaffTable(); renderAttendanceGrid(); renderStaffSelect(); renderStats();
  });
  els['btn-stf-cancel'].addEventListener('click', clearStaffForm);

  // ═══════════════════ ATTENDANCE GRID ═══════════════════
  function renderAttendanceGrid() {
    var monthStr = els['att-month'].value;
    var activeStaff = loadStaff().filter(function (s) { return s.active; });
    var table = els['att-grid'];
    table.innerHTML = '';

    if (!activeStaff.length || !monthStr) {
      els['att-empty'].hidden = false;
      table.style.display = 'none';
      return;
    }
    els['att-empty'].hidden = true;
    table.style.display = '';

    var nDays = daysInMonth(monthStr);
    var thead = document.createElement('thead');
    var headRow = document.createElement('tr');
    var nameTh = document.createElement('th');
    nameTh.className = 'name-col';
    nameTh.textContent = 'Staff';
    headRow.appendChild(nameTh);
    for (var d = 1; d <= nDays; d++) {
      var th = document.createElement('th');
      th.textContent = String(d);
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');
    activeStaff.forEach(function (s) {
      var tr = document.createElement('tr');
      var nameTd = document.createElement('td');
      nameTd.className = 'name-col';
      nameTd.textContent = s.name;
      tr.appendChild(nameTd);

      for (var d2 = 1; d2 <= nDays; d2++) {
        var iso = monthStr + '-' + pad2(d2);
        var mark = getMark(monthStr, s.id, iso);
        var td = document.createElement('td');
        td.className = 'tool-attend-cell ' + (mark === 'P' ? 'attend-P' : mark === 'A' ? 'attend-A' : 'attend-blank');
        td.textContent = mark;
        td.setAttribute('data-staff', s.id);
        td.setAttribute('data-date', iso);
        td.title = mark === 'P' ? 'Present' : mark === 'A' ? 'Absent' : 'Not marked, click to set';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    table.querySelectorAll('.tool-attend-cell').forEach(function (cell) {
      cell.addEventListener('click', function () {
        var sid = cell.getAttribute('data-staff');
        var iso = cell.getAttribute('data-date');
        var cur = getMark(monthStr, sid, iso);
        var idx = MARK_CYCLE.indexOf(cur);
        var next = MARK_CYCLE[(idx + 1) % MARK_CYCLE.length];
        setMark(monthStr, sid, iso, next);
        cell.className = 'tool-attend-cell ' + (next === 'P' ? 'attend-P' : next === 'A' ? 'attend-A' : 'attend-blank');
        cell.textContent = next;
        cell.title = next === 'P' ? 'Present' : next === 'A' ? 'Absent' : 'Not marked, click to set';
        // live-refresh the salary calc if this staff/month is currently open in the slip form
        var salFormEl = document.getElementById('sal-form-view');
        if (salFormEl && !salFormEl.hidden && els['sfm-staff'].value === sid && els['sfm-month'].value === monthStr) {
          updateSalaryCalc();
        }
      });
    });
  }

  els['att-month'].addEventListener('change', renderAttendanceGrid);

  // ═══════════════════ SALARY SLIPS ═══════════════════
  function showSalView(which) {
    document.getElementById('sal-list-view').hidden = which !== 'list';
    document.getElementById('sal-form-view').hidden = which !== 'form';
    document.getElementById('sal-detail-view').hidden = which !== 'detail';
  }

  function renderStaffSelect() {
    var prev = els['sfm-staff'].value;
    var activeStaff = loadStaff().filter(function (s) { return s.active; });
    els['sfm-staff'].innerHTML = '';
    var ph = document.createElement('option');
    ph.value = ''; ph.textContent = activeStaff.length ? 'Choose a staff member…' : 'Add an active staff member first';
    els['sfm-staff'].appendChild(ph);
    activeStaff.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s.id; opt.textContent = s.name + (s.role ? ' (' + s.role + ')' : '');
      els['sfm-staff'].appendChild(opt);
    });
    if (activeStaff.some(function (s) { return s.id === prev; })) els['sfm-staff'].value = prev;
  }

  function currentCalc() {
    var staffId = els['sfm-staff'].value;
    var monthStr = els['sfm-month'].value;
    var s = findStaff(staffId);
    if (!s || !monthStr) return null;
    var workingDays = daysInMonth(monthStr);
    var presentDays = presentDaysFor(monthStr, staffId);
    var calculatedPay = workingDays > 0 ? (presentDays / workingDays) * num(s.baseSalary) : 0;
    return { staff: s, monthStr: monthStr, workingDays: workingDays, presentDays: presentDays, calculatedPay: calculatedPay };
  }

  function updateSalaryCalc() {
    var c = currentCalc();
    if (!c) {
      els['sfm-calc-stats'].innerHTML =
        '<div class="tool-stat-card"><div class="tool-stat-label">Working Days</div><div class="tool-stat-value">-</div></div>' +
        '<div class="tool-stat-card"><div class="tool-stat-label">Present Days</div><div class="tool-stat-value">-</div></div>' +
        '<div class="tool-stat-card"><div class="tool-stat-label">Calculated Pay</div><div class="tool-stat-value">₹0.00</div></div>';
      els['sfm-netpay'].textContent = '₹0.00';
      return;
    }
    els['sfm-calc-stats'].innerHTML =
      '<div class="tool-stat-card"><div class="tool-stat-label">Working Days (' + monthLabel(c.monthStr) + ')</div><div class="tool-stat-value">' + c.workingDays + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Present Days</div><div class="tool-stat-value">' + c.presentDays + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Calculated Pay</div><div class="tool-stat-value">' + TS.formatMoney(c.calculatedPay) + '</div></div>';
    var net = c.calculatedPay + num(els['sfm-additions'].value) - num(els['sfm-deductions'].value);
    els['sfm-netpay'].textContent = TS.formatMoney(net);
  }

  els['sfm-staff'].addEventListener('change', updateSalaryCalc);
  els['sfm-month'].addEventListener('change', updateSalaryCalc);
  els['sfm-additions'].addEventListener('input', updateSalaryCalc);
  els['sfm-deductions'].addEventListener('input', updateSalaryCalc);

  function openNewSlipForm() {
    renderStaffSelect();
    els['sfm-staff'].value = '';
    els['sfm-month'].value = TS.todayISO().slice(0, 7);
    els['sfm-additions'].value = 0;
    els['sfm-deductions'].value = 0;
    updateSalaryCalc();
    showSalView('form');
  }

  els['btn-new-slip'].addEventListener('click', openNewSlipForm);
  els['sfm-cancel'].addEventListener('click', function () { showSalView('list'); });

  els['sfm-save'].addEventListener('click', function () {
    var c = currentCalc();
    if (!c) { alert('Choose a staff member and month before generating a slip.'); return; }
    var additions = num(els['sfm-additions'].value);
    var deductions = num(els['sfm-deductions'].value);
    var netPay = c.calculatedPay + additions - deductions;
    var rec = {
      id: TS.uid(),
      staffId: c.staff.id,
      staffName: c.staff.name,
      staffRole: c.staff.role || '',
      staffPhone: c.staff.phone || '',
      month: c.monthStr,
      baseSalary: num(c.staff.baseSalary),
      workingDays: c.workingDays,
      presentDays: c.presentDays,
      calculatedPay: c.calculatedPay,
      additions: additions,
      deductions: deductions,
      netPay: netPay,
      generatedAt: new Date().toISOString()
    };
    var all = loadSlips();
    all.unshift(rec);
    saveSlipsAll(all);
    renderSlipList();
    openSlipDetail(rec.id);
    renderStats();
  });

  function renderSlipList() {
    var slips = loadSlips();
    els['sal-empty'].hidden = slips.length > 0;
    els['sal-table-body'].innerHTML = slips.map(function (rec) {
      return '<tr data-id="' + rec.id + '"><td>' + TS.escapeHtml(rec.staffName) + '</td><td>' + monthLabel(rec.month) + '</td>' +
        '<td>' + rec.presentDays + ' / ' + rec.workingDays + '</td><td>' + TS.formatMoney(rec.netPay) + '</td>' +
        '<td>' + TS.formatDateDisplay(rec.generatedAt.slice(0, 10)) + '</td>' +
        '<td><button type="button" class="btn-ghost btn-sm sal-view-btn" data-id="' + rec.id + '">View</button></td></tr>';
    }).join('');
    els['sal-table-body'].querySelectorAll('.sal-view-btn').forEach(function (b) {
      b.addEventListener('click', function () { openSlipDetail(b.dataset.id); });
    });
  }

  function renderSlipSheet(rec) {
    return (
      '<div class="inv-head"><div>' +
        '<div class="inv-seller-name">' + TS.escapeHtml(rec.staffName) + '</div>' +
        '<div class="inv-seller-meta">' + TS.escapeHtml([rec.staffRole, rec.staffPhone].filter(Boolean).join(' · ') || '-') + '</div></div>' +
        '<div class="inv-head-right"><div class="inv-doctitle">SALARY SLIP</div>' +
        '<div class="inv-meta"><span>Pay Period</span><strong>' + monthLabel(rec.month) + '</strong></div>' +
        '<div class="inv-meta"><span>Generated</span><strong>' + TS.formatDateDisplay(rec.generatedAt.slice(0, 10)) + '</strong></div></div></div>' +
      '<div class="inv-billto"><div class="inv-panel-title" style="margin-bottom:6px;">Attendance Basis</div>' +
        '<div class="inv-seller-meta">Working Days: ' + rec.workingDays + ' &nbsp;·&nbsp; Present Days: ' + rec.presentDays +
        ' &nbsp;·&nbsp; Base Salary: ' + TS.formatMoney(rec.baseSalary) + '</div></div>' +
      '<table class="inv-table"><thead><tr><th class="inv-col-desc">Description</th><th>Amount</th></tr></thead><tbody>' +
        '<tr><td class="inv-col-desc">Calculated Pay (' + rec.presentDays + ' ÷ ' + rec.workingDays + ' × ' + TS.formatMoney(rec.baseSalary) + ')</td><td>' + TS.formatMoney(rec.calculatedPay) + '</td></tr>' +
        '<tr><td class="inv-col-desc">Additions</td><td>' + TS.formatMoney(rec.additions) + '</td></tr>' +
        '<tr><td class="inv-col-desc">Deductions</td><td>-' + TS.formatMoney(rec.deductions) + '</td></tr>' +
      '</tbody></table>' +
      '<div class="inv-totals">' +
        '<div class="inv-totals-row inv-grand"><span>Net Pay</span><strong>' + TS.formatMoney(rec.netPay) + '</strong></div></div>' +
      '<div class="inv-words">Amount in Words: ' + TS.amountInWords(Math.max(rec.netPay, 0)) + '</div>'
    );
  }

  function openSlipDetail(id) {
    var rec = loadSlips().filter(function (r) { return r.id === id; })[0];
    if (!rec) { showSalView('list'); return; }
    els['svd-sheet'].innerHTML = renderSlipSheet(rec);
    els['svd-wa'].onclick = function () {
      var lines = [
        'Salary Slip — ' + rec.staffName, 'Pay Period: ' + monthLabel(rec.month),
        'Present / Working Days: ' + rec.presentDays + ' / ' + rec.workingDays,
        'Calculated Pay: ' + TS.formatMoney(rec.calculatedPay),
        'Additions: ' + TS.formatMoney(rec.additions), 'Deductions: ' + TS.formatMoney(rec.deductions),
        'Net Pay: ' + TS.formatMoney(rec.netPay), TS.amountInWords(Math.max(rec.netPay, 0))
      ];
      window.open('https://wa.me/?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
    };
    showSalView('detail');
  }

  els['svd-back'].addEventListener('click', function () { showSalView('list'); });
  els['svd-print'].addEventListener('click', function () { window.print(); });

  // ═══════════════════ EXPENSES ═══════════════════
  function renderCategoryOptions() {
    els['exp-category'].innerHTML = '';
    EXP_CATEGORIES.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      els['exp-category'].appendChild(opt);
    });
  }

  function renderExpenseTable() {
    var all = loadExpenses().slice().sort(function (a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; });
    var filterMonth = els['exp-filter-month'].value;
    var filtered = filterMonth ? all.filter(function (e) { return e.date && e.date.slice(0, 7) === filterMonth; }) : all;

    els['exp-count'].textContent = String(filtered.length);
    els['exp-empty'].hidden = filtered.length > 0;
    els['exp-tbody'].innerHTML = filtered.map(function (e) {
      return '<tr data-id="' + e.id + '"><td>' + TS.formatDateDisplay(e.date) + '</td>' +
        '<td><span class="tool-badge tool-badge-neutral">' + TS.escapeHtml(e.category) + '</span></td>' +
        '<td>' + TS.escapeHtml(e.note || '-') + '</td><td>' + TS.formatMoney(e.amount) + '</td>' +
        '<td><button type="button" class="btn-danger exp-del-btn" data-id="' + e.id + '">Delete</button></td></tr>';
    }).join('');
    els['exp-tbody'].querySelectorAll('.exp-del-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-id');
        var exp = loadExpenses().filter(function (x) { return x.id === id; })[0];
        if (!exp) return;
        if (!confirm('Delete this expense ("' + (exp.note || exp.category) + '", ' + TS.formatMoney(exp.amount) + ')? This cannot be undone.')) return;
        saveExpensesAll(loadExpenses().filter(function (x) { return x.id !== id; }));
        renderExpenseTable(); renderStats();
      });
    });

    var monthTotal = filtered.reduce(function (sum, e) { return sum + num(e.amount); }, 0);
    els['exp-month-total'].textContent = TS.formatMoney(monthTotal);
  }

  els['btn-add-expense'].addEventListener('click', function () {
    var date = els['exp-date'].value || TS.todayISO();
    var category = els['exp-category'].value;
    var note = els['exp-note'].value.trim();
    var amount = parseFloat(els['exp-amount'].value);
    if (isNaN(amount) || amount <= 0) { alert('Enter a valid amount greater than 0.'); els['exp-amount'].focus(); return; }
    var all = loadExpenses();
    all.push({ id: TS.uid(), date: date, category: category, note: note, amount: amount });
    saveExpensesAll(all);
    els['exp-note'].value = '';
    els['exp-amount'].value = '';
    els['exp-date'].value = TS.todayISO();
    renderExpenseTable(); renderStats();
  });
  els['exp-filter-month'].addEventListener('change', renderExpenseTable);

  // ═══════════════════ dashboard stats ═══════════════════
  function renderStats() {
    var activeStaffCount = loadStaff().filter(function (s) { return s.active; }).length;
    var thisMonth = TS.todayISO().slice(0, 7);

    var payroll = loadSlips()
      .filter(function (r) { return r.generatedAt && r.generatedAt.slice(0, 7) === thisMonth; })
      .reduce(function (sum, r) { return sum + num(r.netPay); }, 0);

    var expensesTotal = loadExpenses()
      .filter(function (e) { return e.date && e.date.slice(0, 7) === thisMonth; })
      .reduce(function (sum, e) { return sum + num(e.amount); }, 0);

    els['money-stats'].innerHTML =
      '<div class="tool-stat-card"><div class="tool-stat-label">Active Staff</div><div class="tool-stat-value">' + activeStaffCount + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">This Month Payroll</div><div class="tool-stat-value">' + TS.formatMoneyWhole(payroll) + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">This Month Expenses</div><div class="tool-stat-value">' + TS.formatMoneyWhole(expensesTotal) + '</div></div>';
  }

  // ═══════════════════ init ═══════════════════
  els['hdr-biz'].textContent = user.name + ' · ' + user.email;
  els['att-month'].value = TS.todayISO().slice(0, 7);
  els['exp-filter-month'].value = TS.todayISO().slice(0, 7);
  els['exp-date'].value = TS.todayISO();
  renderCategoryOptions();

  renderStaffTable();
  renderAttendanceGrid();
  renderStaffSelect();
  renderSlipList();
  renderExpenseTable();
  renderStats();
})();
