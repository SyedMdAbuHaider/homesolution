/**
 * reviews.js — loads data/reviews.json and renders review screenshots.
 * Each review is shown as a screenshot thumbnail (no names/personal
 * details rendered). Clicking a thumbnail opens a full-size lightbox
 * with previous/next navigation to browse all screenshots.
 *
 * To add a review: append { "image": "assets/reviews/reviewX.webp",
 * "rating": 5 } to data/reviews.json and drop the image in
 * assets/reviews/. "rating" is optional. No HTML edits required.
 */
(function () {
  let REVIEWS = [];
  let lightboxIndex = 0;
  let backdrop, imgEl, counterEl, prevBtn, nextBtn;

  const root = document.getElementById('reviews-grid');
  if (!root) return;

  const star = '<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.1 6.6 7.2.9-5.3 5 1.4 7.1L12 18.3 5.6 21.6 7 14.5 1.7 9.5l7.2-.9L12 2Z"/></svg>';

  function altText(lang) {
    return lang === 'bn' ? 'গ্রাহক রিভিউ স্ক্রিনশট' : 'Customer review screenshot';
  }

  // ---------- Screenshot grid ----------
  function render(lang) {
    if (!root) return;
    if (!REVIEWS.length) return;

    const viewText = lang === 'bn' ? 'বড় করে দেখুন' : 'View Screenshot';
    const alt = altText(lang);

    root.innerHTML = REVIEWS.map((r, i) => `
      <button type="button" class="review-thumb fade-up in-view card-hover group relative block w-full overflow-hidden rounded-3xl shadow-soft border border-black/5 dark:border-white/5 bg-surface dark:bg-[#0E1A17]" style="--i:${i}" data-index="${i}" aria-label="${viewText}">
        <img src="${r.image}" alt="${alt}" loading="lazy" class="review-thumb-img w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105">
        ${r.rating ? `<span class="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-ink/70 backdrop-blur px-2.5 py-1 text-accent">${star.repeat(r.rating)}</span>` : ''}
        <span class="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 via-black/0 to-transparent pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span class="rounded-xl bg-white/95 px-4 py-2 text-[12.5px] font-semibold text-ink">${viewText}</span>
        </span>
      </button>
    `).join('');

    // If a screenshot fails to load, swap it for a neutral placeholder
    // instead of leaving a broken-image glyph.
    root.querySelectorAll('.review-thumb-img').forEach(img => {
      img.addEventListener('error', () => {
        img.closest('.review-thumb')?.classList.add('review-thumb-broken');
      }, { once: true });
    });

    root.querySelectorAll('.review-thumb').forEach(btn => {
      btn.addEventListener('click', () => openLightbox(parseInt(btn.dataset.index, 10)));
    });

    // Keep an already-open lightbox in sync with the current language
    if (backdrop && backdrop.classList.contains('open')) showSlide(lightboxIndex);
  }

  // ---------- Lightbox ----------
  function buildLightbox() {
    backdrop = document.createElement('div');
    backdrop.className = 'review-lightbox-backdrop';
    backdrop.id = 'review-lightbox-backdrop';
    backdrop.innerHTML = `
      <button type="button" class="review-lightbox-nav prev" id="review-lightbox-prev" aria-label="Previous review">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="review-lightbox" role="dialog" aria-modal="true" aria-label="Review screenshot">
        <button type="button" class="review-lightbox-close" id="review-lightbox-close" aria-label="Close">
          <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18" stroke-linecap="round"/></svg>
        </button>
        <img id="review-lightbox-img" src="" alt="">
        <div class="review-lightbox-counter" id="review-lightbox-counter"></div>
      </div>
      <button type="button" class="review-lightbox-nav next" id="review-lightbox-next" aria-label="Next review">
        <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    `;
    document.body.appendChild(backdrop);

    imgEl = backdrop.querySelector('#review-lightbox-img');
    counterEl = backdrop.querySelector('#review-lightbox-counter');
    prevBtn = backdrop.querySelector('#review-lightbox-prev');
    nextBtn = backdrop.querySelector('#review-lightbox-next');

    backdrop.querySelector('#review-lightbox-close').addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeLightbox(); });
    prevBtn.addEventListener('click', () => step(-1));
    nextBtn.addEventListener('click', () => step(1));

    document.addEventListener('keydown', (e) => {
      if (!backdrop.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  function showSlide(index) {
    lightboxIndex = (index + REVIEWS.length) % REVIEWS.length;
    const r = REVIEWS[lightboxIndex];
    imgEl.src = r.image;
    imgEl.alt = altText(window.APP.lang);
    counterEl.textContent = `${lightboxIndex + 1} / ${REVIEWS.length}`;

    const multiple = REVIEWS.length > 1;
    prevBtn.style.display = multiple ? '' : 'none';
    nextBtn.style.display = multiple ? '' : 'none';
    counterEl.style.display = multiple ? '' : 'none';
  }

  function step(dir) { showSlide(lightboxIndex + dir); }

  function openLightbox(index) {
    if (!backdrop) buildLightbox();
    showSlide(index);
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!backdrop) return;
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  async function loadReviews() {
    try {
      const res = await fetch('data/reviews.json');
      REVIEWS = await res.json();
      render(window.APP.lang);
    } catch (err) {
      console.error('Failed to load reviews.json', err);
    }
  }

  window.APP.registerRenderer(render);
  loadReviews();
})();
