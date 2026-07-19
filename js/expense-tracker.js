(function () {
  'use strict';

  var EXPENSES_KEY = 'bw_tools_expenses_v1';
  var CUSTOM_CATS_KEY = 'bw_tools_expenses_custom_categories_v1';

  var FIXED_CATEGORIES = ['Rent', 'Salaries', 'Utilities', 'Raw Materials / Inventory', 'Marketing', 'Transport', 'Equipment', 'Misc'];
  var PAYMENT_MODES = ['Cash', 'UPI', 'Card', 'Bank Transfer', 'Cheque'];
  var CUSTOM_CATEGORY_VALUE = '__custom__';

  var TS = window.ToolsShared;

  var expenses = TS.loadJSON(EXPENSES_KEY, []);
  var customCats = TS.loadJSON(CUSTOM_CATS_KEY, []);

  var els = {};
  [
    'stat-month', 'stat-year', 'stat-alltime', 'stat-filtered',
    'ae-date', 'ae-category', 'ae-category-custom-wrap', 'ae-category-custom',
    'ae-description', 'ae-amount', 'ae-paymentmode', 'ae-note', 'btn-add-expense',
    'tb-month', 'tb-category', 'tb-search', 'btn-export-csv',
    'expense-chart', 'expense-chart-bars',
    'expenses-body', 'expenses-empty', 'expenses-count'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  function esc(s) { return TS.escapeHtml(s); }
  function num(n) { n = Number(n); return isNaN(n) ? 0 : n; }

  function saveExpenses() { TS.saveJSON(EXPENSES_KEY, expenses); }
  function saveCustomCats() { TS.saveJSON(CUSTOM_CATS_KEY, customCats); }

  function findExpense(id) {
    for (var i = 0; i < expenses.length; i++) { if (expenses[i].id === id) return expenses[i]; }
    return null;
  }

  // ── category list (fixed + remembered custom + anything already in data) ──
  function getAllCategories() {
    var extra = {};
    customCats.forEach(function (c) { if (FIXED_CATEGORIES.indexOf(c) === -1) extra[c] = true; });
    expenses.forEach(function (e) { if (e.category && FIXED_CATEGORIES.indexOf(e.category) === -1) extra[e.category] = true; });
    var extraList = Object.keys(extra).sort();
    return FIXED_CATEGORIES.concat(extraList);
  }

  function renderCategoryOptions() {
    var cats = getAllCategories();

    var addSelect = els['ae-category'];
    var addCurrent = addSelect.value;
    addSelect.innerHTML = '';
    cats.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      addSelect.appendChild(opt);
    });
    var customOpt = document.createElement('option');
    customOpt.value = CUSTOM_CATEGORY_VALUE; customOpt.textContent = '+ Add new category…';
    addSelect.appendChild(customOpt);
    if (cats.indexOf(addCurrent) !== -1 || addCurrent === CUSTOM_CATEGORY_VALUE) addSelect.value = addCurrent;

    var filterSelect = els['tb-category'];
    var filterCurrent = filterSelect.value;
    filterSelect.innerHTML = '';
    var allOpt = document.createElement('option');
    allOpt.value = ''; allOpt.textContent = 'All Categories';
    filterSelect.appendChild(allOpt);
    cats.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      filterSelect.appendChild(opt);
    });
    if (cats.indexOf(filterCurrent) !== -1) filterSelect.value = filterCurrent;
  }

  function populatePaymentModes() {
    PAYMENT_MODES.forEach(function (p) {
      var opt = document.createElement('option');
      opt.value = p; opt.textContent = p;
      els['ae-paymentmode'].appendChild(opt);
    });
  }

  // ── stats (always computed from the full dataset, not the filtered view) ──
  function renderStats() {
    var currentMonth = TS.todayISO().slice(0, 7);
    var currentYear = TS.todayISO().slice(0, 4);

    var monthTotal = 0, yearTotal = 0, allTotal = 0;
    expenses.forEach(function (e) {
      var amt = num(e.amount);
      allTotal += amt;
      if (e.date && e.date.slice(0, 7) === currentMonth) monthTotal += amt;
      if (e.date && e.date.slice(0, 4) === currentYear) yearTotal += amt;
    });

    els['stat-month'].textContent = TS.formatMoney(monthTotal);
    els['stat-year'].textContent = TS.formatMoney(yearTotal);
    els['stat-alltime'].textContent = TS.formatMoney(allTotal);
  }

  // ── filters ──
  function getFilters() {
    return {
      month: els['tb-month'].value,
      category: els['tb-category'].value,
      search: els['tb-search'].value.trim().toLowerCase()
    };
  }

  function filteredExpenses() {
    var f = getFilters();
    return expenses.filter(function (e) {
      if (f.month && (!e.date || e.date.slice(0, 7) !== f.month)) return false;
      if (f.category && e.category !== f.category) return false;
      if (f.search) {
        var hay = ((e.description || '') + ' ' + (e.note || '')).toLowerCase();
        if (hay.indexOf(f.search) === -1) return false;
      }
      return true;
    }).sort(function (a, b) {
      if (a.date === b.date) return 0;
      return a.date < b.date ? 1 : -1; // newest first
    });
  }

  // ── table ──
  function renderTable() {
    var filtered = filteredExpenses();
    var tbody = els['expenses-body'];
    tbody.innerHTML = '';
    els['expenses-count'].textContent = String(filtered.length);
    els['expenses-empty'].style.display = filtered.length ? 'none' : '';
    els['expenses-empty'].textContent = expenses.length
      ? 'No expenses match the current filters.'
      : 'No expenses yet, add your first expense above.';

    filtered.forEach(function (e) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + TS.formatDateDisplay(e.date) + '</td>' +
        '<td><span class="tool-badge tool-badge-neutral">' + esc(e.category) + '</span></td>' +
        '<td>' + esc(e.description) + '</td>' +
        '<td>' + esc(e.paymentMode) + '</td>' +
        '<td>' + TS.formatMoney(e.amount) + '</td>' +
        '<td><button type="button" class="btn-danger del-btn" data-id="' + e.id + '">Delete</button></td>';
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.del-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteExpense(btn.getAttribute('data-id')); });
    });

    var filteredTotal = filtered.reduce(function (sum, e) { return sum + num(e.amount); }, 0);
    els['stat-filtered'].textContent = TS.formatMoney(filteredTotal);

    renderChart();
  }

  // ── chart: category breakdown for the month currently selected in the toolbar ──
  function renderChart() {
    var month = els['tb-month'].value;
    var wrap = els['expense-chart'];
    var bars = els['expense-chart-bars'];
    bars.innerHTML = '';

    if (!month) { wrap.style.display = 'none'; return; }

    var monthExpenses = expenses.filter(function (e) { return e.date && e.date.slice(0, 7) === month; });
    if (!monthExpenses.length) { wrap.style.display = 'none'; return; }

    var totals = {};
    monthExpenses.forEach(function (e) {
      totals[e.category] = (totals[e.category] || 0) + num(e.amount);
    });
    var entries = Object.keys(totals).map(function (cat) { return { category: cat, total: totals[cat] }; });
    entries.sort(function (a, b) { return b.total - a.total; });
    var maxTotal = entries.length ? entries[0].total : 0;

    entries.forEach(function (entry) {
      var pct = maxTotal > 0 ? (entry.total / maxTotal * 100) : 0;
      var row = document.createElement('div');
      row.className = 'tool-chart-row';
      row.innerHTML =
        '<div class="tool-chart-label">' + esc(entry.category) + '</div>' +
        '<div class="tool-chart-bar-track"><div class="tool-chart-bar-fill" style="width:' + pct.toFixed(1) + '%;"></div></div>' +
        '<div class="tool-chart-amount">' + TS.formatMoney(entry.total) + '</div>';
      bars.appendChild(row);
    });

    wrap.style.display = '';
  }

  function deleteExpense(id) {
    var exp = findExpense(id);
    if (!exp) return;
    if (!confirm('Delete this expense ("' + exp.description + '", ' + TS.formatMoney(exp.amount) + ')? This cannot be undone.')) return;
    expenses = expenses.filter(function (e) { return e.id !== id; });
    saveExpenses();
    renderAll();
  }

  // ── add expense ──
  function resetAddForm() {
    els['ae-date'].value = TS.todayISO();
    els['ae-category'].value = FIXED_CATEGORIES[0];
    els['ae-category-custom-wrap'].style.display = 'none';
    els['ae-category-custom'].value = '';
    els['ae-description'].value = '';
    els['ae-amount'].value = '';
    els['ae-paymentmode'].value = PAYMENT_MODES[0];
    els['ae-note'].value = '';
    els['ae-description'].focus();
  }

  function addExpense() {
    var date = els['ae-date'].value || TS.todayISO();

    var categorySel = els['ae-category'].value;
    var category;
    if (categorySel === CUSTOM_CATEGORY_VALUE) {
      category = els['ae-category-custom'].value.trim();
      if (!category) {
        alert('Enter a name for the custom category.');
        els['ae-category-custom'].focus();
        return;
      }
    } else {
      category = categorySel;
    }

    var description = els['ae-description'].value.trim();
    if (!description) {
      alert('Description is required.');
      els['ae-description'].focus();
      return;
    }

    var amount = parseFloat(els['ae-amount'].value);
    if (isNaN(amount) || amount <= 0) {
      alert('Enter a valid amount greater than 0.');
      els['ae-amount'].focus();
      return;
    }

    var paymentMode = els['ae-paymentmode'].value;
    var note = els['ae-note'].value.trim();

    if (FIXED_CATEGORIES.indexOf(category) === -1 && customCats.indexOf(category) === -1) {
      customCats.push(category);
      saveCustomCats();
    }

    expenses.push({
      id: TS.uid(),
      date: date,
      category: category,
      description: description,
      amount: amount,
      paymentMode: paymentMode,
      note: note
    });
    saveExpenses();

    renderAll();
    resetAddForm();
  }

  // ── export ──
  function exportCSV() {
    var filtered = filteredExpenses();
    if (!filtered.length) { alert('No expenses match the current filters to export.'); return; }
    var headers = [
      { key: 'date', label: 'Date' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'paymentMode', label: 'Payment Mode' },
      { key: 'amount', label: 'Amount' },
      { key: 'note', label: 'Note' }
    ];
    TS.downloadCSV('expenses.csv', headers, filtered);
  }

  function renderAll() {
    renderStats();
    renderCategoryOptions();
    renderTable();
  }

  // ── wire up ──
  els['btn-add-expense'].addEventListener('click', addExpense);
  els['btn-export-csv'].addEventListener('click', exportCSV);
  els['tb-month'].addEventListener('input', renderTable);
  els['tb-category'].addEventListener('change', renderTable);
  els['tb-search'].addEventListener('input', renderTable);
  els['ae-category'].addEventListener('change', function () {
    var show = els['ae-category'].value === CUSTOM_CATEGORY_VALUE;
    els['ae-category-custom-wrap'].style.display = show ? '' : 'none';
    if (show) els['ae-category-custom'].focus();
  });

  populatePaymentModes();
  els['ae-date'].value = TS.todayISO();
  els['ae-paymentmode'].value = PAYMENT_MODES[0];
  els['tb-month'].value = TS.todayISO().slice(0, 7);

  renderAll();
})();
