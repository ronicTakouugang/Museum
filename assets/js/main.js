// The Museum of Lost Futures — the Keeping's oracle.
// A visitor offers a word; the Keeping returns one of its kept fragments.
// Deterministic (the same word always surfaces the same fragment) and never
// a true match — the Keeping stopped being able to tell memories apart
// before anyone finished cataloguing it.
(() => {
  const form = document.getElementById('oracle-form');
  if (!form) return;

  const fragments = [
    { cond: 'intact', text: '…the smell of a kitchen that was never built, in a house that was never finished.' },
    { cond: 'partial', text: '…kept the sound of the door, not the voice that came through it.' },
    { cond: 'unreadable', text: '…three hundred hours of someone counting. Counting what is not recorded.' },
    { cond: 'intact', text: '…a hand on a railing, mid-century, on a bridge that does not appear on any surviving map.' },
    { cond: 'contested', text: '…a lullaby, or a complaint about the heat. The tonal archive could not decide.' },
    { cond: 'partial', text: '…the last ferry schedule, memorised by someone who never needed to leave.' },
    { cond: 'intact', text: '…the exact weight of a coat left on a chair for eleven years.' },
    { cond: 'unreadable', text: '…a name, repeated, in a voice the Keeping filed under "unclaimed."' },
    { cond: 'partial', text: '…rain on a roof that was dismantled for parts before the second winter.' },
    { cond: 'intact', text: '…the feeling of being forgiven, detached from whoever did the forgiving.' },
    { cond: 'contested', text: '…a recipe for bread, or a eulogy. The grammar survives; the occasion does not.' },
    { cond: 'partial', text: '…the moment a child learns a word for grief and uses it wrong, correctly.' },
    { cond: 'unreadable', text: '…something that was promised. The promise kept; the content did not.' },
    { cond: 'intact', text: '…the particular quiet of a city nine minutes after a festival ends.' },
    { cond: 'partial', text: '…a letter addressed to "whoever finds this still working."' },
    { cond: 'contested', text: '…an argument, softened with each retelling until it reads as a love letter.' },
    { cond: 'intact', text: '…the last thing anyone taught the Keeping on purpose, before it began teaching itself.' },
    { cond: 'unreadable', text: '…everything about one specific Tuesday, and nothing about why it mattered.' },
  ];

  const hash = (str) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    return Math.abs(h);
  };

  const input = document.getElementById('oracle-input');
  const result = document.getElementById('oracle-result');
  const catEl = document.getElementById('oracle-cat');
  const condEl = document.getElementById('oracle-cond');
  const textEl = document.getElementById('oracle-text');
  result.setAttribute('aria-live', 'polite');

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const word = (input.value || '').trim().toLowerCase();
    if (!word) return;
    const h = hash(word);
    const fragment = fragments[h % fragments.length];
    const catalogueNumber = `${100 + (h % 899)}–${String.fromCharCode(65 + (h % 26))}`;
    const wasOpen = !result.hidden;

    const fill = () => {
      catEl.textContent = `Fragment ${catalogueNumber}`;
      condEl.textContent = `Condition: ${fragment.cond}`;
      textEl.textContent = `"${word}" — ${fragment.text}`;
    };

    if (reduceMotion || !wasOpen) {
      result.hidden = false;
      fill();
      requestAnimationFrame(() => result.classList.add('is-in'));
    } else {
      // already open: a brief, blurred cross-fade bridges old and new text
      textEl.style.transition = 'filter 160ms ease, opacity 160ms ease';
      textEl.style.filter = 'blur(4px)';
      textEl.style.opacity = '0.5';
      setTimeout(() => {
        fill();
        textEl.style.filter = '';
        textEl.style.opacity = '';
      }, 160);
    }
  });
})();
