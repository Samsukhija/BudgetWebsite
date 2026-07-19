/* About Us Page Writer — turns a few honest facts about a small Indian
   business into a warm, ready-to-paste "About Us" section. All AI runs through
   AIShared (the visitor's own OpenRouter key). No backend, no stored data. */
(function () {
  'use strict';

  var els = {
    settings:   document.getElementById('ai-settings-mount'),
    name:       document.getElementById('f-name'),
    year:       document.getElementById('f-year'),
    what:       document.getElementById('f-what'),
    story:      document.getElementById('f-story'),
    tone:       document.getElementById('f-tone'),
    generate:   document.getElementById('generate-btn'),
    hint:       document.getElementById('ai-hint'),
    error:      document.getElementById('ai-error'),
    outputHead: document.getElementById('output-head'),
    output:     document.getElementById('ai-output'),
    copy:       document.getElementById('copy-btn'),
    regen:      document.getElementById('regen-btn')
  };

  var GENERATE_LABEL = 'Write my About Us';
  var busy = false;

  var TONES = {
    warm: {
      label: 'Warm & personal',
      note: 'Warm and personal — write like a real person talking to a neighbour. First person ("we"/"I") is welcome. Friendly, sincere, a little heart. Plain words over corporate ones.'
    },
    professional: {
      label: 'Professional & established',
      note: 'Professional and established — confident, credible, reassuring. Emphasise experience, reliability and quality of service. Polished but still human; never stiff or full of jargon.'
    },
    bold: {
      label: 'Modern & bold',
      note: 'Modern and bold — punchy, energetic, contemporary. Short confident sentences. A clear point of view. Fresh and forward-looking, but never gimmicky or over-hyped.'
    }
  };

  /* ── enable/disable generate based on whether a key is saved ── */
  function updateGenerateEnabled() {
    var ok = AIShared.hasKey();
    els.generate.disabled = !ok || busy;
    els.hint.hidden = ok;
  }

  AIShared.mountSettings(els.settings, updateGenerateEnabled);
  updateGenerateEnabled();

  /* ── prompt construction ── the product ── */
  function buildSystem(toneNote) {
    return [
      'You are a seasoned Indian small-business copywriter who has written "About Us" pages for hundreds of local businesses across India — dentists, retailers, manufacturers, salons, consultants, clinics, restaurants and family firms. You write in warm, natural Indian English for an Indian audience.',
      '',
      'Your job: turn the plain facts the owner gives you into a polished "About Us" section that reads like real, professional website copy — the kind a visitor actually reads and trusts, not a dry list of facts.',
      '',
      'HOW TO WRITE IT:',
      '- Open with a short, inviting HEADLINE on its own line (5 to 9 words). Not the business name alone, and not the words "About Us". Make it about the visitor or the promise.',
      '- Then 2 to 4 short paragraphs (2 to 4 sentences each). Tell a small story: who they are, why they started, what they believe, who they serve — and close with a warm, inviting line that makes the reader want to walk in, call, or message on WhatsApp.',
      '- Build trust with concrete, specific details drawn ONLY from what the owner gave you (years in business, the founder, the neighbourhood, the way they treat customers). Weave the facts into sentences — never bullet-list them.',
      '',
      'HARD RULES:',
      '- Use ONLY the facts provided. Never invent awards, numbers, client counts, certifications, locations or claims that were not given. If a detail is missing, simply write around it — do not make one up.',
      '- Indian context throughout: Indian English spelling and phrasing, ₹ for any prices, references to WhatsApp/calling as natural ways to reach out where it fits.',
      '- No emojis. No hashtags. No markdown, asterisks, headings or bullet points — plain paragraphs only, separated by blank lines, with the headline as the first line.',
      '- No hollow marketing filler ("we are passionate about excellence", "customer-centric solutions", "one-stop destination", "we go the extra mile"). Every sentence must say something real about THIS business.',
      '- Keep the whole section tight: roughly 110 to 200 words. Better to be short and genuine than long and padded.',
      '',
      'TONE FOR THIS ONE: ' + toneNote,
      '',
      'Output only the finished About Us copy (headline first, then the paragraphs). No preamble, no notes, no explanation, no quotation marks around it.'
    ].join('\n');
  }

  function buildUser(v) {
    var lines = [];
    lines.push('Write the About Us section for this business.');
    lines.push('');
    lines.push('Business name: ' + v.name);
    lines.push('What they do: ' + v.what);
    if (v.year) lines.push('Year founded: ' + v.year);
    lines.push('');
    lines.push('What makes them different / their story (in the owner\'s own words):');
    lines.push(v.story);
    return lines.join('\n');
  }

  /* ── generation ── */
  function setBusy(on) {
    busy = on;
    if (on) {
      els.generate.disabled = true;
      els.generate.innerHTML = '<span class="ai-spinner"></span>Writing…';
    } else {
      els.generate.innerHTML = GENERATE_LABEL;
      updateGenerateEnabled();
    }
  }

  function readInputs() {
    return {
      name:  els.name.value.trim(),
      year:  els.year.value.trim(),
      what:  els.what.value.trim(),
      story: els.story.value.trim(),
      tone:  els.tone.value
    };
  }

  function validate(v) {
    if (!v.name) return 'Please enter your business name.';
    if (!v.what) return 'Please tell us what your business does.';
    if (!v.story || v.story.length < 15) return 'Add a sentence or two about what makes you different — that is what the writer builds the story from.';
    return null;
  }

  function run(temperature) {
    if (busy) return;
    els.error.textContent = '';

    var v = readInputs();
    var problem = validate(v);
    if (problem) { els.error.textContent = problem; return; }

    var tone = TONES[v.tone] || TONES.warm;

    setBusy(true);
    els.output.textContent = '';
    els.outputHead.hidden = false;

    AIShared.generate({
      system: buildSystem(tone.note),
      user: buildUser(v),
      temperature: temperature,
      maxTokens: 700,
      onToken: function (chunk, full) {
        els.output.textContent = full;
      }
    }).then(function (full) {
      els.output.textContent = (full || '').trim();
      if (!els.output.textContent) {
        els.error.textContent = 'The AI returned an empty response. Try Regenerate.';
      }
      setBusy(false);
    }).catch(function (err) {
      els.error.textContent = (err && err.message) ? err.message : 'Something went wrong. Please try again.';
      if (!els.output.textContent) els.outputHead.hidden = true;
      setBusy(false);
    });
  }

  els.generate.addEventListener('click', function () { run(0.8); });
  els.regen.addEventListener('click', function () { run(0.9); });

  /* ── copy ── */
  els.copy.addEventListener('click', function () {
    var text = els.output.textContent || '';
    if (!text.trim()) return;
    navigator.clipboard.writeText(text).then(function () {
      var original = els.copy.textContent;
      els.copy.textContent = 'Copied ✓';
      els.copy.classList.add('ai-copied');
      setTimeout(function () {
        els.copy.textContent = original;
        els.copy.classList.remove('ai-copied');
      }, 1500);
    }).catch(function () {
      els.error.textContent = 'Could not copy automatically — select the text and copy manually.';
    });
  });

})();
