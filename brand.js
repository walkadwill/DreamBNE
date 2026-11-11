// Applies the BRAND settings from config.js: shows the logo and sets the button colour.
(function () {
  const brand = (window.APP_CONFIG || {}).BRAND || {};
  document.querySelectorAll("img.logo").forEach((img) => {
    if (!brand.LOGO) { img.remove(); return; }
    img.alt = brand.NAME || "";
    img.addEventListener("error", () => img.remove()); // no logo file yet: just hide it
    img.src = brand.LOGO;
  });
  if (brand.COLOR) {
    const root = document.documentElement.style;
    root.setProperty("--accent", brand.COLOR);
    root.setProperty("--accent-text", "#ffffff");
  }
})();
