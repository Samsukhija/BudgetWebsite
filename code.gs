// ─────────────────────────────────────────────────────────────
//  BUDGET WEBSITE BACKEND — Google Apps Script
//  Handles: custom quote requests, website briefs.
//  Deploy as Web App: Execute as "Me", Access "Anyone".
// ─────────────────────────────────────────────────────────────

const SHEET_ID   = '1pP_aOYntmXLzOHDUes53puytNQrnv03C5O7H0-1YkhE';
const NOTIFY_EMAIL = 'budgetwebsitein@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss   = SpreadsheetApp.openById(SHEET_ID);

    // ── WEBSITE BRIEF ──
    if (data.form === 'brief') {
      let briefs = ss.getSheetByName('Briefs');
      if (!briefs) {
        briefs = ss.insertSheet('Briefs');
        briefs.appendRow(['Timestamp', 'Name / WA', 'Business', 'What they do', 'Services', 'Logo', 'Photos', 'Photos link', 'Testimonial', 'Domain', 'Customer', 'Inspiration']);
      }
      briefs.appendRow([
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        data.name       || '',
        data.biz        || '',
        data.what       || '',
        data.services   || '',
        data.logo       || '',
        data.photos     || '',
        data.photosLink || '',
        data.review     || '',
        data.domain     || '',
        data.customer   || '',
        data.inspo      || ''
      ]);

      try {
        MailApp.sendEmail({
          to: NOTIFY_EMAIL,
          subject: `📋 New website brief — ${data.biz || 'Unknown'}`,
          body: [
            `New website brief submitted.`,
            ``,
            `Name / WA    : ${data.name       || '—'}`,
            `Business     : ${data.biz        || '—'}`,
            `What they do : ${data.what       || '—'}`,
            `Services     : ${data.services   || '—'}`,
            `Logo         : ${data.logo       || '—'}`,
            `Photos       : ${data.photos     || '—'} ${data.photosLink || ''}`,
            `Testimonial  : ${data.review     || '—'}`,
            `Domain       : ${data.domain     || '—'}`,
            `Customer     : ${data.customer   || '—'}`,
            `Inspiration  : ${data.inspo      || '—'}`,
            ``,
            `Check the Briefs tab in your Google Sheet.`
          ].join('\n')
        });
      } catch (_) {}

      return json({ success: true });
    }

    // ── CUSTOM QUOTE REQUEST ──
    if (data.form === 'quote') {
      let quotes = ss.getSheetByName('Quotes');
      if (!quotes) {
        quotes = ss.insertSheet('Quotes');
        quotes.appendRow(['Timestamp', 'Name', 'WhatsApp', 'Business', 'Requirement']);
      }
      quotes.appendRow([
        new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        data.name || '',
        data.phone || '',
        data.biz  || '',
        data.req  || ''
      ]);

      try {
        MailApp.sendEmail({
          to: NOTIFY_EMAIL,
          subject: `💬 New custom quote request — ${data.biz || data.name || 'Unknown'}`,
          body: [
            `New custom quote request submitted.`,
            ``,
            `Name       : ${data.name  || '—'}`,
            `WhatsApp   : ${data.phone || '—'}`,
            `Business   : ${data.biz   || '—'}`,
            `Requirement: ${data.req   || '—'}`,
            ``,
            `Check the Quotes tab in your Google Sheet.`
          ].join('\n')
        });
      } catch (_) {}

      return json({ success: true });
    }

    return json({ success: false, error: 'Unknown form type' });
  } catch (err) {
    return json({ success: false, error: err.message });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
