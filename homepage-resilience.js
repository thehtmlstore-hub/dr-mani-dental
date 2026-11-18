function initPreloader() {
  const preloader = document.getElementById('pre');
  if (!preloader) return;
  const minimum = 600;
  const started = performance.now();
  let loaded = document.readyState === 'complete';
  let frameReady = false;
  let scheduled = false;
  function dismiss() {
    preloader.classList.add('done');
  }
  function dismissWhenReady() {
    if (!loaded || !frameReady || scheduled) return;
    scheduled = true;
    setTimeout(dismiss, Math.max(0, minimum - (performance.now() - started)));
  }
  setTimeout(dismiss, 2500);
  window.addEventListener('load', () => {
    loaded = true;
    dismissWhenReady();
  }, { once: true });
  document.addEventListener('clinic:hero-frame-ready', () => {
    frameReady = true;
    dismissWhenReady();
  }, { once: true });
}

function initReveals() {
  try {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    }, { threshold: .05, rootMargin: '120px 0px' });
    document.querySelectorAll('.rv').forEach(element => observer.observe(element));
  } catch (error) {
    console.error('[homepage:scroll-reveal]', error);
  }
}

module.exports = { initPreloader, initReveals };
