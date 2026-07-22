/* /app/stock/ — the Stock & Suppliers Pack workspace: links each inventory
   item to its preferred vendor (unlike the free inventory-tracker and
   vendor-tracker tools, which are two disconnected lists), flags low stock,
   and puts a one-tap "Reorder on WhatsApp" button right on the item, pre-
   addressed to that item's own supplier. Local-first: no backend yet, same
   localStorage pattern as the rest of the site. */
(function () {
  'use strict';

  var TS = window.ToolsShared;

  // ── entitlement gate ──
  var user = window.BWAuth ? BWAuth.currentUser() : null;
  if (!user) { location.href = '/app/'; return; }
  if (!BWEntitlement.has(user.email, 'stock')) { location.href = '/app/'; return; }

  var VENDOR_KEY = 'bw_pack_vendors_v1';
  var INVENTORY_KEY = 'bw_pack_inventory_v1';

  function esc(s) { return TS.escapeHtml(s); }
  function num(n) { n = parseFloat(n); return isNaN(n) ? 0 : n; }

  // ═══════════════════ data ═══════════════════
  function listVendors() { return TS.loadJSON(VENDOR_KEY, []); }
  function saveVendors(arr) { TS.saveJSON(VENDOR_KEY, arr); }
  function listInventory() { return TS.loadJSON(INVENTORY_KEY, []); }
  function saveInventory(arr) { TS.saveJSON(INVENTORY_KEY, arr); }

  function findVendor(id) {
    if (!id) return null;
    var vendors = listVendors();
    for (var i = 0; i < vendors.length; i++) { if (vendors[i].id === id) return vendors[i]; }
    return null;
  }
  function linkedItemCount(vendorId) {
    return listInventory().filter(function (it) { return it.vendorId === vendorId; }).length;
  }
  function isLow(it) { return num(it.quantity) <= num(it.lowStockThreshold); }

  // ═══════════════════ tabs ═══════════════════
  document.querySelectorAll('.stock-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.stock-tab').forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.getElementById('tab-inventory').hidden = btn.dataset.tab !== 'inventory';
      document.getElementById('tab-vendors').hidden = btn.dataset.tab !== 'vendors';
      if (btn.dataset.tab === 'vendors') renderVendorList();
    });
  });

  function showInvView(which) {
    document.getElementById('inv-list-view').hidden = which !== 'list';
    document.getElementById('inv-form-view').hidden = which !== 'form';
  }
  function showVndView(which) {
    document.getElementById('vnd-list-view').hidden = which !== 'list';
    document.getElementById('vnd-form-view').hidden = which !== 'form';
  }

  // ═══════════════════ INVENTORY ═══════════════════
  function populateVendorSelect(sel, selectedId) {
    sel.innerHTML = '';
    var opt0 = document.createElement('option');
    opt0.value = ''; opt0.textContent = 'No vendor linked';
    sel.appendChild(opt0);
    listVendors().forEach(function (v) {
      var opt = document.createElement('option');
      opt.value = v.id; opt.textContent = v.name;
      sel.appendChild(opt);
    });
    sel.value = selectedId || '';
  }

  function renderInventoryList() {
    var items = listInventory().slice().sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
    var body = document.getElementById('inv-table-body');
    body.innerHTML = items.map(function (it) {
      var low = isLow(it);
      var vendor = findVendor(it.vendorId);
      var badge = low
        ? '<span class="tool-badge tool-badge-bad">Low Stock</span>'
        : '<span class="tool-badge tool-badge-good">OK</span>';
      var vendorCell = vendor ? esc(vendor.name) : '<span style="color:var(--text-dim);">No vendor linked</span>';
      var reorderBtn = low ? '<button type="button" class="btn-sm btn-primary inv-reorder-btn" data-id="' + it.id + '">Reorder</button>' : '';
      return '<tr data-row-id="' + it.id + '">' +
        '<td>' + esc(it.name) + '</td>' +
        '<td>' + esc(it.sku || '-') + '</td>' +
        '<td>' + num(it.quantity) + '</td>' +
        '<td>' + badge + '</td>' +
        '<td>' + vendorCell + '</td>' +
        '<td>' + TS.formatMoney(it.unitCost) + '</td>' +
        '<td><div class="tool-actions-cell">' +
          reorderBtn +
          '<button type="button" class="btn-ghost btn-sm inv-edit-btn" data-id="' + it.id + '">Edit</button>' +
          '<button type="button" class="btn-danger inv-del-btn" data-id="' + it.id + '">Delete</button>' +
        '</div><div class="stock-reorder-msg" data-msg-id="' + it.id + '" hidden></div></td>' +
        '</tr>';
    }).join('');
    document.getElementById('inv-empty').hidden = items.length > 0;

    body.querySelectorAll('.inv-edit-btn').forEach(function (b) { b.addEventListener('click', function () { openItemForm(b.dataset.id); }); });
    body.querySelectorAll('.inv-del-btn').forEach(function (b) { b.addEventListener('click', function () { deleteItem(b.dataset.id); }); });
    body.querySelectorAll('.inv-reorder-btn').forEach(function (b) { b.addEventListener('click', function () { reorderItem(b.dataset.id); }); });

    renderStats();
  }

  function reorderItem(id) {
    var item = listInventory().filter(function (r) { return r.id === id; })[0];
    if (!item) return;
    var msgEl = document.querySelector('.stock-reorder-msg[data-msg-id="' + id + '"]');
    var vendor = findVendor(item.vendorId);

    function showMsg(text) {
      if (!msgEl) { alert(text); return; }
      msgEl.textContent = text;
      msgEl.hidden = false;
    }

    if (!vendor) { showMsg('No vendor linked yet — edit this item and link a vendor first.'); return; }
    var digits = (vendor.phone || '').replace(/\D/g, '');
    if (digits.length !== 10) { showMsg(esc(vendor.name) + ' has no valid 10-digit phone number saved — edit the vendor to add one.'); return; }

    if (msgEl) msgEl.hidden = true;
    var lines = [
      'Hi ' + vendor.name + ',',
      'We need to reorder: ' + item.name + (item.sku ? ' (' + item.sku + ')' : ''),
      'Current stock: ' + num(item.quantity) + ' (reorder level: ' + num(item.lowStockThreshold) + ')',
      'Please share availability and price.'
    ];
    window.open('https://wa.me/91' + digits + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  }

  function openItemForm(id) {
    var rec = id ? listInventory().filter(function (r) { return r.id === id; })[0] : null;
    document.getElementById('inv-form-title').textContent = rec ? 'Edit Item' : '+ New Item';
    document.getElementById('ifm-id').value = rec ? rec.id : '';
    document.getElementById('ifm-name').value = rec ? rec.name : '';
    document.getElementById('ifm-sku').value = rec ? (rec.sku || '') : '';
    document.getElementById('ifm-qty').value = rec ? rec.quantity : 0;
    document.getElementById('ifm-threshold').value = rec ? rec.lowStockThreshold : 0;
    document.getElementById('ifm-cost').value = rec ? rec.unitCost : 0;
    populateVendorSelect(document.getElementById('ifm-vendor'), rec ? rec.vendorId : '');
    showInvView('form');
    document.getElementById('ifm-name').focus();
  }

  function saveItemFromForm() {
    var name = document.getElementById('ifm-name').value.trim();
    if (!name) { alert('Item name is required.'); document.getElementById('ifm-name').focus(); return; }
    var id = document.getElementById('ifm-id').value;
    var all = listInventory();
    var rec = id ? all.filter(function (r) { return r.id === id; })[0] : null;

    var data = {
      id: rec ? rec.id : TS.uid(),
      name: name,
      sku: document.getElementById('ifm-sku').value.trim(),
      quantity: num(document.getElementById('ifm-qty').value),
      lowStockThreshold: num(document.getElementById('ifm-threshold').value),
      unitCost: num(document.getElementById('ifm-cost').value),
      vendorId: document.getElementById('ifm-vendor').value || '',
      createdAt: rec ? rec.createdAt : Date.now()
    };

    if (rec) {
      var idx = all.indexOf(rec);
      all[idx] = data;
    } else {
      all.push(data);
    }
    saveInventory(all);
    showInvView('list');
    renderInventoryList();
  }

  function deleteItem(id) {
    var item = listInventory().filter(function (r) { return r.id === id; })[0];
    if (!item) return;
    if (!confirm('Delete "' + item.name + '"? This cannot be undone.')) return;
    saveInventory(listInventory().filter(function (r) { return r.id !== id; }));
    renderInventoryList();
  }

  document.getElementById('btn-new-item').addEventListener('click', function () { openItemForm(null); });
  document.getElementById('ifm-save').addEventListener('click', saveItemFromForm);
  document.getElementById('ifm-cancel').addEventListener('click', function () { showInvView('list'); });

  // ═══════════════════ VENDORS ═══════════════════
  function renderVendorList() {
    var vendors = listVendors().slice().sort(function (a, b) { return (a.name || '').localeCompare(b.name || ''); });
    var body = document.getElementById('vnd-table-body');
    body.innerHTML = vendors.map(function (v) {
      return '<tr data-row-id="' + v.id + '">' +
        '<td>' + esc(v.name) + '</td>' +
        '<td>' + esc(v.phone || '-') + '</td>' +
        '<td>' + esc(v.supplies || '-') + '</td>' +
        '<td>' + linkedItemCount(v.id) + '</td>' +
        '<td><div class="tool-actions-cell">' +
          '<button type="button" class="btn-ghost btn-sm vnd-edit-btn" data-id="' + v.id + '">Edit</button>' +
          '<button type="button" class="btn-danger vnd-del-btn" data-id="' + v.id + '">Delete</button>' +
        '</div></td>' +
        '</tr>';
    }).join('');
    document.getElementById('vnd-empty').hidden = vendors.length > 0;

    body.querySelectorAll('.vnd-edit-btn').forEach(function (b) { b.addEventListener('click', function () { openVendorForm(b.dataset.id); }); });
    body.querySelectorAll('.vnd-del-btn').forEach(function (b) { b.addEventListener('click', function () { deleteVendor(b.dataset.id); }); });

    renderStats();
  }

  function openVendorForm(id) {
    var rec = id ? listVendors().filter(function (r) { return r.id === id; })[0] : null;
    document.getElementById('vnd-form-title').textContent = rec ? 'Edit Vendor' : '+ New Vendor';
    document.getElementById('vfm-id').value = rec ? rec.id : '';
    document.getElementById('vfm-name').value = rec ? rec.name : '';
    document.getElementById('vfm-phone').value = rec ? (rec.phone || '') : '';
    document.getElementById('vfm-supplies').value = rec ? (rec.supplies || '') : '';
    document.getElementById('vfm-notes').value = rec ? (rec.notes || '') : '';
    showVndView('form');
    document.getElementById('vfm-name').focus();
  }

  function saveVendorFromForm() {
    var name = document.getElementById('vfm-name').value.trim();
    if (!name) { alert('Vendor name is required.'); document.getElementById('vfm-name').focus(); return; }
    var id = document.getElementById('vfm-id').value;
    var all = listVendors();
    var rec = id ? all.filter(function (r) { return r.id === id; })[0] : null;

    var data = {
      id: rec ? rec.id : TS.uid(),
      name: name,
      phone: document.getElementById('vfm-phone').value.trim(),
      supplies: document.getElementById('vfm-supplies').value.trim(),
      notes: document.getElementById('vfm-notes').value.trim()
    };

    if (rec) {
      var idx = all.indexOf(rec);
      all[idx] = data;
    } else {
      all.push(data);
    }
    saveVendors(all);
    showVndView('list');
    renderVendorList();
  }

  function deleteVendor(id) {
    var v = listVendors().filter(function (r) { return r.id === id; })[0];
    if (!v) return;
    var linked = linkedItemCount(id);
    var msg = 'Delete vendor "' + v.name + '"? This cannot be undone.';
    if (linked > 0) msg += ' ' + linked + ' inventory item(s) linked to this vendor will be unlinked.';
    if (!confirm(msg)) return;
    saveVendors(listVendors().filter(function (r) { return r.id !== id; }));
    // unlink any inventory items pointing at this vendor
    var inv = listInventory();
    var changed = false;
    inv.forEach(function (it) { if (it.vendorId === id) { it.vendorId = ''; changed = true; } });
    if (changed) saveInventory(inv);
    renderVendorList();
    renderInventoryList();
  }

  document.getElementById('btn-new-vendor').addEventListener('click', function () { openVendorForm(null); });
  document.getElementById('vfm-save').addEventListener('click', saveVendorFromForm);
  document.getElementById('vfm-cancel').addEventListener('click', function () { showVndView('list'); });

  // ═══════════════════ stats + header ═══════════════════
  function renderStats() {
    var items = listInventory();
    var lowCount = items.filter(isLow).length;
    var stockValue = items.reduce(function (sum, it) { return sum + num(it.quantity) * num(it.unitCost); }, 0);
    var vendorCount = listVendors().length;
    document.getElementById('stock-stats').innerHTML =
      '<div class="tool-stat-card"><div class="tool-stat-label">Inventory Items</div><div class="tool-stat-value">' + items.length + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Low Stock</div><div class="tool-stat-value">' + lowCount + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Stock Value</div><div class="tool-stat-value">' + TS.formatMoneyWhole(stockValue) + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Vendors</div><div class="tool-stat-value">' + vendorCount + '</div></div>';
  }

  document.getElementById('hdr-biz').textContent = user.name + ' · ' + user.email;

  renderInventoryList();
  renderVendorList();
})();
