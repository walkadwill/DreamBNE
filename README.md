# Event sign-up form

A single-page, mobile-first form for capturing **first name, last name and email** from people at an event. Attendees scan a QR code, fill in the form on their phone, and submit.

## Files

- `index.html` – the whole front end (no build step, no dependencies).
- `apps-script/Code.gs` – optional free backend that writes submissions to a Google Sheet.

## Quick start

1. **Try it locally:** open `index.html` in a browser. With `SUBMIT_URL` empty it runs in demo mode and only saves entries in that browser's `localStorage`.
2. **Connect a backend:** follow the steps at the top of `apps-script/Code.gs`, then paste the web app URL into `SUBMIT_URL` near the bottom of `index.html`. Any endpoint that accepts a JSON `POST` body works (e.g. your own API).
3. **Host it:** publish the repo with GitHub Pages (Settings → Pages → deploy from branch), Netlify, or any static host. It must be served over HTTPS.
4. **Make the QR code:** generate a QR code for the hosted URL with any QR generator and print it.

## Per-event QR codes

Add URL parameters so one page can serve several events or stands:

```
https://your-site/index.html?event=launch-night&title=Welcome%20to%20Launch%20Night
```

| Param      | Effect                                           |
|------------|--------------------------------------------------|
| `event`    | Saved with each submission (column "Event")      |
| `title`    | Replaces the page heading                        |
| `subtitle` | Replaces the text under the heading              |

## Submitted data

```json
{ "firstName": "Ada", "lastName": "Lovelace", "email": "ada@example.com",
  "event": "launch-night", "submittedAt": "2026-11-11T09:30:00.000Z" }
```

Includes client-side validation, a hidden honeypot field to deter spam bots, and a "Register someone else" button so it also works on a shared tablet at a kiosk.
