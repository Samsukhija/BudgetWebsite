/* Cold Message Writer, BYOK AI tool.
   Generates THREE distinct short cold messages tuned to the chosen channel,
   goal and tone, each in its own copyable card. All AI goes through
   window.AIShared (the visitor's own OpenRouter key). */
(function () {
  'use strict';

  var SEP = '===MESSAGE===';

  var els = {
    offer:   document.getElementById('f-offer'),
    target:  document.getElementById('f-target'),
    goal:    document.getElementById('f-goal'),
    channel: document.getElementById('f-channel'),
    tone:    document.getElementById('f-tone'),
    genBtn:  document.getElementById('generate-btn'),
    hint:    document.getElementById('ai-hint'),
    error:   document.getElementById('ai-error'),
    head:    document.getElementById('output-head'),
    list:    document.getElementById('output-list'),
    copyAll: document.getElementById('copy-all-btn'),
    regen:   document.getElementById('regen-btn')
  };

  var esc = (window.AIShared && window.AIShared.esc) ? window.AIShared.esc : function (s) {
    var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML;
  };

  /* ── settings bar + enable/disable ── */
  function updateGenerateEnabled() {
    var ready = window.AIShared.hasKey();
    els.genBtn.disabled = !ready;
    els.hint.style.display = ready ? 'none' : 'block';
  }

  window.AIShared.mountSettings(document.getElementById('ai-settings-mount'), updateGenerateEnabled);
  updateGenerateEnabled();

  /* ── prompt building ── */
  var SYSTEM_PROMPT =
    "You are an expert Indian small-business copywriter who writes cold outreach messages " +
    "for members of a BNI networking chapter in Mumbai, dentists, retailers, manufacturers, " +
    "consultants, chartered accountants, salon owners, and similar local business owners.\n\n" +
    "Your job: write short, genuinely personal cold messages that get a reply. You write the way " +
    "a real, well-mannered Indian business owner texts, natural Indian English, warm but not " +
    "servile, confident but never salesy.\n\n" +
    "Hard rules:\n" +
    "- Sound like a specific human wrote it to a specific person. Reference concrete details from " +
    "the sender's business and the recipient. Never generic filler.\n" +
    "- Keep it SHORT. Respect the reader's time. Lead with relevance, not with 'I hope this message finds you well'.\n" +
    "- Exactly ONE clear call-to-action per message.\n" +
    "- No hype, no buzzwords, no fake urgency, no 'game-changer / revolutionary / synergy', no exclamation-mark spam.\n" +
    "- No emojis unless the tone is Casual and the channel is WhatsApp, and then at most one, only if it genuinely fits.\n" +
    "- Use Indian context: rupees as ₹ (never '$'), Indian names/places/festivals only if relevant, WhatsApp-first etiquette.\n" +
    "- Do NOT invent facts, prices, discounts, offers or credentials that the sender did not provide.\n" +
    "- Never use en dashes or em dashes; use commas or full stops.\n\n" +
    "Channel formatting:\n" +
    "- WhatsApp: 2 to 4 short lines, no subject line, no formal sign-off (a first name at most). Feels like a text.\n" +
    "- Email: START with a line 'Subject: <6 to 8 word specific subject>' then a blank line, then a tight 3 to 5 line body with a brief sign-off (name / firm).\n" +
    "- LinkedIn: concise and professional, 2 to 4 lines, no subject line, no emojis, respect the connection-note brevity.\n\n" +
    "Output format (follow EXACTLY):\n" +
    "Return THREE distinctly different messages. Vary the angle, opening line and phrasing across the three " +
    "so the sender has real choices, not three rewrites of one message. Separate the three messages with a line " +
    "containing only '" + SEP + "' and nothing else. Output ONLY the three messages and the separators. " +
    "No numbering, no headings, no commentary, no preamble, no notes before or after.";

  function buildUserPrompt() {
    var goalHints = {
      'Book a call': 'The single CTA should propose a specific, low-friction next step to talk (a short call or a quick meeting), suggesting they pick a time.',
      'Introduce a product': 'Introduce one specific offering and why it is relevant to THIS recipient; CTA invites a yes/no interest or a quick look.',
      'Follow up after meeting': 'Reference that you already met/spoke, jog their memory with a concrete detail, and move one specific thing forward.',
      'Ask for referral': 'Politely ask if they know one specific type of person who could use your service; make it easy and low-pressure to say no.',
      'Re-engage old client': 'Warmly reconnect with a past client, acknowledge the gap without guilt-tripping, and give one concrete reason to talk again now.'
    };
    return [
      'Write the three cold messages now.',
      '',
      'SENDER / what they offer:',
      (els.offer.value.trim() || '(not specified)'),
      '',
      'RECIPIENT / who is being messaged:',
      (els.target.value.trim() || '(not specified)'),
      '',
      'GOAL: ' + els.goal.value + '-' + (goalHints[els.goal.value] || ''),
      'CHANNEL: ' + els.channel.value + ' (format strictly for this channel).',
      'TONE: ' + els.tone.value + '.'
    ].join('\n');
  }

  /* ── rendering ── */
  function renderStreaming(fullText) {
    // During streaming show the raw text split on whatever separators exist so far.
    var parts = fullText.split(SEP);
    els.list.innerHTML = parts.map(function (p) {
      return '<div class="ai-output ai-variation">' + esc(p.trim()) + '</div>';
    }).join('');
  }

  function renderFinal(fullText) {
    var parts = fullText.split(SEP).map(function (p) { return p.trim(); }).filter(function (p) { return p.length; });
    if (!parts.length) parts = [fullText.trim()];

    els.list.innerHTML = '';
    parts.forEach(function (msg, i) {
      var wrap = document.createElement('div');
      wrap.className = 'ai-output ai-variation';

      var head = document.createElement('div');
      head.className = 'ai-output-head';
      head.style.marginTop = '0';
      head.innerHTML = '<h3>Option ' + (i + 1) + '</h3>' +
        '<div class="ai-output-actions"><button type="button" class="ai-copy-btn">Copy</button></div>';

      var bodyText = document.createElement('div');
      bodyText.style.whiteSpace = 'pre-wrap';
      bodyText.style.marginTop = '10px';
      bodyText.textContent = msg;

      var copyBtn = head.querySelector('.ai-copy-btn');
      copyBtn.addEventListener('click', function () { copyText(copyBtn, msg); });

      wrap.appendChild(head);
      wrap.appendChild(bodyText);
      els.list.appendChild(wrap);
    });

    els.head.style.display = 'flex';
  }

  function copyText(btn, text) {
    navigator.clipboard.writeText(text).then(function () {
      var prev = btn.textContent;
      btn.textContent = 'Copied ✓';
      btn.classList.add('ai-copied');
      setTimeout(function () {
        btn.textContent = prev;
        btn.classList.remove('ai-copied');
      }, 1500);
    }).catch(function () {
      var prev = btn.textContent;
      btn.textContent = 'Copy failed';
      setTimeout(function () { btn.textContent = prev; }, 1500);
    });
  }

  /* ── generate flow ── */
  var lastFull = '';

  function setLoading(on) {
    if (on) {
      els.genBtn.disabled = true;
      els.genBtn.dataset.label = els.genBtn.textContent;
      els.genBtn.innerHTML = '<span class="ai-spinner"></span>Generating…';
    } else {
      els.genBtn.innerHTML = els.genBtn.dataset.label || 'Write my 3 messages';
      updateGenerateEnabled();
    }
  }

  function generate(temperature) {
    if (!window.AIShared.hasKey()) { updateGenerateEnabled(); return; }
    if (!els.offer.value.trim()) {
      els.error.textContent = 'Tell us what your business offers first.';
      els.offer.focus();
      return;
    }
    if (!els.target.value.trim()) {
      els.error.textContent = 'Add who you are messaging so the note can be personal.';
      els.target.focus();
      return;
    }

    els.error.textContent = '';
    els.head.style.display = 'none';
    els.list.innerHTML = '<div class="ai-output ai-variation" style="color:var(--text-dim);">Writing…</div>';
    setLoading(true);

    window.AIShared.generate({
      system: SYSTEM_PROMPT,
      user: buildUserPrompt(),
      temperature: temperature,
      maxTokens: 1100,
      onToken: function (chunk, full) {
        lastFull = full;
        renderStreaming(full);
      }
    }).then(function (full) {
      lastFull = full || lastFull;
      renderFinal(lastFull);
      setLoading(false);
    }).catch(function (err) {
      els.list.innerHTML = '';
      els.error.textContent = (err && err.message) ? err.message : 'Something went wrong. Try again.';
      setLoading(false);
    });
  }

  els.genBtn.addEventListener('click', function () { generate(0.8); });
  els.regen.addEventListener('click', function () { generate(0.9); });

  els.copyAll.addEventListener('click', function () {
    var parts = lastFull.split(SEP).map(function (p) { return p.trim(); }).filter(function (p) { return p.length; });
    var joined = parts.map(function (p, i) { return 'Option ' + (i + 1) + ':\n' + p; }).join('\n\n---\n\n');
    copyText(els.copyAll, joined || lastFull.trim());
  });

})();
