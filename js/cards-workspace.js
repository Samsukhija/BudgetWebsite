/* /app/cards/ — the Cards & Documents Pack workspace: your own digital
   business card, a saved contact list (manual add or AI-scanned straight
   from a photo, reusing the free Business Card Scanner's vision prompt),
   and a categorised document vault — three separate free tools unified
   into one identity workspace. Local-first: no backend yet, same
   localStorage pattern as the rest of the site. */
(function () {
  'use strict';

  var TS = window.ToolsShared;

  // ── entitlement gate ──
  var user = window.BWAuth ? BWAuth.currentUser() : null;
  if (!user) { location.href = '/app/'; return; }
  if (!BWEntitlement.has(user.email, 'cards')) { location.href = '/app/'; return; }

  var MYCARD_KEY = 'bw_pack_mycard_v1';
  var CONTACTS_KEY = 'bw_pack_scanned_contacts_v1';
  var DOCS_KEY = 'bw_pack_documents_v1';
  var MAX_PHOTO_DIM = 2000;      // downscale the card photo only if it exceeds this on either axis
  var MAX_SCAN_EDGE = 1600;      // downscale a scanned card image before sending it to the AI
  var MAX_DOC_BYTES = 1.5 * 1024 * 1024; // don't try to embed a document file bigger than this in localStorage
  var DOC_CATEGORIES = ['Contracts', 'Invoices/Bills', 'ID Proofs', 'Certificates', 'Photos', 'Other'];

  function safeSaveJSON(key, value) {
    try { TS.saveJSON(key, value); return { ok: true }; }
    catch (e) { return { error: e && e.message ? e.message : String(e) }; }
  }

  // ═══════════════════ tabs ═══════════════════
  document.querySelectorAll('.cc-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.cc-tab').forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.getElementById('tab-mycard').hidden = btn.dataset.tab !== 'mycard';
      document.getElementById('tab-contacts').hidden = btn.dataset.tab !== 'contacts';
      document.getElementById('tab-documents').hidden = btn.dataset.tab !== 'documents';
    });
  });

  // ═══════════════════ shared vCard builder ═══════════════════
  function vEscape(s) {
    return String(s == null ? '' : s)
      .replace(/\\/g, '\\\\')
      .replace(/\r\n|\r|\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }
  function normalizeUrl(u) {
    u = (u || '').trim();
    if (!u) return '';
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    return u;
  }
  function buildVCard(rec) {
    var lines = ['BEGIN:VCARD', 'VERSION:3.0'];
    var name = (rec.name || '').trim();
    var nameParts = name ? name.split(/\s+/) : [];
    var family = nameParts.length > 1 ? nameParts.pop() : '';
    var given = nameParts.join(' ');
    lines.push('N:' + vEscape(family) + ';' + vEscape(given) + ';;;');
    lines.push('FN:' + vEscape(name || rec.company || 'Contact'));
    if (rec.company) lines.push('ORG:' + vEscape(rec.company));
    if (rec.title || rec.role) lines.push('TITLE:' + vEscape(rec.title || rec.role));
    if (rec.phone) lines.push('TEL;TYPE=CELL,VOICE:' + vEscape(rec.phone));
    if (rec.email) lines.push('EMAIL;TYPE=INTERNET:' + vEscape(rec.email));
    if (rec.website) lines.push('URL:' + vEscape(normalizeUrl(rec.website)));
    if (rec.address) lines.push('ADR;TYPE=WORK:;;' + vEscape(rec.address) + ';;;;');
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }
  function downloadBlob(text, filename, mime) {
    var blob = new Blob([text], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }
  function slugFile(name) {
    return (name || 'contact').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'contact';
  }

  // ═══════════════════ MY CARD ═══════════════════
  var mcEls = {};
  ['mc-name', 'mc-title', 'mc-company', 'mc-website', 'mc-phone', 'mc-email', 'mc-address', 'mc-photo',
   'mc-remove-photo', 'mc-photo-actions', 'mc-download-vcf', 'mc-whatsapp', 'mc-savenote',
   'cc-name', 'cc-title', 'cc-company', 'cc-contacts', 'cc-photo-wrap', 'cc-photo-img', 'cc-photo-initial', 'cc-qr'
  ].forEach(function (id) { mcEls[id] = document.getElementById(id); });

  var MC_FIELD_MAP = { 'mc-name': 'name', 'mc-title': 'title', 'mc-company': 'company', 'mc-website': 'website', 'mc-phone': 'phone', 'mc-email': 'email', 'mc-address': 'address' };

  var myCard = TS.loadJSON(MYCARD_KEY, null) || { name: '', title: '', company: '', phone: '', email: '', website: '', address: '', photoDataUri: '' };
  var mcSaveTimer = null;

  function hasCardData() {
    return !!(myCard.name || myCard.phone || myCard.email || myCard.company || myCard.website || myCard.address);
  }

  function saveMyCard() {
    var res = safeSaveJSON(MYCARD_KEY, myCard);
    mcEls['mc-savenote'].textContent = res.ok
      ? 'Saved on this device — ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      : 'Could not save (this device is out of local storage). Try removing the photo.';
    renderStats();
    renderHeader();
  }
  function scheduleMcSave() {
    clearTimeout(mcSaveTimer);
    mcSaveTimer = setTimeout(function () { saveMyCard(); updateQR(); }, 350);
  }

  function renderMcPhoto() {
    if (myCard.photoDataUri) {
      mcEls['cc-photo-img'].src = myCard.photoDataUri;
      mcEls['cc-photo-img'].style.display = '';
      mcEls['cc-photo-initial'].style.display = 'none';
      mcEls['mc-photo-actions'].hidden = false;
    } else {
      mcEls['cc-photo-img'].style.display = 'none';
      mcEls['cc-photo-img'].src = '';
      mcEls['cc-photo-initial'].style.display = '';
      mcEls['cc-photo-initial'].textContent = (myCard.name || '?').trim().charAt(0).toUpperCase() || '?';
      mcEls['mc-photo-actions'].hidden = true;
    }
  }

  function renderMcPreview() {
    mcEls['cc-name'].textContent = myCard.name || 'Your Name';
    mcEls['cc-title'].textContent = myCard.title || '';
    mcEls['cc-company'].textContent = myCard.company || '';

    var contactsEl = mcEls['cc-contacts'];
    contactsEl.innerHTML = '';
    var rows = [];
    if (myCard.phone) rows.push({ icon: '📞', text: myCard.phone });
    if (myCard.email) rows.push({ icon: '✉️', text: myCard.email });
    if (myCard.website) rows.push({ icon: '🌐', text: myCard.website });
    if (myCard.address) rows.push({ icon: '📍', text: myCard.address });
    rows.forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'cc-contact-row';
      div.innerHTML = '<span class="cc-icon">' + r.icon + '</span><span>' + TS.escapeHtml(r.text) + '</span>';
      contactsEl.appendChild(div);
    });

    renderMcPhoto();
  }

  function updateQR() {
    var el = mcEls['cc-qr'];
    el.innerHTML = '';
    if (!hasCardData()) {
      el.innerHTML = '<div class="tool-empty" style="padding:20px 10px;">Fill in your details to generate a QR code.</div>';
      return;
    }
    var vcard = buildVCard(myCard);
    try {
      var opts = { text: vcard, width: 180, height: 180 };
      if (window.QRCode && window.QRCode.CorrectLevel) opts.correctLevel = window.QRCode.CorrectLevel.M;
      new window.QRCode(el, opts);
    } catch (e) {
      el.innerHTML = '<div class="tool-empty" style="padding:20px 10px;">Card details are too long to fit in a QR code, try shortening the address.</div>';
    }
  }

  function handleMcPhotoFile(file) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var img = new Image();
      img.onload = function () {
        var w = img.naturalWidth, h = img.naturalHeight;
        if (w > MAX_PHOTO_DIM || h > MAX_PHOTO_DIM) {
          var scale = Math.min(MAX_PHOTO_DIM / w, MAX_PHOTO_DIM / h);
          var canvas = document.createElement('canvas');
          canvas.width = Math.round(w * scale);
          canvas.height = Math.round(h * scale);
          var ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          var mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          myCard.photoDataUri = canvas.toDataURL(mime, mime === 'image/jpeg' ? 0.85 : undefined);
        } else {
          myCard.photoDataUri = e.target.result;
        }
        renderMcPhoto();
        saveMyCard();
        updateQR();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function downloadMyCardVcf() {
    var blob = buildVCard(myCard);
    downloadBlob(blob, slugFile(myCard.name || 'my-card') + '.vcf', 'text/vcard;charset=utf-8');
  }

  function shareMyCardWhatsApp() {
    var lines = [];
    if (myCard.name) lines.push(myCard.name);
    if (myCard.title) lines.push(myCard.title);
    if (myCard.company) lines.push(myCard.company);
    if (myCard.phone) lines.push('Phone: ' + myCard.phone);
    if (myCard.email) lines.push('Email: ' + myCard.email);
    if (myCard.website) lines.push('Web: ' + myCard.website);
    if (myCard.address) lines.push(myCard.address);
    if (!lines.length) lines.push('Fill in your card details first.');
    window.open('https://wa.me/?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  }

  Object.keys(MC_FIELD_MAP).forEach(function (id) {
    var el = mcEls[id];
    el.addEventListener('input', function () {
      myCard[MC_FIELD_MAP[id]] = el.value;
      renderMcPreview();
      scheduleMcSave();
    });
  });
  mcEls['mc-photo'].addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (file) handleMcPhotoFile(file);
    e.target.value = '';
  });
  mcEls['mc-remove-photo'].addEventListener('click', function () {
    myCard.photoDataUri = '';
    renderMcPhoto();
    saveMyCard();
    updateQR();
  });
  mcEls['mc-download-vcf'].addEventListener('click', downloadMyCardVcf);
  mcEls['mc-whatsapp'].addEventListener('click', shareMyCardWhatsApp);

  // ═══════════════════ CONTACTS ═══════════════════
  function listContacts() { return TS.loadJSON(CONTACTS_KEY, []); }
  function saveContacts(arr) { return safeSaveJSON(CONTACTS_KEY, arr); }

  function renderContacts() {
    var arr = listContacts().slice().sort(function (a, b) { return (b.scannedAt || '').localeCompare(a.scannedAt || ''); });
    var body = document.getElementById('ct-table-body');
    body.innerHTML = arr.map(function (c) {
      return '<tr data-id="' + c.id + '">' +
        '<td>' + (TS.escapeHtml(c.name) || '<span style="color:var(--text-dim)">-</span>') + '</td>' +
        '<td>' + (TS.escapeHtml(c.company) || '-') + '</td>' +
        '<td>' + (TS.escapeHtml(c.role) || '-') + '</td>' +
        '<td>' + (TS.escapeHtml(c.phone) || '-') + '</td>' +
        '<td>' + (TS.escapeHtml(c.email) || '-') + '</td>' +
        '<td style="text-align:right;white-space:nowrap;">' +
          '<button type="button" class="btn-ghost btn-sm ct-vcf-btn" data-id="' + c.id + '">.vcf</button> ' +
          '<button type="button" class="btn-danger btn-sm ct-del-btn" data-id="' + c.id + '">Delete</button>' +
        '</td></tr>';
    }).join('');
    document.getElementById('ct-empty').hidden = arr.length > 0;
    body.querySelectorAll('.ct-del-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var all = listContacts().filter(function (c) { return c.id !== b.dataset.id; });
        saveContacts(all);
        renderContacts();
        renderStats();
      });
    });
    body.querySelectorAll('.ct-vcf-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var found = listContacts().filter(function (c) { return c.id === b.dataset.id; })[0];
        if (found) downloadBlob(buildVCard(found), slugFile(found.name || found.company) + '.vcf', 'text/vcard;charset=utf-8');
      });
    });
    renderStats();
  }

  function addContact(c) {
    c.id = TS.uid();
    c.scannedAt = new Date().toISOString();
    var all = listContacts();
    all.unshift(c);
    var res = saveContacts(all);
    renderContacts();
    return res;
  }

  document.getElementById('ct-add').addEventListener('click', function () {
    var c = {
      name: document.getElementById('ct-name').value.trim(),
      role: document.getElementById('ct-role').value.trim(),
      company: document.getElementById('ct-company').value.trim(),
      phone: document.getElementById('ct-phone').value.trim(),
      email: document.getElementById('ct-email').value.trim()
    };
    var errBox = document.getElementById('ct-add-error');
    if (!c.name && !c.company && !c.phone && !c.email) {
      errBox.textContent = 'Add at least a name, company, phone or email.';
      return;
    }
    errBox.textContent = '';
    var res = addContact(c);
    if (res.error) { errBox.textContent = 'Could not save: ' + res.error; return; }
    ['ct-name', 'ct-role', 'ct-company', 'ct-phone', 'ct-email'].forEach(function (id) { document.getElementById(id).value = ''; });
  });

  // ── AI scan flow (reuses the free Business Card Scanner's vision approach) ──
  var scanEls = {
    fileInput: document.getElementById('cc-scan-file'),
    drop: document.getElementById('cc-scan-drop'),
    dropInner: document.getElementById('cc-scan-drop-inner'),
    previewWrap: document.getElementById('cc-scan-preview-wrap'),
    previewImg: document.getElementById('cc-scan-preview'),
    clearBtn: document.getElementById('cc-scan-clear'),
    genBtn: document.getElementById('cc-scan-btn'),
    hint: document.getElementById('cc-scan-hint'),
    errorBox: document.getElementById('cc-scan-error'),
    resultPanel: document.getElementById('cc-scan-result'),
    saveBtn: document.getElementById('sc-save'),
    locked: document.getElementById('cc-scan-locked'),
    area: document.getElementById('cc-scan-area')
  };
  var currentScanDataUri = null;

  var SCAN_SYSTEM_PROMPT =
    "You are an expert data-entry assistant reading a photographed business card. " +
    "Extract the contact details. Phone numbers are usually Indian, keep them exactly " +
    "as printed, do not invent country codes. Preserve the company name exactly. " +
    "Return ONLY a compact single-line JSON object, no markdown, no code fence, no " +
    "commentary, with EXACTLY these keys: name, role, company, phone, email. Use an " +
    "empty string \"\" for any field not present or not readable confidently. Never " +
    "guess or fabricate a value.";
  var SCAN_USER_PROMPT = "Extract the contact details from this business card. Return only the JSON object.";

  function updateScanGate() {
    var hasKey = window.AIShared && AIShared.hasKey();
    scanEls.locked.hidden = !!hasKey;
    scanEls.area.hidden = !hasKey;
    if (hasKey) updateScanGenerateEnabled();
  }
  function updateScanGenerateEnabled() {
    var ready = AIShared.hasKey() && !!currentScanDataUri;
    scanEls.genBtn.disabled = !ready;
    if (!currentScanDataUri) {
      scanEls.hint.textContent = 'Upload or photograph a card, then tap Scan Card.';
      scanEls.hint.hidden = false;
    } else {
      scanEls.hint.hidden = true;
    }
  }

  if (window.AIShared) {
    AIShared.mountSettings(document.getElementById('cc-ai-settings-mount'), updateScanGate);
  }
  updateScanGate();

  function downscale(dataUri, cb) {
    var img = new Image();
    img.onload = function () {
      var w = img.naturalWidth, h = img.naturalHeight;
      var longest = Math.max(w, h);
      if (!longest || longest <= MAX_SCAN_EDGE) { cb(dataUri); return; }
      var scale = MAX_SCAN_EDGE / longest;
      var cw = Math.round(w * scale), ch = Math.round(h * scale);
      try {
        var canvas = document.createElement('canvas');
        canvas.width = cw; canvas.height = ch;
        canvas.getContext('2d').drawImage(img, 0, 0, cw, ch);
        cb(canvas.toDataURL('image/jpeg', 0.85));
      } catch (e) { cb(dataUri); }
    };
    img.onerror = function () { cb(dataUri); };
    img.src = dataUri;
  }

  function handleScanFile(file) {
    if (!file || file.type.indexOf('image/') !== 0) {
      scanEls.errorBox.textContent = 'That is not an image file. Please choose a JPG or PNG photo of the card.';
      return;
    }
    scanEls.errorBox.textContent = '';
    var reader = new FileReader();
    reader.onload = function () {
      downscale(reader.result, function (dataUri) {
        currentScanDataUri = dataUri;
        scanEls.previewImg.src = dataUri;
        scanEls.previewWrap.hidden = false;
        scanEls.dropInner.hidden = true;
        updateScanGenerateEnabled();
      });
    };
    reader.onerror = function () { scanEls.errorBox.textContent = 'Could not read that file. Try another photo.'; };
    reader.readAsDataURL(file);
  }

  function clearScanImage() {
    currentScanDataUri = null;
    scanEls.fileInput.value = '';
    scanEls.previewImg.src = '';
    scanEls.previewWrap.hidden = true;
    scanEls.dropInner.hidden = false;
    updateScanGenerateEnabled();
  }

  scanEls.fileInput.addEventListener('change', function () {
    if (scanEls.fileInput.files && scanEls.fileInput.files[0]) handleScanFile(scanEls.fileInput.files[0]);
  });
  scanEls.clearBtn.addEventListener('click', clearScanImage);
  ['dragenter', 'dragover'].forEach(function (ev) {
    scanEls.drop.addEventListener(ev, function (e) { e.preventDefault(); scanEls.drop.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    scanEls.drop.addEventListener(ev, function (e) { e.preventDefault(); scanEls.drop.classList.remove('dragover'); });
  });
  scanEls.drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) handleScanFile(e.dataTransfer.files[0]);
  });

  function extractJson(text) {
    if (!text) return null;
    var start = text.indexOf('{');
    var end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end < start) return null;
    try { return JSON.parse(text.slice(start, end + 1)); } catch (e) { return null; }
  }

  scanEls.genBtn.addEventListener('click', function () {
    if (!currentScanDataUri) { scanEls.errorBox.textContent = 'Please upload or photograph a card first.'; return; }
    if (!AIShared.hasKey()) { scanEls.errorBox.textContent = 'Add your OpenRouter API key above first.'; return; }
    scanEls.errorBox.textContent = '';
    scanEls.genBtn.disabled = true;
    scanEls.genBtn.innerHTML = '<span class="ai-spinner"></span>Reading card…';

    AIShared.generate({
      system: SCAN_SYSTEM_PROMPT,
      user: SCAN_USER_PROMPT,
      images: [currentScanDataUri],
      temperature: 0,
      maxTokens: 400
    }).then(function (text) {
      var obj = extractJson(text);
      if (!obj) {
        scanEls.errorBox.textContent = 'Could not read the card clearly. Try a sharper, well-lit photo taken straight-on.';
        return;
      }
      ['name', 'role', 'company', 'phone', 'email'].forEach(function (f) {
        document.getElementById('sc-' + f).value = typeof obj[f] === 'string' ? obj[f] : '';
      });
      scanEls.resultPanel.hidden = false;
      scanEls.resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }).catch(function (err) {
      scanEls.errorBox.textContent = err && err.message ? err.message : 'Scan failed. Please try again.';
    }).then(function () {
      scanEls.genBtn.innerHTML = 'Scan Card';
      updateScanGenerateEnabled();
    });
  });

  scanEls.saveBtn.addEventListener('click', function () {
    var c = {
      name: document.getElementById('sc-name').value.trim(),
      role: document.getElementById('sc-role').value.trim(),
      company: document.getElementById('sc-company').value.trim(),
      phone: document.getElementById('sc-phone').value.trim(),
      email: document.getElementById('sc-email').value.trim()
    };
    if (!c.name && !c.company && !c.phone && !c.email) {
      scanEls.errorBox.textContent = 'Nothing to save yet, the card needs at least a name, company, phone or email.';
      return;
    }
    var res = addContact(c);
    if (res.error) { scanEls.errorBox.textContent = 'Could not save: ' + res.error; return; }
    scanEls.resultPanel.hidden = true;
    clearScanImage();
  });

  // ═══════════════════ DOCUMENTS ═══════════════════
  function populateCategorySelect(select, withAllOption) {
    if (withAllOption) {
      var opt0 = document.createElement('option');
      opt0.value = ''; opt0.textContent = 'All Categories';
      select.appendChild(opt0);
    }
    DOC_CATEGORIES.forEach(function (c) {
      var opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      select.appendChild(opt);
    });
  }
  populateCategorySelect(document.getElementById('dc-category'), false);
  populateCategorySelect(document.getElementById('dc-filter-category'), true);

  function categoryBadgeClass(cat) {
    if (cat === 'Contracts') return 'tool-badge-accent';
    if (cat === 'Invoices/Bills') return 'tool-badge-warn';
    if (cat === 'ID Proofs') return 'tool-badge-bad';
    if (cat === 'Certificates') return 'tool-badge-good';
    return 'tool-badge-neutral';
  }

  function listDocs() { return TS.loadJSON(DOCS_KEY, []); }
  function saveDocs(arr) { return safeSaveJSON(DOCS_KEY, arr); }

  function renderDocs() {
    var all = listDocs();
    var cat = document.getElementById('dc-filter-category').value;
    var filtered = cat ? all.filter(function (d) { return d.category === cat; }) : all;
    filtered = filtered.slice().sort(function (a, b) { return (b.addedAt || '').localeCompare(a.addedAt || ''); });

    document.getElementById('dc-count').textContent = filtered.length + ' of ' + all.length + ' document' + (all.length === 1 ? '' : 's');

    var body = document.getElementById('dc-table-body');
    body.innerHTML = filtered.map(function (d) {
      return '<tr data-id="' + d.id + '">' +
        '<td>' + TS.escapeHtml(d.name || 'Untitled') + '</td>' +
        '<td><span class="tool-badge ' + categoryBadgeClass(d.category) + '">' + TS.escapeHtml(d.category) + '</span></td>' +
        '<td>' + (TS.escapeHtml(d.note) || '-') + '</td>' +
        '<td>' + TS.formatDateDisplay((d.addedAt || '').slice(0, 10)) + '</td>' +
        '<td style="text-align:right;white-space:nowrap;">' +
          (d.dataUri ? '<a class="btn-ghost btn-sm" href="' + d.dataUri + '" download="' + TS.escapeHtml(d.name || 'document') + '">⬇ Download</a> ' : '<span style="color:var(--text-dim);font-size:calc(11.5px * var(--font-scale));margin-right:8px;">No file attached</span>') +
          '<button type="button" class="btn-danger btn-sm dc-del-btn" data-id="' + d.id + '">Delete</button>' +
        '</td></tr>';
    }).join('');
    document.getElementById('dc-empty').hidden = filtered.length > 0;

    body.querySelectorAll('.dc-del-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var name = (all.filter(function (d) { return d.id === b.dataset.id; })[0] || {}).name || 'this document';
        if (!confirm('Delete "' + name + '"? This cannot be undone.')) return;
        var remaining = listDocs().filter(function (d) { return d.id !== b.dataset.id; });
        saveDocs(remaining);
        renderDocs();
        renderStats();
      });
    });
    renderStats();
  }

  function addDocument(name, category, note, file) {
    var status = document.getElementById('dc-status');
    var rec = { id: TS.uid(), name: name, category: category, note: note, dataUri: '', addedAt: new Date().toISOString() };

    function finish() {
      var all = listDocs();
      all.push(rec);
      var res = saveDocs(all);
      if (res.error) {
        status.textContent = 'Could not save (this device is out of local storage). Try a smaller file or remove old documents.';
        return;
      }
      status.textContent = rec.dataUri ? 'Document added with its file attached.' : (file ? 'Document added, but the file was too large to attach on this device (kept the entry without it).' : 'Document added.');
      renderDocs();
      renderStats();
    }

    if (!file) { finish(); return; }
    if (file.size > MAX_DOC_BYTES) { finish(); return; } // too big to safely embed — keep metadata only
    var reader = new FileReader();
    reader.onload = function (e) { rec.dataUri = e.target.result; finish(); };
    reader.onerror = function () { finish(); };
    reader.readAsDataURL(file);
  }

  document.getElementById('dc-add').addEventListener('click', function () {
    var name = document.getElementById('dc-name').value.trim();
    var category = document.getElementById('dc-category').value || 'Other';
    var note = document.getElementById('dc-note').value.trim();
    var fileInput = document.getElementById('dc-file');
    var file = fileInput.files && fileInput.files[0];
    var status = document.getElementById('dc-status');

    if (!name) { status.textContent = 'Give the document a name first.'; return; }
    status.textContent = 'Saving…';
    addDocument(name, category, note, file);
    document.getElementById('dc-name').value = '';
    document.getElementById('dc-note').value = '';
    fileInput.value = '';
  });

  document.getElementById('dc-filter-category').addEventListener('change', renderDocs);

  // ═══════════════════ dashboard stats + header ═══════════════════
  function renderStats() {
    document.getElementById('cards-stats').innerHTML =
      '<div class="tool-stat-card"><div class="tool-stat-label">My Card</div><div class="tool-stat-value">' + (hasCardData() ? 'Yes' : 'No') + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Contacts</div><div class="tool-stat-value">' + listContacts().length + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Documents</div><div class="tool-stat-value">' + listDocs().length + '</div></div>';
  }
  function renderHeader() {
    document.getElementById('hdr-biz').textContent = (myCard.name || user.name) + ' · ' + user.email;
  }

  // ── init ──
  Object.keys(MC_FIELD_MAP).forEach(function (id) { mcEls[id].value = myCard[MC_FIELD_MAP[id]] || ''; });
  renderMcPreview();
  updateQR();
  renderContacts();
  renderDocs();
  renderStats();
  renderHeader();
})();
