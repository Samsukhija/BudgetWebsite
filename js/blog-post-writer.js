(function () {
  'use strict';

  var AI = window.AIShared;

  var els = {};
  ['f-topic', 'f-business', 'f-keyword', 'f-length', 'f-tone',
   'generate-btn', 'ai-hint', 'ai-error', 'ai-output', 'output-head',
   'copy-btn', 'regen-btn'
  ].forEach(function (id) { els[id] = document.getElementById(id); });

  // Length presets: word target + a generous token ceiling so the model
  // never gets cut off mid-post (roughly 1 word ~= 1.4 tokens, plus headroom).
  var LENGTH_META = {
    short:  { words: 400,  maxTokens: 900,  heads: '3' },
    medium: { words: 700,  maxTokens: 1500, heads: '3 to 4' },
    long:   { words: 1200, maxTokens: 2500, heads: '4 to 5' }
  };

  var lastGenerating = false;

  // ── enable/disable the generate button based on whether a key is saved ──
  function updateGenerateEnabled() {
    if (lastGenerating) return; // don't fight the loading state
    var ready = AI.hasKey();
    els['generate-btn'].disabled = !ready;
    els['ai-hint'].hidden = ready;
  }

  AI.mountSettings(document.getElementById('ai-settings-mount'), updateGenerateEnabled);
  updateGenerateEnabled();

  // ── prompt construction ──
  function buildSystemPrompt() {
    return [
      'You are a seasoned Indian small-business copywriter who ghost-writes blog posts for local businesses — dentists, retailers, manufacturers, electricians, consultants, salons, and the like, mostly in cities like Mumbai, Pune and Kolhapur.',
      '',
      'You write in clear, warm Indian English for an Indian audience. You understand the Indian context: rupee (₹) pricing, GST, monsoon and festival seasons (Diwali, Ganesh Chaturthi, Navratri, Eid), WhatsApp and Instagram as the main customer channels, and the trust-first, word-of-mouth way Indian customers decide who to buy from.',
      '',
      'How you write:',
      '- Open with a hook that names a real problem or moment the reader recognises — never "In today\'s fast-paced world" or any tired filler.',
      '- Keep sentences short and concrete. Prefer plain words over jargon. Use specific, believable examples over vague claims.',
      '- Be genuinely useful: give real tips, steps, numbers, and rules of thumb a reader could act on, not padding.',
      '- Sound like a knowledgeable local expert talking to a neighbour, not a marketing brochure. Never over-promise or make guarantees you cannot back up. Do not invent fake statistics, awards, or customer names.',
      '- Write for the business owner\'s own site, so it can be published as-is.',
      '',
      'Formatting rules (important — the output is copy-pasted straight into a blog editor):',
      '- First line: the post title only, with no "Title:" label and no quotation marks.',
      '- Then a short introductory paragraph (no heading).',
      '- Then the body as sections. Start each section heading on its own line, prefixed with "## " (markdown H2). Follow each heading with one or two solid paragraphs.',
      '- End with a short conclusion section and a clear, friendly call-to-action that invites the reader to WhatsApp, call, or visit the business.',
      '- Use plain readable text. No emojis. No hashtags. No markdown bold/italic markers, tables, or code blocks — only the "## " heading prefix.',
      '- Do not add any meta commentary, notes, or explanation before or after the post. Output only the blog post itself.'
    ].join('\n');
  }

  function buildUserPrompt(data) {
    var meta = LENGTH_META[data.length] || LENGTH_META.medium;
    var lines = [];
    lines.push('Write a complete blog post.');
    lines.push('');
    lines.push('Topic / working title: ' + data.topic);
    lines.push('Business / industry: ' + (data.business || 'a small local business'));
    if (data.keyword) {
      lines.push('Target SEO keyword: "' + data.keyword + '" — weave it naturally into the title, the intro, and a couple of headings/paragraphs. Never keyword-stuff; it must read smoothly.');
    } else {
      lines.push('No specific SEO keyword given — just write naturally around the topic.');
    }
    lines.push('Tone: ' + data.tone + '.');
    lines.push('Target length: about ' + meta.words + ' words, with ' + meta.heads + ' "## " subheadings between the intro and the conclusion.');
    lines.push('');
    lines.push('Remember: first line is the plain title, then intro, then the "## " sections, then a short conclusion with a call-to-action. No emojis, no meta commentary.');
    return lines.join('\n');
  }

  // ── generate ──
  function readInputs() {
    return {
      topic: els['f-topic'].value.trim(),
      business: els['f-business'].value.trim(),
      keyword: els['f-keyword'].value.trim(),
      length: els['f-length'].value,
      tone: els['f-tone'].value
    };
  }

  function setLoading(on) {
    lastGenerating = on;
    var btn = els['generate-btn'];
    if (on) {
      btn.disabled = true;
      btn.innerHTML = '<span class="ai-spinner"></span>Generating…';
    } else {
      btn.innerHTML = 'Write the blog post';
      updateGenerateEnabled();
    }
    els['regen-btn'].disabled = on;
    els['copy-btn'].disabled = on;
  }

  function run(data, temperature) {
    var meta = LENGTH_META[data.length] || LENGTH_META.medium;
    els['ai-error'].textContent = '';
    els['ai-output'].textContent = '';
    els['output-head'].hidden = false;
    setLoading(true);

    AI.generate({
      system: buildSystemPrompt(),
      user: buildUserPrompt(data),
      temperature: temperature,
      maxTokens: meta.maxTokens,
      onToken: function (chunk, full) {
        els['ai-output'].textContent = full;
      }
    }).then(function (full) {
      els['ai-output'].textContent = (full || '').trim();
      if (!els['ai-output'].textContent) {
        els['ai-error'].textContent = 'The AI returned an empty post. Try again, or adjust the topic.';
      }
      setLoading(false);
    }).catch(function (err) {
      setLoading(false);
      els['ai-error'].textContent = (err && err.message) ? err.message : 'Something went wrong. Please try again.';
      if (!els['ai-output'].textContent) els['output-head'].hidden = true;
    });
  }

  function handleGenerate() {
    if (!AI.hasKey()) {
      els['ai-error'].textContent = 'Add your OpenRouter API key in AI settings above first.';
      return;
    }
    var data = readInputs();
    if (!data.topic) {
      els['ai-error'].textContent = 'Please enter a topic or working title for the post.';
      els['f-topic'].focus();
      return;
    }
    run(data, 0.8);
  }

  els['generate-btn'].addEventListener('click', handleGenerate);

  els['regen-btn'].addEventListener('click', function () {
    var data = readInputs();
    if (!data.topic) { els['ai-error'].textContent = 'Please enter a topic first.'; return; }
    run(data, 0.9); // nudge variety on a re-roll
  });

  // ── copy ──
  els['copy-btn'].addEventListener('click', function () {
    var text = els['ai-output'].textContent;
    if (!text) return;
    var btn = els['copy-btn'];
    function done() {
      var original = 'Copy';
      btn.textContent = 'Copied ✓';
      btn.classList.add('ai-copied');
      setTimeout(function () {
        btn.textContent = original;
        btn.classList.remove('ai-copied');
      }, 1500);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(fallbackCopy);
    } else {
      fallbackCopy();
    }
    function fallbackCopy() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
  });

  // Allow Ctrl/Cmd+Enter from the topic field to fire generation.
  els['f-topic'].addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleGenerate(); }
  });

})();
