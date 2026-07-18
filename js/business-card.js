(function () {
  'use strict';

  var STORAGE_KEY = 'bw_tools_business_card_v1';
  var GST_SELLER_KEY = 'bw_gst_seller_v1';
  var MAX_PHOTO_DIM = 2000; // downscale only if the source photo exceeds this on either axis

  var FIELD_MAP = {
    'f-name': 'name', 'f-title': 'title', 'f-company': 'company',
    'f-website': 'website', 'f-phone': 'phone', 'f-email': 'email', 'f-address': 'address'
  };

  var els = {};
  ['f-name', 'f-title', 'f-company', 'f-website', 'f-phone', 'f-email', 'f-address', 'f-photo',
   'btn-remove-photo', 'photo-actions', 'btn-download-vcf', 'btn-clear', 'bc-savenote',
   'bc-name', 'bc-title', 'bc-company', 'bc-contacts', 'bc-photo-wrap', 'bc-photo-img', 'bc-photo-initial', 'bc-qr'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var record = null;
  var updateTimer = null;

  // ── vCard 3.0 building, with proper escaping ──
  // Per spec: backslashes, commas, semicolons and newlines are escaped;
  // backslash must be escaped first so the later replacements don't double-escape it.
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
    lines.push('FN:' + vEscape(name));
    if (rec.company) lines.push('ORG:' + vEscape(rec.company));
    if (rec.title) lines.push('TITLE:' + vEscape(rec.title));
    if (rec.phone) lines.push('TEL;TYPE=CELL,VOICE:' + vEscape(rec.phone));
    if (rec.email) lines.push('EMAIL;TYPE=INTERNET:' + vEscape(rec.email));
    if (rec.website) lines.push('URL:' + vEscape(normalizeUrl(rec.website)));
    if (rec.address) lines.push('ADR;TYPE=WORK:;;' + vEscape(rec.address) + ';;;;');
    lines.push('END:VCARD');
    return lines.join('\r\n');
  }

  function hasAnyData() {
    return !!(record.name || record.phone || record.email || record.company || record.website || record.address);
  }

  // ── load + prefill from the GST tool's saved seller, first run only ──
  function loadRecord() {
    var existing = window.ToolsShared.loadJSON(STORAGE_KEY, null);
    if (existing) {
      return {
        name: existing.name || '', title: existing.title || '', company: existing.company || '',
        phone: existing.phone || '', email: existing.email || '', website: existing.website || '',
        address: existing.address || '', photoDataUri: existing.photoDataUri || ''
      };
    }
    var rec = { name: '', title: '', company: '', phone: '', email: '', website: '', address: '', photoDataUri: '' };
    var seller = window.ToolsShared.loadJSON(GST_SELLER_KEY, null);
    if (seller) {
      rec.company = seller.name || '';
      rec.address = seller.addr || '';
      var contact = (seller.contact || '').trim();
      if (contact) {
        var emailMatch = contact.match(/[^\s,/]+@[^\s,/]+\.[^\s,/]+/);
        if (emailMatch) {
          rec.email = emailMatch[0];
          var rest = contact.replace(emailMatch[0], '').replace(/[,/]/g, ' ').trim();
          if (rest) rec.phone = rest;
        } else {
          rec.phone = contact;
        }
      }
    }
    return rec;
  }

  function save() {
    window.ToolsShared.saveJSON(STORAGE_KEY, record);
    els['bc-savenote'].textContent = 'Saved on this device — ' + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  function scheduleUpdate() {
    clearTimeout(updateTimer);
    updateTimer = setTimeout(function () { save(); updateQR(); }, 350);
  }

  // ── preview rendering ──
  function renderPhoto() {
    if (record.photoDataUri) {
      els['bc-photo-img'].src = record.photoDataUri;
      els['bc-photo-img'].style.display = '';
      els['bc-photo-initial'].style.display = 'none';
      els['photo-actions'].style.display = '';
    } else {
      els['bc-photo-img'].style.display = 'none';
      els['bc-photo-img'].src = '';
      els['bc-photo-initial'].style.display = '';
      els['bc-photo-initial'].textContent = (record.name || '?').trim().charAt(0).toUpperCase() || '?';
      els['photo-actions'].style.display = 'none';
    }
  }

  function renderPreview() {
    els['bc-name'].textContent = record.name || 'Your Name';
    els['bc-title'].textContent = record.title || '';
    els['bc-company'].textContent = record.company || '';

    var contactsEl = els['bc-contacts'];
    contactsEl.innerHTML = '';
    var rows = [];
    if (record.phone) rows.push({ icon: '📞', text: record.phone });
    if (record.email) rows.push({ icon: '✉️', text: record.email });
    if (record.website) rows.push({ icon: '🌐', text: record.website });
    if (record.address) rows.push({ icon: '📍', text: record.address });
    rows.forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'bc-contact-row';
      div.innerHTML = '<span class="bc-icon">' + r.icon + '</span><span>' + window.ToolsShared.escapeHtml(r.text) + '</span>';
      contactsEl.appendChild(div);
    });

    renderPhoto();
  }

  function updateQR() {
    var el = els['bc-qr'];
    el.innerHTML = '';
    if (!hasAnyData()) {
      el.innerHTML = '<div class="tool-empty" style="padding:20px 10px;">Fill in your details to generate a QR code.</div>';
      return;
    }
    var vcard = buildVCard(record);
    try {
      var opts = { text: vcard, width: 180, height: 180 };
      if (window.QRCode && window.QRCode.CorrectLevel) opts.correctLevel = window.QRCode.CorrectLevel.M;
      new window.QRCode(el, opts);
    } catch (e) {
      el.innerHTML = '<div class="tool-empty" style="padding:20px 10px;">Card details are too long to fit in a QR code — try shortening the address. The .vcf download still works.</div>';
    }
  }

  // ── photo upload, downscaled through a canvas only if it's larger than MAX_PHOTO_DIM ──
  function handlePhotoFile(file) {
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
          record.photoDataUri = canvas.toDataURL(mime, mime === 'image/jpeg' ? 0.85 : undefined);
        } else {
          record.photoDataUri = e.target.result;
        }
        renderPhoto();
        save();
        updateQR();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ── vCard file download ──
  function downloadVCF() {
    var vcard = buildVCard(record);
    var blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    var base = (record.name || 'contact').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'contact';
    a.href = url; a.download = base + '.vcf';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── wire up ──
  Object.keys(FIELD_MAP).forEach(function (id) {
    var el = els[id];
    el.addEventListener('input', function () {
      record[FIELD_MAP[id]] = el.value;
      renderPreview();
      scheduleUpdate();
    });
  });

  els['f-photo'].addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (file) handlePhotoFile(file);
    e.target.value = '';
  });

  els['btn-remove-photo'].addEventListener('click', function () {
    record.photoDataUri = '';
    renderPhoto();
    save();
    updateQR();
  });

  els['btn-download-vcf'].addEventListener('click', downloadVCF);

  els['btn-clear'].addEventListener('click', function () {
    if (!confirm('Clear all business card fields on this device?')) return;
    record = { name: '', title: '', company: '', phone: '', email: '', website: '', address: '', photoDataUri: '' };
    Object.keys(FIELD_MAP).forEach(function (id) { els[id].value = ''; });
    renderPreview();
    save();
    updateQR();
  });

  // ── init ──
  record = loadRecord();
  Object.keys(FIELD_MAP).forEach(function (id) { els[id].value = record[FIELD_MAP[id]] || ''; });
  renderPreview();
  updateQR();
})();
