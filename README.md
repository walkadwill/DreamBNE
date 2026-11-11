# Event prize draw

Staff walk around with a QR code on their phones. Guests scan it, enter their **first name, last name and email**, and get a **unique entry number**. At draw time, staff open the draw page and randomly pick **3 winning numbers**.

## Pages

| File | Who uses it | What it does |
|------|-------------|--------------|
| `qr.html` | Staff | Full-screen QR code pointing at the entry form. Keeps the screen awake. |
| `index.html` | Guests | Entry form. Shows the guest's entry number (e.g. **#42**) after they submit. |
| `draw.html` | Staff | Enter the admin key, load entries, and draw 3 winners with a short reveal. |
| `config.js` | Setup | Backend URL, number of winners, logo and brand colour. |
| `assets/logo.png` | Setup | Your logo (add this file). |
| `apps-script/Code.gs` | Setup | Free backend that stores entries in a Google Sheet. |

## How entries work

- Entry numbers are sequential (#1, #2, #3…), assigned by the backend so two staff phones never hand out the same number.
- **One entry per email.** If someone submits again with the same email, they're shown their original number and no new entry is added.
- Everything lands in a Google Sheet: `Entry #, Submitted At, First Name, Last Name, Email, Event`.
- The draw uses the browser's cryptographic random number generator and never picks the same entrant twice. "Draw again" re-draws if a winner isn't present.

## Setup (about 10 minutes)

1. **Google Sheet backend**
   1. Create a new Google Sheet, then Extensions → Apps Script. Replace the code with `apps-script/Code.gs`.
   2. Project Settings (gear icon) → Script properties → add `ADMIN_KEY` = a password of your choice.
   3. Deploy → New deployment → type **Web app**, Execute as **Me**, Who has access **Anyone**. Authorize it.
   4. Copy the web app URL into `SUBMIT_URL` in `config.js`.
2. **Add the logo:** save the Qualitia logo as `assets/logo.png` (or change `BRAND.LOGO` in `config.js` to point at an `.svg`). Optionally set `BRAND.COLOR` to the brand colour for the buttons. Until a logo file exists, pages simply show no logo.
3. **Host on GitHub Pages:**
   1. GitHub Pages on a **private** repo needs a paid plan (GitHub Pro/Team). On a free account, make the repo public first (Settings → General → Danger Zone → Change visibility). The published site is public either way; entries stay private in your Google Sheet.
   2. Settings → Pages → Build and deployment → Source: **Deploy from a branch** → pick the branch and `/ (root)` → Save.
   3. After a minute or two the site is live at `https://walkadwill.github.io/DreamBNE/`.
4. **On the day**
   - You and your colleague open `https://walkadwill.github.io/DreamBNE/qr.html` on your phones and show the code.
   - At draw time, open `https://walkadwill.github.io/DreamBNE/draw.html`, enter the admin key, tap **Load entries**, then **Draw 3 winners**.

## Options

- Tag entries by event or by staff member, e.g. `qr.html?event=launch-night`. The tag is passed through to the form and saved with each entry. The draw page can filter by it.
- Change the form heading: `qr.html?event=launch-night&title=Win%20a%20prize!`
- Change the number of winners: `WINNERS` in `config.js`.

## Demo mode

With `SUBMIT_URL` empty, everything runs in one browser using `localStorage`: open `index.html` a few times to add entries, then `draw.html` in the same browser to test the draw. Serve the folder (e.g. `python3 -m http.server`) rather than opening files directly.

## Notes

- `vendor/qrcode-generator.js` is the MIT-licensed QR library by Kazuhiko Arase, bundled so the QR page works without a CDN.
- You're collecting personal data: consider adding a line to the form about how you'll use it (e.g. "We'll only email you if you win") to suit your local privacy rules.
