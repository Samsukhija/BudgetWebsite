/* Shared BYOK (bring-your-own-key) AI layer for /tools/* AI tools.
   No backend, no cost to budgetwebsite.store: the visitor pastes their own
   API key, it's stored ONLY in their browser's localStorage, and requests
   go directly from their browser to the provider. We never see the key or
   the traffic. OpenRouter is the default provider because, unlike the
   OpenAI/Anthropic APIs, it permits direct in-browser (CORS) calls with a
   single key that fans out to many models. */
window.AIShared = (function () {
  'use strict';

  var SETTINGS_KEY = 'bw_ai_settings_v1';
  var PROFILE_KEY = 'bw_business_profile_v1';

  // Read the shared Business Profile (set once on /tools/business-profile/)
  // and turn it into a context block prepended to every AI system prompt,
  // so all the writers know the business without the user retyping it.
  function getBusinessProfile() {
    try {
      var p = JSON.parse(localStorage.getItem(PROFILE_KEY));
      return (p && typeof p === 'object') ? p : null;
    } catch (e) { return null; }
  }
  function businessBlock() {
    var p = getBusinessProfile();
    if (!p || !p.name) return '';
    var bits = ['The business is "' + p.name + '"'];
    if (p.does) bits.push('which ' + p.does);
    if (p.city) bits.push('based in ' + p.city);
    var line = bits.join(', ') + '.';
    var extra = [];
    if (p.phone) extra.push('Contact: ' + p.phone + '.');
    if (p.website) extra.push('Website: ' + p.website + '.');
    if (p.tone) extra.push('Preferred voice: ' + p.tone + '.');
    return 'BUSINESS CONTEXT (use it naturally, never restate it verbatim): ' +
      line + ' ' + extra.join(' ') + ' Tailor everything you write to this business.\n\n';
  }
  var ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

  // Curated cheap-but-capable defaults. Users can type any OpenRouter model id.
  var MODELS = [
    { id: 'openai/gpt-4o-mini', label: 'GPT-4o mini, cheap, fast, reliable (recommended)' },
    { id: 'anthropic/claude-3.5-haiku', label: 'Claude 3.5 Haiku, strong writing' },
    { id: 'google/gemini-flash-1.5', label: 'Gemini 1.5 Flash, very cheap' },
    { id: 'meta-llama/llama-3.1-8b-instruct', label: 'Llama 3.1 8B, cheapest' }
  ];
  var DEFAULT_MODEL = 'openai/gpt-4o-mini';

  function getSettings() {
    try {
      var s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      if (!s || typeof s !== 'object') s = {};
      return { apiKey: s.apiKey || '', model: s.model || DEFAULT_MODEL };
    } catch (e) {
      return { apiKey: '', model: DEFAULT_MODEL };
    }
  }
  function saveSettings(s) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ apiKey: s.apiKey || '', model: s.model || DEFAULT_MODEL }));
  }
  function hasKey() { return !!getSettings().apiKey; }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  /* Renders a self-contained settings panel into `container`.
     Calls onChange() (if given) whenever settings are saved. */
  function mountSettings(container, onChange) {
    var s = getSettings();
    var modelOpts = MODELS.map(function (m) {
      return '<option value="' + esc(m.id) + '"' + (m.id === s.model ? ' selected' : '') + '>' + esc(m.label) + '</option>';
    }).join('');
    var isCustom = MODELS.every(function (m) { return m.id !== s.model; });

    container.innerHTML =
      '<div class="ai-settings" id="ai-settings">' +
        '<button type="button" class="ai-settings-toggle" id="ai-settings-toggle">' +
          '<span class="ai-key-dot" id="ai-key-dot"></span>' +
          '<span id="ai-settings-toggle-label"></span>' +
          '<span class="ai-settings-chev">▾</span>' +
        '</button>' +
        '<div class="ai-settings-body" id="ai-settings-body" hidden>' +
          '<label>Your OpenRouter API key' +
            '<input type="password" id="ai-key-input" placeholder="sk-or-v1-..." autocomplete="off" value="' + esc(s.apiKey) + '">' +
          '</label>' +
          '<label>Model' +
            '<select id="ai-model-select">' + modelOpts +
              '<option value="__custom__"' + (isCustom ? ' selected' : '') + '>Custom model id…</option>' +
            '</select>' +
          '</label>' +
          '<input type="text" id="ai-model-custom" placeholder="e.g. anthropic/claude-3.5-sonnet" value="' +
            (isCustom ? esc(s.model) : '') + '"' + (isCustom ? '' : ' hidden') + '>' +
          '<div class="ai-settings-actions">' +
            '<button type="button" class="btn-primary btn-sm" id="ai-key-save">Save</button>' +
            '<a href="https://openrouter.ai/keys" target="_blank" rel="noopener" class="ai-settings-link">Get a free key →</a>' +
          '</div>' +
          '<p class="ai-settings-note">Stored only in this browser and sent straight to OpenRouter, never to us. You pay OpenRouter directly for usage (typically a fraction of a rupee per generation).</p>' +
          '<p class="ai-settings-note" style="border-top:1px solid var(--border);padding-top:12px;">' +
            (getBusinessProfile() && getBusinessProfile().name
              ? 'Business profile is set, so every tool already knows your business. '
              : 'Set your business profile once and every AI tool will know your business, no retyping. ') +
            '<a href="/tools/business-profile/" class="ai-settings-link">' +
              (getBusinessProfile() && getBusinessProfile().name ? 'Edit it →' : 'Set it up →') +
            '</a></p>' +
        '</div>' +
      '</div>';

    var toggle = container.querySelector('#ai-settings-toggle');
    var body = container.querySelector('#ai-settings-body');
    var keyInput = container.querySelector('#ai-key-input');
    var modelSelect = container.querySelector('#ai-model-select');
    var modelCustom = container.querySelector('#ai-model-custom');
    var saveBtn = container.querySelector('#ai-key-save');

    function refreshBadge() {
      var cur = getSettings();
      var dot = container.querySelector('#ai-key-dot');
      var label = container.querySelector('#ai-settings-toggle-label');
      if (cur.apiKey) {
        dot.className = 'ai-key-dot on';
        label.textContent = 'AI ready · ' + cur.model;
      } else {
        dot.className = 'ai-key-dot';
        label.textContent = 'Add your API key to enable AI';
      }
    }
    refreshBadge();

    toggle.addEventListener('click', function () {
      body.hidden = !body.hidden;
    });
    modelSelect.addEventListener('change', function () {
      modelCustom.hidden = modelSelect.value !== '__custom__';
    });
    saveBtn.addEventListener('click', function () {
      var model = modelSelect.value === '__custom__' ? modelCustom.value.trim() : modelSelect.value;
      saveSettings({ apiKey: keyInput.value.trim(), model: model || DEFAULT_MODEL });
      refreshBadge();
      body.hidden = true;
      if (typeof onChange === 'function') onChange(getSettings());
    });

    // If no key yet, open the panel so it's obvious what to do.
    if (!hasKey()) body.hidden = false;

    return { refresh: refreshBadge, open: function () { body.hidden = false; } };
  }

  function friendlyError(status, bodyText) {
    if (status === 401) return 'Your API key was rejected. Check it in AI settings and try again.';
    if (status === 402) return 'Your OpenRouter account is out of credit. Top up at openrouter.ai and retry.';
    if (status === 429) return 'Too many requests right now, wait a few seconds and try again.';
    if (status >= 500) return 'The AI provider had a temporary error. Try again in a moment.';
    var detail = '';
    try { detail = (JSON.parse(bodyText).error || {}).message || ''; } catch (e) {}
    return 'AI request failed' + (detail ? ': ' + detail : ' (status ' + status + ').');
  }

  /* generate({ system, user, temperature, maxTokens, onToken })
     - Streams tokens to onToken(chunk) if provided; always resolves with the
       full text. Throws Error(friendlyMessage) on failure. */
  function generate(opts) {
    opts = opts || {};
    var s = getSettings();
    if (!s.apiKey) return Promise.reject(new Error('Add your OpenRouter API key in AI settings first.'));

    var messages = [];
    var sys = businessBlock() + (opts.system || '');
    if (sys) messages.push({ role: 'system', content: sys });
    // Multimodal: if images (array of data: URIs) are passed, build a content
    // array so vision models (Business Card Scanner) can read them. Otherwise
    // a plain string keeps text-only requests simple.
    if (opts.images && opts.images.length) {
      var content = [{ type: 'text', text: opts.user || '' }];
      opts.images.forEach(function (url) {
        content.push({ type: 'image_url', image_url: { url: url } });
      });
      messages.push({ role: 'user', content: content });
    } else {
      messages.push({ role: 'user', content: opts.user || '' });
    }

    var wantStream = typeof opts.onToken === 'function';
    var body = {
      model: s.model || DEFAULT_MODEL,
      messages: messages,
      temperature: opts.temperature == null ? 0.8 : opts.temperature,
      max_tokens: opts.maxTokens || 1200,
      stream: wantStream
    };

    return fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + s.apiKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': location.origin,
        'X-Title': 'Budget Website Tools'
      },
      body: JSON.stringify(body)
    }).then(function (resp) {
      if (!resp.ok) {
        return resp.text().then(function (t) { throw new Error(friendlyError(resp.status, t)); });
      }
      if (!wantStream) {
        return resp.json().then(function (data) {
          return ((data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '').trim();
        });
      }
      // Stream SSE
      var reader = resp.body.getReader();
      var decoder = new TextDecoder();
      var full = '';
      var buffer = '';
      function pump() {
        return reader.read().then(function (result) {
          if (result.done) return full.trim();
          buffer += decoder.decode(result.value, { stream: true });
          var lines = buffer.split('\n');
          buffer = lines.pop();
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (!line || line.indexOf('data:') !== 0) continue;
            var payload = line.slice(5).trim();
            if (payload === '[DONE]') return full.trim();
            try {
              var json = JSON.parse(payload);
              var delta = json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content;
              if (delta) { full += delta; opts.onToken(delta, full); }
            } catch (e) { /* ignore keep-alive / partial lines */ }
          }
          return pump();
        });
      }
      return pump();
    });
  }

  return {
    getSettings: getSettings, saveSettings: saveSettings, hasKey: hasKey,
    mountSettings: mountSettings, generate: generate, MODELS: MODELS, esc: esc,
    getBusinessProfile: getBusinessProfile, businessBlock: businessBlock
  };
})();
