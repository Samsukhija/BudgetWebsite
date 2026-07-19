(function () {
  'use strict';

  var CATEGORIES = ['Contracts', 'Invoices/Bills', 'ID Proofs', 'Certificates', 'Photos', 'Other'];
  var DB_NAME = 'bw_documents_db';
  var DB_VERSION = 1;
  var STORE_NAME = 'files';

  var TS = window.ToolsShared;

  // ── IndexedDB helpers (promise-wrapped, plain API, no library) ──
  var dbPromise = null;
  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      req.onsuccess = function (e) { resolve(e.target.result); };
      req.onerror = function (e) { reject(e.target.error); };
    });
    return dbPromise;
  }

  function addFile(record) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).add(record);
        tx.oncomplete = function () { resolve(record); };
        tx.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function listFiles() {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var req = tx.objectStore(STORE_NAME).getAll();
        req.onsuccess = function (e) { resolve(e.target.result || []); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function getFile(id) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readonly');
        var req = tx.objectStore(STORE_NAME).get(id);
        req.onsuccess = function (e) { resolve(e.target.result || null); };
        req.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  function deleteFile(id) {
    return openDB().then(function (db) {
      return new Promise(function (resolve, reject) {
        var tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
        tx.oncomplete = function () { resolve(); };
        tx.onerror = function (e) { reject(e.target.error); };
      });
    });
  }

  // ── helpers ──
  function formatBytes(bytes) {
    bytes = Number(bytes) || 0;
    if (bytes < 1024) return bytes + ' B';
    var units = ['KB', 'MB', 'GB'];
    var val = bytes / 1024;
    var i = 0;
    while (val >= 1024 && i < units.length - 1) {
      val /= 1024;
      i++;
    }
    return val.toFixed(val >= 10 ? 0 : 1) + ' ' + units[i];
  }

  function formatDateTimeDisplay(iso) {
    if (!iso) return '-';
    var d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    var datePart = TS.formatDateDisplay(
      d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    );
    return datePart;
  }

  function categoryBadgeClass(cat) {
    if (cat === 'Contracts') return 'tool-badge-accent';
    if (cat === 'Invoices/Bills') return 'tool-badge-warn';
    if (cat === 'ID Proofs') return 'tool-badge-bad';
    if (cat === 'Certificates') return 'tool-badge-good';
    return 'tool-badge-neutral';
  }

  // ── els ──
  var els = {};
  ['ds-upload-category', 'ds-upload-tags', 'ds-upload-file', 'ds-btn-upload', 'ds-upload-status',
   'ds-search', 'ds-filter-category', 'ds-count', 'ds-grid', 'ds-stats'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  function populateCategorySelect(select, withAllOption) {
    if (withAllOption) {
      var opt0 = document.createElement('option');
      opt0.value = '';
      opt0.textContent = 'All Categories';
      select.appendChild(opt0);
    }
    CATEGORIES.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    });
  }
  populateCategorySelect(els['ds-upload-category'], false);
  populateCategorySelect(els['ds-filter-category'], true);

  // track object URLs created for thumbnails so they can be revoked (avoid leaks)
  var activeObjectUrls = [];
  function revokeActiveObjectUrls() {
    activeObjectUrls.forEach(function (u) { URL.revokeObjectURL(u); });
    activeObjectUrls = [];
  }

  function renderStats(files) {
    var totalSize = files.reduce(function (sum, f) { return sum + (f.size || 0); }, 0);
    els['ds-stats'].innerHTML =
      '<div class="tool-stat-card"><div class="tool-stat-label">Total Files</div><div class="tool-stat-value">' + files.length + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Storage Used</div><div class="tool-stat-value">' + formatBytes(totalSize) + '</div></div>';
  }

  function cardHtml(file) {
    var isImage = (file.type || '').indexOf('image/') === 0;
    var previewHtml;
    if (isImage) {
      var url = URL.createObjectURL(file.blob);
      activeObjectUrls.push(url);
      previewHtml = '<img src="' + url + '" alt="' + TS.escapeHtml(file.name) + '">';
    } else {
      previewHtml = '<span class="ds-icon">📄</span>';
    }
    var tagsHtml = (file.tags || []).map(function (t) {
      return '<span class="ds-tag">' + TS.escapeHtml(t) + '</span>';
    }).join('');

    return (
      '<div class="ds-card" data-id="' + file.id + '">' +
        '<div class="ds-card-preview">' + previewHtml + '</div>' +
        '<div class="ds-card-name">' + TS.escapeHtml(file.name) + '</div>' +
        '<div class="ds-card-meta">' +
          '<span class="tool-badge ' + categoryBadgeClass(file.category) + '">' + TS.escapeHtml(file.category) + '</span>' +
          '<span>' + formatBytes(file.size) + '</span>' +
          '<span>' + formatDateTimeDisplay(file.uploadedAt) + '</span>' +
        '</div>' +
        (tagsHtml ? '<div class="ds-card-tags">' + tagsHtml + '</div>' : '') +
        '<div class="ds-card-actions">' +
          '<button type="button" class="btn-sm btn-ghost ds-btn-download" data-id="' + file.id + '">⬇ Download</button>' +
          '<button type="button" class="btn-sm btn-danger ds-btn-delete" data-id="' + file.id + '">Delete</button>' +
        '</div>' +
      '</div>'
    );
  }

  var allFiles = [];

  function applyFiltersAndRender() {
    revokeActiveObjectUrls();

    var q = (els['ds-search'].value || '').trim().toLowerCase();
    var cat = els['ds-filter-category'].value;

    var filtered = allFiles.filter(function (f) {
      if (cat && f.category !== cat) return false;
      if (!q) return true;
      var nameMatch = (f.name || '').toLowerCase().indexOf(q) !== -1;
      var tagMatch = (f.tags || []).some(function (t) { return t.toLowerCase().indexOf(q) !== -1; });
      return nameMatch || tagMatch;
    });

    // newest first
    filtered.sort(function (a, b) { return (b.uploadedAt || '').localeCompare(a.uploadedAt || ''); });

    els['ds-count'].textContent = filtered.length + ' of ' + allFiles.length + ' file' + (allFiles.length === 1 ? '' : 's');

    if (!filtered.length) {
      els['ds-grid'].innerHTML = '<div class="tool-empty">' +
        (allFiles.length ? 'No documents match your search.' : 'No documents yet, upload your first file above.') +
        '</div>';
      return;
    }

    els['ds-grid'].innerHTML = filtered.map(cardHtml).join('');
  }

  function refresh() {
    return listFiles().then(function (files) {
      allFiles = files;
      renderStats(files);
      applyFiltersAndRender();
    }).catch(function (err) {
      els['ds-grid'].innerHTML = '<div class="tool-empty">Could not load documents: ' + TS.escapeHtml(err && err.message ? err.message : String(err)) + '</div>';
    });
  }

  function handleUpload() {
    var fileInput = els['ds-upload-file'];
    var files = fileInput.files;
    if (!files || !files.length) {
      els['ds-upload-status'].textContent = 'Choose at least one file first.';
      return;
    }
    var category = els['ds-upload-category'].value || 'Other';
    var tags = (els['ds-upload-tags'].value || '')
      .split(',')
      .map(function (t) { return t.trim(); })
      .filter(Boolean);

    els['ds-btn-upload'].disabled = true;
    els['ds-upload-status'].textContent = 'Uploading ' + files.length + ' file' + (files.length === 1 ? '' : 's') + '…';

    var tasks = Array.prototype.map.call(files, function (file) {
      var record = {
        id: TS.uid(),
        name: file.name,
        category: category,
        tags: tags,
        size: file.size,
        type: file.type || '',
        uploadedAt: new Date().toISOString(),
        blob: file
      };
      return addFile(record);
    });

    Promise.all(tasks).then(function () {
      els['ds-upload-status'].textContent = 'Uploaded ' + files.length + ' file' + (files.length === 1 ? '' : 's') + '.';
      fileInput.value = '';
      els['ds-upload-tags'].value = '';
      return refresh();
    }).catch(function (err) {
      els['ds-upload-status'].textContent = 'Upload failed: ' + (err && err.message ? err.message : String(err));
    }).then(function () {
      els['ds-btn-upload'].disabled = false;
    });
  }

  function handleDownload(id) {
    getFile(id).then(function (file) {
      if (!file) return;
      var url = URL.createObjectURL(file.blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  function handleDelete(id) {
    var file = allFiles.find(function (f) { return f.id === id; });
    var name = file ? file.name : 'this file';
    if (!confirm('Delete "' + name + '"? This cannot be undone.')) return;
    deleteFile(id).then(refresh);
  }

  // ── wire up ──
  els['ds-btn-upload'].addEventListener('click', handleUpload);
  els['ds-search'].addEventListener('input', applyFiltersAndRender);
  els['ds-filter-category'].addEventListener('change', applyFiltersAndRender);

  els['ds-grid'].addEventListener('click', function (e) {
    var downloadBtn = e.target.closest('.ds-btn-download');
    if (downloadBtn) { handleDownload(downloadBtn.dataset.id); return; }
    var deleteBtn = e.target.closest('.ds-btn-delete');
    if (deleteBtn) { handleDelete(deleteBtn.dataset.id); return; }
  });

  refresh();
})();
