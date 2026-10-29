// tasteskill / base.js — the small amount of script the motion helpers in base.css need.
// Put this line in <head> so the hidden states only apply when scripting works:
//   <script>document.documentElement.classList.add('js')</script>
// Then load this file at the end of <body> (or with defer).

// Reveal once when an element enters the viewport. Never replays, never leaves content hidden.
(() => {
  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) { targets.forEach((el) => el.classList.add('is-in')); return; }
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      io.unobserve(el);
      // a picture is only uncovered once it can be drawn (or after 250ms, whichever comes first)
      const img = el.querySelector('img');
      const ready = img && !img.complete
        ? Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 250))])
        : Promise.resolve();
      ready.then(() => {
        el.classList.add('is-in');
        // once the entrance has played, hover and focus get their own short timing
        setTimeout(() => el.classList.add('is-settled'), 1200);
      });
    }
  }, { rootMargin: '0px 0px -4% 0px', threshold: 0.05 });
  targets.forEach((el) => io.observe(el));
  // safety net: if anything is still hidden a few seconds after load (observer never fired), show it
  window.addEventListener('load', () => setTimeout(() => {
    targets.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('is-in'); });
  }, 2500));
})();

// Optional, for "colour by chapter": each chapter paints its own full-bleed ground in CSS
// (style="background: var(--field-2); color: var(--field-2-ink)"), so the colour changes exactly at
// section edges. This only lets a fixed header take the ink of the chapter under it. Give each chapter
// data-ink="#hex" and style the header with color: var(--header-ink, var(--ink)).
// Never recolour the whole page from an observer: mid-change, a paragraph sits on two colours.
(() => {
  const chapters = document.querySelectorAll('[data-ink]');
  if (!chapters.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) if (entry.isIntersecting) document.documentElement.style.setProperty('--header-ink', entry.target.dataset.ink);
  }, { rootMargin: '0px 0px -92% 0px', threshold: 0 });
  chapters.forEach((el) => io.observe(el));
})();
