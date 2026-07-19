/* WhatsApp Broadcast Writer — BYOK AI tool.
   Generates two ready-to-send WhatsApp broadcast messages for a small
   Indian business. All AI goes through window.AIShared (visitor's own key). */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var els = {
    business:  $('f-business'),
    audience:  $('f-audience'),
    about:     $('f-about'),
    cta:       $('f-cta'),
    emoji:     $('f-emoji'),
    generate:  $('generate-btn'),
    hint:      $('ai-hint'),
    error:     $('ai-error'),
    outHead:   $('output-head'),
    regen:     $('regen-btn'),
    v1wrap:    $('var-1-wrap'),
    v2wrap:    $('var-2-wrap'),
    v1:        $('var-1'),
    v2:        $('var-2'),
    copy1:     $('copy-1'),
    copy2:     $('copy-2')
  };

  /* ── enable/disable generate based on saved key ── */
  function updateGenerateEnabled() {
    var ok = AIShared.hasKey();
    els.generate.disabled = !ok;
    els.hint.style.display = ok ? 'none' : 'block';
  }

  AIShared.mountSettings($('ai-settings-mount'), updateGenerateEnabled);
  updateGenerateEnabled();

  /* ── prompt construction ── */
  var SYSTEM_PROMPT =
    "You are an expert Indian small-business copywriter who writes WhatsApp broadcast messages that real customers actually read and act on. Your clients are small businesses across India — dentists, retailers, salons, manufacturers, tuition classes, consultants, restaurants. You write in warm, natural Indian English (the everyday register a shop owner uses with regulars), rupees as ₹, and India-specific context (festivals like Diwali, Holi, Raksha Bandhan, Eid; GST; local delivery; UPI).\n\n" +
    "Follow these WhatsApp broadcast rules exactly:\n" +
    "- Open with a short, personal-feeling greeting or hook — never a generic 'Dear Customer' or a corporate subject line.\n" +
    "- Short lines with line breaks between thoughts. WhatsApp is skimmed on a phone, not read like a letter. No long paragraphs.\n" +
    "- Be concrete: name the actual offer, product, date, discount or reason. Never vague filler like 'we value your business' or 'exciting news'.\n" +
    "- One clear call-to-action near the end. If a link/number is provided, use it verbatim. If none is provided, use a natural soft CTA like 'Reply YES to book' or 'Send us a message to know more'.\n" +
    "- You MAY use WhatsApp bold with single *asterisks* around a key phrase or price, sparingly (at most once or twice).\n" +
    "- Keep each message under ~600 characters. Tight is better than long.\n" +
    "- Sign off with the business name.\n" +
    "- Only add a soft opt-out line ('Reply STOP to opt out') when the message is clearly promotional/marketing to a broad list. Do NOT add it to genuine service reminders or one-to-few announcements.\n" +
    "- Sound human. No robotic template phrasing, no hashtags, no ALL-CAPS shouting, no fake urgency that isn't in the brief.\n\n" +
    "Write TWO distinctly different variations — different opening, different angle, different rhythm — so the owner has a real choice, not two versions of the same sentence.\n\n" +
    "Output format (follow precisely, nothing else):\n" +
    "===MESSAGE 1===\n" +
    "<the full first broadcast>\n" +
    "===MESSAGE 2===\n" +
    "<the full second broadcast>\n" +
    "Do not add any commentary, notes, labels, or explanation before, between, or after the two messages beyond the two === markers.";

  function buildUserPrompt() {
    var business = els.business.value.trim();
    var audience = els.audience.value.trim();
    var about    = els.about.value.trim();
    var cta      = els.cta.value.trim();
    var useEmoji = els.emoji.checked;

    var lines = [];
    lines.push('Business name: ' + business);
    lines.push('Audience (who receives this broadcast): ' + (audience || 'existing customers'));
    lines.push('What the broadcast is about: ' + about);
    lines.push('Call-to-action to include: ' + (cta ? cta : 'none provided — use a natural soft CTA'));
    lines.push('Emoji: ' + (useEmoji
      ? 'YES — use a few tasteful, relevant emoji (do not overdo it; 2–4 across the message).'
      : 'NO — do not use any emoji at all.'));
    lines.push('');
    lines.push('Write the two WhatsApp broadcast messages now, in the exact output format.');
    return lines.join('\n');
  }

  /* ── parse the model output into the two messages ── */
  function splitMessages(text) {
    var out = { one: '', two: '' };
    if (!text) return out;
    var m1 = text.indexOf('===MESSAGE 1===');
    var m2 = text.indexOf('===MESSAGE 2===');
    if (m1 !== -1 && m2 !== -1 && m2 > m1) {
      out.one = text.slice(m1 + 15, m2).trim();
      out.two = text.slice(m2 + 15).trim();
    } else if (m1 !== -1) {
      out.one = text.slice(m1 + 15).trim();
    } else {
      // Fallback: no markers yet (mid-stream) — show everything in box 1.
      out.one = text.trim();
    }
    // Strip stray trailing marker fragments while streaming.
    out.one = out.one.replace(/===MESSAGE\s*2?=*$/i, '').trim();
    out.two = out.two.replace(/===MESSAGE\s*\d*=*$/i, '').trim();
    return out;
  }

  function renderStream(fullSoFar) {
    var parts = splitMessages(fullSoFar);
    els.v1.textContent = parts.one;
    els.v2.textContent = parts.two;
    els.v1wrap.style.display = parts.one ? 'block' : 'none';
    els.v2wrap.style.display = parts.two ? 'block' : 'none';
  }

  /* ── generate ── */
  var lastPrompt = null;

  function setLoading(on) {
    if (on) {
      els.generate.disabled = true;
      els.generate.innerHTML = '<span class="ai-spinner"></span>Generating…';
      els.regen.disabled = true;
    } else {
      els.generate.disabled = !AIShared.hasKey();
      els.generate.innerHTML = 'Generate 2 broadcasts';
      els.regen.disabled = false;
    }
  }

  function validate() {
    if (!els.business.value.trim()) return 'Please enter your business name.';
    if (!els.about.value.trim()) return 'Please describe what the broadcast is about.';
    return null;
  }

  function run(temperature) {
    els.error.textContent = '';

    if (!AIShared.hasKey()) {
      els.error.textContent = 'Add your OpenRouter API key in AI settings first.';
      return;
    }
    var problem = validate();
    if (problem) { els.error.textContent = problem; return; }

    var userPrompt = buildUserPrompt();
    lastPrompt = userPrompt;

    // reset output
    els.v1.textContent = '';
    els.v2.textContent = '';
    els.outHead.style.display = 'flex';
    els.v1wrap.style.display = 'none';
    els.v2wrap.style.display = 'none';

    setLoading(true);

    AIShared.generate({
      system: SYSTEM_PROMPT,
      user: userPrompt,
      temperature: temperature,
      maxTokens: 900,
      onToken: function (chunk, full) { renderStream(full); }
    }).then(function (full) {
      renderStream(full);
      // Ensure both boxes reveal even if second was empty until the end.
      var parts = splitMessages(full);
      els.v1wrap.style.display = parts.one ? 'block' : 'none';
      els.v2wrap.style.display = parts.two ? 'block' : 'none';
      if (!parts.one && !parts.two) {
        els.error.textContent = 'The AI returned an empty response. Try Regenerate.';
      }
      setLoading(false);
    }).catch(function (err) {
      setLoading(false);
      els.error.textContent = (err && err.message) ? err.message : 'Something went wrong. Try again.';
      els.outHead.style.display = 'none';
    });
  }

  els.generate.addEventListener('click', function () { run(0.8); });
  els.regen.addEventListener('click', function () {
    if (!els.about.value.trim() && !lastPrompt) return;
    run(0.9);
  });

  /* ── copy buttons ── */
  function wireCopy(btn, sourceEl) {
    btn.addEventListener('click', function () {
      var text = sourceEl.textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        var original = btn.textContent;
        btn.textContent = 'Copied ✓';
        btn.classList.add('ai-copied');
        setTimeout(function () {
          btn.textContent = original;
          btn.classList.remove('ai-copied');
        }, 1500);
      }).catch(function () {
        var original = btn.textContent;
        btn.textContent = 'Copy failed';
        setTimeout(function () { btn.textContent = original; }, 1500);
      });
    });
  }
  wireCopy(els.copy1, els.v1);
  wireCopy(els.copy2, els.v2);

})();
