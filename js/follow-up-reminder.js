(function () {
  'use strict';

  var TS = window.ToolsShared;
  var STORAGE_KEY = 'bw_tools_followups_v1';

  var els = {};
  ['f-name', 'f-phone', 'f-date', 'f-time', 'f-note', 'btn-add', 'btn-notify', 'notify-status',
   'f-show-done', 'tbl-body', 'tool-empty', 'tool-stats', 'tool-table'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var reminders = TS.loadJSON(STORAGE_KEY, []);
  if (!Array.isArray(reminders)) reminders = [];

  // Notified-this-session tracker — intentionally NOT persisted (per-session only).
  var notifiedIds = new Set();

  function save() {
    TS.saveJSON(STORAGE_KEY, reminders);
  }

  function dueKey(r) {
    return (r.dueDate || '9999-99-99') + 'T' + (r.dueTime || '00:00');
  }

  function isOverdue(r) {
    return r.status === 'pending' && !!r.dueDate && r.dueDate < TS.todayISO();
  }

  function statusBadge(r) {
    if (r.status === 'done') return '<span class="tool-badge tool-badge-good">Done</span>';
    if (isOverdue(r)) return '<span class="tool-badge tool-badge-bad">Overdue</span>';
    if (r.status === 'snoozed') return '<span class="tool-badge tool-badge-accent">Snoozed</span>';
    return '<span class="tool-badge tool-badge-neutral">Pending</span>';
  }

  function formatDue(r) {
    var d = TS.formatDateDisplay(r.dueDate);
    if (r.dueTime) d += ' · ' + r.dueTime;
    return d;
  }

  function groupSort(list) {
    return list.slice().sort(function (a, b) {
      return dueKey(a) < dueKey(b) ? -1 : (dueKey(a) > dueKey(b) ? 1 : 0);
    });
  }

  function render() {
    var pending = groupSort(reminders.filter(function (r) { return r.status === 'pending'; }));
    var snoozed = groupSort(reminders.filter(function (r) { return r.status === 'snoozed'; }));
    var done = groupSort(reminders.filter(function (r) { return r.status === 'done'; }));

    var showDone = els['f-show-done'].checked;
    var visible = pending.concat(snoozed).concat(showDone ? done : []);

    els['tbl-body'].innerHTML = '';
    els['tool-table'].style.display = reminders.length ? '' : 'none';
    els['tool-empty'].style.display = reminders.length ? 'none' : '';

    if (!reminders.length) {
      renderStats(pending, snoozed, done);
      return;
    }

    if (!visible.length) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="5" class="tool-empty" style="padding:24px;">All caught up — nothing pending. ' +
        (done.length ? 'Check "Show completed" to see finished follow-ups.' : '') + '</td>';
      els['tbl-body'].appendChild(tr);
      renderStats(pending, snoozed, done);
      return;
    }

    visible.forEach(function (r) {
      var tr = document.createElement('tr');
      if (isOverdue(r)) {
        tr.style.borderLeft = '3px solid #F87171';
      } else {
        tr.style.borderLeft = '3px solid transparent';
      }
      tr.innerHTML =
        '<td><strong>' + TS.escapeHtml(r.contactName || 'Unnamed') + '</strong>' +
          (r.phone ? '<br><span style="color:var(--text-dim); font-size:calc(12px * var(--font-scale));">' + TS.escapeHtml(r.phone) + '</span>' : '') +
        '</td>' +
        '<td>' + TS.escapeHtml(formatDue(r)) + '</td>' +
        '<td>' + TS.escapeHtml(r.note || '—') + '</td>' +
        '<td>' + statusBadge(r) + '</td>' +
        '<td></td>';

      var actionsTd = tr.querySelector('td:last-child');

      if (r.status !== 'done') {
        var doneBtn = document.createElement('button');
        doneBtn.type = 'button';
        doneBtn.className = 'btn-primary btn-sm';
        doneBtn.textContent = 'Mark Done';
        doneBtn.style.marginRight = '6px';
        doneBtn.addEventListener('click', function () { markDone(r.id); });
        actionsTd.appendChild(doneBtn);

        var snoozeBtn = document.createElement('button');
        snoozeBtn.type = 'button';
        snoozeBtn.className = 'btn-ghost btn-sm';
        snoozeBtn.textContent = 'Snooze 1 Day';
        snoozeBtn.style.marginRight = '6px';
        snoozeBtn.addEventListener('click', function () { snoozeOneDay(r.id); });
        actionsTd.appendChild(snoozeBtn);
      }

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn-danger';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', function () { deleteReminder(r.id); });
      actionsTd.appendChild(delBtn);

      els['tbl-body'].appendChild(tr);
    });

    renderStats(pending, snoozed, done);
  }

  function renderStats(pending, snoozed, done) {
    var overdueCount = reminders.filter(isOverdue).length;
    var pendingCount = pending.length + snoozed.length;
    var stats = [
      { label: 'Pending', value: pendingCount },
      { label: 'Overdue', value: overdueCount },
      { label: 'Done', value: done.length }
    ];
    els['tool-stats'].innerHTML = stats.map(function (s) {
      return '<div class="tool-stat-card"><div class="tool-stat-label">' + s.label + '</div>' +
        '<div class="tool-stat-value">' + s.value + '</div></div>';
    }).join('');
  }

  // ── add / update reminders ──
  function addReminder() {
    var contactName = els['f-name'].value.trim();
    var phone = els['f-phone'].value.trim();
    var dueDate = els['f-date'].value;
    var dueTime = els['f-time'].value;
    var note = els['f-note'].value.trim();

    if (!contactName) { els['f-name'].focus(); return; }
    if (!dueDate) { els['f-date'].focus(); return; }

    reminders.push({
      id: TS.uid(),
      contactName: contactName,
      phone: phone,
      dueDate: dueDate,
      dueTime: dueTime,
      note: note,
      status: 'pending'
    });
    save();

    els['f-name'].value = '';
    els['f-phone'].value = '';
    els['f-date'].value = TS.todayISO();
    els['f-time'].value = '';
    els['f-note'].value = '';
    els['f-name'].focus();

    render();
  }

  function findReminder(id) {
    for (var i = 0; i < reminders.length; i++) {
      if (reminders[i].id === id) return reminders[i];
    }
    return null;
  }

  function markDone(id) {
    var r = findReminder(id);
    if (!r) return;
    r.status = 'done';
    save();
    render();
  }

  function addOneDayISO(iso) {
    var parts = iso.split('-');
    var d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    d.setDate(d.getDate() + 1);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function snoozeOneDay(id) {
    var r = findReminder(id);
    if (!r || !r.dueDate) return;
    r.dueDate = addOneDayISO(r.dueDate);
    r.status = 'pending';
    save();
    render();
  }

  function deleteReminder(id) {
    if (!confirm('Delete this reminder? This cannot be undone.')) return;
    reminders = reminders.filter(function (r) { return r.id !== id; });
    save();
    render();
  }

  // ── browser notifications (progressive enhancement — must never throw) ──
  function setupNotifications() {
    try {
      if (typeof Notification === 'undefined') return;

      function refreshNotifyUI() {
        try {
          if (Notification.permission === 'granted') {
            els['btn-notify'].style.display = 'none';
            els['notify-status'].textContent = '🔔 Reminders enabled on this device';
          } else if (Notification.permission === 'denied') {
            els['btn-notify'].style.display = 'none';
            els['notify-status'].textContent = 'Notifications blocked — enable them in your browser settings to get reminders.';
          } else {
            els['btn-notify'].style.display = '';
            els['notify-status'].textContent = '';
          }
        } catch (e) {}
      }

      els['btn-notify'].addEventListener('click', function () {
        try {
          Notification.requestPermission().then(function () {
            refreshNotifyUI();
          }).catch(function () {});
        } catch (e) {}
      });

      refreshNotifyUI();

      function checkDueNotifications() {
        try {
          if (Notification.permission !== 'granted') return;
          var now = Date.now();
          reminders.forEach(function (r) {
            if (r.status !== 'pending') return;
            if (!r.dueDate) return;
            if (notifiedIds.has(r.id)) return;
            var due = new Date(r.dueDate + 'T' + (r.dueTime || '00:00') + ':00').getTime();
            if (isNaN(due)) return;
            var diffMs = now - due;
            // Fire only for items that just became due — within the last 5 minutes —
            // so we don't spam notifications for every old overdue item on load.
            if (diffMs >= 0 && diffMs <= 5 * 60 * 1000) {
              try {
                new Notification('Follow-up due: ' + (r.contactName || 'Reminder'), {
                  body: r.note || 'Time to follow up.' + (r.phone ? ' (' + r.phone + ')' : '')
                });
              } catch (e) {}
              notifiedIds.add(r.id);
            }
          });
        } catch (e) {}
      }

      checkDueNotifications();
      setInterval(checkDueNotifications, 60000);
    } catch (e) {
      // Notification API unsupported or blocked — degrade silently, no reminders.
    }
  }

  // ── wire up ──
  els['btn-add'].addEventListener('click', addReminder);
  els['f-show-done'].addEventListener('change', render);
  els['f-date'].value = TS.todayISO();

  render();
  setupNotifications();
})();
