/* ─────────────────────────────────────────────
   Google My Business Post Writer
   BYOK AI tool, generates two Google Business
   Profile post options for Indian small businesses.
───────────────────────────────────────────── */
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  var generateBtn = $('generate-btn');
  var regenBtn = $('regen-btn');
  var errBox = $('ai-error');
  var hint = $('ai-hint');
  var outputHead = $('output-head');
  var var1Wrap = $('var-1-wrap');
  var var2Wrap = $('var-2-wrap');
  var out1 = $('out-1');
  var out2 = $('out-2');

  var DELIM = '===';

  // ── AI key settings bar ──
  AIShared.mountSettings($('ai-settings-mount'), updateGenerateEnabled);

  function updateGenerateEnabled() {
    var ok = AIShared.hasKey();
    generateBtn.disabled = !ok;
    hint.style.display = ok ? 'none' : 'block';
  }
  updateGenerateEnabled();

  // ── prompt building ──
  function buildSystem() {
    return [
      "You are an expert Indian small-business copywriter who writes Google Business Profile (Google My Business) posts that get local customers to call, book and walk in.",
      "You write for small businesses across India, dentists, retailers, salons, manufacturers, tuition classes, restaurants, consultants and the like. Your reader is a busy owner who will paste your post straight into Google.",
      "",
      "How a great GBP post works:",
      "- Google shows only the first ~100 characters before a 'Read more' cut, so the FIRST line must be a self-contained hook that makes someone stop scrolling. Put the offer, benefit or news up front, never a slow build-up.",
      "- Keep the whole post tight: roughly 40-80 words. GBP allows ~1500 characters but short posts win. No fluff, no corporate padding.",
      "- Write in warm, natural Indian English the way a shop owner speaks to a regular customer. Prices in rupees using the ₹ symbol. Reference Indian festivals, seasons and local context when relevant.",
      "- Weave the TYPE of business and, if natural, the city/locality into the copy so it helps local search (local SEO), e.g. 'your neighbourhood dental clinic', 'Andheri's favourite'. Do this naturally, never keyword-stuff.",
      "- End with one short line that clearly implies the chosen call-to-action button (e.g. for 'Call now' -> 'Call us today to book your slot.'). Do NOT invent phone numbers, links, addresses or fake discounts, only use details the owner gave you.",
      "- Match the post type: What's New = news/update, Offer = a clear deal with the terms, Event = what/when/why-come, Product highlight = one product and why it's worth buying.",
      "- Do NOT use hashtags. Do NOT use markdown, asterisks or headings. Plain text only, ready to paste.",
      "",
      "Return EXACTLY TWO post options with two distinct angles. Output ONLY the two posts separated by a line containing only three equals signs (===). No numbering, no labels, no preamble, no commentary, just: post one, then a line with ===, then post two."
    ].join('\n');
  }

  function buildUser(f) {
    var lines = [];
    lines.push('Business name: ' + f.biz);
    lines.push('Business/post type: ' + f.type);
    lines.push('What the post is about: ' + f.about);
    lines.push('Call-to-action button chosen: ' + f.cta);
    lines.push('Use emoji: ' + (f.emoji
      ? 'Yes, use 1-3 tasteful, relevant emoji, not more.'
      : 'No, do not use any emoji at all.'));
    lines.push('');
    lines.push('Write the two Google Business Profile posts now, following all the rules.');
    return lines.join('\n');
  }

  // ── state ──
  var lastInputs = null;

  function readInputs() {
    return {
      biz: $('f-biz').value.trim(),
      type: $('f-type').value,
      about: $('f-about').value.trim(),
      cta: $('f-cta').value,
      emoji: $('f-emoji').checked
    };
  }

  function showError(msg) {
    errBox.textContent = msg;
  }
  function clearError() {
    errBox.textContent = '';
  }

  function setLoading(on) {
    if (on) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = '<span class="ai-spinner"></span>Generating…';
      regenBtn.disabled = true;
    } else {
      generateBtn.disabled = !AIShared.hasKey();
      generateBtn.textContent = 'Generate 2 posts';
      regenBtn.disabled = false;
    }
  }

  // split streamed text on the === delimiter into [post1, post2]
  function splitPosts(text) {
    var idx = text.indexOf(DELIM);
    if (idx === -1) {
      return [text.trim(), ''];
    }
    var first = text.slice(0, idx);
    var second = text.slice(idx + DELIM.length);
    // guard against a stray === appearing later
    var extra = second.indexOf(DELIM);
    if (extra !== -1) second = second.slice(0, extra);
    return [first.trim(), second.trim()];
  }

  function renderStream(fullSoFar) {
    var parts = splitPosts(fullSoFar);
    out1.textContent = parts[0];
    out2.textContent = parts[1];
  }

  function run(temp) {
    var f = lastInputs;
    if (!AIShared.hasKey()) {
      showError('Add your AI key above first.');
      return;
    }
    if (!f.biz) { showError('Please enter your business name.'); return; }
    if (!f.about) { showError('Tell us what the post is about.'); return; }

    clearError();
    setLoading(true);

    // reveal output shells, clear old text
    outputHead.style.display = 'flex';
    var1Wrap.style.display = 'block';
    var2Wrap.style.display = 'block';
    out1.textContent = '';
    out2.textContent = '';

    AIShared.generate({
      system: buildSystem(),
      user: buildUser(f),
      temperature: temp,
      maxTokens: 700,
      onToken: function (chunk, fullSoFar) {
        renderStream(fullSoFar);
      }
    }).then(function (full) {
      renderStream(full);
      setLoading(false);
    }).catch(function (e) {
      setLoading(false);
      showError((e && e.message) ? e.message : 'Something went wrong. Please try again.');
    });
  }

  // ── events ──
  generateBtn.addEventListener('click', function () {
    lastInputs = readInputs();
    run(0.8);
  });

  regenBtn.addEventListener('click', function () {
    if (!lastInputs) lastInputs = readInputs();
    run(0.9);
  });

  // copy buttons
  Array.prototype.forEach.call(document.querySelectorAll('.ai-copy-btn'), function (btn) {
    btn.addEventListener('click', function () {
      var target = $(btn.getAttribute('data-copy'));
      var text = target ? target.textContent : '';
      if (!text) return;
      navigator.clipboard.writeText(text).then(function () {
        var orig = btn.textContent;
        btn.textContent = 'Copied ✓';
        btn.classList.add('ai-copied');
        setTimeout(function () {
          btn.textContent = orig;
          btn.classList.remove('ai-copied');
        }, 1500);
      }).catch(function () {
        showError('Could not copy to clipboard.');
      });
    });
  });

})();
