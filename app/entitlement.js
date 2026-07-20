/* BWEntitlement — does this account own a given pack?

   INTERIM: entitlement is a flag in this browser, switched on by an activation
   code that Samar hands the customer after they pay (UPI / in person). It is
   bypassable — which is fine for a trust-based pilot with customers you know.
   Later, Razorpay + a signed server webhook set this instead, and this whole
   file becomes a read against the real subscription. The has(email, pack)
   signature stays the same, so the pages calling it do not change. */
window.BWEntitlement = (function () {
  'use strict';

  var KEY = 'bw_app_entitlements_v1';
  function read() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function write(v) { localStorage.setItem(KEY, JSON.stringify(v)); }
  function norm(e) { return (e || '').trim().toLowerCase(); }

  function has(email, pack) {
    email = norm(email);
    var all = read();
    return !!(all[email] && all[email][pack] && all[email][pack].active);
  }

  function activate(email, pack, code) {
    if ((code || '').trim().toUpperCase() !== String(BW_APP.ACTIVATION_CODE).toUpperCase()) {
      return { error: 'That code is not right. Check the activation code we sent you on WhatsApp.' };
    }
    email = norm(email);
    var all = read();
    all[email] = all[email] || {};
    all[email][pack] = { active: true, since: Date.now() };
    write(all);
    return { ok: true };
  }

  return { has: has, activate: activate };
})();
