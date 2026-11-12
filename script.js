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
// Mobile menu (hamburger). On small screens the nav is a dropdown opened by
// #menu-toggle; from the md breakpoint up the nav is always visible.
// ---------------------------------------------------------------------------
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('menu-toggle');
    var nav = document.getElementById('site-nav');
    if (!button || !nav) return;

    function isOpen() {
      return button.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(open) {
      button.setAttribute('aria-expanded', open ? 'true' : 'false');
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('hidden', !open); // from md up, md:block keeps it visible anyway
    }

    button.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    // Close after choosing a link, when tapping outside, or on Escape
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', function (e) {
      if (isOpen() && !nav.contains(e.target) && !button.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) {
        setOpen(false);
        button.focus();
      }
    });

    // Reset when the window crosses the breakpoint (e.g. rotating a tablet)
    var desktop = window.matchMedia('(min-width: 768px)');
    var reset = function () {
      setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener('change', reset);
    else desktop.addListener(reset);
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