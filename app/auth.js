/* BWAuth — the account layer for /app/.

   ⚠️ INTERIM, LOCAL-ONLY MOCK. Accounts and the "session" live in this one
   browser. This is NOT real security and protects NO server data — there is no
   server yet. It exists so the login *flow* is real and demoable now. When
   Supabase Auth is wired in later, ONLY the insides of this module change; every
   page that calls BWAuth.signIn / signUp / signOut / currentUser stays exactly
   the same. That is the whole point of keeping it behind this interface. */
window.BWAuth = (function () {
  'use strict';

  var ACCOUNTS = 'bw_app_accounts_v1';
  var SESSION = 'bw_app_session_v1';

  function read(key) { try { return JSON.parse(localStorage.getItem(key)) || null; } catch (e) { return null; } }
  function write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function norm(email) { return (email || '').trim().toLowerCase(); }

  /* A tiny non-cryptographic hash, only so a password is not sitting in plain
     text in localStorage. It is NOT security — anyone with the device can read
     around it. Real password handling arrives with Supabase. */
  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return String(h >>> 0);
  }

  function accounts() { return read(ACCOUNTS) || {}; }

  function signUp(name, email, pw) {
    name = (name || '').trim();
    email = norm(email);
    if (!name) return { error: 'Please enter your name.' };
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: 'Please enter a valid email address.' };
    if (!pw || pw.length < 6) return { error: 'Password must be at least 6 characters.' };
    var all = accounts();
    if (all[email]) return { error: 'An account with this email already exists on this device. Try logging in instead.' };
    all[email] = { email: email, name: name, pass: hash(pw), createdAt: Date.now() };
    write(ACCOUNTS, all);
    write(SESSION, { email: email, since: Date.now() });
    return { user: { email: email, name: name } };
  }

  function signIn(email, pw) {
    email = norm(email);
    var acc = accounts()[email];
    if (!acc) return { error: 'No account found for this email on this device.' };
    if (acc.pass !== hash(pw || '')) return { error: 'Wrong password. Try again.' };
    write(SESSION, { email: email, since: Date.now() });
    return { user: { email: acc.email, name: acc.name } };
  }

  function signOut() { localStorage.removeItem(SESSION); }

  function currentUser() {
    var s = read(SESSION);
    if (!s || !s.email) return null;
    var acc = accounts()[s.email];
    if (!acc) return null;
    return { email: acc.email, name: acc.name };
  }

  return { signUp: signUp, signIn: signIn, signOut: signOut, currentUser: currentUser };
})();
