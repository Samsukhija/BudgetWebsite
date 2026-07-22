/* /app/bookings/ — the Bookings Pack workspace: a persistent running ledger of
   every appointment ever booked (not just today's), explicit lifecycle status
   tracking (Upcoming -> Completed / No-show / Cancelled), and a one-tap
   WhatsApp reminder composer per booking. Local-first: no backend yet, same
   localStorage pattern as the rest of the site. Extends the data shape used
   by the free Appointment / Booking Scheduler tool (tools/appointment-scheduler)
   with its own storage key so the two never collide. */
(function () {
  'use strict';

  var TS = window.ToolsShared;

  // ── entitlement gate ──
  var user = window.BWAuth ? BWAuth.currentUser() : null;
  if (!user) { location.href = '/app/'; return; }
  if (!BWEntitlement.has(user.email, 'bookings')) { location.href = '/app/'; return; }

  var STORAGE_KEY = 'bw_pack_bookings_v1';
  var STATUSES = ['Upcoming', 'Completed', 'No-show', 'Cancelled'];
  var STATUS_BADGE = {
    Upcoming: 'tool-badge-accent', Completed: 'tool-badge-good',
    'No-show': 'tool-badge-warn', Cancelled: 'tool-badge-bad'
  };

  function listBookings() { return TS.loadJSON(STORAGE_KEY, []); }
  function saveBookings(arr) { TS.saveJSON(STORAGE_KEY, arr); }

  // ── time helpers ──
  function timeToMinutes(hhmm) {
    var parts = (hhmm || '').split(':');
    var h = parseInt(parts[0], 10), m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  }
  function formatTime12(hhmm) {
    var mins = timeToMinutes(hhmm);
    if (mins == null) return '-';
    var h = Math.floor(mins / 60) % 24, m = mins % 60;
    var ampm = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + String(m).padStart(2, '0') + ' ' + ampm;
  }

  // ── date-range helpers for stats ──
  function startOfWeekISO(iso) {
    var d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) d = new Date();
    var day = d.getDay(); // 0 = Sun
    var diff = day === 0 ? -6 : 1 - day; // back to Monday
    d.setDate(d.getDate() + diff);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function endOfWeekISO(iso) {
    var d = new Date(startOfWeekISO(iso) + 'T00:00:00');
    d.setDate(d.getDate() + 6);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function monthKey(iso) { return (iso || '').slice(0, 7); }

  // ── WhatsApp reminder (phone-targeting logic matches internal/proposal's btn-wa) ──
  function sendReminder(rec) {
    var digits = (rec.phone || '').replace(/\D/g, '');
    var target = digits.length === 10 ? '91' + digits : '';
    var text = 'Hi ' + (rec.customerName || 'there') + ', reminder for your ' + (rec.service || 'appointment') +
      ' appointment on ' + TS.formatDateDisplay(rec.date) + ' at ' + formatTime12(rec.time) + '.';
    window.open('https://wa.me/' + target + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  }

  // ── tabs ──
  document.querySelectorAll('.bookings-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.bookings-tab').forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.getElementById('tab-day').hidden = btn.dataset.tab !== 'day';
      document.getElementById('tab-all').hidden = btn.dataset.tab !== 'all';
      if (btn.dataset.tab === 'all') renderAllList();
    });
  });

  function showDayView(which) {
    document.getElementById('day-list-view').hidden = which !== 'list';
    document.getElementById('bk-form-view').hidden = which !== 'form';
  }

  // ── new booking form ──
  function openNewBookingForm() {
    document.getElementById('bkf-name').value = '';
    document.getElementById('bkf-phone').value = '';
    document.getElementById('bkf-service').value = '';
    document.getElementById('bkf-date').value = document.getElementById('bk-date').value || TS.todayISO();
    document.getElementById('bkf-time').value = '';
    document.getElementById('bkf-notes').value = '';
    showFormError('');
    showDayView('form');
    document.getElementById('bkf-name').focus();
  }

  function showFormError(msg) {
    var el = document.getElementById('bk-form-error');
    el.textContent = msg;
    el.hidden = !msg;
  }

  function saveBookingFromForm() {
    var rec = {
      id: TS.uid(),
      customerName: document.getElementById('bkf-name').value.trim(),
      phone: document.getElementById('bkf-phone').value.trim(),
      service: document.getElementById('bkf-service').value.trim(),
      date: document.getElementById('bkf-date').value,
      time: document.getElementById('bkf-time').value,
      status: 'Upcoming',
      notes: document.getElementById('bkf-notes').value.trim(),
      createdAt: Date.now()
    };
    if (!rec.customerName) { showFormError('Customer name is required.'); return; }
    if (!rec.date) { showFormError('Date is required.'); return; }
    if (!rec.time) { showFormError('Time is required.'); return; }

    var all = listBookings();
    all.push(rec);
    saveBookings(all);

    document.getElementById('bk-date').value = rec.date;
    showDayView('list');
    renderAll();
  }

  // ── day view ──
  function renderDayList() {
    var date = document.getElementById('bk-date').value || TS.todayISO();
    var day = listBookings().filter(function (b) { return b.date === date; });
    day.sort(function (a, b) { return (timeToMinutes(a.time) || 0) - (timeToMinutes(b.time) || 0); });

    var body = document.getElementById('day-table-body');
    body.innerHTML = day.map(function (rec) {
      var actions = '';
      if (rec.status === 'Upcoming') {
        actions +=
          '<button type="button" class="btn-ghost btn-sm bk-act" data-id="' + rec.id + '" data-status="Completed">Complete</button>' +
          '<button type="button" class="btn-ghost btn-sm bk-act" data-id="' + rec.id + '" data-status="No-show">No-show</button>' +
          '<button type="button" class="btn-ghost btn-sm bk-act" data-id="' + rec.id + '" data-status="Cancelled">Cancel</button>';
      }
      actions += '<button type="button" class="btn-wa-doc btn-sm bk-wa" data-id="' + rec.id + '">Remind on WhatsApp</button>';
      return '<tr data-id="' + rec.id + '">' +
        '<td>' + formatTime12(rec.time) + '</td>' +
        '<td><div class="bk-customer-name">' + TS.escapeHtml(rec.customerName || '-') + '</div>' +
          (rec.phone ? '<div class="bk-customer-phone">' + TS.escapeHtml(rec.phone) + '</div>' : '') + '</td>' +
        '<td>' + TS.escapeHtml(rec.service || '-') + (rec.notes ? '<div class="bk-notes">' + TS.escapeHtml(rec.notes) + '</div>' : '') + '</td>' +
        '<td><span class="tool-badge ' + (STATUS_BADGE[rec.status] || 'tool-badge-neutral') + '">' + rec.status + '</span></td>' +
        '<td><div class="bk-row-actions">' + actions + '</div></td></tr>';
    }).join('');

    document.getElementById('day-empty').hidden = day.length > 0;

    body.querySelectorAll('.bk-act').forEach(function (b) {
      b.addEventListener('click', function () { changeStatus(b.dataset.id, b.dataset.status); });
    });
    body.querySelectorAll('.bk-wa').forEach(function (b) {
      b.addEventListener('click', function () {
        var rec = listBookings().filter(function (r) { return r.id === b.dataset.id; })[0];
        if (rec) sendReminder(rec);
      });
    });
  }

  function changeStatus(id, status) {
    var all = listBookings();
    var rec = all.filter(function (r) { return r.id === id; })[0];
    if (!rec) return;
    rec.status = status;
    saveBookings(all);
    renderAll();
  }

  // ── all bookings ledger ──
  function renderAllList() {
    var filter = document.getElementById('all-status-filter').value;
    var all = listBookings().filter(function (b) { return !filter || b.status === filter; });
    all.sort(function (a, b) {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1; // newest date first
      return (timeToMinutes(b.time) || 0) - (timeToMinutes(a.time) || 0);
    });

    var body = document.getElementById('all-table-body');
    body.innerHTML = all.map(function (rec) {
      return '<tr data-id="' + rec.id + '">' +
        '<td>' + TS.escapeHtml(TS.formatDateDisplay(rec.date)) + '</td>' +
        '<td>' + formatTime12(rec.time) + '</td>' +
        '<td>' + TS.escapeHtml(rec.customerName || '-') + '</td>' +
        '<td>' + TS.escapeHtml(rec.phone || '-') + '</td>' +
        '<td>' + TS.escapeHtml(rec.service || '-') + '</td>' +
        '<td><span class="tool-badge ' + (STATUS_BADGE[rec.status] || 'tool-badge-neutral') + '">' + rec.status + '</span></td>' +
        '<td><button type="button" class="btn-wa-doc btn-sm all-wa" data-id="' + rec.id + '">Remind on WhatsApp</button></td></tr>';
    }).join('');

    document.getElementById('all-empty').hidden = all.length > 0;

    body.querySelectorAll('.all-wa').forEach(function (b) {
      b.addEventListener('click', function () {
        var rec = listBookings().filter(function (r) { return r.id === b.dataset.id; })[0];
        if (rec) sendReminder(rec);
      });
    });
  }

  // ── stats ──
  function renderStats() {
    var all = listBookings();
    var today = TS.todayISO();
    var weekStart = startOfWeekISO(today), weekEnd = endOfWeekISO(today);
    var curMonth = monthKey(today);

    var todaysCount = all.filter(function (b) { return b.date === today; }).length;
    var weekUpcoming = all.filter(function (b) {
      return b.status === 'Upcoming' && b.date >= weekStart && b.date <= weekEnd;
    }).length;
    var monthCompleted = all.filter(function (b) { return b.status === 'Completed' && monthKey(b.date) === curMonth; }).length;
    var monthNoShow = all.filter(function (b) { return b.status === 'No-show' && monthKey(b.date) === curMonth; }).length;

    document.getElementById('bookings-stats').innerHTML =
      '<div class="tool-stat-card"><div class="tool-stat-label">Today\'s Bookings</div><div class="tool-stat-value">' + todaysCount + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">This Week Upcoming</div><div class="tool-stat-value">' + weekUpcoming + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">This Month Completed</div><div class="tool-stat-value">' + monthCompleted + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">This Month No-shows</div><div class="tool-stat-value">' + monthNoShow + '</div></div>';
  }

  function renderAll() {
    renderDayList();
    if (!document.getElementById('tab-all').hidden) renderAllList();
    renderStats();
  }

  // ── wire up ──
  document.getElementById('btn-new-booking').addEventListener('click', openNewBookingForm);
  document.getElementById('bkf-save').addEventListener('click', saveBookingFromForm);
  document.getElementById('bkf-cancel').addEventListener('click', function () { showDayView('list'); });
  document.getElementById('bk-date').addEventListener('change', renderDayList);
  document.getElementById('all-status-filter').addEventListener('change', renderAllList);

  document.getElementById('hdr-biz').textContent = user.name + ' · ' + user.email;

  // ── init ──
  document.getElementById('bk-date').value = TS.todayISO();
  renderAll();
})();
