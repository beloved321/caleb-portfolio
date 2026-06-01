/* ── LIGHTBOX ── */
(function () {
  /* Build overlay HTML */
  const overlay = document.createElement('div');
  overlay.id = 'lb-overlay';
  overlay.innerHTML = `
    <button id="lb-close" aria-label="Close">✕</button>
    <button id="lb-prev" aria-label="Previous">&#8592;</button>
    <div id="lb-img-wrap">
      <img id="lb-img" src="" alt="" />
    </div>
    <button id="lb-next" aria-label="Next">&#8594;</button>
    <div id="lb-counter"></div>
  `;
  document.body.appendChild(overlay);

  /* Styles injected via JS so the single file works everywhere */
  const style = document.createElement('style');
  style.textContent = `
    #lb-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.92);
      z-index: 9999;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 24px;
      box-sizing: border-box;
    }
    #lb-overlay.active { display: flex; }

    #lb-img-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: calc(100vw - 160px);
      max-height: calc(100vh - 80px);
      overflow: hidden;
    }

    #lb-img {
      max-width: 100%;
      max-height: calc(100vh - 80px);
      width: auto;
      height: auto;
      border-radius: 8px;
      object-fit: contain;
      display: block;
      user-select: none;
    }

    #lb-close {
      position: fixed;
      top: 20px;
      right: 24px;
      background: rgba(255,255,255,0.1);
      border: none;
      color: #fff;
      font-size: 18px;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      z-index: 10000;
    }
    #lb-close:hover { background: rgba(255,255,255,0.2); }

    #lb-prev, #lb-next {
      background: rgba(255,255,255,0.1);
      border: none;
      color: #fff;
      font-size: 22px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      cursor: pointer;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }
    #lb-prev:hover, #lb-next:hover { background: rgba(255,255,255,0.25); }
    #lb-prev:disabled, #lb-next:disabled { opacity: 0.2; cursor: default; }

    #lb-counter {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: rgba(255,255,255,0.5);
      font-size: 12px;
      font-family: 'Geist', sans-serif;
      letter-spacing: 0.08em;
    }

    .lb-trigger {
      cursor: zoom-in;
      transition: opacity 0.15s;
    }
    .lb-trigger:hover { opacity: 0.85; }

    @media (max-width: 600px) {
      #lb-prev, #lb-next { width: 38px; height: 38px; font-size: 18px; }
      #lb-img-wrap { max-width: calc(100vw - 100px); }
    }
  `;
  document.head.appendChild(style);

  /* Gather all images */
  let images = [];
  let current = 0;

  const lbImg = document.getElementById('lb-img');
  const lbPrev = document.getElementById('lb-prev');
  const lbNext = document.getElementById('lb-next');
  const lbClose = document.getElementById('lb-close');
  const lbCounter = document.getElementById('lb-counter');

  function openLightbox(index) {
    current = index;
    update();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function update() {
    const item = images[current];
    lbImg.src = item.src;
    lbImg.alt = item.alt || '';
    lbPrev.disabled = current === 0;
    lbNext.disabled = current === images.length - 1;
    lbCounter.textContent = `${current + 1} / ${images.length}`;
  }

  function prev() { if (current > 0) { current--; update(); } }
  function next() { if (current < images.length - 1) { current++; update(); } }

  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  lbClose.addEventListener('click', closeLightbox);

  /* Click outside image to close */
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay || e.target.id === 'lb-img-wrap') closeLightbox();
  });

  /* Keyboard navigation */
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') closeLightbox();
  });

  /* Init — find all .screen-img img elements */
  function init() {
    const imgs = document.querySelectorAll('.screen-img img');
    images = Array.from(imgs).map(img => ({
      src: img.src,
      alt: img.alt
    }));

    imgs.forEach(function (img, index) {
      img.classList.add('lb-trigger');
      img.addEventListener('click', function () {
        openLightbox(index);
      });
    });
  }

  /* Run after DOM is ready */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
