// ---------------------------------------------------------------------------
// Theme (dark / light). Runs synchronously in <head>, so data-theme is set
// before the first paint and there is no flash. Saved choice wins, otherwise
// the system setting; dark if unknown.
// ---------------------------------------------------------------------------
(function () {
  var root = document.documentElement;
  var saved = null;
  try {
    saved = localStorage.getItem('theme');
  } catch (e) {}

  var theme = 'dark';
  if (saved === 'light' || saved === 'dark') {
    theme = saved;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    theme = 'light';
  }
  root.setAttribute('data-theme', theme);

  function labelFor(t) {
    return t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('theme-toggle');
    if (!button) return;

    button.setAttribute('aria-label', labelFor(root.getAttribute('data-theme')));
    button.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      button.setAttribute('aria-label', labelFor(next));
      try {
        localStorage.setItem('theme', next);
      } catch (e) {}
    });
  });
})();

// ---------------------------------------------------------------------------
// Tailwind (CDN) config. Colors read CSS variables defined in style.css, so
// switching data-theme re-colors the whole site.
// ---------------------------------------------------------------------------
tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        textMain: 'rgb(var(--color-textMain) / <alpha-value>)',
        textMuted: 'rgb(var(--color-textMuted) / <alpha-value>)',
        tagBg: 'rgb(var(--color-tagBg) / <alpha-value>)',
        tagText: 'rgb(var(--color-tagText) / <alpha-value>)',
        strong: 'rgb(var(--color-strong) / <alpha-value>)'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    }
  }
}