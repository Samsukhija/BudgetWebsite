/* Shared helpers for /tools/* pages. No AI, no backend — pure JS utilities
   so every tool formats money/dates/CSV the same way. */
window.ToolsShared = (function () {
  'use strict';

  var STATES = [
    'Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh',
    'Chhattisgarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Goa','Gujarat','Haryana',
    'Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Ladakh',
    'Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland',
    'Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura',
    'Uttar Pradesh','Uttarakhand','West Bengal'
  ];

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function todayISO() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function formatDateDisplay(iso) {
    if (!iso) return '—';
    var parts = iso.split('-');
    if (parts.length !== 3) return iso;
    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return parts[2] + ' ' + MONTHS[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
  }

  function formatMoney(n) {
    if (isNaN(n) || n == null) n = 0;
    return '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function formatMoneyWhole(n) {
    if (isNaN(n) || n == null) n = 0;
    return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  // Indian numbering (lakh/crore) amount-in-words.
  var ONES = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
    'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'];
  var TENS = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function twoDigitsToWords(n) {
    if (n === 0) return '';
    if (n < 20) return ONES[n];
    var t = Math.floor(n / 10), o = n % 10;
    return TENS[t] + (o ? ' ' + ONES[o] : '');
  }
  function threeDigitsToWords(n) {
    var h = Math.floor(n / 100), rest = n % 100;
    var parts = [];
    if (h) parts.push(ONES[h] + ' Hundred');
    if (rest) parts.push(twoDigitsToWords(rest));
    return parts.join(' ');
  }
  function numberToWords(num) {
    num = Math.round(num);
    if (num === 0) return 'Zero';
    var crore = Math.floor(num / 10000000); num %= 10000000;
    var lakh = Math.floor(num / 100000); num %= 100000;
    var thousand = Math.floor(num / 1000); num %= 1000;
    var hundred = num;
    var parts = [];
    if (crore) parts.push(threeDigitsToWords(crore) + ' Crore');
    if (lakh) parts.push((lakh < 100 ? twoDigitsToWords(lakh) : threeDigitsToWords(lakh)) + ' Lakh');
    if (thousand) parts.push((thousand < 100 ? twoDigitsToWords(thousand) : threeDigitsToWords(thousand)) + ' Thousand');
    if (hundred) parts.push(threeDigitsToWords(hundred));
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }
  function amountInWords(n) {
    var rupees = Math.floor(n);
    var paise = Math.round((n - rupees) * 100);
    var words = numberToWords(rupees) + ' Rupees';
    if (paise) words += ' and ' + numberToWords(paise) + ' Paise';
    return words + ' Only';
  }

  function escapeHtml(s) {
    var div = document.createElement('div');
    div.textContent = s == null ? '' : String(s);
    return div.innerHTML;
  }

  // rows: array of objects with the same keys; headers: [{key,label}]
  function downloadCSV(filename, headers, rows) {
    var esc = function (v) {
      v = v == null ? '' : String(v);
      if (/[",\n]/.test(v)) v = '"' + v.replace(/"/g, '""') + '"';
      return v;
    };
    var lines = [headers.map(function (h) { return esc(h.label); }).join(',')];
    rows.forEach(function (row) {
      lines.push(headers.map(function (h) { return esc(row[h.key]); }).join(','));
    });
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function loadJSON(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function populateStateSelect(select, placeholder) {
    if (placeholder) {
      var opt0 = document.createElement('option');
      opt0.value = ''; opt0.textContent = placeholder;
      select.appendChild(opt0);
    }
    STATES.forEach(function (s) {
      var opt = document.createElement('option');
      opt.value = s; opt.textContent = s;
      select.appendChild(opt);
    });
  }

  return {
    STATES: STATES, uid: uid, todayISO: todayISO, formatDateDisplay: formatDateDisplay,
    formatMoney: formatMoney, formatMoneyWhole: formatMoneyWhole, amountInWords: amountInWords,
    escapeHtml: escapeHtml, downloadCSV: downloadCSV, loadJSON: loadJSON, saveJSON: saveJSON,
    populateStateSelect: populateStateSelect
  };
})();
