/* Business Card Scanner + Contact Saver
   Vision AI tool: reads a business-card photo via AIShared.generate({images}),
   extracts structured contact fields, lets the user correct them, saves to
   localStorage, and exports .vcf / CSV. No backend — BYOK, on-device storage. */
(function () {
  'use strict';

  var STORAGE_KEY = 'bw_tools_scanned_contacts_v1';
  var MAX_EDGE = 1600; // downscale longest side to keep the request small/cheap

  var FIELDS = ['name', 'title', 'company', 'phone', 'email', 'website', 'address'];

  // ── element refs ──
  var fileInput   = document.getElementById('bcs-file');
  var drop        = document.getElementById('bcs-drop');
  var dropInner   = document.getElementById('bcs-drop-inner');
  var previewWrap = document.getElementById('bcs-preview-wrap');
  var previewImg  = document.getElementById('bcs-preview');
  var clearBtn    = document.getElementById('bcs-clear');
  var genBtn      = document.getElementById('generate-btn');
  var hint        = document.getElementById('bcs-hint');
  var errorBox    = document.getElementById('ai-error');
  var resultPanel = document.getElementById('bcs-result-panel');
  var copyBtn     = document.getElementById('bcs-copy');
  var regenBtn    = document.getElementById('bcs-regen');
  var saveBtn     = document.getElementById('bcs-save');
  var listBody    = document.getElementById('bcs-list');
  var emptyMsg    = document.getElementById('bcs-empty');
  var exportBtn   = document.getElementById('bcs-export-csv');

  var currentDataUri = null; // the (possibly downscaled) card image being scanned

  // ── AI prompts ──
  var SYSTEM_PROMPT =
    "You are an expert data-entry assistant for Indian small businesses, reading " +
    "photographed business cards (dentists, retailers, manufacturers, consultants, " +
    "traders and the like) at networking meetings such as BNI Mumbai.\n\n" +
    "Read the card in the image and extract the contact details. Cards may be in " +
    "English or Hindi/Marathi; phone numbers are usually Indian (10 digits, often " +
    "with +91, 0, or a landline STD code) — keep them exactly as printed, do not " +
    "invent country codes. If several phone numbers are printed, pick the primary " +
    "mobile and separate additional ones with a comma. Preserve the company name " +
    "exactly, including suffixes like Pvt Ltd, LLP, & Sons or Enterprises.\n\n" +
    "Return ONLY a compact single-line JSON object, no markdown, no code fence, no " +
    "commentary, with EXACTLY these keys: name, title, company, phone, email, " +
    "website, address. Use an empty string \"\" for any field that is not present " +
    "or that you cannot read confidently. Never guess or fabricate a value. Do not " +
    "add any key other than the seven listed.";

  var USER_PROMPT = "Extract the contact details from this business card. Return only the JSON object.";

  // ── settings / gating ──
  function updateGenerateEnabled() {
    var ready = AIShared.hasKey() && !!currentDataUri;
    genBtn.disabled = !ready;
    if (!AIShared.hasKey()) {
      hint.textContent = 'Add your API key above to enable scanning.';
      hint.hidden = false;
    } else if (!currentDataUri) {
      hint.textContent = 'Upload or photograph a card, then tap Scan Card.';
      hint.hidden = false;
    } else {
      hint.hidden = true;
    }
  }

  AIShared.mountSettings(document.getElementById('ai-settings-mount'), updateGenerateEnabled);

  // ── image handling ──
  function handleFile(file) {
    if (!file || file.type.indexOf('image/') !== 0) {
      showError('That is not an image file. Please choose a JPG or PNG photo of the card.');
      return;
    }
    clearError();
    var reader = new FileReader();
    reader.onload = function () {
      downscale(reader.result, function (dataUri) {
        currentDataUri = dataUri;
        previewImg.src = dataUri;
        previewWrap.hidden = false;
        dropInner.hidden = true;
        updateGenerateEnabled();
      });
    };
    reader.onerror = function () { showError('Could not read that file. Try another photo.'); };
    reader.readAsDataURL(file);
  }

  // Downscale via canvas if the longest side exceeds MAX_EDGE; else pass through.
  function downscale(dataUri, cb) {
    var img = new Image();
    img.onload = function () {
      var w = img.naturalWidth, h = img.naturalHeight;
      var longest = Math.max(w, h);
      if (!longest || longest <= MAX_EDGE) { cb(dataUri); return; }
      var scale = MAX_EDGE / longest;
      var cw = Math.round(w * scale), ch = Math.round(h * scale);
      try {
        var canvas = document.createElement('canvas');
        canvas.width = cw; canvas.height = ch;
        canvas.getContext('2d').drawImage(img, 0, 0, cw, ch);
        cb(canvas.toDataURL('image/jpeg', 0.85));
      } catch (e) {
        cb(dataUri); // canvas may taint on odd inputs — fall back to original
      }
    };
    img.onerror = function () { cb(dataUri); };
    img.src = dataUri;
  }

  function clearImage() {
    currentDataUri = null;
    fileInput.value = '';
    previewImg.src = '';
    previewWrap.hidden = true;
    dropInner.hidden = false;
    updateGenerateEnabled();
  }

  fileInput.addEventListener('change', function () {
    if (fileInput.files && fileInput.files[0]) handleFile(fileInput.files[0]);
  });
  clearBtn.addEventListener('click', clearImage);

  // drag & drop (desktop nicety)
  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('dragover'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('dragover'); });
  });
  drop.addEventListener('drop', function (e) {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });

  // ── error helpers ──
  function showError(msg) { errorBox.textContent = msg; }
  function clearError() { errorBox.textContent = ''; }

  // ── JSON extraction (defensive) ──
  function extractJson(text) {
    if (!text) return null;
    var start = text.indexOf('{');
    var end = text.lastIndexOf('}');
    if (start === -1 || end === -1 || end < start) return null;
    var slice = text.slice(start, end + 1);
    try { return JSON.parse(slice); } catch (e) { return null; }
  }

  function populateForm(obj) {
    FIELDS.forEach(function (f) {
      var el = document.getElementById('bcs-' + f);
      if (el) el.value = obj && typeof obj[f] === 'string' ? obj[f] : '';
    });
  }

  function readForm() {
    var c = {};
    FIELDS.forEach(function (f) {
      var el = document.getElementById('bcs-' + f);
      c[f] = el ? el.value.trim() : '';
    });
    return c;
  }

  // ── scan ──
  function scan(temperature) {
    if (!currentDataUri) { showError('Please upload or photograph a card first.'); return; }
    if (!AIShared.hasKey()) { showError('Add your OpenRouter API key in AI settings first.'); return; }
    clearError();

    genBtn.disabled = true;
    genBtn.innerHTML = '<span class="ai-spinner"></span>Reading card…';

    AIShared.generate({
      system: SYSTEM_PROMPT,
      user: USER_PROMPT,
      images: [currentDataUri],
      temperature: temperature == null ? 0 : temperature,
      maxTokens: 500
    }).then(function (text) {
      var obj = extractJson(text);
      if (!obj) {
        showError('Could not read the card clearly. Try a sharper, well-lit photo taken straight-on, filling the frame.');
        return;
      }
      populateForm(obj);
      resultPanel.hidden = false;
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }).catch(function (err) {
      showError(err && err.message ? err.message : 'Scan failed. Please try again.');
    }).then(function () {
      genBtn.innerHTML = 'Scan Card';
      updateGenerateEnabled();
    });
  }

  genBtn.addEventListener('click', function () { scan(0); });
  regenBtn.addEventListener('click', function () { scan(0.4); }); // slight variation on re-scan

  // ── copy extracted details as plain text ──
  copyBtn.addEventListener('click', function () {
    var c = readForm();
    var lines = [];
    if (c.name) lines.push(c.name);
    if (c.title) lines.push(c.title);
    if (c.company) lines.push(c.company);
    if (c.phone) lines.push('Phone: ' + c.phone);
    if (c.email) lines.push('Email: ' + c.email);
    if (c.website) lines.push('Web: ' + c.website);
    if (c.address) lines.push(c.address);
    var text = lines.join('\n');
    if (!text) return;
    navigator.clipboard.writeText(text).then(function () {
      var orig = copyBtn.textContent;
      copyBtn.textContent = 'Copied ✓';
      copyBtn.classList.add('ai-copied');
      setTimeout(function () {
        copyBtn.textContent = orig;
        copyBtn.classList.remove('ai-copied');
      }, 1500);
    });
  });

  // ── storage ──
  function loadContacts() {
    try {
      var arr = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }
  function saveContacts(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  }

  saveBtn.addEventListener('click', function () {
    var c = readForm();
    if (!c.name && !c.company && !c.phone && !c.email) {
      showError('Nothing to save yet — the card needs at least a name, company, phone or email.');
      return;
    }
    clearError();
    c.id = 'c' + Date.now() + Math.random().toString(36).slice(2, 6);
    c.savedAt = new Date().toISOString();
    var arr = loadContacts();
    arr.unshift(c);
    saveContacts(arr);
    render();
    // reset the scan flow for the next card
    resultPanel.hidden = true;
    clearImage();
  });

  // ── render saved list ──
  function render() {
    var arr = loadContacts();
    listBody.innerHTML = '';
    if (!arr.length) {
      emptyMsg.hidden = false;
      return;
    }
    emptyMsg.hidden = true;
    arr.forEach(function (c) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + (AIShared.esc(c.name) || '<span style="color:var(--text-dim)">—</span>') +
          (c.title ? '<div style="color:var(--text-dim);font-size:calc(11.5px * var(--font-scale));">' + AIShared.esc(c.title) + '</div>' : '') + '</td>' +
        '<td>' + (AIShared.esc(c.company) || '—') + '</td>' +
        '<td>' + (AIShared.esc(c.phone) || '—') + '</td>' +
        '<td>' + (AIShared.esc(c.email) || '—') + '</td>' +
        '<td style="text-align:right;white-space:nowrap;">' +
          '<button type="button" class="btn-primary btn-sm" data-vcf="' + c.id + '">.vcf</button> ' +
          '<button type="button" class="btn-danger btn-sm" data-del="' + c.id + '">Delete</button>' +
        '</td>';
      listBody.appendChild(tr);
    });
  }

  listBody.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || t.tagName !== 'BUTTON') return;
    var delId = t.getAttribute('data-del');
    var vcfId = t.getAttribute('data-vcf');
    if (delId) {
      var arr = loadContacts().filter(function (c) { return c.id !== delId; });
      saveContacts(arr);
      render();
    } else if (vcfId) {
      var found = loadContacts().filter(function (c) { return c.id === vcfId; })[0];
      if (found) downloadVcf(found);
    }
  });

  // ── vCard 3.0 ──
  // Escape per RFC 2426: backslash, comma, semicolon, and newline.
  function vesc(s) {
    return String(s == null ? '' : s)
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  function buildVcf(c) {
    var lines = ['BEGIN:VCARD', 'VERSION:3.0'];
    var name = c.name || c.company || 'Contact';
    lines.push('FN:' + vesc(name));
    // N: Family;Given;Additional;Prefix;Suffix — split simply on last space.
    var parts = (c.name || '').trim().split(/\s+/);
    var given = parts.length ? parts[0] : '';
    var family = parts.length > 1 ? parts.slice(1).join(' ') : '';
    lines.push('N:' + vesc(family) + ';' + vesc(given) + ';;;');
    if (c.company) lines.push('ORG:' + vesc(c.company));
    if (c.title)   lines.push('TITLE:' + vesc(c.title));
    if (c.phone) {
      // multiple numbers may be comma-separated in the field
      c.phone.split(',').forEach(function (p) {
        p = p.trim();
        if (p) lines.push('TEL;TYPE=CELL,VOICE:' + vesc(p));
      });
    }
    if (c.email)   lines.push('EMAIL;TYPE=INTERNET:' + vesc(c.email));
    if (c.website) {
      var url = c.website;
      if (!/^https?:\/\//i.test(url)) url = 'http://' + url;
      lines.push('URL:' + vesc(url));
    }
    if (c.address) {
      // ADR: PObox;Ext;Street;Locality;Region;Postcode;Country — pack into street.
      lines.push('ADR;TYPE=WORK:;;' + vesc(c.address.replace(/\n/g, ', ')) + ';;;;');
    }
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }

  function slugFile(name) {
    return (name || 'contact').replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase() || 'contact';
  }

  function downloadBlob(text, filename, mime) {
    var blob = new Blob([text], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function downloadVcf(c) {
    downloadBlob(buildVcf(c), slugFile(c.name || c.company) + '.vcf', 'text/vcard;charset=utf-8');
  }

  // ── CSV export ──
  function csvCell(s) {
    s = String(s == null ? '' : s);
    if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  exportBtn.addEventListener('click', function () {
    var arr = loadContacts();
    if (!arr.length) {
      showError('No saved contacts to export yet.');
      return;
    }
    clearError();
    var cols = ['name', 'title', 'company', 'phone', 'email', 'website', 'address', 'savedAt'];
    var rows = [cols.join(',')];
    arr.forEach(function (c) {
      rows.push(cols.map(function (col) { return csvCell(c[col]); }).join(','));
    });
    downloadBlob(rows.join('\r\n'), 'business-card-contacts.csv', 'text/csv;charset=utf-8');
  });

  // ── init ──
  updateGenerateEnabled();
  render();
})();
