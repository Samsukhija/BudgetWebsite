(function () {
  'use strict';

  var ITEMS_KEY = 'bw_tools_inventory_v1';
  var MOVES_KEY = 'bw_tools_inventory_moves_v1';
  var REASONS = ['Purchase', 'Sale', 'Return', 'Damage', 'Correction'];

  var TS = window.ToolsShared;

  var items = TS.loadJSON(ITEMS_KEY, []);
  var moves = TS.loadJSON(MOVES_KEY, []); // newest-first (we always unshift)

  var adjustingId = null; // id of the item whose inline "Adjust Stock" form is open

  var els = {};
  [
    'stat-skus', 'stat-value', 'stat-lowstock',
    'ai-name', 'ai-sku', 'ai-category', 'ai-unit', 'ai-qty', 'ai-reorder', 'ai-cost', 'ai-sell',
    'btn-add-item', 'btn-export-csv',
    'items-body', 'items-empty', 'items-count',
    'moves-body', 'moves-empty'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  function esc(s) { return TS.escapeHtml(s); }
  function money(n) { return TS.formatMoney(Number(n) || 0); }
  function num(n) { return isNaN(n) ? 0 : Number(n); }

  function saveItems() { TS.saveJSON(ITEMS_KEY, items); }
  function saveMoves() { TS.saveJSON(MOVES_KEY, moves); }

  function findItem(id) {
    for (var i = 0; i < items.length; i++) { if (items[i].id === id) return items[i]; }
    return null;
  }

  // ── stats ──
  function renderStats() {
    var totalSkus = items.length;
    var totalValue = items.reduce(function (sum, it) {
      return sum + num(it.qty) * num(it.costPrice);
    }, 0);
    var lowCount = items.filter(function (it) {
      return num(it.qty) <= num(it.reorderLevel);
    }).length;

    els['stat-skus'].textContent = String(totalSkus);
    els['stat-value'].textContent = money(totalValue);
    els['stat-lowstock'].textContent = String(lowCount);
  }

  // ── items table ──
  function renderItems() {
    var tbody = els['items-body'];
    tbody.innerHTML = '';
    els['items-count'].textContent = String(items.length);
    els['items-empty'].style.display = items.length ? 'none' : '';

    items.forEach(function (it) {
      var isLow = num(it.qty) <= num(it.reorderLevel);
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + esc(it.name) + '</td>' +
        '<td>' + esc(it.sku || '—') + '</td>' +
        '<td>' + esc(it.category || '—') + '</td>' +
        '<td>' + it.qty + (isLow ? ' <span class="tool-badge tool-badge-warn">Low Stock</span>' : '') + '</td>' +
        '<td>' + esc(it.unit || '—') + '</td>' +
        '<td>' + money(it.costPrice) + '</td>' +
        '<td>' + money(it.sellPrice) + '</td>' +
        '<td class="tool-actions-cell">' +
          '<button type="button" class="btn-sm btn-ghost adj-btn" data-id="' + it.id + '">Adjust Stock</button>' +
          '<button type="button" class="btn-danger del-btn" data-id="' + it.id + '">Delete</button>' +
        '</td>';
      tbody.appendChild(tr);

      if (adjustingId === it.id) {
        var trAdj = document.createElement('tr');
        trAdj.className = 'tool-adjust-row';
        var td = document.createElement('td');
        td.colSpan = 8;
        td.innerHTML =
          '<div class="tool-adjust-form">' +
            '<label>Qty Change<input type="number" step="0.01" id="adj-qty" placeholder="e.g. -5 or 10"></label>' +
            '<label>Reason<select id="adj-reason">' +
              REASONS.map(function (r) { return '<option value="' + r + '">' + r + '</option>'; }).join('') +
            '</select></label>' +
            '<label class="note-field">Note<input type="text" id="adj-note" placeholder="optional"></label>' +
            '<button type="button" class="btn-primary btn-sm" id="adj-save">Save</button>' +
            '<button type="button" class="btn-ghost btn-sm" id="adj-cancel">Cancel</button>' +
          '</div>';
        trAdj.appendChild(td);
        tbody.appendChild(trAdj);

        document.getElementById('adj-save').addEventListener('click', function () { submitAdjust(it.id); });
        document.getElementById('adj-cancel').addEventListener('click', function () { adjustingId = null; renderItems(); });
        document.getElementById('adj-qty').focus();
      }
    });

    tbody.querySelectorAll('.adj-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        adjustingId = (adjustingId === btn.getAttribute('data-id')) ? null : btn.getAttribute('data-id');
        renderItems();
      });
    });
    tbody.querySelectorAll('.del-btn').forEach(function (btn) {
      btn.addEventListener('click', function () { deleteItem(btn.getAttribute('data-id')); });
    });
  }

  function submitAdjust(id) {
    var item = findItem(id);
    if (!item) return;

    var qtyChangeInput = document.getElementById('adj-qty');
    var reasonSelect = document.getElementById('adj-reason');
    var noteInput = document.getElementById('adj-note');

    var rawChange = parseFloat(qtyChangeInput.value);
    if (isNaN(rawChange) || rawChange === 0) {
      alert('Enter a non-zero quantity change (positive to add stock, negative to remove).');
      qtyChangeInput.focus();
      return;
    }

    var currentQty = num(item.qty);
    var proposedQty = currentQty + rawChange;
    var clamped = false;
    if (proposedQty < 0) { proposedQty = 0; clamped = true; }

    var actualChange = proposedQty - currentQty;
    if (actualChange === 0) {
      alert('Stock is already at 0 — nothing to remove.');
      return;
    }

    item.qty = proposedQty;

    moves.unshift({
      id: TS.uid(),
      itemId: item.id,
      date: TS.todayISO(),
      qtyChange: actualChange,
      reason: reasonSelect.value,
      note: noteInput.value.trim()
    });

    saveItems();
    saveMoves();
    adjustingId = null;
    renderAll();

    if (clamped) {
      alert('That change would have taken stock below 0, so it was clamped — quantity is now 0 (recorded change: ' + actualChange + ').');
    }
  }

  function deleteItem(id) {
    var item = findItem(id);
    if (!item) return;
    if (!confirm('Delete "' + item.name + '"? This cannot be undone. Its past stock movements stay in the history log.')) return;
    items = items.filter(function (it) { return it.id !== id; });
    if (adjustingId === id) adjustingId = null;
    saveItems();
    renderAll();
  }

  // ── movement history ──
  function renderMoves() {
    var tbody = els['moves-body'];
    tbody.innerHTML = '';
    var last20 = moves.slice(0, 20);
    els['moves-empty'].style.display = last20.length ? 'none' : '';

    last20.forEach(function (mv) {
      var item = findItem(mv.itemId);
      var name = item ? item.name : '(deleted item)';
      var sign = mv.qtyChange > 0 ? '+' : '';
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + esc(name) + '</td>' +
        '<td>' + TS.formatDateDisplay(mv.date) + '</td>' +
        '<td>' + sign + mv.qtyChange + '</td>' +
        '<td>' + esc(mv.reason) + '</td>' +
        '<td>' + esc(mv.note || '—') + '</td>';
      tbody.appendChild(tr);
    });
  }

  function renderAll() {
    renderStats();
    renderItems();
    renderMoves();
  }

  // ── add item ──
  function clearAddForm() {
    els['ai-name'].value = '';
    els['ai-sku'].value = '';
    els['ai-category'].value = '';
    els['ai-unit'].value = 'pcs';
    els['ai-qty'].value = '0';
    els['ai-reorder'].value = '0';
    els['ai-cost'].value = '0';
    els['ai-sell'].value = '0';
    els['ai-name'].focus();
  }

  function addItem() {
    var name = els['ai-name'].value.trim();
    if (!name) {
      alert('Item name is required.');
      els['ai-name'].focus();
      return;
    }

    var qty = parseFloat(els['ai-qty'].value); if (isNaN(qty) || qty < 0) qty = 0;
    var reorderLevel = parseFloat(els['ai-reorder'].value); if (isNaN(reorderLevel) || reorderLevel < 0) reorderLevel = 0;
    var costPrice = parseFloat(els['ai-cost'].value); if (isNaN(costPrice) || costPrice < 0) costPrice = 0;
    var sellPrice = parseFloat(els['ai-sell'].value); if (isNaN(sellPrice) || sellPrice < 0) sellPrice = 0;

    var item = {
      id: TS.uid(),
      name: name,
      sku: els['ai-sku'].value.trim(),
      category: els['ai-category'].value.trim(),
      qty: qty,
      unit: els['ai-unit'].value.trim() || 'pcs',
      reorderLevel: reorderLevel,
      costPrice: costPrice,
      sellPrice: sellPrice
    };
    items.push(item);

    if (qty > 0) {
      moves.unshift({
        id: TS.uid(),
        itemId: item.id,
        date: TS.todayISO(),
        qtyChange: qty,
        reason: 'Purchase',
        note: 'Initial stock on add'
      });
      saveMoves();
    }

    saveItems();
    clearAddForm();
    renderAll();
  }

  // ── export ──
  function exportCSV() {
    if (!items.length) { alert('No items to export yet.'); return; }
    var headers = [
      { key: 'name', label: 'Name' },
      { key: 'sku', label: 'SKU' },
      { key: 'category', label: 'Category' },
      { key: 'qty', label: 'Qty on Hand' },
      { key: 'unit', label: 'Unit' },
      { key: 'reorderLevel', label: 'Reorder Level' },
      { key: 'costPrice', label: 'Cost Price' },
      { key: 'sellPrice', label: 'Sell Price' }
    ];
    TS.downloadCSV('inventory-items.csv', headers, items);
  }

  // ── wire up ──
  els['btn-add-item'].addEventListener('click', addItem);
  els['btn-export-csv'].addEventListener('click', exportCSV);

  renderAll();
})();
