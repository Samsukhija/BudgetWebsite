/* Festival Offer Message Generator, BYOK AI tool.
   Generates three festive promo messages (greeting + offer + urgency + CTA)
   formatted for the chosen channel. All AI runs through window.AIShared. */
(function () {
  'use strict';

  var esc = AIShared.esc;

  // ── elements ──
  var settingsMount = document.getElementById('ai-settings-mount');
  var festivalSel   = document.getElementById('f-festival');
  var otherWrap     = document.getElementById('f-festival-other-wrap');
  var otherInput    = document.getElementById('f-festival-other');
  var channelSel    = document.getElementById('f-channel');
  var businessInput = document.getElementById('f-business');
  var offerInput    = document.getElementById('f-offer');
  var emojiCheck    = document.getElementById('f-emoji');

  var genBtn      = document.getElementById('generate-btn');
  var hint        = document.getElementById('ai-hint');
  var errorBox    = document.getElementById('ai-error');
  var outputHead  = document.getElementById('ai-output-head');
  var outputWrap  = document.getElementById('ai-output-container');
  var copyAllBtn  = document.getElementById('copy-all-btn');
  var regenBtn    = document.getElementById('regen-btn');

  var GEN_LABEL = '✨ Generate 3 Messages';
  var lastMessages = [];   // parsed variations from the last successful run

  // ── mount the shared API-key settings bar ──
  AIShared.mountSettings(settingsMount, updateGenerateEnabled);

  function updateGenerateEnabled() {
    var ready = AIShared.hasKey();
    genBtn.disabled = !ready;
    hint.hidden = ready;
  }
  updateGenerateEnabled();

  // ── show the "Other festival" field only when needed ──
  festivalSel.addEventListener('change', function () {
    var isOther = festivalSel.value === 'Other';
    otherWrap.hidden = !isOther;
    if (isOther) otherInput.focus();
  });

  // ── prompt construction ────────────────────────────────────────────────
  function currentFestival() {
    if (festivalSel.value === 'Other') return (otherInput.value || '').trim();
    return festivalSel.value;
  }

  var CHANNEL_GUIDE = {
    'WhatsApp':
      'Format for WhatsApp. Warm and personal, like a message from the shop owner. ' +
      '2 to 5 short lines with line breaks between ideas. You may use *bold* (single asterisks) ' +
      'for the offer or key phrase, as WhatsApp renders it. Keep it forwardable. End with a clear ' +
      'call to action such as "Reply here to book" or "WhatsApp us to confirm".',
    'Instagram':
      'Format as an Instagram caption. Punchy and upbeat. A strong hook in the first line, ' +
      'the offer clearly stated, urgency, then a call to action like "DM to book" or "Link in bio". ' +
      'Finish each message with 3 to 5 relevant hashtags (mix the festival, the city/India, and the business type).',
    'SMS':
      'Format as a plain SMS. Very short, aim for roughly 160 to 300 characters, one or two lines. ' +
      'No hashtags, no *bold*, no line-break art. State the greeting, offer and a short call to action ' +
      '(e.g. "Call/WhatsApp <number or business> to book"). Do NOT use emoji in SMS even if emoji were ' +
      'requested, keep it lean so it fits and reads cleanly.'
  };

  function buildSystemPrompt(channel, useEmoji) {
    var emojiRule = useEmoji
      ? 'Emoji ARE wanted: use a few tasteful, festival-appropriate emoji (1 to 3 per message), never a wall of them. Do not put emoji in SMS output.'
      : 'Do NOT use any emoji at all. Keep the copy clean and text-only.';

    return [
      'You are an expert Indian small-business copywriter who writes festival promotional messages ',
      'that local shops, clinics, salons, restaurants and service businesses actually send to their ',
      'customers. You write in warm, natural Indian English (the everyday register a Mumbai or ',
      'small-town business owner would use with customers), friendly and respectful, never corporate ',
      'or robotic, never over-hyped. You understand Indian festivals and use the culturally correct ',
      'greeting for each one (for example: "Shubh Deepavali" / "Happy Diwali" for Diwali, ',
      '"Eid Mubarak" for Eid, "Happy Holi" for Holi, "Ganpati Bappa Morya" for Ganesh Chaturthi, ',
      '"Happy Navratri" for Navratri, "Happy Onam" for Onam, "Happy Makar Sankranti" / "Happy Pongal", ',
      '"Happy Raksha Bandhan", "Merry Christmas", "Happy New Year", and patriotic wishes for ',
      'Independence Day / Republic Day). Match the mood of the festival, devotional and warm for ',
      'religious festivals, celebratory for New Year, proud and tasteful for national days. ',
      'All prices are in Indian Rupees (use the ₹ symbol). Never invent an offer, price, date or ',
      'discount that the owner did not give you, use exactly what they provide. If they gave no ',
      'validity date, imply gentle urgency ("this festive season", "limited period", "while stocks last") ',
      'without fabricating a specific date. Keep every message concrete and self-contained. ',
      '\n\n',
      emojiRule,
      '\n\n',
      CHANNEL_GUIDE[channel],
      '\n\n',
      'Each of the three messages MUST contain, woven together naturally (not as labelled bullet points): ',
      '(1) a warm festival greeting, (2) the business name, (3) the offer stated clearly, ',
      '(4) a sense of urgency / limited validity, and (5) a clear call to action. ',
      'Make the three genuinely different from each other in angle and wording, e.g. one warm and ',
      'relationship-led, one offer-and-savings-led, one short and urgent, not three rewordings of the same lines. ',
      '\n\n',
      'OUTPUT FORMAT (strict): return ONLY the three messages, nothing else, no preamble, no titles, ',
      'no "Message 1", no commentary. Separate the three messages from each other with a line ',
      'containing exactly three hash characters (###) on its own line and nothing else.'
    ].join('');
  }

  function buildUserPrompt(festival, business, offer, channel, useEmoji) {
    return [
      'Festival / occasion: ' + festival,
      'Business name: ' + business,
      'Offer details (use exactly, do not change the numbers): ' + offer,
      'Sending channel: ' + channel,
      'Emoji: ' + (useEmoji ? 'yes (respect the SMS exception)' : 'no'),
      '',
      'Write the three festive promotional messages now.'
    ].join('\n');
  }

  // ── parse the model output into three messages ─────────────────────────
  function parseVariations(text) {
    if (!text) return [];
    var parts;

    // Primary: split on a line that is only ### (allow surrounding spaces)
    parts = text.split(/\n\s*#{2,}\s*\n/);

    // Fallbacks if the model ignored the delimiter
    if (parts.length < 2) parts = text.split(/\n\s*-{3,}\s*\n/);
    if (parts.length < 2) parts = text.split(/\n\s*={3,}\s*\n/);
    if (parts.length < 2) parts = text.split(/\n\s*\n\s*\n+/); // blank-line blocks

    parts = parts.map(cleanPart).filter(function (p) { return p.length > 0; });
    return parts;
  }

  function cleanPart(p) {
    return (p || '')
      .replace(/^\s*#{2,}\s*$/gm, '')                    // stray delimiter lines
      .replace(/^\s*(message|option|variation|version)\s*#?\s*\d+\s*[:.)-]?\s*/i, '') // "Message 1:" label
      .replace(/^["'`\s]+|["'`\s]+$/g, '')               // wrapping quotes / whitespace
      .trim();
  }

  // ── rendering ──────────────────────────────────────────────────────────
  function renderStreaming(fullText) {
    outputWrap.innerHTML =
      '<div class="ai-output" id="ai-stream">' + esc(fullText) + '</div>';
  }

  function renderVariations(messages) {
    if (!messages.length) {
      outputWrap.innerHTML = '<div class="tool-empty">No messages came back. Try Regenerate.</div>';
      return;
    }
    var html = messages.map(function (msg, i) {
      return '' +
        '<div class="ai-variation">' +
          '<div class="ai-output-head" style="margin-top:0;">' +
            '<h3>Message ' + (i + 1) + '</h3>' +
            '<div class="ai-output-actions">' +
              '<button type="button" class="ai-copy-btn" data-copy-idx="' + i + '">Copy</button>' +
            '</div>' +
          '</div>' +
          '<div class="ai-output" id="ai-msg-' + i + '">' + esc(msg) + '</div>' +
        '</div>';
    }).join('');
    outputWrap.innerHTML = html;

    // wire per-message copy buttons
    var btns = outputWrap.querySelectorAll('[data-copy-idx]');
    Array.prototype.forEach.call(btns, function (btn) {
      btn.addEventListener('click', function () {
        var idx = parseInt(btn.getAttribute('data-copy-idx'), 10);
        copyText(messages[idx], btn, 'Copy');
      });
    });
  }

  // ── clipboard helper ───────────────────────────────────────────────────
  function copyText(text, btn, restoreLabel) {
    function done() {
      var original = restoreLabel;
      btn.textContent = 'Copied ✓';
      btn.classList.add('ai-copied');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('ai-copied');
      }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }
  function fallbackCopy(text, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      done();
    } catch (e) { /* clipboard unavailable, silently ignore */ }
  }

  // ── generate flow ──────────────────────────────────────────────────────
  function setLoading(on) {
    if (on) {
      genBtn.disabled = true;
      genBtn.innerHTML = '<span class="ai-spinner"></span>Generating…';
    } else {
      genBtn.innerHTML = GEN_LABEL;
      updateGenerateEnabled();
    }
  }

  function runGenerate(temperature) {
    errorBox.textContent = '';

    if (!AIShared.hasKey()) {
      errorBox.textContent = 'Add your OpenRouter API key in the bar above first.';
      return;
    }

    var festival = currentFestival();
    var business = (businessInput.value || '').trim();
    var offer    = (offerInput.value || '').trim();
    var channel  = channelSel.value;
    var useEmoji = emojiCheck.checked;

    if (!festival) {
      errorBox.textContent = 'Please tell us which festival or occasion this is for.';
      (festivalSel.value === 'Other' ? otherInput : festivalSel).focus();
      return;
    }
    if (!business) {
      errorBox.textContent = 'Please enter your business name.';
      businessInput.focus();
      return;
    }
    if (!offer) {
      errorBox.textContent = 'Please describe the offer (e.g. "20% off all services").';
      offerInput.focus();
      return;
    }

    lastMessages = [];
    outputHead.hidden = false;
    renderStreaming('');
    setLoading(true);

    AIShared.generate({
      system: buildSystemPrompt(channel, useEmoji),
      user: buildUserPrompt(festival, business, offer, channel, useEmoji),
      temperature: temperature,
      maxTokens: 1100,
      onToken: function (chunk, full) { renderStreaming(full); }
    }).then(function (full) {
      lastMessages = parseVariations(full);
      renderVariations(lastMessages);
      setLoading(false);
    }).catch(function (err) {
      setLoading(false);
      outputHead.hidden = true;
      outputWrap.innerHTML = '';
      errorBox.textContent = (err && err.message) ? err.message : 'Something went wrong. Try again.';
    });
  }

  // ── events ─────────────────────────────────────────────────────────────
  genBtn.addEventListener('click', function () { runGenerate(0.8); });
  regenBtn.addEventListener('click', function () { runGenerate(0.9); });

  copyAllBtn.addEventListener('click', function () {
    if (!lastMessages.length) return;
    var joined = lastMessages.join('\n\n---\n\n');
    copyText(joined, copyAllBtn, 'Copy all');
  });

})();
