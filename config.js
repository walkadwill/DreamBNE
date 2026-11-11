// Shared settings for index.html (entry form), qr.html (staff QR screen) and draw.html (prize draw).
window.APP_CONFIG = {
  // URL of the deployed Google Apps Script web app (see apps-script/Code.gs).
  // Leave empty for demo mode: entries are kept in this browser only, so the
  // entry and draw pages must be opened on the same device to test.
  SUBMIT_URL: "",

  // How many winners to draw.
  WINNERS: 3,

  // Branding shown at the top of every page.
  BRAND: {
    NAME: "Qualitia",
    LOGO: "assets/logo.png",   // put the logo file here (PNG or SVG; wide logos look best)
    COLOR: "",                 // optional brand colour for buttons, e.g. "#e4002b"
  },
};
