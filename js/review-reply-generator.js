(function () {
  'use strict';

  var BIZ_KEY = 'bw_tools_review_reply_business_v1';
  var DELIM = '|||';

  var els = {};
  ['f-review', 'f-rating', 'f-business', 'f-tone', 'tone-hint',
   'generate-btn', 'key-hint', 'ai-error', 'output-wrap',
   'regen-btn', 'out-1', 'out-2'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  var toneTouched = false;      // becomes true once the user picks a tone themselves
  var isGenerating = false;

  // ── enable / disable the Generate button based on whether a key is saved ──
  function updateGenerateEnabled() {
    var ready = window.AIShared.hasKey();
    els['generate-btn'].disabled = !ready || isGenerating;
    els['key-hint'].hidden = ready;
  }

  // ── tone auto-suggestion: 1–2 stars => apologetic, unless user overrode ──
  function autoSuggestTone() {
    if (toneTouched) return;
    var rating = parseInt(els['f-rating'].value, 10);
    if (rating <= 2) {
      els['f-tone'].value = 'Apologetic';
    } else if (rating === 3) {
      els['f-tone'].value = 'Professional';
    } else {
      els['f-tone'].value = 'Warm';
    }
  }

  // ── prompt construction — the actual product ──
  function buildSystemPrompt() {
    return [
      'You are an expert Indian small-business copywriter who writes owner-voice replies to Google reviews for local businesses (dentists, retailers, salons, manufacturers, consultants, restaurants, clinics and the like across India).',
      '',
      'You write the way a warm, switched-on owner in India actually talks: natural Indian English, courteous but never stiff or corporate, first person ("we"/"our team"). You sound like a real person who was genuinely there, not a call-centre script.',
      '',
      'Hard rules for every reply:',
      '- Keep it short — 2 to 4 sentences, the length a busy owner would really type. Never write an essay.',
      '- Reference something SPECIFIC the reviewer actually said (a name, a service, a detail). Never generic filler that could be pasted under any review.',
      '- No emojis. No hashtags. No marketing slogans. No "Dear Customer". No exclamation-mark spam (one is plenty).',
      '- Do not invent facts, discounts, or promises the business did not state. Do not quote a fake staff name unless the reviewer named them.',
      '- Sign off naturally in the owner\'s voice — you may end with "— Team [Business]" or the owner\'s warm thanks, but keep it light.',
      '',
      'For POSITIVE reviews (4–5 stars): thank them genuinely, echo the specific thing they praised, and warmly invite them back. Do not oversell.',
      'For NEGATIVE reviews (1–2 stars): open by acknowledging their experience without being defensive, apologise sincerely, take ownership, offer to make it right, and move it offline — invite them to contact the business directly (a call/WhatsApp/message to the team) so it can be sorted. Never argue, never make excuses, never blame the customer.',
      'For MIXED reviews (3 stars): thank them for the honest feedback, acknowledge both the good and the gap they mentioned, and show you are acting on it.',
      '',
      'Match the requested tone. If the tone is "Apologetic", lead with the apology and the fix. If "Warm", be friendly and personal. If "Professional", be polished and measured — still human.',
      '',
      'OUTPUT FORMAT — follow exactly:',
      'Write TWO distinct reply options that a real owner could post as-is. They must differ meaningfully in wording and angle, not just swap a word.',
      'Output ONLY the two replies. Put a line containing exactly ' + DELIM + ' (three pipe characters) on its own line between them.',
      'No "Option 1" labels, no preamble, no explanation, no surrounding quotation marks. Just: reply one, then the ' + DELIM + ' line, then reply two.'
    ].join('\n');
  }

  function ratingWord(r) {
    return ({ 1: '1 out of 5 (very unhappy)', 2: '2 out of 5 (unhappy)',
      3: '3 out of 5 (mixed)', 4: '4 out of 5 (happy)', 5: '5 out of 5 (delighted)' })[r] || (r + ' out of 5');
  }

  function buildUserPrompt() {
    var review = els['f-review'].value.trim();
    var rating = parseInt(els['f-rating'].value, 10);
    var business = els['f-business'].value.trim() || 'our business';
    var toneMap = { Warm: 'Warm & friendly', Professional: 'Professional', Apologetic: 'Apologetic & fixing' };
    var tone = toneMap[els['f-tone'].value] || 'Warm & friendly';

    return [
      'Business name: ' + business,
      'Star rating given: ' + ratingWord(rating),
      'Requested tone: ' + tone,
      '',
      'The customer wrote this review:',
      '"""',
      review,
      '"""',
      '',
      'Write the two reply options now, in the exact output format specified.'
    ].join('\n');
  }

  // ── render streamed text: split on the delimiter into the two options ──
  function stripLabel(s) {
    // Defensive: remove a stray "Option N" / leading quote the model may add.
    return s.replace(/^\s*(option\s*\d+\s*[:.)-]?\s*)/i, '')
            .replace(/^["'“”]+|["'“”]+$/g, '')
            .trim();
  }

  function renderStream(full) {
    var parts = full.split(DELIM);
    els['out-1'].textContent = stripLabel(parts[0] || '');
    els['out-2'].textContent = parts.length > 1 ? stripLabel(parts.slice(1).join(DELIM)) : '';
  }

  // ── button loading state ──
  function setLoading(on) {
    isGenerating = on;
    var btn = els['generate-btn'];
    if (on) {
      btn.disabled = true;
      btn.innerHTML = '<span class="ai-spinner"></span>Generating…';
      els['regen-btn'].disabled = true;
    } else {
      btn.innerHTML = 'Generate 2 replies';
      els['regen-btn'].disabled = false;
      updateGenerateEnabled();
    }
  }

  function generate(temperature) {
    var review = els['f-review'].value.trim();
    if (!review) {
      els['ai-error'].textContent = 'Paste the customer\'s review first, then generate.';
      els['f-review'].focus();
      return;
    }
    if (!window.AIShared.hasKey()) {
      els['ai-error'].textContent = 'Add your OpenRouter API key in AI settings above first.';
      return;
    }

    els['ai-error'].textContent = '';
    els['output-wrap'].hidden = false;
    els['out-1'].textContent = '';
    els['out-2'].textContent = '';
    setLoading(true);

    window.AIShared.generate({
      system: buildSystemPrompt(),
      user: buildUserPrompt(),
      temperature: temperature,
      maxTokens: 700,
      onToken: function (chunk, full) { renderStream(full); }
    }).then(function (full) {
      renderStream(full);
      if (!els['out-2'].textContent) {
        // Model didn't use the delimiter — keep option 1, note it.
        els['out-2'].textContent = '(Only one reply came back — hit Regenerate for a second option.)';
      }
      setLoading(false);
    }).catch(function (err) {
      els['ai-error'].textContent = (err && err.message) ? err.message : 'Something went wrong. Try again.';
      if (!els['out-1'].textContent) els['output-wrap'].hidden = true;
      setLoading(false);
    });
  }

  // ── copy buttons ──
  function wireCopy(btn) {
    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-copy'));
      var text = target ? target.textContent.trim() : '';
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
        btn.textContent = 'Press Ctrl+C';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
      });
    });
  }

  // ── wire up ──
  els['generate-btn'].addEventListener('click', function () { generate(0.8); });
  els['regen-btn'].addEventListener('click', function () { generate(0.9); });

  els['f-rating'].addEventListener('change', autoSuggestTone);
  els['f-tone'].addEventListener('change', function () { toneTouched = true; });

  els['f-business'].addEventListener('input', function () {
    try { localStorage.setItem(BIZ_KEY, els['f-business'].value); } catch (e) {}
  });

  Array.prototype.forEach.call(document.querySelectorAll('.ai-copy-btn'), wireCopy);

  // ── init ──
  window.AIShared.mountSettings(document.getElementById('ai-settings-mount'), updateGenerateEnabled);
  updateGenerateEnabled();

  try {
    var savedBiz = localStorage.getItem(BIZ_KEY);
    if (savedBiz) els['f-business'].value = savedBiz;
  } catch (e) {}

  autoSuggestTone();
})();
