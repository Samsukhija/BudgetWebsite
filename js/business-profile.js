/* Powers the /tools/business-profile/ page: the shared Business Profile
   (read by every AI tool via AIShared) and the Backup / Restore of every
   tool's data. Everything lives in localStorage under bw_* keys. */
(function () {
  'use strict';

  var PROFILE_KEY = 'bw_business_profile_v1';
  var TONES = ['Warm and friendly', 'Professional and trusted', 'Bold and modern', 'Simple and plain'];

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function getProfile() {
    try { var p = JSON.parse(localStorage.getItem(PROFILE_KEY)); return (p && typeof p === 'object') ? p : {}; }
    catch (e) { return {}; }
  }
  function saveProfile(p) { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); }

  /* ── Business Profile form ── */
  function mountProfile(el) {
    var p = getProfile();
    var toneOpts = TONES.map(function (t) {
      return '<option value="' + esc(t) + '"' + (t === p.tone ? ' selected' : '') + '>' + esc(t) + '</option>';
    }).join('');
    el.innerHTML =
      '<div class="tool-panel">' +
        '<div class="tool-panel-title">Your Business Profile</div>' +
        '<div class="tool-row tool-row-2">' +
          '<label>Business name<input type="text" id="bp-name" placeholder="e.g. Sharma Traders" value="' + esc(p.name || '') + '"></label>' +
          '<label>City<input type="text" id="bp-city" placeholder="e.g. Mumbai" value="' + esc(p.city || '') + '"></label>' +
        '</div>' +
        '<label>What you do (one line)<input type="text" id="bp-does" placeholder="e.g. sell handmade leather bags to boutiques" value="' + esc(p.does || '') + '"></label>' +
        '<div class="tool-row tool-row-2">' +
          '<label>Phone / WhatsApp<input type="text" id="bp-phone" placeholder="For call-to-actions in messages" value="' + esc(p.phone || '') + '"></label>' +
          '<label>Website (optional)<input type="text" id="bp-website" placeholder="e.g. sharmatraders.in" value="' + esc(p.website || '') + '"></label>' +
        '</div>' +
        '<label>Default voice<select id="bp-tone">' + toneOpts + '</select></label>' +
        '<div style="display:flex;align-items:center;gap:14px;margin-top:6px;">' +
          '<button type="button" class="btn-primary" id="bp-save">Save profile</button>' +
          '<span id="bp-saved" class="bp-saved" hidden>Saved. Every AI tool now knows your business.</span>' +
        '</div>' +
        '<p style="font-size:calc(12.5px * var(--font-scale));color:var(--text-dim);margin-top:14px;line-height:1.6;">' +
          'Filled once, read by every AI writer (WhatsApp, Instagram, reviews, blog and the rest) so you never retype who you are. Stored only on this device.' +
        '</p>' +
      '</div>';

    el.querySelector('#bp-save').addEventListener('click', function () {
      var next = {
        name: el.querySelector('#bp-name').value.trim(),
        city: el.querySelector('#bp-city').value.trim(),
        does: el.querySelector('#bp-does').value.trim(),
        phone: el.querySelector('#bp-phone').value.trim(),
        website: el.querySelector('#bp-website').value.trim(),
        tone: el.querySelector('#bp-tone').value
      };
      saveProfile(next);
      var msg = el.querySelector('#bp-saved');
      msg.hidden = false;
      setTimeout(function () { msg.hidden = true; }, 3000);
    });
  }

  /* ── Backup / Restore of every tool's data ── */
  function collectData() {
    var out = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf('bw_') === 0 && k !== 'bw_ai_settings_v1') out[k] = localStorage.getItem(k);
    }
    return out;
  }
  function humanSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }
  function todayStamp() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function mountBackup(el) {
    function stats() {
      var data = collectData();
      var keys = Object.keys(data);
      var bytes = keys.reduce(function (n, k) { return n + k.length + (data[k] ? data[k].length : 0); }, 0);
      return { count: keys.length, size: humanSize(bytes) };
    }
    function render() {
      var s = stats();
      el.innerHTML =
        '<div class="tool-panel">' +
          '<div class="tool-panel-title">Backup &amp; Restore</div>' +
          '<div class="tool-stats" style="margin-bottom:18px;">' +
            '<div class="tool-stat-card"><div class="tool-stat-label">Tools with data</div><div class="tool-stat-value">' + s.count + '</div></div>' +
            '<div class="tool-stat-card"><div class="tool-stat-label">Total size</div><div class="tool-stat-value">' + s.size + '</div></div>' +
          '</div>' +
          '<p style="font-size:calc(13px * var(--font-scale));color:var(--text-mid);line-height:1.65;margin-bottom:16px;">' +
            'Your tools keep everything in this browser. Clearing browser data would wipe it, so download a backup file every so often and keep it safe. ' +
            'Restore drops it all straight back in on this or any device.' +
          '</p>' +
          '<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">' +
            '<button type="button" class="btn-primary" id="bk-export">Download backup</button>' +
            '<button type="button" class="btn-ghost" id="bk-import">Restore from a backup file</button>' +
            '<input type="file" id="bk-file" accept="application/json,.json" style="display:none;">' +
          '</div>' +
          '<p id="bk-msg" class="bp-saved" hidden style="margin-top:14px;"></p>' +
          '<p style="font-size:calc(11.5px * var(--font-scale));color:var(--text-dim);margin-top:14px;line-height:1.6;">' +
            'The backup covers every tool\'s records (invoices, CRM, inventory, attendance and the rest) and your business profile. ' +
            'It does not include files you uploaded to Document Storage or your saved AI key, which stay on the device.' +
          '</p>' +
        '</div>';

      el.querySelector('#bk-export').addEventListener('click', function () {
        var payload = { _app: 'budgetwebsite.store tools', _version: 1, _exported: todayStamp(), data: collectData() };
        var blob = new Blob([JSON.stringify(payload, null, 1)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = 'budget-website-tools-backup-' + todayStamp() + '.json';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        flash('Backup downloaded. Keep the file somewhere safe.');
      });

      var fileInput = el.querySelector('#bk-file');
      el.querySelector('#bk-import').addEventListener('click', function () { fileInput.click(); });
      fileInput.addEventListener('change', function () {
        var f = fileInput.files && fileInput.files[0];
        if (!f) return;
        var reader = new FileReader();
        reader.onload = function () {
          var parsed;
          try { parsed = JSON.parse(reader.result); } catch (e) { parsed = null; }
          if (!parsed || !parsed.data || typeof parsed.data !== 'object') {
            flash('That does not look like a backup file. Pick the .json this page created.', true);
            return;
          }
          var keys = Object.keys(parsed.data);
          if (!confirm('Restore ' + keys.length + ' items from this backup? It will overwrite matching data in this browser.')) return;
          keys.forEach(function (k) {
            if (k.indexOf('bw_') === 0) localStorage.setItem(k, parsed.data[k]);
          });
          flash('Restored ' + keys.length + ' items. Reopen any tool to see your data.');
          render();
        };
        reader.readAsText(f);
        fileInput.value = '';
      });
    }
    function flash(text, isError) {
      var msg = el.querySelector('#bk-msg');
      if (!msg) return;
      msg.textContent = text;
      msg.style.color = isError ? '#F87171' : '';
      msg.hidden = false;
      setTimeout(function () { msg.hidden = true; }, 5000);
    }
    render();
  }

  window.BizProfilePage = { mountProfile: mountProfile, mountBackup: mountBackup };
})();
