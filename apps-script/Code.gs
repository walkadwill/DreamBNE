/**
 * Google Apps Script backend: appends each form submission to a Google Sheet.
 *
 * Setup:
 *   1. Create a Google Sheet. Extensions > Apps Script. Paste this file in.
 *   2. Deploy > New deployment > type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *   3. Copy the web app URL into SUBMIT_URL in index.html.
 */
const SHEET_NAME = 'Signups';
const HEADERS = ['Submitted At', 'First Name', 'Last Name', 'Email', 'Event'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

    const clean = (v) => {
      const s = String(v || '').trim().slice(0, 254);
      // Prevent spreadsheet formula injection.
      return /^[=+\-@]/.test(s) ? "'" + s : s;
    };

    sheet.appendRow([
      new Date(),
      clean(data.firstName),
      clean(data.lastName),
      clean(data.email),
      clean(data.event),
    ]);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
