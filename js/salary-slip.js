(function () {
  'use strict';

  var TS = window.ToolsShared;

  var EMP_KEY = 'bw_tools_salary_employees_v1';
  var SLIP_KEY = 'bw_tools_salary_slips_v1';
  var ER_KEY = 'bw_tools_salary_employer_v1';       // this tool's own employer-details fallback
  var GST_SELLER_KEY = 'bw_gst_seller_v1';           // read-only: reused from the GST Invoice tool

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  var els = {};
  [
    'er-name','er-addr',
    'emp-name','emp-designation','emp-empid','emp-pan','btn-emp-save','btn-emp-cancel','emp-tbody','emp-empty',
    'slip-employee','slip-month','slip-year',
    'earn-basic','earn-hra','earn-conveyance','earn-other',
    'ded-pf','ded-pt','ded-tds','ded-other',
    'stat-gross','stat-deductions','stat-net',
    'btn-save-preview','btn-print','slip-note',
    'history-tbody','history-empty'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var employees = TS.loadJSON(EMP_KEY, []);
  var slips = TS.loadJSON(SLIP_KEY, []);
  var editingEmpId = null;

  // ── employer details (top of slip header) ──
  function loadEmployer() {
    var saved = TS.loadJSON(ER_KEY, null);
    if (saved) {
      els['er-name'].value = saved.name || '';
      els['er-addr'].value = saved.addr || '';
      return;
    }
    var gstSeller = TS.loadJSON(GST_SELLER_KEY, null);
    if (gstSeller) {
      els['er-name'].value = gstSeller.name || '';
      els['er-addr'].value = gstSeller.addr || '';
    }
  }
  function saveEmployer() {
    TS.saveJSON(ER_KEY, { name: els['er-name'].value, addr: els['er-addr'].value });
  }
  els['er-name'].addEventListener('input', function () { saveEmployer(); renderPreviewHeader(); });
  els['er-addr'].addEventListener('input', function () { saveEmployer(); renderPreviewHeader(); });

  function renderPreviewHeader() {
    document.getElementById('p-employer-name').textContent = els['er-name'].value || 'Your Business Name';
    document.getElementById('p-employer-addr').textContent = els['er-addr'].value || 'Address line';
  }

  // ── month/year selects ──
  function populateMonthSelect() {
    MONTHS.forEach(function (m, i) {
      var opt = document.createElement('option');
      opt.value = String(i + 1);
      opt.textContent = m;
      els['slip-month'].appendChild(opt);
    });
  }
  populateMonthSelect();
  var now = new Date();
  els['slip-month'].value = String(now.getMonth() + 1);
  els['slip-year'].value = now.getFullYear();

  // ── employees CRUD ──
  function saveEmployees() { TS.saveJSON(EMP_KEY, employees); }

  function findEmployee(id) {
    for (var i = 0; i < employees.length; i++) {
      if (employees[i].id === id) return employees[i];
    }
    return null;
  }

  function renderEmployeeTable() {
    els['emp-tbody'].innerHTML = '';
    els['emp-empty'].style.display = employees.length ? 'none' : '';
    employees.forEach(function (emp) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + TS.escapeHtml(emp.name) + '</td>' +
        '<td>' + TS.escapeHtml(emp.designation || '—') + '</td>' +
        '<td>' + TS.escapeHtml(emp.empId || '—') + '</td>' +
        '<td>' + TS.escapeHtml(emp.pan || '—') + '</td>' +
        '<td style="white-space:nowrap;">' +
          '<button type="button" class="btn-primary btn-sm" data-act="slip" data-id="' + emp.id + '">Generate Slip</button> ' +
          '<button type="button" class="btn-ghost btn-sm" data-act="edit" data-id="' + emp.id + '">Edit</button> ' +
          '<button type="button" class="btn-danger" data-act="delete" data-id="' + emp.id + '">Delete</button>' +
        '</td>';
      els['emp-tbody'].appendChild(tr);
    });
  }

  function renderEmployeeSelect() {
    var prevValue = els['slip-employee'].value;
    els['slip-employee'].innerHTML = '';
    var placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = employees.length ? 'Choose an employee…' : 'Add an employee first';
    els['slip-employee'].appendChild(placeholder);
    employees.forEach(function (emp) {
      var opt = document.createElement('option');
      opt.value = emp.id;
      opt.textContent = emp.name + (emp.designation ? ' (' + emp.designation + ')' : '');
      els['slip-employee'].appendChild(opt);
    });
    if (findEmployee(prevValue)) els['slip-employee'].value = prevValue;
  }

  function clearEmployeeForm() {
    els['emp-name'].value = '';
    els['emp-designation'].value = '';
    els['emp-empid'].value = '';
    els['emp-pan'].value = '';
    editingEmpId = null;
    els['btn-emp-save'].textContent = '+ Add Employee';
    els['btn-emp-cancel'].style.display = 'none';
  }

  els['btn-emp-save'].addEventListener('click', function () {
    var name = els['emp-name'].value.trim();
    if (!name) { alert('Employee name is required.'); return; }
    var data = {
      name: name,
      designation: els['emp-designation'].value.trim(),
      empId: els['emp-empid'].value.trim(),
      pan: els['emp-pan'].value.trim().toUpperCase()
    };
    if (editingEmpId) {
      var emp = findEmployee(editingEmpId);
      if (emp) {
        emp.name = data.name; emp.designation = data.designation; emp.empId = data.empId; emp.pan = data.pan;
      }
    } else {
      data.id = TS.uid();
      employees.push(data);
    }
    saveEmployees();
    clearEmployeeForm();
    renderEmployeeTable();
    renderEmployeeSelect();
    renderHistoryTable();
  });

  els['btn-emp-cancel'].addEventListener('click', clearEmployeeForm);

  els['emp-tbody'].addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-act]');
    if (!btn) return;
    var id = btn.getAttribute('data-id');
    var act = btn.getAttribute('data-act');
    var emp = findEmployee(id);
    if (!emp) return;

    if (act === 'edit') {
      editingEmpId = id;
      els['emp-name'].value = emp.name;
      els['emp-designation'].value = emp.designation || '';
      els['emp-empid'].value = emp.empId || '';
      els['emp-pan'].value = emp.pan || '';
      els['btn-emp-save'].textContent = 'Update Employee';
      els['btn-emp-cancel'].style.display = '';
      els['emp-name'].focus();
    } else if (act === 'delete') {
      if (confirm('Remove ' + emp.name + '? Past slips for this employee stay in the history.')) {
        employees = employees.filter(function (x) { return x.id !== id; });
        saveEmployees();
        if (editingEmpId === id) clearEmployeeForm();
        renderEmployeeTable();
        renderEmployeeSelect();
      }
    } else if (act === 'slip') {
      els['slip-employee'].value = id;
      updateLiveTotals();
      els['slip-employee'].closest('.tool-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
      els['slip-employee'].focus();
    }
  });

  // ── live totals on the slip form ──
  function numVal(el) {
    var v = parseFloat(el.value);
    return isNaN(v) ? 0 : v;
  }

  function currentEarnings() {
    return {
      basic: numVal(els['earn-basic']),
      hra: numVal(els['earn-hra']),
      conveyance: numVal(els['earn-conveyance']),
      otherAllowance: numVal(els['earn-other'])
    };
  }
  function currentDeductions() {
    return {
      pf: numVal(els['ded-pf']),
      professionalTax: numVal(els['ded-pt']),
      tds: numVal(els['ded-tds']),
      otherDeduction: numVal(els['ded-other'])
    };
  }
  function sumObj(o) {
    var t = 0;
    for (var k in o) { if (o.hasOwnProperty(k)) t += o[k]; }
    return t;
  }

  function updateLiveTotals() {
    var gross = sumObj(currentEarnings());
    var totalDed = sumObj(currentDeductions());
    var net = gross - totalDed;
    els['stat-gross'].textContent = TS.formatMoney(gross);
    els['stat-deductions'].textContent = TS.formatMoney(totalDed);
    els['stat-net'].textContent = TS.formatMoney(net);
  }

  ['earn-basic','earn-hra','earn-conveyance','earn-other','ded-pf','ded-pt','ded-tds','ded-other'].forEach(function (id) {
    els[id].addEventListener('input', updateLiveTotals);
  });

  // ── save & preview ──
  function renderPreview(record) {
    renderPreviewHeader();
    var emp = findEmployee(record.employeeId);
    document.getElementById('p-emp-name').textContent = record.employeeName || '—';
    document.getElementById('p-emp-designation').textContent = (emp && emp.designation) || '—';
    document.getElementById('p-emp-empid').textContent = (emp && emp.empId) || '—';
    document.getElementById('p-emp-pan').textContent = (emp && emp.pan) || '—';

    document.getElementById('p-period').textContent = MONTHS[record.month - 1] + ' ' + record.year;
    document.getElementById('p-generated').textContent = TS.formatDateDisplay(record.generatedAt.slice(0, 10));

    document.getElementById('p-earn-basic').textContent = TS.formatMoney(record.earnings.basic);
    document.getElementById('p-earn-hra').textContent = TS.formatMoney(record.earnings.hra);
    document.getElementById('p-earn-conveyance').textContent = TS.formatMoney(record.earnings.conveyance);
    document.getElementById('p-earn-other').textContent = TS.formatMoney(record.earnings.otherAllowance);

    document.getElementById('p-ded-pf').textContent = TS.formatMoney(record.deductions.pf);
    document.getElementById('p-ded-pt').textContent = TS.formatMoney(record.deductions.professionalTax);
    document.getElementById('p-ded-tds').textContent = TS.formatMoney(record.deductions.tds);
    document.getElementById('p-ded-other').textContent = TS.formatMoney(record.deductions.otherDeduction);

    document.getElementById('p-gross').textContent = TS.formatMoney(record.grossEarnings);
    document.getElementById('p-total-ded').textContent = TS.formatMoney(record.totalDeductions);
    document.getElementById('p-netpay').textContent = TS.formatMoney(record.netPay);
    document.getElementById('p-words').textContent = TS.amountInWords(Math.max(record.netPay, 0));
  }

  els['btn-save-preview'].addEventListener('click', function () {
    var employeeId = els['slip-employee'].value;
    var emp = findEmployee(employeeId);
    if (!emp) {
      els['slip-note'].textContent = 'Choose an employee before saving a slip.';
      els['slip-note'].style.color = '#F87171';
      return;
    }
    var earnings = currentEarnings();
    var deductions = currentDeductions();
    var grossEarnings = sumObj(earnings);
    var totalDeductions = sumObj(deductions);
    var netPay = grossEarnings - totalDeductions;

    var record = {
      id: TS.uid(),
      employeeId: employeeId,
      employeeName: emp.name,
      month: parseInt(els['slip-month'].value, 10),
      year: parseInt(els['slip-year'].value, 10) || now.getFullYear(),
      earnings: earnings,
      deductions: deductions,
      grossEarnings: grossEarnings,
      totalDeductions: totalDeductions,
      netPay: netPay,
      generatedAt: new Date().toISOString()
    };
    slips.unshift(record);
    TS.saveJSON(SLIP_KEY, slips);

    renderPreview(record);
    renderHistoryTable();
    els['slip-note'].textContent = 'Slip saved for ' + emp.name + ' — ' + MONTHS[record.month - 1] + ' ' + record.year + '.';
    els['slip-note'].style.color = '';
    document.getElementById('slip-sheet').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  els['btn-print'].addEventListener('click', function () { window.print(); });

  // ── slip history ──
  function findSlip(id) {
    for (var i = 0; i < slips.length; i++) {
      if (slips[i].id === id) return slips[i];
    }
    return null;
  }

  function renderHistoryTable() {
    els['history-tbody'].innerHTML = '';
    els['history-empty'].style.display = slips.length ? 'none' : '';
    slips.forEach(function (s) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + TS.escapeHtml(s.employeeName) + '</td>' +
        '<td>' + MONTHS[s.month - 1] + ' ' + s.year + '</td>' +
        '<td>' + TS.formatMoney(s.netPay) + '</td>' +
        '<td>' + TS.formatDateDisplay(s.generatedAt.slice(0, 10)) + '</td>' +
        '<td><button type="button" class="btn-ghost btn-sm" data-id="' + s.id + '">View / Print</button></td>';
      els['history-tbody'].appendChild(tr);
    });
  }

  els['history-tbody'].addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-id]');
    if (!btn) return;
    var record = findSlip(btn.getAttribute('data-id'));
    if (!record) return;
    renderPreview(record);
    document.getElementById('slip-sheet').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ── init ──
  loadEmployer();
  renderPreviewHeader();
  renderEmployeeTable();
  renderEmployeeSelect();
  renderHistoryTable();
  updateLiveTotals();

  // show a blank/zeroed preview on load so the sheet never looks broken
  renderPreview({
    employeeId: '', employeeName: '—',
    month: now.getMonth() + 1, year: now.getFullYear(),
    earnings: { basic: 0, hra: 0, conveyance: 0, otherAllowance: 0 },
    deductions: { pf: 0, professionalTax: 0, tds: 0, otherDeduction: 0 },
    grossEarnings: 0, totalDeductions: 0, netPay: 0,
    generatedAt: new Date().toISOString()
  });
})();
