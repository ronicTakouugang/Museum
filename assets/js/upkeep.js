// The Museum of Lost Futures — the Wardens' ledger.
// A visitor moves through the years after the Leaving; each duty reads as kept,
// faltering (in its last twenty years) or stopped. The markup already holds the
// ledger at year 212, so the page reads the same without script.
(() => {
  const input = document.getElementById('upkeep-year');
  if (!input) return;

  const value = document.getElementById('upkeep-value');
  const summary = document.getElementById('upkeep-summary');
  const rows = [...document.querySelectorAll('#upkeep-ledger .ledger__row')];
  const words = ['None', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

  const render = () => {
    const year = Number(input.value);
    let kept = 0;
    value.textContent = year;
    for (const row of rows) {
      const fails = row.dataset.fails === 'none' ? Infinity : Number(row.dataset.fails);
      const state = row.querySelector('.ledger__state');
      let status;
      if (year >= fails) status = 'stopped';
      else if (fails - year <= 20) status = 'faltering';
      else status = 'kept';
      if (status !== 'stopped') kept++;
      row.dataset.state = status;
      state.textContent = status === 'stopped' ? `stopped in year ${fails}` : status;
    }
    summary.textContent = kept === rows.length
      ? 'Every duty still kept.'
      : `${words[kept]} of ${words[rows.length].toLowerCase()} duties still kept.`;
  };

  input.addEventListener('input', render);
  render();
})();

// the panorama settles from a slight zoom as it comes into view
(() => {
  const pano = document.querySelector('.panorama');
  if (!pano || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { pano.classList.add('is-near'); io.disconnect(); } }, { threshold: 0.2 });
  io.observe(pano);
})();
