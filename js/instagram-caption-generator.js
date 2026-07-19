/* Instagram Caption Generator, BYOK AI tool.
   Generates three distinct Instagram captions (hook → body → CTA → optional
   hashtags) tuned for small Indian businesses. All AI goes through AIShared;
   no key or API call is ever handled here directly. */
(function () {
  'use strict';

  var DELIM = '===CAPTION===';

  var els = {
    topic: document.getElementById('f-topic'),
    business: document.getElementById('f-business'),
    vibe: document.getElementById('f-vibe'),
    hashtags: document.getElementById('f-hashtags'),
    emoji: document.getElementById('f-emoji'),
    genBtn: document.getElementById('generate-btn'),
    hint: document.getElementById('ai-hint'),
    error: document.getElementById('ai-error'),
    head: document.getElementById('ai-output-head'),
    copyAll: document.getElementById('copy-all-btn'),
    regen: document.getElementById('regen-btn'),
    live: document.getElementById('ai-live'),
    variations: document.getElementById('ai-variations')
  };

  var GEN_LABEL = '✨ Generate 3 captions';

  // ── AI settings bar + enable/disable wiring ──────────────────────────────
  AIShared.mountSettings(document.getElementById('ai-settings-mount'), updateGenerateEnabled);

  function updateGenerateEnabled() {
    var ready = AIShared.hasKey();
    els.genBtn.disabled = !ready;
    els.hint.hidden = ready;
  }
  updateGenerateEnabled();

  // ── Prompt construction ──────────────────────────────────────────────────
  function buildSystemPrompt() {
    return [
      "You are an expert Instagram copywriter for Indian small businesses, the kind of local dentists, boutiques, cafes, manufacturers, jewellers and consultants you find in a Mumbai BNI chapter.",
      "You write in warm, natural Indian English. You understand Indian festivals (Diwali, Holi, Ganesh Chaturthi, Raksha Bandhan, Eid, Christmas, Navratri), the monsoon, the wedding and exam seasons, and how Indian customers actually talk and buy.",
      "You write captions that make a busy shop owner look professional and get people to DM, call or visit. You never sound like a generic global brand, never use corporate jargon, and never over-promise.",
      "",
      "Every caption you write follows this shape:",
      "1. A strong scroll-stopping HOOK as the first line (a question, a bold statement, or a relatable moment, never 'We are happy to announce').",
      "2. ONE to THREE short body lines that give the value or story. Keep sentences tight and skimmable. Use line breaks, not long paragraphs.",
      "3. A clear call-to-action last line (e.g. 'DM us to book', 'Call now, link in bio', 'Visit us this weekend', 'WhatsApp us on the number in bio'). WhatsApp / DM / call / visit are the natural CTAs for Indian small businesses.",
      "",
      "Rules:",
      "- Prices in rupees (₹) only, and only if the user gave a price. Never invent prices, offers, discounts, phone numbers or facts the user did not provide.",
      "- Keep each caption Instagram-appropriate in length, roughly 3 to 6 short lines of copy, easy to read on a phone. Do not write essays.",
      "- Match the requested vibe exactly.",
      "- Write three GENUINELY DIFFERENT captions, different hooks and different angles, not three rewordings of the same sentence.",
      "- No hashtags inside the body copy. If hashtags are requested they go only in the dedicated hashtag block."
    ].join('\n');
  }

  function buildUserPrompt() {
    var topic = els.topic.value.trim();
    var business = els.business.value.trim();
    var vibe = els.vibe.value;
    var wantTags = els.hashtags.checked;
    var wantEmoji = els.emoji.checked;

    var lines = [];
    lines.push('Write 3 Instagram captions for this post.');
    lines.push('');
    lines.push('POST IS ABOUT: ' + topic);
    if (business) lines.push('THE BUSINESS: ' + business);
    lines.push('VIBE: ' + vibe);
    lines.push('EMOJI: ' + (wantEmoji
      ? 'Yes, use a few tasteful, relevant emoji (not on every line, no emoji spam).'
      : 'No, do NOT use any emoji at all.'));
    if (wantTags) {
      lines.push('HASHTAGS: Yes, after the caption copy, add a block of 8 to 15 relevant hashtags on their own line. Mix broad and India/city/niche-specific tags that this business would actually rank for locally. All lowercase, space-separated, no commas.');
    } else {
      lines.push('HASHTAGS: No, do not add any hashtags.');
    }
    lines.push('');
    lines.push('FORMAT: Output exactly three captions. Separate each caption with a line containing only ' + DELIM + ' and nothing else. Do not number them, do not add headings, labels, titles or any commentary before, between or after the captions, output only the caption text and the separators.');
    return lines.join('\n');
  }

  // ── Parse the streamed text into up to three captions ────────────────────
  function parseCaptions(text) {
    return String(text || '')
      .split(DELIM)
      .map(function (c) {
        // strip stray numbering / labels a model might still add
        return c.replace(/^\s*(caption\s*\d+\s*[:.\-]?|option\s*\d+\s*[:.\-]?|\d+\s*[).\-])\s*/i, '').trim();
      })
      .filter(function (c) { return c.length; });
  }

  // ── Render final variation cards, each with its own copy button ──────────
  function renderVariations(captions) {
    els.variations.innerHTML = '';
    captions.forEach(function (text, i) {
      var card = document.createElement('div');
      card.className = 'ai-output ai-variation';

      var bar = document.createElement('div');
      bar.className = 'ai-output-head';
      bar.style.marginTop = '0';
      bar.style.marginBottom = '10px';

      var h = document.createElement('h3');
      h.textContent = 'Caption ' + (i + 1);

      var actions = document.createElement('div');
      actions.className = 'ai-output-actions';
      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'ai-copy-btn';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', function () { copyText(copyBtn, text); });
      actions.appendChild(copyBtn);

      bar.appendChild(h);
      bar.appendChild(actions);

      var bodyEl = document.createElement('div');
      bodyEl.textContent = text;

      card.appendChild(bar);
      card.appendChild(bodyEl);
      els.variations.appendChild(card);
    });
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
      btn.textContent = 'Press Ctrl+C';
      setTimeout(function () { btn.textContent = prev; }, 1500);
    });
  }

  // ── Generate flow ────────────────────────────────────────────────────────
  var lastCaptions = [];

  function setLoading(on) {
    if (on) {
      els.genBtn.disabled = true;
      els.genBtn.innerHTML = '<span class="ai-spinner"></span>Generating…';
    } else {
      els.genBtn.innerHTML = GEN_LABEL;
      updateGenerateEnabled();
    }
  }

  function generate(temperature) {
    var topic = els.topic.value.trim();
    if (!topic) {
      els.error.textContent = 'Tell us what the post is about first.';
      els.topic.focus();
      return;
    }
    if (!AIShared.hasKey()) {
      els.error.textContent = 'Add your OpenRouter API key above to enable AI.';
      return;
    }

    els.error.textContent = '';
    els.variations.innerHTML = '';
    els.head.hidden = true;
    els.live.hidden = false;
    els.live.textContent = '';
    setLoading(true);

    AIShared.generate({
      system: buildSystemPrompt(),
      user: buildUserPrompt(),
      temperature: temperature,
      maxTokens: 1100,
      onToken: function (chunk, full) {
        // live preview with the separators softened for readability
        els.live.textContent = full.split(DELIM).join('\n\n· · ·\n\n');
      }
    }).then(function (full) {
      var captions = parseCaptions(full);
      setLoading(false);
      els.live.hidden = true;
      if (!captions.length) {
        els.error.textContent = 'The AI returned nothing usable. Try Regenerate or tweak your inputs.';
        return;
      }
      lastCaptions = captions;
      renderVariations(captions);
      els.head.hidden = false;
    }).catch(function (err) {
      setLoading(false);
      els.live.hidden = true;
      els.error.textContent = (err && err.message) ? err.message : 'Something went wrong. Try again.';
    });
  }

  els.genBtn.addEventListener('click', function () { generate(0.8); });
  els.regen.addEventListener('click', function () { generate(0.9); });
  els.copyAll.addEventListener('click', function () {
    if (!lastCaptions.length) return;
    var joined = lastCaptions.map(function (c, i) {
      return 'Caption ' + (i + 1) + '\n' + c;
    }).join('\n\n---\n\n');
    copyText(els.copyAll, joined);
  });

})();
