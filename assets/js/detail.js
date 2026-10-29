// The Museum of Lost Futures — the archive detail view.
// Any archive figure in an exhibition opens to the whole screen and closes back into its place.
// The plate morphs between the two positions with a view transition; without one (or with
// reduced motion) the dialog simply opens. A native <dialog> keeps focus inside while open
// and hands it back to the figure on close.
(() => {
  const plates = document.querySelectorAll('.chapter figure .chapter__figure');
  if (!plates.length) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const html = document.documentElement;

  const dialog = document.createElement('dialog');
  dialog.className = 'detail';
  dialog.setAttribute('aria-labelledby', 'detail-caption');
  dialog.innerHTML = '<figure class="detail__figure"><div class="detail__plate plate"><img class="cover" alt=""></div><figcaption class="detail__caption" id="detail-caption"></figcaption></figure><button class="detail__close link" type="button">Close</button>';
  document.body.append(dialog);
  const dPlate = dialog.querySelector('.detail__plate');
  const dImg = dPlate.querySelector('img');
  const dCaption = dialog.querySelector('.detail__caption');

  let source = null;
  let running = null;

  // one view transition at a time; a new one cuts the previous short instead of queueing behind it
  const swap = (update, mode) => {
    if (!document.startViewTransition || reduce.matches) { update(); return Promise.resolve(); }
    if (running) running.skipTransition();
    html.dataset.detail = mode;
    const t = document.startViewTransition(update);
    running = t;
    return t.finished.finally(() => {
      if (running === t) { running = null; delete html.dataset.detail; }
    });
  };

  const open = (plate) => {
    const img = plate.querySelector('img');
    const w = img.naturalWidth || Number(img.getAttribute('width'));
    const h = img.naturalHeight || Number(img.getAttribute('height'));
    source = plate;
    dImg.src = img.currentSrc || img.src;
    dImg.alt = img.alt;
    dPlate.style.setProperty('--ratio', w / h);
    // the enlarged view keeps the page's crop rules: margins trimmed, studio white turned to bone
    dPlate.classList.toggle('plate--trim', plate.matches('.plate--trim, .plate--close'));
    dPlate.classList.toggle('plate--object', plate.matches('.plate--object'));
    dCaption.textContent = plate.closest('figure').querySelector('figcaption')?.textContent || img.alt;
    plate.style.viewTransitionName = 'detail-plate';
    swap(() => {
      plate.style.viewTransitionName = '';
      dPlate.style.viewTransitionName = 'detail-plate';
      dialog.showModal();
    }, 'opening');
  };

  const close = () => {
    if (!dialog.open) return;
    const back = source;
    swap(() => {
      dPlate.style.viewTransitionName = '';
      if (back) back.style.viewTransitionName = 'detail-plate';
      dialog.close();
    }, 'closing').then(() => { if (back) back.style.viewTransitionName = ''; });
  };

  plates.forEach((plate) => {
    const img = plate.querySelector('img');
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'detail-trigger';
    trigger.setAttribute('aria-label', `Enlarge: ${img.alt}`);
    plate.replaceWith(trigger);
    trigger.append(plate);
    trigger.addEventListener('click', () => open(plate));
  });

  dialog.querySelector('.detail__close').addEventListener('click', close);
  // Escape: take over the native close so it runs through the same transition
  dialog.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
  // a click on the dark ground around the picture closes it too
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
})();
