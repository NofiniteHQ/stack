/**
 * Anti-FOUC (Flash of Unstyled Content) Script for NUI CSS
 * 
 * Inject this string into a <script> tag in the <head> of your HTML
 * to perfectly synchronize the document's dark mode state before the body paints.
 */
export const DARK_MODE_SCRIPT = `
!(function () {
  try {
    var saved = localStorage.getItem('theme');
    var isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`.trim();
