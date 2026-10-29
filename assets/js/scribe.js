// The Museum of Lost Futures — the Ilvarn scribe.
// A visitor gives a word; each letter is pressed as a stamped sign built from a
// small set of strokes, and the word is set in its lone and paired Ilvarn forms.
// Deterministic: the same word always gives the same signs and the same reading.
(() => {
  const form = document.getElementById('scribe-form');
  if (!form) return;

  const input = document.getElementById('scribe-input');
  const stamps = document.getElementById('scribe-stamps');
  const alone = document.getElementById('scribe-alone');
  const paired = document.getElementById('scribe-paired');
  const note = document.getElementById('scribe-note');
  const result = document.getElementById('scribe-result');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';

  const hash = (str) => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  };

  const syllables = ['ve', 'lo', 'sa', 'an', 'ir', 'ne', 'th', 'ar', 'mi', 'os', 'ke', 'ul', 'en', 'ra', 'si', 'te', 'da', 'il', 'ma', 'or', 'he', 'va', 'na', 'es', 'ri', 'ko'];
  const endings = [
    ['tenu', 'the two of us, by the water'],
    ['amar', 'you and I, this morning'],
    ['iskel', 'the two of us, though apart'],
    ['oreth', 'you, from me, for keeping'],
    ['nala', 'the two of us, again'],
    ['veyn', 'you and I, at the door'],
  ];

  // Each sign is a few strokes chosen from these, drawn inside a 40 × 56 cell.
  const strokes = [
    'M20 8 V48', 'M8 28 H32', 'M10 12 L30 44', 'M30 12 L10 44',
    'M8 46 Q20 30 32 46', 'M8 12 Q20 26 32 12', 'M12 20 H28 M12 36 H28',
    'M14 8 V22 M26 8 V22', 'M14 34 V48 M26 34 V48', 'M20 8 L32 28 L20 48 L8 28 Z',
  ];

  const sign = (ch, i) => {
    const h = hash(ch + ':' + (ch.charCodeAt(0) * 7));
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 40 56');
    svg.setAttribute('class', 'scribe__sign');
    svg.style.setProperty('--i', i);
    const count = 2 + (h % 2);
    for (let k = 0; k < count; k++) {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', strokes[(h >>> (k * 4)) % strokes.length]);
      svg.appendChild(p);
    }
    if (h & 0x10000) {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', 20); c.setAttribute('cy', h & 0x20000 ? 14 : 42); c.setAttribute('r', 3.5);
      c.setAttribute('class', 'scribe__dot');
      svg.appendChild(c);
    }
    return svg;
  };

  const render = (raw) => {
    const word = raw.trim().toLowerCase().replace(/[^a-zà-ÿ]/g, '');
    if (!word) return;
    const h = hash(word);
    const lone = [...word].slice(0, 4).map((c) => syllables[(c.charCodeAt(0) + word.length) % syllables.length]).join('');
    const [ending, meaning] = endings[h % endings.length];

    stamps.replaceChildren(...[...word].map(sign));
    stamps.setAttribute('aria-label', `The word ${word} stamped in reconstructed Ilvarn signs`);
    alone.textContent = lone;
    paired.textContent = `${lone}-${ending}`;
    note.textContent = `The paired ending -${ending} means ${meaning}.`;

    if (!reduceMotion) {
      result.classList.remove('is-stamped');
      void result.offsetWidth;
      result.classList.add('is-stamped');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    render(input.value);
  });
  render(input.value);
})();
