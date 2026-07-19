/* One shared "Send on WhatsApp" enhancer for the AI tools.
   Every AI tool renders its output next to an .ai-copy-btn. This script
   watches for those buttons and drops a green WhatsApp button beside each
   one; clicking opens WhatsApp with that block's exact text pre-filled, so
   the message the tool wrote can be sent without a copy-paste detour.
   No recipient is forced: wa.me/?text lets the user pick the chat (right
   for outreach and broadcasts). Loaded on the AI tool pages only. */
(function () {
  'use strict';

  var WA_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true" style="vertical-align:-2px;margin-right:6px;"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.9c0 2.1.55 4.05 1.6 5.8L2 22l4.44-1.16a9.9 9.9 0 0 0 5.6 1.72h.01c5.46 0 9.9-4.45 9.9-9.9C21.95 6.45 17.5 2 12.04 2Zm0 18.06h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.63.69.7-2.56-.2-.32a8.2 8.2 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.4 5.83c0 4.54-3.69 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42l-.48-.01c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.16 1.75 2.67 4.25 3.74.59.26 1.05.41 1.42.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z"/></svg>';

  function textMinusControls(el) {
    var c = el.cloneNode(true);
    Array.prototype.forEach.call(c.querySelectorAll('.ai-output-head, .ai-output-actions, button, h3'), function (n) { n.remove(); });
    return c.innerText.trim();
  }

  // Find the exact text a given copy button is responsible for.
  function outputText(btn) {
    var dc = btn.getAttribute('data-copy');
    if (dc) {
      var el = (dc[0] === '#' || dc[0] === '.') ? document.querySelector(dc) : document.getElementById(dc);
      if (el) return el.innerText.trim();
    }
    var v = btn.closest('.ai-variation') || btn.closest('.ai-output');
    if (v) {
      var inner = null;
      Array.prototype.forEach.call(v.querySelectorAll('.ai-output'), function (o) {
        if (!inner && !o.contains(btn)) inner = o;
      });
      if (inner) return inner.innerText.trim();
      return textMinusControls(v);
    }
    // Page-level single output (blog, about). Only unambiguous when there's one.
    var outs = [];
    Array.prototype.forEach.call(document.querySelectorAll('.ai-output'), function (o) {
      var t = o.innerText.trim();
      if (t) outs.push(t);
    });
    return outs.length === 1 ? outs[0] : null;
  }

  function enhance(btn) {
    if (btn.dataset.waDone) return;
    // Skip "Copy all" style buttons — they don't map to one block.
    if (btn.textContent.trim().toLowerCase().indexOf('copy all') !== -1) return;
    var actions = btn.closest('.ai-output-actions');
    if (!actions) return;
    btn.dataset.waDone = '1';

    var wa = document.createElement('button');
    wa.type = 'button';
    wa.className = 'ai-wa-btn';
    wa.innerHTML = WA_ICON + 'Send on WhatsApp';
    wa.addEventListener('click', function () {
      var t = outputText(btn);
      if (!t) return;
      window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
    });
    btn.insertAdjacentElement('afterend', wa);
  }

  function scan(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll('.ai-copy-btn'), enhance);
  }

  var obs = new MutationObserver(function (muts) {
    muts.forEach(function (m) {
      Array.prototype.forEach.call(m.addedNodes, function (n) {
        if (n.nodeType !== 1) return;
        if (n.matches && n.matches('.ai-copy-btn')) enhance(n);
        if (n.querySelectorAll) scan(n);
      });
    });
  });
  if (document.body) obs.observe(document.body, { childList: true, subtree: true });
  scan(document);
})();
