(function () {
  'use strict';

  var TS = window.ToolsShared;

  var STAFF_KEY = 'bw_tools_attendance_staff_v1';
  var ATTEND_KEY = 'bw_tools_attendance_v1';

  var MARK_CYCLE = ['', 'P', 'A', 'H', 'L'];
  var MARK_LABELS = { P: 'Present', A: 'Absent', H: 'Half-day', L: 'Leave' };

  var els = {};
  [
    'f-staff-name', 'f-staff-empid', 'btn-add-staff', 'staff-table', 'staff-tbody', 'staff-empty',
    'f-month', 'attend-grid', 'grid-empty',
    'summary-stats', 'summary-table', 'summary-tbody', 'summary-empty', 'btn-export-csv'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var staff = TS.loadJSON(STAFF_KEY, []);
  var attendance = TS.loadJSON(ATTEND_KEY, {});

  function saveStaff() { TS.saveJSON(STAFF_KEY, staff); }
  function saveAttendance() { TS.saveJSON(ATTEND_KEY, attendance); }

  function pad2(n) { return n < 10 ? '0' + n : '' + n; }

  function daysInMonth(monthStr) {
    var parts = monthStr.split('-');
    var y = parseInt(parts[0], 10), m = parseInt(parts[1], 10);
    return new Date(y, m, 0).getDate();
  }

  function dateKey(staffId, iso) { return staffId + '_' + iso; }

  function markClass(mark) {
    if (mark === 'P') return 'attend-P';
    if (mark === 'A') return 'attend-A';
    if (mark === 'H') return 'attend-H';
    if (mark === 'L') return 'attend-L';
    return 'attend-blank';
  }

  // ── staff roster ──
  function renderStaffTable() {
    els['staff-tbody'].innerHTML = '';
    if (!staff.length) {
      els['staff-empty'].style.display = '';
      els['staff-table'].style.display = 'none';
      return;
    }
    els['staff-empty'].style.display = 'none';
    els['staff-table'].style.display = '';

    staff.forEach(function (s) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + TS.escapeHtml(s.name) + '</td>' +
        '<td>' + TS.escapeHtml(s.empId || '—') + '</td>' +
        '<td><button type="button" class="btn-danger" data-remove="' + s.id + '">Remove</button></td>';
      els['staff-tbody'].appendChild(tr);
    });

    Array.prototype.forEach.call(els['staff-tbody'].querySelectorAll('[data-remove]'), function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-remove');
        var target = null;
        for (var i = 0; i < staff.length; i++) { if (staff[i].id === id) { target = staff[i]; break; } }
        if (!target) return;
        if (!confirm('Remove ' + target.name + '? Their attendance records for every month will also be deleted.')) return;

        staff = staff.filter(function (x) { return x.id !== id; });
        Object.keys(attendance).forEach(function (k) {
          if (k.indexOf(id + '_') === 0) delete attendance[k];
        });
        saveStaff();
        saveAttendance();
        renderAll();
      });
    });
  }

  function addStaff() {
    var name = els['f-staff-name'].value.trim();
    var empId = els['f-staff-empid'].value.trim();
    if (!name) { els['f-staff-name'].focus(); return; }
    staff.push({ id: TS.uid(), name: name, empId: empId });
    saveStaff();
    els['f-staff-name'].value = '';
    els['f-staff-empid'].value = '';
    els['f-staff-name'].focus();
    renderAll();
  }

  // ── attendance grid ──
  function renderGrid() {
    var monthStr = els['f-month'].value;
    var table = els['attend-grid'];
    table.innerHTML = '';

    if (!staff.length || !monthStr) {
      els['grid-empty'].style.display = '';
      table.style.display = 'none';
      return;
    }
    els['grid-empty'].style.display = 'none';
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
    staff.forEach(function (s) {
      var tr = document.createElement('tr');
      var nameTd = document.createElement('td');
      nameTd.className = 'name-col';
      nameTd.textContent = s.name;
      tr.appendChild(nameTd);

      for (var d = 1; d <= nDays; d++) {
        var iso = monthStr + '-' + pad2(d);
        var mark = attendance[dateKey(s.id, iso)] || '';
        var td = document.createElement('td');
        td.className = 'tool-attend-cell ' + markClass(mark);
        td.textContent = mark;
        td.setAttribute('data-staff', s.id);
        td.setAttribute('data-date', iso);
        td.title = mark ? MARK_LABELS[mark] : 'Not marked — click to set';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);

    Array.prototype.forEach.call(table.querySelectorAll('.tool-attend-cell'), function (cell) {
      cell.addEventListener('click', function () {
        var sid = cell.getAttribute('data-staff');
        var iso = cell.getAttribute('data-date');
        var key = dateKey(sid, iso);
        var cur = attendance[key] || '';
        var idx = MARK_CYCLE.indexOf(cur);
        var next = MARK_CYCLE[(idx + 1) % MARK_CYCLE.length];
        if (next) attendance[key] = next; else delete attendance[key];
        saveAttendance();

        cell.className = 'tool-attend-cell ' + markClass(next);
        cell.textContent = next;
        cell.title = next ? MARK_LABELS[next] : 'Not marked — click to set';

        renderSummary();
      });
    });
  }

  // ── summary ──
  function computeSummary(monthStr) {
    var nDays = daysInMonth(monthStr);
    return staff.map(function (s) {
      var p = 0, a = 0, h = 0, l = 0;
      for (var d = 1; d <= nDays; d++) {
        var iso = monthStr + '-' + pad2(d);
        var mark = attendance[dateKey(s.id, iso)];
        if (mark === 'P') p++;
        else if (mark === 'A') a++;
        else if (mark === 'H') h++;
        else if (mark === 'L') l++;
      }
      var totalMarked = p + a + h + l;
      var pct = totalMarked > 0 ? ((p + 0.5 * h) / totalMarked * 100) : null;
      return { id: s.id, name: s.name, empId: s.empId, present: p, absent: a, half: h, leave: l, pct: pct };
    });
  }

  function renderSummary() {
    var monthStr = els['f-month'].value;
    els['summary-tbody'].innerHTML = '';
    els['summary-stats'].innerHTML = '';

    if (!staff.length || !monthStr) {
      els['summary-empty'].style.display = '';
      els['summary-table'].style.display = 'none';
      return;
    }
    els['summary-empty'].style.display = 'none';
    els['summary-table'].style.display = '';

    var rows = computeSummary(monthStr);
    rows.forEach(function (r) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + TS.escapeHtml(r.name) + '</td>' +
        '<td>' + r.present + '</td>' +
        '<td>' + r.absent + '</td>' +
        '<td>' + r.half + '</td>' +
        '<td>' + r.leave + '</td>' +
        '<td>' + (r.pct == null ? '—' : r.pct.toFixed(1) + '%') + '</td>';
      els['summary-tbody'].appendChild(tr);
    });

    var totalStaff = staff.length;
    var pctVals = rows.filter(function (r) { return r.pct != null; }).map(function (r) { return r.pct; });
    var avgPct = pctVals.length ? (pctVals.reduce(function (a, b) { return a + b; }, 0) / pctVals.length) : null;
    var totalPresent = rows.reduce(function (sum, r) { return sum + r.present; }, 0);
    var totalAbsent = rows.reduce(function (sum, r) { return sum + r.absent; }, 0);

    var stats = [
      { label: 'Staff Tracked', value: String(totalStaff) },
      { label: 'Avg Attendance', value: avgPct == null ? '—' : avgPct.toFixed(1) + '%' },
      { label: 'Total Present Days', value: String(totalPresent) },
      { label: 'Total Absent Days', value: String(totalAbsent) }
    ];
    stats.forEach(function (st) {
      var div = document.createElement('div');
      div.className = 'tool-stat-card';
      div.innerHTML = '<div class="tool-stat-label">' + st.label + '</div><div class="tool-stat-value">' + st.value + '</div>';
      els['summary-stats'].appendChild(div);
    });
  }

  function exportCSV() {
    var monthStr = els['f-month'].value;
    if (!staff.length || !monthStr) return;

    var rows = computeSummary(monthStr);
    var headers = [
      { key: 'name', label: 'Name' },
      { key: 'empId', label: 'Employee ID' },
      { key: 'present', label: 'Present' },
      { key: 'absent', label: 'Absent' },
      { key: 'half', label: 'Half-day' },
      { key: 'leave', label: 'Leave' },
      { key: 'pct', label: 'Attendance %' }
    ];
    var csvRows = rows.map(function (r) {
      return {
        name: r.name, empId: r.empId || '', present: r.present, absent: r.absent,
        half: r.half, leave: r.leave, pct: r.pct == null ? '' : r.pct.toFixed(1)
      };
    });
    TS.downloadCSV('staff-attendance-' + monthStr + '.csv', headers, csvRows);
  }

  function renderAll() {
    renderStaffTable();
    renderGrid();
    renderSummary();
  }

  els['btn-add-staff'].addEventListener('click', addStaff);
  els['f-staff-name'].addEventListener('keydown', function (e) { if (e.key === 'Enter') addStaff(); });
  els['f-staff-empid'].addEventListener('keydown', function (e) { if (e.key === 'Enter') addStaff(); });
  els['f-month'].addEventListener('change', function () { renderGrid(); renderSummary(); });
  els['btn-export-csv'].addEventListener('click', exportCSV);

  els['f-month'].value = TS.todayISO().slice(0, 7);
  renderAll();
})();
