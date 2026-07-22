/* /app/marketing/ — the Marketing Writing Pack workspace.
   All 8 free AI writer tools (WhatsApp broadcast, Instagram caption, GMB
   post, review reply, cold message, festival offer, blog post, About Us)
   on one screen. Every system prompt / user-prompt builder below is ported
   from its original free tool at tools/<name>/ + js/<name>.js, so the
   output quality matches what visitors already get for free — the only
   difference is everything generated here is auto-saved to a persistent
   content library (bw_pack_content_library_v1) instead of thrown away the
   moment you navigate away. */
(function () {
  'use strict';

  var TS = window.ToolsShared;
  var AI = window.AIShared;

  // ── entitlement gate ──
  var user = window.BWAuth ? BWAuth.currentUser() : null;
  if (!user) { location.href = '/app/'; return; }
  if (!BWEntitlement.has(user.email, 'marketing')) { location.href = '/app/'; return; }

  var LIB_KEY = 'bw_pack_content_library_v1';

  function esc(s) { return TS.escapeHtml(s); }
  function profile() { return AI.getBusinessProfile() || {}; }

  // ═══════════════════════════════════════════════════════════════════════
  // TYPE DEFINITIONS — one entry per free writer tool, ported faithfully.
  // Each defines: label, badge class, generate-button label, output-head
  // title, the field markup, a value reader, system/user prompt builders,
  // an output parser (array of variants for multi-output tools, or a plain
  // trimmed string for single-output tools), a validator and an
  // input-summary builder for the library list.
  // ═══════════════════════════════════════════════════════════════════════
  var TYPES = {};

  // ── 1. WhatsApp Broadcast Writer ──────────────────────────────────────
  TYPES.whatsapp = {
    label: 'WhatsApp Broadcast',
    badge: 'tool-badge-good',
    genLabel: 'Generate 2 broadcasts',
    outTitle: 'Your broadcasts',
    multi: true,
    maxTokens: 900,
    fieldsHtml: function (p) {
      return (
        '<div class="tool-row tool-row-2">' +
          '<label>Business name<input type="text" id="f-business" value="' + esc(p.name || '') + '" placeholder="e.g. Sharma Dental Care"></label>' +
          '<label>Who is it going to?<input type="text" id="f-audience" placeholder="e.g. past customers, regular patients"></label>' +
        '</div>' +
        '<label>What is the broadcast about?<textarea id="f-about" rows="3" placeholder="e.g. Diwali offer, 20% off all teeth cleaning &amp; whitening, valid till 5 Nov. Book early, slots filling fast."></textarea></label>' +
        '<label>Call-to-action link or number (optional)<input type="text" id="f-cta" placeholder="e.g. Call 98765 43210 or wa.me/919876543210"></label>' +
        '<label style="display:flex;align-items:center;gap:10px;margin-top:4px;"><input type="checkbox" id="f-emoji" checked style="width:auto;margin-top:0;"> Use a few tasteful emoji</label>'
      );
    },
    readValues: function () {
      return {
        business: val('f-business'), audience: val('f-audience'), about: val('f-about'),
        cta: val('f-cta'), emoji: checked('f-emoji')
      };
    },
    validate: function (v) {
      if (!v.business) return 'Please enter your business name.';
      if (!v.about) return 'Please describe what the broadcast is about.';
      return null;
    },
    system: function () {
      return "You are an expert Indian small-business copywriter who writes WhatsApp broadcast messages that real customers actually read and act on. Your clients are small businesses across India, dentists, retailers, salons, manufacturers, tuition classes, consultants, restaurants. You write in warm, natural Indian English (the everyday register a shop owner uses with regulars), rupees as ₹, and India-specific context (festivals like Diwali, Holi, Raksha Bandhan, Eid; GST; local delivery; UPI).\n\n" +
        "Follow these WhatsApp broadcast rules exactly:\n" +
        "- Open with a short, personal-feeling greeting or hook, never a generic 'Dear Customer' or a corporate subject line.\n" +
        "- Short lines with line breaks between thoughts. WhatsApp is skimmed on a phone, not read like a letter. No long paragraphs.\n" +
        "- Be concrete: name the actual offer, product, date, discount or reason. Never vague filler like 'we value your business' or 'exciting news'.\n" +
        "- One clear call-to-action near the end. If a link/number is provided, use it verbatim. If none is provided, use a natural soft CTA like 'Reply YES to book' or 'Send us a message to know more'.\n" +
        "- You MAY use WhatsApp bold with single *asterisks* around a key phrase or price, sparingly (at most once or twice).\n" +
        "- Keep each message under ~600 characters. Tight is better than long.\n" +
        "- Sign off with the business name.\n" +
        "- Only add a soft opt-out line ('Reply STOP to opt out') when the message is clearly promotional/marketing to a broad list. Do NOT add it to genuine service reminders or one-to-few announcements.\n" +
        "- Sound human. No robotic template phrasing, no hashtags, no ALL-CAPS shouting, no fake urgency that isn't in the brief.\n\n" +
        "Write TWO distinctly different variations, different opening, different angle, different rhythm, so the owner has a real choice, not two versions of the same sentence.\n\n" +
        "Output format (follow precisely, nothing else):\n" +
        "===MESSAGE 1===\n<the full first broadcast>\n===MESSAGE 2===\n<the full second broadcast>\n" +
        "Do not add any commentary, notes, labels, or explanation before, between, or after the two messages beyond the two === markers.";
    },
    user: function (v) {
      return [
        'Business name: ' + v.business,
        'Audience (who receives this broadcast): ' + (v.audience || 'existing customers'),
        'What the broadcast is about: ' + v.about,
        'Call-to-action to include: ' + (v.cta ? v.cta : 'none provided, use a natural soft CTA'),
        'Emoji: ' + (v.emoji ? 'YES, use a few tasteful, relevant emoji (do not overdo it; 2-4 across the message).' : 'NO, do not use any emoji at all.'),
        '', 'Write the two WhatsApp broadcast messages now, in the exact output format.'
      ].join('\n');
    },
    parse: function (text) {
      var m1 = text.indexOf('===MESSAGE 1==='), m2 = text.indexOf('===MESSAGE 2===');
      var one = '', two = '';
      if (m1 !== -1 && m2 !== -1 && m2 > m1) { one = text.slice(m1 + 15, m2).trim(); two = text.slice(m2 + 15).trim(); }
      else if (m1 !== -1) { one = text.slice(m1 + 15).trim(); }
      else { one = text.trim(); }
      one = one.replace(/===MESSAGE\s*2?=*$/i, '').trim();
      return [one, two].filter(function (s) { return s.length; });
    },
    summary: function (v) { return 'WhatsApp broadcast: ' + trim60(v.about); }
  };

  // ── 2. Instagram Caption Generator ────────────────────────────────────
  TYPES.instagram = {
    label: 'Instagram Caption',
    badge: 'tool-badge-accent',
    genLabel: '✨ Generate 3 captions',
    outTitle: 'Your captions',
    multi: true,
    maxTokens: 1100,
    fieldsHtml: function (p) {
      return (
        '<label>What is this post about?<textarea id="f-topic" rows="3" placeholder="e.g. Monsoon offer, 20% off root canal treatment this week only."></textarea></label>' +
        '<div class="tool-row tool-row-2">' +
          '<label>Your business / what you do<input type="text" id="f-business" value="' + esc(p.name || '') + '" placeholder="e.g. Dental clinic in Andheri"></label>' +
          '<label>Vibe<select id="f-vibe">' +
            '<option value="Fun &amp; playful">Fun &amp; playful</option><option value="Elegant &amp; premium">Elegant &amp; premium</option>' +
            '<option value="Informative">Informative</option><option value="Inspirational">Inspirational</option>' +
          '</select></label>' +
        '</div>' +
        '<div class="tool-row tool-row-2" style="margin-top:4px;">' +
          '<label style="display:flex;align-items:center;gap:9px;margin-bottom:0;"><input type="checkbox" id="f-hashtags" checked style="width:auto;margin-top:0;"> Include a block of hashtags</label>' +
          '<label style="display:flex;align-items:center;gap:9px;margin-bottom:0;"><input type="checkbox" id="f-emoji" checked style="width:auto;margin-top:0;"> Include emoji</label>' +
        '</div>'
      );
    },
    readValues: function () {
      return { topic: val('f-topic'), business: val('f-business'), vibe: val('f-vibe'), hashtags: checked('f-hashtags'), emoji: checked('f-emoji') };
    },
    validate: function (v) { if (!v.topic) return 'Tell us what the post is about first.'; return null; },
    system: function () {
      return [
        "You are an expert Instagram copywriter for Indian small businesses, the kind of local dentists, boutiques, cafes, manufacturers, jewellers and consultants you find in a Mumbai BNI chapter.",
        "You write in warm, natural Indian English. You understand Indian festivals (Diwali, Holi, Ganesh Chaturthi, Raksha Bandhan, Eid, Christmas, Navratri), the monsoon, the wedding and exam seasons, and how Indian customers actually talk and buy.",
        "You write captions that make a busy shop owner look professional and get people to DM, call or visit. You never sound like a generic global brand, never use corporate jargon, and never over-promise.",
        "",
        "Every caption you write follows this shape:",
        "1. A strong scroll-stopping HOOK as the first line (a question, a bold statement, or a relatable moment, never 'We are happy to announce').",
        "2. ONE to THREE short body lines that give the value or story. Keep sentences tight and skimmable. Use line breaks, not long paragraphs.",
        "3. A clear call-to-action last line (e.g. 'DM us to book', 'Call now, link in bio', 'Visit us this weekend', 'WhatsApp us on the number in bio').",
        "",
        "Rules:",
        "- Prices in rupees (₹) only, and only if the user gave a price. Never invent prices, offers, discounts, phone numbers or facts the user did not provide.",
        "- Keep each caption Instagram-appropriate in length, roughly 3 to 6 short lines of copy, easy to read on a phone. Do not write essays.",
        "- Match the requested vibe exactly.",
        "- Write three GENUINELY DIFFERENT captions, different hooks and different angles, not three rewordings of the same sentence.",
        "- No hashtags inside the body copy. If hashtags are requested they go only in the dedicated hashtag block."
      ].join('\n');
    },
    user: function (v) {
      var lines = ['Write 3 Instagram captions for this post.', '', 'POST IS ABOUT: ' + v.topic];
      if (v.business) lines.push('THE BUSINESS: ' + v.business);
      lines.push('VIBE: ' + v.vibe);
      lines.push('EMOJI: ' + (v.emoji ? 'Yes, use a few tasteful, relevant emoji (not on every line, no emoji spam).' : 'No, do NOT use any emoji at all.'));
      lines.push(v.hashtags
        ? 'HASHTAGS: Yes, after the caption copy, add a block of 8 to 15 relevant hashtags on their own line. Mix broad and India/city/niche-specific tags. All lowercase, space-separated, no commas.'
        : 'HASHTAGS: No, do not add any hashtags.');
      lines.push('', 'FORMAT: Output exactly three captions. Separate each caption with a line containing only ===CAPTION=== and nothing else. Do not number them, do not add headings, labels, titles or any commentary, output only the caption text and the separators.');
      return lines.join('\n');
    },
    parse: function (text) {
      return String(text || '').split('===CAPTION===')
        .map(function (c) { return c.replace(/^\s*(caption\s*\d+\s*[:.\-]?|option\s*\d+\s*[:.\-]?|\d+\s*[).\-])\s*/i, '').trim(); })
        .filter(function (c) { return c.length; });
    },
    summary: function (v) { return 'Instagram caption: ' + trim60(v.topic); }
  };

  // ── 3. Google My Business Post Writer ─────────────────────────────────
  TYPES.gmb = {
    label: 'GMB Post',
    badge: 'tool-badge-accent',
    genLabel: 'Generate 2 posts',
    outTitle: 'Your posts',
    multi: true,
    maxTokens: 700,
    fieldsHtml: function (p) {
      return (
        '<div class="tool-row tool-row-2">' +
          '<label>Business Name<input type="text" id="f-biz" value="' + esc(p.name || '') + '" placeholder="e.g. Sharma Dental Care"></label>' +
          '<label>Post Type<select id="f-type"><option value="What\'s New">What\'s New (general update)</option><option value="Offer">Offer (discount / deal)</option><option value="Event">Event</option><option value="Product highlight">Product highlight</option></select></label>' +
        '</div>' +
        '<label>What\'s it about?<textarea id="f-about" rows="3" placeholder="e.g. Painless root canal in a single sitting, this month ₹500 off."></textarea></label>' +
        '<div class="tool-row tool-row-2">' +
          '<label>Call-to-action button<select id="f-cta"><option value="Call now">Call now</option><option value="Learn more">Learn more</option><option value="Book">Book</option><option value="Order online">Order online</option><option value="Visit us">Visit us</option></select></label>' +
          '<label style="display:flex;align-items:center;gap:8px;margin-top:26px;"><input type="checkbox" id="f-emoji" style="width:auto;margin-top:0;"> <span>Include emoji</span></label>' +
        '</div>'
      );
    },
    readValues: function () {
      return { biz: val('f-biz'), type: val('f-type'), about: val('f-about'), cta: val('f-cta'), emoji: checked('f-emoji') };
    },
    validate: function (v) {
      if (!v.biz) return 'Please enter your business name.';
      if (!v.about) return 'Tell us what the post is about.';
      return null;
    },
    system: function () {
      return [
        "You are an expert Indian small-business copywriter who writes Google Business Profile (Google My Business) posts that get local customers to call, book and walk in.",
        "You write for small businesses across India, dentists, retailers, salons, manufacturers, tuition classes, restaurants, consultants and the like. Your reader is a busy owner who will paste your post straight into Google.",
        "",
        "How a great GBP post works:",
        "- Google shows only the first ~100 characters before a 'Read more' cut, so the FIRST line must be a self-contained hook that makes someone stop scrolling. Put the offer, benefit or news up front, never a slow build-up.",
        "- Keep the whole post tight: roughly 40-80 words. GBP allows ~1500 characters but short posts win. No fluff, no corporate padding.",
        "- Write in warm, natural Indian English the way a shop owner speaks to a regular customer. Prices in rupees using the ₹ symbol. Reference Indian festivals, seasons and local context when relevant.",
        "- Weave the TYPE of business and, if natural, the city/locality into the copy so it helps local search (local SEO). Do this naturally, never keyword-stuff.",
        "- End with one short line that clearly implies the chosen call-to-action button. Do NOT invent phone numbers, links, addresses or fake discounts, only use details the owner gave you.",
        "- Match the post type: What's New = news/update, Offer = a clear deal with the terms, Event = what/when/why-come, Product highlight = one product and why it's worth buying.",
        "- Do NOT use hashtags. Do NOT use markdown, asterisks or headings. Plain text only, ready to paste.",
        "",
        "Return EXACTLY TWO post options with two distinct angles. Output ONLY the two posts separated by a line containing only three equals signs (===). No numbering, no labels, no preamble, no commentary."
      ].join('\n');
    },
    user: function (v) {
      return [
        'Business name: ' + v.biz, 'Business/post type: ' + v.type, 'What the post is about: ' + v.about,
        'Call-to-action button chosen: ' + v.cta,
        'Use emoji: ' + (v.emoji ? 'Yes, use 1-3 tasteful, relevant emoji, not more.' : 'No, do not use any emoji at all.'),
        '', 'Write the two Google Business Profile posts now, following all the rules.'
      ].join('\n');
    },
    parse: function (text) {
      var idx = text.indexOf('===');
      if (idx === -1) return [text.trim()].filter(Boolean);
      var first = text.slice(0, idx), second = text.slice(idx + 3);
      var extra = second.indexOf('===');
      if (extra !== -1) second = second.slice(0, extra);
      return [first.trim(), second.trim()].filter(function (s) { return s.length; });
    },
    summary: function (v) { return 'GMB post (' + v.type + '): ' + trim60(v.about); }
  };

  // ── 4. Google Review Reply Generator ──────────────────────────────────
  TYPES.review = {
    label: 'Review Reply',
    badge: 'tool-badge-warn',
    genLabel: 'Generate 2 replies',
    outTitle: 'Your reply options',
    multi: true,
    maxTokens: 700,
    fieldsHtml: function (p) {
      return (
        '<label>Customer\'s review text<textarea id="f-review" rows="5" placeholder="Paste the exact review here."></textarea></label>' +
        '<div class="tool-row tool-row-3">' +
          '<label>Star rating<select id="f-rating">' +
            '<option value="5">★★★★★ &nbsp;5, Excellent</option><option value="4">★★★★☆ &nbsp;4, Good</option>' +
            '<option value="3">★★★☆☆ &nbsp;3, Mixed</option><option value="2">★★☆☆☆ &nbsp;2, Poor</option><option value="1">★☆☆☆☆ &nbsp;1, Bad</option>' +
          '</select></label>' +
          '<label>Your business name<input type="text" id="f-business" value="' + esc(p.name || '') + '" placeholder="e.g. Mehta Dental Care"></label>' +
          '<label>Reply tone<select id="f-tone"><option value="Warm">Warm &amp; friendly</option><option value="Professional">Professional</option><option value="Apologetic">Apologetic &amp; fixing</option></select></label>' +
        '</div>' +
        '<p class="ai-hint">Tip: for 1-2 star reviews we auto-suggest the apologetic tone, you can override it any time.</p>'
      );
    },
    afterRender: function () {
      var rating = document.getElementById('f-rating');
      var tone = document.getElementById('f-tone');
      if (!rating || !tone) return;
      var touched = false;
      function suggest() {
        if (touched) return;
        var r = parseInt(rating.value, 10);
        tone.value = r <= 2 ? 'Apologetic' : (r === 3 ? 'Professional' : 'Warm');
      }
      rating.addEventListener('change', suggest);
      tone.addEventListener('change', function () { touched = true; });
      suggest();
    },
    readValues: function () {
      return { review: val('f-review'), rating: val('f-rating'), business: val('f-business') || 'our business', tone: val('f-tone') };
    },
    validate: function (v) { if (!v.review) return "Paste the customer's review first, then generate."; return null; },
    system: function () {
      return [
        'You are an expert Indian small-business copywriter who writes owner-voice replies to Google reviews for local businesses (dentists, retailers, salons, manufacturers, consultants, restaurants, clinics and the like across India).',
        '',
        'You write the way a warm, switched-on owner in India actually talks: natural Indian English, courteous but never stiff or corporate, first person ("we"/"our team"). You sound like a real person who was genuinely there, not a call-centre script.',
        '',
        'Hard rules for every reply:',
        '- Keep it short-2 to 4 sentences, the length a busy owner would really type. Never write an essay.',
        '- Reference something SPECIFIC the reviewer actually said (a name, a service, a detail). Never generic filler.',
        '- No emojis. No hashtags. No marketing slogans. No "Dear Customer". No exclamation-mark spam (one is plenty).',
        '- Do not invent facts, discounts, or promises the business did not state.',
        '- Sign off naturally in the owner\'s voice, e.g. "-Team [Business]" or the owner\'s warm thanks.',
        '',
        'For POSITIVE reviews (4-5 stars): thank them genuinely, echo the specific thing they praised, and warmly invite them back. Do not oversell.',
        'For NEGATIVE reviews (1-2 stars): open by acknowledging their experience without being defensive, apologise sincerely, take ownership, offer to make it right, and move it offline (a call/WhatsApp/message to the team). Never argue, never make excuses, never blame the customer.',
        'For MIXED reviews (3 stars): thank them for the honest feedback, acknowledge both the good and the gap they mentioned, and show you are acting on it.',
        '',
        'Match the requested tone. If "Apologetic", lead with the apology and the fix. If "Warm", be friendly and personal. If "Professional", be polished and measured, still human.',
        '',
        'OUTPUT FORMAT, follow exactly: Write TWO distinct reply options that differ meaningfully in wording and angle. Output ONLY the two replies, separated by a line containing exactly ||| (three pipe characters) on its own line. No "Option 1" labels, no preamble, no explanation, no surrounding quotation marks.'
      ].join('\n');
    },
    user: function (v) {
      var toneMap = { Warm: 'Warm & friendly', Professional: 'Professional', Apologetic: 'Apologetic & fixing' };
      var ratingWord = ({ 1: '1 out of 5 (very unhappy)', 2: '2 out of 5 (unhappy)', 3: '3 out of 5 (mixed)', 4: '4 out of 5 (happy)', 5: '5 out of 5 (delighted)' })[v.rating] || (v.rating + ' out of 5');
      return [
        'Business name: ' + v.business, 'Star rating given: ' + ratingWord,
        'Requested tone: ' + (toneMap[v.tone] || 'Warm & friendly'), '',
        'The customer wrote this review:', '"""', v.review, '"""', '',
        'Write the two reply options now, in the exact output format specified.'
      ].join('\n');
    },
    parse: function (text) {
      function strip(s) { return (s || '').replace(/^\s*(option\s*\d+\s*[:.)-]?\s*)/i, '').replace(/^["'“”]+|["'“”]+$/g, '').trim(); }
      var parts = text.split('|||');
      return [strip(parts[0] || ''), parts.length > 1 ? strip(parts.slice(1).join('|||')) : ''].filter(function (s) { return s.length; });
    },
    summary: function (v) { return 'Review reply (' + v.rating + '★): ' + trim60(v.review); }
  };

  // ── 5. Cold Message Writer ────────────────────────────────────────────
  TYPES.cold = {
    label: 'Cold Message',
    badge: 'tool-badge-neutral',
    genLabel: 'Write my 3 messages',
    outTitle: 'Your 3 cold messages',
    multi: true,
    maxTokens: 1100,
    fieldsHtml: function () {
      return (
        '<label>Your business / what you offer<textarea id="f-offer" rows="3" placeholder="e.g. I run a dental clinic in Andheri offering painless root canals and same-day crowns."></textarea></label>' +
        '<label>Who you\'re messaging<textarea id="f-target" rows="2" placeholder="e.g. A gym owner I met at last week\'s BNI meeting."></textarea></label>' +
        '<div class="tool-row tool-row-3">' +
          '<label>Goal<select id="f-goal"><option value="Book a call">Book a call</option><option value="Introduce a product">Introduce a product</option><option value="Follow up after meeting">Follow up after meeting</option><option value="Ask for referral">Ask for referral</option><option value="Re-engage old client">Re-engage old client</option></select></label>' +
          '<label>Channel<select id="f-channel"><option value="WhatsApp">WhatsApp</option><option value="Email">Email</option><option value="LinkedIn">LinkedIn</option></select></label>' +
          '<label>Tone<select id="f-tone"><option value="Warm &amp; friendly">Warm &amp; friendly</option><option value="Direct &amp; professional">Direct &amp; professional</option><option value="Casual">Casual</option></select></label>' +
        '</div>'
      );
    },
    readValues: function () {
      return { offer: val('f-offer'), target: val('f-target'), goal: val('f-goal'), channel: val('f-channel'), tone: val('f-tone') };
    },
    validate: function (v) {
      if (!v.offer) return 'Tell us what your business offers first.';
      if (!v.target) return 'Add who you are messaging so the note can be personal.';
      return null;
    },
    system: function () {
      return "You are an expert Indian small-business copywriter who writes cold outreach messages " +
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
        "- Do NOT invent facts, prices, discounts or credentials that the sender did not provide.\n" +
        "- Never use en dashes or em dashes; use commas or full stops.\n\n" +
        "Channel formatting:\n" +
        "- WhatsApp: 2 to 4 short lines, no subject line, no formal sign-off. Feels like a text.\n" +
        "- Email: START with a line 'Subject: <6 to 8 word specific subject>' then a blank line, then a tight 3 to 5 line body with a brief sign-off.\n" +
        "- LinkedIn: concise and professional, 2 to 4 lines, no subject line, no emojis.\n\n" +
        "Output format (follow EXACTLY): Return THREE distinctly different messages, vary the angle, opening line and phrasing. Separate the three messages with a line containing only '===MESSAGE===' and nothing else. Output ONLY the three messages and the separators. No numbering, no headings, no commentary.";
    },
    user: function (v) {
      var goalHints = {
        'Book a call': 'The single CTA should propose a specific, low-friction next step to talk, suggesting they pick a time.',
        'Introduce a product': 'Introduce one specific offering and why it is relevant to THIS recipient; CTA invites a yes/no interest or a quick look.',
        'Follow up after meeting': 'Reference that you already met/spoke, jog their memory with a concrete detail, and move one specific thing forward.',
        'Ask for referral': 'Politely ask if they know one specific type of person who could use your service; make it easy and low-pressure to say no.',
        'Re-engage old client': 'Warmly reconnect with a past client, acknowledge the gap without guilt-tripping, and give one concrete reason to talk again now.'
      };
      return [
        'Write the three cold messages now.', '', 'SENDER / what they offer:', (v.offer || '(not specified)'), '',
        'RECIPIENT / who is being messaged:', (v.target || '(not specified)'), '',
        'GOAL: ' + v.goal + '-' + (goalHints[v.goal] || ''),
        'CHANNEL: ' + v.channel + ' (format strictly for this channel).', 'TONE: ' + v.tone + '.'
      ].join('\n');
    },
    parse: function (text) {
      var parts = text.split('===MESSAGE===').map(function (p) { return p.trim(); }).filter(function (p) { return p.length; });
      return parts.length ? parts : [text.trim()].filter(Boolean);
    },
    summary: function (v) { return 'Cold message (' + v.channel + ', ' + v.goal + '): ' + trim60(v.target); }
  };

  // ── 6. Festival Offer Message Generator ───────────────────────────────
  TYPES.festival = {
    label: 'Festival Offer',
    badge: 'tool-badge-warn',
    genLabel: '✨ Generate 3 Messages',
    outTitle: 'Your festive messages',
    multi: true,
    maxTokens: 1100,
    fieldsHtml: function (p) {
      return (
        '<div class="tool-row tool-row-2">' +
          '<label>Festival<select id="f-festival">' +
            '<option value="Diwali">Diwali</option><option value="Holi">Holi</option><option value="Eid">Eid</option>' +
            '<option value="Raksha Bandhan">Raksha Bandhan</option><option value="Ganesh Chaturthi">Ganesh Chaturthi</option>' +
            '<option value="Navratri">Navratri</option><option value="Christmas">Christmas</option><option value="New Year">New Year</option>' +
            '<option value="Makar Sankranti / Pongal">Makar Sankranti / Pongal</option><option value="Onam">Onam</option>' +
            '<option value="Independence Day">Independence Day</option><option value="Republic Day">Republic Day</option>' +
            '<option value="Other">Other…</option>' +
          '</select></label>' +
          '<label>Channel<select id="f-channel"><option value="WhatsApp">WhatsApp</option><option value="Instagram">Instagram (caption)</option><option value="SMS">SMS</option></select></label>' +
        '</div>' +
        '<label id="f-festival-other-wrap" hidden>Which festival / occasion?<input type="text" id="f-festival-other" placeholder="e.g. Gudi Padwa, shop anniversary, Akshaya Tritiya"></label>' +
        '<label>Business Name<input type="text" id="f-business" value="' + esc(p.name || '') + '" placeholder="e.g. Sharma Dental Care"></label>' +
        '<label>Offer Details<textarea id="f-offer" rows="3" placeholder="e.g. 20% off all treatments + free consultation. Valid till 5th Nov."></textarea></label>' +
        '<label style="display:flex;align-items:center;gap:10px;margin-top:4px;"><input type="checkbox" id="f-emoji" checked style="width:auto;margin-top:0;"> <span>Include emoji (auto-trimmed for SMS)</span></label>'
      );
    },
    afterRender: function () {
      var sel = document.getElementById('f-festival');
      var wrap = document.getElementById('f-festival-other-wrap');
      if (!sel || !wrap) return;
      sel.addEventListener('change', function () { wrap.hidden = sel.value !== 'Other'; if (!wrap.hidden) document.getElementById('f-festival-other').focus(); });
    },
    readValues: function () {
      var festivalSel = val('f-festival');
      var festival = festivalSel === 'Other' ? val('f-festival-other') : festivalSel;
      return { festival: festival, channel: val('f-channel'), business: val('f-business'), offer: val('f-offer'), emoji: checked('f-emoji') };
    },
    validate: function (v) {
      if (!v.festival) return 'Please tell us which festival or occasion this is for.';
      if (!v.business) return 'Please enter your business name.';
      if (!v.offer) return 'Please describe the offer (e.g. "20% off all services").';
      return null;
    },
    system: function (v) {
      var CHANNEL_GUIDE = {
        'WhatsApp': 'Format for WhatsApp. Warm and personal, like a message from the shop owner. 2 to 5 short lines with line breaks between ideas. You may use *bold* (single asterisks) for the offer or key phrase. Keep it forwardable. End with a clear call to action.',
        'Instagram': 'Format as an Instagram caption. Punchy and upbeat. A strong hook in the first line, the offer clearly stated, urgency, then a call to action. Finish each message with 3 to 5 relevant hashtags.',
        'SMS': 'Format as a plain SMS. Very short, roughly 160 to 300 characters. No hashtags, no *bold*. State the greeting, offer and a short call to action. Do NOT use emoji in SMS even if emoji were requested.'
      };
      var emojiRule = v.emoji
        ? 'Emoji ARE wanted: use a few tasteful, festival-appropriate emoji (1 to 3 per message), never a wall of them. Do not put emoji in SMS output.'
        : 'Do NOT use any emoji at all. Keep the copy clean and text-only.';
      return [
        'You are an expert Indian small-business copywriter who writes festival promotional messages that local shops, clinics, salons, restaurants and service businesses actually send to their customers. You write in warm, natural Indian English, friendly and respectful, never corporate or robotic, never over-hyped.',
        'You understand Indian festivals and use the culturally correct greeting for each one (e.g. "Shubh Deepavali"/"Happy Diwali" for Diwali, "Eid Mubarak" for Eid, "Happy Holi" for Holi, "Ganpati Bappa Morya" for Ganesh Chaturthi, "Happy Navratri", "Happy Onam", "Happy Makar Sankranti"/"Happy Pongal", "Happy Raksha Bandhan", "Merry Christmas", "Happy New Year", and patriotic wishes for Independence/Republic Day). Match the mood of the festival.',
        'All prices are in Indian Rupees (₹). Never invent an offer, price, date or discount that the owner did not give you. If no validity date was given, imply gentle urgency ("this festive season", "limited period", "while stocks last") without fabricating a specific date.',
        '', emojiRule, '', (CHANNEL_GUIDE[v.channel] || CHANNEL_GUIDE.WhatsApp), '',
        'Each of the three messages MUST contain, woven together naturally: (1) a warm festival greeting, (2) the business name, (3) the offer stated clearly, (4) a sense of urgency, and (5) a clear call to action. Make the three genuinely different from each other in angle and wording.',
        '', 'OUTPUT FORMAT (strict): return ONLY the three messages, nothing else, no preamble, no titles, no "Message 1", no commentary. Separate the three messages with a line containing exactly three hash characters (###) on its own line.'
      ].join('\n');
    },
    user: function (v) {
      return [
        'Festival / occasion: ' + v.festival, 'Business name: ' + v.business,
        'Offer details (use exactly, do not change the numbers): ' + v.offer,
        'Sending channel: ' + v.channel, 'Emoji: ' + (v.emoji ? 'yes (respect the SMS exception)' : 'no'),
        '', 'Write the three festive promotional messages now.'
      ].join('\n');
    },
    parse: function (text) {
      if (!text) return [];
      function clean(p) {
        return (p || '')
          .replace(/^\s*#{2,}\s*$/gm, '')
          .replace(/^\s*(message|option|variation|version)\s*#?\s*\d+\s*[:.)-]?\s*/i, '')
          .replace(/^["'`\s]+|["'`\s]+$/g, '').trim();
      }
      var parts = text.split(/\n\s*#{2,}\s*\n/);
      if (parts.length < 2) parts = text.split(/\n\s*-{3,}\s*\n/);
      if (parts.length < 2) parts = text.split(/\n\s*={3,}\s*\n/);
      if (parts.length < 2) parts = text.split(/\n\s*\n\s*\n+/);
      return parts.map(clean).filter(function (p) { return p.length > 0; });
    },
    summary: function (v) { return 'Festival offer (' + v.festival + ', ' + v.channel + '): ' + trim60(v.offer); }
  };

  // ── 7. AI Blog Post Writer ────────────────────────────────────────────
  TYPES.blog = {
    label: 'Blog Post',
    badge: 'tool-badge-neutral',
    genLabel: 'Write the blog post',
    outTitle: 'Your blog post',
    multi: false,
    maxTokens: 1500,
    lengthMeta: { short: { words: 400, maxTokens: 900, heads: '3' }, medium: { words: 700, maxTokens: 1500, heads: '3 to 4' }, long: { words: 1200, maxTokens: 2500, heads: '4 to 5' } },
    fieldsHtml: function (p) {
      return (
        '<label>Topic or working title<input type="text" id="f-topic" placeholder="e.g. 5 signs it\'s time to replace your old wiring"></label>' +
        '<div class="tool-row tool-row-2">' +
          '<label>Your business / industry<input type="text" id="f-business" value="' + esc(p.name || '') + '" placeholder="e.g. Prasanna Electricals, Kolhapur"></label>' +
          '<label>Target keyword for SEO (optional)<input type="text" id="f-keyword" placeholder="e.g. electrician in Kolhapur"></label>' +
        '</div>' +
        '<div class="tool-row tool-row-2">' +
          '<label>Length<select id="f-length"><option value="short">Short, around 400 words</option><option value="medium" selected>Medium, around 700 words</option><option value="long">Long, around 1200 words</option></select></label>' +
          '<label>Tone<select id="f-tone"><option value="Professional" selected>Professional</option><option value="Friendly">Friendly</option><option value="Authoritative">Authoritative</option></select></label>' +
        '</div>'
      );
    },
    readValues: function () { return { topic: val('f-topic'), business: val('f-business'), keyword: val('f-keyword'), length: val('f-length'), tone: val('f-tone') }; },
    validate: function (v) { if (!v.topic) return 'Please enter a topic or working title for the post.'; return null; },
    maxTokensFor: function (v) { return (TYPES.blog.lengthMeta[v.length] || TYPES.blog.lengthMeta.medium).maxTokens; },
    system: function () {
      return [
        'You are a seasoned Indian small-business copywriter who ghost-writes blog posts for local businesses, dentists, retailers, manufacturers, electricians, consultants, salons, and the like, mostly in cities like Mumbai, Pune and Kolhapur.',
        '',
        'You write in clear, warm Indian English for an Indian audience. You understand the Indian context: rupee (₹) pricing, GST, monsoon and festival seasons, WhatsApp and Instagram as the main customer channels, and the trust-first, word-of-mouth way Indian customers decide who to buy from.',
        '',
        'How you write:',
        '- Open with a hook that names a real problem or moment the reader recognises, never "In today\'s fast-paced world" or any tired filler.',
        '- Keep sentences short and concrete. Prefer plain words over jargon. Use specific, believable examples over vague claims.',
        '- Be genuinely useful: give real tips, steps, numbers, and rules of thumb a reader could act on, not padding.',
        '- Sound like a knowledgeable local expert talking to a neighbour, not a marketing brochure. Never over-promise. Do not invent fake statistics, awards, or customer names.',
        '- Write for the business owner\'s own site, so it can be published as-is.',
        '',
        'Formatting rules (important, the output is copy-pasted straight into a blog editor):',
        '- First line: the post title only, with no "Title:" label and no quotation marks.',
        '- Then a short introductory paragraph (no heading).',
        '- Then the body as sections. Start each section heading on its own line, prefixed with "## " (markdown H2). Follow each heading with one or two solid paragraphs.',
        '- End with a short conclusion section and a clear, friendly call-to-action that invites the reader to WhatsApp, call, or visit the business.',
        '- Use plain readable text. No emojis. No hashtags. No markdown bold/italic markers, tables, or code blocks, only the "## " heading prefix.',
        '- Do not add any meta commentary before or after the post. Output only the blog post itself.'
      ].join('\n');
    },
    user: function (v) {
      var meta = TYPES.blog.lengthMeta[v.length] || TYPES.blog.lengthMeta.medium;
      var lines = ['Write a complete blog post.', '', 'Topic / working title: ' + v.topic, 'Business / industry: ' + (v.business || 'a small local business')];
      lines.push(v.keyword
        ? 'Target SEO keyword: "' + v.keyword + '"-weave it naturally into the title, the intro, and a couple of headings/paragraphs. Never keyword-stuff.'
        : 'No specific SEO keyword given, just write naturally around the topic.');
      lines.push('Tone: ' + v.tone + '.');
      lines.push('Target length: about ' + meta.words + ' words, with ' + meta.heads + ' "## " subheadings between the intro and the conclusion.');
      lines.push('', 'Remember: first line is the plain title, then intro, then the "## " sections, then a short conclusion with a call-to-action. No emojis, no meta commentary.');
      return lines.join('\n');
    },
    parse: function (text) { return (text || '').trim(); },
    summary: function (v) { return 'Blog post: ' + trim60(v.topic); }
  };

  // ── 8. About Us Page Writer ────────────────────────────────────────────
  TYPES.aboutus = {
    label: 'About Us',
    badge: 'tool-badge-accent',
    genLabel: 'Write my About Us',
    outTitle: 'Your About Us section',
    multi: false,
    maxTokens: 700,
    tones: {
      warm: 'Warm and personal, write like a real person talking to a neighbour. First person ("we"/"I") is welcome. Friendly, sincere, a little heart. Plain words over corporate ones.',
      professional: 'Professional and established, confident, credible, reassuring. Emphasise experience, reliability and quality of service. Polished but still human.',
      bold: 'Modern and bold, punchy, energetic, contemporary. Short confident sentences. A clear point of view. Fresh and forward-looking, but never gimmicky.'
    },
    fieldsHtml: function (p) {
      return (
        '<div class="tool-row tool-row-2">' +
          '<label>Business name<input type="text" id="f-name" value="' + esc(p.name || '') + '" placeholder="e.g. Sharma Dental Care" maxlength="120"></label>' +
          '<label>Year founded (optional)<input type="text" id="f-year" placeholder="e.g. 2012" maxlength="20"></label>' +
        '</div>' +
        '<label>What you do<input type="text" id="f-what" value="' + esc(p.does || '') + '" placeholder="e.g. Family dental clinic in Andheri, cleanings, braces, implants" maxlength="200"></label>' +
        '<label>What makes you different / your story<textarea id="f-story" rows="5" placeholder="Speak plainly. e.g. Started by Dr. Sharma after 10 years at a big hospital because he wanted to actually know his patients."></textarea></label>' +
        '<label>Tone<select id="f-tone"><option value="warm">Warm &amp; personal</option><option value="professional">Professional &amp; established</option><option value="bold">Modern &amp; bold</option></select></label>'
      );
    },
    readValues: function () { return { name: val('f-name'), year: val('f-year'), what: val('f-what'), story: val('f-story'), tone: val('f-tone') }; },
    validate: function (v) {
      if (!v.name) return 'Please enter your business name.';
      if (!v.what) return 'Please tell us what your business does.';
      if (!v.story || v.story.length < 15) return 'Add a sentence or two about what makes you different, that is what the writer builds the story from.';
      return null;
    },
    system: function (v) {
      var toneNote = TYPES.aboutus.tones[v.tone] || TYPES.aboutus.tones.warm;
      return [
        'You are a seasoned Indian small-business copywriter who has written "About Us" pages for hundreds of local businesses across India, dentists, retailers, manufacturers, salons, consultants, clinics, restaurants and family firms. You write in warm, natural Indian English for an Indian audience.',
        '',
        'Your job: turn the plain facts the owner gives you into a polished "About Us" section that reads like real, professional website copy, not a dry list of facts.',
        '',
        'HOW TO WRITE IT:',
        '- Open with a short, inviting HEADLINE on its own line (5 to 9 words). Not the business name alone, and not the words "About Us". Make it about the visitor or the promise.',
        '- Then 2 to 4 short paragraphs (2 to 4 sentences each). Tell a small story: who they are, why they started, what they believe, who they serve, and close with a warm, inviting line.',
        '- Build trust with concrete, specific details drawn ONLY from what the owner gave you. Weave the facts into sentences, never bullet-list them.',
        '',
        'HARD RULES:',
        '- Use ONLY the facts provided. Never invent awards, numbers, client counts, certifications, locations or claims that were not given.',
        '- Indian context throughout: Indian English spelling and phrasing, ₹ for any prices, references to WhatsApp/calling where it fits.',
        '- No emojis. No hashtags. No markdown, asterisks, headings or bullet points, plain paragraphs only, separated by blank lines, with the headline as the first line.',
        '- No hollow marketing filler ("we are passionate about excellence", "customer-centric solutions", "one-stop destination"). Every sentence must say something real about THIS business.',
        '- Keep the whole section tight: roughly 110 to 200 words.',
        '', 'TONE FOR THIS ONE: ' + toneNote, '',
        'Output only the finished About Us copy (headline first, then the paragraphs). No preamble, no notes, no quotation marks around it.'
      ].join('\n');
    },
    user: function (v) {
      var lines = ['Write the About Us section for this business.', '', 'Business name: ' + v.name, 'What they do: ' + v.what];
      if (v.year) lines.push('Year founded: ' + v.year);
      lines.push('', 'What makes them different / their story (in the owner\'s own words):', v.story);
      return lines.join('\n');
    },
    parse: function (text) { return (text || '').trim(); },
    summary: function (v) { return 'About Us: ' + trim60(v.name); }
  };

  var TYPE_ORDER = ['whatsapp', 'instagram', 'gmb', 'review', 'cold', 'festival', 'blog', 'aboutus'];

  // ═══════════════════════════════════════════════════════════════════════
  // small DOM/text helpers
  // ═══════════════════════════════════════════════════════════════════════
  function val(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; }
  function checked(id) { var el = document.getElementById(id); return !!(el && el.checked); }
  function trim60(s) { s = (s || '').trim(); return s.length > 70 ? s.slice(0, 70) + '…' : (s || '(not specified)'); }

  function copyText(btn, text) {
    if (!text) return;
    navigator.clipboard.writeText(text).then(function () {
      var prev = btn.textContent;
      btn.textContent = 'Copied ✓';
      btn.classList.add('ai-copied');
      setTimeout(function () { btn.textContent = prev; btn.classList.remove('ai-copied'); }, 1500);
    }).catch(function () {
      var prev = btn.textContent;
      btn.textContent = 'Press Ctrl+C';
      setTimeout(function () { btn.textContent = prev; }, 1500);
    });
  }

  function waSend(text) {
    if (!text) return;
    var t = text.length > 1800 ? text.slice(0, 1800) + '…' : text;
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
  }

  // ═══════════════════════════════════════════════════════════════════════
  // library storage
  // ═══════════════════════════════════════════════════════════════════════
  function loadLibrary() { return TS.loadJSON(LIB_KEY, []); }
  function saveLibrary(arr) { TS.saveJSON(LIB_KEY, arr); }

  function addToLibrary(type, inputSummary, output) {
    var all = loadLibrary();
    all.push({ id: TS.uid(), type: type, inputSummary: inputSummary, output: output, createdAt: Date.now() });
    saveLibrary(all);
    return all;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // top-level Generate / Library tabs
  // ═══════════════════════════════════════════════════════════════════════
  document.querySelectorAll('.mkt-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.mkt-tab').forEach(function (b) { b.classList.toggle('active', b === btn); });
      document.getElementById('tab-generate').hidden = btn.dataset.tab !== 'generate';
      document.getElementById('tab-library').hidden = btn.dataset.tab !== 'library';
      if (btn.dataset.tab === 'library') renderLibrary();
    });
  });

  // ═══════════════════════════════════════════════════════════════════════
  // Generate tab: type selector + dynamic fields + generate flow
  // ═══════════════════════════════════════════════════════════════════════
  var currentType = 'whatsapp';
  var lastFull = '';
  var isGenerating = false;

  var els = {
    typeTabs: document.getElementById('type-tabs'),
    fieldsTitle: document.getElementById('fields-title'),
    fields: document.getElementById('mkt-fields'),
    genBtn: document.getElementById('generate-btn'),
    hint: document.getElementById('ai-hint'),
    error: document.getElementById('ai-error'),
    outputHead: document.getElementById('output-head'),
    outputHeadTitle: document.getElementById('output-head-title'),
    copyAllBtn: document.getElementById('copy-all-btn'),
    regenBtn: document.getElementById('regen-btn'),
    streamBox: document.getElementById('stream-box'),
    outputContainer: document.getElementById('output-container'),
    savedNote: document.getElementById('saved-note')
  };

  function renderTypeTabs() {
    els.typeTabs.innerHTML = TYPE_ORDER.map(function (key) {
      return '<button type="button" class="mkt-type-tab' + (key === currentType ? ' active' : '') + '" data-type="' + key + '">' + esc(TYPES[key].label) + '</button>';
    }).join('');
    Array.prototype.forEach.call(els.typeTabs.querySelectorAll('.mkt-type-tab'), function (btn) {
      btn.addEventListener('click', function () { switchType(btn.dataset.type); });
    });
  }

  function switchType(type) {
    if (isGenerating) return;
    currentType = type;
    Array.prototype.forEach.call(els.typeTabs.querySelectorAll('.mkt-type-tab'), function (b) {
      b.classList.toggle('active', b.dataset.type === type);
    });
    var def = TYPES[type];
    els.fieldsTitle.textContent = 'Write a ' + def.label.toLowerCase();
    els.fields.innerHTML = def.fieldsHtml(profile());
    if (typeof def.afterRender === 'function') def.afterRender();
    els.genBtn.textContent = def.genLabel;
    els.outputHeadTitle.textContent = def.outTitle;
    els.copyAllBtn.hidden = !def.multi;
    els.error.textContent = '';
    els.outputHead.style.display = 'none';
    els.streamBox.hidden = true;
    els.streamBox.textContent = '';
    els.outputContainer.innerHTML = '';
    els.savedNote.hidden = true;
    updateGenerateEnabled();
  }

  function updateGenerateEnabled() {
    if (isGenerating) return;
    var ready = AI.hasKey();
    els.genBtn.disabled = !ready;
    els.hint.style.display = ready ? 'none' : 'block';
  }

  AI.mountSettings(document.getElementById('ai-settings-mount'), updateGenerateEnabled);

  function setLoading(on) {
    isGenerating = on;
    if (on) {
      els.genBtn.disabled = true;
      els.genBtn.innerHTML = '<span class="ai-spinner"></span>Generating…';
      els.regenBtn.disabled = true;
    } else {
      els.genBtn.textContent = TYPES[currentType].genLabel;
      els.regenBtn.disabled = false;
      updateGenerateEnabled();
    }
  }

  function renderVariant(text, index) {
    var wrap = document.createElement('div');
    wrap.className = 'ai-output ai-variation';

    var head = document.createElement('div');
    head.className = 'ai-output-head';
    head.style.marginTop = '0';
    head.innerHTML = '<h3 style="font-size:calc(13px * var(--font-scale));color:var(--text-mid);">Option ' + (index + 1) + '</h3>';

    var body = document.createElement('div');
    body.style.whiteSpace = 'pre-wrap';
    body.textContent = text;

    var actions = document.createElement('div');
    actions.className = 'mkt-variant-actions';
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button'; copyBtn.className = 'ai-copy-btn'; copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', function () { copyText(copyBtn, text); });
    var waBtn = document.createElement('button');
    waBtn.type = 'button'; waBtn.className = 'mkt-wa-btn'; waBtn.textContent = 'Send on WhatsApp';
    waBtn.addEventListener('click', function () { waSend(text); });
    actions.appendChild(copyBtn); actions.appendChild(waBtn);

    wrap.appendChild(head); wrap.appendChild(body); wrap.appendChild(actions);
    return wrap;
  }

  function renderSingle(text) {
    var wrap = document.createElement('div');
    wrap.className = 'ai-output ai-variation';
    var body = document.createElement('div');
    body.style.whiteSpace = 'pre-wrap';
    body.textContent = text;
    var actions = document.createElement('div');
    actions.className = 'mkt-variant-actions';
    var copyBtn = document.createElement('button');
    copyBtn.type = 'button'; copyBtn.className = 'ai-copy-btn'; copyBtn.textContent = 'Copy';
    copyBtn.addEventListener('click', function () { copyText(copyBtn, text); });
    var waBtn = document.createElement('button');
    waBtn.type = 'button'; waBtn.className = 'mkt-wa-btn'; waBtn.textContent = 'Send on WhatsApp';
    waBtn.addEventListener('click', function () { waSend(text); });
    actions.appendChild(copyBtn); actions.appendChild(waBtn);
    wrap.appendChild(body); wrap.appendChild(actions);
    return wrap;
  }

  function renderFinalOutput(parsed, def) {
    els.outputContainer.innerHTML = '';
    if (def.multi) {
      var arr = Array.isArray(parsed) ? parsed : [parsed].filter(Boolean);
      if (!arr.length) { els.outputContainer.innerHTML = '<div class="tool-empty">No usable output came back. Try Regenerate.</div>'; return; }
      arr.forEach(function (text, i) { els.outputContainer.appendChild(renderVariant(text, i)); });
    } else {
      if (!parsed) { els.outputContainer.innerHTML = '<div class="tool-empty">The AI returned an empty response. Try Regenerate.</div>'; return; }
      els.outputContainer.appendChild(renderSingle(parsed));
    }
  }

  function generate(temperature) {
    var def = TYPES[currentType];
    els.error.textContent = '';
    els.savedNote.hidden = true;

    if (!AI.hasKey()) { els.error.textContent = 'Add your OpenRouter API key in AI settings first.'; return; }

    var v = def.readValues();
    var problem = def.validate(v);
    if (problem) { els.error.textContent = problem; return; }

    els.outputHead.style.display = 'flex';
    els.outputContainer.innerHTML = '';
    els.streamBox.hidden = false;
    els.streamBox.textContent = '';
    setLoading(true);

    var maxTokens = (typeof def.maxTokensFor === 'function') ? def.maxTokensFor(v) : def.maxTokens;

    AI.generate({
      system: def.system(v),
      user: def.user(v),
      temperature: temperature,
      maxTokens: maxTokens,
      onToken: function (chunk, full) { lastFull = full; els.streamBox.textContent = full; }
    }).then(function (full) {
      lastFull = full || lastFull;
      var parsed = def.parse(lastFull);
      els.streamBox.hidden = true;
      renderFinalOutput(parsed, def);
      setLoading(false);

      var hasOutput = def.multi ? (Array.isArray(parsed) && parsed.length) : !!parsed;
      if (hasOutput) {
        addToLibrary(currentType, def.summary(v), parsed);
        els.savedNote.hidden = false;
        renderStats();
      }
    }).catch(function (err) {
      setLoading(false);
      els.streamBox.hidden = true;
      els.outputHead.style.display = 'none';
      els.error.textContent = (err && err.message) ? err.message : 'Something went wrong. Try again.';
    });
  }

  els.genBtn.addEventListener('click', function () { generate(0.8); });
  els.regenBtn.addEventListener('click', function () { generate(0.9); });
  els.copyAllBtn.addEventListener('click', function () {
    var def = TYPES[currentType];
    var parsed = def.parse(lastFull);
    var arr = Array.isArray(parsed) ? parsed : [parsed].filter(Boolean);
    if (!arr.length) return;
    var joined = arr.map(function (p, i) { return 'Option ' + (i + 1) + ':\n' + p; }).join('\n\n---\n\n');
    copyText(els.copyAllBtn, joined);
  });

  // ═══════════════════════════════════════════════════════════════════════
  // Library tab
  // ═══════════════════════════════════════════════════════════════════════
  var libFilter = document.getElementById('lib-filter');
  libFilter.innerHTML = '<option value="">All types</option>' + TYPE_ORDER.map(function (k) {
    return '<option value="' + k + '">' + esc(TYPES[k].label) + '</option>';
  }).join('');
  libFilter.addEventListener('change', renderLibrary);

  function entryFullText(entry) {
    if (Array.isArray(entry.output)) {
      return entry.output.map(function (p, i) { return 'Option ' + (i + 1) + ':\n' + p; }).join('\n\n---\n\n');
    }
    return entry.output || '';
  }
  function entryPreviewText(entry) {
    return Array.isArray(entry.output) ? (entry.output[0] || '') : (entry.output || '');
  }
  function formatWhen(ts) {
    var d = new Date(ts);
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }

  function renderLibrary() {
    var all = loadLibrary().slice().sort(function (a, b) { return b.createdAt - a.createdAt; });
    var filterType = libFilter.value;
    var items = filterType ? all.filter(function (e) { return e.type === filterType; }) : all;

    document.getElementById('lib-count').textContent = items.length + ' saved';
    document.getElementById('lib-empty').hidden = all.length > 0;

    var list = document.getElementById('lib-list');
    list.innerHTML = '';
    items.forEach(function (entry) {
      var def = TYPES[entry.type] || { label: entry.type, badge: 'tool-badge-neutral' };
      var card = document.createElement('div');
      card.className = 'mkt-lib-card';
      card.dataset.id = entry.id;

      var preview = entryPreviewText(entry);
      var multiNote = Array.isArray(entry.output) && entry.output.length > 1 ? ' (' + entry.output.length + ' options)' : '';

      card.innerHTML =
        '<div class="mkt-lib-head">' +
          '<div class="mkt-lib-meta"><span class="tool-badge ' + def.badge + '">' + esc(def.label) + '</span><span class="mkt-lib-date">' + formatWhen(entry.createdAt) + '</span></div>' +
          '<div class="mkt-lib-actions">' +
            '<button type="button" class="mkt-lib-expand" data-act="expand">Expand</button>' +
            '<button type="button" class="ai-copy-btn" data-act="copy">Copy</button>' +
            '<button type="button" class="mkt-wa-btn" data-act="wa">Send on WhatsApp</button>' +
            '<button type="button" class="mkt-lib-delete" data-act="delete">Delete</button>' +
          '</div>' +
        '</div>' +
        '<div class="mkt-lib-summary">' + esc(entry.inputSummary || '') + multiNote + '</div>' +
        '<div class="mkt-lib-preview" data-act="preview">' + esc(preview) + '</div>';

      var previewEl = card.querySelector('[data-act="preview"]');
      var expandBtn = card.querySelector('[data-act="expand"]');
      expandBtn.addEventListener('click', function () {
        var expanded = previewEl.classList.toggle('expanded');
        previewEl.textContent = expanded ? entryFullText(entry) : preview;
        expandBtn.textContent = expanded ? 'Collapse' : 'Expand';
      });
      card.querySelector('[data-act="copy"]').addEventListener('click', function () { copyText(this, entryFullText(entry)); });
      card.querySelector('[data-act="wa"]').addEventListener('click', function () { waSend(entryFullText(entry)); });
      card.querySelector('[data-act="delete"]').addEventListener('click', function () {
        var remaining = loadLibrary().filter(function (e) { return e.id !== entry.id; });
        saveLibrary(remaining);
        renderLibrary();
        renderStats();
      });

      list.appendChild(card);
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // dashboard stats
  // ═══════════════════════════════════════════════════════════════════════
  function renderStats() {
    var all = loadLibrary();
    var weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    var thisWeek = all.filter(function (e) { return e.createdAt >= weekAgo; }).length;

    var counts = {};
    all.forEach(function (e) { counts[e.type] = (counts[e.type] || 0) + 1; });
    var mostUsed = '—';
    var best = 0;
    Object.keys(counts).forEach(function (k) {
      if (counts[k] > best) { best = counts[k]; mostUsed = (TYPES[k] && TYPES[k].label) || k; }
    });

    document.getElementById('mkt-stats').innerHTML =
      '<div class="tool-stat-card"><div class="tool-stat-label">Total Pieces</div><div class="tool-stat-value">' + all.length + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">This Week</div><div class="tool-stat-value">' + thisWeek + '</div></div>' +
      '<div class="tool-stat-card"><div class="tool-stat-label">Most-Used Type</div><div class="tool-stat-value" style="font-size:calc(18px * var(--font-scale));">' + esc(mostUsed) + '</div></div>';
  }

  // ═══════════════════════════════════════════════════════════════════════
  // init
  // ═══════════════════════════════════════════════════════════════════════
  document.getElementById('hdr-biz').textContent = (profile().name || user.name) + ' · ' + user.email;
  renderTypeTabs();
  switchType(currentType);
  renderStats();
})();
