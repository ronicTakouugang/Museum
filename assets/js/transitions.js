// The Museum of Lost Futures — navigation between pages.
// Loaded in <head> without defer: pagereveal must be heard before the first frame.
// Opening an exhibition from the catalogue morphs its name into the exhibition's title.
// Every other navigation keeps the plain cross-fade set in style.css.
(() => {
  const html = document.documentElement;
  if ('startViewTransition' in document) html.classList.add('has-vt');
  const KEY = 'museum:title-morph';

  // the old page: name only the link that was followed, so one title morphs and nothing else
  document.addEventListener('click', (e) => {
    const link = e.target.closest && e.target.closest('a[href^="exhibition-0"]');
    if (!link) return;
    const n = link.getAttribute('href').match(/exhibition-0(\d)/)[1];
    const title = link.querySelector('.catalogue__name, .band__title');
    if (!title) return;
    title.style.viewTransitionName = `ex-title-${n}`;
    try { sessionStorage.setItem(KEY, `ex-title-${n}`); } catch {}
  });

  // back/forward cache: a page restored with a name still set would block the next morph
  window.addEventListener('pageshow', () => {
    document.querySelectorAll('.catalogue__name, .band__title').forEach((el) => { el.style.viewTransitionName = ''; });
  });

  // the new page: when its title arrives by morph, the morph is the entrance, so the line reveal stands down
  window.addEventListener('pagereveal', (e) => {
    let expected = null;
    try { expected = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch {}
    if (!e.viewTransition || !expected) return;
    const title = document.querySelector('.ex-hero__title');
    if (title && title.style.viewTransitionName === expected) html.classList.add('vt-arrival');
  });
})();
