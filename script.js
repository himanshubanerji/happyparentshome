// Donation widget: frequency + amount drive the impact note and CTA label.
const AMOUNTS = [
  { v: '₹500', text: 'helps put fresh, soft, home-cooked meals on a resident’s plate.' },
  { v: '₹1,000', text: 'helps buy medicines and nursing supplies for a resident.' },
  { v: '₹2,500', text: 'helps pay for physiotherapy that keeps a resident moving.' },
  { v: '₹5,000', text: 'goes towards a month of care for an elder who cannot afford it.' }
];

const state = { freq: 0, amt: 1 };

function renderWidget() {
  const monthly = state.freq === 1;
  const d = AMOUNTS[state.amt];
  document.querySelectorAll('[data-freq]').forEach(b => {
    b.setAttribute('aria-selected', String(Number(b.dataset.freq) === state.freq));
  });
  document.querySelectorAll('[data-amt]').forEach(b => {
    b.setAttribute('aria-pressed', String(Number(b.dataset.amt) === state.amt));
  });
  document.getElementById('impact-lead').textContent = d.v + (monthly ? ' every month' : '');
  document.getElementById('impact-text').textContent = d.text;
  document.getElementById('cta-label').textContent = 'Donate ' + d.v + (monthly ? ' monthly' : '');
}

document.addEventListener('click', e => {
  const freq = e.target.closest('[data-freq]');
  if (freq) { state.freq = Number(freq.dataset.freq); renderWidget(); return; }

  const amt = e.target.closest('[data-amt]');
  if (amt) { state.amt = Number(amt.dataset.amt); renderWidget(); return; }

  // Copy account no. / IFSC; label reads "Copied" for 1.6s.
  const copy = e.target.closest('[data-copy]');
  if (copy) {
    try { navigator.clipboard && navigator.clipboard.writeText(copy.dataset.copy); } catch (err) {}
    document.querySelectorAll('[data-copy]').forEach(b => { b.textContent = 'Copy'; });
    copy.textContent = 'Copied';
    clearTimeout(copy._t);
    copy._t = setTimeout(() => { copy.textContent = 'Copy'; }, 1600);
  }
});

// Reviews carousel (mobile/tablet): highlight the dot for the card nearest the left edge.
const reviews = document.querySelector('.reviews');
const dots = document.querySelectorAll('.review-dots span');
if (reviews && dots.length) {
  let raf = 0;
  reviews.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const cards = reviews.children;
      const atEnd = reviews.scrollLeft + reviews.clientWidth >= reviews.scrollWidth - 4;
      let idx = atEnd ? cards.length - 1 : 0;
      if (!atEnd) {
        let best = Infinity;
        for (let i = 0; i < cards.length; i++) {
          const d = Math.abs(cards[i].offsetLeft - reviews.offsetLeft - reviews.scrollLeft);
          if (d < best) { best = d; idx = i; }
        }
      }
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    });
  }, { passive: true });
}

// Map: load the Google embed on tap for phones/tablets, straight away on desktop.
const mapFrame = document.querySelector('.map-frame');
function loadMap() {
  if (!mapFrame || mapFrame.classList.contains('loaded')) return;
  const iframe = document.createElement('iframe');
  iframe.title = 'Map: Happy Parents Home, Indira Nagar, Lucknow';
  iframe.src = mapFrame.dataset.src;
  iframe.loading = 'lazy';
  mapFrame.replaceChildren(iframe);
  mapFrame.classList.add('loaded');
}
if (mapFrame) {
  mapFrame.querySelector('.map-load').addEventListener('click', loadMap);
  const desktop = window.matchMedia('(min-width: 1024px)');
  if (desktop.matches) loadMap();
  desktop.addEventListener('change', e => { if (e.matches) loadMap(); });
}
