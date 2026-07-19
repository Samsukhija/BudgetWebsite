(function () {
  'use strict';

  var TS = window.ToolsShared;
  var STORAGE_KEY = 'bw_tools_appointments_v1';
  var STATUSES = ['Confirmed', 'Completed', 'Cancelled', 'No-show'];

  var appointments = TS.loadJSON(STORAGE_KEY, []);

  var els = {};
  [
    'f-client-name', 'f-phone', 'f-service', 'f-date', 'f-time', 'f-duration', 'f-notes',
    'form-error', 'conflict-box', 'conflict-messages', 'btn-save-anyway', 'btn-cancel-conflict',
    'btn-add-appt', 'sched-date', 'day-list-body', 'day-empty', 'upcoming-body', 'upcoming-empty'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var pendingAppt = null; // appointment awaiting "Save Anyway" confirmation

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
    var h = Math.floor(mins / 60) % 24;
    var m = mins % 60;
    var ampm = h >= 12 ? 'PM' : 'AM';
    var h12 = h % 12; if (h12 === 0) h12 = 12;
    return h12 + ':' + String(m).padStart(2, '0') + ' ' + ampm;
  }

  // returns HH:MM (wrapped to the day) for a start time + minutes offset
  function addMinutesToTime(hhmm, addMins) {
    var start = timeToMinutes(hhmm);
    if (start == null) return hhmm;
    var total = ((start + addMins) % 1440 + 1440) % 1440;
    var h = Math.floor(total / 60), m = total % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  function computeRange(appt) {
    var start = timeToMinutes(appt.time);
    var dur = appt.durationMins > 0 ? appt.durationMins : 30;
    return { start: start, end: start + dur };
  }

  function findConflicts(candidate) {
    return appointments.filter(function (a) {
      if (a.date !== candidate.date) return false;
      if (a.status !== 'Confirmed') return false;
      var candRange = computeRange(candidate);
      var aRange = computeRange(a);
      return candRange.start < aRange.end && aRange.start < candRange.end;
    });
  }

  // ── persistence ──
  function persist() {
    TS.saveJSON(STORAGE_KEY, appointments);
  }

  // ── form ──
  function readForm() {
    return {
      id: TS.uid(),
      clientName: els['f-client-name'].value.trim(),
      phone: els['f-phone'].value.trim(),
      service: els['f-service'].value.trim(),
      date: els['f-date'].value,
      time: els['f-time'].value,
      durationMins: parseInt(els['f-duration'].value, 10) || 30,
      status: 'Confirmed',
      notes: els['f-notes'].value.trim()
    };
  }

  function showFormError(msg) {
    els['form-error'].textContent = msg;
    els['form-error'].style.display = msg ? '' : 'none';
  }

  function resetForm() {
    els['f-client-name'].value = '';
    els['f-phone'].value = '';
    els['f-service'].value = '';
    els['f-date'].value = TS.todayISO();
    els['f-time'].value = '';
    els['f-duration'].value = 30;
    els['f-notes'].value = '';
    showFormError('');
  }

  function hideConflictBox() {
    els['conflict-box'].style.display = 'none';
    els['conflict-messages'].innerHTML = '';
    pendingAppt = null;
  }

  function showConflictBox(candidate, conflicts) {
    pendingAppt = candidate;
    els['conflict-messages'].innerHTML = conflicts.map(function (c) {
      return '<div class="appt-conflict-msg">Overlaps with ' + TS.escapeHtml(c.clientName || 'an existing appointment') +
        '\'s appointment at ' + formatTime12(c.time) + '</div>';
    }).join('');
    els['conflict-box'].style.display = '';
  }

  function commitAppointment(appt) {
    appointments.push(appt);
    persist();
    hideConflictBox();
    resetForm();
    renderDayList();
    renderUpcoming();
  }

  function handleAddClick() {
    showFormError('');
    hideConflictBox();
    var appt = readForm();

    if (!appt.clientName) { showFormError('Client name is required.'); return; }
    if (!appt.date) { showFormError('Date is required.'); return; }
    if (!appt.time) { showFormError('Time is required.'); return; }
    if (appt.durationMins <= 0) { showFormError('Duration must be greater than 0 minutes.'); return; }

    var conflicts = findConflicts(appt);
    if (conflicts.length) {
      showConflictBox(appt, conflicts);
      return;
    }
    commitAppointment(appt);
  }

  // ── day list ──
  function renderDayList() {
    var date = els['sched-date'].value || TS.todayISO();
    var dayAppts = appointments.filter(function (a) { return a.date === date; });
    dayAppts.sort(function (a, b) { return timeToMinutes(a.time) - timeToMinutes(b.time); });

    var tbody = els['day-list-body'];
    tbody.innerHTML = '';

    if (!dayAppts.length) {
      els['day-empty'].style.display = '';
      document.getElementById('day-table').style.display = 'none';
      return;
    }
    els['day-empty'].style.display = 'none';
    document.getElementById('day-table').style.display = '';

    dayAppts.forEach(function (a) {
      var endTime = addMinutesToTime(a.time, a.durationMins > 0 ? a.durationMins : 30);
      var tr = document.createElement('tr');

      var tdTime = document.createElement('td');
      tdTime.innerHTML = '<span class="appt-time-range">' + formatTime12(a.time) + '-' + formatTime12(endTime) + '</span>';
      tr.appendChild(tdTime);

      var tdClient = document.createElement('td');
      tdClient.innerHTML = '<div class="appt-client-name">' + TS.escapeHtml(a.clientName || '-') + '</div>' +
        (a.phone ? '<div class="appt-client-phone">' + TS.escapeHtml(a.phone) + '</div>' : '');
      tr.appendChild(tdClient);

      var tdService = document.createElement('td');
      tdService.textContent = a.service || '-';
      if (a.notes) {
        var notesDiv = document.createElement('div');
        notesDiv.className = 'appt-notes';
        notesDiv.textContent = a.notes;
        tdService.appendChild(notesDiv);
      }
      tr.appendChild(tdService);

      var tdStatus = document.createElement('td');
      var select = document.createElement('select');
      select.className = 'appt-status-select';
      STATUSES.forEach(function (s) {
        var opt = document.createElement('option');
        opt.value = s; opt.textContent = s;
        if (a.status === s) opt.selected = true;
        select.appendChild(opt);
      });
      select.addEventListener('change', function () {
        a.status = select.value;
        persist();
        renderUpcoming();
      });
      tdStatus.appendChild(select);
      tr.appendChild(tdStatus);

      var tdDelete = document.createElement('td');
      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn-danger';
      delBtn.textContent = 'Delete';
      delBtn.addEventListener('click', function () {
        if (!confirm('Delete this appointment for ' + (a.clientName || 'this client') + '?')) return;
        appointments = appointments.filter(function (x) { return x.id !== a.id; });
        persist();
        renderDayList();
        renderUpcoming();
      });
      tdDelete.appendChild(delBtn);
      tr.appendChild(tdDelete);

      tbody.appendChild(tr);
    });
  }

  // ── upcoming ──
  function renderUpcoming() {
    var now = new Date();
    var upcoming = appointments.filter(function (a) {
      if (a.status !== 'Confirmed') return false;
      var dt = new Date(a.date + 'T' + (a.time || '00:00') + ':00');
      if (isNaN(dt.getTime())) return false;
      return dt.getTime() >= now.getTime();
    });
    upcoming.sort(function (a, b) {
      var da = new Date(a.date + 'T' + a.time + ':00');
      var db = new Date(b.date + 'T' + b.time + ':00');
      return da.getTime() - db.getTime();
    });
    upcoming = upcoming.slice(0, 5);

    var tbody = els['upcoming-body'];
    tbody.innerHTML = '';

    if (!upcoming.length) {
      els['upcoming-empty'].style.display = '';
      document.getElementById('upcoming-table').style.display = 'none';
      return;
    }
    els['upcoming-empty'].style.display = 'none';
    document.getElementById('upcoming-table').style.display = '';

    upcoming.forEach(function (a) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + TS.escapeHtml(TS.formatDateDisplay(a.date)) + '</td>' +
        '<td class="appt-time-range">' + formatTime12(a.time) + '</td>' +
        '<td>' + TS.escapeHtml(a.clientName || '-') + '</td>' +
        '<td>' + TS.escapeHtml(a.service || '-') + '</td>';
      tbody.appendChild(tr);
    });
  }

  // ── wire up ──
  els['btn-add-appt'].addEventListener('click', handleAddClick);
  els['btn-save-anyway'].addEventListener('click', function () {
    if (pendingAppt) commitAppointment(pendingAppt);
  });
  els['btn-cancel-conflict'].addEventListener('click', function () {
    hideConflictBox();
  });
  els['sched-date'].addEventListener('change', renderDayList);

  // ── init ──
  els['f-date'].value = TS.todayISO();
  els['sched-date'].value = TS.todayISO();
  renderDayList();
  renderUpcoming();
})();
