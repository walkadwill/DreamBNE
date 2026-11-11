/**
 * Google Apps Script backend for the event prize draw.
 *
 *  - POST (from index.html): saves an entrant and returns their entry number.
 *    One entry per email address: a repeat sign-up gets back their original number.
 *  - GET ?key=ADMIN_KEY (from draw.html): returns all entries for the draw.
 *
 * Setup:
 *   1. Create a Google Sheet. Extensions > Apps Script. Paste this file in.
 *   2. Project Settings (gear) > Script properties > add ADMIN_KEY with a
 *      password of your choice. Staff type this into draw.html.
 *   3. Deploy > New deployment > type "Web app".
 *        Execute as: Me
 *        Who has access: Anyone
 *   4. Copy the web app URL into SUBMIT_URL in config.js.
 *   (After editing this code later: Deploy > Manage deployments > edit > New version.)
 */
const SHEET_NAME = 'Entries';
const HEADERS = ['Entry #', 'Submitted At', 'First Name', 'Last Name', 'Email', 'Event'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function readRows_(sheet) {
  const n = sheet.getLastRow() - 1;
  return n > 0 ? sheet.getRange(2, 1, n, HEADERS.length).getValues() : [];
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const data = JSON.parse(e.postData.contents);
    const clean = (v, max) => {
      const s = String(v || '').trim().slice(0, max);
      return /^[=+\-@]/.test(s) ? "'" + s : s; // block spreadsheet formula injection
    };
    const first = clean(data.firstName, 100);
    const last = clean(data.lastName, 100);
    const email = clean(data.email, 254).toLowerCase();
    const event = clean(data.event, 100);
    if (!first || !last || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return json_({ ok: false, error: 'Missing or invalid fields' });
    }

    const sheet = getSheet_();
    const rows = readRows_(sheet);

    const existing = rows.find((r) => String(r[4]).toLowerCase() === email);
    if (existing) return json_({ ok: true, entryNumber: existing[0], duplicate: true });

    const next = rows.reduce((max, r) => Math.max(max, Number(r[0]) || 0), 0) + 1;
    sheet.appendRow([next, new Date(), first, last, email, event]);
    return json_({ ok: true, entryNumber: next });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const key = PropertiesService.getScriptProperties().getProperty('ADMIN_KEY');
  if (!key || e.parameter.key !== key) return json_({ ok: false, error: 'Unauthorized' });

  const entries = readRows_(getSheet_()).map((r) => ({
    entryNumber: r[0],
    submittedAt: r[1],
    firstName: r[2],
    lastName: r[3],
    email: r[4],
    event: r[5],
  }));
  return json_({ ok: true, entries });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
