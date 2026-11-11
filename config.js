// Shared settings for index.html (sign-up), qr.html (staff QR screen) and draw.html (prize draw).
window.APP_CONFIG = {
  // URL of the deployed Google Apps Script web app (see apps-script/Code.gs).
  // Leave empty for demo mode: entries are kept in this browser only, so the
  // sign-up and draw pages must be opened on the same device to test.
  SUBMIT_URL: "",

  // How many winners to draw.
  WINNERS: 3,
};
